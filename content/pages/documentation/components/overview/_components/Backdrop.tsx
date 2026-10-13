import { type ReactElement } from 'react';
import { columns, type OverviewLabels } from './_shared.tsx';

/*
 * The backdrop as a layer over sample content, bounded by a preview box.
 *
 * There is no backdrop component: the documentation states this and names the
 * color recipe instead, which the stylesheet carries. Shown in both steps the
 * recipe offers, the stronger one first.
 *
 * The preview box is what keeps the layer in place. A real backdrop covers the
 * whole viewport, which on this page would dim the overview itself, so the box
 * provides the positioning context the layer is bound to.
 *
 * An empty dialog surface sits above the dim layer in each box, the way a real
 * backdrop is only ever seen behind an open overlay: it is what the backdrop
 * dims the page for. Kept empty so the eye reads the backdrop, not the dialog.
 */
export const BackdropOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(2)}>
		{(['strong', 'weak'] as const).map((emphasis) => (
			<div key={emphasis} className="overview-backdrop">
				<span>{labels.backdropContent}</span>
				<div className="overview-backdrop-layer" data-emphasis={emphasis} />
				<div className="overview-backdrop-dialog" />
			</div>
		))}
	</div>
);
