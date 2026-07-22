---
hidePage: true
category: 'Core'
version: 'v4.9.0'
date: '2026-05-20'
---

### Design

#### Added
- Multiple components: "Children" and "Content" slots have been added.
  - Accordion Item, Notification: "Children" slot below text content
  - Badge (Text), Button, Link, Infotext (Auto Width), Tooltip (Auto Width): "Children" slot right of text
  - Checkbox (Auto Width), Radio (Auto Width), Switch (Auto Width): "Children" slot right of label
  - Tag: "Content" slot right of icon; "Children" slot right of text
  - Core components with nested instances of affected components have been updated accordingly.

### Development

#### Changed
- Components: The `text` property and the `children` property can now be set at the same time.
