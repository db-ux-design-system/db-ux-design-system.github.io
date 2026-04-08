import { Component, useState } from 'react';
import type { PlaygroundConfig } from './types';
import { initializeState } from './dependency-engine';
import PreviewArea from './PreviewArea';
import ControlsArea from './controls/ControlsArea';
import { resolveConfig } from '@components/ComponentPlayground/configs';

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return <div className="preview-area">Playground konnte nicht geladen werden</div>;
		}
		return this.props.children;
	}
}

interface ComponentPlaygroundProps {
	component: string;
}

const ComponentPlayground = ({ component }: ComponentPlaygroundProps) => {
	const config = resolveConfig(component);

	if (!config) {
		return <div className="preview-area">Unknown component: {component}</div>;
	}

	return (
		<ErrorBoundary>
			<PlaygroundInner config={config} />
		</ErrorBoundary>
	);
};

const PlaygroundInner = ({ config }: { config: PlaygroundConfig<any> }) => {
	const [currentProps, setCurrentProps] = useState<Record<string, any>>(() =>
		initializeState(config),
	);

	const handlePropChange = (name: string, value: any) => {
		setCurrentProps((prev) => {
			const next = { ...prev, [name]: value };

			// Mutual exclusion: if this property excludes another, set it to false
			if (value) {
				const property = config.properties.find((p) => p.name === name);
				if (property?.excludes) {
					next[property.excludes] = false;
				}
			}

			return next;
		});
	};

	return (
		<div className="component-playground">
			<PreviewArea config={config} currentProps={currentProps} onPropChange={handlePropChange} />
			<ControlsArea config={config} currentProps={currentProps} onPropChange={handlePropChange} />
		</div>
	);
};

export default ComponentPlayground;
