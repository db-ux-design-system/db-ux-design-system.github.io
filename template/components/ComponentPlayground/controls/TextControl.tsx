import type { ControlProps } from '../types';
import { DBInput } from '@db-ux/react-core-components';

const TextControl = ({ property, value, onChange }: ControlProps) => (
	<DBInput
		id={`control-${property.name}`}
		label={property.label}
		type="text"
		value={value}
		onChange={(e) => onChange(e.target.value)}
	/>
);

export default TextControl;
