import { useEffect } from 'react';
import { DBNavigation } from '@db-ux/react-core-components';
import { appNavigation } from '@root/app.navigation.ts';
import NavItem from './nav-item.tsx';

const MainNavigation = ({ mobile }: { mobile?: boolean }) => {
	useEffect(() => {
		let observer: MutationObserver | undefined;
		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		const scrollActiveItemIntoView = (): boolean => {
			const sidebar = document.querySelector('[aria-label="sub navigation"]');
			const activeItem = sidebar?.querySelector('[aria-current="page"]');
			if (!activeItem) return false;
			activeItem.scrollIntoView({ block: 'center', behavior: 'instant' });
			return true;
		};

		const stop = () => {
			observer?.disconnect();
			if (timeoutId) clearTimeout(timeoutId);
		};

		if (scrollActiveItemIntoView()) return;

		observer = new MutationObserver(() => {
			if (scrollActiveItemIntoView()) stop();
		});
		observer.observe(document.body, { childList: true, subtree: true });
		timeoutId = setTimeout(stop, 2000);

		return stop;
	}, []);

	return (
		<DBNavigation variant={mobile ? 'tree' : 'popover'} aria-label="main navigation">
			{appNavigation.map((navigationItem: NavigationItem) => (
				<NavItem key={`router-${navigationItem.path}-${navigationItem.title}`} {...navigationItem} />
			))}
		</DBNavigation>
	);
};

export default MainNavigation;
