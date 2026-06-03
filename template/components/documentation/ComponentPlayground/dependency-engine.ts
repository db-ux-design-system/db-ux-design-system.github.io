import type { DependsOnCondition, PlaygroundConfig, PropertyConfig } from './types';

/**
 * Evaluates whether a property should be visible based on its `visibleWhen` condition
 * (from the global dependencies map) OR its inline `dependsOn` field.
 * If no condition is defined, the property is always visible.
 */
export function evaluateVisibility(
	property: PropertyConfig,
	currentProps: Record<string, any>,
	config: PlaygroundConfig<any>,
): boolean {
	// Check inline dependsOn on the property itself
	if (property.dependsOn !== undefined) {
		// Array = OR logic: visible if ANY condition is met
		if (Array.isArray(property.dependsOn)) {
			return property.dependsOn.some((condition) =>
				evaluateSingleDependency(condition, currentProps, config),
			);
		}

		return evaluateSingleDependency(property.dependsOn, currentProps, config);
	}

	return true;
}

function evaluateSingleDependency(
	dependsOn: DependsOnCondition,
	currentProps: Record<string, any>,
	config: PlaygroundConfig<any>,
): boolean {
	const directResult = evaluateDependsOn(dependsOn, currentProps);
	if (!directResult) return false;

	// Transitive check: if dependsOn references another property by name,
	// also check if that property itself is visible
	const depPropName = typeof dependsOn === 'string' ? dependsOn : dependsOn.prop;
	const depProperty = config.properties.find((p) => p.name === depPropName);
	if (depProperty?.dependsOn !== undefined && !Array.isArray(depProperty.dependsOn)) {
		return evaluateDependsOn(depProperty.dependsOn, currentProps);
	}

	return true;
}

/**
 * Evaluates the inline `dependsOn` field on a property.
 * - string: the named boolean prop must be truthy
 * - { prop, value }: prop must equal value
 * - { prop, notValue }: prop must NOT equal value
 */
function evaluateDependsOn(
	dependsOn: DependsOnCondition,
	currentProps: Record<string, any>,
): boolean {
	if (typeof dependsOn === 'string') {
		// Boolean prop must be truthy
		return !!currentProps[dependsOn];
	}
	if (dependsOn.notValue !== undefined) {
		// Loose comparison to handle boolean/string mismatches (e.g., true vs 'true')
		return String(currentProps[dependsOn.prop]) !== String(dependsOn.notValue);
	}
	if (dependsOn.value !== undefined) {
		// Loose comparison to handle boolean/string mismatches
		return String(currentProps[dependsOn.prop]) === String(dependsOn.value);
	}
	return true;
}

/**
 * Derives the initial state from `defaultProps` and property `defaultValue` fields.
 * `defaultProps` values take precedence over property-level defaults.
 */
export function initializeState(config: PlaygroundConfig<any>): Record<string, any> {
	const state: Record<string, any> = { ...config.defaultProps };

	for (const prop of config.properties) {
		if (state[prop.name] !== undefined) {
			continue;
		}

		if (prop.type === 'select') {
			const defaultOption = prop.options?.find((o) => o.default);
			state[prop.name] = defaultOption?.value ?? prop.defaultValue ?? prop.options?.[0]?.value;
		} else {
			state[prop.name] = prop.defaultValue ?? (prop.type === 'checkbox' ? false : '');
		}
	}

	return state;
}
