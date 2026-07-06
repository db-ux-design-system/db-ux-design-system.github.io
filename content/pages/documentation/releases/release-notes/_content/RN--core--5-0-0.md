---
hidePage: true
category: 'Core'
version: 'v5.0.0'
date: '2026-07-14'
---

### Design + Development

- Tab: release beta
- refactoring(Drawer): standardized layout structure
  - unified subcomponents (DrawerHeader + DrawerFooter)
  - standard container sizes (small, medium, large, full, custom)

### Design

- refactoring(Accordion): Children Slot replaces ❌🛟 Accordion List helper component
  - existing Accordion instances are reset after updating
- removed(Card): deprecated component removed (deprecated since v4.6)
- removed(Popover): deprecated component removed (deprecated since v4.6)
- removed(Drawer): deprecated component variant removed (deprecated since v4.6)
- removed(Section): deprecated component removed (deprecated since v4.6)
- removed(Accordion Item): deprecated slot helper component removed (deprecated since v4.6)
- removed(Tag): deprecated slot helper component removed (deprecated since v4.6)
- fix(Card, Popover): show slot = false as default for "Start Slot" and "End Slot"

### Development

- TODO
