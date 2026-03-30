import type { PlaygroundConfig } from '../types';
import type { DBAccordionProps } from '@db-ux/react-core-components';

export const accordionConfig: PlaygroundConfig<DBAccordionProps> = {
	defaultProps: {
		behavior: 'multiple',
		variant: 'divider',
	},
	properties: [
		{
			name: 'behavior',
			label: 'Behavior',
			type: 'select',
			defaultValue: 'multiple',
			description: 'Controls whether multiple or single items can be open.',
			options: [
				{ label: 'Multiple', value: 'multiple', default: true },
				{ label: 'Single', value: 'single', default: false },
			],
		},
		{
			name: 'variant',
			label: 'Variant',
			type: 'select',
			defaultValue: 'divider',
			description: 'Visual variant of the accordion.',
			options: [
				{ label: 'Divider', value: 'divider', default: true },
				{ label: 'Card', value: 'card', default: false },
			],
		},
	],
	slots: [
		{
			name: 'children',
			description: 'default slot',
		},
	],
};
