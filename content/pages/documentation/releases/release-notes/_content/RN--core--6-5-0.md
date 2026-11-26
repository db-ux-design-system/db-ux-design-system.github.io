---
hidePage: true
category: 'Core'
version: 'v6.5.0'
date: '2026-11-26'
---

### Design

_version bump_

### Development

#### Added

- Table: Rows can now be expanded. Put a `<details>` into a cell of an interactive row and mark its `<summary>` with `data-table-row-trigger="true"`, the opened content then spans the full row below the cells, also with `mobileVariant="list"`.
- Table: The new `--db-table-mobile-variant-list-grid-columns` CSS Custom Property sets the column split of label and content in `mobileVariant="list"`, e.g. `30% 1fr` instead of the default `40% 1fr`.
- Web Components: An opt-in build with Stencil's `experimentalSlotFixes` is now available via `@db-ux/wc-core-components/slot-fixes` and `@db-ux/wc-core-components/bundle-slot-fixes`, for frameworks that reorder slotted children at runtime. The default entry points stay unchanged.

#### Changed

- Table: Cells of a column whose header cell has `noText` no longer get a `data-header` attribute, so they no longer show the header text as a visual label in `mobileVariant="list"`.
  - If you write the markup yourself, set `data-header` only for columns with a visible header text.

#### Fixed

- Table: The dividers in `mobileVariant="list"` are now drawn consistently. A header row with interactive controls stays visible, and the colon after the label has been removed.
- Table: `mobileVariant="list"` no longer applies the spaced styles on wide screens, only below the `sm` breakpoint of the table.
- Popover: The trigger is now found independently of its position, so `aria-expanded` and `aria-haspopup` are also set reliably in the Web Components.
