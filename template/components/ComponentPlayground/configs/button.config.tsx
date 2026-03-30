import type { PlaygroundConfig } from '../types';
import { DBButton, type DBButtonProps, DBTooltip } from '@db-ux/react-core-components';
import { IconOption } from '@components/ComponentPlayground/configs/_icon.option.tsx';

export const buttonConfig: PlaygroundConfig<DBButtonProps> = {
	render: (props) => {
		if (props.noText) {
			const text = props.text;
			props.showIcon = true;
			props.showIconLeading = true;
			props.text = undefined;
			return (
				<DBButton type="button" {...props}>
					{text}
					<DBTooltip>{text}</DBTooltip>
				</DBButton>
			);
		}

		return <DBButton type="button" text={props.text} {...props} />;
	},
	defaultProps: {
		size: 'medium',
		variant: 'outlined',
	},
	slots: [{ name: 'children', description: 'default slot' }],
	events: [{ name: 'click / onClick', type: '---' }],
	properties: [
		{
			name: 'text',
			type: 'text',
			label: 'Text',
			description: 'Alternative for default slot/children.',
			defaultValue: 'Text',
			showInPlayground: true,
		},
		{
			name: 'variant',
			type: 'select',
			label: 'Variant',
			description: 'Variant of the button.',
			defaultValue: 'outlined',
			showInPlayground: true,
			options: [
				{ value: 'outlined', label: 'Outlined', default: true },
				{ value: 'brand', label: 'Brand' },
				{ value: 'filled', label: 'Filled' },
				{ value: 'ghost', label: 'Ghost' },
			],
		},
		{
			name: 'size',
			type: 'select',
			label: 'Size',
			description: 'The size attribute changes the font-size and other related sizes.',
			defaultValue: 'medium',
			showInPlayground: true,
			options: [
				{ value: 'small', label: 'Small' },
				{ value: 'medium', label: 'Medium', default: true },
			],
		},
		{
			name: 'width',
			type: 'select',
			label: 'Width',
			description: 'Width of the component.',
			defaultValue: 'auto',
			showInPlayground: true,
			options: [
				{ value: 'auto', label: 'Auto', default: true },
				{ value: 'full', label: 'Full' },
			],
		},
		{
			name: 'icon-leading',
			alternativeName: 'iconLeading',
			...IconOption,
			label: 'Icon Leading',
			description: 'Icon identifier for the leading icon.',
			defaultValue: 'x_placeholder',
			showInPlayground: true,
			dependsOn: 'show-icon-leading',
		},
		{
			name: 'icon-trailing',
			alternativeName: 'iconTrailing',
			...IconOption,
			label: 'Icon Trailing',
			description: 'Icon identifier for the trailing icon.',
			defaultValue: 'x_placeholder',
			showInPlayground: true,
			dependsOn: 'show-icon-trailing',
		},
		{
			name: 'icon',
			...IconOption,
			label: 'Icon',
			defaultValue: 'x_placeholder',
			dependsOn: 'no-text',
			showInPlayground: true,
			description: 'Define an icon by its identifier.',
		},
		{
			name: 'no-text',
			alternativeName: 'noText',
			type: 'checkbox',
			label: 'No Text',
			description: 'Hide text, show icon only.',
			defaultValue: false,
			showInPlayground: true,
		},
		{
			name: 'show-icon',
			alternativeName: 'showIcon',
			type: 'checkbox',
			label: 'Show Icon',
			description: 'Enables the leading icon.',
			defaultValue: true,
			showInPlayground: false,
		},
		{
			name: 'show-icon-leading',
			alternativeName: 'showIconLeading',
			type: 'checkbox',
			label: 'Show Icon Leading',
			defaultValue: false,
			showInPlayground: true,
			description: 'Enables or disables the visibility of the leading icon.',
			dependsOn: { prop: 'no-text', value: 'false' },
		},
		{
			name: 'show-icon-trailing',
			alternativeName: 'showIconTrailing',
			type: 'checkbox',
			label: 'Show Icon Trailing',
			description: 'Enables the trailing icon.',
			defaultValue: false,
			showInPlayground: true,
			dependsOn: { prop: 'no-text', value: 'false' },
		},
		{
			name: 'disabled',
			type: 'checkbox',
			label: 'Disabled',
			description: 'Disables the button.',
			defaultValue: false,
			showInPlayground: true,
		},
		{
			name: 'type',
			type: 'select',
			label: 'Type',
			description: 'The type attribute specifies the type of button.',
			defaultValue: 'button',
			showInPlayground: false,
			options: [
				{ value: 'button', label: 'Button', default: true },
				{ value: 'submit', label: 'Submit' },
				{ value: 'reset', label: 'Reset' },
			],
		},
		{
			name: 'id',
			type: 'text',
			label: 'ID',
			defaultValue: '',
			showInPlayground: false,
			description: 'ID of the component.',
		},
		{
			name: 'className',
			type: 'text',
			label: 'Class Name',
			defaultValue: '',
			showInPlayground: false,
			description: 'React className.',
		},
		{
			name: 'name',
			type: 'text',
			label: 'Name',
			defaultValue: '',
			showInPlayground: false,
			description: 'Name attribute.',
		},
		{
			name: 'form',
			type: 'text',
			label: 'Form',
			defaultValue: '',
			showInPlayground: false,
			description: 'Associates with a form element.',
		},
		{
			name: 'value',
			type: 'text',
			label: 'Value',
			defaultValue: '',
			showInPlayground: false,
			description: 'Initial value.',
		},
	],
};
