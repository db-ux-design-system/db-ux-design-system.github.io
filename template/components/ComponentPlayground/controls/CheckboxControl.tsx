import type { ControlProps } from '../types';
import { DBSwitch } from '@db-ux/react-core-components';

const CheckboxControl = ({ property, value, onChange }: ControlProps) => {
	return (
		<DBSwitch
			label={property.label}
			checked={!!value}
			onChange={(e) => onChange(e.target.checked)}
		/>
	);
};

export default CheckboxControl;
