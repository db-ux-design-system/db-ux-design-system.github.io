import { Fragment, type ReactElement } from 'react';
import {
	DBButton,
	DBCheckbox,
	DBTag,
	DBTooltip,
	TagBehaviorList,
	type TagBehaviorType,
} from '@db-ux/react-core-components';
import { type OverviewLabels } from './_shared.tsx';

/*
 * One column per `behavior` property value, each holding its three content
 * variants — text, text with icon, icon only — stacked, weak first and strong
 * below. Columns by behavior and rows by content is the other way round from
 * the badge block, which rows by content and columns by nothing — a tag's
 * behavior changes how it can be used, not how it looks, so it is the
 * dimension worth reading across, see TagOverview.
 *
 * `removable` adds the remove button `onRemove` requires to do anything; without
 * a handler the button would render but do nothing when pressed. `removeButton`
 * carries that button's accessible name: the component renders the name into a
 * `DBTooltip variant="label"` and otherwise falls back to its own built-in
 * English default, which would stay English on the German page.
 *
 * `noText` only hides the text visually, like the button's `noText` does — the
 * text stays the tag's accessible name, so no extra `aria-label` is needed here
 * the way the badge's dot and icon-only specimens need one. The icon itself is a
 * `string` property, not a `DBIcon` child, so none of the badge's content
 * questions apply. `star` names a tag's own purpose — marking something — rather
 * than standing for an unrelated action the way `plus` would.
 */
const TagColumn = ({
	behavior,
	labels,
}: {
	behavior: TagBehaviorType;
	labels: OverviewLabels;
}): ReactElement => (
	<div className="overview-stack overview-tag-column">
		{(['weak', 'strong'] as const).map((emphasisName) => {
			const emphasis = emphasisName === 'strong' ? 'strong' : undefined;
			return (
				<Fragment key={emphasisName}>
					<DBTag
						behavior={behavior}
						emphasis={emphasis}
						onRemove={behavior === 'removable' ? () => undefined : undefined}
						removeButton={behavior === 'removable' ? labels.tagRemove : undefined}
					>
						{labels.tagBehaviors[behavior]}
					</DBTag>
					<DBTag
						behavior={behavior}
						emphasis={emphasis}
						icon="star"
						onRemove={behavior === 'removable' ? () => undefined : undefined}
						removeButton={behavior === 'removable' ? labels.tagRemove : undefined}
					>
						{labels.tagBehaviors[behavior]}
					</DBTag>
					<DBTag
						behavior={behavior}
						emphasis={emphasis}
						icon="star"
						noText
						onRemove={behavior === 'removable' ? () => undefined : undefined}
						removeButton={behavior === 'removable' ? labels.tagRemove : undefined}
					>
						{labels.tagBehaviors[behavior]}
					</DBTag>
				</Fragment>
			);
		})}
	</div>
);

/*
 * The interactive column: a tag wrapping a control, the composition the
 * component's own docs show instead of a `behavior` value — the component
 * has none for this ("Tag as Button", "Tag as Checkbox" in Migration.md).
 * `DBButton` and `DBCheckbox`, not native elements: the documented
 * composition wraps the design system's own components, not bare `<button>`/
 * `<input>`. `size="small"` keeps both inside the tag's compact scale — the
 * medium default is taller than a tag row.
 *
 * Three rows per emphasis — plain, with icon, icon-only — the same three
 * content variants `TagColumn` shows, weak above strong. `icon` on `DBTag` is
 * independent of the wrapped control, so the with-icon row shows it alongside
 * the control rather than replacing anything. The icon-only row uses each
 * control's own documented mechanism: `DBButton`'s `noText` plus a
 * `DBTooltip` carrying the name (the same pattern `ButtonOverview` uses), and
 * `DBCheckbox`'s `showLabel={false}` — both keep the name, they only hide the
 * text visually.
 */
const TagInteractiveColumn = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-stack overview-tag-column">
		{(['weak', 'strong'] as const).map((emphasisName) => {
			const emphasis = emphasisName === 'strong' ? 'strong' : undefined;
			return (
				<Fragment key={emphasisName}>
					<div className="overview-row">
						<DBTag emphasis={emphasis}>
							<DBButton type="button" size="small" onClick={() => undefined}>
								{labels.tagInteractiveButton}
							</DBButton>
						</DBTag>
						<DBTag emphasis={emphasis}>
							<DBCheckbox size="small" label={labels.tagInteractiveCheckbox} />
						</DBTag>
					</div>
					<div className="overview-row">
						<DBTag emphasis={emphasis} icon="star">
							<DBButton type="button" size="small" onClick={() => undefined}>
								{labels.tagInteractiveButton}
							</DBButton>
						</DBTag>
						<DBTag emphasis={emphasis} icon="star">
							<DBCheckbox size="small" label={labels.tagInteractiveCheckbox} />
						</DBTag>
					</div>
					<div className="overview-row">
						<DBTag emphasis={emphasis}>
							<DBButton type="button" size="small" icon="star" noText onClick={() => undefined}>
								{labels.tagInteractiveButton}
								<DBTooltip>{labels.tagInteractiveButton}</DBTooltip>
							</DBButton>
						</DBTag>
						<DBTag icon="star" noText emphasis={emphasis}>
							<DBCheckbox size="small" label={labels.tagInteractiveCheckbox} showLabel={false} />
						</DBTag>
					</div>
				</Fragment>
			);
		})}
	</div>
);

/*
 * Three columns, one per behavior: `static`, `removable`, and `interactive` —
 * the composed specimen `TagBehaviorList` has no property value for. No
 * caption above a column: the content variants and the behavior itself are
 * both readable from the tags' own text.
 *
 * Mounted: a removable tag's remove button carries its accessible name in a
 * `DBTooltip variant="label"`, and that tooltip only links itself to the button
 * once it runs in the browser — rendered only, the six remove buttons of the
 * removable column have no name at all. The icon-only button in the interactive
 * column takes its name from a tooltip the same way.
 *
 * Renders a plain fragment, not its own grid — the placeholder in
 * ComponentOverview already carries `overview-grid`, so these columns become
 * its items directly.
 */
export const TagOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{TagBehaviorList.map((behavior) => (
			<TagColumn key={behavior} behavior={behavior} labels={labels} />
		))}
		<TagInteractiveColumn labels={labels} />
	</>
);
