import {
	DBShell,
	DBControlPanelDesktop,
	DBControlPanelBrand,
	DBNavigation,
	DBNavigationItem,
	DBControlPanelPrimaryActions,
	DBButton,
} from '@db-ux/react-core-components';

export default function ShellExample() {
	return (
		<DBShell
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
						<DBButton variant="brand">
							Call to Action
						</DBButton>
					</DBControlPanelPrimaryActions>
				</DBControlPanelDesktop>
			}
		></DBShell>
	);
}
