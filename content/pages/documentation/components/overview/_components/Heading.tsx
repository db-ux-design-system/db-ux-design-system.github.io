import { type ReactElement } from 'react';
import { DBHeadingH3 } from '@db-ux/react-core-components';
import {
	columns,
	HEADING_FONT_WEIGHTS,
	HEADING_LEVEL_FONT_WEIGHTS,
	HEADING_LEVEL_SIZES,
	HEADING_LEVELS,
	HEADING_SIZE_LEVELS,
	HEADING_SIZES,
	type HeadingFontWeight,
	type HeadingSize,
	type OverviewLabels,
} from './_shared.tsx';

/*
 * One row of a heading set: the same shape in each of its font weights, next to
 * each other.
 *
 * Only the first specimen carries the name of the row, the others name their
 * weight alone. Repeating the row name in front of every weight would say the
 * same thing three times in one line and push the longest rows off a narrow
 * viewport for nothing.
 *
 * Every specimen is an h3 with an explicit `size`, deliberately: the page uses h1
 * for its title and h2 for every component section, so a specimen carrying one of
 * those tags would corrupt the document outline. Separating the semantic level
 * from the visual size is what the component offers `size` for.
 */
const HeadingRow = ({
	name,
	size,
	weights,
	labels,
}: {
	name: string;
	size: HeadingSize;
	weights: readonly HeadingFontWeight[];
	labels: OverviewLabels;
}): ReactElement => (
	<div className="overview-row">
		{weights.map((weight, index) => (
			<DBHeadingH3 key={weight} size={size} fontWeight={weight}>
				{index === 0
					? `${name} ${labels.headingFontWeights[weight]}`
					: labels.headingFontWeights[weight]}
			</DBHeadingH3>
		))}
	</div>
);

/*
 * Two sets of rows, one per version, both in the markup at the same time.
 *
 * The version switch is pure CSS — it matches the selected option with `:has()`
 * and redefines tokens — so it cannot change what is rendered. Both sets are
 * therefore always rendered and the stylesheet shows the one that fits, the same
 * way the rounded drawer row disappears in v6.
 *
 * v5 is the visual size scale the component has today, nine rows, each naming the
 * level that defaults to that size. v6 is the six semantic levels, which is all
 * that is left of the scale there, each at the size its level maps to.
 */
export const HeadingOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(1)}>
		<div className="overview-stack" data-overview-version="v5">
			{HEADING_SIZES.map((size) => {
				const level = HEADING_SIZE_LEVELS[size];

				return (
					<HeadingRow
						key={size}
						size={size}
						/*
						 * The level in brackets behind the size token, where there is one:
						 * three of the nine sizes are not the default of any level.
						 */
						name={
							level
								? `${labels.headingSizes[size]} (${labels.headingLevels[level]})`
								: labels.headingSizes[size]
						}
						weights={HEADING_FONT_WEIGHTS}
						labels={labels}
					/>
				);
			})}
		</div>
		{/*
		 * H1 and H2 are to show a third weight, Wide ExtraBlack, which neither the
		 * component nor the theme offers yet — it arrives with the next brand
		 * generation and is then added to HEADING_LEVEL_FONT_WEIGHTS.
		 */}
		<div className="overview-stack" data-overview-version="v6">
			{HEADING_LEVELS.map((level) => (
				<HeadingRow
					key={level}
					size={HEADING_LEVEL_SIZES[level]}
					name={labels.headingLevels[level]}
					weights={HEADING_LEVEL_FONT_WEIGHTS[level]}
					labels={labels}
				/>
			))}
		</div>
	</div>
);
