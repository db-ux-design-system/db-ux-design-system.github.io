import { type ReactElement } from 'react';
import {
	DBFooter,
	DBFooterContent,
	DBFooterMeta,
	DBLink,
} from '@db-ux/react-core-components';
import { columns, type OverviewLabels } from './_shared.tsx';

/*
 * The footer across the full content width.
 *
 * It is a page region rather than a control: it lays itself out across the width
 * it is given, so two of them next to each other would be compared at a width no
 * page ever shows them at. A single column gives it a row at full width, which is
 * what the existing grid does with --overview-columns set to one — no extra
 * layout needed.
 *
 * One specimen, composing both areas the component has: the content area with
 * service links and the meta area with the legal ones below it. Every link
 * points at this page itself, see selfUrl: a sample link still has to lead
 * somewhere real, and the page it is already on is the one destination that
 * cannot go stale.
 */
export const FooterOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(1)}>
		<DBFooter>
			<DBFooterContent>
				{/*
				 * The list lives inside a `nav`, which is what the component styles it
				 * through: outside one it stays a bulleted block list instead of a row
				 * of links. Each navigation carries its own name, see footerNavLabels.
				 */}
				<nav aria-label={labels.footerNavLabels.content}>
					<ul>
						{labels.footerLinks.map((label) => (
							<li key={label}>
								<DBLink href={labels.selfUrl} wrap>
									{label}
								</DBLink>
							</li>
						))}
					</ul>
				</nav>
			</DBFooterContent>
			<DBFooterMeta copyright={labels.footerCopyright}>
				<nav aria-label={labels.footerNavLabels.meta}>
					<ul>
						{labels.footerMetaLinks.map((label) => (
							<li key={label}>
								<DBLink variant="inline" size="small" href={labels.selfUrl}>
									{label}
								</DBLink>
							</li>
						))}
					</ul>
				</nav>
			</DBFooterMeta>
		</DBFooter>
	</div>
);
