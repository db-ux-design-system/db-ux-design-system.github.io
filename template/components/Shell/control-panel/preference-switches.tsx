import { DBStack } from '@db-ux/react-core-components';
import ColorModeSwitch from '@template/components/color-mode-switch/ColorModeSwitch.tsx';
import LanguageSwitch from '@template/components/language-switch/LanguageSwitch.tsx';

/**
 * Color mode and language switches as a single row.
 *
 * Content only - the caller wraps this in the actions slot that matches the
 * intended position. Grouping both switches keeps them together as one item, so
 * the mobile drawer footer can draw a single divider in front of the group
 * instead of one per switch - see shell-preference-switches in
 * db-ux-overrides.css.
 */
const PreferenceSwitches = () => (
	<DBStack className="shell-preference-switches" direction="row" alignment="center" gap="x-small">
		<ColorModeSwitch />
		<LanguageSwitch />
	</DBStack>
);

export default PreferenceSwitches;
