import type { Language } from '@template/context/language-context';
import { en } from './en';
import { de } from './de';

export interface TranslationDictionary {
	// Shell & Navigation
	'shell.menu': string;
	'shell.mainNavigation': string;
	'shell.colorModeToggle': string;
	'shell.getStarted': string;
	'shell.languageSwitch.label': string;
	'shell.subNavigation': string;
	'shell.subNavigation.collapse': string;
	'shell.subNavigation.expand': string;

	// Table of contents
	'toc.collapse': string;
	'toc.expand': string;

	// Footer
	'footer.imprint': string;
	'footer.privacy': string;

	// Language notification
	'language.fallbackNotice': string;
}

const dictionaries: Record<Language, TranslationDictionary> = {
	en,
	de,
};

export function getTranslation(language: Language, key: keyof TranslationDictionary): string {
	return dictionaries[language][key] ?? dictionaries.en[key] ?? key;
}
