import { type ReactElement } from 'react';
import { DBInfotext } from '@db-ux/react-core-components';
import { columns, SEMANTICS, SIZES, type OverviewLabels } from './_shared.tsx';

/*
 * One row per size, holding every semantic next to each other. Always with the
 * icon, which is the component's default: without it the semantic is carried by
 * color alone, which is not a state worth putting forward here.
 *
 * A single column, so each size gets the full content width for its six
 * semantics instead of wrapping them inside half of it.
 */
export const InfotextOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(1)}>
		{SIZES.map((size) => (
			<div key={size} className="overview-row">
				{SEMANTICS.map((semantic) => (
					<DBInfotext key={semantic} semantic={semantic} size={size}>
						{labels.infotextSemantics[semantic]}
					</DBInfotext>
				))}
			</div>
		))}
	</div>
);
