import type { ControlsAreaProps } from '../types';
import { evaluateVisibility } from '../dependency-engine';
import SelectControl from './SelectControl';
import TextControl from './TextControl';
import CheckboxControl from './CheckboxControl';

const ControlsArea = ({ config, currentProps, onPropChange }: ControlsAreaProps) => {
	if (config.properties.length === 0) {
		return null;
	}

	return (
		<div className="controls-area">
			<div className="controls-area-content" data-density="functional">
				{config.properties.map((property) => {
					const isVisible = evaluateVisibility(property, currentProps, config);
					if (!isVisible) {
						return null;
					}

					switch (property.type) {
						case 'select':
							return (
								<SelectControl
									key={property.name}
									property={property}
									value={currentProps[property.name]}
									defaultValue={(config.properties as any)[property.name]?.defaultValue}
									onChange={(value) => onPropChange(property.name, value)}
								/>
							);
						case 'text':
							return (
								<TextControl
									key={property.name}
									property={property}
									value={currentProps[property.name]}
									onChange={(value) => onPropChange(property.name, value)}
								/>
							);
						case 'checkbox':
							return (
								<CheckboxControl
									key={property.name}
									property={property}
									value={currentProps[property.name]}
									onChange={(value) => onPropChange(property.name, value)}
								/>
							);
						default:
							return null;
					}
				})}
			</div>
		</div>
	);
};

export default ControlsArea;
