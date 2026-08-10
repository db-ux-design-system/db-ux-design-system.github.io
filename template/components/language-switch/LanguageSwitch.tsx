import {
	DBButton,
	DBPopover,
	DBControlPanelNavigationItem,
} from '@db-ux/react-core-components';
import { useLanguage } from '@template/context/language-context';
import { getLocalizedPath } from '@template/i18n/slug-mapping';
import { useTranslation } from '@template/i18n/useTranslation';

const LanguageSwitch = () => {
	const { language } = useLanguage();
	const { t } = useTranslation();
	const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
	const enPath = getLocalizedPath(currentPath, 'en');
	const dePath = getLocalizedPath(currentPath, 'de');

	return (
		<DBPopover
			trigger={
				<DBButton type="button" variant="ghost" icon="globe" aria-label={t('shell.languageSwitch.label')}>
					{language.toUpperCase()}
				</DBButton>
			}
		>
			<nav aria-label={language === 'de' ? 'Sprachauswahl' : 'Language selection'} style={{ width: '100%' }}>
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
