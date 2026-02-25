import { DBStack, DBButton } from '@db-ux/react-core-components';

export const DemoThemeSwitcher = () => {
	const switchTheme = (mode: 'light' | 'dark') => {
		const iframe = document.querySelector('#demo-iframe') as HTMLIFrameElement;
		if (iframe?.contentWindow) {
			iframe.contentWindow.postMessage({ type: 'SET_MODE', mode }, '*');
		}
	};

	return (
		<DBStack direction="row" gap="small">
			<DBButton variant="outlined" onClick={() => switchTheme('light')}>
				Light
			</DBButton>
			<DBButton variant="outlined" onClick={() => switchTheme('dark')}>
				Dark
			</DBButton>
		</DBStack>
	);
};
