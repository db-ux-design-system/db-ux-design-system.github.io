---
hidePage: true
category: 'Core'
version: 'v4.6.0'
date: '2026-04-09'
---

### Design

#### Added
- Card, Popover, Section: New component variants using the Figma slot feature have been introduced. Place your content directly inside the slot instead of using the separate slot component.

#### Deprecated
- Card, Popover, Section: The old variants using the slot component have been marked as deprecated and will be removed in v5.0.0.
  - Migration: Replace all deprecated variants with the new component and place your content inside the slot.

### Development

#### Added
- MCP Server: The new package [`@db-ux/mcp-server`](https://www.npmjs.com/@db-ux/mcp-server) connects AI coding assistants (e.g. Amazon Q, GitHub Copilot, Claude) directly with the DB UX Design System. It provides component APIs, framework-specific code examples, design tokens, and icon names as a single source of truth. Pre-built AI workflows for scaffolding, code reviews, migration, and accessibility audits are included.
- Vite Plugin: The new package [`@db-ux/core-vite-plugin`](https://www.npmjs.com/package/@db-ux/core-vite-plugin) ensures only the styles actually used in your app are included. Requires `@db-ux/core-foundations` >= 4.6.0.
- PostCSS Plugin: The new package [`@db-ux/core-postcss-plugin`](https://www.npmjs.com/package/@db-ux/core-postcss-plugin) resolves all `--db-` variables and properties as much as possible, writing e.g. color hex values directly into custom properties. This eliminates most variable references and mitigates dev tools issues with newer Chromium browsers. Works independently of other package versions.

#### Changed
- Foundations: The whitelabel theme fallback has been removed – modern bundlers don't include it in the output, so no action is required if you're using the DB Theme.
- Tailwind v4: Variables now use <a href="https://tailwindcss.com/docs/theme#referencing-other-variables" target="_blank" rel="noopener noreferrer">@theme inline</a>, which significantly reduces the number of additional variables. No action required.

#### Fixed
- Input, Textarea: `undefined` as `value` is now correctly supported. Numeric input values are no longer cleared when entering a decimal separator.
- Drawer: Custom `max-width`/`max-height` values are no longer overridden by internal `min-width` rules. A positioning issue with nested fixed elements (e.g. Custom Select dropdowns) inside the Drawer has also been corrected.
