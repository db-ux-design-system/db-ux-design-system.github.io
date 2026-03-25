import type { PreviewAreaProps } from './types';
import { DBIcon } from '@db-ux/react-core-components';

const PreviewArea = ({
	config,
	component: Component,
	currentProps,
	onPropChange,
}: PreviewAreaProps) => {
	const renderContent = () => {
		// Path 1: Custom renderPreview function (for special cases like Drawer, Accordion, etc.)
		if (config.renderPreview) {
			return config.renderPreview(currentProps);
		}

		// Path 2: Generic rendering with the real DB component
		if (Component) {
			// Determine children content — skip if noText is true
			const isNoText = currentProps['no-text'] === true || currentProps['noText'] === true;
			const textValue = currentProps.text;
			const children = isNoText ? undefined : textValue ? (
				config.textElementId ? (
					<span id={config.textElementId}>{textValue}</span>
				) : (
					textValue
				)
			) : config.defaultText ? (
				config.textElementId ? (
					<span id={config.textElementId}>{config.defaultText}</span>
				) : (
					config.defaultText
				)
			) : undefined;

			// Build props: use alternativeName where defined, exclude special props
			const componentProps: Record<string, any> = {};
			const skipProps = ['children'];
			// Skip 'text' for most components (used as children), but NOT for notification (uses text prop)
			if (config.elementId !== 'demo-notification') {
				skipProps.push('text');
			}
			// For badge, also skip 'icon' since it's handled via children mode
			if (config.elementId === 'playground-badge') {
				skipProps.push('icon');
			}
			// For button: in no-text mode, skip trailing icons and icon prop
			if (config.elementId === 'demo-button') {
				if (isNoText) {
					skipProps.push('icon', 'icon-trailing', 'show-icon', 'show-icon-trailing');
				}
			}
			// For notification: link-text is not a real prop, it's used to build the link slot
			if (config.elementId === 'demo-notification') {
				skipProps.push('link-text');
			}
			for (const property of config.properties) {
				const propName = property.name;
				if (skipProps.includes(propName)) continue;

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

			// Special case: Badge children mode (text/icon/dot)
			let badgeChildren = children;
			if (config.elementId === 'playground-badge') {
				const childrenMode = currentProps.children;
				if (childrenMode === 'icon') {
					const iconName = currentProps.icon || 'x_placeholder';
					badgeChildren = <DBIcon icon={iconName}>Icon</DBIcon>;
				} else if (childrenMode === 'dot') {
					badgeChildren = undefined;
				}
			}

			// Determine the final children to render
			let finalChildren = config.elementId === 'playground-badge' ? badgeChildren : children;

			// Special case: Select needs option elements as children
			if (config.elementId === 'playground-select') {
				finalChildren = (
					<>
						<option value="1">Option 1</option>
						<option value="2">Option 2</option>
						<option value="3">Option 3</option>
					</>
				);
			}

			// Special case: Notification link slot
			if (config.elementId === 'demo-notification') {
				const linkText = currentProps['link-text'] || 'Link';
				componentProps.link = <a href="#">{linkText}</a>;
				finalChildren = undefined; // notification uses text prop, not children
			}

			// Special case: Badge with corner placement needs a reference element
			const placement = currentProps.placement;
			const isCornerPlacement = typeof placement === 'string' && placement.startsWith('corner');

			if (config.elementId === 'playground-badge' && isCornerPlacement) {
				return (
					<div
						style={{
							position: 'relative',
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 'var(--db-sizing-xl)',
							height: 'var(--db-sizing-xl)',
							backgroundColor: 'var(--db-adaptive-bg-basic-transparent-semi-default)',
							borderRadius: 'var(--db-border-radius-sm)',
						}}
					>
						<span
							className="db-button"
							data-icon="account"
							data-variant="ghost"
							data-no-text="true"
							style={{ pointerEvents: 'none' }}
						>
							Reference
						</span>
						<Component {...componentProps}>{finalChildren}</Component>
					</div>
				);
			}

			// For form components with 'checked' prop, add onChange to sync state
			const formElementIds = ['playground-checkbox', 'playground-radio', 'playground-switch'];
			if (formElementIds.includes(config.elementId) && onPropChange) {
				componentProps.onChange = () => {
					onPropChange('checked', !currentProps.checked);
				};
			}

			return <Component {...componentProps}>{finalChildren}</Component>;
		}

		// Path 3: No component and no renderPreview — empty preview
		return null;
	};

	return (
		<div className="preview-area">
			{renderContent()}
			<div
				role="status"
				aria-live="polite"
				style={{
					position: 'absolute',
					width: '1px',
					height: '1px',
					padding: 0,
					margin: '-1px',
					overflow: 'hidden',
					clip: 'rect(0, 0, 0, 0)',
					whiteSpace: 'nowrap',
					borderWidth: 0,
				}}
			/>
		</div>
	);
};

export default PreviewArea;
