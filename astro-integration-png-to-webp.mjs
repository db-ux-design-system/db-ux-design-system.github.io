import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export default function pngToWebpIntegration() {
  return {
    name: 'astro-integration-png-to-webp',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distDir = dir.pathname.replace(/^\/([a-zA-Z]):/, '$1:');
        const pngFiles = await findPngFiles(distDir);

        await Promise.all(
          pngFiles.map(async (pngPath) => {
            const webpPath = pngPath.replace(/\.png$/i, '.webp');
            const image = sharp(pngPath);
            const metadata = await image.metadata();
            const hasAlpha = metadata.channels === 4 || metadata.channels === 2;

            await image
              .resize(512, 512, { fit: 'outside', withoutEnlargement: true })
              .webp({ quality: 50, alphaQuality: hasAlpha ? 50 : undefined })
              .toFile(webpPath);
            await fs.unlink(pngPath);
          })
        );

        await updateReferences(distDir);
      }
    }
  };
}

async function updateReferences(dir) {
  const files = await findFiles(dir, ['.html', '.css', '.js']);

  await Promise.all(
    files.map(async (filePath) => {
      let content = await fs.readFile(filePath, 'utf-8');
      content = content.replace(/\.png/g, '.webp');
      await fs.writeFile(filePath, content, 'utf-8');
    })
  );
}

async function findFiles(dir, extensions) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findFiles(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.toLowerCase().endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

async function findPngFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findPngFiles(fullPath));
    } else if (entry.name.toLowerCase().endsWith('.png')) {
      files.push(fullPath);
    }
  }

  return files;
}
