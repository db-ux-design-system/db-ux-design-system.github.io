import { Fragment, useState, type CSSProperties, type ReactElement } from 'react';
import {
	DBAccordion,
	DBBadge,
	DBButton,
	DBCard,
	DBCheckbox,
	DBCustomSelect,
	DBDialog,
	DBDialogFooter,
	DBDialogHeader,
	DBDivider,
	DBDrawer,
	DBDrawerFooter,
	DBDrawerHeader,
	DBFooter,
	DBFooterContent,
	DBFooterMeta,
	DBHeadingH3,
	DBIcon,
	DBInfotext,
	DBInput,
	DBLink,
	DBLoadingIndicator,
	DBNotification,
	DBPagination,
	DBPopover,
	DBRadio,
	DBSection,
	DBSelect,
	DBStack,
	DBSwitch,
	DBTabItem,
	DBTabList,
	DBTabPanel,
	DBTabs,
	DBTag,
	DBTextarea,
	DBTooltip,
	TagBehaviorList,
	type TagBehaviorType,
} from '@db-ux/react-core-components';
import type { Language } from '@template/context/language-context';

/** Components that have a specimen set on the overview page. */
export type OverviewComponent =
	| 'accordion'
	| 'backdrop'
	| 'badge'
	| 'button'
	| 'card'
	| 'checkbox'
	| 'custom-select'
	| 'dialog'
	| 'divider'
	| 'drawer'
	| 'footer'
	| 'heading'
	| 'infotext'
	| 'input'
	| 'link'
	| 'loading-indicator'
	| 'notification'
	| 'pagination'
	| 'popover'
	| 'radio'
	| 'section'
	| 'select'
	| 'stack'
	| 'switch'
	| 'tabs'
	| 'tag'
	| 'textarea'
	| 'tooltip';

const SEMANTICS = [
	'adaptive',
	'neutral',
	'informational',
	'successful',
	'warning',
	'critical',
] as const;

/** Ordered by decreasing visual weight rather than by the order in ButtonVariantList. */
const BUTTON_VARIANTS = ['brand', 'filled', 'outlined', 'ghost'] as const;

const SIZES = ['medium', 'small'] as const;
const CARD_LEVELS = ['1', '2', '3'] as const;

/** Both emphasis steps a divider offers, weakest first. */
const DIVIDER_EMPHASIS = [undefined, 'strong'] as const;

/*
 * Every direction a drawer can open from, and both corner states. The plain state
 * comes first, so it is the row that stays when the rounded one drops out in v6.
 */
const DRAWER_DIRECTIONS = ['to-right', 'to-left', 'up', 'down'] as const;
const DRAWER_ROUNDED = [false, true] as const;

type DrawerDirection = (typeof DRAWER_DIRECTIONS)[number];

/*
 * The full visual size scale of a heading, largest first. This is the one scale
 * the component has: the semantic level only maps to a default size, which `size`
 * then overrides.
 */
const HEADING_SIZES = ['3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs', '2xs', '3xs'] as const;

/** The semantic levels, largest first. */
const HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

type HeadingSize = (typeof HEADING_SIZES)[number];
type HeadingLevel = (typeof HEADING_LEVELS)[number];

/*
 * The default visual size per semantic level, and the only place this page holds
 * it. It feeds both directions: the level named next to a size in the v5 rows,
 * and the size each level is rendered at in the v6 rows.
 *
 * The design system's own source for this mapping is
 * @db-ux/core-foundations/build/styles/fonts/_headline-levels.scss. It is a
 * SCSS map, which neither TypeScript nor plain CSS can read, and this project has
 * no SCSS toolchain — so the mapping is restated here. If the design system
 * changes it, this constant has to follow.
 */
const HEADING_LEVEL_SIZES: Record<HeadingLevel, HeadingSize> = {
	h1: 'xl',
	h2: 'lg',
	h3: 'md',
	h4: 'sm',
	h5: 'xs',
	h6: '2xs',
};

/*
 * The same mapping read the other way, for the level a size row names. Derived
 * rather than written out, so there is one mapping and not two that can drift
 * apart. Three sizes have no level pointing at them and stay absent.
 */
const HEADING_SIZE_LEVELS: Partial<Record<HeadingSize, HeadingLevel>> = Object.fromEntries(
	HEADING_LEVELS.map((level) => [HEADING_LEVEL_SIZES[level], level]),
);

/** Both font weights a heading offers today. `black` is its default. */
const HEADING_FONT_WEIGHTS = ['black', 'light'] as const;

type HeadingFontWeight = (typeof HEADING_FONT_WEIGHTS)[number];

/*
 * The font weights per level row, as data rather than as markup: H1 and H2 are to
 * carry the Wide ExtraBlack weight of the coming brand generation as a third
 * entry, and neither the component nor the theme offers it yet. Adding it is a
 * change to this list.
 */
const HEADING_LEVEL_FONT_WEIGHTS: Record<HeadingLevel, readonly HeadingFontWeight[]> = {
	h1: HEADING_FONT_WEIGHTS,
	h2: HEADING_FONT_WEIGHTS,
	h3: HEADING_FONT_WEIGHTS,
	h4: HEADING_FONT_WEIGHTS,
	h5: HEADING_FONT_WEIGHTS,
	h6: HEADING_FONT_WEIGHTS,
};

type LinkSpecimen = 'adaptive' | 'adaptiveExternal' | 'brand' | 'brandExternal' | 'inline';

/*
 * The link specimens per size column. `adaptive` and `brand` appear twice, once
 * with each arrow. `inline` appears once: it drops the arrow altogether, so a
 * second entry for the external one would repeat the same link.
 */
const LINK_SPECIMENS: {
	key: LinkSpecimen;
	variant?: 'brand' | 'inline';
	content?: 'external';
}[] = [
	{ key: 'adaptive' },
	{ key: 'adaptiveExternal', content: 'external' },
	{ key: 'brand', variant: 'brand' },
	{ key: 'brandExternal', variant: 'brand', content: 'external' },
	{ key: 'inline', variant: 'inline' },
];

/** Both label variants of a form field. `above` is the default and comes first. */
const INPUT_VARIANTS = ['above', 'floating'] as const;

/*
 * The sizes a loading indicator offers. One more than the shared size scale:
 * `large` only exists on this component, which is why the list is written out
 * here instead of reusing SIZES.
 */
const LOADING_INDICATOR_SIZES = ['small', 'medium', 'large'] as const;

/*
 * The states after the load itself, without `active`. `active` is the state the
 * size specimens already show, and `inactive` opens the list because it is the
 * bare track every other state fills.
 */
const LOADING_INDICATOR_RESULTS = ['inactive', 'successful', 'critical'] as const;

/*
 * The columns of the loading indicator block, as data: one per combination of
 * shape and orientation that the component actually renders differently.
 *
 * Three columns: the circular shape upright, the circular shape lying down, and
 * the bar. The orientation dimension stays with the circular shape — the bar is
 * laid out as a column either way, and every orientation rule in the component's
 * own stylesheet sits below `[data-variant="circular"]`, so a second bar column
 * would repeat the first one and claim a difference that does not exist.
 *
 * Every column carries the same rows, see LoadingIndicatorCell.
 */
const LOADING_INDICATOR_COLUMNS = [
	{ variant: 'circular', orientation: 'vertical' },
	{ variant: 'circular', orientation: 'horizontal' },
	{ variant: 'bar', orientation: 'horizontal' },
] as const;

type LoadingIndicatorSize = (typeof LOADING_INDICATOR_SIZES)[number];
type LoadingIndicatorResult = (typeof LOADING_INDICATOR_RESULTS)[number];

/*
 * Every notification variant, in the order the component documents them.
 * `docked` is the default and sits between header and content, `standalone` goes
 * into a form, `overlay` floats as a snackbar.
 */
const NOTIFICATION_VARIANTS = ['docked', 'standalone', 'overlay'] as const;

type NotificationVariant = (typeof NOTIFICATION_VARIANTS)[number];

/*
 * The four main placements of a popover. The component also accepts a `-start`
 * and `-end` modifier for each, which only shifts the panel along the trigger's
 * edge — twelve triggers for four distinguishable positions.
 */
const POPOVER_PLACEMENTS = ['bottom', 'top', 'left', 'right'] as const;

type PopoverPlacement = (typeof POPOVER_PLACEMENTS)[number];

