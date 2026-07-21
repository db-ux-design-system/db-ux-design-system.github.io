import { createContext, useContext, useMemo, type ReactNode } from 'react';

export type Language = 'en' | 'de';

interface LanguageContextValue {
	language: Language;
	toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function deriveLanguage(pathname?: string): Language {
	const path = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
	return path.startsWith('/de/') || path === '/de' ? 'de' : 'en';
}

interface LanguageProviderProps {
	pathname?: string;
	children: ReactNode;
}

export const LanguageProvider = ({ pathname, children }: LanguageProviderProps) => {
	const language = useMemo(() => deriveLanguage(pathname), [pathname]);

	const toggleLanguage = () => {
		const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

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
