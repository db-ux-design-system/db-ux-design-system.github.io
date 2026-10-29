---
hidePage: true
category: 'Core'
version: 'v6.2.0'
date: '2026-10-30'
---

### Design

_version bump_

### Development

#### Added

- Button: The native form submission attributes `formAction`, `formEncType`, `formMethod`, `formNoValidate` and `formTarget` are now available as properties and rendered on the inner `<button>`. A submit button can override its form this way, e.g. `formMethod="dialog"` closes a `<dialog>`.
- Control Panel Mobile: The drawer header can now be customized. `closeButtonText` and `closeButtonId` configure the close button, and the `header` slot replaces the internal drawer header when `showDrawerHeaderSlot` is set.
- Header: The new `header` slot replaces the internal drawer header when `showDrawerHeaderSlot` is set, so action elements or a subtitle can be placed next to the close button.
  - You provide the close button yourself in this case, e.g. via `DBDrawerHeader`.
  - Web Components: The slot has no effect on `db-header`. Use `db-control-panel-mobile` instead.

#### Fixed

- Select: The placeholder is now hidden while the dropdown is open and no longer overlaps the option text during keyboard navigation.
