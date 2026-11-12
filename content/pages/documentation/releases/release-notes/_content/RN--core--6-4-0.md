---
hidePage: true
category: 'Core'
version: 'v6.4.0'
date: '2026-11-12'
---

### Design

_version bump_

### Development

#### Added

- Layout: The tablet and desktop breakpoints are now customizable via a single inheriting `--db-breakpoint` token. Components switch through a container style query, so consumers can move a switch point on any ancestor or force a layout, without touching media queries. [see commit 78559f9](https://github.com/db-ux-design-system/core-web/commit/78559f9147423b1a243f3470f7868d0722496cf0)
- Table: Table Data Cell and Table Header Cell gain an optional `text` property as an alternative to the slot, alongside refined cell padding and selected-row styling. [see commit e873176](https://github.com/db-ux-design-system/core-web/commit/e873176a18d90fd09dbf357b56daf851c2062d9e)
- Textarea: With the new `--db-form-component-min-block-size` CSS Custom Property you could set a minimum height on a DBTextarea, for example so a `fieldSizing="content"` textarea keeps room for a few lines even when empty. [see commit 7c9b6e7](https://github.com/db-ux-design-system/core-web/commit/7c9b6e7aebf0de7b030afd56dbb1331733231a1e)
