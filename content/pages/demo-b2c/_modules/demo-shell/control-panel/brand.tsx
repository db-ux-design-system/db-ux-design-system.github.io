import { DBControlPanelBrand, DBStack } from '@db-ux/react-core-components';
import { useTheme } from '@template/context/theme-context';

const DemoBrand = () => {
	const { logoSvg, icon, logo } = useTheme();

	return (
		<DBControlPanelBrand icon={logoSvg ? undefined : icon}>
			<a href="#">
				<DBStack direction="row" alignment="center" gap="2x-small">
					{logoSvg && <img src={logoSvg} alt={logo} style={{ height: 'var(--db-sizing-md)' }} />}
					{logo}
				</DBStack>
			</a>
		</DBControlPanelBrand>
	);
};

export default DemoBrand;
