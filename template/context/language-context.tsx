import { createContext, useContext, useMemo, type ReactNode } from 'react';

export type Language = 'en' | 'de';

interface LanguageContextValue {
	language: Language;
	toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function getLanguageFromUrl(): Language {
	if (typeof window === 'undefined') return 'en';
	if (window.location.pathname.startsWith('/de/') || window.location.pathname === '/de') {
		return 'de';
	}
	return 'en';
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const language = useMemo(getLanguageFromUrl, []);

	const toggleLanguage = () => {
		const currentPath = window.location.pathname;

		if (language === 'en') {
			window.location.href = '/de' + currentPath;
		} else {
			const enPath = currentPath.replace(/^\/de/, '') || '/';
			window.location.href = enPath;
		}
	};

	const value: LanguageContextValue = { language, toggleLanguage };

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
	const ctx = useContext(LanguageContext);
	if (!ctx) {
		throw new Error('useLanguage must be used inside a LanguageProvider');
	}
	return ctx;
};
