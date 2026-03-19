import { DBControlPanelPrimaryActions, DBButton, DBTooltip } from '@db-ux/react-core-components';
import ColorModeSwitch from '@template/components/color-mode-switch/ColorModeSwitch';
import ThemeSwitch from '@template/components/theme-switch/ThemeSwitch';

const DemoPrimaryActions = () => (
	<DBControlPanelPrimaryActions>
		<ColorModeSwitch />
		<ThemeSwitch />
		<DBButton variant="ghost" iconLeading="magnifying_glass" noText type="submit">
			Search
			<DBTooltip>Search</DBTooltip>
		</DBButton>
	</DBControlPanelPrimaryActions>
);

export default DemoPrimaryActions;
