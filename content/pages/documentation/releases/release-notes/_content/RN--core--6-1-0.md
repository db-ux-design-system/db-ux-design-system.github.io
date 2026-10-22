---
hidePage: true
category: 'Core'
version: 'v6.1.0'
date: '2026-10-22'
---

### Design & Development

#### Added

- Heading: Font weights can now be overridden per theme via `OverwriteHeadingFontWeights`.

### Development

#### Fixed

- Custom Select: The removable tags in `selectedType="tag"` mode no longer render inside the interactive `<summary>`, resolving the nested-interactive accessibility violation (WCAG 4.1.2). The public API (props, events, custom-element tags) stays unchanged, only the rendered HTML structure moved.
  - If you copied the markup, update it to the new structure: the field box is now a wrapping `<div class="db-custom-select-form-field">` around the `<details>` – previously the `<summary>` carried that class.
  - The toggle is an empty `<summary class="db-custom-select-summary">`, with the selection rendered beside it instead of inside it.
  - Selected labels now render in `<span class="db-custom-select-label">`, tags in `<div class="db-custom-select-tags">`.
  - The clear button is now a `<button class="db-custom-select-clear">` as a flex item inside the field, instead of being positioned over it.
- Foundation: Assets in `theme/relative.css`, `fonts/relative.css` and `icons/relative.css` now resolve relative to the package root. The default asset path changes from `../../assets/` to `../../../assets/`, so fonts and icon fonts are found directly in the package, e.g. when loaded from a CDN.
  - **Action required** if you copy `build/styles/` and `assets/` side by side into your public folder: keep the package structure (`build/styles/` next to `assets/`) or override `$icons-path`, `$fonts-path` and `$images-path`.
- ESLint Plugin (`select-requires-options`): The rule now also recognizes options rendered through control flow, loops and `<optgroup>`. It finds options inside Angular `@for`/`@if`/`@switch`, `*ngFor`/`*ngIf` and `ng-container`, Vue `<template v-for>`, React fragments, `&&`/ternary expressions and `.map()`, and inside `<optgroup>` in all frameworks.
