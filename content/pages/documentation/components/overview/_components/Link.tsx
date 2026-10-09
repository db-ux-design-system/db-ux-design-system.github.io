import { type ReactElement } from 'react';
import { DBLink } from '@db-ux/react-core-components';
import { columns, LINK_SPECIMENS, type OverviewLabels, type Size } from './_shared.tsx';

/*
 * One size column, holding the variants below each other, each with the arrow it
 * carries.
 */
const LinkCell = ({ size, labels }: { size: Size; labels: OverviewLabels }): ReactElement => (
	<div className="overview-stack">
		{LINK_SPECIMENS.map((specimen) => (
			<DBLink
				key={specimen.key}
				href={labels.selfUrl}
				size={size}
				variant={specimen.variant}
				content={specimen.content}
			>
				{labels.linkSpecimens[specimen.key]}
			</DBLink>
		))}
	</div>
);

export const LinkOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(2)}>
		<LinkCell size="small" labels={labels} />
		<LinkCell size="medium" labels={labels} />
	</div>
);
