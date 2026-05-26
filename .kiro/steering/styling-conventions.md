---
inclusion: fileMatch
fileMatchPattern: '**/*.css,**/*.astro,**/*.mdx,**/*.tsx'
---

# Styling Conventions

## Core Principle: No Inline Styles

Inline styles (`style="..."`) are **strictly forbidden** in this project. All styling must be done through:

1. External CSS files (preferred for reusable styles)
2. Scoped `<style>` blocks in Astro components (for component-specific styles)
3. CSS classes referencing DB UX design tokens

## DB UX Design Tokens – Always Use Them

### Spacing

| Usage              | Token Pattern                    | Example                           |
| ------------------ | -------------------------------- | --------------------------------- |
| Fixed spacing      | `--db-spacing-fixed-{size}`      | `var(--db-spacing-fixed-md)`      |
| Responsive spacing | `--db-spacing-responsive-{size}` | `var(--db-spacing-responsive-md)` |

Sizes: `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`

### Sizing

| Usage          | Token Pattern        | Example               |
| -------------- | -------------------- | --------------------- |
| Element sizing | `--db-sizing-{size}` | `var(--db-sizing-md)` |

### Typography

| Usage     | Token Pattern               | Example                      |
| --------- | --------------------------- | ---------------------------- |
| Body text | `--db-type-body-{size}`     | `var(--db-type-body-md)`     |
| Headlines | `--db-type-headline-{size}` | `var(--db-type-headline-lg)` |

### Colors

| Usage              | Token Pattern                                        | Example                                              |
| ------------------ | ---------------------------------------------------- | ---------------------------------------------------- |
| Text on background | `--db-adaptive-on-bg-basic-emphasis-{level}-default` | `var(--db-adaptive-on-bg-basic-emphasis-90-default)` |
| Background         | `--db-adaptive-bg-basic-level-{n}-default`           | `var(--db-adaptive-bg-basic-level-2-default)`        |

### Containers

| Usage            | Token Pattern           | Example                  |
| ---------------- | ----------------------- | ------------------------ |
| Container widths | `--db-container-{size}` | `var(--db-container-xs)` |

### Borders & Elevation

| Usage         | Token Pattern               | Example                      |
| ------------- | --------------------------- | ---------------------------- |
| Border radius | `--db-border-radius-{size}` | `var(--db-border-radius-md)` |
| Elevation     | `--db-elevation-{level}`    | `var(--db-elevation-md)`     |

## Forbidden Patterns

❌ Never use raw values:

- `padding: 16px` → use `padding: var(--db-spacing-fixed-md)`
- `color: #333` → use `color: var(--db-adaptive-on-bg-basic-emphasis-90-default)`
- `font-size: 14px` → use `font: var(--db-type-body-sm)`
- `border-radius: 4px` → use `border-radius: var(--db-border-radius-xs)`
- `margin: 0 auto` → acceptable only for centering; spacing values must use tokens

❌ Never use `!important` unless overriding third-party styles (document why).

❌ Never target DB UX internal class names (`.db-*`) for styling unless absolutely necessary and documented.

## File Organization

- **Global styles**: `template/styles/global.css`
- **Layout styles**: `template/styles/layout.css`
- **Component styles**: Co-located with the component in `template/components/[Name]/[Name].css`
- **Page-specific styles**: Co-located with the page (e.g., `content/pages/demo-b2b/index.css`)
- **Theme overrides**: `template/styles/db-ux-overrides.css`

## Import Order in CSS

```css
/* 1. External library styles (via layers) */
@layer db-ux, themes, db-theme;
@import url('@db-ux/core-components/build/styles/rollup.css') layer(db-ux);
@import url('@db-ux/db-theme/build/styles/rollup.css') layer(db-theme);

/* 2. Layout styles */
@import url('./layout.css');

/* 3. Component styles */
@import url('../components/Foo/Foo.css');

/* 4. Overrides (last) */
@import url('./db-ux-overrides.css');
```
