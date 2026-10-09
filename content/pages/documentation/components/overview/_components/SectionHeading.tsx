import { type ReactElement } from 'react';
import { DBCustomButton, DBCustomHeading } from '@db-ux/react-core-components';
import type { Language } from '@template/context/language-context';
import { componentPath } from '../_sections.ts';

/*
 * A component heading on the overview page, with a link to that component's own
 * documentation page next to it.
 *
 * The link is kept out of the heading's accessible name on purpose. DBCustomHeading
 * is a styling wrapper: its default slot takes the native heading, and `endSlot`
 * takes sibling content that sits next to the heading rather than inside it — so
 * the heading announces only the component name, while the arrow link is a
 * separate control. The native `<h2 id={id}>` stays the heading element: the id is
 * the table-of-contents and deep-link anchor contract (SECTION_HEADINGS depends on
 * it), so it must not move onto the wrapper or the link.
 *
 * The link is a DBCustomButton ghost icon button around a native `<a href>`, the
 * same nesting the component's own Interaction example uses for a button — a plain
 * anchor instead of a `<button>`, so it needs no JavaScript and navigates on this
 * server-rendered page. Icon-only (`noText`), so the accessible name comes from the
 * `aria-label` on the anchor; the anchor still carries its visible-but-hidden text
 * child, which `noText` hides, as the component expects. The corner follows the
 * v5/v6 version switch through the design system's own --db-border-radius-* tokens.
 */
export const SectionHeading = ({
	id,
	title,
	locale,
	base,
}: {
	id: string;
	title: string;
	locale: Language;
	/** Pass `import.meta.env.BASE_URL`; it already ends in a slash. */
	base: string;
}): ReactElement => {
	const href = componentPath(base, locale, id);
	const linkLabel =
		locale === 'de' ? `Zur Komponente ${title}` : `Go to ${title} component`;

	return (
		<DBCustomHeading
			className="overview-heading"
			endSlot={
				<DBCustomButton variant="ghost" icon="arrow_right" noText>
					<a href={href} aria-label={linkLabel}>
						{linkLabel}
					</a>
				</DBCustomButton>
			}
		>
			<h2 id={id}>{title}</h2>
		</DBCustomHeading>
	);
};
