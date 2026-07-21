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
			<nav aria-label="Language selection">
				<ul>
					<DBControlPanelNavigationItem active={language === 'en'}>
						<a href={enPath}>English</a>
					</DBControlPanelNavigationItem>
					<DBControlPanelNavigationItem active={language === 'de'}>
						<a href={dePath}>Deutsch</a>
					</DBControlPanelNavigationItem>
				</ul>
			</nav>
		</DBPopover>
	);
};

export default LanguageSwitch;
