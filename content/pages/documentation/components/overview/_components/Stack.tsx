import { type ReactElement } from 'react';
import { DBInfotext, DBStack } from '@db-ux/react-core-components';
import {
	columns,
	STACK_DIRECTIONS,
	STACK_GAPS,
	type OverviewLabels,
	type StackDirection,
	type StackGap,
} from './_shared.tsx';

/*
 * One stack per direction, each shown at a small and a large gap.
 *
 * A stack has no optics of its own: it arranges its children in a row or a column
 * and sets the gap between them. Both are shown with the same placeholder boxes,
 * so the direction reads from how the boxes line up and the gap from the distance
 * between them. The two gap steps are far enough apart to tell the dimension is
 * the gap and not a fixed distance.
 *
 * The boxes are neutral placeholders built from design tokens, not coloured
 * sample content: the stack is what is on show, so its children stay plain enough
 * not to compete with the arrangement they sit in.
 */
const StackCell = ({
	direction,
	gap,
	labels,
}: {
	direction: StackDirection;
	gap: StackGap;
	labels: OverviewLabels;
}): ReactElement => (
	<div className="overview-stack">
		{/*
		 * The caption names the direction and gap of the specimen below it. A small
		 * infotext without an icon is the design system's own quiet caption — the
		 * same one its stack examples use — so the size and the text colour come from
		 * the component rather than from a hand-set value.
		 *
		 * `icon="none"` is what hides the icon, and the same value the design
		 * system's own examples use — the badge block's captions among them. It is
		 * not an icon name: no `[data-icon]` rule matches it, so the `::before`
		 * carrying the icon resolves to `none`. `showIcon={false}`, which is the
		 * property the component documents for this, has no effect here — measured
		 * against 5.6.1, the infotext still renders `information_circle` with the
		 * attribute set, and the React layer does not emit the attribute for `false`
		 * in the first place.
		 */}
		<DBInfotext size="small" icon="none">
			{`${labels.stackDirections[direction]} · ${gap}`}
		</DBInfotext>
		<DBStack direction={direction} gap={gap}>
			{labels.stackItems.map((item) => (
				<span key={item} className="overview-placeholder">
					{item}
				</span>
			))}
		</DBStack>
	</div>
);

export const StackOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(2)}>
		{STACK_DIRECTIONS.map((direction) =>
			STACK_GAPS.map((gap) => (
				<StackCell key={`${direction}-${gap}`} direction={direction} gap={gap} labels={labels} />
			)),
		)}
	</div>
);