/*
 * The states of a radio group, as data: each one is a whole group rather than a
 * single control, because a radio only means anything as part of one.
 *
 * `checkFirst` selects the first option, which is what makes the selected state
 * tellable apart from the default one at a glance.
 *
 * `required` marks the group semantically — one of its options has to be chosen —
 * and the obligation is named with a typed asterisk in the `legend`, not with the
 * per-option asterisk the component prints: that one would sit next to every
 * option and read as several mandatory fields. The component asterisk is
 * suppressed with `showRequiredAsterisk={false}`, so the only star in the markup
 * is the text one in the legend, see RadioGroup.
 *
 * `showValidation` turns the required group into a worked example of the two
 * validation states the component offers per option: the first option is shown
 * valid, the second invalid. This is a variant display rather than a strict form
 * state — on a real group validity belongs to the group, not the single option —
 * which is the right level for an overview and raises no accessibility finding.
 */
type RadioState = 'default' | 'checked' | 'required';

const RADIO_STATES: {
	key: RadioState;
	required?: boolean;
	checkFirst?: boolean;
	showValidation?: boolean;
}[] = [
	{ key: 'default' },
	{ key: 'checked', checkFirst: true },
	{ key: 'required', required: true, showValidation: true },
];

/*
 * The spacing steps of a section, widest first so the shrinking inner padding
 * reads top to bottom. `none` is left out: it collapses the padding entirely,
 * which on a bordered preview box reads as a plain box and says nothing the other
 * three do not already show by contrast. These name the `spacing` values, which
 * are not translated.
 *
 * Spacing is the one dimension a section shows on its own, see SectionOverview.
 */
const SECTION_SPACINGS = ['large', 'medium', 'small'] as const;

type SectionSpacing = (typeof SECTION_SPACINGS)[number];

/*
 * Both directions a stack lays its items out in, column first because it is the
 * component's default. Each is shown at two gap steps, so the gap reads as the
 * dimension it is rather than as a fixed distance — a small step and a large one,
 * far enough apart to tell at a glance.
 */
const STACK_DIRECTIONS = ['column', 'row'] as const;
const STACK_GAPS = ['small', 'large'] as const;

type StackDirection = (typeof STACK_DIRECTIONS)[number];
type StackGap = (typeof STACK_GAPS)[number];

/*
 * Both label variants of a native select, `above` first because it is the
 * default. The variants are the two rows of the block — `above` first,
 * `floating` second — and the states run across each row as its three columns,
 * so the same state can be read across the variants, see SelectOverview.
 */
const SELECT_VARIANTS = ['above', 'floating'] as const;

type SelectVariant = (typeof SELECT_VARIANTS)[number];

/*
 * The states that change the field itself, as data: a plain field with a helper
 * message, an invalid one and a valid one. Three states, so the block gets three
 * columns — each state shown once per label variant, in the row that variant
 * holds, see SelectOverview.
 *
 * The helper state carries the trailing icon rather than taking a specimen of its
 * own — an icon is added to a field, it does not change its state — the same way
 * the input block rides its icon positions along on existing specimens.
 */
type SelectState = 'helper' | 'invalid' | 'valid';

const SELECT_STATES = ['helper', 'invalid', 'valid'] as const satisfies readonly SelectState[];

/*
 * The states that change a switch itself, as data: whether it is on, and whether
 * its value fails or passes validation. The plain off state opens the list
 * because it is the one every other state is read against.
 *
 * `checked` is the on state. `invalid` additionally marks the switch required, so
 * it carries the asterisk a required control shows — the asterisk comes from the
 * `required` prop itself (see `set-required-label` in the component's own
 * styles), not from anything this page adds.
 *
 * Both messages come straight from the component's own props: `invalidMessage`
 * for the invalid state, `validMessage` for the valid one.
 */
type SwitchState = 'default' | 'checked' | 'invalid' | 'valid';

const SWITCH_STATES: {
	key: SwitchState;
	checked?: boolean;
	required?: boolean;
	invalid?: boolean;
	valid?: boolean;
}[] = [
	{ key: 'default' },
	{ key: 'checked', checked: true },
	{ key: 'invalid', required: true, invalid: true },
	{ key: 'valid', valid: true },
];

/*
 * Both label positions a switch offers. `trailing` is the default and comes
 * first. These name the `variant` values, which are not translated.
 */
const SWITCH_VARIANTS = ['trailing', 'leading'] as const;

type SwitchVariant = (typeof SWITCH_VARIANTS)[number];

/*
 * Both orientations of a tab set, horizontal first because it is the one most
 * tabs use. Orientation is the dimension this block shows: it changes the layout
 * of the tab list and the arrow keys that move between tabs. These name the
 * `orientation` values, which are not translated.
 */
const TABS_ORIENTATIONS = ['horizontal', 'vertical'] as const;

type TabsOrientation = (typeof TABS_ORIENTATIONS)[number];

type Size = (typeof SIZES)[number];
type Semantic = (typeof SEMANTICS)[number];

/** The components a specimen is mounted for rather than rendered, see the switch below. */
export type MountedComponent =
	| 'button'
	| 'checkbox'
	| 'custom-select'
	| 'dialog'
	| 'drawer'
	| 'input'
	| 'loading-indicator'
	| 'pagination'
	| 'popover'
	| 'select'
	| 'switch'
	| 'tabs'
	| 'textarea'
	| 'tooltip';

/*
 * The options a multi select specimen starts with. Two of three, so a counted
 * selection reads as a number and a selection shown as tags has more than one.
 * The values follow the option values built in CustomSelectOverview.
 */
const PRESELECTED = ['option-1', 'option-2'];

