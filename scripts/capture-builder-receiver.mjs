import { createServer } from 'http';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * Half of the "capture every trait from the real builder" audit. This is a
 * tiny CORS receiver; the other half is a snippet run in the browser's
 * console on the running site (npm run dev, scroll to the builder):
 *
 *   window.__cap = async (from, to) => {
 *     const cards = [...document.querySelectorAll('img[alt]')].filter(i => i.closest('.cursor-pointer'));
 *     const c = document.querySelector('canvas'); let n = 0;
 *     for (let i = from; i < Math.min(to, cards.length); i++) {
 *       const img = cards[i]; const name = img.getAttribute('src').match(/trait-(.+)\.png/)[1];
 *       const el = img.closest('.cursor-pointer'); el.click();
 *       await new Promise(r => setTimeout(r, 500));
 *       await fetch('http://localhost:9911', { method: 'POST', body: JSON.stringify({ name, dataUrl: c.toDataURL('image/png') }) });
 *       el.click(); await new Promise(r => setTimeout(r, 150)); n++;
 *     } return n;
 *   };
 *   window.__cap(0, 239);   // don't await from a tool with a timeout
 *
 * It clicks each trait card in the "All" grid, waits for the canvas to
 * redraw, posts the canvas PNG here, and un-clicks. GET / returns the count
 * so progress can be polled. The tab must be in the FOREGROUND: a hidden
 * tab throttles timers and the loop crawls at ~1 capture per 10s.
 *
 * Output: .trait-audit/<name>.png, one per trait, at the builder's own
 * canvas size (599px at a 1600px-wide window). Tile with
 * scripts/contact-sheet.mjs is NOT right for these (they are already
 * composited); use any image tiler, e.g. sharp in a one-liner.
 */
const DIR = '.trait-audit/';
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
}).listen(9911, () => console.log('receiver on 9911 ->', DIR));
