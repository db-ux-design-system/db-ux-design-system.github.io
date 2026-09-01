import { DBControlPanelBrand } from '@db-ux/react-core-components';
import { appConfig } from '@root/app.config.ts';
import { useLanguage } from '@template/context/language-context';

const Brand = () => {
	const { language } = useLanguage();
	const href = language === 'de' ? '/de/' : appConfig.basePath;

	return (
		// The link wraps the whole brand so the logo is part of the click target.
		// On mobile this anchor is the grid item itself, so it needs the brand
		// grid area and alignment - see shell-brand-link in db-ux-overrides.css.
		<a className="shell-brand-link" href={href}>
			<DBControlPanelBrand>{appConfig.title}</DBControlPanelBrand>
		</a>
	);
};

export default Brand;
