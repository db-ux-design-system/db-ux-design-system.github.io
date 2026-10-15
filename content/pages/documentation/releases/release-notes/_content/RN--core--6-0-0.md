---
hidePage: true
category: 'Core'
version: 'v6.0.0'
date: '2026-10-15'
---

### Design & Development

#### Added

- Breadcrumb, Paragraph, Text Group: These components are now available as a beta release.
- Colors: Lilac is available as a new brand color in the color palette of the Foundation.
- DB logo: uses the new DB Red
- Typography: The new headline font is available as an additional font style in the Foundation.
- Heading: H1 has "Wide ExtraBlack" as an additional font weight property.

#### Changed

- **BREAKING CHANGE** (visual) Brand Design: All affected components have been updated to the new brand design.
  - Border Radius: The tokens 3xs–3xl are now 0 px. `border-radius-full` stays unchanged, so round components such as Badges or Radios keep their shape.
  - Affected components: Accordion, Badge, Button, Card, Checkbox, Control Panel, Custom Select, Dialog, Drawer, Heading, Input, Link, Loading Indicator, Notification, Pagination, Popover, Select, Shell, Tabs, Tag, Textarea, Tooltip
- **BREAKING CHANGE** Heading: The "Size" property has been replaced by "Visual Size". Visual Size decouples the appearance from the semantic level, so every heading can take on the visual size of any other level without losing its own semantics.
  - Design: Instances that used one of the removed sizes are no longer correctly linked and have to be corrected after updating.

#### Deprecated

- Drawer: The "rounded" property is deprecated and will be removed with one of the next major releases.

#### Removed

- **BREAKING CHANGE** Heading: The "Alignment" and "Paragraph Spacing" properties have been removed.
  - Design: Alignment is set on the layer inside the component. Instances with an alignment other than "Left" are no longer correctly linked and have to be corrected after updating.
  - Development: Alignment is set with `text-align` on the heading itself, block spacing with the `data-text-spacing` opt-in from the Foundation.

### Design

#### Changed

- **BREAKING CHANGE** Drawer: The heading text of the Drawer Header now sits in a Children Slot, consistent with the Dialog Header and the development implementation.
  - Copy the heading text before updating – the update resets the existing content.

### Development

#### Changed

- **BREAKING CHANGE** Stack: The default `block-size: 100%` has been removed and replaced by explicit `width` and `height` properties.
  - `width` (`full` | `auto`, default `full`) and `height` (`full` | `auto`, default `auto`) control the stack dimensions.
  - Nested stacks no longer stretch to the parent height. Set `height="full"` to restore the previous behavior.
- **BREAKING CHANGE** Dialog, Drawer: The native `dialog` element styles are now scoped to `.db-dialog` and `.db-drawer`. Native `<dialog>` elements outside the Design System are no longer styled, the rendered output of `DBDialog` and `DBDrawer` stays unchanged.
- **BREAKING CHANGE** Heading: `visualSize` takes heading levels (`h1`–`h6`) and paragraph sizes (`p-small`, `p-medium`, `p-large`) instead of the abstract `3xl`–`3xs` scale. The attribute changed from `data-size` to `data-visual-size`.
- **BREAKING CHANGE** MCP server, Agent CLI: The executables have been renamed to a consistent `db-ux-` prefix: `mcp-server` becomes `db-ux-mcp-server`, `agent-cli` becomes `db-ux-agent-cli`.
- **BREAKING CHANGE** MCP server, Agent CLI: The public API uses generation-based naming instead of the `v2` / `v3` shorthand.
  - The tool `scan_v2_migration` becomes `scan_generation_2_migration`.
  - The `source_context` values follow the `db-ux-generation-3` pattern.
  - The skill `migrate-to-v3` becomes `migrate-to-generation-3`.
- Typography: Block-level text (`h1`–`h6`, `p`) carries no `margin-block` by default. The opt-in `data-text-spacing="true"` adds the spacing, `data-text-spacing="false"` opts a subtree back out.
- Tooltip: The hardcoded `border-radius` on the tooltip arrow has been removed, the roundness now follows the `db-border-radius` tokens.
- Loading Indicator: `stroke-linecap: round` has been removed from the circular segment, so the segment ends are no longer rounded.
- Drawer: `DBHeader` and `DBControlPanelMobile` no longer set the deprecated `rounded` property internally.

#### Removed

- **BREAKING CHANGE** Dialog: The published entry point `@db-ux/core-components/build/styles/dialog-init` has been removed. The variables `$backdrop-color-strong` and `$backdrop-color-weak` have moved to the internal dialog styles.

#### Fixed

- Stack: The focus ring of child elements is no longer clipped. The stack is not a scroll container anymore, so focus indicators stay fully visible.
- Heading: Default headings keep their size and stay responsive to `data-density` even when `default-fonts` is not imported.
