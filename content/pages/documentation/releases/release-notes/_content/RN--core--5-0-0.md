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
- Tooltip: The deprecated resizer layer has been removed

##### Fixed
- Tooltip: The border radius is now consistent with the code implementation (strong) and has been added to the weak variant where it was missing.

#### Development

##### Changed

- **BREAKING CHANGE:** The Tabs component has undergone significant changes, including larger HTML adaptations to accessibility tool feedback within the component, as well as the renaming and restructuring of properties.
- **BREAKING CHANGE:** Add a drawer header/footer to the drawer component, change some of its properties, and provide support for safe areas.
- Visual **BREAKING CHANGE:** Remove the default `margin-inline` from the `[data-icon]` pseudo-elements in favour of a `gap`.
- We're no longer defining CSS Custom Properties on the `:host` selector as a complement to `:root`, as this shouldn't be necessary. There shouldn't be any problems with this change. If you experience any issues, please let us know.
- The deprecated node package `@db-ux/core-migration` is no longer supported, as its "search and replace" operations were too basic. You should use AI and/or manual migration work instead, which is expected to work much better.