import {
	DBControlPanelPrimaryActions,
	DBButton,
	DBSelect,
	DBTooltip,
} from '@db-ux/react-core-components';
import { useColorMode } from '@template/context/color-mode-context';
import { useTheme } from '@template/context/theme-context';

const DemoPrimaryActions = () => {
	const { colorMode, setColorMode } = useColorMode();
	const { themeName, setTheme } = useTheme();

	return (
		<DBControlPanelPrimaryActions>
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
				type="button"
			>
				Switch color scheme (light/dark)
				<DBTooltip>Switch color scheme (light/dark)</DBTooltip>
			</DBButton>
			<DBSelect
				value={themeName}
				onChange={(e) => {
					setTheme(e.target.value as 'default' | 's-bahn' | 'station' | 'neutral');
					const url = new URL(window.location.href);
					url.searchParams.delete('theme');
					window.history.replaceState({}, '', url);
				}}
				variant="floating"
				label="Theme"
			>
				<option value="default">Deutsche Bahn</option>
				<option value="station">Station</option>
				<option value="s-bahn">S-Bahn</option>
				<option value="neutral">Neutral</option>
			</DBSelect>
			<DBButton variant="ghost" iconLeading="magnifying_glass" noText type="submit">
				Search
				<DBTooltip>Search</DBTooltip>
			</DBButton>
		</DBControlPanelPrimaryActions>
	);
};

export default DemoPrimaryActions;
