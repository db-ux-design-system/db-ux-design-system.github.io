import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Language = 'en' | 'de';

interface LanguageContextValue {
	language: Language;
	setLanguage: (language: Language) => void;
	toggleLanguage: () => void;
}

const STORAGE_KEY = 'db-ux-language';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function getInitialLanguage(): Language {
	if (typeof window === 'undefined') {
		return 'en';
	}

	// Derive language from URL prefix
	if (window.location.pathname.startsWith('/de/') || window.location.pathname === '/de') {
		return 'de';
	}

	return 'en';
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const [language, setLanguage] = useState<Language>(getInitialLanguage);

	useEffect(() => {
		document.documentElement.lang = language;
	}, [language]);

	const toggleLanguage = () => {
		const currentPath = window.location.pathname;

		if (language === 'en') {
			// Navigate to /de/ version
			window.location.href = '/de' + currentPath;
		} else {
			// Navigate to EN version (remove /de prefix)
			const enPath = currentPath.replace(/^\/de/, '') || '/';
			window.location.href = enPath;
		}
	};

	const value: LanguageContextValue = { language, setLanguage, toggleLanguage };

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
	const ctx = useContext(LanguageContext);
	if (!ctx) {
		throw new Error('useLanguage must be used inside a LanguageProvider');
	}
	return ctx;
};
