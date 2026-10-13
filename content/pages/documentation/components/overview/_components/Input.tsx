import { type ReactElement } from 'react';
import { DBInput } from '@db-ux/react-core-components';
import { INPUT_VARIANTS, type OverviewLabels } from './_shared.tsx';

/*
 * One row per label variant, each with the states that change the field itself:
 * plain, with a helper message, invalid and valid. The two icon positions are
 * shown on the first two fields of the default row instead of on specimens of
 * their own — an icon is added to a field, it does not change its state.
 *
 * The grid aligns its items to the top of their row, so a field with a helper
 * message below it does not push the others down.
 *
 * Mounted in the browser, because the component links its label to the control
 * through an id it only assigns once it runs: rendered alone, the field has no
 * accessible name and its critical message stays empty, leaving a stray icon
 * below it. Same reason the custom select is mounted.
 *
 * There is no size dimension here. `size` on an input is the native attribute for
 * the visible character count, not a variant — the field height follows the
 * density of its surroundings.
 */
const InputStates = ({
	variant,
	icons,
	labels,
}: {
	variant: (typeof INPUT_VARIANTS)[number];
	/*
	 * Shows the two icon positions on the first two fields of the row. They are not
	 * a state of their own, so they ride along on existing specimens rather than
	 * taking a row for themselves — the first field gets the leading icon, the
	 * second the trailing one.
	 */
	icons?: boolean;
	labels: OverviewLabels;
}): ReactElement => (
	<>
		{/*
		 * `type` is set on every field although `text` is what the component falls
		 * back to: the types change the control itself, so naming the one these
		 * specimens show keeps them readable as a comparison of states.
		 */}
		<DBInput
			type="text"
			variant={variant}
			label={labels.inputLabel}
			placeholder={labels.inputPlaceholder}
			iconLeading={icons ? 'magnifying_glass' : undefined}
		/>
		<DBInput
			type="text"
			variant={variant}
			label={labels.inputLabel}
			placeholder={labels.inputPlaceholder}
			message={labels.inputMessage}
			iconTrailing={icons ? 'calendar' : undefined}
		/>
		<DBInput
			type="text"
			variant={variant}
			label={labels.inputLabel}
			placeholder={labels.inputPlaceholder}
			required
			validation="invalid"
			invalidMessage={labels.required}
		/>
		<DBInput
			type="text"
			variant={variant}
			label={labels.inputLabel}
			placeholder={labels.inputPlaceholder}
			validation="valid"
			validMessage={labels.inputValid}
		/>
	</>
);

export const InputOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		<InputStates variant="above" icons labels={labels} />
		<InputStates variant="floating" labels={labels} />
	</>
);
