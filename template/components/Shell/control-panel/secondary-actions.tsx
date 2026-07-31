import { DBControlPanelSecondaryActions } from '@db-ux/react-core-components';
import ColorModeSwitch from '@template/components/color-mode-switch/ColorModeSwitch.tsx';
import LanguageSwitch from '@template/components/language-switch/LanguageSwitch.tsx';

const SecondaryActions = () => (
	<DBControlPanelSecondaryActions>
		<LanguageSwitch />
		<ColorModeSwitch />
	</DBControlPanelSecondaryActions>
);

export default SecondaryActions;
