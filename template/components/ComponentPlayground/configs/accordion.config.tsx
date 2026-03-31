import type { PlaygroundConfig } from '../types';
import { DBAccordion, DBAccordionItem, type DBAccordionProps } from '@db-ux/react-core-components';

export const accordionConfig: PlaygroundConfig<DBAccordionProps> = {
	render: (props) => {
		return (
			<DBAccordion {...props}>
				<DBAccordionItem headline="Headline 1">Content 1</DBAccordionItem>
				<DBAccordionItem headline="Headline 2">Content 2</DBAccordionItem>
				<DBAccordionItem headline="Headline 3">Content 3</DBAccordionItem>
			</DBAccordion>
		);
	},
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
			options: [
				{ label: 'Divider', value: 'divider', default: true },
				{ label: 'Card', value: 'card', default: false },
			],
		},
	],
};
