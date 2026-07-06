---
hidePage: true
category: 'Core'
version: 'v4.10.0'
date: '2026-06-01'
---

#### Design

_version bump_

#### Development

##### Added
- Web Components: A bundled output (`bundle/`) is now available so `@db-ux/wc-core-components` can be consumed directly via a single script import without a bundler.
- Accordion Item: The `open` prop has been added to control the expanded state programmatically.

##### Changed
- Form components: The hard `25ch` label width limit has been replaced with a customizable CSS variable.
