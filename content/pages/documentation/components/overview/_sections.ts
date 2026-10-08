import type { OverviewComponent } from './_ComponentOverview.tsx';

/**
 * One section of the Component Overview page: a heading and the specimen set
 * below it.
 *
 * The EN and DE pages both build their table of contents and their markup from
 * this list, so the two cannot drift apart. An `.astro` page has no heading
 * autogeneration, which the MDX version relied on, so the anchors have to come
 * from somewhere explicit.
 */
export type OverviewSection = {
	/**
	 * Heading anchor. Matches the slug the MDX version generated from the heading
	 * text via github-slugger, so deep links into the page keep working. Kept
	 * separate from `component` on purpose: the id is a URL contract, the
	 * component key is not, so renaming one must not silently move the other.
	 */
	id: string;
	/**
	 * Heading text. These are component names, which are not translated — the
	 * German page used the same strings — so one field serves both languages.
	 */
	title: string;
	/** The specimen set rendered below the heading. */
	component: OverviewComponent;
};

/** Ordered as the page lists them: alphabetically by component name. */
export const SECTIONS: OverviewSection[] = [
	{ id: 'accordion', title: 'Accordion', component: 'accordion' },
	{ id: 'backdrop', title: 'Backdrop', component: 'backdrop' },
	{ id: 'badge', title: 'Badge', component: 'badge' },
	{ id: 'button', title: 'Button', component: 'button' },
	{ id: 'card', title: 'Card', component: 'card' },
	{ id: 'checkbox', title: 'Checkbox', component: 'checkbox' },
	{ id: 'custom-select', title: 'Custom Select', component: 'custom-select' },
	{ id: 'dialog', title: 'Dialog', component: 'dialog' },
	{ id: 'divider', title: 'Divider', component: 'divider' },
	{ id: 'drawer', title: 'Drawer', component: 'drawer' },
	{ id: 'footer', title: 'Footer', component: 'footer' },
	{ id: 'heading', title: 'Heading', component: 'heading' },
	{ id: 'infotext', title: 'Infotext', component: 'infotext' },
	{ id: 'input', title: 'Input', component: 'input' },
	{ id: 'link', title: 'Link', component: 'link' },
	{ id: 'loading-indicator', title: 'Loading Indicator', component: 'loading-indicator' },
	{ id: 'notification', title: 'Notification', component: 'notification' },
	{ id: 'pagination', title: 'Pagination', component: 'pagination' },
	{ id: 'popover', title: 'Popover', component: 'popover' },
	{ id: 'radio', title: 'Radio', component: 'radio' },
	{ id: 'section', title: 'Section', component: 'section' },
	{ id: 'select', title: 'Select', component: 'select' },
	{ id: 'stack', title: 'Stack', component: 'stack' },
	{ id: 'switch', title: 'Switch', component: 'switch' },
	{ id: 'tabs', title: 'Tabs', component: 'tabs' },
	{ id: 'tag', title: 'Tag', component: 'tag' },
	{ id: 'textarea', title: 'Textarea', component: 'textarea' },
	{ id: 'tooltip', title: 'Tooltip', component: 'tooltip' },
];

/** Table-of-contents entries for the page, one per section. */
export const SECTION_HEADINGS = SECTIONS.map(({ id, title }) => ({
	depth: 2,
	slug: id,
	text: title,
}));
