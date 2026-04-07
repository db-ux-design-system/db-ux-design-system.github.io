import type { PropsWithChildren, ReactElement } from 'react';

// --- Config data types ---

export interface Option {
	value: string;
	label: string;
	default?: boolean;
}

export interface PropertyConfig {
	name: string;
	type: 'select' | 'text' | 'checkbox';
	label: string;
	defaultValue?: any;
	options?: Option[];
	/** Inline dependency: show this control only when condition is met.
	 *  - string: boolean prop name that must be true (e.g., 'show-icon')
	 *  - { prop, value }: prop must equal value
	 *  - { prop, notValue }: prop must NOT equal value */
	dependsOn?: string | { prop: string; value?: string; notValue?: string };
}

export interface PlaygroundConfig<T> {
	render?: (
		props: PropsWithChildren<T>,
		onPropChange: (name: string, value: any) => void,
	) => ReactElement;
	defaultProps: Record<string, any>;
	properties: PropertyConfig[];
}

// --- Component props ---

export interface PreviewAreaProps {
	config: PlaygroundConfig<any>;
	currentProps: Record<string, any>;
	onPropChange: (name: string, value: any) => void;
}

export interface ControlsAreaProps {
	config: PlaygroundConfig<any>;
	currentProps: Record<string, any>;
	onPropChange: (name: string, value: any) => void;
}

export interface ControlProps {
	property: PropertyConfig;
	value: any;
	onChange: (value: any) => void;
	defaultValue?: any;
}
