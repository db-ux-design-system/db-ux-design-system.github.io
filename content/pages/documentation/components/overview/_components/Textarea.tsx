import { type ReactElement } from 'react';
import { DBTextarea } from '@db-ux/react-core-components';
import { INPUT_VARIANTS, type OverviewLabels } from './_shared.tsx';

/*
 * One row per label variant, each with the states that change the field itself:
 * plain, with a helper message, invalid and valid — the same shape as the input
 * block, since both are a `FormProps` text field with the same validation
 * properties. No icon positions here: a textarea has none to show.
 *
 * Mounted, like input: `invalidMessage` is only written into the DOM once native
 * form validation has run through an effect, so a server-rendered specimen would
 * leave the critical infotext empty but present.
 */
const TextareaStates = ({
	variant,
	labels,
}: {
	variant: (typeof INPUT_VARIANTS)[number];
	labels: OverviewLabels;
}): ReactElement => (
	<>
		<DBTextarea
			label={labels.textareaLabel}
			variant={variant}
			placeholder={labels.textareaPlaceholder}
		/>
		<DBTextarea
			label={labels.textareaLabel}
			variant={variant}
			placeholder={labels.textareaPlaceholder}
			message={labels.inputMessage}
		/>
		<DBTextarea
			label={labels.textareaLabel}
			variant={variant}
			placeholder={labels.textareaPlaceholder}
			required
			validation="invalid"
			invalidMessage={labels.required}
		/>
		<DBTextarea
			label={labels.textareaLabel}
			variant={variant}
			placeholder={labels.textareaPlaceholder}
			validation="valid"
			validMessage={labels.inputValid}
		/>
	</>
);

export const TextareaOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{INPUT_VARIANTS.map((variant) => (
			<TextareaStates key={variant} variant={variant} labels={labels} />
		))}
	</>
);
