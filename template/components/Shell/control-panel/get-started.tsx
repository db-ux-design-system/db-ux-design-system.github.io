import { useLanguage } from '@template/context/language-context';
import { useTranslation } from '@template/i18n';

/**
 * Button linking to Get Started, the role question that leads into the docs.
 *
 * Content only - the caller wraps this in the actions slot that matches the
 * intended position. On desktop it sits in Actions 2 on the right, on mobile in
 * Actions 2 as the first item of the drawer footer.
 */
const GetStarted = () => {
	const { t } = useTranslation();
	const { language } = useLanguage();
	// Root-relative for both languages, like the footer links and the language switch.
	const href =
		language === 'de' ? '/de/dokumentation/erste-schritte' : '/documentation/get-started';

	return (
		<a className="db-button" href={href} data-variant="brand" data-wrap="false">
			{t('shell.getStarted')}
		</a>
	);
};

export default GetStarted;
