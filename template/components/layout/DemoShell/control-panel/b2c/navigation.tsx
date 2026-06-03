import { DBNavigation, DBNavigationItem } from '@db-ux/react-core-components';

const DemoB2CNavigation = () => (
	<DBNavigation variant="tree">
		<DBNavigationItem>
			<a href="#" aria-current="page">
				Tickets &amp; Angebote
			</a>
		</DBNavigationItem>
		<DBNavigationItem>
			<a href="#">Info & Services</a>
		</DBNavigationItem>
		<DBNavigationItem>
			<a href="#">Meine Reisen</a>
		</DBNavigationItem>
	</DBNavigation>
);

export default DemoB2CNavigation;