interface OverviewLabels {
	accordionItems: { headlinePlain: string; text: string }[];
	badge: string;
	button: string;
	/** Accessible name for icon-only specimens, matching the `plus` icon. */
	add: string;
	static: string;
	interactive: string;
	selection: string;
	required: string;
	confirmed: string;
	helper: string;
	placeholder: string;
	selectOptions: string[];
	/*
	 * The longer list for the first specimen. Ten entries, because that is where
	 * the component starts showing the search, and distinguishable ones, so
	 * filtering can be followed.
	 */
	searchOptions: string[];
	searchLabel: string;
	searchPlaceholder: string;
	/** One per entry in `selectOptions`, in the same order. */
	removeTags: string[];
	/** Sample content the backdrop layer dims. */
	backdropContent: string;
	openDialog: string;
	dialogTitle: string;
	dialogText: string;
	/*
	 * The trigger per direction, without and with rounded corners. These name the
	 * values of the `direction` and `rounded` properties, and property values are
	 * not translated — so both languages carry the same text, just as the version
	 * switch does with v5 and v6. They are listed per language anyway, so the
	 * structure stays the same as everywhere else in here.
	 */
	drawerSpecimens: Record<DrawerDirection, { plain: string; rounded: string }>;
	drawerTitle: string;
	drawerText: string;
	close: string;
	cancel: string;
	confirm: string;
	apply: string;
	/** Sample content the divider specimens separate. */
	dividerSegments: string[];
	/** Sample service links for the content area of a footer. */
	footerLinks: string[];
	/** The legal links a footer carries in its meta area. */
	footerMetaLinks: string[];
	/*
	 * The accessible name per navigation inside the footer specimen. The component
	 * only lays a list out as a row inside a `nav`, so each list needs one, and
	 * the two names are distinct: the specimen carries a navigation in both of its
	 * areas, and two navigations with the same name cannot be told apart by anyone
	 * moving through the page by landmark.
	 */
	footerNavLabels: { content: string; meta: string };
	/** Copyright holder. The component prepends the symbol itself. */
	footerCopyright: string;
	/*
	 * The names the heading specimens carry: the size tokens, the semantic levels
	 * and the font weights. All three name property values, which are not
	 * translated, so both languages carry the same text — listed per language
	 * anyway, so the structure stays the same as everywhere else in here. The row
	 * texts are composed from these, see HeadingRow.
	 */
	headingSizes: Record<HeadingSize, string>;
	headingLevels: Record<HeadingLevel, string>;
	headingFontWeights: Record<HeadingFontWeight, string>;
	/*
	 * One per semantic. These name the values of the `semantic` property, and
	 * property values are not translated, so both languages carry the same text.
	 */
	infotextSemantics: Record<Semantic, string>;
	/*
	 * One per link specimen, naming the values of `variant` and `content`. Property
	 * values again, so identical in both languages.
	 */
	linkSpecimens: Record<LinkSpecimen, string>;
	inputLabel: string;
	inputPlaceholder: string;
	inputMessage: string;
	inputValid: string;
	/*
	 * The visible label of a loading indicator specimen. The first three name the
	 * `size` values, the next three the `state` values — property values again, so
	 * identical in both languages.
	 */
	loadingIndicatorSizes: Record<LoadingIndicatorSize, string>;
	loadingIndicatorResults: Record<LoadingIndicatorResult, string>;
	/*
	 * The progress of the determinate specimen, as text. This one is read out and
	 * shown, so it is a real sentence fragment and translated.
	 */
	loadingIndicatorProgress: string;
	/** Names the mode of the one specimen that shows a known progress. */
	loadingIndicatorDeterminate: string;
	/*
	 * One per notification variant, naming the `variant` values. Property values,
	 * so identical in both languages.
	 */
	notificationVariants: Record<NotificationVariant, string>;
	/*
	 * How long ago the overlay notification arrived. Only that variant carries a
	 * timestamp, see NotificationOverview.
	 *
	 * Deliberately short. The component puts the timestamp in a `min-content`
	 * grid column with `white-space: nowrap`, next to the headline in a `1fr`
	 * column — so every character of it is taken off the headline, which then
	 * wraps and makes the card taller than its neighbours.
	 */
	notificationTimestamp: string;
	/*
	 * The accessible name per pagination specimen. A pagination is a navigation
	 * landmark, so each of them needs a name of its own — two landmarks with the
	 * same name cannot be told apart by anyone moving through the page by
	 * landmark, which is the same reason the footer carries two distinct names.
	 */
	paginationLabels: { medium: string; small: string };
	paginationPrevious: string;
	paginationNext: string;
	/** `{page}` and `{totalPages}` are replaced by the component. */
	paginationPageLabel: string;
	/*
	 * One per popover specimen, naming the `placement` values. Property values,
	 * so identical in both languages.
	 */
	popoverPlacements: Record<PopoverPlacement, string>;
	/*
	 * Sample content of the popover panel. Deliberately one short word: the panel
	 * sizes its width against the space between the trigger and the edge of the
	 * content area, so the `right` specimen — whose trigger sits near that edge —
	 * gets the least room and would wrap a longer text onto several lines while the
	 * other placements stayed on one. A single word fits every placement on one
	 * line, so the four specimens stay comparable. This is the component's own
	 * placement-dependent sizing, not a width this page sets, see PopoverOverview.
	 */
	popoverText: string;
	/*
	 * One per radio group state. These name states rather than property values,
	 * but they stay the English state names in both languages, as the drawer
	 * triggers do.
	 */
	radioStates: Record<RadioState, string>;
	/*
	 * The legend of the required group: its name followed by a typed asterisk. The
	 * asterisk is a plain text character here, not the per-option asterisk the
	 * component prints — that one is suppressed, see RadioGroup. The name is
	 * translated, the asterisk stays in both languages.
	 */
	radioRequiredLegend: string;
	/** The two options a plain radio group specimen offers. */
	radioOptions: string[];
	/*
	 * The two options of the required group, shown as a worked example of the
	 * validation states: the first is valid, the second invalid. Named for the
	 * state they carry; translated, because they describe a state rather than
	 * naming a property value.
	 */
	radioValidationOptions: { valid: string; invalid: string };
	/*
	 * One per section spacing step, naming the `spacing` values. Property values,
	 * so identical in both languages.
	 */
	sectionSpacings: Record<SectionSpacing, string>;
	/*
	 * The caption inside a section's placeholder content. A section has no optics
	 * of its own, so the specimen needs visible content for its inner spacing to
	 * read against — this names what that content stands in for. Translated,
	 * because it is a description rather than a property value.
	 */
	sectionContent: string;
	/*
	 * One per stack direction, naming the `direction` values. Property values, so
	 * identical in both languages.
	 */
	stackDirections: Record<StackDirection, string>;
	/*
	 * The placeholder items a stack arranges. A stack has no optics of its own, so
	 * the specimen needs visible items for its direction and gap to read against.
	 * Three, enough to show both the direction and the gaps between them.
	 */
	stackItems: string[];
	/*
	 * One per select label variant, naming the `variant` values. Property values,
	 * so identical in both languages.
	 */
	selectVariants: Record<SelectVariant, string>;
	/*
	 * One per switch state. These name states rather than property values, but
	 * they stay the English state names in both languages, as the radio states do.
	 */
	switchStates: Record<SwitchState, string>;
	/*
	 * One per switch label position, naming the `variant` values. Property values,
	 * so identical in both languages.
	 */
	switchVariants: Record<SwitchVariant, string>;
	/*
	 * One per tabs orientation, naming the `orientation` values. Property values,
	 * so identical in both languages.
	 */
	tabsOrientations: Record<TabsOrientation, string>;
	/*
	 * The accessible name of each tab set, built from the orientation name. A tab
	 * list is labelled through the component's `label`, and two tab lists on one
	 * page need distinct names to be told apart — the orientation is what sets
	 * them apart here.
	 */
	tabsLabel: string;
	/** The three tabs every tab set specimen carries, and their panel content. */
	tabsItems: { label: string; content: string }[];
	/*
	 * One per tag row, naming the `behavior` property values. Property values,
	 * so identical in both languages.
	 */
	tagBehaviors: Record<TagBehaviorType, string>;
	/*
	 * The labels of the two native controls the interactive column wraps in a tag.
	 * These name the control, not a property value, so they are translated.
	 */
	tagInteractiveButton: string;
	tagInteractiveCheckbox: string;
	textareaLabel: string;
	textareaPlaceholder: string;
	/** Sample content of the tooltip panel. Short, for the same reason popoverText is. */
	tooltipText: string;
	version: string;
	v5: string;
	v6: string;
}

/*
 * Specimen content, kept here rather than in the i18n dictionary: that dictionary
 * covers interface strings such as the shell and footer, while these are sample
 * values that only exist on this page.
 */
