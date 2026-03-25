import { Component, useState } from 'react';
import type { PlaygroundConfig } from './types';
import { initializeState, resetInvalidValues } from './dependency-engine';
import { resolveComponent } from './component-registry';
import PreviewArea from './PreviewArea';
import ControlsArea from './ControlsArea';

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
	config: PlaygroundConfig;
}

const ComponentPlayground = ({ config }: ComponentPlaygroundProps) => {
	const [currentProps, setCurrentProps] = useState<Record<string, any>>(() =>
		initializeState(config),
	);

	const ResolvedComponent = resolveComponent(config.component);

	const handlePropChange = (name: string, value: any) => {
		setCurrentProps((prev) => {
			const next = { ...prev, [name]: value };

			const prop = config.properties.find((p) => p.name === name);
			if (prop?.setsOnTrue && value === true) {
				for (const [key, val] of Object.entries(prop.setsOnTrue)) {
					const isEmpty =
						!prop.setsOnTrueOnlyIfEmpty ||
						prop.setsOnTrueOnlyIfEmpty.every((field) => !next[field]);
					if (isEmpty) {
						next[key] = val;
					}
				}
			}

			return resetInvalidValues(next, config);
		});
	};

	return (
		<ErrorBoundary>
			<div className="component-playground">
				<PreviewArea
					config={config}
					component={ResolvedComponent}
					currentProps={currentProps}
					onPropChange={handlePropChange}
				/>
				<ControlsArea config={config} currentProps={currentProps} onPropChange={handlePropChange} />
			</div>
		</ErrorBoundary>
	);
};

export default ComponentPlayground;
