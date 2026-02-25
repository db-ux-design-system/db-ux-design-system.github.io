import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { appConfig } from '@config';

type Theme = 'default' | 's-bahn' | 'station' | 'neutral';

interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	logo: string;
	icon: string;
	logoSvg: string | null;
}

const STORAGE_KEY = 'db-ux-theme';

const THEME_LOGOS: Record<Theme, string> = {
	default: 'Deutsche Bahn',
	's-bahn': 'S-Bahn',
	station: 'Station',
	neutral: 'Neutral',
};

const THEME_LOGO_SVGS: Record<Theme, string | null> = {
	default: null,
	's-bahn': '/sbahn-logo.svg',
	station: null,
	neutral: null,
};

const THEME_ICONS: Record<Theme, string> = {
	default: 'brand',
	's-bahn': 'brand',
	station: 'brand',
	neutral: 'train',
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
	if (typeof window === 'undefined') {
		return 'default';
	}

	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored === 'default' || stored === 's-bahn' || stored === 'station' || stored === 'neutral') {
		return stored;
	}

	return 'default';
}

function loadThemeCSS(theme: Theme) {
	const existingLink = document.getElementById('theme-css');
	if (existingLink) {
		existingLink.remove();
	}

	if (theme === 'default') return;

	const link = document.createElement('link');
	link.id = 'theme-css';
	link.rel = 'stylesheet';
	const themePath =
		theme === 's-bahn'
			? 'sbahn-variables.css'
			: theme === 'neutral'
			? 'neutral-variables.css'
			: 'station-variables.css';
	link.href = `${appConfig.basePath}template/themes/${themePath}`;
	document.head.appendChild(link);
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);
	const [logo, setLogo] = useState<string>(THEME_LOGOS[getInitialTheme()]);
	const [icon, setIcon] = useState<string>(THEME_ICONS[getInitialTheme()]);
	const [logoSvg, setLogoSvg] = useState<string | null>(THEME_LOGO_SVGS[getInitialTheme()]);

	useEffect(() => {
		window.localStorage.setItem(STORAGE_KEY, theme);
		loadThemeCSS(theme);
		setLogo(THEME_LOGOS[theme]);
		setIcon(THEME_ICONS[theme]);
		setLogoSvg(THEME_LOGO_SVGS[theme]);
	}, [theme]);

	const value: ThemeContextValue = { theme, setTheme, logo, icon, logoSvg };

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error('useTheme must be used inside a ThemeProvider');
	}
	return ctx;
};
