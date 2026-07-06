---
hidePage: true
category: 'Core'
version: 'v5.1.0'
date: ''
draft: true
---

### Design + Development

- feat(Shell): new component for page layouts
  - desktop and mobile variants
  - subcomponents: Shell Subnavigation, Shell Content
- feat(ControlPanel): new component replacing deprecated Header + Navigation
  - desktop (top/left), mobile (top/bottom)
  - navigation types: Popover, Tree, Flat Icon
  - subcomponents: ControlPanel Brand, ControlPanel PrimaryActions, ControlPanel SecondaryActions, ControlPanel MetaNavigation
- deprecated(Header, Navigation): replaced by ControlPanel + Shell, will be removed

### Design

- feat(Button): FloatingContainer integrated
- fix(Button): icon button fixed width
- fix(Scrollbar): resizer helper component
