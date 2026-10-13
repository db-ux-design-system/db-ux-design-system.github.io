import { type CSSProperties } from 'react';
import type { TagBehaviorType } from '@db-ux/react-core-components';
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

export const SEMANTICS = [
	'adaptive',
	'neutral',
	'informational',
	'successful',
	'warning',
	'critical',
] as const;

/** Ordered by decreasing visual weight rather than by the order in ButtonVariantList. */
export const BUTTON_VARIANTS = ['brand', 'filled', 'outlined', 'ghost'] as const;

export const SIZES = ['medium', 'small'] as const;
export const CARD_LEVELS = ['1', '2', '3'] as const;

/** Both emphasis steps a divider offers, weakest first. */
export const DIVIDER_EMPHASIS = [undefined, 'strong'] as const;

/*
 * Every direction a drawer can open from, and both corner states. The plain state
 * comes first, so it is the row that stays when the rounded one drops out in v6.
 */
export const DRAWER_DIRECTIONS = ['to-right', 'to-left', 'up', 'down'] as const;
export const DRAWER_ROUNDED = [false, true] as const;

export type DrawerDirection = (typeof DRAWER_DIRECTIONS)[number];

/*
 * The full visual size scale of a heading, largest first. This is the one scale
 * the component has: the semantic level only maps to a default size, which `size`
 * then overrides.
 */
export const HEADING_SIZES = ['3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs', '2xs', '3xs'] as const;

/** The semantic levels, largest first. */
export const HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

