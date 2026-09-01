import { DBControlPanelActions1 } from '@db-ux/react-core-components';
import ColorModeSwitch from '@template/components/color-mode-switch/ColorModeSwitch.tsx';
import LanguageSwitch from '@template/components/language-switch/LanguageSwitch.tsx';

const Actions1 = () => (
	<DBControlPanelActions1>
		<ColorModeSwitch />
		<LanguageSwitch />
	</DBControlPanelActions1>
);

export default Actions1;
