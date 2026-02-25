import { DBControlPanelBrand } from '@db-ux/react-core-components';
import { useTheme } from '@template/context/theme-context';

const DemoBrand = () => {
	const { logo, icon, logoSvg } = useTheme();

	return (
		<DBControlPanelBrand icon={logoSvg ? undefined : icon}>
			<a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				{logoSvg && <img src={logoSvg} alt={logo} style={{ height: '1.5rem' }} />}
				{logo}
			</a>
		</DBControlPanelBrand>
	);
};

export default DemoBrand;
