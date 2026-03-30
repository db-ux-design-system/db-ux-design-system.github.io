import type { PreviewAreaProps } from './types';

const PreviewArea = ({ config, currentProps, onPropChange }: PreviewAreaProps) => {
	const componentProps: Record<string, any> = {};

	if (config.render) {
		for (const property of config.properties) {
			const propName = property.name;

			const value = currentProps[propName];
			if (value === undefined) continue;

			// Skip empty strings — they add unwanted empty data-* attributes
			if (value === '') continue;

			// Determine the React prop key: prefer camelCase name
			// Some configs have name='no-text' + alternativeName='noText' (use alternativeName)
			// Others have name='invalidMessage' + alternativeName='invalid-message' (use name)
			const reactKey = property.alternativeName ?? propName;
			const key = reactKey.includes('-') ? propName : reactKey;
			componentProps[key] = value;
		}
	}

	return <div className="preview-area">{config?.render?.(componentProps, onPropChange)}</div>;
};

export default PreviewArea;
