import type { ControlProps } from '../types';

const SelectControl = ({ property, value, onChange, availableOptions }: ControlProps) => {
	const controlId = `control-${property.name}`;
	const options = availableOptions ?? property.options ?? [];

	return (
		<div className="db-select">
			<label htmlFor={controlId}>{property.label}</label>
			<select id={controlId} value={value} onChange={(e) => onChange(e.target.value)}>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};

export default SelectControl;
