import { DBButton } from '@db-ux/react-core-components';

export const ThemeButtons = () => {
	const switchMode = (mode: string) => {
		const iframe = document.getElementById('demo-iframe') as HTMLIFrameElement;
		if (iframe) {
			iframe.src = `/demo?mode=${mode}`;
		}
	};

	return (
		<div style={{ display: 'flex', gap: 'var(--db-spacing-fixed-sm)' }}>
			<DBButton variant="filled" onClick={() => switchMode('light')}>
				Light
			</DBButton>
			<DBButton variant="filled" onClick={() => switchMode('dark')}>
				Dark
			</DBButton>
		</div>
	);
};
