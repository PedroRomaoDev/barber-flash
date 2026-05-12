import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join } from 'path';

const assetsDir = join('apps', 'mobile', 'assets');
mkdirSync(assetsDir, { recursive: true });

// Create a simple purple gradient background for all images
const createImage = (width, height, filename) => {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 124, g: 58, b: 237 }, // Purple color #7C3AED
    },
  })
    .png()
    .toFile(join(assetsDir, filename));
};

Promise.all([
  createImage(192, 192, 'icon.png'),
  createImage(512, 512, 'adaptive-icon.png'),
  createImage(1280, 720, 'splash.png'),
  createImage(192, 192, 'favicon.png'),
])
  .then(() => {
    console.log('✓ Assets generated successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('✗ Failed to generate assets:', err);
    process.exit(1);
  });
