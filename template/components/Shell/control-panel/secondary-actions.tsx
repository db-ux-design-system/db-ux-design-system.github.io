import { DBControlPanelActions2 } from '@db-ux/react-core-components';
import ColorModeSwitch from '@template/components/color-mode-switch/ColorModeSwitch.tsx';
import LanguageSwitch from '@template/components/language-switch/LanguageSwitch.tsx';

const SecondaryActions = () => (
	<DBControlPanelActions2>
		<LanguageSwitch />
		<ColorModeSwitch />
	</DBControlPanelActions2>
);

export default SecondaryActions;
