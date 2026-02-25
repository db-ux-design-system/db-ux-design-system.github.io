import { DBSelect } from '@db-ux/react-core-components';
import { useTheme } from '@template/context/theme-context.tsx';

const ThemeSwitch = () => {
	const { theme, setTheme } = useTheme();

	return (
		<DBSelect
			label="Theme"
			value={theme}
			variant="floating"
			onChange={(e) => setTheme(e.target.value as 'default' | 's-bahn' | 'station' | 'neutral')}
		>
			<option value="default">Deutsche Bahn</option>
			<option value="neutral">Neutral</option>
			<option value="s-bahn">S-Bahn</option>
			<option value="station">Station</option>
		</DBSelect>
	);
};

export default ThemeSwitch;
