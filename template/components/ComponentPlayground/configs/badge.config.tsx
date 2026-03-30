import type { PlaygroundConfig } from '../types';
import { DBBadge, type DBBadgeProps, DBIcon, type IconProps } from '@db-ux/react-core-components';
import { IconOption } from '@components/ComponentPlayground/configs/_icon.option.tsx';

type Props = DBBadgeProps & IconProps & { childrenType: 'text' | 'icon' | 'dot' };

const render = (props: Props) => {
	if (props.placement?.startsWith('corner')) {
		return (
			<div className="playground-badge-corner-container">
				<DBBadge {...props} label={props.placement}>
					{props.children}
				</DBBadge>
			</div>
		);
	}

	if (props.childrenType === 'icon') {
		return (
			<DBBadge {...props} text={undefined}>
				<DBIcon icon={props.icon ?? 'x_placeholder'}>Icon</DBIcon>
			</DBBadge>
		);
	} else if (props.childrenType === 'dot') {
		return (
			<DBBadge {...props} text={undefined}>
				{props.children}
			</DBBadge>
		);
	}

	return <DBBadge {...props}>{props.children}</DBBadge>;
};

export const badgeConfig: PlaygroundConfig<Props> = {
	render,
	defaultProps: {
		placement: 'inline',
		semantic: 'adaptive',
		size: 'small',
		emphasis: 'weak',
	},
	slots: [
		{
			name: 'children',
			description: 'default slot',
		},
	],
	properties: [
		{
			name: 'childrenType',
			label: 'Children Type',
			type: 'select',
			description: 'Alternative for default slot/children.',
			showInPlayground: true,
			options: [
				{ value: 'text', label: 'Text', default: true },
				{ value: 'icon', label: 'Icon' },
				{ value: 'dot', label: 'Dot' },
			],
		},
		{
			name: 'text',
			label: 'Text',
			type: 'text',
			defaultValue: 'Text',
			description: 'Alternative for default slot/children.',
			showInPlayground: true,
			dependsOn: { prop: 'childrenType', value: 'text' },
		},
		{
			name: 'icon',
			label: 'Icon',
			...IconOption,
			defaultValue: 'x_placeholder',
			description: 'Icon identifier to display inside the badge.',
			showInPlayground: true,
			dependsOn: { prop: 'childrenType', value: 'icon' },
		},
		{
			name: 'semantic',
			label: 'Semantic',
			type: 'select',
			description: 'The semantic defines the default variants for most components.',
			options: [
				{ value: 'adaptive', label: 'Adaptive', default: true },
				{ value: 'neutral', label: 'Neutral' },
				{ value: 'critical', label: 'Critical' },
				{ value: 'informational', label: 'Informational' },
				{ value: 'warning', label: 'Warning' },
				{ value: 'successful', label: 'Successful' },
			],
			showInPlayground: true,
		},
		{
			name: 'emphasis',
			label: 'Emphasis',
			type: 'select',
			description: 'The emphasis attribute divides in between a weak or strong importance.',
			options: [
				{ value: 'weak', label: 'Weak', default: true },
				{ value: 'strong', label: 'Strong' },
			],
			showInPlayground: true,
		},
		{
			name: 'size',
			label: 'Size',
			type: 'select',
			description:
				'The size attribute changes the font-size and other related sizes of the component.',
			options: [
				{ value: 'small', label: 'Small', default: true },
				{ value: 'medium', label: 'Medium' },
			],
			showInPlayground: true,
		},
		{
			name: 'placement',
			label: 'Placement',
			type: 'select',
			description:
				'The placement attributes corner-* values change the position to absolute and adds a transform based on the placement.',
			options: [
				{ value: 'inline', label: 'Inline', default: true },
				{ value: 'corner-top-left', label: 'Corner Top Left' },
				{ value: 'corner-top-right', label: 'Corner Top Right' },
				{ value: 'corner-center-left', label: 'Corner Center Left' },
				{ value: 'corner-center-right', label: 'Corner Center Right' },
				{ value: 'corner-bottom-left', label: 'Corner Bottom Left' },
				{ value: 'corner-bottom-right', label: 'Corner Bottom Right' },
			],
			showInPlayground: true,
		},
		{
			name: 'label',
			label: 'Label',
			type: 'text',
			defaultValue: '',
			description: 'Describes the badge for a11y if you use placement attribute with corner-*',
			showInPlayground: false,
		},
		{
			name: 'id',
			label: 'ID',
			type: 'text',
			defaultValue: '',
			description:
				'ID of the component, generated automatically for some components as a fallback if unset.',
			showInPlayground: false,
		},
		{
			name: 'className',
			label: 'Class Name',
			type: 'text',
			defaultValue: '',
			description: 'React specific for adding className to the component.',
			showInPlayground: false,
		},
	],
};
