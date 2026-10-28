# Visuals

Internal library for illustrative visuals on documentation pages (MDX) and page components (`.astro`). The `Visual` component supports two sources:

| Source                        | Prop    | Rendered as                | Tokens and stroke             |
| ----------------------------- | ------- | -------------------------- | ----------------------------- |
| `template/visuals/*.svg`      | `name`  | inline `<svg>`             | follow DB UX tokens and modes |
| `static/assets/teasers/*.png` | `image` | `<img>` to the static file | none – the file as it is      |

The SVGs are inlined at build time, so colors and stroke width follow DB UX tokens and Light/Dark Mode. The PNGs are raster images and have to work in both color modes on their own, see [Raster visuals](#raster-visuals).

## Folder layout

| Path                                  | Content                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| `template/visuals/*.svg`              | SVG sources, one file per visual                                               |
| `template/visuals/index.ts`           | Typed SVG registry – generated, do not edit                                    |
| `static/assets/teasers/*.png`         | Raster sources, one file per visual                                            |
| `template/visuals/images.ts`          | Typed raster registry – generated, do not edit                                 |
| `template/components/Visual/`         | `Visual.astro`, `Visual.css`, helpers in `visual-svg.ts` and `visual-image.ts` |
| `scripts/visuals/svgo.config.ts`      | SVGO 4.1.0 config incl. the `normalizeVisual` plugin                           |
| `scripts/visuals/optimize-visuals.ts` | Normalize, optimize and regenerate both registries                             |

## Adding a visual

1. Prepare the frame in Figma:
   - Keep strokes as strokes – don't use "Outline stroke" or flatten stroked layers, otherwise the stroke width can't be changed
   - Use one stroke width per visual
   - Corners are always sharp: no round/bevel joins and no round caps. The normalizer removes `stroke-linejoin` and every `stroke-linecap` except `square`, so the SVG defaults apply (miter joins, butt caps)
   - Square caps (`stroke-linecap="square"`) are allowed and kept
   - To flatten a very sharp corner on purpose, set `stroke-miterlimit` on that element (e.g. `2` on the triangle in `components`). The value is kept
   - Use at most two stroke colors: a primary color and an accent color
   - Use fills only for surfaces or small solid details
   - No text layers, no raster images
2. Export the frame as SVG and save it as `template/visuals/<name>.svg`. Use kebab-case, e.g. `product-management.svg`.
3. Run `pnpm run optimize:visuals`.
4. Commit the normalized SVG and the regenerated `index.ts`.

## What the normalizer changes

`pnpm run optimize:visuals` runs SVGO with `scripts/visuals/svgo.config.ts`. It keeps the `viewBox`, removes root `width`/`height`, `<title>`, `<desc>`, every `stroke-width`, every `stroke-linejoin` and every `stroke-linecap` except `square` (as attribute or inside `style`), and maps hard colors to `currentColor` plus a class:

| Source                              | Result                                   | Controlled by                         |
| ----------------------------------- | ---------------------------------------- | ------------------------------------- |
| Most frequent stroke color          | `stroke="currentColor"` + `v-stroke`     | `--visual-stroke`                     |
| Every other stroke color            | `stroke="currentColor"` + `v-accent`     | `--visual-accent`                     |
| Fill in the primary stroke color    | `fill="currentColor"` + `v-solid`        | `--visual-stroke`                     |
| Fill in an accent stroke color      | `fill="currentColor"` + `v-accent-solid` | `--visual-accent`                     |
| Any other fill (surface)            | `fill="none"` + `v-fill`                 | `--visual-fill` (off by default)      |
| `stroke-width`                      | removed                                  | `--visual-stroke-width` (default `2`) |
| `stroke-linejoin`, `stroke-linecap` | removed                                  | SVG defaults: `miter`, `butt`         |
| `stroke-linecap="square"`           | kept                                     | the attribute on the element          |
| `stroke-miterlimit`                 | kept                                     | the attribute on the element          |

Colors inside `<clipPath>` and `<mask>` stay unchanged, they only define geometry. Gradients and `url(#…)` references are kept. The script warns if a source contains more than one stroke width. Running it twice changes nothing.

The script aborts with an error naming the file if:

- the root `<svg>` has a hard `fill` or `stroke`. The component keeps only `fill` on the root and can't map root colors to the classes. Set the colors on the shapes and keep the root at `fill="none"`
- a source has hard fills but no stroke color, typically after "Outline stroke" in Figma. Every fill would become a switched-off surface and the visual would render empty. Don't outline strokes, export them as strokes
- two file names map to the same registry identifier, e.g. `icon-2.svg` and `icon2.svg` (`visualIcon2`)

## Usage

MDX:

```mdx
import Visual from '@template/components/Visual/Visual.astro';

<Visual name="foundation" size="3xl" />
<Visual name="development" stroke="neutral-emphasis-70" strokeWidth={1.5} />
<Visual name="patterns" size="3xl" strokeScaling="scale" strokeWidth={1} />
<Visual image="getting-started" size="3xl" />
```

Page component (`.astro`):

```astro
---
import { Visual } from '@components';
---

<Visual name="templates" stroke="brand" strokeWidth="2xs" width="50%" />
<Visual image="templates" width="50%" />
```

The component can't be used inside React (`.tsx`) components.

## Props

Set either `name` or `image`, never both. The stroke and color props apply to `name` only.

| Prop            | Type                  | Default        | Description                                                                                                                                                                            |
| --------------- | --------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`          | `VisualName`          | –              | SVG file name without `.svg`. Required unless `image` is set                                                                                                                           |
| `image`         | `VisualImageName`     | –              | PNG file name without `.png`, see [Raster visuals](#raster-visuals)                                                                                                                    |
| `stroke`        | `VisualColor`         | `currentColor` | Primary stroke color                                                                                                                                                                   |
| `accent`        | `VisualColor`         | `stroke`       | Accent strokes and details                                                                                                                                                             |
| `fill`          | `VisualColor`         | `none`         | Surfaces (`v-fill`)                                                                                                                                                                    |
| `strokeWidth`   | `VisualStrokeWidth`   | `2` / ratio    | Number, `3xs`–`3xl` or `var(--db-border-width-…)`. Screen px or viewBox units, see [Stroke scaling](#stroke-scaling). Default with `scale`: [proportional](#proportional-stroke-width) |
| `size`, `width` | `VisualSize`          | `100%`         | Inline size: `3xs`–`3xl` (`--db-sizing-*`), `var(--db-…)`, CSS length, `auto`                                                                                                          |
| `height`        | `VisualSize`          | `auto`         | Block size. With only `height` set, the width follows the viewBox                                                                                                                      |
| `label`         | `string`              | –              | Accessible name, makes the visual informative                                                                                                                                          |
| `strokeScaling` | `VisualStrokeScaling` | `fixed`        | `fixed`: constant stroke width, `scale`: stroke grows with the visual                                                                                                                  |
| `surface`       | `boolean`             | `false`        | Square light grey surface behind the visual. `size`/`width`/`height` and `class` then apply to the surface, see [Surface](#surface)                                                    |
| `class`         | `string`              | –              | Additional CSS classes (on the surface when `surface` is set)                                                                                                                          |

`VisualColor` accepts DB UX tokens only:

| Value                   | Resolves to                                                                    |
| ----------------------- | ------------------------------------------------------------------------------ |
| `critical`              | `var(--db-critical-on-bg-basic-emphasis-100-default)`                          |
| `critical-emphasis-60`  | `var(--db-critical-on-bg-basic-emphasis-60-default)` (50, 60, 70, 80, 90, 100) |
| `brand-origin`          | `var(--db-brand-origin-default)`                                               |
| `--db-…`, `var(--db-…)` | the given token                                                                |
| `currentColor`          | the surrounding text color                                                     |

Color families: `adaptive`, `brand`, `neutral`, `informational`, `successful`, `warning`, `critical`, `blue`, `burgundy`, `cyan`, `green`, `orange`, `pink`, `red`, `turquoise`, `violet`, `yellow`.

Hex values and other free values throw an error. An unknown `name` is a type error in `.astro` files (`astro check`) and throws `Unknown visual "…"` when an MDX page renders.

### Overriding via CSS

The props set custom properties on the `<svg>`. You can set the same properties from any parent selector:

```css
.my-teaser .db-visual {
	--visual-stroke: var(--db-neutral-on-bg-basic-emphasis-80-default);
	--visual-accent: var(--db-brand-origin-default);
	--visual-stroke-width: 1.5;
	--visual-vector-effect: none; /* scaling stroke, without the proportional default */
}
```

Available properties:

| Property                            | Set on                              | Purpose                                                                  |
| ----------------------------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| `--visual-stroke`                   | visual or ancestor                  | Primary stroke color                                                     |
| `--visual-accent`                   | visual or ancestor                  | Accent strokes and details                                               |
| `--visual-fill`                     | visual or ancestor                  | Surfaces inside the SVG (`v-fill`)                                       |
| `--visual-stroke-width`             | visual or ancestor                  | Stroke width                                                             |
| `--visual-stroke-ratio`             | `:root` in `Visual.css` or ancestor | [Proportional stroke width](#proportional-stroke-width)                  |
| `--visual-vector-effect`            | visual or ancestor                  | `none` switches off `non-scaling-stroke`                                 |
| `--visual-viewbox-size`             | visual (set by the component)       | viewBox width for the proportional stroke width                          |
| `--visual-inline-size`              | visual, or surface with `surface`   | Inline size                                                              |
| `--visual-block-size`               | visual, or surface with `surface`   | Block size                                                               |
| `--visual-surface-content-size`     | `:root` in `Visual.css` or ancestor | Visual edge as share of the surface edge (`52%`)                         |
| `--visual-surface-hover-scale`      | `:root` in `Visual.css` or ancestor | Visual scale on hover/focus of an interactive card (`1.2`)               |
| `--visual-surface-bg`               | surface or ancestor                 | Surface background (default `--db-adaptive-bg-basic-level-2-default`)    |
| `--text-image-surface-stacked-size` | ancestor of `TextImage`             | Surface size in stacked `TextImage` layouts ≤ 767 px (`--db-sizing-2xl`) |

Each `<svg>` also has `data-visual="<name>"`.

## Raster visuals

PNGs in `static/assets/teasers/` are available through the `image` prop. They are served as static files and rendered as `<img class="db-visual db-visual-image">`, so sizing, the surface and the hover scaling behave exactly like for an SVG.

```astro
<Visual image="getting-started" surface />
<Visual image="figma" size="2xl" />
<Visual image="mail" label="Write to the team" />
```

A raster image has no tokens, no stroke and no geometry the component can address. That limits what applies:

| Applies                                                | Throws                                                     |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| `size`, `width`, `height`, `surface`, `label`, `class` | `stroke`, `accent`, `fill`, `strokeWidth`, `strokeScaling` |

The SVG-only props throw instead of being dropped silently, which would look like a styling bug on the page. The same applies to setting `name` and `image` together, and to an unknown `image` – each fails the build with a message naming the file.

### Adding a raster visual

1. Save the PNG as `static/assets/teasers/<name>.png`. Use lowercase kebab-case, e.g. `product-management.png`
2. Export with a transparent background. The visual sits on `--visual-surface-bg` with `surface`, and on the page background without it
3. Check the file in Light **and** Dark Mode. The image is identical in both, so it can't rely on the page background for contrast – a near-black or near-white detail disappears in one of the modes
4. Keep the file size reasonable. These are teaser-sized visuals, not full-width images
5. Run `pnpm run optimize:visuals` to regenerate `template/visuals/images.ts`, then commit the PNG and the registry

The script only registers the names, it does not touch or optimize the PNGs. `pnpm run lint:visuals` fails when the registry is out of date.

### WebP in the build

Keep the source a `.png` and reference it by name – the component always writes a `.png` URL. The `astro-integration-png-to-webp` integration converts every PNG in the build output to WebP (max 512 px, quality 50), deletes the PNG and rewrites the references in the generated HTML, CSS and JS. So the dev server serves `/assets/teasers/<name>.png` and the built page requests `/assets/teasers/<name>.webp`. The 512 px cap is the reason an oversized export brings no benefit.

A name can exist as both an SVG and a PNG – the registries are separate and `name` and `image` select the source explicitly.

### Sizing

The intrinsic aspect ratio of the file is kept (`object-fit: contain`), so a non-square PNG is not stretched. Unlike an SVG the component doesn't know the dimensions before the image loads, so there is no `aspect-ratio` on the element: with `surface` the square surface defines the box, without it the height follows once the file is loaded.

## Light/Dark Mode

The color tokens use `light-dark()`. Because the SVG is inline, the tokens resolve against the current color mode and the visual switches together with the page. Don't use fixed color values.

A raster visual does not switch – the same file is shown in both modes. There is no light and dark variant for `image`; if a visual needs one, add it as an SVG instead.

## Accent and fill

`accent` and `fill` only have an effect on visuals that contain `v-accent`, `v-accent-solid` or `v-fill` elements, i.e. sources with a second stroke color or a surface fill. The current visuals use one stroke color only. For such a source, the normalized markup and usage look like this:

```svg
<g clip-path="url(#a)">
	<path stroke="currentColor" d="…" class="v-stroke"/>
	<path stroke="currentColor" d="…" class="v-accent"/>
	<circle cx="…" cy="…" r="…" stroke="currentColor" class="v-fill v-stroke"/>
	<circle cx="…" cy="…" r="…" fill="currentColor" class="v-accent-solid"/>
</g>
```

```mdx
<Visual name="<name>" accent="brand-origin" fill="informational-emphasis-60" />
```

The `clipPath` ID is prefixed per instance, see [Accessibility](#accessibility).

## Sizing and stroke width

The `viewBox` is always kept, so the visual scales responsively with its aspect ratio. By default the visual fills the width of its container.

### Stroke scaling

`strokeScaling` defines how the stroke width behaves when the visual is rendered larger or smaller:

| Value             | Behavior                                                                      | `strokeWidth` means |
| ----------------- | ----------------------------------------------------------------------------- | ------------------- |
| `fixed` (default) | `vector-effect: non-scaling-stroke`, the stroke keeps its width at every size | Screen px           |
| `scale`           | No `non-scaling-stroke`, the stroke grows and shrinks with the rendered size  | viewBox units       |

With `scale`, the rendered width depends on the size. For a 24 × 24 viewBox rendered at 96 px, `strokeWidth={2}` looks like 8 px (2 × 96 / 24). Token values (`"2xs"`, `var(--db-border-width-…)`) are also interpreted as viewBox units in this mode.

```mdx
<Visual name="foundation" size="3xl" />
<Visual name="foundation" size="3xl" strokeScaling="scale" strokeWidth={1} />
```

`strokeScaling="scale"` sets the class `db-visual-stroke-scale`. In CSS, `--visual-vector-effect: none` on the visual or any parent also switches off `non-scaling-stroke`, but without the [proportional default](#proportional-stroke-width).

### Proportional stroke width

With `strokeScaling="scale"` and no explicit stroke width, the stroke width is a share of the visual's size:

```css
stroke-width: calc(var(--visual-stroke-ratio) * var(--visual-viewbox-size));
```

- `--visual-stroke-ratio`: share of the edge length, defined once in `Visual.css` on `:root` (`0.05` = 5 %, e.g. 16 px at 320 px). Change this value to change every scaled visual at once. Override it on any ancestor or on the visual for a single context
- `--visual-viewbox-size`: viewBox width, set per SVG by the component from the `viewBox` attribute. The share stays correct for visuals with a viewBox other than 24
- `strokeWidth` and `--visual-stroke-width` still take precedence

```css
.my-context .db-visual {
	--visual-stroke-ratio: 0.04;
}
```

On this platform, the visuals on the home page, in the Products & Services hero and in teasers use `strokeScaling="scale"` in the markup. The size comes from `PageHero.css` (hero) and from the image column in `TextImage.css` (teasers with `surface`). The mode is a prop and not a CSS custom property, because the default stroke width depends on it: `--visual-vector-effect: none` alone switches off `non-scaling-stroke`, but keeps the fixed default of `2` viewBox units.

Keep shapes at least half the stroke width away from the viewBox edge (0.6 units at 5 % on a 24 viewBox). Miter corners need more, otherwise the stroke is clipped.

### Corners

All visuals use sharp corners: miter joins, no round/bevel joins and no round caps. Caps default to butt; square caps are allowed. `Visual.css` resets `stroke-linejoin`/`stroke-linecap` on the `<svg>` to `miter`/`butt`, so styles from the surrounding page can't change them. A `stroke-linecap="square"` attribute on an element (e.g. the clapper in `releases`) wins over this inherited value.

For very sharp reversals (e.g. the tips of the brackets in `foundation`), the browser cuts the corner flat once `stroke-miterlimit` (default `4`) is exceeded. This is intended. To flatten a corner on purpose, set a lower `stroke-miterlimit` on the element in the source, e.g. `2` on the triangle in `components`: the top tip is cut flat, the wider bottom corners stay sharp. Don't set `stroke-miterlimit` or `stroke-linecap` on child selectors in CSS, this would override the attributes.

## Surface

`surface` renders a square light grey area without corner radius (`<span class="db-visual-surface">`) behind the visual and centers the visual in it. Teasers on the home page and on Get Started use it.

```astro
<Visual name="foundation" strokeScaling="scale" surface />
<Visual name="foundation" strokeScaling="scale" surface size="2xl" />
```

- Size: `size`/`width`/`height` and `class` apply to the surface (`--visual-inline-size`/`--visual-block-size` on the `<span>`). Colors, stroke and `--visual-viewbox-size` stay on the `<svg>`. With only `height` set, the surface stays square
- Visual: takes `--visual-surface-content-size` of the surface edge, `52%` by default (`Visual.css`, `:root`). The proportional stroke follows the rendered visual, not the surface
- Background: `--visual-surface-bg`, default `--db-adaptive-bg-basic-level-2-default`. Inside an interactive card it follows the hover and pressed state one step
- Hover and keyboard focus of an interactive card scale the visual by `--visual-surface-hover-scale` (`1.2`, i.e. about 62 % of the surface). With `prefers-reduced-motion: reduce` there is no scaling and no transition

Inside `TextImage` (slot `visual`) in a `DBCard`, `TextImage.css` places the surface flush with the card: the card loses its padding, the text gets it back (same value as the DBCard `spacing`). The image column (`imageWidth`) sizes the surface. The size props have no effect there. If the text is taller than the column is wide, the surface grows in height to stay flush. In stacked layouts (≤ 767 px) the surface stays square, limited to `--text-image-surface-stacked-size` (default `--db-sizing-2xl`, 160 px), and sits at the bottom on the image side. Browsers without `:has()` keep the card padding, the surface is then not flush.

## Accessibility

- Decorative (default): `aria-hidden="true"` and `focusable="false"` on an SVG, `alt=""` on a raster visual. Use this when the visual adds no information beyond the surrounding text.
- Informative: set `label`. On an SVG the component renders `role="img"`, a `<title>` with a unique ID and `aria-labelledby` pointing to it; on a raster visual the label becomes the `alt` text. Describe the content, not the shape.

Every ID inside a visual (e.g. clip paths, gradients) is prefixed per instance (`visual-<name>-<n>-…`), so a visual can appear several times on one page without duplicate IDs.

## Optimization

| Command                     | Purpose                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `pnpm run optimize:visuals` | Normalize and optimize all SVGs, regenerate `index.ts` and `images.ts`               |
| `pnpm run lint:visuals`     | Check only. Fails if an SVG or a registry is not up to date. Part of `pnpm run lint` |

The PNGs are only registered by name – the script neither reads nor optimizes them.
