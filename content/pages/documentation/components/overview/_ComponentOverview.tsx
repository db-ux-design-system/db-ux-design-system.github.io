import { type ReactElement } from 'react';
import { DBSelect } from '@db-ux/react-core-components';
import type { Language } from '@template/context/language-context';
import {
	columns,
	LABELS,
	MOUNT_COLUMNS,
	MOUNT_FIT_CONTENT,
	type MountedComponent,
	type OverviewComponent,
} from './_components/_shared.tsx';
import { AccordionOverview } from './_components/Accordion.tsx';
import { BackdropOverview } from './_components/Backdrop.tsx';
import { BadgeOverview } from './_components/Badge.tsx';
import { ButtonOverview } from './_components/Button.tsx';
import { CardOverview } from './_components/Card.tsx';
import { CheckboxOverview } from './_components/Checkbox.tsx';
import { CustomSelectOverview } from './_components/CustomSelect.tsx';
import { DialogOverview } from './_components/Dialog.tsx';
import { DividerOverview } from './_components/Divider.tsx';
import { DrawerOverview } from './_components/Drawer.tsx';
import { FooterOverview } from './_components/Footer.tsx';
import { HeadingOverview } from './_components/Heading.tsx';
import { InfotextOverview } from './_components/Infotext.tsx';
import { InputOverview } from './_components/Input.tsx';
import { LinkOverview } from './_components/Link.tsx';
import { LoadingIndicatorOverview } from './_components/LoadingIndicator.tsx';
import { NotificationOverview } from './_components/Notification.tsx';
import { PaginationOverview } from './_components/Pagination.tsx';
import { PopoverOverview } from './_components/Popover.tsx';
import { RadioOverview } from './_components/Radio.tsx';
import { SectionOverview } from './_components/Section.tsx';
import { SelectOverview } from './_components/Select.tsx';
import { StackOverview } from './_components/Stack.tsx';
import { SwitchOverview } from './_components/Switch.tsx';
import { TabsOverview } from './_components/Tabs.tsx';
import { TagOverview } from './_components/Tag.tsx';
import { TextareaOverview } from './_components/Textarea.tsx';
import { TooltipOverview } from './_components/Tooltip.tsx';

export type { OverviewComponent, MountedComponent } from './_components/_shared.tsx';

/**
 * Switches the page between the current rounded look and the squared-off v6
 * preview.
 *
 * The switch itself is declarative: the stylesheet matches the selected option
 * with `:has()` and redefines the --db-border-radius-* tokens, so the selection
 * needs no JavaScript. The option values below are the contract with those
 * selectors — change them only together with ComponentOverview.css.
 *
 * The component itself stays free of JavaScript. The divider below the bar is
 * only wanted while the bar overlays the specimens, so the empty element above it
 * serves as a sentinel: sticky-controls.ts watches it and sets `is-sticky` on the
 * bar. The markup has to stay in this order — sentinel first, bar directly after
 * it.
 */
