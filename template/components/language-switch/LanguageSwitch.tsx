import {
	DBButton,
	DBPopover,
	DBControlPanelNavigationItem,
} from '@db-ux/react-core-components';
import { useLanguage } from '@template/context/language-context';

const LanguageSwitch = () => {
	const { language } = useLanguage();
	const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
	const enPath = currentPath.replace(/^\/de/, '') || '/';
	const dePath = currentPath.startsWith('/de') ? currentPath : `/de${currentPath}`;

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
