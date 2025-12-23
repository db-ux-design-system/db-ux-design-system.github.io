# OptimizedImage Component

The `OptimizedImage` component automatically serves images in modern formats (AVIF and WebP) with fallback to original formats for maximum browser compatibility.

## Features

- ✅ Automatic AVIF format serving (best compression)
- ✅ Automatic WebP format serving (excellent compression)
- ✅ PNG/JPG fallback for older browsers
- ✅ Uses `<picture>` element for progressive enhancement
- ✅ Lazy loading by default
- ✅ Async decoding for better performance

## Usage

```astro
---
import OptimizedImage from '@components/OptimizedImage/OptimizedImage.astro';
---

<OptimizedImage src="/one-platform/assets/my-image.png" alt="Description of image" loading="lazy" />
```

## Props

| Prop       | Type                          | Default   | Description                           |
| ---------- | ----------------------------- | --------- | ------------------------------------- |
| `src`      | `string`                      | Required  | Path to the image (PNG, JPG, or JPEG) |
| `alt`      | `string`                      | Required  | Alt text for accessibility            |
| `class`    | `string`                      | -         | CSS class name(s)                     |
| `loading`  | `'lazy' \| 'eager'`           | `'lazy'`  | Loading strategy                      |
| `decoding` | `'async' \| 'sync' \| 'auto'` | `'async'` | Decoding hint                         |
| `width`    | `number`                      | -         | Width attribute                       |
| `height`   | `number`                      | -         | Height attribute                      |
| `data-*`   | `any`                         | -         | Data attributes pass through          |

## How It Works

The component automatically:

1. Detects the image path and generates WebP and AVIF paths
2. Creates a `<picture>` element with multiple `<source>` elements
3. Browsers automatically select the best supported format

### Generated HTML Example

```html
<picture>
  <source type="image/avif" srcset="/one-platform/assets/my-image.avif" />
  <source type="image/webp" srcset="/one-platform/assets/my-image.webp" />
  <img src="/one-platform/assets/my-image.png" alt="Description" loading="lazy" />
</picture>
```

## Performance Benefits

Using `OptimizedImage` provides:

- **30-55% smaller file sizes** compared to PNG/JPEG
- **Faster page loads** due to reduced bandwidth
- **Better Core Web Vitals** scores (LCP improvements)
- **Automatic format selection** - no manual work needed

## Notes

- Original PNG/JPG/JPEG files are kept as fallbacks
- WebP and AVIF versions are generated automatically at build time
- The component works seamlessly with existing `img` tag features
- All standard HTML `img` attributes are supported