export type HeadingSize = (typeof HEADING_SIZES)[number];
export type HeadingLevel = (typeof HEADING_LEVELS)[number];

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
export const HEADING_LEVEL_SIZES: Record<HeadingLevel, HeadingSize> = {
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
export const HEADING_SIZE_LEVELS: Partial<Record<HeadingSize, HeadingLevel>> = Object.fromEntries(
	HEADING_LEVELS.map((level) => [HEADING_LEVEL_SIZES[level], level]),
);

/** Both font weights a heading offers today. `black` is its default. */
export const HEADING_FONT_WEIGHTS = ['black', 'light'] as const;

export type HeadingFontWeight = (typeof HEADING_FONT_WEIGHTS)[number];

/*
 * The font weights per level row, as data rather than as markup: H1 and H2 are to
 * carry the Wide ExtraBlack weight of the coming brand generation as a third
 * entry, and neither the component nor the theme offers it yet. Adding it is a
 * change to this list.
 */
export const HEADING_LEVEL_FONT_WEIGHTS: Record<HeadingLevel, readonly HeadingFontWeight[]> = {
	h1: HEADING_FONT_WEIGHTS,
	h2: HEADING_FONT_WEIGHTS,
	h3: HEADING_FONT_WEIGHTS,
	h4: HEADING_FONT_WEIGHTS,
	h5: HEADING_FONT_WEIGHTS,
	h6: HEADING_FONT_WEIGHTS,
};

export type LinkSpecimen = 'adaptive' | 'adaptiveExternal' | 'brand' | 'brandExternal' | 'inline';

/*
 * The link specimens per size column. `adaptive` and `brand` appear twice, once
 * with each arrow. `inline` appears once: it drops the arrow altogether, so a
 * second entry for the external one would repeat the same link.
 */
export const LINK_SPECIMENS: {
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
export const INPUT_VARIANTS = ['above', 'floating'] as const;

/*
 * The sizes a loading indicator offers. One more than the shared size scale:
 * `large` only exists on this component, which is why the list is written out
 * here instead of reusing SIZES.
 */
export const LOADING_INDICATOR_SIZES = ['small', 'medium', 'large'] as const;

/*
 * The states after the load itself, without `active`. `active` is the state the
 * size specimens already show, and `inactive` opens the list because it is the
 * bare track every other state fills.
 */
export const LOADING_INDICATOR_RESULTS = ['inactive', 'successful', 'critical'] as const;

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
export const LOADING_INDICATOR_COLUMNS = [
	{ variant: 'circular', orientation: 'vertical' },
	{ variant: 'circular', orientation: 'horizontal' },
	{ variant: 'bar', orientation: 'horizontal' },
] as const;

export type LoadingIndicatorSize = (typeof LOADING_INDICATOR_SIZES)[number];
export type LoadingIndicatorResult = (typeof LOADING_INDICATOR_RESULTS)[number];

/*
 * Every notification variant, in the order the component documents them.
 * `docked` is the default and sits between header and content, `standalone` goes
 * into a form, `overlay` floats as a snackbar.
 */
export const NOTIFICATION_VARIANTS = ['docked', 'standalone', 'overlay'] as const;

export type NotificationVariant = (typeof NOTIFICATION_VARIANTS)[number];

/*
 * The four main placements of a popover. The component also accepts a `-start`
 * and `-end` modifier for each, which only shifts the panel along the trigger's
 * edge — twelve triggers for four distinguishable positions.
 */
export const POPOVER_PLACEMENTS = ['bottom', 'top', 'left', 'right'] as const;

export type PopoverPlacement = (typeof POPOVER_PLACEMENTS)[number];

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
export type RadioState = 'default' | 'checked' | 'required';

export const RADIO_STATES: {
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
export const SECTION_SPACINGS = ['large', 'medium', 'small'] as const;

export type SectionSpacing = (typeof SECTION_SPACINGS)[number];

/*
 * Both directions a stack lays its items out in, column first because it is the
 * component's default. Each is shown at two gap steps, so the gap reads as the
 * dimension it is rather than as a fixed distance — a small step and a large one,
 * far enough apart to tell at a glance.
 */
export const STACK_DIRECTIONS = ['column', 'row'] as const;
export const STACK_GAPS = ['small', 'large'] as const;

export type StackDirection = (typeof STACK_DIRECTIONS)[number];
export type StackGap = (typeof STACK_GAPS)[number];

/*
 * Both label variants of a native select, `above` first because it is the
 * default. The variants are the two rows of the block — `above` first,
 * `floating` second — and the states run across each row as its three columns,
 * so the same state can be read across the variants, see SelectOverview.
 */
export const SELECT_VARIANTS = ['above', 'floating'] as const;

export type SelectVariant = (typeof SELECT_VARIANTS)[number];

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
export type SelectState = 'helper' | 'invalid' | 'valid';

export const SELECT_STATES = ['helper', 'invalid', 'valid'] as const satisfies readonly SelectState[];

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
export type SwitchState = 'default' | 'checked' | 'invalid' | 'valid';

export const SWITCH_STATES: {
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
export const SWITCH_VARIANTS = ['trailing', 'leading'] as const;

export type SwitchVariant = (typeof SWITCH_VARIANTS)[number];

/*
 * Both orientations of a tab set, horizontal first because it is the one most
 * tabs use. Orientation is the dimension this block shows: it changes the layout
 * of the tab list and the arrow keys that move between tabs. These name the
 * `orientation` values, which are not translated.
 */
export const TABS_ORIENTATIONS = ['horizontal', 'vertical'] as const;

export type TabsOrientation = (typeof TABS_ORIENTATIONS)[number];

export type Size = (typeof SIZES)[number];
export type Semantic = (typeof SEMANTICS)[number];

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
	| 'tag'
	| 'textarea'
	| 'tooltip';

/*
 * The options a multi select specimen starts with. Two of three, so a counted
 * selection reads as a number and a selection shown as tags has more than one.
 * The values follow the option values built in CustomSelectOverview.
 */
export const PRESELECTED = ['option-1', 'option-2'];

export interface OverviewLabels {
	accordionItems: { headlinePlain: string; text: string }[];
	/*
	 * This page's own URL, in this language. Every `href="#"` this page would
	 * otherwise need — the Link and Footer specimens — points here instead, so
	 * a click lands back on this same page rather than at the top of it with no
	 * destination. Not translated as such, but language-specific: the EN and DE
	 * pages live at different paths.
	 */
	selfUrl: string;
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
	/*
	 * The three remaining texts a custom select has an English default for.
	 * `clearSelection` names the button that drops the whole selection,
	 * `mobileClose` the close button of the dropdown on small viewports, and
	 * `selected` is the word a counted selection is built from, see
	 * CustomSelectOverview.
	 */
	customSelectClearSelection: string;
	customSelectMobileClose: string;
	customSelectSelected: string;
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
	 * translated, so both languages carry the same text. The row texts are
	 * composed from these, see HeadingRow.
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
	/** One per tag column, naming what the column's `behavior` value does. */
	tagBehaviors: Record<TagBehaviorType, string>;
	/*
	 * The accessible name of a removable tag's remove button, passed as
	 * `removeButton`. Without it the component falls back to its own built-in
	 * English default, which would stay English on the German page.
	 */
	tagRemove: string;
	/*
	 * The labels of the two controls the interactive column wraps in a tag.
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
export const LABELS: Record<Language, OverviewLabels> = {
	de: {
		selfUrl: '/de/dokumentation/komponenten/uebersicht',
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
		customSelectClearSelection: 'Auswahl aufheben',
		customSelectMobileClose: 'Schließen',
		customSelectSelected: 'ausgewählt',
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
		tagRemove: 'Entfernen',
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
		selfUrl: '/documentation/components/overview',
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
		customSelectClearSelection: 'Clear selection',
		customSelectMobileClose: 'Close',
		customSelectSelected: 'selected',
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
		tagRemove: 'Remove',
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
 * in place before the mount. A value of 1 means the specimen lays its own rows
 * out inside a single full-width column.
 */
export const MOUNT_COLUMNS: Record<MountedComponent, number> = {
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
	/* One full-width row per size, holding that size's four states side by side. */
	switch: 1,
	/* Both orientations side by side, which is the dimension of this block. */
	tabs: 2,
	/* One column per behavior, see TagOverview. */
	tag: 3,
	/* Four states per label variant, so each variant fills one row, like input. */
	textarea: 4,
	/* One row of triggers, as wide as the placements it covers. */
	tooltip: 1,
};

/*
 * The mounted specimens whose columns stay as wide as their content: rows of
 * small controls and triggers. Form fields are left out — they fill the column
 * they sit in, as they do in a real form — that covers the custom select along
 * with input, select, checkbox, switch and textarea. The loading indicator is
 * left out too: its bar variant is `inline-size: 100%` and needs a column with
 * a width, and so are the tabs, whose tab list fills the column it sits in. The
 * tag is left out because its columns are stacks, not rows of controls.
 */
export const MOUNT_FIT_CONTENT: MountedComponent[] = [
	'button',
	'dialog',
	'drawer',
	'pagination',
	'popover',
	'tooltip',
];

/** Sets the column count the grid reads from --overview-columns. */
export const columns = (count: number): CSSProperties =>
	({ '--overview-columns': count }) as CSSProperties;
