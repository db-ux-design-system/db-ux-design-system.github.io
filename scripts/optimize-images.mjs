#!/usr/bin/env node

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, relative, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticDir = join(__dirname, '../static');

// Image formats to convert (skip if already webp/avif)
const CONVERT_FORMATS = ['.png', '.jpg', '.jpeg'];

// Quality settings
const QUALITY = { webp: 80, avif: 75 };

async function* walkDir(dir) {
  const files = await readdir(dir);
  for (const file of files) {
    const path = join(dir, file);
    const stats = await stat(path);
    if (stats.isDirectory()) {
      yield* walkDir(path);
    } else {
      yield path;
    }
  }
}

async function convertImage(sourcePath) {
  const ext = extname(sourcePath).toLowerCase();
  
  if (!CONVERT_FORMATS.includes(ext)) {
    return;
  }

  const dir = dirname(sourcePath);
  const base = basename(sourcePath, ext);
  
  const webpPath = join(dir, `${base}.webp`);
  const avifPath = join(dir, `${base}.avif`);

  try {
    // Convert to WebP
    await sharp(sourcePath)
      .webp({ quality: QUALITY.webp })
      .toFile(webpPath);
    
    console.log(`✓ Created ${relative(staticDir, webpPath)}`);

    // Convert to AVIF
    await sharp(sourcePath)
      .avif({ quality: QUALITY.avif })
      .toFile(avifPath);
    
    console.log(`✓ Created ${relative(staticDir, avifPath)}`);
  } catch (error) {
    console.error(`✗ Failed to convert ${relative(staticDir, sourcePath)}:`, error.message);
  }
}

async function main() {
  console.log('🖼️  Converting images to WebP and AVIF...\n');
  
  let count = 0;
  for await (const file of walkDir(staticDir)) {
    if (CONVERT_FORMATS.includes(extname(file).toLowerCase())) {
      await convertImage(file);
      count++;
    }
  }
  
  console.log(`\n✅ Processed ${count} images`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
