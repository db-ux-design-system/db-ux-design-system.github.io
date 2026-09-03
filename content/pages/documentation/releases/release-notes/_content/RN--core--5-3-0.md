---
hidePage: true
category: 'Core'
version: 'v5.3.0'
date: '2026-09-03'
draft: true
---

### Design & Development

#### Added

- Control Panel: The new component replaces the deprecated Header and Navigation.
  - Variants: Desktop (Top/Left), Mobile (Top/Bottom), Flat Icon
  - Navigation types: Popover, Drill Down, Tree
  - Subcomponents: Brand, Actions 1+2, Meta
- Shell: The new component for page layouts is now available with desktop and mobile variants.
  - Subcomponents: Sub Navigation, Content

#### Deprecated

- Header, Navigation: These components are moved from Beta to Deprecated. They have been replaced by Control Panel and Shell and will be removed in one of the following major releases.

### Design

#### Added

- Floating Container: The new helper component places additional elements on a trigger or parent component.
- Button: Floating Container has been integrated.

#### Changed

- Scrollbar, Tabs Vertical: The duplicate resizer helper component has been replaced by the original resizer helper component.
- Custom Select: All components are now available in Title Case.

#### Fixed

- Button: The fixed width of the icon button has been corrected. (non visible)

#### Deprecated

- Brand components of the Foundation (Logo + Pulse) are moved to Deprecated.

### Development

#### Added

- Logo: New token variables `--db-logo-url`, `--db-logo-aspect-ratio`, `--db-logo-url-short`, and `--db-logo-aspect-ratio-short` are now available.

#### Fixed

- DBSelect: Controlled `required` selects now keep the user's selection when validation runs. Validation waits until the new value has been propagated, so the selection is no longer discarded on re-render.
- DBSwitch: The icon no longer bleeds through a closed popover.
