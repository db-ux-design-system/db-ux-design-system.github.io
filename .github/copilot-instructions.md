
--- START: DB UX Copilot Instructions – do not edit below ---

> **NOTE**: Always use "DB UX" components and variables as project's conventions
# @db-ux/core-components
## Best Practise / Common AI mistakes

- always read this file if you use Components: `node_modules/@db-ux/core-components/agent/Best-Practise_Common-AI-Mistakes.md`


# @db-ux/core-foundations
## CSS

- If you use CSS, follow these rules:
    - Always reference the file `node_modules/@db-ux/core-foundations/agent/css/Variables.md` for variables like sizing, spacing, elevation, border, or container-size. This file contains the authoritative list of available variables.
    - Use the examples provided in `Variables.md` to ensure correct usage like:
        - `padding: var(--db-spacing-fixed-md);`
        - `height: var(--db-sizing-md);`
        - `width: var(--db-container-xs);`
        - `color: var(--db-adaptive-on-bg-basic-emphasis-90-default);`
        - `background-color: var(--db-adaptive-bg-basic-level-2-default);`
        - `font: var(--db-type-body-sm);`

## SCSS

- If you use SCSS, follow these rules:
    - Always reference the file `node_modules/@db-ux/core-foundations/agent/scss/Variables.md` for variables like sizing, spacing, elevation, border, or container-size. This file contains the authoritative list of available variables.
    - Use the examples provided in `Variables.md` to ensure correct usage.
    - Always use `@use` for imports:
        - Variables: `@use "@db-ux/core-foundations/build/styles/variables";`
        - Colors: `@use "@db-ux/core-foundations/build/styles/colors";`
        - Fonts: `@use "@db-ux/core-foundations/build/styles/fonts";`
        - Never use `as *` for the `@use`, use it like this:
            - `padding: variables.$db-spacing-fixed-md;`
            - `height: variables.$db-sizing-md;`
            - `width: variables.$db-container-xs;`
            - `color: colors.$db-adaptive-on-bg-basic-emphasis-90-default;`
            - `background-color: colors.$db-adaptive-bg-basic-level-2-default;`
            - `font: fonts.$db-type-body-sm;`

## Tailwind

- If you use Tailwind, follow these rules:
    - Always reference the file `node_modules/@db-ux/core-foundations/agent/tailwind/Variables.md` for variables like sizing, spacing, elevation, border, or container-size. This file contains the authoritative list of available variables.
    - Use the examples provided in `Variables.md` to ensure correct usage like:
        - padding: `p-fix-md`
        - height: `h-siz-md`
        - width: `w-container-xs`
        - color: `text-adaptive-on-bg-basic-emphasis-90-default`
        - background-color: `bg-adaptive-bg-basic-level-2-default`
        - font: `text-body-sm`
    - Always stick to the variables. Don't use values like `p-4` or `m-[16px]`; use `p-fix-xs` or `m-fix-md` instead.

## Figma MCP

- If you use Figma MCP always generate code with project's conventions, such as using @db-ux/core-components and @db-ux/core-foundations.
- If a code snippet from Figma MCP has a font-family with "DB Neo Screen Head" use HTML headlines (`<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>` HTML tags).
- If the headline has a `font-weight: 300;` use `data-variant="light"` additionally.
- If a code snippet has a Figma `Mode`, add it as `data-xxx`, where `xxx` is the mode in lower-case.

### Tailwind

If you use tailwind follow those rules as well:

- Don't use values like `p-4` or `m-[16px]`; use `p-fix-xs` or `m-fix-md` instead.
- Never use something like `font-['DB_Neo_Screen_Head']` and `leading-[48px]` instead use `text-head-xx` class, where `-xx` can be a t-shirt size from `3xs` to `3xl`; If it has a `font-wight:300;` use `text-head-light-xx` instead.


