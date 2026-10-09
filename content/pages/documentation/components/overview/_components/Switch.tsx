import { type ReactElement } from 'react';
import { DBSwitch } from '@db-ux/react-core-components';
import { SIZES, SWITCH_STATES, type OverviewLabels, type Size } from './_shared.tsx';

/*
 * One row per size, holding the states that change the switch next to each
 * other: off, on, invalid and valid. The size is the one dimension that scales
 * the control, so each size gets its own row and the states read across it.
 *
 * The last specimen of the default row carries the label position instead of a
 * state: `leading` moves the label to the other side of the switch, which is a
 * variant of the same control rather than a state of its own, so it rides along
 * on an existing specimen the way the input block shows its icon positions.
 * `trailing` is already shown by every specimen above, so no second one is added
 * for it.
 *
 * Mounted, like checkbox, input and select: `invalidMessage` is only written
 * into the DOM once native form validation has run through an effect, so the
 * invalid specimen would otherwise leave its critical infotext empty but
 * present. The accessible name does not depend on that: the switch wraps its
 * control inside the `label`, so the label text names the control even in a
 * server-rendered specimen. The required asterisk on the invalid specimen is
 * pure CSS too: the component's own `:has(input:required)` rule reads the
 * `required` attribute straight off the rendered input, the same way the radio
 * block's required option gets its asterisk.
 *
 * `data-align="start"` keeps every switch on the same baseline: only the invalid
 * and valid specimens carry a message below the control, so the row's default
 * centring would otherwise shift each switch up or down against its neighbours.
 */
const SwitchRow = ({ size, labels }: { size: Size; labels: OverviewLabels }): ReactElement => (
	<div className="overview-row" data-align="start">
		{SWITCH_STATES.map((state) => (
			<DBSwitch
				key={state.key}
				size={size}
				label={labels.switchStates[state.key]}
				checked={state.checked}
				required={state.required}
				validation={state.invalid === true ? 'invalid' : state.valid === true ? 'valid' : undefined}
				invalidMessage={state.invalid === true ? labels.required : undefined}
				validMessage={state.valid === true ? labels.inputValid : undefined}
			/>
		))}
		{/*
		 * The label position rides along here rather than taking a row: it moves the
		 * label, it does not change the state.
		 */}
		<DBSwitch size={size} variant="leading" label={labels.switchVariants.leading} />
	</div>
);

export const SwitchOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{SIZES.map((size) => (
			<SwitchRow key={size} size={size} labels={labels} />
		))}
	</>
);
