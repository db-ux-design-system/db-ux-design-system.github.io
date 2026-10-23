import { DBStack } from '@db-ux/react-core-components';
import ColorModeSwitch from '@template/components/color-mode-switch/ColorModeSwitch.tsx';
import LanguageSwitch from '@template/components/language-switch/LanguageSwitch.tsx';
import ReadingListButton from '@template/components/ReadingList/ReadingListButton.tsx';
/**
 * Color mode and language switches as a single row.
 *
 * Content only - the caller wraps this in the actions slot that matches the
 * intended position. Grouping both switches keeps them together as one item, so
 * the mobile drawer footer can draw a single divider in front of the group
 * instead of one per switch - see shell-preference-switches in
 * db-ux-overrides.css.
 *
 * With readingList, the reading list button comes first (desktop). On mobile the
 * drawer footer has no room for it, so Shell.tsx puts it into the menu bar instead.
 */
const PreferenceSwitches = ({ readingList = false }: { readingList?: boolean }) => (
	<DBStack className="shell-preference-switches" direction="row" alignment="center" gap="x-small">
		{readingList && <ReadingListButton />}
		<ColorModeSwitch />
		<LanguageSwitch />
	</DBStack>
);
export default PreferenceSwitches;
