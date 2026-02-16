--- START: Documentation Pages Structure – do not edit below ---

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

### 1. Use Cases (Bullet List)
```markdown
- [Use case 1]
- [Use case 2]
- [Use case 3]
```

### 2. Playground Section
```jsx
<DBSection spacing="small" width="auto">

## Playground
Experiment with the [Component] component and its properties.

<ComponentPlayground config={[component]Config} component={DB[Component]} />

</DBSection>
```

### 3. Resources Section
```jsx
<DBSection spacing="small" width="auto">

## Resources

<ResourceCards
	resources={[
		{
			title: 'React',
			description: 'Interactive examples and documentation.',
			url: 'https://design-system.deutschebahn.com/core-web/review/main/react-storybook',
			icon: 'react',
		},
		{
			title: 'Vue',
			description: 'Interactive examples and documentation.',
			url: 'https://design-system.deutschebahn.com/core-web/review/main/vue-storybook',
			icon: 'vue',
		},
		{
			title: 'Angular',
			description: 'Interactive examples and documentation.',
			url: 'https://design-system.deutschebahn.com/core-web/review/main/angular-storybook',
			icon: 'angular',
		},
		{
			title: 'Web Components',
			description: 'Interactive examples and documentation.',
			url: 'https://design-system.deutschebahn.com/core-web/review/main/angular-storybook',
			icon: 'html5',
		},
	]}
/>

</DBSection>
```

### 4. Properties, Slots & Events Section

**Section title depends on what's available in the config:**
- If component has properties, slots, AND events: `## Properties, Slots & Events`
- If component has only properties and slots: `## Properties & Slots`
- If component has only properties: `## Properties`

**CollapseButton text must match the section title:**
- Full: `"Show all Properties, Slots & Events"` / `"Hide some Properties, Slots & Events"`
- Properties & Slots: `"Show all Properties & Slots"` / `"Hide some Properties & Slots"`
- Properties only: `"Show all Properties"` / `"Hide some Properties"`

```jsx
<DBSection spacing="small" width="auto">

## Properties, Slots & Events

Configure the [component] through its properties, such as [property examples].

<CollapsibleWrapper collapsedHeight="320px">

<PropertiesTable config={[component]Config} />

</CollapsibleWrapper>

<CollapseButton
	collapsedText="Show all Properties, Slots & Events"
	expandedText="Hide some Properties, Slots & Events"
/>

</DBSection>
```

### 5. Guidelines Section
```jsx
<DBSection spacing="small" width="auto">

## Guidelines

<CollapsibleWrapper collapsedHeight="320px">

###### [Guideline Title]

[Guideline description text]

<div className="guideline-examples">
	<GuidelineExample
		variant="do"
		figmaUrl="https://embed.figma.com/design/[designId]?node-id=[nodeId]&embed-host=share"
		description="[Description of correct usage]"
	/>
	<GuidelineExample
		variant="dont"
		figmaUrl="https://embed.figma.com/design/[designId]?node-id=[nodeId]&embed-host=share"
		description="[Description of incorrect usage]"
	/>
</div>

[Repeat for each guideline]

</CollapsibleWrapper>

<CollapseButton collapsedText="Show all Guidelines" expandedText="Hide some Guidelines" />

</DBSection>
```

### 6. FAQ Section
```jsx
<DBSection spacing="small" width="auto">

## FAQ

Have a question about the [Component] component? We'll answer it and add frequently asked questions to this page.

<QuestionForm componentName="[ComponentName]" />

</DBSection>
```

### 7. Related Content Section
```jsx
<DBSection spacing="small" width="auto">

## Related Content

<TeaserCard
	teasers={[
		{
			title: '[RelatedComponent]',
			description: '[Short description]',
			url: '/documentation/components/[slug]',
		},
		{
			title: '[RelatedComponent]',
			description: '[Short description]',
			url: '/documentation/components/[slug]',
		},
	]}
/>

</DBSection>
```

## Component Config File
Each component needs a config file at:
`template/configs/[component].config.js`

Config structure:
```js
export const [component]Config = {
	component: 'DB[Component]',
	elementId: 'demo-[component]',
	textElementId: '[component]-text', // optional
	defaultText: '[Default text]',
	defaultProps: {
		// default property values
	},
	properties: [
		{
			name: '[property-name]',
			type: 'select' | 'text' | 'checkbox',
			label: '[Label]',
			description: '[Description]',
			defaultValue: '[value]',
			showInPlayground: true | false,
			options: [ // only for type: 'select'
				{ value: '[value]', label: '[Label]', default: true }
			]
		}
	],
	slots: [
		{
			name: '[slot-name]',
			description: '[description]',
		}
	],
	events: [
		{
			name: '[event-name]',
			type: '[type]',
		}
	]
};
```

## Property Order in Config
- Properties in the config should be ordered logically based on user workflow
- Start with fundamental properties (e.g., direction, size, variant)
- Follow with styling properties (e.g., spacing, alignment)
- End with advanced/optional properties
- Example order: direction → gap → variant → alignment → justify-content

## Documentation Page Order
- All component documentation pages must be sorted alphabetically by component name
- Use the `order` field in frontmatter to control the alphabetical sorting
- Example: Accordion (order: 1), Badge (order: 2), Button (order: 3), etc.

## Important Notes
- Always wrap content in `<DBSection spacing="small" width="auto">`
- Use `<CollapsibleWrapper collapsedHeight="320px">` for long content
- Always add `<CollapseButton>` after collapsible content
- Guidelines must use `<div className="guideline-examples">` wrapper
- GuidelineExample variant is either "do", "dont", or "caution"
- All Figma URLs must use embed format with node-id parameter
- Component config must be imported and passed to ComponentPlayground and PropertiesTable

--- END: Documentation Pages Structure – do not edit above ---
