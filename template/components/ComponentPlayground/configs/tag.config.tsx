import type { PlaygroundConfig } from '../types';
import { DBTag, type DBTagProps } from '@db-ux/react-core-components';
import { IconOption } from '@components/ComponentPlayground/configs/_icon.option.tsx';

export const tagConfig: PlaygroundConfig<
	DBTagProps & { childrenType: 'button' | 'checkbox' | 'radio'; disabled: boolean }
> = {
	render: ({ childrenType, behavior, disabled, text, ...rest }) => {
		if (behavior === 'static' || behavior === 'removable') {
			return <DBTag behavior={behavior} {...rest} text={text} />;
		}

		if (childrenType === 'button') {
			return (
				<DBTag {...rest}>
					<button disabled={disabled}>{text}</button>
				</DBTag>
			);
		}

		if (childrenType === 'checkbox' || childrenType === 'radio') {
			return (
				<DBTag {...rest}>
					<label htmlFor="tag-checkbox">
						<input disabled={disabled} id="tag-checkbox" type={childrenType} />
						{text}
					</label>
				</DBTag>
			);
		}

		return <></>;
	},
	defaultProps: {
		behavior: 'static',
		semantic: 'adaptive',
		emphasis: 'weak',
		id: 'playground-tag',
	},
	properties: [
		// Content
		{
			name: 'text',
			label: 'Text',
			type: 'text',
			defaultValue: 'Text',
		},
		// Appearance
		{
			name: 'behavior',
			label: 'Behavior',
			type: 'select',
			options: [
				{ value: 'static', label: 'Static', default: true },
				{ value: 'interactive', label: 'Interactive' },
				{ value: 'removable', label: 'Removable' },
			],
		},
		{
			name: 'childrenType',
			label: 'Children Type',
			type: 'select',
			options: [
				{ value: 'button', label: 'Button', default: true },
				{ value: 'checkbox', label: 'Checkbox' },
				{ value: 'radio', label: 'Radio' },
			],
			dependsOn: { prop: 'behavior', value: 'interactive' },
		},
		{
			name: 'disabled',
			label: 'Disabled',
			type: 'checkbox',
			defaultValue: false,
			dependsOn: { prop: 'behavior', value: 'interactive' },
		},
		{
			name: 'semantic',
			label: 'Semantic',
			type: 'select',
			options: [
				{ value: 'adaptive', label: 'Adaptive', default: true },
				{ value: 'neutral', label: 'Neutral' },
				{ value: 'critical', label: 'Critical' },
				{ value: 'informational', label: 'Informational' },
				{ value: 'warning', label: 'Warning' },
				{ value: 'successful', label: 'Successful' },
			],
		},
		{
			name: 'emphasis',
			label: 'Emphasis',
			type: 'select',
			options: [
				{ value: 'weak', label: 'Weak', default: true },
				{ value: 'strong', label: 'Strong' },
			],
		},

		// Hidden properties
		{
			name: 'showIcon',
			label: 'Show Icon',
			type: 'checkbox',
			defaultValue: false,
		},
		{
			name: 'icon',
			label: 'Icon',
			...IconOption,

			dependsOn: 'showIcon',
		},
		{
			name: 'showCheckState',
			label: 'Show Check State',
			type: 'checkbox',
			defaultValue: false,
			dependsOn: { prop: 'behavior', value: 'interactive' },
		},
		{
			name: 'noText',
			label: 'No Text',
			type: 'checkbox',
			defaultValue: false,
		},
	],
};
