---
hidePage: true
category: 'Core'
version: 'v5.6.0'
date: '2026-09-24'
---

### Design & Development

#### Added

- Loading Indicator: A new component that handles loading states such as spinners and progress bars.
- Dialog: New `DBDialog`, `DBDialogHeader` and `DBDialogFooter` components, built on the native `<dialog>` element and reusing its centering and top-layer behavior.
- Pagination: A new controlled pagination component.
- Button: New states for loading and loading overlay.
- Custom Select: Loading Indicator added to loading state in dropdown.

### Design

#### Fixed

- Tag: Position of the content slot has been fixed and missing slots have been added.

### Development

#### Changed

- DBDrawer: New `onClick` and `onCancel` props on `DBDrawerProps`, matching `DBDialog`.
- MCP server: The server now answers on both protocol eras, the 2025 `initialize` handshake and the new 2026-07-28 revision (`server/discover` probe). Hosts that have not adopted 2026-07-28 keep working unchanged.

#### Fixed

- DBDrawer: Accessibility, dismissal and the shared dialog layer have been reworked.
- MCP server: `docs_search` matching and the `scan_v2_migration` report have been corrected.
- MCP server: `get_example_code` no longer advertises `html`, and a dead transport now fails fast.
- MCP server: `assets/` now resolves correctly in the published bundle. The path is anchored on the package root, so `list_visuals`, `get_visual_reference` and `get_design_tokens` (including the `elevation`, `border` and `opacity` categories) work in the published package.
- MCP server: `get_example_code` now returns a readable error on failure. The catch block no longer shadows the imported `error()` helper, so the host receives the intended readable result instead of an opaque JSON-RPC error.
