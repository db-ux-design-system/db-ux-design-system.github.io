import {
	DBShellSubNavigation,
	DBButton,
	DBStack,
} from '@db-ux/react-core-components';
import { useColorMode } from '@template/context/color-mode-context';
import ThemeSwitch from '@template/components/theme-switch/ThemeSwitch';

const DemoSubNavigation = () => {
	const { colorMode, setColorMode } = useColorMode();

	return (
		<DBShellSubNavigation>
			<DBStack direction="row" justifyContent="space-between" alignment="center">
				<b>Analytics</b>
				<DBStack direction="row" gap="small" alignment="center">
					<DBButton
						variant="ghost"
						iconLeading={colorMode === 'dark' ? 'sun' : 'moon'}
						noText
						onClick={() => {
							const newMode = colorMode === 'dark' ? 'light' : 'dark';
							setColorMode(newMode);
							document.documentElement.setAttribute('data-mode', newMode);
							const url = new URL(window.location.href);
							url.searchParams.delete('mode');
							window.history.replaceState({}, '', url);
						}}
					></DBButton>
					<ThemeSwitch />
					<DBButton variant="brand">Manage Metrics</DBButton>
				</DBStack>
			</DBStack>
		</DBShellSubNavigation>
	);
};

export default DemoSubNavigation;
