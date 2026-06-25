import { useEffect } from 'react';
import { DBNavigation } from '@db-ux/react-core-components';
import { appNavigation } from '@root/app.navigation.ts';
import NavItem from './nav-item.tsx';

const MainNavigation = ({ mobile }: { mobile?: boolean }) => {
	useEffect(() => {
		setTimeout(() => {
			const sidebar = document.querySelector('[aria-label="sub navigation"]');
			const el = sidebar?.querySelector('[aria-current="page"]');
			if (el) {
				el.scrollIntoView({ block: 'center', behavior: 'instant' });
			}
		}, 300);
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
