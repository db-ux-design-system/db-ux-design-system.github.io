import { type ReactElement } from 'react';
import { DBButton, DBPopover } from '@db-ux/react-core-components';
import { POPOVER_PLACEMENTS, type OverviewLabels } from './_shared.tsx';

/*
 * The popover through its triggers, like the dialog and the drawer above: the
 * four main placements in one row.
 *
 * Placement is the one dimension here. The panel's padding steps were a second
 * row, which compared four panels that differ by a few pixels of inner spacing
 * and said nothing about the component that the placements do not already show.
 *
 * The trigger is a real button with a real job, so the popover behaves as it does
 * in an application — it opens on hover and on keyboard focus, which is the
 * behavior the component brings without an `open` property. A placeholder that
 * only looks like a trigger would be focusable without doing anything.
 *
 * Mounted in the browser for that reason: without script the panel never opens,
 * and the component also places it from script. Left to the stylesheet it stays
 * absolutely positioned below its trigger, where an ancestor with `overflow` can
 * cut it off.
 */
export const PopoverOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-row">
		{POPOVER_PLACEMENTS.map((placement) => (
			<DBPopover
				key={placement}
				placement={placement}
				trigger={
					<DBButton type="button" variant="filled">
						{labels.popoverPlacements[placement]}
					</DBButton>
				}
			>
				{labels.popoverText}
			</DBPopover>
		))}
	</div>
);
