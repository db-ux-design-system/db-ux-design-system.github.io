import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { appConfig } from '@config';

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
		logoSvg: null,
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

function loadThemeCSS(theme: Theme) {
	const existingLink = document.getElementById('theme-css');
	if (existingLink) {
		existingLink.remove();
	}

	if (theme.name === 'default') return;

	const link = document.createElement('link');
	link.id = 'theme-css';
	link.rel = 'stylesheet';
	const themePath =
		theme.name === 's-bahn'
			? 'sbahn-variables.css'
			: theme.name === 'neutral'
			? 'neutral-variables.css'
			: 'station-variables.css';
	link.href = `${appConfig.basePath}template/themes/${themePath}`;
	document.head.appendChild(link);
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setThemeState] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		window.localStorage.setItem(STORAGE_KEY, theme.name);
		loadThemeCSS(theme);
	}, [theme]);

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
