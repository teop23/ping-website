import { spawnSync } from 'child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { deflateSync } from 'zlib';
import { afterEach, describe, expect, it } from 'vitest';

/**
 * The generator is the only thing standing between a malformed PNG and a
 * silently broken layer in the builder and the image API, so its rejections
 * are worth testing directly.
 */

const TRAITS_DIR = 'public/traits';
const planted = [];

/** Minimal valid PNG at a chosen size. Enough for the IHDR the generator reads. */
const png = (width, height) => {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc32 = (buf) => {
    let c = 0xffffffff;
    for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.alloc((width * 4 + 1) * height))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

const plant = (name, width, height) => {
  const file = `${TRAITS_DIR}/${name}`;
  writeFileSync(file, png(width, height));
  planted.push(file);
};

const run = () => {
  const result = spawnSync('node', ['scripts/generate-index.mjs'], { encoding: 'utf8' });
  return { code: result.status ?? 1, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
};

afterEach(() => {
  planted.splice(0).forEach((f) => rmSync(f, { force: true }));
  run(); // leave the committed manifest consistent with the real library
});

describe('trait manifest generation', () => {
  it('succeeds on the real library and emits both files', () => {
    const { code } = run();
    expect(code).toBe(0);
    expect(existsSync('public/traits-index.json')).toBe(true);
    expect(existsSync('public/traits-manifest.json')).toBe(true);
  });

  it('describes every trait with the fields the app relies on', () => {
    run();
    const manifest = JSON.parse(readFileSync('public/traits-manifest.json', 'utf8'));
    expect(manifest.traits.length).toBeGreaterThan(0);
    for (const trait of manifest.traits) {
      expect(trait).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        label: expect.any(String),
        category: expect.any(String),
        file: expect.stringMatching(/^\/traits\/.+\.png$/),
        width: expect.any(Number),
        height: expect.any(Number),
      });
      expect(trait.width).toBe(trait.height);
    }
  });

  it('keeps the legacy index in step with the manifest', () => {
    run();
    const index = JSON.parse(readFileSync('public/traits-index.json', 'utf8'));
    const manifest = JSON.parse(readFileSync('public/traits-manifest.json', 'utf8'));
    const indexed = Object.values(index).flat().length;
    expect(indexed).toBe(manifest.traits.length);
  });

  it('paints body and face before head', () => {
    run();
    const { renderOrder } = JSON.parse(readFileSync('public/traits-manifest.json', 'utf8'));
    expect(renderOrder.indexOf('body')).toBeLessThan(renderOrder.indexOf('head'));
    expect(renderOrder.indexOf('face')).toBeLessThan(renderOrder.indexOf('head'));
  });

  it('rejects a non-square trait', () => {
    plant('trait-test-oblong_head.png', 400, 200);
    const { code, output } = run();
    expect(code).toBe(1);
    expect(output).toContain('must be square');
  });

  it('rejects a filename that breaks the convention', () => {
    plant('trait-testbadname.png', 600, 600);
    const { code, output } = run();
    expect(code).toBe(1);
    expect(output).toMatch(/does not match|category is unknown/);
  });

  it('rejects an unknown category', () => {
    plant('trait-test-thing_elbow.png', 600, 600);
    const { code, output } = run();
    expect(code).toBe(1);
    expect(output).toMatch(/does not match|category is unknown/);
  });

  it('warns about an undersized trait without failing', () => {
    plant('trait-test-tiny_head.png', 128, 128);
    const { code, output } = run();
    expect(code).toBe(0);
    expect(output).toContain('below the');
  });
});
