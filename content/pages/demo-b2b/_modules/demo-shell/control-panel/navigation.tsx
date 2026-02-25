import { DBNavigation, DBNavigationItem } from '@db-ux/react-core-components';

const DemoNavigation = () => (
	<DBNavigation variant="tree">
		<DBNavigationItem icon="speedometer">
			<a href="#" aria-current="page">
				Dashboard
			</a>
		</DBNavigationItem>
		<DBNavigationItem icon="line_chart">
			<a href="#">Analytics</a>
		</DBNavigationItem>
		<DBNavigationItem icon="folder">
			<a href="#">Projects</a>
		</DBNavigationItem>
		<DBNavigationItem icon="persons">
			<a href="#">Teams</a>
		</DBNavigationItem>
	</DBNavigation>
);

export default DemoNavigation;
