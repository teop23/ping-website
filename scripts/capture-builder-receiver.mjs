import { createServer } from 'http';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * Half of the "capture every trait from the real builder" audit. This is a
 * tiny CORS receiver; the other half is a snippet run in the browser's
 * console on the running site (npm run dev, scroll to the builder):
 *
 *   window.__cap = async (from, to) => {
 *     const cards = [...document.querySelectorAll('img[alt]')].filter(i => i.closest('.cursor-pointer'));
 *     const c = document.querySelector('canvas'), bare = c.toDataURL('image/png'); let n = 0;
 *     const tick = () => new Promise(r => { const m = new MessageChannel(); m.port1.onmessage = r; m.port2.postMessage(0); });
 *     const until = async (ok, ms) => { const t = Date.now(); while (!ok() && Date.now() - t < ms) await tick(); };
 *     for (let i = from; i < Math.min(to, cards.length); i++) {
 *       const img = cards[i]; const name = img.getAttribute('src').match(/trait-(.+)\.png/)[1];
 *       const el = img.closest('.cursor-pointer'); el.click();
 *       await until(() => c.toDataURL('image/png') !== bare, 15000);   // trait actually drawn
 *       const t = Date.now(); await until(() => Date.now() - t > 800, 800); // let it settle
 *       await fetch('http://localhost:9911', { method: 'POST', body: JSON.stringify({ name, dataUrl: c.toDataURL('image/png') }) });
 *       el.click(); await until(() => c.toDataURL('image/png') === bare, 15000); n++;
 *     } return n;
 *   };
 *   window.__cap(0, 238);   // don't await from a tool with a timeout
 *
 * It clicks each trait card in the "All" grid, waits until the canvas
 * actually differs from the bare base, posts the canvas PNG here, and
 * un-clicks. The first version waited a fixed 500ms instead; the builder
 * loads each trait image asynchronously, so some captures were the bare
 * base (skull-tattoo shipped in the 2026-09-10 audit as "renders nothing"
 * and the art was fine). MessageChannel ticks instead of setTimeout because
 * timers in a hidden tab are throttled to one per several seconds or worse,
 * which also made the fixed wait unreliable. GET / returns the count so
 * progress can be polled. A foreground tab is still faster.
 *
 * Port: PORT env var, default 9911. A stray receiver from an older session
 * (a different receiver.mjs, writing elsewhere) has been seen holding 9911;
 * if nothing lands in .trait-audit, check that before debugging the page.
 *
 * Output: .trait-audit/<name>.png, one per trait, at the builder's own
 * canvas size (599px at a 1600px-wide window). Tile with
 * scripts/contact-sheet.mjs is NOT right for these (they are already
 * composited); use any image tiler, e.g. sharp in a one-liner.
 */
const DIR = '.trait-audit/';
const PORT = Number(process.env.PORT) || 9911;
mkdirSync(DIR, { recursive: true });
let count = 0;
createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') { res.end(); return; }
  if (req.method === 'GET') { res.end(String(count)); return; }
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    try {
      const { name, dataUrl } = JSON.parse(body);
      const safe = name.replace(/[^A-Za-z0-9_().-]/g, '_');
      writeFileSync(DIR + safe + '.png', Buffer.from(dataUrl.split(',')[1], 'base64'));
      count++;
      res.end('ok');
    } catch (e) { res.statusCode = 400; res.end(String(e)); }
  });
}).listen(PORT, () => console.log(`receiver on ${PORT} ->`, DIR));
