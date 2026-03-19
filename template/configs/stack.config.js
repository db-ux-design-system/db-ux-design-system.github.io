export const stackConfig = {
	component: 'DBStack',
	elementId: 'demo-stack',
	defaultProps: {
		gap: 'medium',
		variant: 'simple',
		direction: 'column',
		alignment: 'stretch'
	},
	slots: [
		{
			name: 'children',
			description: 'default slot',
		}
	],
	properties: [
		{
			name: 'direction',
			type: 'select',
			label: 'Direction',
			description: 'Set the direction of the stack. Defaults to "column"',
			defaultValue: 'column',
			showInPlayground: true,
			options: [
				{ value: 'column', label: 'Column', default: true },
				{ value: 'row', label: 'Row' }
			]
		},
		{
			name: 'gap',
			type: 'select',
			label: 'Gap',
			description: 'Set the gap/spacing between elements',
			defaultValue: 'medium',
			showInPlayground: true,
			options: [
				{ value: 'none', label: 'None' },
				{ value: '3x-small', label: '3x-small' },
				{ value: '2x-small', label: '2x-small' },
				{ value: 'x-small', label: 'x-small' },
				{ value: 'small', label: 'Small' },
				{ value: 'medium', label: 'Medium', default: true },
				{ value: 'large', label: 'Large' },
				{ value: 'x-large', label: 'x-large' },
				{ value: '2x-large', label: '2x-large' },
				{ value: '3x-large', label: '3x-large' }
			]
		},
		{
			name: 'variant',
			type: 'select',
			label: 'Variant',
			description: 'Change variant of stack. To use variant="divider" add a DBDivider after each element',
			defaultValue: 'simple',
			showInPlayground: true,
			options: [
				{ value: 'simple', label: 'Simple', default: true },
				{ value: 'divider', label: 'Divider' }
			]
		},
		{
			name: 'alignment',
			type: 'select',
			label: 'Alignment',
			description: 'Represents css align-items',
			defaultValue: 'stretch',
			showInPlayground: true,
			options: [
				{ value: 'stretch', label: 'Stretch', default: true },
				{ value: 'start', label: 'Start' },
				{ value: 'end', label: 'End' },
				{ value: 'center', label: 'Center' }
			]
		},
		{
			name: 'justify-content / justifyContent',
			alternativeName: 'justifyContent',
			type: 'select',
			label: 'Justify Content',
			description: 'Represents css justify-content',
			defaultValue: 'start',
			showInPlayground: true,
			options: [
				{ value: 'start', label: 'Start', default: true },
				{ value: 'end', label: 'End' },
				{ value: 'center', label: 'Center' },
				{ value: 'space-between', label: 'Space Between' }
			]
		},
		{
			name: 'wrap',
			type: 'checkbox',
			label: 'Wrap',
			description: 'If the stack should wrap if parent is too small otherwise you get an overflow',
			defaultValue: false,
			showInPlayground: false
		},
		{
			name: 'id',
			type: 'text',
			label: 'ID',
			description: 'ID of the component, generated automatically for some components as a fallback if unset.',
			defaultValue: '',
			showInPlayground: false
		},
		{
			name: 'className',
			type: 'text',
			label: 'Class Name',
			description: 'React specific for adding className to the component.',
			defaultValue: '',
			showInPlayground: false
		}
	]
};
