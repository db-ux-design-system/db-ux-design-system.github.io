import { DBNavigation, DBNavigationItem } from '@db-ux/react-core-components';

const DemoNavigation = () => (
	<DBNavigation variant="tree">
		<DBNavigationItem>
			<a href="#" aria-current="page">
				Ticktes & Angebote
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

export default DemoNavigation;
