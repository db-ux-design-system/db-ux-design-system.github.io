---
inclusion: fileMatch
fileMatchPattern: 'content/pages/documentation/**'
---

# Documentation Pages Structure

## File Location

All component documentation pages are located in:
`content/pages/documentation/components/[component-name].mdx`

## Frontmatter Template

```yaml
---
order: [number]
layout: '@template/layouts/documentation'
sectionSpacing: 'small'
sectionWidth: 'auto'
headline: '[ComponentName]'
title: '[ComponentName]'
description: '[Short description of the component]'
align: start
toc: true
status: 'stable' # optional
---
```

## Required Imports

```jsx
import { DB[Component], DBSection } from '@db-ux/react-core-components';
import CollapseButton from '@template/components/CollapseButton/CollapseButton.astro';
import CollapsibleWrapper from '@template/components/CollapseButton/CollapsibleWrapper.astro';
import GuidelineExample from '@template/components/GuidelineExample/GuidelineExample.astro';
import ResourceCards from '@template/components/ResourceCards/ResourceCards.astro';
import TeaserCard from '@template/components/TeaserCard/TeaserCard.astro';
import QuestionForm from '@template/components/QuestionForm/QuestionForm.astro';
import ComponentPlayground from '@template/components/ComponentPlayground/ComponentPlayground.astro';
import PropertiesTable from '@template/components/PropertiesTable/PropertiesTable.astro';
import { [component]Config } from '@template/configs/[component].config.js';
```

## Page Structure (in order)

1. **Use Cases** – Bullet list of use cases
2. **Playground** – `<ComponentPlayground config={...} component={...} />`
3. **Resources** – `<ResourceCards resources={[...]} />`
4. **Properties, Slots & Events** – `<PropertiesTable config={...} />` inside `<CollapsibleWrapper>`
5. **Guidelines** – `<GuidelineExample>` pairs (do/dont/caution) inside `<CollapsibleWrapper>`
6. **FAQ** – `<QuestionForm componentName="..." />`
7. **Related Content** – `<TeaserCard teasers={[...]} />`

## Important Rules

- Always wrap content sections in `<DBSection spacing="small" width="auto">`
- Use `<CollapsibleWrapper collapsedHeight="320px">` for long content
- Always add `<CollapseButton>` after collapsible content
- Guidelines must use `<div className="guideline-examples">` wrapper
- GuidelineExample variant is either "do", "dont", or "caution"
- All Figma URLs must use embed format with node-id parameter
- Component config must be imported and passed to ComponentPlayground and PropertiesTable
- Documentation pages must be sorted alphabetically by component name using the `order` field
