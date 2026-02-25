import { DBControlPanelPrimaryActions, DBButton, DBSelect } from '@db-ux/react-core-components';
import { useColorMode } from '@template/context/color-mode-context';
import { useTheme } from '@template/context/theme-context';

const DemoPrimaryActions = () => {
	const { colorMode, setColorMode } = useColorMode();
	const { theme, setTheme } = useTheme();

	return (
		<DBControlPanelPrimaryActions>
			<DBSelect
				value={theme}
				onChange={(e: any) => setTheme(e.target.value)}
				variant="floating"
				label="Theme"
			>
				<option value="default">Deutsche Bahn</option>
				<option value="station">Station</option>
				<option value="s-bahn">S-Bahn</option>
				<option value="neutral">Neutral</option>
			</DBSelect>
			<DBButton
				variant="ghost"
				iconLeading={colorMode === 'dark' ? 'sun' : 'moon'}
				noText
				onClick={() => {
					const newMode = colorMode === 'dark' ? 'light' : 'dark';
					setColorMode(newMode);
					document.documentElement.setAttribute('data-mode', newMode);
					// Remove URL parameter
					const url = new URL(window.location.href);
					url.searchParams.delete('mode');
					window.history.replaceState({}, '', url);
				}}
			></DBButton>
			<DBButton variant="ghost" iconLeading="magnifying_glass" noText></DBButton>
		</DBControlPanelPrimaryActions>
	);
};

export default DemoPrimaryActions;
