import type { Condition, DependencyRule, Option, PlaygroundConfig, PropertyConfig } from './types';

/**
 * Evaluates a single condition against the current props state.
 * Returns true if the condition is satisfied.
 */
function evaluateCondition(condition: Condition, currentProps: Record<string, any>): boolean {
	const currentValue = currentProps[condition.property];

	switch (condition.operator) {
		case 'eq':
			return currentValue === condition.value;
		case 'neq':
			return currentValue !== condition.value;
		case 'in':
			return Array.isArray(condition.value) && condition.value.includes(currentValue);
		case 'notIn':
			return Array.isArray(condition.value) && !condition.value.includes(currentValue);
		default:
			return true;
	}
}

/**
 * Looks up the dependency rule for a given property name in the config.
 */
function getDependencyRule(
	propertyName: string,
	config: PlaygroundConfig<any>,
): DependencyRule | undefined {
	return config.dependencies?.[propertyName];
}

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
	// Check global dependencies map first
	const rule = getDependencyRule(property.name, config);
	if (rule?.visibleWhen) {
		return evaluateCondition(rule.visibleWhen, currentProps);
	}

	// Check inline dependsOn on the property itself
	if (property.dependsOn !== undefined) {
		// If labelWhen is defined and its condition is met, the property is always visible
		// This takes priority over dependsOn and transitive checks
		if (property.labelWhen) {
			const { condition } = property.labelWhen;
			const propValue = currentProps[condition.prop];
			const labelMatch =
				condition.value !== undefined ? String(propValue) === String(condition.value) : !!propValue;
			if (labelMatch) return true;
		}

		const directResult = evaluateDependsOn(property.dependsOn, currentProps);
		if (!directResult) return false;

		// Transitive check: if dependsOn references another property by name,
		// also check if that property itself is visible
		const depPropName =
			typeof property.dependsOn === 'string' ? property.dependsOn : property.dependsOn.prop;
		const depProperty = config.properties.find((p) => p.name === depPropName);
		if (depProperty?.dependsOn !== undefined) {
			return evaluateDependsOn(depProperty.dependsOn, currentProps);
		}
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
	dependsOn: NonNullable<PropertyConfig['dependsOn']>,
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
 * Returns a filtered options list based on `optionsWhen` rules.
 * The first matching rule wins. If no rule matches, returns undefined
 * (indicating the original options should be used).
 */
export function evaluateOptions(
	property: PropertyConfig,
	currentProps: Record<string, any>,
	config: PlaygroundConfig<any>,
): Option[] | undefined {
	const rule = getDependencyRule(property.name, config);
	if (!rule?.optionsWhen) {
		return undefined;
	}

	for (const optionsRule of rule.optionsWhen) {
		if (evaluateCondition(optionsRule.when, currentProps)) {
			return optionsRule.options;
		}
	}

	return undefined;
}

/**
 * Resets values that are no longer valid after dependency changes.
 * If a property's current value is not in its filtered options list,
 * the value is reset to the property's defaultValue.
 */
export function resetInvalidValues(
	currentProps: Record<string, any>,
	config: PlaygroundConfig<any>,
): Record<string, any> {
	const result = { ...currentProps };

	for (const property of config.properties) {
		if (property.type !== 'select' || !property.options) {
			continue;
		}

		const filteredOptions = evaluateOptions(property, result, config);
		if (!filteredOptions) {
			continue;
		}

		const currentValue = result[property.name];
		const isValid = filteredOptions.some((option) => option.value === currentValue);

		if (!isValid) {
			result[property.name] = property.defaultValue;
		}
	}

	return result;
}

/**
 * Derives the initial state from `defaultProps` and property `defaultValue` fields.
 * `defaultProps` values take precedence over property-level defaults.
 */
export function initializeState(config: PlaygroundConfig<any>): Record<string, any> {
	const state: Record<string, any> = { ...config.defaultProps };

	for (const prop of config.properties) {
		if (prop.showInPlayground === false) {
			continue;
		}

		if (state[prop.name] !== undefined) {
			continue;
		}

		if (prop.type === 'select') {
			const defaultOption = prop.options?.find((o) => o.default);
			state[prop.name] = defaultOption?.value ?? prop.options?.[0]?.value;
		} else {
			state[prop.name] = prop.defaultValue ?? (prop.type === 'checkbox' ? false : '');
		}
	}

	return state;
}
