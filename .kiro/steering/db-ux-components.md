---
inclusion: auto
---

# DB UX Design System – Component & Token Usage

> Always use "DB UX" components and variables as the project's conventions.

## @db-ux/core-components

### Best Practices / Common AI Mistakes

- Always read this file when using components: `node_modules/@db-ux/core-components/agent/Best-Practise_Common-AI-Mistakes.md`

## @db-ux/core-foundations

### CSS

- Always reference `node_modules/@db-ux/core-foundations/agent/css/Variables.md` for variables (sizing, spacing, elevation, border, container-size).
- Use the examples provided in `Variables.md`:
  - `padding: var(--db-spacing-fixed-md);`
  - `height: var(--db-sizing-md);`
  - `width: var(--db-container-xs);`
  - `color: var(--db-adaptive-on-bg-basic-emphasis-90-default);`
  - `background-color: var(--db-adaptive-bg-basic-level-2-default);`
  - `font: var(--db-type-body-sm);`

### SCSS

- Always reference `node_modules/@db-ux/core-foundations/agent/scss/Variables.md` for variables.
- Always use `@use` for imports (never `@import`):
  - Variables: `@use "@db-ux/core-foundations/build/styles/variables";`
  - Colors: `@use "@db-ux/core-foundations/build/styles/colors";`
  - Fonts: `@use "@db-ux/core-foundations/build/styles/fonts";`
- Never use `as *` for `@use`. Use namespaced access:
  - `padding: variables.$db-spacing-fixed-md;`
  - `height: variables.$db-sizing-md;`
  - `color: colors.$db-adaptive-on-bg-basic-emphasis-90-default;`
  - `font: fonts.$db-type-body-sm;`

## @db-ux/react-core-components

- Use `@db-ux/react-core-components` as the import source for all DB UX React components.
- For component-specific documentation, read the corresponding file at `node_modules/@db-ux/react-core-components/agent/[ComponentName].md`

### DBSection

- Every `<DBSection>` must have a unique `id` attribute.
- Use a descriptive, kebab-case id that reflects the page and section purpose, e.g. `id="button--use-cases"`, `id="home--testimonials-section"`.
- The id pattern is: `[page-name]--[section-purpose]`.

## Token Accuracy

**CRITICAL: Design System tokens must be 100% accurate.**

- NEVER estimate, guess, or interpolate token values.
- Always read actual values from source files in `node_modules/@db-ux/core-foundations/`.
- Verify token values from:
  - CSS: `node_modules/@db-ux/core-foundations/build/css/`
  - SCSS: `node_modules/@db-ux/core-foundations/build/styles/defaults/_default-variables.scss`
