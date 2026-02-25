import { DBNavigation, DBNavigationItem } from '@db-ux/react-core-components';

const DemoNavigation = () => (
	<DBNavigation variant="tree">
		<DBNavigationItem label="Dashboard">
			<a href="#" aria-current="page">
				Ticktes & Angebote
			</a>
		</DBNavigationItem>
		<DBNavigationItem label="Analytics">
			<a href="#">Info & Services</a>
		</DBNavigationItem>
		<DBNavigationItem label="Projects">
			<a href="#">Meine Reisen</a>
		</DBNavigationItem>
	</DBNavigation>
);

export default DemoNavigation;
