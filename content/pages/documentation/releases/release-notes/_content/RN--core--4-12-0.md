---
hidePage: true
category: 'Core'
version: 'v4.12.0'
date: '2026-06-18'
---

### Design

#### Added
- Checkbox, Infotext, Radio, Switch, Tooltip: Children slots have been added for full width components.
- Multiple components: Slot settings have been improved.

#### Fixed
- Tag: The removable tag size bug has been resolved.

### Development

#### Added
- Shell: A new `--db-logo-short` CSS variable is available for the new DB Shell.

#### Fixed
- ESM: All generated outputs (React, Vue, Web Components) now emit spec-compliant ESM with explicit import extensions, resolving `ERR_UNSUPPORTED_DIR_IMPORT` in strict ESM environments such as Node.js native ESM and Vitest 4.
