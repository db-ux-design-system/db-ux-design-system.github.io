import { DBControlPanelActions1, DBButton, DBTooltip } from '@db-ux/react-core-components';
import ColorModeSwitch from '@template/components/color-mode-switch/ColorModeSwitch';
import ThemeSwitch from '@template/components/theme-switch/ThemeSwitch';

const DemoPrimaryActions = () => (
	<DBControlPanelActions1>
		<ColorModeSwitch />
		<ThemeSwitch />
		<DBButton variant="ghost" icon="magnifying_glass" noText type="submit">
			Search
			<DBTooltip>Search</DBTooltip>
		</DBButton>
	</DBControlPanelActions1>
);

export default DemoPrimaryActions;