const LABELS: Record<Language, OverviewLabels> = {
	de: {
		accordionItems: [
			{ headlinePlain: 'Erstes Element', text: 'Inhalt des ersten Elements.' },
			{ headlinePlain: 'Zweites Element', text: 'Inhalt des zweiten Elements.' },
			{ headlinePlain: 'Drittes Element', text: 'Inhalt des dritten Elements.' },
		],
		badge: 'Badge',
		button: 'Button',
		add: 'Hinzufügen',
		static: 'statisch',
		interactive: 'interaktiv',
		selection: 'Auswahl',
		required: 'Pflichtfeld',
		confirmed: 'Auswahl bestätigt',
		helper: 'Optionaler Hilfetext zur Auswahl',
		placeholder: 'Bitte wählen',
		selectOptions: ['Erste Option', 'Zweite Option', 'Dritte Option'],
		searchOptions: [
			'Berlin',
			'Hamburg',
			'München',
			'Köln',
			'Frankfurt am Main',
			'Stuttgart',
			'Düsseldorf',
			'Leipzig',
			'Dresden',
			'Hannover',
		],
		searchLabel: 'Optionen durchsuchen',
		searchPlaceholder: 'Suchbegriff',
		removeTags: ['Erste Option entfernen', 'Zweite Option entfernen', 'Dritte Option entfernen'],
		backdropContent: 'Inhalt im Hintergrund',
		openDialog: 'Dialog öffnen',
		dialogTitle: 'Änderungen speichern',
		dialogText: 'Deine Änderungen sind noch nicht gespeichert.',
		drawerSpecimens: {
			'to-right': { plain: 'To right', rounded: 'To right (rounded)' },
			'to-left': { plain: 'To left', rounded: 'To left (rounded)' },
			up: { plain: 'Up', rounded: 'Up (rounded)' },
			down: { plain: 'Down', rounded: 'Down (rounded)' },
		},
		drawerTitle: 'Filter',
		drawerText: 'Wähle die Kriterien für die Liste aus.',
		close: 'Schließen',
		cancel: 'Abbrechen',
		confirm: 'Speichern',
		apply: 'Anwenden',
		dividerSegments: ['Abschnitt 1', 'Abschnitt 2', 'Abschnitt 3'],
		footerLinks: ['Services', 'Angebote', 'Hilfe und Kontakt'],
		footerMetaLinks: ['Datenschutz', 'Impressum', 'Barrierefreiheit'],
		footerNavLabels: {
			content: 'Services im Inhaltsbereich des Footers',
			meta: 'Rechtliche Links im Meta Bereich des Footers',
		},
		footerCopyright: 'Deutsche Bahn AG',
		headingSizes: {
			'3xl': '3xl',
			'2xl': '2xl',
			xl: 'xl',
			lg: 'lg',
			md: 'md',
			sm: 'sm',
			xs: 'xs',
			'2xs': '2xs',
			'3xs': '3xs',
		},
		headingLevels: {
			h1: 'H1',
			h2: 'H2',
			h3: 'H3',
			h4: 'H4',
			h5: 'H5',
			h6: 'H6',
		},
		headingFontWeights: {
			black: 'Black',
			light: 'Light',
		},
		infotextSemantics: {
			adaptive: 'Adaptive',
			neutral: 'Neutral',
			informational: 'Informational',
			successful: 'Successful',
			warning: 'Warning',
			critical: 'Critical',
		},
		linkSpecimens: {
			adaptive: 'Adaptive',
			adaptiveExternal: 'Adaptive (external)',
			brand: 'Brand',
			brandExternal: 'Brand (external)',
			inline: 'Inline',
		},
		inputLabel: 'Name',
		inputPlaceholder: 'Dein Name',
		inputMessage: 'Vor- und Nachname',
		inputValid: 'Eingabe ist gültig',
		loadingIndicatorSizes: {
			small: 'Small',
			medium: 'Medium',
			large: 'Large',
		},
		loadingIndicatorResults: {
			inactive: 'Inactive',
			successful: 'Successful',
			critical: 'Critical',
		},
		loadingIndicatorProgress: '42%',
		loadingIndicatorDeterminate: 'Determinate',
		notificationVariants: {
			docked: 'Docked',
			standalone: 'Standalone',
			overlay: 'Overlay',
		},
		notificationTimestamp: 'vor 5 Min.',
		paginationLabels: {
			medium: 'Pagination Medium',
			small: 'Pagination Small',
		},
		paginationPrevious: 'Vorherige Seite',
		paginationNext: 'Nächste Seite',
		paginationPageLabel: 'Seite {page} von {totalPages}',
		popoverPlacements: {
			bottom: 'Bottom',
			top: 'Top',
			left: 'Left',
			right: 'Right',
		},
		popoverText: 'Inhalt',
		radioStates: {
			default: 'Default',
			checked: 'Checked',
			required: 'Required',
		},
		radioRequiredLegend: 'Pflichtfeld *',
		radioOptions: ['Erste Option', 'Zweite Option'],
		radioValidationOptions: {
			valid: 'Option gültig',
			invalid: 'Option ungültig',
		},
		sectionSpacings: {
			large: 'Large',
			medium: 'Medium',
			small: 'Small',
		},
		sectionContent: 'Inhalt',
		stackDirections: {
			column: 'Column',
			row: 'Row',
		},
		stackItems: ['Eins', 'Zwei', 'Drei'],
		selectVariants: {
			above: 'Above',
			floating: 'Floating',
		},
		switchStates: {
			default: 'Default',
			checked: 'Checked',
			invalid: 'Invalid',
			valid: 'Valid',
		},
		switchVariants: {
			trailing: 'Trailing',
			leading: 'Leading',
		},
		tabsOrientations: {
			horizontal: 'Horizontal',
			vertical: 'Vertical',
		},
		tabsLabel: 'Tabs',
		tabsItems: [
			{ label: 'Erster Tab', content: 'Inhalt des ersten Tabs.' },
			{ label: 'Zweiter Tab', content: 'Inhalt des zweiten Tabs.' },
			{ label: 'Dritter Tab', content: 'Inhalt des dritten Tabs.' },
		],
		tagBehaviors: {
			static: 'Statisch',
			removable: 'Entfernbar',
		},
		tagInteractiveButton: 'Button',
		tagInteractiveCheckbox: 'Checkbox',
		textareaLabel: 'Beschreibung',
		textareaPlaceholder: 'Längeren Text eingeben',
		tooltipText: 'Inhalt',
		version: 'Version',
		v5: 'v5 (altes DB Markendesign)',
		v6: 'v6 (neues DB Markendesign)',
	},
	en: {
		accordionItems: [
			{ headlinePlain: 'First item', text: 'Content of the first item.' },
			{ headlinePlain: 'Second item', text: 'Content of the second item.' },
			{ headlinePlain: 'Third item', text: 'Content of the third item.' },
		],
		badge: 'Badge',
		button: 'Button',
		add: 'Add',
		static: 'static',
		interactive: 'interactive',
		selection: 'Selection',
		required: 'Required',
		confirmed: 'Selection confirmed',
		helper: 'Optional helper text for selection',
		placeholder: 'Please select',
		selectOptions: ['First option', 'Second option', 'Third option'],
		searchOptions: [
			'Berlin',
			'Hamburg',
			'Munich',
			'Cologne',
			'Frankfurt am Main',
			'Stuttgart',
			'Dusseldorf',
			'Leipzig',
			'Dresden',
			'Hanover',
		],
		searchLabel: 'Search options',
		searchPlaceholder: 'Search term',
		removeTags: ['Remove first option', 'Remove second option', 'Remove third option'],
		backdropContent: 'Content in the background',
		openDialog: 'Open dialog',
		dialogTitle: 'Save changes',
		dialogText: 'Your changes have not been saved yet.',
		drawerSpecimens: {
			'to-right': { plain: 'To right', rounded: 'To right (rounded)' },
			'to-left': { plain: 'To left', rounded: 'To left (rounded)' },
			up: { plain: 'Up', rounded: 'Up (rounded)' },
			down: { plain: 'Down', rounded: 'Down (rounded)' },
		},
		drawerTitle: 'Filter',
		drawerText: 'Choose the criteria for the list.',
		close: 'Close',
		cancel: 'Cancel',
		confirm: 'Save',
		apply: 'Apply',
		dividerSegments: ['Section 1', 'Section 2', 'Section 3'],
		footerLinks: ['Services', 'Offers', 'Help and contact'],
		footerMetaLinks: ['Privacy policy', 'Imprint', 'Accessibility'],
		footerNavLabels: {
			content: 'Services in the content area of the footer',
			meta: 'Legal links in the meta area of the footer',
		},
		footerCopyright: 'Deutsche Bahn AG',
		headingSizes: {
			'3xl': '3xl',
			'2xl': '2xl',
			xl: 'xl',
			lg: 'lg',
			md: 'md',
			sm: 'sm',
			xs: 'xs',
			'2xs': '2xs',
			'3xs': '3xs',
		},
		headingLevels: {
			h1: 'H1',
			h2: 'H2',
			h3: 'H3',
			h4: 'H4',
			h5: 'H5',
			h6: 'H6',
		},
		headingFontWeights: {
			black: 'Black',
			light: 'Light',
		},
		infotextSemantics: {
			adaptive: 'Adaptive',
			neutral: 'Neutral',
			informational: 'Informational',
			successful: 'Successful',
			warning: 'Warning',
			critical: 'Critical',
		},
		linkSpecimens: {
			adaptive: 'Adaptive',
			adaptiveExternal: 'Adaptive (external)',
			brand: 'Brand',
			brandExternal: 'Brand (external)',
			inline: 'Inline',
		},
		inputLabel: 'Name',
		inputPlaceholder: 'Your name',
		inputMessage: 'First and last name',
		inputValid: 'Entry is valid',
		loadingIndicatorSizes: {
			small: 'Small',
			medium: 'Medium',
			large: 'Large',
		},
		loadingIndicatorResults: {
			inactive: 'Inactive',
			successful: 'Successful',
			critical: 'Critical',
		},
		loadingIndicatorProgress: '42%',
		loadingIndicatorDeterminate: 'Determinate',
		notificationVariants: {
			docked: 'Docked',
			standalone: 'Standalone',
			overlay: 'Overlay',
		},
		notificationTimestamp: '5 min ago',
		paginationLabels: {
			medium: 'Pagination medium',
			small: 'Pagination small',
		},
		paginationPrevious: 'Previous page',
		paginationNext: 'Next page',
		paginationPageLabel: 'Page {page} of {totalPages}',
		popoverPlacements: {
			bottom: 'Bottom',
			top: 'Top',
			left: 'Left',
			right: 'Right',
		},
		popoverText: 'Content',
		radioStates: {
			default: 'Default',
			checked: 'Checked',
			required: 'Required',
		},
		radioRequiredLegend: 'Required *',
		radioOptions: ['First option', 'Second option'],
		radioValidationOptions: {
			valid: 'Option valid',
			invalid: 'Option invalid',
		},
		sectionSpacings: {
			large: 'Large',
			medium: 'Medium',
			small: 'Small',
		},
		sectionContent: 'Content',
		stackDirections: {
			column: 'Column',
			row: 'Row',
		},
		stackItems: ['One', 'Two', 'Three'],
		selectVariants: {
			above: 'Above',
			floating: 'Floating',
		},
		switchStates: {
			default: 'Default',
			checked: 'Checked',
			invalid: 'Invalid',
			valid: 'Valid',
		},
		switchVariants: {
			trailing: 'Trailing',
			leading: 'Leading',
		},
		tabsOrientations: {
			horizontal: 'Horizontal',
			vertical: 'Vertical',
		},
		tabsLabel: 'Tabs',
		tabsItems: [
			{ label: 'First tab', content: 'Content of the first tab.' },
			{ label: 'Second tab', content: 'Content of the second tab.' },
			{ label: 'Third tab', content: 'Content of the third tab.' },
		],
		tagBehaviors: {
			static: 'Static',
			removable: 'Removable',
		},
		tagInteractiveButton: 'Button',
		tagInteractiveCheckbox: 'Checkbox',
		textareaLabel: 'Description',
		textareaPlaceholder: 'Enter longer text',
		tooltipText: 'Content',
		version: 'Version',
		v5: 'v5 (old DB brand design)',
		v6: 'v6 (new DB brand design)',
	},
};

