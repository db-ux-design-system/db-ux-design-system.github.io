import {
	DBControlPanelNavigation,
	DBControlPanelNavigationItem,
} from '@db-ux/react-core-components';

const DemoNavigation = () => (
	<DBControlPanelNavigation variant="tree">
		<DBControlPanelNavigationItem icon="speedometer">
			<a href="#" aria-current="page">
				Dashboard
			</a>
		</DBControlPanelNavigationItem>
		<DBControlPanelNavigationItem icon="line_chart">
			<a href="#">Analytics</a>
		</DBControlPanelNavigationItem>
		<DBControlPanelNavigationItem icon="folder">
			<a href="#">Projects</a>
		</DBControlPanelNavigationItem>
		<DBControlPanelNavigationItem icon="persons">
			<a href="#">Teams</a>
		</DBControlPanelNavigationItem>
	</DBControlPanelNavigation>
);

export default DemoNavigation;
