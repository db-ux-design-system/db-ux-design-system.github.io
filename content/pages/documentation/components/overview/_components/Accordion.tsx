import { type ReactElement } from 'react';
import { DBAccordion } from '@db-ux/react-core-components';
import { columns, type OverviewLabels } from './_shared.tsx';

export const AccordionOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(2)}>
		<div>
			<DBAccordion variant="divider" items={labels.accordionItems} />
		</div>
		<div>
			<DBAccordion variant="card" items={labels.accordionItems} />
		</div>
	</div>
);
