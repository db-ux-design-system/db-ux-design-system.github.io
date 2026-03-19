import { useEffect } from 'react';
import { useColorMode } from '@template/context/color-mode-context';
import { useTheme, type ThemeName } from '@template/context/theme-context';

const VALID_THEMES: ThemeName[] = ['default', 's-bahn', 'station', 'neutral'];

export function useDemoUrlParams() {
	const { setColorMode } = useColorMode();
	const { setTheme } = useTheme();

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const mode = params.get('mode');
		const theme = params.get('theme') as ThemeName | null;

		if (mode === 'light' || mode === 'dark') {
			setColorMode(mode);
			document.documentElement.setAttribute('data-mode', mode);
		}

		if (theme && VALID_THEMES.includes(theme)) {
			setTheme(theme);
		}
	}, [setColorMode, setTheme]);
}
