import type { PlaygroundConfig } from '../types';
import { DBButton, type DBButtonProps, DBTooltip } from '@db-ux/react-core-components';
import { IconOption } from '@components/ComponentPlayground/configs/_icon.option.tsx';

export const buttonConfig: PlaygroundConfig<DBButtonProps> = {
	render: (props) => {
		const {
			noText,
			showIconLeading,
			showIconTrailing,
			text,
			iconLeading,
			iconTrailing,
			width,
			...rest
		} = props;

		if (noText) {
			return (
				<DBButton type="button" noText iconLeading={iconLeading} {...rest}>
					{text}
					<DBTooltip>{text}</DBTooltip>
				</DBButton>
			);
		}

		return (
			// eslint-disable-next-line db-ux/button-single-icon-attribute
			<DBButton
				type="button"
				text={text}
				width={width}
				iconLeading={showIconLeading ? iconLeading : undefined}
				iconTrailing={showIconTrailing ? iconTrailing : undefined}
				{...rest}
			/>
		);
	},
	defaultProps: {
		size: 'medium',
		variant: 'outlined',
	},
	properties: [
		{
			name: 'text',
			type: 'text',
			label: 'Text',
			defaultValue: 'Text',
		},
		{
			name: 'variant',
			type: 'select',
			label: 'Variant',
			defaultValue: 'outlined',
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
			defaultValue: 'medium',
			options: [
				{ value: 'small', label: 'Small' },
				{ value: 'medium', label: 'Medium', default: true },
			],
		},
		{
			name: 'width',
			type: 'select',
			label: 'Width',
			defaultValue: 'auto',
			options: [
				{ value: 'auto', label: 'Auto', default: true },
				{ value: 'full', label: 'Full' },
			],
		},
		{
			name: 'iconLeading',
			...IconOption,
			label: (currentProps) => (currentProps.noText ? 'Icon' : 'Icon Leading'),
			dependsOn: ['noText', 'showIconLeading'],
		},
		{
			name: 'iconTrailing',
			...IconOption,
			label: 'Icon Trailing',

			dependsOn: 'showIconTrailing',
		},
		{
			name: 'noText',
			type: 'checkbox',
			label: 'No Text',
			defaultValue: false,
		},
		{
			name: 'showIconLeading',
			type: 'checkbox',
			label: 'Show Icon Leading',
			defaultValue: false,
			dependsOn: { prop: 'noText', value: 'false' },
		},
		{
			name: 'showIconTrailing',
			type: 'checkbox',
			label: 'Show Icon Trailing',
			defaultValue: false,
			dependsOn: { prop: 'noText', value: 'false' },
		},
		{
			name: 'disabled',
			type: 'checkbox',
			label: 'Disabled',
			defaultValue: false,
		},
	],
};
