import { useState, type ReactElement } from 'react';
import {
	DBButton,
	DBDrawer,
	DBDrawerFooter,
	DBDrawerHeader,
} from '@db-ux/react-core-components';
import {
	DRAWER_DIRECTIONS,
	DRAWER_ROUNDED,
	type DrawerDirection,
	type OverviewLabels,
} from './_shared.tsx';

/*
 * The drawer through its triggers, like the dialog above: the four directions in
 * one row, the same four with rounded corners in the row below. The rounded row
 * disappears in the v6 preview, where the component has no rounded corners left;
 * the stylesheet does that, since the preview is pure CSS and cannot change what
 * is rendered.
 *
 * One configuration and one drawer, not eight: each trigger only writes the
 * configuration the drawer reads its properties from. The configuration survives
 * closing on purpose — the drawer slides back out the way it came in instead of
 * switching direction while the transition runs.
 */
export const DrawerOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => {
	const [open, setOpen] = useState(false);
	const [config, setConfig] = useState<{ direction: DrawerDirection; rounded: boolean }>({
		direction: 'to-right',
		rounded: false,
	});

	return (
		<div className="overview-stack">
			{DRAWER_ROUNDED.map((rounded) => (
				<div
					key={String(rounded)}
					className="overview-row"
					/* The hook the stylesheet hides the rounded row with in v6. */
					data-overview-rounded={rounded ? 'true' : undefined}
				>
					{DRAWER_DIRECTIONS.map((direction) => (
						<DBButton
							key={direction}
							type="button"
							variant="filled"
							onClick={() => {
								setConfig({ direction, rounded });
								setOpen(true);
							}}
						>
							{labels.drawerSpecimens[direction][rounded ? 'rounded' : 'plain']}
						</DBButton>
					))}
				</div>
			))}
			<DBDrawer
				/*
				 * Keyed by the configuration, so a different direction gets a new
				 * element instead of the previous one. The component derives the
				 * direction it slides from once, when it is set up, and keeps that
				 * beyond closing — reused with a new direction it would animate along
				 * the old one. The key is only ever different once the drawer is
				 * closed, so no closing animation is cut short.
				 */
				key={`${config.direction}-${config.rounded}`}
				open={open}
				direction={config.direction}
				rounded={config.rounded}
				onClose={() => setOpen(false)}
				header={<DBDrawerHeader closeButtonText={labels.close} text={labels.drawerTitle} />}
				footer={
					<DBDrawerFooter>
						{/*
						 * The footer lays its own children out in a column, so the two
						 * actions sit in a row of their own. The footer is a slot, so what
						 * goes in it is ours to arrange; the row wraps when the drawer is
						 * too narrow for both buttons.
						 */}
						<div className="overview-row">
							<DBButton type="button" variant="brand" onClick={() => setOpen(false)}>
								{labels.apply}
							</DBButton>
							<DBButton type="button" variant="ghost" onClick={() => setOpen(false)}>
								{labels.cancel}
							</DBButton>
						</div>
					</DBDrawerFooter>
				}
			>
				{labels.drawerText}
			</DBDrawer>
		</div>
	);
};
