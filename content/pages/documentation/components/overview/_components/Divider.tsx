import { Fragment, type ReactElement } from 'react';
import { DBDivider } from '@db-ux/react-core-components';
import { columns, DIVIDER_EMPHASIS, type OverviewLabels } from './_shared.tsx';

/*
 * Both orientations, each with the two emphasis steps, between sample content: a
 * divider has no size of its own and takes it from what it separates. The
 * horizontal one needs `width="full"` because the column aligns its content to
 * the start, the vertical one takes its height from the stretched row.
 */
export const DividerOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(2)}>
		<div className="overview-stack">
			{DIVIDER_EMPHASIS.map((emphasis, index) => (
				<Fragment key={emphasis ?? 'weak'}>
					<span>{labels.dividerSegments[index]}</span>
					<DBDivider emphasis={emphasis} width="full" />
				</Fragment>
			))}
			<span>{labels.dividerSegments[DIVIDER_EMPHASIS.length]}</span>
		</div>
		<div className="overview-row" data-align="stretch">
			{DIVIDER_EMPHASIS.map((emphasis, index) => (
				<Fragment key={emphasis ?? 'weak'}>
					<span>{labels.dividerSegments[index]}</span>
					<DBDivider variant="vertical" emphasis={emphasis} />
				</Fragment>
			))}
			<span>{labels.dividerSegments[DIVIDER_EMPHASIS.length]}</span>
		</div>
	</div>
);
