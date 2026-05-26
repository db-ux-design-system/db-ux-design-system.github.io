import { DBControlPanelPrimaryActions, DBButton, DBTooltip } from '@db-ux/react-core-components';
import ColorModeSwitch from '@template/components/theming/ColorModeSwitch/ColorModeSwitch';
import ThemeSwitch from '@template/components/theming/ThemeSwitch/ThemeSwitch';

const DemoB2CPrimaryActions = () => (
	<DBControlPanelPrimaryActions>
		<ColorModeSwitch />
		<ThemeSwitch />
		<DBButton variant="ghost" icon="magnifying_glass" noText type="submit">
			Search
			<DBTooltip>Search</DBTooltip>
		</DBButton>
	</DBControlPanelPrimaryActions>
);

export default DemoB2CPrimaryActions;
