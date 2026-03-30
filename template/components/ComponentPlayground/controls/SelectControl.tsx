import type { ControlProps } from '../types';
import { DBSelect } from '@db-ux/react-core-components';

const SelectControl = ({
	property,
	value,
	onChange,
	availableOptions,
	defaultValue,
}: ControlProps) => {
	const controlId = `control-${property.name}`;
	const options = availableOptions ?? property.options ?? [];

	return (
		// eslint-disable-next-line db-ux/select-requires-options
		<DBSelect
			label={property.label}
			id={controlId}
			value={value}
			defaultValue={defaultValue}
			onChange={(e) => onChange(e.target.value)}
		>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</DBSelect>
	);
};

export default SelectControl;
