import { DBControlPanelBrand } from '@db-ux/react-core-components';
import { appConfig } from '@root/app.config.ts';

const Brand = () => (
	<DBControlPanelBrand>
		<a href={appConfig.basePath}>{appConfig.title}</a>
	</DBControlPanelBrand>
);

export default Brand;