/*
 * Column count for the specimens that are mounted in the browser. It is set on
 * the element the page renders, not inside the mounted component, so the grid is
 * in place before the mount. The drawer gets two columns so each row holds one
 * direction with its two corner states.
 */
const MOUNT_COLUMNS: Record<MountedComponent, number> = {
	button: 6,
	/* Four states per size, so each size fills one row. */
	checkbox: 4,
	'custom-select': 2,
	dialog: 1,
	drawer: 1,
	/* Four states per label variant, so each variant fills one row. */
	input: 4,
	/*
	 * One column per shape and orientation, see LOADING_INDICATOR_COLUMNS: the
	 * circular shape in both of its orientations and the bar, which has none.
	 */
	'loading-indicator': 3,
	/* Both sizes side by side, which is the one dimension of this block. */
	pagination: 2,
	popover: 1,
	/*
	 * One column per state — helper, invalid, valid — with the two label variants
	 * running down as rows, so each row holds one variant in all three states.
	 */
	select: 3,
	/* One column per state — default, checked, invalid, valid. */
	switch: 1,
	/* Both orientations side by side, which is the dimension of this block. */
	tabs: 2,
	/* Four states per label variant, so each variant fills one row, like input. */
	textarea: 4,
	/* One row of triggers, as wide as the placements it covers. */
	tooltip: 1,
};

/*
 * The mounted specimens whose columns stay as wide as their content: rows of
 * small controls and triggers. Form fields are left out — they fill the column
 * they sit in, as they do in a real form. The loading indicator is left out too:
 * its bar variant is `inline-size: 100%` and needs a column with a width.
 */
const MOUNT_FIT_CONTENT: MountedComponent[] = [
	'button',
	'dialog',
	'drawer',
	'pagination',
	'popover',
	'tooltip',
];

/** Sets the column count the grid reads from --overview-columns. */
const columns = (count: number): CSSProperties =>
	({ '--overview-columns': count }) as CSSProperties;

const AccordionOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(2)}>
		<div>
			<DBAccordion variant="divider" items={labels.accordionItems} />
		</div>
		<div>
			<DBAccordion variant="card" items={labels.accordionItems} />
		</div>
	</div>
);

/*
 * One size column, holding the content variants text, icon and dot below each
 * other. A badge has no icon property: an icon is passed as a DBIcon child, whose
 * text is hidden via `font-size: 0`. The child must carry that text, because an
 * empty child span would make the badge fall back to the dot styling. This is the
 * icon-only construction the component's own examples use.
 *
 * That construction yields no accessible name on its own: DBIcon renders
 * `aria-hidden`, so the text passed as its children never reaches assistive
 * technology. Per the component team, the fix for an icon-only or dot badge is
 * an explicit `aria-label` on the `DBBadge` itself — it is not something the
 * component infers. Both specimens below set one.
 *
 * The pattern still fails the design system's own `db-ux/text-or-children-required`
 * rule, which only inspects `text`/children content and does not look at
 * `aria-label`, so `pnpm run lint` reports two expected errors here (F-2, F-3).
 */
const BadgeCell = ({
	size,
	emphasis,
	labels,
}: {
	size: Size;
	emphasis?: 'strong';
	labels: OverviewLabels;
}): ReactElement => (
	<div className="overview-stack">
		<div className="overview-row">
			{SEMANTICS.map((semantic) => (
				<DBBadge key={semantic} semantic={semantic} size={size} emphasis={emphasis}>
					{labels.badge}
				</DBBadge>
			))}
		</div>
		<div className="overview-row">
			{SEMANTICS.map((semantic) => (
				<DBBadge
					key={semantic}
					semantic={semantic}
					size={size}
					emphasis={emphasis}
					aria-label={labels.add}
				>
					<DBIcon icon="plus">{labels.add}</DBIcon>
				</DBBadge>
			))}
		</div>
		<div className="overview-row">
			{SEMANTICS.map((semantic: Semantic) => (
				/*
				 * The dot carries no text content, because any content would turn it
				 * back into a regular badge: the dot styling applies to an empty badge.
				 * Its `label` property is no way out either — the component only
				 * renders it together with a `corner-*` placement, which would position
				 * the badge absolutely and break this row. So the name comes from
				 * `aria-label` instead, naming the semantic it carries.
				 */
				<DBBadge
					key={semantic}
					semantic={semantic}
					size={size}
					emphasis={emphasis}
					aria-label={labels.infotextSemantics[semantic]}
				/>
			))}
		</div>
	</div>
);

const BadgeOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" data-fit="content" style={columns(2)}>
		<BadgeCell size="small" labels={labels} />
		<BadgeCell size="medium" labels={labels} />
		<BadgeCell size="small" emphasis="strong" labels={labels} />
		<BadgeCell size="medium" emphasis="strong" labels={labels} />
	</div>
);

/*
 * One row per variant, with both sizes next to each other. Each size shows text,
 * icon with text and icon only. The icon-only button keeps its text as an
 * accessible name; `noText` only hides it visually.
 *
 * Mounted in the browser because of the tooltip on the icon-only button: the
 * tooltip places itself from script, and without that it stays absolutely
 * positioned below its button — invisible, but tall enough to make the document
 * itself scrollable, which pushed the whole shell out of place as soon as a table
 * of contents link scrolled to an anchor.
 */
const ButtonOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{BUTTON_VARIANTS.map((variant) => (
			<Fragment key={variant}>
				{SIZES.map((size) => (
					<Fragment key={size}>
						<DBButton type="button" variant={variant} size={size}>
							{labels.button}
						</DBButton>
						<DBButton type="button" variant={variant} size={size} icon="plus">
							{labels.button}
						</DBButton>
						<DBButton type="button" variant={variant} size={size} icon="plus" noText>
							{labels.add}
							{/*
							 * An icon-only button needs the tooltip: without it the name is
							 * only available to assistive technology, while anyone looking
							 * at the icon has no way to find out what it does. Same string
							 * as the button text, so there is one source for both.
							 */}
							<DBTooltip>{labels.add}</DBTooltip>
						</DBButton>
					</Fragment>
				))}
			</Fragment>
		))}
	</>
);

const CardOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(2)}>
		{CARD_LEVELS.map((level) => (
			<Fragment key={level}>
				<DBCard elevationLevel={level} behavior="static">
					{`Level ${level} · ${labels.static}`}
				</DBCard>
				<DBCard elevationLevel={level} behavior="interactive">
					{`Level ${level} · ${labels.interactive}`}
				</DBCard>
			</Fragment>
		))}
	</div>
);

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
const CheckboxOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
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

/*
 * The closed state in its label variants above and floating, plus the states that
 * change the form field itself: helper message, required, leading icon and
 * disabled.
 *
 * The multi select specimens carry a selection, because `selectedType` only
 * changes how an existing selection is shown — without one they would all read as
 * the same empty field.
 */
const CustomSelectOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => {
	const toOptions = (entries: string[]) =>
		entries.map((label, index) => ({ value: `option-${index + 1}`, label }));

	const options = toOptions(labels.selectOptions);

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
				multiple
				selectedType="text"
				values={PRESELECTED}
				label={labels.selection}
				placeholder={labels.placeholder}
				options={options}
			/>
			<DBCustomSelect
				multiple
				selectedType="amount"
				values={PRESELECTED}
				label={labels.selection}
				placeholder={labels.placeholder}
				options={options}
			/>
			<DBCustomSelect
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
				variant="floating"
				label={labels.selection}
				placeholder={labels.placeholder}
				options={options}
			/>
		</>
	);
};

