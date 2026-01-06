import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type ColorMode = 'light' | 'dark';

interface ColorModeContextValue {
	colorMode: ColorMode;
	setColorMode: (colorMode: ColorMode) => void;
	toggleColorMode: () => void;
}

const STORAGE_KEY = 'db-ux-mode';
const SHELL_SELECTOR = '.db-shell';

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

function getInitialColorMode(): ColorMode {
	if (typeof window === 'undefined') {
		return 'light';
	}

	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark') {
		return stored;
	}

	return 'light';
}

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
	const [colorMode, setColorMode] = useState<ColorMode>(getInitialColorMode);

	useEffect(() => {
		window.localStorage.setItem('db-ux-mode', colorMode);

		const shell = document.querySelector(SHELL_SELECTOR);
		if (shell instanceof HTMLElement) {
			shell.setAttribute('data-mode', colorMode);
		}
	}, [colorMode]);

	const setMode = (next: ColorMode) => {
		setColorMode(next);
	};

	const toggleColorMode = () => {
		setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'));
	};

	const value: ColorModeContextValue = { colorMode, setColorMode: setMode, toggleColorMode };

	return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
};

export const useColorMode = (): ColorModeContextValue => {
	const ctx = useContext(ColorModeContext);
	if (!ctx) {
		throw new Error('useColorMode must be used inside a ColorModeProvider');
	}
	return ctx;
};
