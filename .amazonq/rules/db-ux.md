
--- START: DB UX Amazon Q Instructions – do not edit below ---

> **NOTE**: Always use "DB UX" components and variables as project's conventions
# DB UX Design System Automation Core

CRITICAL: This workspace contains a dedicated automation and orchestration bundle under `./node_modules/@db-ux/agent-cli/db-ux-consumer-powers/`. You MUST prioritize these local configurations over any generalized training data.

1. **Global Steering & Guidelines**: Before writing any style or component logic, you MUST read and strictly enforce the global guidelines in `./node_modules/@db-ux/agent-cli/db-ux-consumer-powers/context/guidelines.md`.
2. **Task-Specific Workflows (Skills)**: For complex automated tasks, execute the procedural step-by-step workflows located in `./node_modules/@db-ux/agent-cli/db-ux-consumer-powers/skills/`. Specifically, when asked to implement a component, you MUST completely follow `./node_modules/@db-ux/agent-cli/db-ux-consumer-powers/skills/implement-component/SKILL.md`.
3. **Tool Capabilities**: Refer to `./node_modules/@db-ux/agent-cli/db-ux-consumer-powers/mcp.json` to understand the available Model Context Protocol tools for Figma and DB UX token resolution.

---

# @db-ux/core-components
## Best Practise / Common AI mistakes

- always read this file if you use Components: `node_modules/@db-ux/core-components/agent/Best-Practise_Common-AI-Mistakes.md`

## Styling Dependencies

Import the styles in `scss` or `css`. Based on your technology the file names could be different.

- `relative`: asset path point to `../assets`
- `webpack`: asset path point to `~@db-ux/core-foundations/assets`
- `rollup`: asset path point to `@db-ux/core-foundations/assets`

