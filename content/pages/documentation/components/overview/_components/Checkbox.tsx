import { Fragment, type ReactElement } from 'react';
import { DBCheckbox } from '@db-ux/react-core-components';
import { SIZES, type OverviewLabels } from './_shared.tsx';

/*
 * One row per size, with the validation states none, invalid, valid and a plain
 * helper message. Each state is passed as the component's own property:
 * `invalidMessage`, `validMessage` and the generic `message`.
 *
 * Mounted, like input and select: `invalidMessage` is only written into the DOM
 * once native form validation has run through an effect, so a server-rendered
 * specimen would leave the critical infotext empty but present. Renders a plain
 * fragment, not its own grid — the placeholder in OverviewMount already carries
 * `overview-grid`, so these specimens become its items directly.
 */
export const CheckboxOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{SIZES.map((size) => (
			<Fragment key={size}>
				<DBCheckbox size={size} label={labels.selection} />
				<DBCheckbox
					size={size}
					label={labels.selection}
					validation="invalid"
					invalidMessage={labels.required}
				/>
				<DBCheckbox
					size={size}
					label={labels.selection}
					validation="valid"
					validMessage={labels.confirmed}
				/>
				<DBCheckbox size={size} label={labels.selection} message={labels.helper} />
			</Fragment>
		))}
	</>
);
