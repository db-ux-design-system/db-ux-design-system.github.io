import { DBControlPanelBrand, DBStack } from '@db-ux/react-core-components';
import { useTheme } from '@template/context/theme-context';

const DemoBrand = () => {
	const {  logo } = useTheme();

	return (
		<DBControlPanelBrand>
			<a href="#">{logo}</a>
		</DBControlPanelBrand>
	);
};

export default DemoBrand;
