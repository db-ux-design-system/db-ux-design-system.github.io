import { useLanguage } from '@template/context/language-context';
import { getTranslation, type TranslationDictionary } from './translations';

export function useTranslation() {
	const { language } = useLanguage();

	const t = (key: keyof TranslationDictionary): string => {
		return getTranslation(language, key);
	};

	return { t, language };
}