# @db-ux/react-core-components
- Use "@db-ux/react-core-components" as import for components:
  - use for `DBDrawer` or `Drawer` the file node_modules/@db-ux/react-core-components/agent/Drawer.md
  - use for `DBTooltip` or `Tooltip` the file node_modules/@db-ux/react-core-components/agent/Tooltip.md
  - use for `DBTextarea` or `Textarea` the file node_modules/@db-ux/react-core-components/agent/Textarea.md
  - use for `DBTag` or `Tag` the file node_modules/@db-ux/react-core-components/agent/Tag.md
  - use for `DBTabs` or `Tabs` the file node_modules/@db-ux/react-core-components/agent/Tabs.md
  - use for `DBTabItem` or `TabItem` the file node_modules/@db-ux/react-core-components/agent/TabItem.md
  - use for `DBSwitch` or `Switch` the file node_modules/@db-ux/react-core-components/agent/Switch.md
  - use for `DBStack` or `Stack` the file node_modules/@db-ux/react-core-components/agent/Stack.md
  - use for `DBSelect` or `Select` the file node_modules/@db-ux/react-core-components/agent/Select.md
  - use for `DBSection` or `Section` the file node_modules/@db-ux/react-core-components/agent/Section.md
  - use for `DBRadio` or `Radio` the file node_modules/@db-ux/react-core-components/agent/Radio.md
  - use for `DBPopover` or `Popover` the file node_modules/@db-ux/react-core-components/agent/Popover.md
  - use for `DBPage` or `Page` the file node_modules/@db-ux/react-core-components/agent/Page.md
  - use for `DBNotification` or `Notification` the file node_modules/@db-ux/react-core-components/agent/Notification.md
  - use for `DBNavigationItem` or `NavigationItem` the file node_modules/@db-ux/react-core-components/agent/NavigationItem.md
  - use for `DBNavigation` or `Navigation` the file node_modules/@db-ux/react-core-components/agent/Navigation.md
  - use for `DBLink` or `Link` the file node_modules/@db-ux/react-core-components/agent/Link.md
  - use for `DBInput` or `Input` the file node_modules/@db-ux/react-core-components/agent/Input.md
  - use for `DBInfotext` or `Infotext` the file node_modules/@db-ux/react-core-components/agent/Infotext.md
  - use for `DBIcon` or `Icon` the file node_modules/@db-ux/react-core-components/agent/Icon.md
  - use for `DBHeader` or `Header` the file node_modules/@db-ux/react-core-components/agent/Header.md
  - use for `DBDivider` or `Divider` the file node_modules/@db-ux/react-core-components/agent/Divider.md
  - use for `DBCustomSelect` or `CustomSelect` the file node_modules/@db-ux/react-core-components/agent/CustomSelect.md
  - use for `DBCheckbox` or `Checkbox` the file node_modules/@db-ux/react-core-components/agent/Checkbox.md
  - use for `DBCard` or `Card` the file node_modules/@db-ux/react-core-components/agent/Card.md
  - use for `DBButton` or `Button` the file node_modules/@db-ux/react-core-components/agent/Button.md
  - use for `DBBrand` or `Brand` the file node_modules/@db-ux/react-core-components/agent/Brand.md
  - use for `DBBadge` or `Badge` the file node_modules/@db-ux/react-core-components/agent/Badge.md
  - use for `DBAccordionItem` or `AccordionItem` the file node_modules/@db-ux/react-core-components/agent/AccordionItem.md
  - use for `DBAccordion` or `Accordion` the file node_modules/@db-ux/react-core-components/agent/Accordion.md

--- END: DB UX Copilot Instructions – do not edit above ---


# onePlatform Guidelines

These instructions tell GitHub Copilot how to write, structure and propose content inside this repository.
They ensure code & content generation is consistent with our architecture and expectations.

---

## 📁 Project Structure Rules

| Location | Purpose |
|---|---|
| content/pages/... | Real page content (MD/MDX only) |
| content/pages/**/_components | Page-local components — only used on that page |
| template/components/... | Global reusable Astro/React UI components |
| template/utils/... | Shared logic, navigation, helpers, transforms |
| public/static/... | Assets served directly without processing |
| styles/... | Global CSS, tokens, utilities |

Copilot must ask before creating files outside this structure.

---

## 🏗 Content Creation Rules

### Markdown / MDX Pages
- Always place pages under `content/pages/<section>/index.mdx`
- The folder name becomes the navigation label unless overridden
- Avoid deeply nested pages — prefer `_components` for reuse

Example:

`content/pages/resources/documentation/index.mdx`

`content/pages/resources/documentation/getting-started/index.mdx`

---

### Frontmatter Standards

| Field | Type | Default | Meaning |
|---|---|---|---|
| title | string | required | Visible page heading |
| order | number | 999 | Sorting (lower = earlier) |
| hidePage | boolean | false | Page exists but should redirect to child |
| isSubNavigation | boolean | false | Children render sidebar |
| nav | boolean | true | Exclude page from main nav if false |

Example:

```bash
---
title: "Foundations"
order: 1
isSubNavigation: true
---
```

---

## 🧭 Navigation Behavior

Navigation is generated automatically from folder structure — not from config files.

Page is visible when:

`index.mdx` exists AND `hidePage:false` AND `nav:true`

Subnavigation appears when:

`parent.isSubNavigation == true`

If `hidePage: true` → page URL forwards to its first child.

---

## 🧩 Component Rules

| Type | Location | Notes |
|---|---|---|
| Reusable components | template/components/** | Should have .astro + optional .css/.tsx |
| Page-local components | content/pages/**/_components | Only used within single page |
| Interactive logic | use .astro wrapper + .tsx island | No logic directly in MDX |
| No inline CSS | Always extract to .css |

Component architecture:

📁 Component.astro — markup only  
📁 Component.css — styling  
📁 Component.tsx — (optional) interaction

---

## 🌗 Theme / ColorMode Rules

`data-mode="light|dark"` lives on `.db-shell`

Copilot MUST:
- use existing provider
- not create new theme toggles
- prefer tokens & CSS vars over raw colors

---

## 🧪 Code Quality Requirements

| Rule | Reason |
|---|---|
| prettier + eslint must autoformat | readability |
| no unused imports | hygiene |
| avoid console.log in final merges | cleanliness |
| do not place CSS in Astro markup | separation of concerns |
| always type props | maintainability |

---

## 🚨 If unsure — ask BEFORE generating

Good Copilot messages:

"Should this be global or page-local?"

"Do you want this config in frontmatter or TS?"

Bad Copilot behavior:

❌ modify navigation manually  
❌ inline CSS  
❌ write logic inside MDX directly

---

## Final Rule

If Copilot is unsure, it must ask.  
Otherwise, it may generate confidently.