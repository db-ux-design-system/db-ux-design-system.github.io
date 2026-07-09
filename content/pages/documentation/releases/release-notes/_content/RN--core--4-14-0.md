---
hidePage: true
category: 'Core'
version: 'v4.14.0'
date: '2026-07-09'
---

#### Design

##### Fixed

- Tag: The slot note is now available for all variants. Previously it was only shown for the static weak variant.

#### Development

##### Added

- Angular Signal Forms support for reactive form components. Adds validation bridge, version detection utilities, and post-build script updates for Angular signal model/output generation. Updates Angular showcase form components to demonstrate signal forms usage. Includes ADR-06 documenting the technical decision and comprehensive tests.

##### Changed

- Optimized floating component positioning logic (tooltips, popovers, custom-selects, tabs) to use shared abstract listener classes, reducing code duplication and improving maintainability.

##### Fixed

- tailwind: The text-body-* and text-head-* Tailwind typography utilities now allow font-weight overrides (such as font-bold) without losing their default token weight. This fixes an issue where the font shorthand reset font-weight, preventing Tailwind font-weight utilities from working.
- Accordion: correct variant backgrounds to match design (divider is transparent, card is level-1 including the open content area)
- Use `inline-flex` with `align-items: center` for link components to vertically center text with fixed height across densities
- Ensure that the `key`/`track` special attributes within our components are unique
