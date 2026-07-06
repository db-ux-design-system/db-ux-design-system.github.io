---
hidePage: true
category: 'Core'
version: 'v5.0.0'
date: '2026-07-14'
---

#### Design & Development

##### Added
- Tab: The component is now available as a beta release.

##### Changed
- Drawer: The layout structure has been standardized with unified subcomponents (DrawerHeader and DrawerFooter) and consistent container sizes (small, medium, large, full, custom).

#### Design

##### Changed
- Accordion: The Accordion List helper component has been replaced by a Children Slot. Existing Accordion instances are reset after updating.

##### Removed
- Card, Popover, Section, Drawer: The deprecated components have been removed (deprecated since v4.6).
- Accordion Item, Tag: The deprecated slot helper components have been removed (deprecated since v4.6).

##### Fixed
- Card, Popover: The "Start Slot" and "End Slot" now default to hidden (show slot = false).

#### Development

- TODO