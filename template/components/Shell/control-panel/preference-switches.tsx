import { DBStack } from '@db-ux/react-core-components';
import ColorModeSwitch from '@template/components/color-mode-switch/ColorModeSwitch.tsx';
import LanguageSwitch from '@template/components/language-switch/LanguageSwitch.tsx';
import LearningPackageButton from '@template/components/LearningPackage/LearningPackageButton.tsx';
/**
 * Color mode and language switches as a single row.
 *
 * Content only - the caller wraps this in the actions slot that matches the
 * intended position. Grouping both switches keeps them together as one item, so
 * the mobile drawer footer can draw a single divider in front of the group
 * instead of one per switch - see shell-preference-switches in
 * db-ux-overrides.css.
 *
 * With learningPackage, the learning package button comes first (desktop). It only
 * renders once the Get Started wizard has saved a package. On mobile the drawer
 * footer has no room for it, so Shell.tsx puts it into the menu bar instead.
 */
const PreferenceSwitches = ({ learningPackage = false }: { learningPackage?: boolean }) => (
	<DBStack className="shell-preference-switches" direction="row" alignment="center" gap="x-small">
		{learningPackage && <LearningPackageButton />}
		<ColorModeSwitch />
		<LanguageSwitch />
	</DBStack>
);
export default PreferenceSwitches;
