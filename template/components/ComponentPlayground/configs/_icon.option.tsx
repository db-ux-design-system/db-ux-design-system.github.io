import type { PropertyConfig } from '@components/ComponentPlayground/types.ts';
import { ALL_ICONS } from '@db-ux/db-theme-icons';

export const IconOption: Pick<PropertyConfig, 'type' | 'options' | 'defaultValue'> = {
	type: 'select',
	options: ALL_ICONS.map((icon) => ({
		label: icon,
		value: icon,
	})),
	defaultValue: 'x_placeholder',
};
