---
hidePage: true
category: 'Core'
version: 'v4.12.0'
date: '2026-06-18'
---

### Design

- feat: added children slots for full width components
  - checkbox
  - infotext
  - radio
  - switch
  - tooltip
- feat: improved slot settings for several components
- fix(tag): removable tag size bug

### Development

- feat: add `--db-logo-short` variable for new db-shell
- feat: emit spec-compliant ESM with explicit import extensions
  - The generated React, Vue and Web Component outputs now produce standards-compliant
  - ESM: every relative import/export carries an explicit .js / /index.js (or .vue)
  - extension, added during Mitosis generation. This resolves ERR_UNSUPPORTED_DIR_IMPORT
  - in strict ESM environments such as Node.js native ESM and Vitest 4.
  - The React output additionally compiles with module/moduleResolution: "node16"
  - (plus jsx: "react-jsx" and target: "es2022"), so missing extensions are caught at
  - compile time. As a result the emitted React JS uses the react/jsx-runtime transform
  - and es2022 syntax (React 19 compatible).
