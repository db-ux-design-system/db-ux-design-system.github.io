import { useState } from 'react';
import { DBButton, DBTooltip } from '@db-ux/react-core-components';
import type { Lang } from '@template/components/GetStartedWizard/wizard-flow';
import { addItem, removeItem, useReadingList } from './reading-list-store';
import { readingListTexts } from './texts';

type Props = {
	lang: Lang;
	/** Reading list id of the page, see pageId in reading-list-items.ts. */
	id: string;
	/** Page title per language. A language is missing when the page has no version in it. */
	title: { en?: string; de?: string };
};

/**
 * Bookmark button right after the page headline: adds the page to the reading list
 * or removes it. Shown on pages with `readingList: true` in the frontmatter.
 *
 * Icon-only with a tooltip, like the other icon buttons of the site. The label names
 * the action, so it changes with the state; the status region announces the change,
 * because a label change on the focused button is not announced reliably.
 */
const ReadingListToggle = ({ lang, id, title }: Props) => {
	const text = readingListTexts[lang];
	const list = useReadingList();
	const saved = list.items.some((item) => item.id === id);
	const [status, setStatus] = useState('');
	const label = saved ? text.removeCurrent : text.add;

	const toggle = () => {
		if (saved) {
			removeItem(id);
			setStatus(text.removedCurrent);
		} else {
			addItem({ id, title, source: 'bookmark' });
			setStatus(text.added);
		}
	};

	return (
		<div className="rl-toggle">
			<DBButton
				type="button"
				variant="ghost"
				icon="bookmark"
				noText
				// Filled while the page is on the list. The DB icon font has no separate
				// bookmark_filled glyph (it renders the outline), and with Core v5
				// data-icon-variant="filled" selects the whitelabel font, not the DB one.
				// "db-filled" selects the filled DB font directly.
				data-icon-variant={saved ? 'db-filled' : undefined}
				onClick={toggle}
			>
				{label}
				<DBTooltip>{label}</DBTooltip>
			</DBButton>
			<span role="status" data-visually-hidden="true">
				{status}
			</span>
		</div>
	);
};

export default ReadingListToggle;
