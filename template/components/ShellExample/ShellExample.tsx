import {
	DBShell,
	DBControlPanelDesktop,
	DBControlPanelBrand,
	DBNavigation,
	DBNavigationItem,
	DBControlPanelPrimaryActions,
} from '@db-ux/react-core-components';
import { useRef, useEffect } from 'react';

export default function ShellExample() {
	const shellRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Demote the nested <main> to a non-landmark element so it doesn't
		// conflict with the page's own <main> landmark.
		const main = shellRef.current?.querySelector('main');
		if (main) {
			main.role = 'presentation';
		}
	}, []);

	return (
		<DBShell
			ref={shellRef}
			style={{ height: 'auto' }}
			controlPanelDesktop={
				<DBControlPanelDesktop
					brand={
						<DBControlPanelBrand icon="brand">
							<a href="/">Name</a>
						</DBControlPanelBrand>
					}
				>
					<DBNavigation>
						<DBNavigationItem>
							<a href="#">Nav Item 1</a>
						</DBNavigationItem>
						<DBNavigationItem>
							<a href="#">Nav Item 2</a>
						</DBNavigationItem>
						<DBNavigationItem>
							<a href="#">Nav Item 3</a>
						</DBNavigationItem>
					</DBNavigation>
					<DBControlPanelPrimaryActions>
						<a className="db-button" data-variant="brand">
							Call to Action
						</a>
					</DBControlPanelPrimaryActions>
				</DBControlPanelDesktop>
			}
		></DBShell>
	);
}
