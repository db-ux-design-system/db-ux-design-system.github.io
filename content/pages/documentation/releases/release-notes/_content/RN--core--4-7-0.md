---
hidePage: true
category: 'Core'
version: 'v4.7.0'
date: '2026-04-28'
---

### Design

#### Added
- Components: Component-level versioning has been introduced.
  - Each component is now tagged with the version number of its latest update in the background – invisible to users and with no impact on existing designs.
  - This information serves as the basis for potential migration support in future major releases with breaking changes.
  - Recommendation: Keep your component instances up to date – only up-to-date instances can be migrated with support in major releases.

### Development

#### Fixed
- Select: The empty `option` element (rendered for select elements with a placeholder or "floating label" variant) is now hidden as soon as the `select` is opened, rather than only after another option is selected.

#### Changed
- Notification: The content area now supports any block-level elements, not just plain text.
