---
hidePage: true
category: 'Core'
version: 'v4.4.0'
date: '2026-01-26'
---

#### Development

##### Changed
- Select: For required selects with a placeholder, the empty first option is now automatically hidden after the user's first selection. This behavior can be overridden via the new `showEmptyOption` prop.

##### Added
- Notification: The new `role` property has been added. If neither `role` nor `ariaLive` is set, the role is automatically assigned based on the semantic for a better screen reader experience.
