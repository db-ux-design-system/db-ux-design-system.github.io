import { type ReactElement } from 'react';
import { DBLoadingIndicator } from '@db-ux/react-core-components';
import {
	LOADING_INDICATOR_COLUMNS,
	LOADING_INDICATOR_RESULTS,
	LOADING_INDICATOR_SIZES,
	type OverviewLabels,
} from './_shared.tsx';

/*
 * One column per shape and orientation, each holding the same rows: the three
 * sizes while the load runs, the states the load ends in, and a determinate
 * specimen. Every column carries every row, so a row can be read across the
 * columns — which is what the orientation dimension is here for.
 *
 * The visible label is the name of the specimen, so no extra caption is needed —
 * the component asks for a label anyway, since the indicator alone says that
 * something is loading but not what.
 *
 * Mounted in the browser. The component seeds its state in an effect, so a
 * specimen rendered alone stays at `inactive` no matter what `state` says: every
 * indicator would show the same empty track. It also links its label to the
 * progress element through an id it only assigns once it runs, the same as the
 * input and the custom select.
 *
 * `active` is the one state that animates. It is the component's own animation
 * and it follows `prefers-reduced-motion`: the segment then advances in eight
 * discrete steps instead of gliding. Nothing of that is touched here.
 */
const LoadingIndicatorCell = ({
	variant,
	orientation,
	labels,
}: {
	variant: 'circular' | 'bar';
	orientation: 'horizontal' | 'vertical';
	labels: OverviewLabels;
}): ReactElement => (
	<div
		className="overview-stack"
		/*
		 * Only the upright column is centred. Its specimens are a circle with the
		 * label underneath, so each row is about as wide as its own text and the
		 * column has no edge to align to — left-aligned next to the wider columns
		 * they read as a ragged edge rather than as a column. Every other column
		 * has specimens of comparable width and keeps the start alignment.
		 */
		data-align={orientation === 'vertical' ? 'center' : undefined}
	>
		{LOADING_INDICATOR_SIZES.map((size) => (
			<DBLoadingIndicator
				key={size}
				variant={variant}
				orientation={orientation}
				size={size}
				state="active"
			>
				{labels.loadingIndicatorSizes[size]}
			</DBLoadingIndicator>
		))}
		{LOADING_INDICATOR_RESULTS.map((state) => (
			<DBLoadingIndicator key={state} variant={variant} orientation={orientation} state={state}>
				{labels.loadingIndicatorResults[state]}
			</DBLoadingIndicator>
		))}
		{/*
		 * A known progress instead of an ongoing one. `indeterminate` has to be
		 * turned off explicitly — it is the component's default, and with it on,
		 * `value` and `max` are ignored.
		 */}
		<DBLoadingIndicator
			variant={variant}
			orientation={orientation}
			state="active"
			indeterminate={false}
			value={42}
			max={100}
			progressText={labels.loadingIndicatorProgress}
			showProgressText
		>
			{labels.loadingIndicatorDeterminate}
		</DBLoadingIndicator>
	</div>
);

export const LoadingIndicatorOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{LOADING_INDICATOR_COLUMNS.map((column) => (
			<LoadingIndicatorCell
				key={`${column.variant}-${column.orientation}`}
				variant={column.variant}
				orientation={column.orientation}
				labels={labels}
			/>
		))}
	</>
);
