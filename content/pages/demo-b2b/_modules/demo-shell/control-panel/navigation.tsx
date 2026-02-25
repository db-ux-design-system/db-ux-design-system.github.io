import { DBNavigation, DBNavigationItem } from '@db-ux/react-core-components';

const DemoNavigation = () => (
	<DBNavigation variant="tree">
		<DBNavigationItem icon="speedometer" label="Dashboard">
			<a href="#" aria-current="page">
				Dashboard
			</a>
		</DBNavigationItem>
		<DBNavigationItem icon="line_chart" label="Analytics">
			<a href="#">Analytics</a>
		</DBNavigationItem>
		<DBNavigationItem icon="folder" label="Projects">
			<a href="#">Projects</a>
		</DBNavigationItem>
		<DBNavigationItem icon="persons" label="Teams">
			<a href="#">Teams</a>
		</DBNavigationItem>
	</DBNavigation>
);

export default DemoNavigation;
