import {
	DBControlPanelNavigation,
	DBControlPanelNavigationItem,
} from '@db-ux/react-core-components';

const DemoNavigation = () => (
	<DBControlPanelNavigation>
		<DBControlPanelNavigationItem active>
			<a href="#">Tickets &amp; Angebote</a>
		</DBControlPanelNavigationItem>
		<DBControlPanelNavigationItem>
			<a href="#">Info & Services</a>
		</DBControlPanelNavigationItem>
		<DBControlPanelNavigationItem>
			<a href="#">Meine Reisen</a>
		</DBControlPanelNavigationItem>
	</DBControlPanelNavigation>
);

export default DemoNavigation;
