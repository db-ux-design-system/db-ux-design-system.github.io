import { Fragment, type ReactElement } from 'react';
import { DBCard } from '@db-ux/react-core-components';
import { CARD_LEVELS, columns, type OverviewLabels } from './_shared.tsx';

export const CardOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(2)}>
		{CARD_LEVELS.map((level) => (
			<Fragment key={level}>
				<DBCard elevationLevel={level} behavior="static">
					{`Level ${level} · ${labels.static}`}
				</DBCard>
				<button>
					<DBCard elevationLevel={level} behavior="interactive">
						{`Level ${level} · ${labels.interactive}`}
					</DBCard>
				</button>
			</Fragment>
		))}
	</div>
);
