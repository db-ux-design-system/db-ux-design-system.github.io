import {
	DBShellSubNavigation,
	DBNavigation,
	DBNavigationItem,
	DBButton,
	DBStack,
} from '@db-ux/react-core-components';
import ColorModeSwitch from '@root/template/components/color-mode-switch/ColorModeSwitch';
import ThemeSwitch from '../../ThemeSwitch';

const DemoSubNavigation = () => (
	<DBShellSubNavigation>
		<DBStack direction="row" justifyContent="space-between" alignment="center">
			<b>Analytics</b>
			<DBStack direction="row" gap="small" alignment="center">
				<ColorModeSwitch />
				<ThemeSwitch />
				<DBButton variant="brand">Manage Metrics</DBButton>
			</DBStack>
		</DBStack>
	</DBShellSubNavigation>
);

export default DemoSubNavigation;
