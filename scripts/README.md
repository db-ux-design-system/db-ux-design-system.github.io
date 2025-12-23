# Image Optimization Scripts

## optimize-images.mjs

This script automatically converts all PNG, JPG, and JPEG images in the `static/` directory to modern WebP and AVIF formats for better performance.

### Usage

The script runs automatically as part of the build process:

```bash
npm run build
```

To run it manually:

```bash
node scripts/optimize-images.mjs
```

### What it does

- Scans the entire `static/` directory recursively
- Converts each PNG/JPG/JPEG image to:
  - WebP format (80% quality)
  - AVIF format (75% quality)
- Preserves original images as fallback
- Generated files are placed alongside originals with `.webp` and `.avif` extensions

### Image Optimization Results

Modern formats provide significant file size reductions:

- **WebP**: Typically 30-50% smaller than PNG/JPEG
- **AVIF**: Often 40-50% smaller than PNG/JPEG with better quality

### Browser Support

The `OptimizedImage` component uses the `<picture>` element with multiple sources to ensure broad browser support:

1. Browsers try AVIF first (best compression)
2. Fall back to WebP (good compression, wide support)
3. Fall back to original PNG/JPG (universal support)

### Generated Files

Generated `.webp` and `.avif` files are gitignored and regenerated at build time to keep the repository clean.
