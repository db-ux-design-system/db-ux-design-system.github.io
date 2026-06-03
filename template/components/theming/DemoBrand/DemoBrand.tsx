import { DBControlPanelBrand, DBStack } from '@db-ux/react-core-components';
import { useTheme } from '@template/context/theme-context';
import './DemoBrand.css';

const DemoBrand = () => {
	const { logoSvg, logo } = useTheme();

	return (
		<DBControlPanelBrand>
			<a href="#">
				<DBStack direction="row" alignment="center" gap="x-small">
					{logoSvg && (
						<img src={logoSvg} alt={`Image of ${logo} logo`} className="demo-brand-logo" />
					)}
					{logo}
				</DBStack>
			</a>
		</DBControlPanelBrand>
	);
};

export default DemoBrand;
