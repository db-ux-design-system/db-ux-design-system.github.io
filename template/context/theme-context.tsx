import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ThemeName = 'default' | 's-bahn' | 'station' | 'neutral';

interface ThemeContextValue {
	themeName: ThemeName;
	setTheme: (name: ThemeName) => void;
	logo: string;
	logoSvg: string | null;
}

const STORAGE_KEY = 'db-ux-theme';

const THEME_LOGOS: Record<ThemeName, string> = {
	default: 'Deutsche Bahn',
	's-bahn': 'S-Bahn',
	station: 'Station',
	neutral: 'Neutral',
};

const THEME_LOGO_SVGS: Record<ThemeName, string | null> = {
	default: "/db_logo.svg",
	's-bahn': '/sbahn-logo.svg',
	station: '/db_logo.svg',
	neutral: '/neutral-logo.svg',
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): ThemeName {
	if (typeof window === 'undefined') {
		return 'default';
	}

	const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null;
	if (stored && stored in THEME_LOGOS) {
		return stored;
	}

	return 'default';
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [themeName, setThemeName] = useState<ThemeName>(getInitialTheme);

	useEffect(() => {
		window.localStorage.setItem(STORAGE_KEY, themeName);
		document.documentElement.setAttribute('data-theme', themeName);
	}, [themeName]);

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', themeName);
	}, []);

	const value: ThemeContextValue = {
		themeName,
		setTheme: setThemeName,
		logo: THEME_LOGOS[themeName],
		logoSvg: THEME_LOGO_SVGS[themeName],
	};

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error('useTheme must be used inside a ThemeProvider');
	}
	return ctx;
};
