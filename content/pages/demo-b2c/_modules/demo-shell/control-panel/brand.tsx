import { DBControlPanelBrand, DBStack } from '@db-ux/react-core-components';
import { useTheme } from '@template/context/theme-context';

const DemoBrand = () => {
	const { logoSvg, logo } = useTheme();

	return (
		<DBControlPanelBrand>
			<a href="#">
				<DBStack direction="row" alignment="center" gap="x-small">
					{logoSvg && <img src={logoSvg} alt={logo} style={{ height: 'var(--db-sizing-sm)' }} />}
					{logo}
				</DBStack>
			</a>
		</DBControlPanelBrand>
	);
};

export default DemoBrand;
