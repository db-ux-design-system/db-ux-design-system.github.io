import { type ReactElement } from 'react';
import { DBSelect } from '@db-ux/react-core-components';
import {
	SELECT_STATES,
	SELECT_VARIANTS,
	type OverviewLabels,
	type SelectState,
	type SelectVariant,
} from './_shared.tsx';

/*
 * One field per cell, laid out as a three-column grid: the state is the column —
 * helper, invalid, valid — and each label variant takes one row, so a row holds
 * one variant in all three states and the same state can be read down the column
 * as a comparison. The specimens are emitted variant by variant, which is what
 * fills the rows that way. See SELECT_VARIANTS.
 *
 * The grid aligns its cells to the top of their row, so a field carrying a helper
 * or validation message — which is taller than one without — does not push the
 * other fields of the same row down: they all keep their top edge on the row line.
 *
 * This is the native select, not the custom one shown further up. The label
 * variant is its one real dimension — `size` on it is the native attribute for
 * the visible option count, not a visual size.
 *
 * Mounted in the browser, for the same reason as the input and the custom select:
 * the component links its label to the control through an id it only assigns once
 * it runs, so a rendered-only select has no accessible name, and its critical
 * message stays empty and leaves a stray icon below the field.
 */
const SelectField = ({
	variant,
	state,
	labels,
}: {
	variant: SelectVariant;
	state: SelectState;
	labels: OverviewLabels;
}): ReactElement => {
	const options = labels.selectOptions.map((label, index) => ({
		value: `option-${index + 1}`,
		label,
	}));

	switch (state) {
		case 'invalid':
			return (
				<DBSelect
					variant={variant}
					label={labels.selection}
					placeholder={labels.placeholder}
					required
					validation="invalid"
					invalidMessage={labels.required}
					options={options}
				/>
			);
		case 'valid':
			return (
				<DBSelect
					variant={variant}
					label={labels.selection}
					placeholder={labels.placeholder}
					validation="valid"
					validMessage={labels.inputValid}
					options={options}
				/>
			);
		default:
			return (
				<DBSelect
					variant={variant}
					label={labels.selection}
					placeholder={labels.placeholder}
					options={options}
					message={labels.helper}
					icon="calendar"
				/>
			);
	}
};

export const SelectOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{SELECT_VARIANTS.map((variant) =>
			SELECT_STATES.map((state) => (
				<SelectField key={`${variant}-${state}`} variant={variant} state={state} labels={labels} />
			)),
		)}
	</>
);
