import { DBShellSubNavigation, DBButton, DBStack } from '@db-ux/react-core-components';
import ColorModeSwitch from '@template/components/color-mode-switch/ColorModeSwitch';
import ThemeSwitch from '@template/components/theme-switch/ThemeSwitch';

const DemoSubNavigation = () => (
	<DBShellSubNavigation role="complementary">
		<DBStack direction="row" justifyContent="space-between" alignment="center">
			<b>Analytics</b>
			<DBStack direction="row" gap="small" alignment="center">
				<ColorModeSwitch />
				<ThemeSwitch />
				<DBButton variant="brand" type="submit">
					Manage Metrics
				</DBButton>
			</DBStack>
		</DBStack>
	</DBShellSubNavigation>
);

export default DemoSubNavigation;
