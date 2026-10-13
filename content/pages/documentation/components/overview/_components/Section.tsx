import { type ReactElement } from 'react';
import { DBSection } from '@db-ux/react-core-components';
import {
	columns,
	SECTION_SPACINGS,
	type OverviewLabels,
	type SectionSpacing,
} from './_shared.tsx';

/*
 * One section per spacing step, each wrapping the same placeholder content.
 *
 * A section has no optics of its own: it is a layout region that sets the inner
 * spacing around its content and, through `width`, a maximum content width. The
 * spacing is the one dimension that shows on its own, so the specimens compare
 * it directly — three steps, widest first, so the shrinking padding reads top to
 * bottom.
 *
 * The spacing is only visible against the content it surrounds, so each section
 * carries a placeholder box and sits on a tinted panel: the gap between the box
 * and the panel edge is the section's padding. Without that contrast the section
 * would render as an empty area and show nothing.
 *
 * `width` is left out as a dimension. It caps the content width and only shows
 * once the content area is wider than the cap, which the half-width grid column
 * here never is — every specimen would look identical. It is noted for the review
 * instead of shown misleadingly.
 */
const SectionCell = ({
	spacing,
	labels,
}: {
	spacing: SectionSpacing;
	labels: OverviewLabels;
}): ReactElement => (
	<div className="overview-section-preview">
		<DBSection spacing={spacing}>
			<div className="overview-placeholder">
				{`${labels.sectionSpacings[spacing]} · ${labels.sectionContent}`}
			</div>
		</DBSection>
	</div>
);

export const SectionOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(1)}>
		{SECTION_SPACINGS.map((spacing) => (
			<SectionCell key={spacing} spacing={spacing} labels={labels} />
		))}
	</div>
);
