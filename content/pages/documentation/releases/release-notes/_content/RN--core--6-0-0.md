---
hidePage: true
category: 'Core'
version: 'v6.0.0'
date: '2026-10-09'
---

### Design & Development

#### Added

- Breadcrumb, Paragraph, Text Group: These components are now available as a beta release.
- Colors: Lilac is available as a new brand color in the color palette of the Foundation.
- Typography: The new headline font is available as an additional font style in the Foundation.
- Heading: H1 has "Wide ExtraBlack" as an additional font weight property.

#### Changed

- **BREAKING CHANGE** (visual) Brand Design: All affected components have been updated to the new brand design.
  - Border Radius: The tokens 3xs–3xl are now 0px. `border-radius-full` stays unchanged, so round components such as Badges or Radios keep their shape.
  - Affected components: Accordion, Badge, Button, Card, Checkbox, Control Panel, Custom Select, Dialog, Drawer, Heading, Input, Link, Loading Indicator, Notification, Pagination, Popover, Select, Shell, Tabs, Tag, Textarea, Tooltip
- **BREAKING CHANGE** Heading: The "Size" property has been replaced by "Visual Size". Visual Size decouples the appearance from the semantic level, so every heading can take on the visual size of any other level without losing its own semantics.

#### Deprecated

- Drawer: The "rounded" property is deprecated and will be removed with one of the next major releases.

#### Removed

- **BREAKING CHANGE** Heading: The "Alignment" property has been removed.

### Design

#### Changed

- **BREAKING CHANGE** Drawer: The heading text of the Drawer Header now sits in a Children Slot, consistent with the Dialog Header and the development implementation.
