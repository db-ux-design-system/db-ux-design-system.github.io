import { type ReactElement } from 'react';
import { DBButton, DBTooltip } from '@db-ux/react-core-components';
import { POPOVER_PLACEMENTS, type OverviewLabels } from './_shared.tsx';

/*
 * One trigger per placement, the same shape as the popover block and the same
 * reason: `placement` is the one dimension both components show their panel
 * along.
 *
 * Mounted, like the button block's own tooltip and the popover: the component
 * places its panel from script, and without that it stays absolutely
 * positioned below its trigger, where an ancestor with `overflow` can cut it
 * off — the same gap PopoverOverview documents, just for the sibling component
 * that shares the mechanism.
 */
export const TooltipOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-row">
		{POPOVER_PLACEMENTS.map((placement) => (
			<DBButton key={placement} type="button" variant="filled">
				{labels.popoverPlacements[placement]}
				<DBTooltip placement={placement}>{labels.tooltipText}</DBTooltip>
			</DBButton>
		))}
	</div>
);
