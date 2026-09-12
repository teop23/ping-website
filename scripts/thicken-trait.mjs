import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse command-line arguments
let radius = 2;
let outDir = '.trait-work/stylefix';
let traitFilename = null;

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--radius') {
    radius = parseInt(args[i + 1], 10);
    i++;
  } else if (args[i] === '--out-dir') {
    outDir = args[i + 1];
    i++;
  } else if (!args[i].startsWith('--')) {
    traitFilename = args[i];
  }
}

if (!traitFilename) {
  console.error('Usage: node scripts/thicken-trait.mjs --radius N --out-dir DIR <trait-filename>');
  process.exit(1);
}

// Resolve paths
const inputPath = path.join(__dirname, '..', 'public', 'traits', traitFilename);
const outPath = path.join(outDir, traitFilename);

// Create output directory
fs.mkdirSync(outDir, { recursive: true });

// Process the trait PNG
async function thickenTrait() {
  try {
    // Read PNG with alpha channel
    const image = sharp(inputPath).ensureAlpha();
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;

    // Helper to get pixel RGBA at (x, y)
    const getPixel = (x, y) => {
      if (x < 0 || x >= width || y < 0 || y >= height) {
        return [0, 0, 0, 0];
      }
      const idx = (y * width + x) * 4;
      return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
    };

    // Build dark mask: pixel is dark if alpha > 128 AND (r+g+b)/3 < 100
    const darkMask = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const [r, g, b, a] = getPixel(x, y);
        const brightness = (r + g + b) / 3;
        if (a > 128 && brightness < 100) {
          darkMask[y * width + x] = 1;
        }
      }
    }

    // Dilate mask by radius using Chebyshev distance
    const dilatedMask = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let isDilated = 0;
        // Check if any pixel within Chebyshev distance N is dark in ORIGINAL mask
        for (let dy = -radius; dy <= radius && !isDilated; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (darkMask[ny * width + nx]) {
                isDilated = 1;
                break;
              }
            }
          }
        }
        dilatedMask[y * width + x] = isDilated;
      }
    }

    // Create output buffer, modifying dilated pixels that weren't already dark
    const outData = Buffer.from(data);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        // If pixel is in dilated mask but was NOT already dark, set to black+opaque
        if (dilatedMask[y * width + x] && !darkMask[y * width + x]) {
          outData[idx] = 0;      // r
          outData[idx + 1] = 0;  // g
          outData[idx + 2] = 0;  // b
          outData[idx + 3] = 255; // a
        }
      }
    }

    // Save the output PNG
    await sharp(outData, {
      raw: { width, height, channels: 4 }
    }).png().toFile(outPath);

    console.log(`thickened ${traitFilename} radius=${radius} -> ${outPath}`);
  } catch (error) {
    console.error('Error processing trait:', error.message);
    process.exit(1);
  }
}

thickenTrait();
