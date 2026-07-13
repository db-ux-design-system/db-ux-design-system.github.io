import { DBButton, DBTooltip } from '@db-ux/react-core-components';
import { useLanguage } from '@template/context/language-context';
import { useTranslation } from '@template/i18n';

const LanguageSwitch = () => {
	const { language, toggleLanguage } = useLanguage();
	const { t } = useTranslation();
	const targetLanguage = language === 'en' ? 'DE' : 'EN';

	return (
		<DBButton variant="ghost" icon="translation" onClick={toggleLanguage}>
			<DBTooltip>{t('shell.languageSwitch.label')}</DBTooltip>
			{targetLanguage}
		</DBButton>
	);
};

export default LanguageSwitch;
