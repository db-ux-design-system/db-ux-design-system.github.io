import {
	DBButton,
	DBPopover,
	DBControlPanelNavigationItem,
} from '@db-ux/react-core-components';
import { useLanguage } from '@template/context/language-context';
import { getLocalizedPath } from '@template/i18n/slug-mapping';

const LanguageSwitch = () => {
	const { language } = useLanguage();
	const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
	const enPath = getLocalizedPath(currentPath, 'en');
	const dePath = getLocalizedPath(currentPath, 'de');

	return (
		<DBPopover
			trigger={
				<DBButton variant="ghost" icon="globe">
					{language.toUpperCase()}
				</DBButton>
			}
		>
			<nav aria-label="Language selection" style={{ width: '100%' }}>
				<DBControlPanelNavigationItem active={language === 'en'} style={{ width: '100%' }}>
					<a href={enPath}>English</a>
				</DBControlPanelNavigationItem>
				<DBControlPanelNavigationItem active={language === 'de'} style={{ width: '100%' }}>
					<a href={dePath}>Deutsch</a>
				</DBControlPanelNavigationItem>
			</nav>
		</DBPopover>
	);
};

export default LanguageSwitch;
