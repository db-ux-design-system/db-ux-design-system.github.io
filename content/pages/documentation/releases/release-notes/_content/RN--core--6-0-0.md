---
hidePage: true
category: 'Core'
version: 'v6.0.0'
date: '2026-10-09'
---

### Design & Development

#### Changed

- **BREAKING CHANGE** Heading: The "Size" property has been replaced by "Visual Size". Visual Size decouples the appearance from the semantic level, so every heading can take on the visual size of any other level without losing its own semantics.

#### Removed

- **BREAKING CHANGE** Heading: The "Alignment" property has been removed.

### Design

#### Changed

- **BREAKING CHANGE** Drawer: The heading text of the Drawer Header now sits in a Children Slot, consistent with the Dialog Header and the development implementation.
