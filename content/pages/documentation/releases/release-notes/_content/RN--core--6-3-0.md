---
hidePage: true
category: 'Core'
version: 'v6.3.0'
date: '2026-11-05'
---

### Design

_version bump_

### Development

#### Fixed

- Custom Select: Removing a selected tag in a `multiple` + `selectedType="tag"` select no longer crashes the Web Component.
- Divider: `variant="vertical"` now stretches to the full height of its flex or grid container.
- Icons: The icon font (Whitelabel) now ships only the weights that are actually used, shrinking the published `@db-ux/core-foundations` assets with no change to the output consumers load.
