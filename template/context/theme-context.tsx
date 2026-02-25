import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ThemeName = 'default' | 's-bahn' | 'station' | 'neutral';

export interface Theme {
	name: ThemeName;
	logo: string;
	icon: string;
	logoSvg: string | null;
}

interface ThemeContextValue {
	theme: Theme;
	setTheme: (name: ThemeName) => void;
}

const STORAGE_KEY = 'db-ux-theme';

const THEMES: Record<ThemeName, Theme> = {
	default: {
		name: 'default',
		logo: 'Deutsche Bahn',
		icon: 'brand',
		logoSvg: null,
	},
	's-bahn': {
		name: 's-bahn',
		logo: 'S-Bahn',
		icon: 'brand',
		logoSvg: '/sbahn-logo.svg',
	},
	station: {
		name: 'station',
		logo: 'Station',
		icon: 'brand',
		logoSvg: null,
	},
	neutral: {
		name: 'neutral',
		logo: 'Neutral',
		icon: 'train',
		logoSvg: '/neutral-logo.svg',
	},
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
	if (typeof window === 'undefined') {
		return THEMES.default;
	}

	const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null;
	if (stored && stored in THEMES) {
		return THEMES[stored];
	}

	return THEMES.default;
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setThemeState] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		window.localStorage.setItem(STORAGE_KEY, theme.name);
		document.documentElement.setAttribute('data-theme', theme.name);
	}, [theme]);

	useEffect(() => {
		// Set initial theme on mount
		document.documentElement.setAttribute('data-theme', theme.name);
	}, []);

	const setTheme = (name: ThemeName) => {
		setThemeState(THEMES[name]);
	};

	const value: ThemeContextValue = { theme, setTheme };

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error('useTheme must be used inside a ThemeProvider');
	}
	return ctx;
};
