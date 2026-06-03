import { DBShellSubNavigation, DBButton, DBStack } from '@db-ux/react-core-components';
import ColorModeSwitch from '@template/components/theming/ColorModeSwitch/ColorModeSwitch';
import ThemeSwitch from '@template/components/theming/ThemeSwitch/ThemeSwitch';

const DemoB2BSubNavigation = () => (
	<DBShellSubNavigation role="complementary">
		<DBStack direction="row" justifyContent="space-between" alignment="center">
			<strong>Analytics</strong>
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

export default DemoB2BSubNavigation;