/*
 * The dialog is shown through its trigger and opens with its real behavior, so
 * the overlay, the focus handling and Escape are the component's own.
 *
 * `open` is held here rather than on the page, and `onClose` mirrors the dialog
 * closing itself back into that state — the dialog can be dismissed with Escape
 * or its own close button, which never pass through the trigger.
 */
const DialogOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<DBButton type="button" variant="filled" onClick={() => setOpen(true)}>
				{labels.openDialog}
			</DBButton>
			<DBDialog
				open={open}
				onClose={() => setOpen(false)}
				header={<DBDialogHeader closeButtonText={labels.close} text={labels.dialogTitle} />}
				footer={
					<DBDialogFooter>
						<DBButton type="button" variant="ghost" onClick={() => setOpen(false)}>
							{labels.cancel}
						</DBButton>
						<DBButton type="button" variant="brand" onClick={() => setOpen(false)}>
							{labels.confirm}
						</DBButton>
					</DBDialogFooter>
				}
			>
				{labels.dialogText}
			</DBDialog>
		</>
	);
};

/*
 * The backdrop as a layer over sample content, bounded by a preview box.
 *
 * There is no backdrop component: the documentation states this and names the
 * color recipe instead, which the stylesheet carries. Shown in both steps the
 * recipe offers, the stronger one first.
 *
 * The preview box is what keeps the layer in place. A real backdrop covers the
 * whole viewport, which on this page would dim the overview itself, so the box
 * provides the positioning context the layer is bound to.
 */
const BackdropOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(2)}>
		{(['strong', 'weak'] as const).map((emphasis) => (
			<div key={emphasis} className="overview-backdrop">
				<span>{labels.backdropContent}</span>
				<div className="overview-backdrop-layer" data-emphasis={emphasis} />
			</div>
		))}
	</div>
);

/*
 * Both orientations, each with the two emphasis steps, between sample content: a
 * divider has no size of its own and takes it from what it separates. The
 * horizontal one needs `width="full"` because the column aligns its content to
 * the start, the vertical one takes its height from the stretched row.
 */
const DividerOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(2)}>
		<div className="overview-stack">
			{DIVIDER_EMPHASIS.map((emphasis, index) => (
				<Fragment key={emphasis ?? 'weak'}>
					<span>{labels.dividerSegments[index]}</span>
					<DBDivider emphasis={emphasis} width="full" />
				</Fragment>
			))}
			<span>{labels.dividerSegments[DIVIDER_EMPHASIS.length]}</span>
		</div>
		<div className="overview-row" data-align="stretch">
			{DIVIDER_EMPHASIS.map((emphasis, index) => (
				<Fragment key={emphasis ?? 'weak'}>
					<span>{labels.dividerSegments[index]}</span>
					<DBDivider variant="vertical" emphasis={emphasis} />
				</Fragment>
			))}
			<span>{labels.dividerSegments[DIVIDER_EMPHASIS.length]}</span>
		</div>
	</div>
);

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
const DrawerOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => {
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

/*
 * The footer across the full content width.
 *
 * It is a page region rather than a control: it lays itself out across the width
 * it is given, so two of them next to each other would be compared at a width no
 * page ever shows them at. A single column gives it a row at full width, which is
 * what the existing grid does with --overview-columns set to one — no extra
 * layout needed.
 *
 * One specimen, composing both areas the component has: the content area with
 * service links and the meta area with the legal ones below it. The links are
 * samples and point nowhere, as they do in the component's own examples.
 */
const FooterOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(1)}>
		<DBFooter>
			<DBFooterContent>
				{/*
				 * The list lives inside a `nav`, which is what the component styles it
				 * through: outside one it stays a bulleted block list instead of a row
				 * of links. Each navigation carries its own name, see footerNavLabels.
				 */}
				<nav aria-label={labels.footerNavLabels.content}>
					<ul>
						{labels.footerLinks.map((label) => (
							<li key={label}>
								<DBLink href="#" wrap>
									{label}
								</DBLink>
							</li>
						))}
					</ul>
				</nav>
			</DBFooterContent>
			<DBFooterMeta copyright={labels.footerCopyright}>
				<nav aria-label={labels.footerNavLabels.meta}>
					<ul>
						{labels.footerMetaLinks.map((label) => (
							<li key={label}>
								<DBLink variant="inline" size="small" href="#">
									{label}
								</DBLink>
							</li>
						))}
					</ul>
				</nav>
			</DBFooterMeta>
		</DBFooter>
	</div>
);

/*
 * One row of a heading set: the same shape in each of its font weights, next to
 * each other.
 *
 * Only the first specimen carries the name of the row, the others name their
 * weight alone. Repeating the row name in front of every weight would say the
 * same thing three times in one line and push the longest rows off a narrow
 * viewport for nothing.
 *
 * Every specimen is an h3 with an explicit `size`, deliberately: the page uses h1
 * for its title and h2 for every component section, so a specimen carrying one of
 * those tags would corrupt the document outline. Separating the semantic level
 * from the visual size is what the component offers `size` for.
 */
const HeadingRow = ({
	name,
	size,
	weights,
	labels,
}: {
	name: string;
	size: HeadingSize;
	weights: readonly HeadingFontWeight[];
	labels: OverviewLabels;
}): ReactElement => (
	<div className="overview-row">
		{weights.map((weight, index) => (
			<DBHeadingH3 key={weight} size={size} fontWeight={weight}>
				{index === 0
					? `${name} ${labels.headingFontWeights[weight]}`
					: labels.headingFontWeights[weight]}
			</DBHeadingH3>
		))}
	</div>
);

/*
 * Two sets of rows, one per version, both in the markup at the same time.
 *
 * The version switch is pure CSS — it matches the selected option with `:has()`
 * and redefines tokens — so it cannot change what is rendered. Both sets are
 * therefore always rendered and the stylesheet shows the one that fits, the same
 * way the rounded drawer row disappears in v6.
 *
 * v5 is the visual size scale the component has today, nine rows, each naming the
 * level that defaults to that size. v6 is the six semantic levels, which is all
 * that is left of the scale there, each at the size its level maps to.
 */
const HeadingOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(1)}>
		<div className="overview-stack" data-overview-version="v5">
			{HEADING_SIZES.map((size) => {
				const level = HEADING_SIZE_LEVELS[size];

				return (
					<HeadingRow
						key={size}
						size={size}
						/*
						 * The level in brackets behind the size token, where there is one:
						 * three of the nine sizes are not the default of any level.
						 */
						name={
							level
								? `${labels.headingSizes[size]} (${labels.headingLevels[level]})`
								: labels.headingSizes[size]
						}
						weights={HEADING_FONT_WEIGHTS}
						labels={labels}
					/>
				);
			})}
		</div>
		{/*
		 * H1 and H2 are to show a third weight, Wide ExtraBlack, which neither the
		 * component nor the theme offers yet — it arrives with the next brand
		 * generation and is then added to HEADING_LEVEL_FONT_WEIGHTS.
		 */}
		<div className="overview-stack" data-overview-version="v6">
			{HEADING_LEVELS.map((level) => (
				<HeadingRow
					key={level}
					size={HEADING_LEVEL_SIZES[level]}
					name={labels.headingLevels[level]}
					weights={HEADING_LEVEL_FONT_WEIGHTS[level]}
					labels={labels}
				/>
			))}
		</div>
	</div>
);

/*
 * One row per size, holding every semantic next to each other. Always with the
 * icon, which is the component's default: without it the semantic is carried by
 * color alone, which is not a state worth putting forward here.
 *
 * A single column, so each size gets the full content width for its six
 * semantics instead of wrapping them inside half of it.
 */
const InfotextOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(1)}>
		{SIZES.map((size) => (
			<div key={size} className="overview-row">
				{SEMANTICS.map((semantic) => (
					<DBInfotext key={semantic} semantic={semantic} size={size}>
						{labels.infotextSemantics[semantic]}
					</DBInfotext>
				))}
			</div>
		))}
	</div>
);

/*
 * One size column, holding the variants below each other, each with the arrow it
 * carries.
 */
const LinkCell = ({ size, labels }: { size: Size; labels: OverviewLabels }): ReactElement => (
	<div className="overview-stack">
		{LINK_SPECIMENS.map((specimen) => (
			<DBLink
				key={specimen.key}
				href="#"
				size={size}
				variant={specimen.variant}
				content={specimen.content}
			>
				{labels.linkSpecimens[specimen.key]}
			</DBLink>
		))}
	</div>
);

const LinkOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(2)}>
		<LinkCell size="small" labels={labels} />
		<LinkCell size="medium" labels={labels} />
	</div>
);

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

const InputOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		<InputStates variant="above" icons labels={labels} />
		<InputStates variant="floating" labels={labels} />
	</>
);

