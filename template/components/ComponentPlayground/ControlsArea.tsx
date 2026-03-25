import type { ControlsAreaProps } from './types';
import { evaluateVisibility, evaluateOptions } from './dependency-engine';
import SelectControl from './controls/SelectControl';
import TextControl from './controls/TextControl';
import CheckboxControl from './controls/CheckboxControl';

const ControlsArea = ({ config, currentProps, onPropChange }: ControlsAreaProps) => {
	const playgroundProperties = config.properties.filter(
		(property) => property.showInPlayground !== false,
	);

	if (playgroundProperties.length === 0) {
		return null;
	}

	return (
		<div className="controls-area">
			<div className="controls-area-content" data-density="functional">
				{playgroundProperties.map((property) => {
					const isVisible = evaluateVisibility(property, currentProps, config);
					if (!isVisible) {
						return null;
					}

					const availableOptions = evaluateOptions(property, currentProps, config);

					// Resolve dynamic label if labelWhen is defined
					let resolvedProperty = property;
					if (property.labelWhen) {
						const { condition, label } = property.labelWhen;
						const propValue = currentProps[condition.prop];
						const matches =
							condition.value !== undefined
								? String(propValue) === String(condition.value)
								: !!propValue;
						if (matches) {
							resolvedProperty = { ...property, label };
						}
					}

					switch (property.type) {
						case 'select':
							return (
								<SelectControl
									key={property.name}
									property={resolvedProperty}
									value={currentProps[property.name]}
									onChange={(value) => onPropChange(property.name, value)}
									availableOptions={availableOptions}
								/>
							);
						case 'text':
							return (
								<TextControl
									key={property.name}
									property={resolvedProperty}
									value={currentProps[property.name]}
									onChange={(value) => onPropChange(property.name, value)}
								/>
							);
						case 'checkbox':
							return (
								<CheckboxControl
									key={property.name}
									property={resolvedProperty}
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
