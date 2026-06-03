---
inclusion: auto
---

# Astro Best Practices for This Project

## Project Structure

This project uses a **custom Astro directory layout** (configured in `astro.config.mjs`):

| Astro Default | This Project     | Purpose                                       |
| ------------- | ---------------- | --------------------------------------------- |
| `src/`        | `content/`       | Source code directory (`srcDir: './content'`) |
| `src/pages/`  | `content/pages/` | File-based routing                            |
| `public/`     | `static/`        | Static assets (`publicDir: './static'`)       |
| `dist/`       | `public/`        | Build output (`outDir: './public'`)           |

Shared layouts, components, and styles live in `template/` (not inside `content/`).

## Path Aliases

Always use these configured aliases instead of relative paths:

- `@template` → `./template` (layouts, components, styles, utils)
- `@components` → `./template/components`
- `@content` → `./content`
- `@config` → `./app.config.ts`
- `@assets` → `./static/assets`
- `@db-ux` → `./node_modules/@db-ux`

## Layouts

Every page MUST use a layout. Available layouts:

- `@template/layouts/default` – General pages (about, landing pages)
- `@template/layouts/documentation` – Documentation pages (components, foundation, guides)
- `@template/layouts/demo.astro` – Full-page demo pages (no shell navigation)

Set the layout in frontmatter:

```yaml
layout: '@template/layouts/documentation'
```

## Components

### Where components live

| Type                            | Location                                          | Example                                     |
| ------------------------------- | ------------------------------------------------- | ------------------------------------------- |
| Reusable UI components          | `template/components/{category}/{ComponentName}/` | `template/components/content/TextImage/`    |
| Layouts (shared page structure) | `template/layouts/{layout-name}/`                 | `template/layouts/documentation/`           |
| Page-specific content           | Inline in the `.mdx` file itself                  | Direct JSX in `content/pages/.../index.mdx` |

### Rules

- **Reusable components** go in `template/components/` inside a meaningful **sub-folder by category** (e.g., `content/`, `navigation/`, `feedback/`, `playground/`).
- **DO NOT** create `_components/` or `_modules/` folders inside `content/pages/`. This pattern is deprecated.
- If a component is only used on one page and is simple enough, write it directly in the `.mdx` or `.astro` page file.
- If a component defines shared page structure (header, sidebar, footer arrangement), it belongs in `template/layouts/`.
- Import shared components via `@template/components/...` or `@components/...`.

### Naming conventions

- Component directories use **PascalCase**: `TextImage/`, `CardTeaser/`, `ComponentPlayground/`
- Category sub-folders use **kebab-case**: `content/`, `navigation/`, `color-mode-switch/`
- Each component directory contains its main file (`.astro` or `.tsx`) plus co-located styles (`.css`)

### Organizing `template/components/` by category

```
template/components/
├── content/          # Content display (TextImage, CardTeaser, Carousel, Avatar)
├── documentation/    # Docs-specific (ComponentPlayground, PropertiesTable, GuidelineExample)
├── feedback/         # User feedback (StatusNotification, QuestionForm)
├── layout/           # Structural (Footer, HtmlHead, Shell, PageHero)
├── navigation/       # Nav-related (TableOfContents, CollapseButton)
├── theming/          # Theme controls (color-mode-switch, theme-switch)
└── index.ts          # Barrel exports
```

### Migration from `_components/` pattern

When encountering existing `_components/` folders in `content/pages/`:

1. If the component is reusable → move to `template/components/{category}/`
2. If it defines page structure → move to `template/layouts/`
3. If it's page-specific content → inline it in the `.mdx` page file
4. Remove the `_components/` directory once empty

## Pages

- Pages live in `content/pages/`
- Use `.mdx` for content-heavy pages (documentation, guides)
- Use `.astro` for pages requiring complex logic or custom rendering
- Every page needs frontmatter with at least `layout` and `title`

## Styling Rules

### NEVER use inline styles

All styles must be in separate CSS files or scoped `<style>` blocks in Astro components.

❌ **Wrong:**

```html
<div style="padding: 16px; color: red;">...</div>
```

✅ **Correct:**

```css
/* In a .css file or <style> block */
.my-component {
	padding: var(--db-spacing-fixed-md);
	color: var(--db-adaptive-on-bg-basic-emphasis-90-default);
}
```

### Use DB UX design tokens for all values

Never use raw pixel values, hex colors, or arbitrary values. Always use DB UX CSS custom properties:

❌ **Wrong:**

```css
.card {
	padding: 16px;
	margin: 8px;
	color: #333;
	font-size: 14px;
}
```

✅ **Correct:**

```css
.card {
	padding: var(--db-spacing-fixed-md);
	margin: var(--db-spacing-fixed-sm);
	color: var(--db-adaptive-on-bg-basic-emphasis-90-default);
	font: var(--db-type-body-sm);
}
```

### CSS file organization

- Global styles: `template/styles/global.css`
- Layout styles: `template/styles/layout.css`
- Component-specific styles: co-located with the component (e.g., `template/components/Foo/Foo.css`)
- Page-specific styles: co-located with the page (e.g., `content/pages/demo-b2b/index.css`)
- Import page-specific CSS at the top of the Astro/MDX file

### Use CSS layers

This project uses CSS layers for specificity management:

```css
@layer db-ux, themes, db-theme;
```

## Client-Side Scripts

- Use `<script is:inline slot="script">` for scripts that need to run in the document body
- Use `define:vars={{ data }}` to pass server-side data to client scripts
- Account for React hydration timing when interacting with `client:only="react"` components
- Use retry patterns for elements that depend on hydration

## React Components in Astro

- Use `client:only="react"` for components that require browser APIs or React state
- Use `client:load` for components that should hydrate immediately
- Prefer Astro components over React when no client-side interactivity is needed
- Import React components from `@db-ux/react-core-components` for DB UX components

## Content Collections

- This project uses Astro's content directory (`content/`) as the source
- Navigation is managed via `app.navigation.ts` (not file-system based)
- Page ordering is controlled by the `order` field in frontmatter
