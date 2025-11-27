
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
		