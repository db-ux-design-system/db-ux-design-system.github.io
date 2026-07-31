import { DBControlPanelBrand } from '@db-ux/react-core-components';
import { appConfig } from '@root/app.config.ts';
import { useLanguage } from '@template/context/language-context';

const Brand = () => {
	const { language } = useLanguage();
	const href = language === 'de' ? '/de/' : appConfig.basePath;

	return (
		<DBControlPanelBrand>
			<a href={href}>{appConfig.title}</a>
		</DBControlPanelBrand>
	);
};

export default Brand;
