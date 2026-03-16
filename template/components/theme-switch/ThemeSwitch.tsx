import { DBSelect } from '@db-ux/react-core-components';
import { useTheme } from '@template/context/theme-context.tsx';

const ThemeSwitch = () => {
	const { themeName, setTheme } = useTheme();

	return (
		<DBSelect
			label="Theme"
			value={themeName}
			variant="floating"
			onChange={(e) => {
				setTheme(e.target.value as 'default' | 's-bahn' | 'station' | 'neutral');
				const url = new URL(window.location.href);
				url.searchParams.delete('theme');
				window.history.replaceState({}, '', url);
			}}
		>
			<option value="default">Deutsche Bahn</option>
			<option value="neutral">Neutral</option>
			<option value="s-bahn">S-Bahn</option>
			<option value="station">Station</option>
		</DBSelect>
	);
};

export default ThemeSwitch;
