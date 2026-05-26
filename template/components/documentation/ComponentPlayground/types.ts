import type { PropsWithChildren, ReactElement } from 'react';

// --- Config data types ---

export interface Option {
	value: string;
	label: string;
	default?: boolean;
}

export type DependsOnCondition = string | { prop: string; value?: string; notValue?: string };

export interface PropertyConfig {
	name: string;
	type: 'select' | 'text' | 'checkbox';
	label: string | ((currentProps: Record<string, any>) => string);
	defaultValue?: any;
	options?: Option[];
	/** Inline dependency: show this control only when condition is met.
	 *  - string: boolean prop name that must be true (e.g., 'show-icon')
	 *  - { prop, value }: prop must equal value
	 *  - { prop, notValue }: prop must NOT equal value
	 *  - array: OR logic — visible if ANY condition is met */
	dependsOn?: DependsOnCondition | DependsOnCondition[];
	/** Mutual exclusion: when this property is set to true, the named property is set to false */
	excludes?: string;
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
	property: Omit<PropertyConfig, 'label'> & { label: string };
	value: any;
	onChange: (value: any) => void;
	defaultValue?: any;
}
