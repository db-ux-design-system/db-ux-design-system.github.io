import { Fragment, type ReactElement } from 'react';
import { DBButton, DBTooltip } from '@db-ux/react-core-components';
import { BUTTON_VARIANTS, SIZES, type OverviewLabels } from './_shared.tsx';

/*
 * One row per variant, with both sizes next to each other. Each size shows text,
 * icon with text and icon only. The icon-only button keeps its text as an
 * accessible name; `noText` only hides it visually.
 *
 * Mounted in the browser because of the tooltip on the icon-only button: the
 * tooltip places itself from script, and without that it stays absolutely
 * positioned below its button — invisible, but tall enough to make the document
 * itself scrollable, which pushed the whole shell out of place as soon as a table
 * of contents link scrolled to an anchor.
 */
export const ButtonOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{BUTTON_VARIANTS.map((variant) => (
			<Fragment key={variant}>
				{SIZES.map((size) => (
					<Fragment key={size}>
						<DBButton type="button" variant={variant} size={size}>
							{labels.button}
						</DBButton>
						<DBButton type="button" variant={variant} size={size} icon="plus">
							{labels.button}
						</DBButton>
						<DBButton type="button" variant={variant} size={size} icon="plus" noText>
							{labels.add}
							{/*
							 * An icon-only button needs the tooltip: without it the name is
							 * only available to assistive technology, while anyone looking
							 * at the icon has no way to find out what it does. Same string
							 * as the button text, so there is one source for both.
							 */}
							<DBTooltip>{labels.add}</DBTooltip>
						</DBButton>
					</Fragment>
				))}
			</Fragment>
		))}
	</>
);
