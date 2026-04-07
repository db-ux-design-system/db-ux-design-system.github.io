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

			componentProps[propName] = value;
		}
	}

	return <div className="preview-area">{config?.render?.(componentProps, onPropChange)}</div>;
};

export default PreviewArea;
