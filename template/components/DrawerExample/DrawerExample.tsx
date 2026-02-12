import { DBDrawer } from '@db-ux/react-core-components';
import { useState, useEffect } from 'react';

export default function DrawerExample({ direction = 'right', backdrop = 'strong' }) {
	const [open, setOpen] = useState(true);
	const [currentDirection, setCurrentDirection] = useState(direction);
	const [currentBackdrop, setCurrentBackdrop] = useState(backdrop);

	useEffect(() => {
		const handleOpen = (e: CustomEvent) => setOpen(e.detail);
		const handleDirection = (e: CustomEvent) => setCurrentDirection(e.detail);
		const handleBackdrop = (e: CustomEvent) => setCurrentBackdrop(e.detail);

		window.addEventListener('drawer-open', handleOpen as EventListener);
		window.addEventListener('drawer-direction', handleDirection as EventListener);
		window.addEventListener('drawer-backdrop', handleBackdrop as EventListener);

		return () => {
			window.removeEventListener('drawer-open', handleOpen as EventListener);
			window.removeEventListener('drawer-direction', handleDirection as EventListener);
			window.removeEventListener('drawer-backdrop', handleBackdrop as EventListener);
		};
	}, []);

	useEffect(() => {
		setTimeout(() => {
			const dialog = document.querySelector('.db-drawer') as HTMLDialogElement;
			if (dialog) {
				if (open) {
					if (!dialog.hasAttribute('open')) {
						dialog.showModal();
					}
				} else {
					if (dialog.hasAttribute('open')) {
						dialog.close();
					}
				}
			}
		}, 100);
	}, [open]);

	return (
		<DBDrawer
			open={open}
			direction={currentDirection}
			backdrop={currentBackdrop}
			onClose={() => setOpen(false)}
			drawerHeader={<header>Drawer Title</header>}
		>
			<p>This is the drawer content. You can add any content here.</p>
		</DBDrawer>
	);
}
