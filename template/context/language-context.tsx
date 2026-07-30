import { createContext, useContext, useMemo, type ReactNode } from 'react';

export type Language = 'en' | 'de';

interface LanguageContextValue {
	language: Language;
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

	const value: LanguageContextValue = { language };

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
	const ctx = useContext(LanguageContext);
	if (!ctx) {
		// Fallback for components used outside LanguageProvider (e.g. in DemoShell)
		return { language: 'en' };
	}
	return ctx;
};
