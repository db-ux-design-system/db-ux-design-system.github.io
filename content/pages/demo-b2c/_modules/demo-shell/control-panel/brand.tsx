import { DBControlPanelBrand } from '@db-ux/react-core-components';
import { useTheme } from '@template/context/theme-context';

const DemoBrand = () => {
	const { theme } = useTheme();

	return (
		<DBControlPanelBrand icon={theme.logoSvg ? undefined : theme.icon}>
			<a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				{theme.logoSvg && <img src={theme.logoSvg} alt={theme.logo} style={{ height: '1.5rem' }} />}
				{theme.logo}
			</a>
		</DBControlPanelBrand>
	);
};

export default DemoBrand;
