import type { PlaygroundConfig } from '../types';
import { DBButton, DBDrawer, type DBDrawerProps } from '@db-ux/react-core-components';
import { useEffect, useState } from 'react';

export const drawerConfig: PlaygroundConfig<DBDrawerProps> = {
	render: ({ open, ...rest }, onPropChange) => {
		const [innerOpen, setInnerOpen] = useState(open);

		useEffect(() => {
			setInnerOpen(open);
		}, [open]);

		useEffect(() => {
			onPropChange('open', innerOpen);
		}, [innerOpen]);

		return (
			<>
				<DBButton
					type="button"
					onClick={() => {
						setInnerOpen(true);
					}}
				>
					Open
				</DBButton>
				<DBDrawer
					{...rest}
					open={innerOpen}
					onClose={() => setInnerOpen(false)}
				>
					Drawer content
				</DBDrawer>
			</>
		);
	},
	defaultProps: {
		id: 'demo-drawer',
		open: false,
		direction: 'right',
		backdrop: 'strong',
		position: 'fixed',
	},
	properties: [
		{
			name: 'open',
			label: 'Open',
			type: 'checkbox',
			defaultValue: false,
		},
		{
			name: 'direction',
			label: 'Direction',
			type: 'select',
			defaultValue: 'right',
			options: [
				{ value: 'left', label: 'Left' },
				{ value: 'right', label: 'Right', default: true },
				{ value: 'up', label: 'Up' },
				{ value: 'down', label: 'Down' },
			],
		},
		{
			name: 'backdrop',
			label: 'Backdrop',
			type: 'select',
			defaultValue: 'strong',
			options: [
				{ value: 'none', label: 'None' },
				{ value: 'strong', label: 'Strong', default: true },
				{ value: 'weak', label: 'Weak' },
				{ value: 'invisible', label: 'Invisible' },
			],
		},
		{
			name: 'spacing',
			label: 'Spacing',
			type: 'select',
			defaultValue: 'medium',
			options: [
				{ value: 'none', label: 'None' },
				{ value: 'small', label: 'Small' },
				{ value: 'medium', label: 'Medium', default: true },
				{ value: 'large', label: 'Large' },
			],
		},
		{
			name: 'width',
			label: 'Width',
			type: 'select',
			defaultValue: 'auto',
			options: [
				{ value: 'auto', label: 'Auto', default: true },
				{ value: 'full', label: 'Full' },
			],
		},
	],
};
