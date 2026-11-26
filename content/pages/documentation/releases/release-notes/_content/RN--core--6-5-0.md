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

- Table: Rows can now be expanded with a `<details>` element in a cell of an interactive row, its `<summary>` with `data-table-row-trigger="true"` toggles the content below the whole row. This works in the default layout and with `mobileVariant="list"`. [see commit 0a6edf1](https://github.com/db-ux-design-system/core-web/commit/0a6edf193237f97372d1a5c94343a3cf0b166108)
- Table: The new CSS Custom Property `--db-table-mobile-variant-list-grid-columns` sets the column split of label and content in `mobileVariant="list"`. [see commit 19587f4](https://github.com/db-ux-design-system/core-web/commit/19587f46b1e3124283dd0477ed54db2205ee70af)
- Web Components: An opt-in build variant with Stencil's `experimentalSlotFixes` is available via `@db-ux/wc-core-components/slot-fixes` and `@db-ux/wc-core-components/bundle-slot-fixes`. Use it when a framework reorders slotted children at runtime. [see commit b32948e](https://github.com/db-ux-design-system/core-web/commit/b32948edd73c7268995cd7815e87157197218dcd)

#### Changed

- Table: `data-header` is now only set for columns with a visible header text. Cells of a column whose header cell uses `noText` no longer get a `data-header` attribute. [see commit 0a6edf1](https://github.com/db-ux-design-system/core-web/commit/0a6edf193237f97372d1a5c94343a3cf0b166108)

#### Fixed

- Table: The dividers in `mobileVariant="list"` are now drawn consistently, a header row with interactive controls stays visible and the colon after the label has been removed. [see commit 19587f4](https://github.com/db-ux-design-system/core-web/commit/19587f46b1e3124283dd0477ed54db2205ee70af)
- Table: The spaced styles of `mobileVariant="list"` now only apply below the `sm` breakpoint of the table. [see commit 0a6edf1](https://github.com/db-ux-design-system/core-web/commit/0a6edf193237f97372d1a5c94343a3cf0b166108)
- Popover: The trigger is now found independently of its position, so `aria-expanded` and `aria-haspopup` are set reliably in Web Components as well. [see commit b32948e](https://github.com/db-ux-design-system/core-web/commit/b32948edd73c7268995cd7815e87157197218dcd)
