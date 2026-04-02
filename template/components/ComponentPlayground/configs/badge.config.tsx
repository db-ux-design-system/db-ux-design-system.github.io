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
	properties: [
		{
			name: 'childrenType',
			label: 'Children Type',
			type: 'select',
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
			dependsOn: { prop: 'childrenType', value: 'text' },
		},
		{
			name: 'icon',
			label: 'Icon',
			...IconOption,

			dependsOn: { prop: 'childrenType', value: 'icon' },
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
		{
			name: 'size',
			label: 'Size',
			type: 'select',
			options: [
				{ value: 'small', label: 'Small', default: true },
				{ value: 'medium', label: 'Medium' },
			],
		},
		{
			name: 'placement',
			label: 'Placement',
			type: 'select',
			options: [
				{ value: 'inline', label: 'Inline', default: true },
				{ value: 'corner-top-left', label: 'Corner Top Left' },
				{ value: 'corner-top-right', label: 'Corner Top Right' },
				{ value: 'corner-center-left', label: 'Corner Center Left' },
				{ value: 'corner-center-right', label: 'Corner Center Right' },
				{ value: 'corner-bottom-left', label: 'Corner Bottom Left' },
				{ value: 'corner-bottom-right', label: 'Corner Bottom Right' },
			],
		},
	],
};
