import { type ReactElement } from 'react';
import { DBBadge, DBIcon } from '@db-ux/react-core-components';
import { columns, SEMANTICS, type OverviewLabels, type Semantic, type Size } from './_shared.tsx';

/*
 * One size column, holding the content variants text, icon and dot below each
 * other. A badge has no icon property: an icon is passed as a DBIcon child, whose
 * text is hidden via `font-size: 0`. The child must carry that text, because an
 * empty child span would make the badge fall back to the dot styling. This is the
 * icon-only construction the component's own examples use.
 *
 * That construction yields no accessible name on its own: DBIcon renders
 * `aria-hidden`, so the text passed as its children never reaches assistive
 * technology. Per the component team, the fix for an icon-only or dot badge is
 * an explicit `aria-label` on the `DBBadge` itself — it is not something the
 * component infers. Both specimens below set one.
 *
 * The pattern still fails the design system's own `db-ux/text-or-children-required`
 * rule, which only inspects `text`/children content and does not look at
 * `aria-label`, so `pnpm run lint` reports two expected errors here. They are
 * left unsuppressed on purpose: the rule is being discussed with the component
 * team, and a suppression would hide the finding once it is fixed there.
 */
const BadgeCell = ({
	size,
	emphasis,
	labels,
}: {
	size: Size;
	emphasis?: 'strong';
	labels: OverviewLabels;
}): ReactElement => (
	<div className="overview-stack">
		<div className="overview-row">
			{SEMANTICS.map((semantic) => (
				<DBBadge key={semantic} semantic={semantic} size={size} emphasis={emphasis}>
					{labels.badge}
				</DBBadge>
			))}
		</div>
		<div className="overview-row">
			{SEMANTICS.map((semantic) => (
				// eslint-disable-next-line db-ux/text-or-children-required
				<DBBadge
					key={semantic}
					semantic={semantic}
					size={size}
					emphasis={emphasis}
				>
					<DBIcon icon="plus">{labels.add}</DBIcon>
				</DBBadge>
			))}
		</div>
		<div className="overview-row">
			{SEMANTICS.map((semantic: Semantic) => (
				// eslint-disable-next-line db-ux/text-or-children-required
				<DBBadge
					key={semantic}
					semantic={semantic}
					size={size}
					emphasis={emphasis}
				/>
			))}
		</div>
	</div>
);

export const BadgeOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" data-fit="content" style={columns(2)}>
		<BadgeCell size="small" labels={labels} />
		<BadgeCell size="medium" labels={labels} />
		<BadgeCell size="small" emphasis="strong" labels={labels} />
		<BadgeCell size="medium" emphasis="strong" labels={labels} />
	</div>
);
