import type { PreviewAreaProps } from './types';

const PreviewArea = ({ config, currentProps, onPropChange }: PreviewAreaProps) => {
	const componentProps: Record<string, any> = {};

	if (config.render) {
		// Include values from defaultProps that aren't covered by properties
		for (const [key, value] of Object.entries(currentProps)) {
			if (value === undefined) continue;
			if (value === '') continue;
			componentProps[key] = value;
		}
	}

	return <div className="preview-area">{config?.render?.(componentProps, onPropChange)}</div>;
};

export default PreviewArea;
