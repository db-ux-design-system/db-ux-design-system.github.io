import type { ControlProps } from '../types';

const TextControl = ({ property, value, onChange }: ControlProps) => {
	const controlId = `control-${property.name}`;

	return (
		<div className="db-input">
			<label htmlFor={controlId}>{property.label}</label>
			<input id={controlId} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
		</div>
	);
};

export default TextControl;