**Important**: These bundled files automatically include **all dependencies from [foundations](https://www.npmjs.com/package/@db-ux/core-foundations)** (design tokens, colors, fonts, etc.) **and all [components](https://github.com/db-ux-design-system/core-web/blob/main/packages/components/src/styles/db-ux-components.scss)** - everything you need in one import!

**CSS**

```css
// index.css
@import "@db-ux/core-components/build/styles/rollup.css";
```

> **Note:** Create a new `.css` file if not present to include the styles


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

### Import

#### Tailwind v4

```css
@import "tailwindcss";
@import "@db-ux/core-foundations/build/tailwind/theme/index.css";
```

#### Tailwind v3

> **Note:** In Tailwind v4 you can use the config with `@config "tailwind.config.[js|ts]";` inside your `.css` file as well.

After this you can extend your tailwind config like this:

```javascript
//tailwind.config.js
/** @type {import('tailwindcss').Config} */
import tokens from "@db-ux/core-foundations/build/tailwind/tailwind-tokens.json";

export default {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	plugins: [],
	theme: {
		...tokens,
		gap: ({ theme }) => ({
			...theme("spacing")
		}),
		space: ({ theme }) => ({
			...theme("spacing")
		})
	}
};
```

## Figma MCP

- If you use Figma MCP always generate code with project's conventions, such as using @db-ux/core-components and @db-ux/core-foundations.
- If a code snippet from Figma MCP has a font-family with "DB Neo Screen Head" use HTML headlines (`<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>` HTML tags).
- If the headline has a `font-weight: 300;` use `data-variant="light"` additionally.
- If a code snippet has a Figma `Mode`, add it as `data-xxx`, where `xxx` is the mode in lower-case.

### Tailwind

If you use tailwind follow those rules as well:

- Don't use values like `p-4` or `m-[16px]`; use `p-fix-xs` or `m-fix-md` instead.
- Never use something like `font-['DB_Neo_Screen_Head']` and `leading-[48px]` instead use `text-head-xx` class, where `-xx` can be a t-shirt size from `3xs` to `3xl`; If it has a `font-wight:300;` use `text-head-light-xx` instead.

## Stylelint Rules (Common CSS/SCSS Mistakes)

The `@db-ux/core-stylelint` plugin enforces design token usage. Never use raw `px`, `rem`, or hardcoded color values for the following properties:

### Spacings (`db-ux/use-spacings`)

- Applies to: `margin`, `padding`, `gap` (and all sub-properties like `margin-top`, `padding-inline`, etc.)
- Use `var(--db-spacing-fixed-xx)` or `var(--db-spacing-responsive-xx)` instead of `px`/`rem` values
- `var(--db-sizing-xx)`, `%`, `vw`, `vh`, `dvw`, `dvh`, `lvw`, `lvh`, `svw`, `svh` are also allowed
- Allowed exact values: `0px`, `0`, `auto`, `inherit`, `initial`, `unset`
- ❌ `margin: 20px;` / `padding: 0.5rem;` / `margin-top: 8px;`
- ✅ `margin: var(--db-spacing-fixed-md);` / `padding: var(--db-spacing-responsive-lg);`

### Sizing (`db-ux/use-sizing`)

- Applies to: `width`, `height`, `min-width`, `min-height`, `max-width`, `max-height`, `block-size`, `inline-size`
- Use `var(--db-sizing-xx)`, `var(--db-screen-xx)`, `var(--db-container-xx)`, `%`, `lh`, `ch`, `vw`, `vh` instead of `px`/`rem`
- Additional allowed values: `fit-content`, `max-content`, `min-content`, `none`, `revert`, `revert-layer`
- ❌ `width: 100px;` / `height: 50px;` / `block-size: 200px;`
- ✅ `width: var(--db-sizing-md);` / `height: 100%;` / `block-size: var(--db-screen-sm);`

### Border Radius (`db-ux/use-border-radius`)

- Applies to: all `border-*-radius` properties
- Use `var(--db-border-radius-xx)` instead of `px`/`rem`
- ❌ `border-radius: 4px;` / `border-top-left-radius: 0.5rem;`
- ✅ `border-radius: var(--db-border-radius-md);`

### Border Width (`db-ux/use-border-width`)

- Applies to: `border`, `border-top`, `border-right`, `border-bottom`, `border-left`, `border-block`, `border-block-start`, `border-block-end`, `border-inline`, `border-inline-start`, `border-inline-end`, and all `border-*-width` properties
- Use `var(--db-border-width-xx)` instead of `px`/`rem` for the width part
- ❌ `border: 1px solid transparent;` / `border-top: 2px solid red;`
- ✅ `border: var(--db-border-width-sm) solid transparent;`

### Border Color (`db-ux/use-border-color`)

- Applies to: same border properties as border-width, plus all `border-*-color` properties
- Use `var(--db-adaptive-on-bg-basic-emphasis-xx-default)` or `var(--db-adaptive-on-bg-inverted)` for border colors
- `transparent` and `currentcolor` are also allowed
- ❌ `border: 1px solid red;` / `border-color: #ff0;` / `border-top: 1px solid blue;`
- ✅ `border: var(--db-border-width-sm) solid var(--db-adaptive-on-bg-basic-emphasis-100-default);`

### General Notes

- CSS custom properties (`--my-var`) and SCSS variables (`$my-var`) are always allowed as values
- `0px`, `0`, `auto`, `inherit`, `initial`, `unset` are always allowed
- `calc()` expressions can be allowed via config option `allowCalc: true`


# @db-ux/react-core-components
- Use "@db-ux/react-core-components" as import for components:
  - use for `DBTooltip` or `Tooltip` the file node_modules/@db-ux/react-core-components/agent/Tooltip.md
  - use for `DBTextarea` or `Textarea` the file node_modules/@db-ux/react-core-components/agent/Textarea.md
  - use for `DBTag` or `Tag` the file node_modules/@db-ux/react-core-components/agent/Tag.md
  - use for `DBTabs` or `Tabs` the file node_modules/@db-ux/react-core-components/agent/Tabs.md
  - use for `DBTabItem` or `TabItem` the file node_modules/@db-ux/react-core-components/agent/TabItem.md
  - use for `DBSwitch` or `Switch` the file node_modules/@db-ux/react-core-components/agent/Switch.md
  - use for `DBStack` or `Stack` the file node_modules/@db-ux/react-core-components/agent/Stack.md
  - use for `DBShell` or `Shell` the file node_modules/@db-ux/react-core-components/agent/Shell.md
  - use for `DBSelect` or `Select` the file node_modules/@db-ux/react-core-components/agent/Select.md
  - use for `DBSection` or `Section` the file node_modules/@db-ux/react-core-components/agent/Section.md
  - use for `DBRadio` or `Radio` the file node_modules/@db-ux/react-core-components/agent/Radio.md
  - use for `DBPopover` or `Popover` the file node_modules/@db-ux/react-core-components/agent/Popover.md
  - use for `DBPage` or `Page` the file node_modules/@db-ux/react-core-components/agent/Page.md
  - use for `DBNotification` or `Notification` the file node_modules/@db-ux/react-core-components/agent/Notification.md
  - use for `DBNavigationItem` or `NavigationItem` the file node_modules/@db-ux/react-core-components/agent/NavigationItem.md
  - use for `DBNavigation` or `Navigation` the file node_modules/@db-ux/react-core-components/agent/Navigation.md
  - use for `DBLoadingIndicator` or `LoadingIndicator` the file node_modules/@db-ux/react-core-components/agent/LoadingIndicator.md
  - use for `DBLink` or `Link` the file node_modules/@db-ux/react-core-components/agent/Link.md
  - use for `DBInput` or `Input` the file node_modules/@db-ux/react-core-components/agent/Input.md
  - use for `DBInfotext` or `Infotext` the file node_modules/@db-ux/react-core-components/agent/Infotext.md
  - use for `DBIcon` or `Icon` the file node_modules/@db-ux/react-core-components/agent/Icon.md
  - use for `DBHeader` or `Header` the file node_modules/@db-ux/react-core-components/agent/Header.md
  - use for `DBDrawer` or `Drawer` the file node_modules/@db-ux/react-core-components/agent/Drawer.md
  - use for `DBDivider` or `Divider` the file node_modules/@db-ux/react-core-components/agent/Divider.md
  - use for `DBCustomSelect` or `CustomSelect` the file node_modules/@db-ux/react-core-components/agent/CustomSelect.md
  - use for `DBControlPanelNavigationItem` or `ControlPanelNavigationItem` the file node_modules/@db-ux/react-core-components/agent/ControlPanelNavigationItem.md
  - use for `DBControlPanelNavigation` or `ControlPanelNavigation` the file node_modules/@db-ux/react-core-components/agent/ControlPanelNavigation.md
  - use for `DBControlPanelMobile` or `ControlPanelMobile` the file node_modules/@db-ux/react-core-components/agent/ControlPanelMobile.md
  - use for `DBControlPanelMeta` or `ControlPanelMeta` the file node_modules/@db-ux/react-core-components/agent/ControlPanelMeta.md
  - use for `DBControlPanelDesktop` or `ControlPanelDesktop` the file node_modules/@db-ux/react-core-components/agent/ControlPanelDesktop.md
  - use for `DBControlPanelBrand` or `ControlPanelBrand` the file node_modules/@db-ux/react-core-components/agent/ControlPanelBrand.md
  - use for `DBCheckbox` or `Checkbox` the file node_modules/@db-ux/react-core-components/agent/Checkbox.md
  - use for `DBCard` or `Card` the file node_modules/@db-ux/react-core-components/agent/Card.md
  - use for `DBButton` or `Button` the file node_modules/@db-ux/react-core-components/agent/Button.md
  - use for `DBBrand` or `Brand` the file node_modules/@db-ux/react-core-components/agent/Brand.md
  - use for `DBBadge` or `Badge` the file node_modules/@db-ux/react-core-components/agent/Badge.md
  - use for `DBAccordionItem` or `AccordionItem` the file node_modules/@db-ux/react-core-components/agent/AccordionItem.md
  - use for `DBAccordion` or `Accordion` the file node_modules/@db-ux/react-core-components/agent/Accordion.md

--- END: DB UX Amazon Q Instructions – do not edit above ---
