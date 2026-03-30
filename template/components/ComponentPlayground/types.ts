import type { PropsWithChildren, ReactElement } from 'react';

// --- Config data types ---

export interface Option {
	value: string;
	label: string;
	default?: boolean;
}

export interface PropertyConfig {
	name: string;
	alternativeName?: string;
	type: 'select' | 'text' | 'checkbox';
	label: string;
	description: string;
	defaultValue?: any;
	showInPlayground?: boolean;
	options?: Option[];
	/** Inline dependency: show this control only when condition is met.
	 *  - string: boolean prop name that must be true (e.g., 'show-icon')
	 *  - { prop, value }: prop must equal value
	 *  - { prop, notValue }: prop must NOT equal value */
	dependsOn?: string | { prop: string; value?: string; notValue?: string };
	/** Dynamic label override based on a condition */
	labelWhen?: { condition: { prop: string; value?: string }; label: string };
	/** When this checkbox is checked, set these props to these values (only if currently empty) */
	setsOnTrue?: Record<string, string>;
	/** Only apply setsOnTrue if these fields are empty */
	setsOnTrueOnlyIfEmpty?: string[];
}

export interface SlotConfig {
	name: string;
	description: string;
}

export interface EventConfig {
	name: string;
	type: string;
	description?: string;
}

// --- Dependency system ---

export interface Condition {
	property: string;
	operator: 'eq' | 'neq' | 'in' | 'notIn';
	value: string | string[] | boolean;
}

export interface OptionsCondition {
	when: Condition;
	options: Option[];
}

export interface DependencyRule {
	visibleWhen?: Condition;
	optionsWhen?: OptionsCondition[];
}

export type DependencyMap = Record<string, DependencyRule>;

export interface PlaygroundConfig<T> {
	render?: (
		props: PropsWithChildren<T>,
		onPropChange: (name: string, value: any) => void,
	) => ReactElement;
	defaultProps: Record<string, any>;
	properties: PropertyConfig[];
	slots?: SlotConfig[];
	events?: EventConfig[];
	dependencies?: DependencyMap;
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
	availableOptions?: Option[];
	defaultValue?: any;
}
