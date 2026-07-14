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
- Drawer: The layout structure has been standardized with unified subcomponents (DrawerHeader and DrawerFooter) and consistent container sizes (small, medium, large, full, custom). Existing Drawer instances are reset after updating in Design.

#### Design

##### Added
- Resizer: A dedicated helper component for resizing has been added.

##### Changed
- Accordion: The Accordion List helper component has been replaced by a Children Slot. Existing Accordion instances are reset after updating.
- CustomSelect: The CustomSelect List and CustomSelect Tab List helper component has been replaced by a Children Slot. Existing CustomSelect instances with open dropdowns and filled fields with tabs are reset after updating.
- Card, Popover: The "Start Slot" and "End Slot" now default to hidden (show slot = false).
- Properties: Property categories now use icon prefixes for better usability (🔀 variant selection, 👁️ show/hide booleans, 📦 slots, ✏️ text layers, 🔄 swaps). No action required.
- Scrollbar: The Scrollbar now uses the new Resizer component internally. Custom modifications to handle size or free position (e.g. in CustomSelect dropdowns) need to be reapplied after updating.

##### Removed
- Card, Popover, Section, Drawer: The deprecated components have been removed (deprecated since v4.6).
- Accordion Item, Tag: The deprecated slot helper components have been removed (deprecated since v4.6).
- Tooltip: The deprecated resizer has been removed

##### Fixed
- Tooltip: The border radius is now consistent with the code implementation (strong) and has been added to the weak variant where it was missing.

#### Development

- TODO