import { type ReactElement } from 'react';
import {
	DBTabItem,
	DBTabList,
	DBTabPanel,
	DBTabs,
} from '@db-ux/react-core-components';
import {
	TABS_ORIENTATIONS,
	type OverviewLabels,
	type TabsOrientation,
} from './_shared.tsx';

/*
 * One tab set per orientation, horizontal and vertical.
 *
 * Orientation is the dimension this block shows: it lays the tab list out as a
 * row or a column and switches the arrow keys that move between tabs. The tab
 * list, tab items and tab panels are the composition the component is built from
 * — documented as sub components, so they take no section of their own.
 *
 * Mounted in the browser. The component builds its selection in an effect: the
 * active tab's `aria-selected`, the `aria-controls`/`aria-labelledby` links
 * between tab and panel, the roving `tabindex` and the hiding of the inactive
 * panels are all set from script. Rendered alone it would show every panel at
 * once, with no tab marked selected and no keyboard support — so it has to run.
 *
 * Uncontrolled: the component owns the active tab and switches it on click and on
 * arrow keys by itself, which is the behaviour on show here. Each tab list
 * carries its own `label`, built from the orientation, so the two landmarks can
 * be told apart.
 */
const TabsCell = ({
	orientation,
	labels,
}: {
	orientation: TabsOrientation;
	labels: OverviewLabels;
}): ReactElement => (
	<DBTabs
		orientation={orientation}
		label={`${labels.tabsLabel} ${labels.tabsOrientations[orientation]}`}
	>
		<DBTabList>
			{labels.tabsItems.map((tab) => (
				<DBTabItem key={tab.label}>{tab.label}</DBTabItem>
			))}
		</DBTabList>
		{labels.tabsItems.map((tab) => (
			<DBTabPanel key={tab.label}>{tab.content}</DBTabPanel>
		))}
	</DBTabs>
);

export const TabsOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{TABS_ORIENTATIONS.map((orientation) => (
			<TabsCell key={orientation} orientation={orientation} labels={labels} />
		))}
	</>
);
