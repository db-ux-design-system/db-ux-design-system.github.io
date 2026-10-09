import { type ReactElement } from 'react';
import { DBCustomSelect } from '@db-ux/react-core-components';
import { PRESELECTED, type OverviewLabels } from './_shared.tsx';

/*
 * The closed state in its label variants above and floating, plus the states that
 * change the form field itself: helper message, required, leading icon and
 * disabled.
 *
 * The multi select specimens carry a selection, because `selectedType` only
 * changes how an existing selection is shown — without one they would all read as
 * the same empty field.
 */
export const CustomSelectOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => {
	const toOptions = (entries: string[]) =>
		entries.map((label, index) => ({ value: `option-${index + 1}`, label }));

	const options = toOptions(labels.selectOptions);

	/*
	 * The texts the component holds an English default for, passed on every
	 * specimen. `clearSelectionText` reaches the button that drops the whole
	 * selection, which `showClearSelection` renders by default as soon as
	 * something is selected, and `mobileCloseButtonText` the dropdown's close
	 * button on small viewports. Neither has a locale to fall back on, so left
	 * unset they would read English on the German page.
	 */
	const texts = {
		clearSelectionText: labels.customSelectClearSelection,
		mobileCloseButtonText: labels.customSelectMobileClose,
	};

	return (
		<>
			{/*
			 * The first specimen carries a longer list, which is what brings the search
			 * into the dropdown: the component shows it on its own from ten options
			 * (`showSearch ?? amountOptions > 9`), so the property stays unset here and
			 * the specimen shows the default behavior. Like the dropdown itself, the
			 * search only becomes visible once the field is opened.
			 */}
			<DBCustomSelect
				{...texts}
				label={labels.selection}
				placeholder={labels.placeholder}
				searchLabel={labels.searchLabel}
				searchPlaceholder={labels.searchPlaceholder}
				options={toOptions(labels.searchOptions)}
				icon="magnifying_glass"
				message={labels.helper}
				required
				invalidMessage={labels.required}
			/>
			<DBCustomSelect
				{...texts}
				multiple
				selectedType="text"
				values={PRESELECTED}
				label={labels.selection}
				placeholder={labels.placeholder}
				options={options}
			/>
			<DBCustomSelect
				{...texts}
				multiple
				selectedType="amount"
				values={PRESELECTED}
				label={labels.selection}
				placeholder={labels.placeholder}
				/*
				 * The counted selection is built here rather than through `amountText`.
				 * That property replaces the whole string instead of filling a
				 * placeholder in it, so it can only carry a fixed number — wrong as soon
				 * as the selection changes. `transformSelectedLabels` receives the
				 * selected options and takes precedence over the `amount` branch, so the
				 * specimen keeps the counted shape `selectedType="amount"` stands for and
				 * stays correct in both languages.
				 */
				transformSelectedLabels={(selected) =>
					`${selected?.length ?? 0} ${labels.customSelectSelected}`
				}
				options={options}
			/>
			<DBCustomSelect
				{...texts}
				multiple
				selectedType="tag"
				values={PRESELECTED}
				label={labels.selection}
				placeholder={labels.placeholder}
				/*
				 * One text per option, not per selected option: the component looks the
				 * label up by the option's position in this list. Without them the
				 * remove button of a tag has no accessible name.
				 */
				removeTagsTexts={labels.removeTags}
				options={options}
			/>
			<DBCustomSelect
				{...texts}
				variant="floating"
				label={labels.selection}
				placeholder={labels.placeholder}
				options={options}
			/>
		</>
	);
};