/*
 * One column per shape and orientation, each holding the same rows: the three
 * sizes while the load runs, the states the load ends in, and a determinate
 * specimen. Every column carries every row, so a row can be read across the
 * columns — which is what the orientation dimension is here for.
 *
 * The visible label is the name of the specimen, so no extra caption is needed —
 * the component asks for a label anyway, since the indicator alone says that
 * something is loading but not what.
 *
 * Mounted in the browser. The component seeds its state in an effect, so a
 * specimen rendered alone stays at `inactive` no matter what `state` says: every
 * indicator would show the same empty track. It also links its label to the
 * progress element through an id it only assigns once it runs, the same as the
 * input and the custom select.
 *
 * `active` is the one state that animates. It is the component's own animation
 * and it follows `prefers-reduced-motion`: the segment then advances in eight
 * discrete steps instead of gliding. Nothing of that is touched here.
 */
const LoadingIndicatorCell = ({
	variant,
	orientation,
	labels,
}: {
	variant: 'circular' | 'bar';
	orientation: 'horizontal' | 'vertical';
	labels: OverviewLabels;
}): ReactElement => (
	<div
		className="overview-stack"
		/*
		 * Only the upright column is centred. Its specimens are a circle with the
		 * label underneath, so each row is about as wide as its own text and the
		 * column has no edge to align to — left-aligned next to the wider columns
		 * they read as a ragged edge rather than as a column. Every other column
		 * has specimens of comparable width and keeps the start alignment.
		 */
		data-align={orientation === 'vertical' ? 'center' : undefined}
	>
		{LOADING_INDICATOR_SIZES.map((size) => (
			<DBLoadingIndicator
				key={size}
				variant={variant}
				orientation={orientation}
				size={size}
				state="active"
			>
				{labels.loadingIndicatorSizes[size]}
			</DBLoadingIndicator>
		))}
		{LOADING_INDICATOR_RESULTS.map((state) => (
			<DBLoadingIndicator key={state} variant={variant} orientation={orientation} state={state}>
				{labels.loadingIndicatorResults[state]}
			</DBLoadingIndicator>
		))}
		{/*
		 * A known progress instead of an ongoing one. `indeterminate` has to be
		 * turned off explicitly — it is the component's default, and with it on,
		 * `value` and `max` are ignored.
		 */}
		<DBLoadingIndicator
			variant={variant}
			orientation={orientation}
			state="active"
			indeterminate={false}
			value={42}
			max={100}
			progressText={labels.loadingIndicatorProgress}
			showProgressText
		>
			{labels.loadingIndicatorDeterminate}
		</DBLoadingIndicator>
	</div>
);

const LoadingIndicatorOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{LOADING_INDICATOR_COLUMNS.map((column) => (
			<LoadingIndicatorCell
				key={`${column.variant}-${column.orientation}`}
				variant={column.variant}
				orientation={column.orientation}
				labels={labels}
			/>
		))}
	</>
);

/*
 * One column per variant, each holding the six semantics below each other.
 *
 * Shown directly rather than through a trigger: a notification is content on the
 * page, not an overlay that has to be opened. The headline names the semantic and
 * the text names the variant, so every specimen says which cell of the matrix it
 * is.
 *
 * The icon is the component's own: five semantics bring one, `adaptive` does not,
 * and that difference is left as it is instead of being evened out with an
 * explicit `icon`.
 *
 * `closeable` is left out. The close button would be a control that closes
 * nothing on a page of specimens, which is worse than not showing it.
 *
 * `ariaLive` and `role` are left unset as well. They turn a notification into a
 * live region, which is right for one that arrives during use and wrong for
 * eighteen that are part of the page from the start.
 */
const NotificationCell = ({
	variant,
	labels,
}: {
	variant: NotificationVariant;
	labels: OverviewLabels;
}): ReactElement => (
	/*
	 * The specimens fill their column rather than their content: a notification is
	 * a block of content and takes the width it is given, so at content width the
	 * widest of them grew out of its column.
	 */
	<div className="overview-stack" data-align="stretch">
		{SEMANTICS.map((semantic) => (
			<DBNotification
				key={semantic}
				variant={variant}
				semantic={semantic}
				headline={labels.infotextSemantics[semantic]}
				/*
				 * Only the overlay variant carries a timestamp — it is the variant that
				 * arrives as a snackbar, where when it arrived is part of the message.
				 * The machine-readable duration goes with the visible text.
				 */
				timestamp={variant === 'overlay' ? labels.notificationTimestamp : undefined}
				timestampDatetime={variant === 'overlay' ? 'PT5M' : undefined}
			>
				{labels.notificationVariants[variant]}
			</DBNotification>
		))}
	</div>
);

const NotificationOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(3)}>
		{NOTIFICATION_VARIANTS.map((variant) => (
			<NotificationCell key={variant} variant={variant} labels={labels} />
		))}
	</div>
);

/*
 * One pagination per specimen, with its own current page.
 *
 * The component never changes the page itself: it reports the requested one and
 * the parent has to write it back, so each specimen keeps that page in state.
 * Without it the pagination would look interactive and do nothing.
 *
 * The pages come from `totalCount` and `pageSize`, which is the data-driven API.
 * The Pagination Item is part of what the component composes from that — it is
 * documented as a sub component and needs no section of its own.
 */
const PaginationSpecimen = ({
	label,
	size,
	totalCount,
	initialPage,
	labels,
}: {
	label: string;
	size?: Size;
	totalCount: number;
	initialPage: number;
	labels: OverviewLabels;
}): ReactElement => {
	const [currentPage, setCurrentPage] = useState(initialPage);

	return (
		<DBPagination
			label={label}
			size={size}
			currentPage={currentPage}
			totalCount={totalCount}
			pageSize={10}
			previousLabel={labels.paginationPrevious}
			nextLabel={labels.paginationNext}
			pageLabel={labels.paginationPageLabel}
			onPageChange={(page) => setCurrentPage(page)}
		/>
	);
};

/*
 * Both sizes next to each other, on a list long enough to collapse. The size is
 * the one dimension this component has, so the two specimens are the whole
 * comparison and belong in one row rather than below each other.
 *
 * Both start in the middle of the list, which is where the component shows what
 * it does with a list it cannot fit: the pages around the current one stay, the
 * rest gives way to an ellipsis.
 *
 * Mounted in the browser. Which page is the current one is written onto the
 * markup from script — the filled page button and its `aria-current` — so a
 * rendered-only pagination shows no current page at all.
 */
const PaginationOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		<PaginationSpecimen
			label={labels.paginationLabels.medium}
			totalCount={200}
			initialPage={5}
			labels={labels}
		/>
		<PaginationSpecimen
			label={labels.paginationLabels.small}
			size="small"
			totalCount={200}
			initialPage={5}
			labels={labels}
		/>
	</>
);

/*
 * The popover through its triggers, like the dialog and the drawer above: the
 * four main placements in one row.
 *
 * Placement is the one dimension here. The panel's padding steps were a second
 * row, which compared four panels that differ by a few pixels of inner spacing
 * and said nothing about the component that the placements do not already show.
 *
 * The trigger is a real button with a real job, so the popover behaves as it does
 * in an application — it opens on hover and on keyboard focus, which is the
 * behavior the component brings without an `open` property. A placeholder that
 * only looks like a trigger would be focusable without doing anything.
 *
 * Mounted in the browser for that reason: without script the panel never opens,
 * and the component also places it from script. Left to the stylesheet it stays
 * absolutely positioned below its trigger, where an ancestor with `overflow` can
 * cut it off.
 */
const PopoverOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-row">
		{POPOVER_PLACEMENTS.map((placement) => (
			<DBPopover
				key={placement}
				placement={placement}
				trigger={
					<DBButton type="button" variant="filled">
						{labels.popoverPlacements[placement]}
					</DBButton>
				}
			>
				{labels.popoverText}
			</DBPopover>
		))}
	</div>
);

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

const RadioOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
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

/*
 * One section per spacing step, each wrapping the same placeholder content.
 *
 * A section has no optics of its own: it is a layout region that sets the inner
 * spacing around its content and, through `width`, a maximum content width. The
 * spacing is the one dimension that shows on its own, so the specimens compare
 * it directly — three steps, widest first, so the shrinking padding reads top to
 * bottom.
 *
 * The spacing is only visible against the content it surrounds, so each section
 * carries a placeholder box and sits on a tinted panel: the gap between the box
 * and the panel edge is the section's padding. Without that contrast the section
 * would render as an empty area and show nothing.
 *
 * `width` is left out as a dimension. It caps the content width and only shows
 * once the content area is wider than the cap, which the half-width grid column
 * here never is — every specimen would look identical. It is noted for the review
 * instead of shown misleadingly.
 */