export function VersionSwitch({ locale }: { locale: Language }): ReactElement {
	const labels = LABELS[locale] ?? LABELS.en;

	return (
		<>
			<div className="overview-controls-sentinel" aria-hidden="true" />
			<div className="overview-controls">
				<div className="overview-controls-field">
					{/*
					 * The select has no option for a leading label, so its own label is
					 * hidden visually and repeated here as plain text in front of the
					 * control. This copy is hidden from assistive technology, so the text
					 * is not announced twice. Both read the same string.
					 */}
					<span className="overview-controls-label" aria-hidden="true">
						{labels.version}
					</span>
					<div className="overview-controls-select">
						<DBSelect
							label={labels.version}
							showLabel={false}
							/*
							 * The component links its label to the control through an id it
							 * only assigns once it runs in the browser, and this page is
							 * rendered without hydration. The name is therefore set on the
							 * control itself, so it does not depend on that link.
							 */
							aria-label={labels.version}
							showEmptyOption={false}
							options={[
								{ value: 'v5', label: labels.v5, selected: true },
								{ value: 'v6', label: labels.v6 },
							]}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export interface ComponentOverviewProps {
	component: OverviewComponent;
	/*
	 * Passed explicitly rather than read from the language context: Astro renders
	 * this component server-side as slot content of the client-only shell, so it
	 * never joins that shell's React tree and the context is unavailable.
	 */
	locale: Language;
}

/**
 * Renders the specimen set for a single component on the Component Overview page.
 * The heading above it stays in the page content, so it is picked up for the table
 * of contents and can be linked to.
 */
export function ComponentOverview({
	component,
	locale,
}: ComponentOverviewProps): ReactElement | null {
	const labels = LABELS[locale] ?? LABELS.en;

	switch (component) {
		case 'accordion':
			return <AccordionOverview labels={labels} />;
		case 'backdrop':
			return <BackdropOverview labels={labels} />;
		case 'badge':
			return <BadgeOverview labels={labels} />;
		case 'card':
			return <CardOverview labels={labels} />;
		case 'divider':
			return <DividerOverview labels={labels} />;
		case 'footer':
			return <FooterOverview labels={labels} />;
		case 'heading':
			return <HeadingOverview labels={labels} />;
		case 'infotext':
			return <InfotextOverview labels={labels} />;
		case 'link':
			return <LinkOverview labels={labels} />;
		case 'notification':
			return <NotificationOverview labels={labels} />;
		case 'radio':
			return <RadioOverview labels={labels} />;
		case 'section':
			return <SectionOverview labels={labels} />;
		case 'stack':
			return <StackOverview labels={labels} />;
		case 'button':
		case 'checkbox':
		case 'custom-select':
		case 'dialog':
		case 'drawer':
		case 'input':
		case 'loading-indicator':
		case 'pagination':
		case 'popover':
		case 'select':
		case 'switch':
		case 'tabs':
		case 'tag':
		case 'textarea':
		case 'tooltip':
			/*
			 * Mounted in the browser, not rendered here.
			 *
			 * A specimen is mounted when the component cannot render itself correctly
			 * without JavaScript. Dialog and drawer open through a trigger. The custom
			 * select links its label to the control through an id it only assigns once
			 * it runs, so a rendered-only select has no accessible name and never shows
			 * its placeholder. The input does the same with its label and leaves an
			 * empty critical message behind. The checkbox and switch do the same with
			 * `invalidMessage`: the component only writes it into the DOM once native
			 * form validation has run through an effect, so a server-rendered specimen
			 * leaves the critical infotext empty but present — a stray icon with no
			 * text. The button block holds a tooltip, which
			 * places itself from script and otherwise stretches the document. The
			 * loading indicator seeds its state in an effect and would stay at
			 * `inactive` throughout. The pagination writes the current page onto its
			 * markup from script and shows none without it. The popover and the tooltip
			 * both open through their trigger and place their panel from script.
			 * The textarea has the same `invalidMessage` gap as the input and the
			 * checkbox and switch above. The tag's removable column carries the
			 * accessible name of each remove button in a tooltip, which links itself
			 * to the button only once it runs.
			 *
			 * An Astro client directive is no option here: the page content is slot
			 * content of the client-only shell, and an island nested in it leaves the
			 * shell waiting for its children, which keeps the whole page blank.
			 * mount-init.ts picks this element up instead and mounts the specimen
			 * into it, the same way playground-init mounts the playground. The grid is
			 * already in place here, so only its content is mounted.
			 */
			return (
				<div
					className="overview-grid"
					data-fit={MOUNT_FIT_CONTENT.includes(component) ? 'content' : undefined}
					style={columns(MOUNT_COLUMNS[component])}
					data-overview-mount={component}
					data-overview-locale={locale}
				/>
			);
		default:
			return null;
	}
}

/**
 * The specimens that only render correctly once they run in the browser, mounted
 * by mount-init.ts.
 */
export function OverviewMount({
	component,
	locale,
}: {
	component: MountedComponent;
	locale: Language;
}): ReactElement {
	const labels = LABELS[locale] ?? LABELS.en;

	switch (component) {
		case 'button':
			return <ButtonOverview labels={labels} />;
		case 'checkbox':
			return <CheckboxOverview labels={labels} />;
		case 'custom-select':
			return <CustomSelectOverview labels={labels} />;
		case 'dialog':
			return <DialogOverview labels={labels} />;
		case 'input':
			return <InputOverview labels={labels} />;
		case 'loading-indicator':
			return <LoadingIndicatorOverview labels={labels} />;
		case 'pagination':
			return <PaginationOverview labels={labels} />;
		case 'popover':
			return <PopoverOverview labels={labels} />;
		case 'select':
			return <SelectOverview labels={labels} />;
		case 'switch':
			return <SwitchOverview labels={labels} />;
		case 'tabs':
			return <TabsOverview labels={labels} />;
		case 'tag':
			return <TagOverview labels={labels} />;
		case 'textarea':
			return <TextareaOverview labels={labels} />;
		case 'tooltip':
			return <TooltipOverview labels={labels} />;
		case 'drawer':
			return <DrawerOverview labels={labels} />;
	}
}
