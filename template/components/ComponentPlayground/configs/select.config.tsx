import type { PlaygroundConfig } from '../types';
import { DBSelect, type DBSelectProps } from '@db-ux/react-core-components';
import {IconOption} from "@components/ComponentPlayground/configs/_icon.option.tsx";

export const selectConfig: PlaygroundConfig<DBSelectProps> = {
	render: (props) => {
		return (
			// eslint-disable-next-line db-ux/form-label-required
			<DBSelect {...props}>
				<option value="1">Option 1</option>
				<option value="2">Option 2</option>
				<option value="3">Option 3</option>
			</DBSelect>
		);
	},
	defaultProps: {
		label: 'Label',
		placeholder: 'Placeholder',
	},
	slots: [
		{
			name: 'children',
			description: 'default slot',
		},
	],
	events: [
		{
			name: 'click / onClick',
			type: '---',
		},
		{
			name: 'input / onInput',
			type: '---',
		},
		{
			name: 'change / onChange',
			type: '---',
		},
		{
			name: 'blur / onBlur',
			type: '---',
		},
		{
			name: 'focus / onFocus',
			type: '---',
		},
	],
	properties: [
		{
			name: 'variant',
			label: 'Variant',
			type: 'select',
			description: 'Change the variant of the label to float or hidden',
			options: [
				{ value: 'above', label: 'Above', default: true },
				{ value: 'floating', label: 'Floating' },
			],
			showInPlayground: true,
		},
		{
			name: 'show-label',
			alternativeName: 'showLabel',
			label: 'Show Label',
			type: 'checkbox',
			defaultValue: true,
			description: 'Enables/disables the visibility of the label',
			showInPlayground: true,
			dependsOn: { prop: 'variant', value: 'above' },
		},
		{
			name: 'label',
			label: 'Label',
			type: 'text',
			defaultValue: 'Label',
			description: 'The label attribute specifies the caption of the form element.',
			showInPlayground: true,
		},

		// Placeholder
		{
			name: 'placeholder',
			label: 'Placeholder',
			type: 'text',
			defaultValue: 'Placeholder',
			description: 'Text that appears in the form control when it has no value set',
			showInPlayground: true,
		},
		// States
		{
			name: 'disabled',
			label: 'Disabled',
			type: 'checkbox',
			defaultValue: false,
			description:
				'The disabled attribute can be set to keep a user from clicking on the form element.',
			showInPlayground: true,
		},
		{
			name: 'required',
			label: 'Required',
			type: 'checkbox',
			defaultValue: false,
			description:
				"When the required attribute specified, the user will be required to fill the form element before submitting the form. The form element will be marked semantically as required and by default also visually with an asterisk '*' next to the label (unless the property showRequiredAsterisk is also set with the value false).",
			showInPlayground: true,
		},
		// Validation
		{
			name: 'validation',
			label: 'Validation',
			type: 'select',
			description:
				'Marks an input element as invalid (red) / valid (green) / no-validation (grey). Overwrites the :user-valid selector.',
			options: [
				{ value: 'no-validation', label: 'No Validation', default: true },
				{ value: 'invalid', label: 'Invalid' },
				{ value: 'valid', label: 'Valid' },
			],
			showInPlayground: true,
		},
		{
			name: 'invalidMessage',
			alternativeName: 'invalid-message',
			label: 'Invalid Message',
			type: 'text',
			defaultValue: 'Invalid message',
			description: 'Helper message for invalid form components',
			showInPlayground: true,
			dependsOn: { prop: 'validation', value: 'invalid' },
		},
		{
			name: 'validMessage',
			alternativeName: 'valid-message',
			label: 'Valid Message',
			type: 'text',
			defaultValue: 'Valid message',
			description: 'Helper message for valid form components',
			showInPlayground: true,
			dependsOn: { prop: 'validation', value: 'valid' },
		},
		// Message
		{
			name: 'show-message',
			alternativeName: 'showMessage',
			label: 'Show Message',
			type: 'checkbox',
			defaultValue: false,
			description: 'Enables or disables the visibility of the message.',
			showInPlayground: true,
			dependsOn: { prop: 'validation', value: 'no-validation' },
		},
		{
			name: 'message',
			label: 'Message',
			type: 'text',
			defaultValue: 'Message',
			description: 'Optional helper message for form components',
			showInPlayground: true,
			dependsOn: 'show-message',
		},
		// Icon
		{
			name: 'show-icon',
			alternativeName: 'showIcon',
			label: 'Show Icon',
			type: 'checkbox',
			defaultValue: false,
			description:
				'Enables or disables the visibility of the icon. The default value depends on the component. For many components this property is optional to reflect Figma properties.',
			showInPlayground: true,
		},
		{
			name: 'icon',
			label: 'Icon',
			...IconOption,
			defaultValue: 'x_placeholder',
			description:
				'Define an icon by its identifier to get displayed in front of the elements content.',
			showInPlayground: true,
			dependsOn: 'show-icon',
		},
		// Hidden properties
		{
			name: 'id',
			type: 'text',
			label: 'ID',
			description:
				'ID of the component, generated automatically for some components as a fallback if unset.',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'value',
			type: 'text',
			label: 'Value',
			description: 'The value property is to receive results from the native form element.',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'showEmptyOption',
			alternativeName: 'show-empty-option',
			label: 'Show Empty Option',
			type: 'checkbox',
			defaultValue: false,
			description:
				"Controls whether the empty placeholder option is shown in the dropdown after the user's selection of another option. By default, it is shown for non-required selects and hidden for required selects. Set to true to always show or false to always hide the empty option. Note: The empty option is only rendered when variant === 'floating' or a placeholder is set. Setting showEmptyOption alone has no effect if neither of these conditions is met.",
			showInPlayground: false,
		},
		{
			name: 'className',
			type: 'text',
			label: 'Class Name',
			description: 'React specific for adding className to the component.',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'show-required-asterisk',
			alternativeName: 'showRequiredAsterisk',
			label: 'Show Required Asterisk',
			type: 'checkbox',
			defaultValue: false,
			description:
				"This attribute allows to specify whether a form field which is marked as required will show a visual indicator (an asterisk '*'). It allows to prevent adding the visual indicator but still keep the field semantically required by setting its value to false. By default, its value is true, so the asterisk is shown when required is set.",
			showInPlayground: false,
		},
		{
			name: 'name',
			type: 'text',
			label: 'Name',
			description:
				"The name attribute gives the name of the form control, as used in form submission and in the form element's elements object.",
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'size',
			type: 'text',
			label: 'Size',
			description: 'Size of the control',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'autocomplete',
			label: 'Autocomplete',
			type: 'text',
			defaultValue: '',
			description: 'See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete',
			showInPlayground: false,
		},
		{
			name: 'multiple',
			label: 'Multiple',
			type: 'checkbox',
			defaultValue: false,
			description: 'No description',
			showInPlayground: false,
		},
		{
			name: 'ariaDescribedBy',
			alternativeName: 'aria-described-by',
			type: 'text',
			label: 'Aria Described By',
			description: 'Overwrites auto handling for aria-describedby.',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'options',
			type: 'text',
			label: 'Options',
			description: "If you don't/can't use children/slots you can pass in the options as an array.",
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'field-sizing',
			alternativeName: 'fieldSizing',
			label: 'Field Sizing',
			type: 'select',
			description: 'Adds shrinkwrap for input and textarea',
			options: [
				{ value: 'fixed', label: 'Fixed', default: true },
				{ value: 'content', label: 'Content' },
			],
			showInPlayground: false,
		},
		{
			name: 'messageIcon',
			alternativeName: 'message-icon',
			type: 'text',
			label: 'Message Icon',
			description: 'Set/overwrite icon for helper message for form components',
			defaultValue: '',
			showInPlayground: false,
		},
	],
};
