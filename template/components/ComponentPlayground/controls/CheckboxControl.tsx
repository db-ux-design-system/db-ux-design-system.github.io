import type { ControlProps } from '../types';

const CheckboxControl = ({ property, value, onChange }: ControlProps) => {
	return (
		<label className="db-switch">
			<input
				type="checkbox"
				role="switch"
				checked={!!value}
				onChange={(e) => onChange(e.target.checked)}
			/>
			<span>{property.label}</span>
		</label>
	);
};

export default CheckboxControl;
