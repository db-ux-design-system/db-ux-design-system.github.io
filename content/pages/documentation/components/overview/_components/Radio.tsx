import { Fragment, type ReactElement } from 'react';
import { DBRadio } from '@db-ux/react-core-components';
import {
	columns,
	RADIO_STATES,
	SIZES,
	type OverviewLabels,
	type Size,
} from './_shared.tsx';

/*
 * One group per state, in both sizes.
 *
 * A radio is never shown alone: a single option cannot be deselected, so the
 * specimen is the group. Each one is a `fieldset` with a `legend`, which is the
 * native grouping the component's own HTML documentation asks for, and each one
 * carries its own `name` — radios sharing a name belong to the same group, so
 * without that the whole page would be one group with a single selection in it.
 *
 * The required specimen marks the obligation in two places and no more. The
 * group is `required`, which is the native way to state that one option has to
 * be chosen, but the per-option asterisk the component would print is turned off
 * with `showRequiredAsterisk={false}` — on each option it would read as several
 * mandatory fields. The one star in the markup is the plain text asterisk in the
 * `legend`, not a rebuilt one: `legend` text, not CSS imitating the component's
 * own asterisk.
 *
 * That same group doubles as the validation example: its first option is shown
 * `valid`, its second `invalid`, which is the one place these two states appear.
 * It is a variant display, not a strict form state — validity belongs to the
 * group, not the single option — but that is the right level for an overview and
 * raises no accessibility finding. The valid option is the checked one, so the
 * required group also holds a real selection and its star does not describe an
 * unmet obligation.
 *
 * The radio renders no helper or validation message of its own: the validation
 * shows on the control through the component's own colours, and the group's
 * message would be a consumer's job.
 */
const RadioGroup = ({
	size,
	state,
	labels,
}: {
	size: Size;
	state: (typeof RADIO_STATES)[number];
	labels: OverviewLabels;
}): ReactElement => {
	/*
	 * The required group swaps its option labels for the validation names it
	 * carries, so each option says which state it shows. Every other group keeps
	 * the plain option labels.
	 */
	const optionLabels =
		state.showValidation === true
			? [labels.radioValidationOptions.valid, labels.radioValidationOptions.invalid]
			: labels.radioOptions;

	return (
		<fieldset className="overview-fieldset">
			<legend>
				{state.required === true ? labels.radioRequiredLegend : labels.radioStates[state.key]}
			</legend>
			<div className="overview-stack">
				{optionLabels.map((option, index) => (
					<DBRadio
						key={option}
						size={size}
						/*
						 * Unique per specimen and shared inside it. The size and the state
						 * identify the group, which is exactly the scope the options belong
						 * to.
						 */
						name={`overview-radio-${size}-${state.key}`}
						value={`option-${index + 1}`}
						label={option}
						/*
						 * The valid option is the checked one, so the validation example
						 * also gives the required group a real selection. For the other
						 * groups only the first option is checked in the `checked` state.
						 */
						checked={
							state.showValidation === true ? index === 0 : state.checkFirst === true && index === 0
						}
						/*
						 * The two validation states, shown only on the required group: the
						 * first option valid, the second invalid.
						 */
						validation={
							state.showValidation === true ? (index === 0 ? 'valid' : 'invalid') : undefined
						}
						required={state.required}
						showRequiredAsterisk={state.required === true ? false : undefined}
					/>
				))}
			</div>
		</fieldset>
	);
};

export const RadioOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(RADIO_STATES.length)}>
		{SIZES.map((size) => (
			<Fragment key={size}>
				{RADIO_STATES.map((state) => (
					<RadioGroup key={state.key} size={size} state={state} labels={labels} />
				))}
			</Fragment>
		))}
	</div>
);
