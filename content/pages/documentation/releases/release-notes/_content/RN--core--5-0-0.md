---
hidePage: true
category: 'Core'
version: 'v5.0.0'
date: '2026-07-14'
---

### Design + Development

- feat(ControlPanel): new component replacing deprecated Header + Navigation
  - desktop (top/left), mobile (top/bottom)
  - navigation types: Popover, Tree, Flat Icon
  - subcomponents: ControlPanel Brand, ControlPanel PrimaryActions, ControlPanel SecondaryActions, ControlPanel MetaNavigation
- feat(Shell): new component for page layouts
  - desktop and mobile variants
  - subcomponents: Shell Subnavigation, Shell Content
- 🔥 refactoring(Drawer): standardized layout structure
  - unified subcomponents (DrawerHeader + DrawerFooter)
  - standard container sizes (small, medium, large, full, custom)
- 🔥 deprecated: Header, Navigation (replaced by ControlPanel + Shell)

### Design

- feat(Button): FloatingContainer integrated
- feat(all components): icon prefix for properties (🔀, 👁️, 📦, ✏️, 🔄)
- fix(Button): icon button fixed width
- fix(Scrollbar): resizer helper component
- fix(Card, Popover): show slot = false as default for "Start Slot" and "End Slot"

### Development

- 🔥 breaking: TODO