const SectionCell = ({
	spacing,
	labels,
}: {
	spacing: SectionSpacing;
	labels: OverviewLabels;
}): ReactElement => (
	<div className="overview-section-preview">
		<DBSection spacing={spacing}>
			<div className="overview-placeholder">
				{`${labels.sectionSpacings[spacing]} · ${labels.sectionContent}`}
			</div>
		</DBSection>
	</div>
);

const SectionOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(1)}>
		{SECTION_SPACINGS.map((spacing) => (
			<SectionCell key={spacing} spacing={spacing} labels={labels} />
		))}
	</div>
);

/*
 * One stack per direction, each shown at a small and a large gap.
 *
 * A stack has no optics of its own: it arranges its children in a row or a column
 * and sets the gap between them. Both are shown with the same placeholder boxes,
 * so the direction reads from how the boxes line up and the gap from the distance
 * between them. The two gap steps are far enough apart to tell the dimension is
 * the gap and not a fixed distance.
 *
 * The boxes are neutral placeholders built from design tokens, not coloured
 * sample content: the stack is what is on show, so its children stay plain enough
 * not to compete with the arrangement they sit in.
 */
const StackCell = ({
	direction,
	gap,
	labels,
}: {
	direction: StackDirection;
	gap: StackGap;
	labels: OverviewLabels;
}): ReactElement => (
	<div className="overview-stack">
		{/*
		 * The caption names the direction and gap of the specimen below it. A small
		 * infotext without an icon is the design system's own quiet caption — the
		 * same one its stack examples use — so the size and the text colour come from
		 * the component rather than from a hand-set value.
		 */}
		<DBInfotext size="small" icon="none">
			{`${labels.stackDirections[direction]} · ${gap}`}
		</DBInfotext>
		<DBStack direction={direction} gap={gap}>
			{labels.stackItems.map((item) => (
				<span key={item} className="overview-placeholder">
					{item}
				</span>
			))}
		</DBStack>
	</div>
);

const StackOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(2)}>
		{STACK_DIRECTIONS.map((direction) =>
			STACK_GAPS.map((gap) => (
				<StackCell key={`${direction}-${gap}`} direction={direction} gap={gap} labels={labels} />
			)),
		)}
	</div>
);

/*
 * One field per cell, laid out as a two-column grid: the label variant is the
 * column — `above` on the left, `floating` on the right — and each state takes
 * one row, so the same state sits side by side across the two variants and reads
 * as a comparison. The specimens are emitted state by state, the `above` one
 * before the `floating` one, so the grid fills each row with the two variants of
 * one state. This is the same shape the input block has.
 *
 * The grid aligns its cells to the top of their row, so a field carrying a helper
 * or validation message — which is taller than one without — does not push the
 * other variant of the same state down: both keep their top edge on the row line.
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

const SelectOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{SELECT_VARIANTS.map((variant) =>
			SELECT_STATES.map((state) => (
				<SelectField key={`${variant}-${state}`} variant={variant} state={state} labels={labels} />
			)),
		)}
	</>
);

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

const SwitchOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{SIZES.map((size) => (
			<SwitchRow key={size} size={size} labels={labels} />
		))}
	</>
);

/*
 * One tab set per orientation, horizontal and vertical.
 *
 * Orientation is the dimension this block shows: it lays the tab list out as a
 * row or a column and switches the arrow keys that move between tabs. The tab
 * list, tab items and tab panels are the composition the component is built from
 * — documented as sub components, so they take no section of their own.
 *
 * Mounted in the browser. The component builds its selection in an effect: the
 * active tab's `aria-selected`, the `aria-controls`/`aria-labelledby` links
 * between tab and panel, the roving `tabindex` and the hiding of the inactive
 * panels are all set from script. Rendered alone it would show every panel at
 * once, with no tab marked selected and no keyboard support — so it has to run.
 *
 * Uncontrolled: the component owns the active tab and switches it on click and on
 * arrow keys by itself, which is the behaviour on show here. Each tab list
 * carries its own `label`, built from the orientation, so the two landmarks can
 * be told apart.
 */
const TabsCell = ({
	orientation,
	labels,
}: {
	orientation: TabsOrientation;
	labels: OverviewLabels;
}): ReactElement => (
	<DBTabs
		orientation={orientation}
		label={`${labels.tabsLabel} ${labels.tabsOrientations[orientation]}`}
	>
		<DBTabList>
			{labels.tabsItems.map((tab) => (
				<DBTabItem key={tab.label}>{tab.label}</DBTabItem>
			))}
		</DBTabList>
		{labels.tabsItems.map((tab) => (
			<DBTabPanel key={tab.label}>{tab.content}</DBTabPanel>
		))}
	</DBTabs>
);

const TabsOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{TABS_ORIENTATIONS.map((orientation) => (
			<TabsCell key={orientation} orientation={orientation} labels={labels} />
		))}
	</>
);

/*
 * One column per `behavior` property value, each holding its three content
 * variants — text, text with icon, icon only — stacked, weak first and strong
 * below. Columns by behavior and rows by content is the other way round from
 * the badge block, which rows by content and columns by nothing — a tag's
 * behavior changes how it can be used, not how it looks, so it is the
 * dimension worth reading across, see TagOverview.
 *
 * `removable` adds the remove button `onRemove` requires to do anything; without
 * a handler the button would render but do nothing when pressed.
 *
 * `noText` only hides the text visually, like the button's `noText` does — the
 * text stays the tag's accessible name, so no extra `aria-label` is needed here
 * the way the badge's dot and icon-only specimens need one. The icon itself is a
 * `string` property, not a `DBIcon` child, so none of the badge's content
 * questions apply. `star` names a tag's own purpose — marking something — rather
 * than standing for an unrelated action the way `plus` would.
 *
 * Static, not mounted: the tag renders everything shown here from its own
 * properties — no id link, no effect, no trigger.
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
					<DBTag behavior={behavior} emphasis={emphasis}>
						{labels.tagBehaviors[behavior]}
					</DBTag>
					<DBTag
						behavior={behavior}
						emphasis={emphasis}
						icon="star"
						onRemove={behavior === 'removable' ? () => undefined : undefined}
					>
						{labels.tagBehaviors[behavior]}
					</DBTag>
					<DBTag
						behavior={behavior}
						emphasis={emphasis}
						icon="star"
						noText
						onRemove={behavior === 'removable' ? () => undefined : undefined}
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
 *
 * Static, not mounted: both controls are natively interactive without any
 * script of their own.
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
						<DBTag emphasis={emphasis}>
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
 */
const TagOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(3)}>
		{TagBehaviorList.map((behavior) => (
			<TagColumn key={behavior} behavior={behavior} labels={labels} />
		))}
		<TagInteractiveColumn labels={labels} />
	</div>
);

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

const TextareaOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		{INPUT_VARIANTS.map((variant) => (
			<TextareaStates key={variant} variant={variant} labels={labels} />
		))}
	</>
);

/*
 * One trigger per placement, the same shape as the popover block and the same
 * reason: `placement` is the one dimension both components show their panel
 * along.
 *
 * Mounted, like the button block's own tooltip and the popover: the component
 * places its panel from script, and without that it stays absolutely
 * positioned below its trigger, where an ancestor with `overflow` can cut it
 * off — the same gap PopoverOverview documents, just for the sibling component
 * that shares the mechanism.
 */
const TooltipOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-row">
		{POPOVER_PLACEMENTS.map((placement) => (
			<DBButton key={placement} type="button" variant="filled">
				{labels.popoverPlacements[placement]}
				<DBTooltip placement={placement}>{labels.tooltipText}</DBTooltip>
			</DBButton>
		))}
	</div>
);

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
		case 'tag':
			return <TagOverview labels={labels} />;
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
			 * text (see F-4 in the bug audit). The button block holds a tooltip, which
			 * places itself from script and otherwise stretches the document. The
			 * loading indicator seeds its state in an effect and would stay at
			 * `inactive` throughout. The pagination writes the current page onto its
			 * markup from script and shows none without it. The popover and the tooltip
			 * both open through their trigger and place their panel from script.
			 * The textarea has the same `invalidMessage` gap as the input and the
			 * checkbox and switch above.
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
		case 'textarea':
			return <TextareaOverview labels={labels} />;
		case 'tooltip':
			return <TooltipOverview labels={labels} />;
		default:
			return <DrawerOverview labels={labels} />;
	}
}
