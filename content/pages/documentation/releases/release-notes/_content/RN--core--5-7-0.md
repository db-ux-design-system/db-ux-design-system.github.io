---
hidePage: true
category: 'Core'
version: 'v5.7.0'
date: '2026-10-08'
---

### Development

#### Added

- Tooltip: The appear delay can now be customized via the `--db-animation-delay` custom property.

#### Changed

- Select: The empty option of a placeholder or floating label select now carries the native `hidden` attribute instead of being hidden through a conditional style rule, so the state lives in the markup.
  - Consumers who write the markup by hand and relied on our stylesheet hiding `data-show-empty-option="false"` need to set `hidden` on that option instead.

#### Fixed

- Popover: The gap distance now matches the Tooltip, using `$db-spacing-fixed-sm` instead of `$db-spacing-fixed-md`, keeping the spacing consistent with the design.
- Control Panel: Full-width action groups now wrap onto the next line instead of overflowing horizontally, both in the mobile drawer footer and the desktop vertical orientation.
- Custom Select: Keyboard navigation now skips group titles consistently across React, Vue, Angular and Web Components by iterating the flat list of option inputs.
- Dialog Header: The dialog's `aria-labelledby` is now composed after attribute forwarding has landed, so a consumer `aria-label` or `aria-labelledby` is no longer clobbered by a stale token on the Angular and Web Component outputs.
- Icons: Layout shift while the icon font is loading no longer occurs in WebKit.
- Tabs: A vertical tab list nested inside a horizontal Tabs no longer shows a stray vertical scrollbar at fractional browser zoom, matching a standalone vertical tab list.
