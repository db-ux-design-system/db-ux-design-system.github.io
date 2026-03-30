import type { PlaygroundConfig } from '../types';

export const backdropConfig: PlaygroundConfig<any> = {
	defaultProps: {
		emphasis: 'strong',
	},
	properties: [
		{
			name: 'emphasis',
			label: 'Emphasis',
			type: 'select',
			defaultValue: 'strong',
			description: 'The emphasis attribute divides in between a weak or strong importance.',
			options: [
				{ label: 'Strong', value: 'strong', default: true },
				{ label: 'Weak', value: 'weak', default: false },
			],
		},
		{
			name: 'open',
			label: 'Show Backdrop',
			type: 'checkbox',
			defaultValue: false,
			description: 'Shows or hides the backdrop.',
		},
	],
};
