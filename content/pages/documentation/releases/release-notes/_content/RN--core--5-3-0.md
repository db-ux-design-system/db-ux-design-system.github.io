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
- Header, Navigation: These components are moved from Beta to Deprecated. They have been replaced by Control Panel and Shell and will be removed in a future release.

### Design

#### Added
- Floating Container: The new helper component places additional elements on a trigger or parent component.
- Button: Floating Container has been integrated.
- Custom Select: All components are now available in Title Case.

#### Changed
- Scrollbar, Tabs Vertical: The duplicate resizer helper component has been replaced by the original resizer helper component.

#### Fixed
- Button: The fixed width of the icon button has been corrected.
