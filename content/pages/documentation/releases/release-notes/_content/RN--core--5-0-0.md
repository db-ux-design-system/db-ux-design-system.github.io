---
hidePage: true
category: 'Core'
version: 'v5.0.0'
date: '2026-07-14'
---

### Design & Development

#### Changed
- **BREAKING CHANGE** Drawer: The layout structure has been standardized with unified subcomponents (DrawerHeader and DrawerFooter) and new consistent container sizes (small, medium, large, full, custom).
  - Design: Existing instances are reset after updating.
  - Development: Some properties have changed and support for safe areas has been added.
- Tab: The component is now available as a beta release.
  - Development: **BREAKING CHANGE** – Significant HTML adaptations to accessibility tool feedback, as well as renaming and restructuring of properties.

### Design

#### Added
- Resizer: A dedicated helper component for resizing has been added.

#### Changed
- **BREAKING CHANGE** Accordion: The Accordion List helper component has been replaced by a Children Slot. Existing Accordion instances are reset after updating.
- **BREAKING CHANGE** CustomSelect: The CustomSelect List and CustomSelect Tab List helper component has been replaced by a Children Slot. Existing CustomSelect instances with open dropdowns and filled fields with tabs are reset after updating.
- **BREAKING CHANGE** Card, Popover: The "Start Slot" and "End Slot" now default to hidden (show slot = false).
- Properties: Property categories now use icon prefixes for better usability (🔀 variant selection, 👁️ show/hide booleans, 📦 slots, ✏️ text layers, 🔄 swaps). No action required.
- Scrollbar: The Scrollbar now uses the new Resizer component internally. Custom modifications to handle size or free position (e.g. in CustomSelect dropdowns) need to be reapplied after updating.

#### Removed
- **BREAKING CHANGE** Card, Popover, Section, Drawer: The deprecated components have been removed (deprecated since v4.6).
- **BREAKING CHANGE** Accordion Item, Tag: The deprecated slot helper components have been removed (deprecated since v4.6).
- **BREAKING CHANGE** Tooltip: The deprecated resizer layer has been removed.

#### Fixed
- Tooltip: The border radius is now consistent with the code implementation (strong) and has been added to the weak variant where it was missing.

### Development

#### Changed
- **BREAKING CHANGE** (visual) Icon pseudo-elements: The default `margin-inline` has been removed from `[data-icon]` pseudo-elements in favour of a `gap`.
- CSS Custom Properties: Properties are no longer defined on the `:host` selector as a complement to `:root`, as this is no longer necessary. No issues are expected – feedback is welcome if any arise.
- `@db-ux/core-migration`: The deprecated node package is no longer supported, as its "search and replace" operations were too basic. AI and/or manual migration work is recommended instead.
