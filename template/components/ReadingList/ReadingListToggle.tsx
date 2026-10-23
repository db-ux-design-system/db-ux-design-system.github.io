import { useEffect, useRef, useState } from 'react';
import {
	DBButton,
	DBDialog,
	DBDialogFooter,
	DBDialogHeader,
	DBTooltip,
} from '@db-ux/react-core-components';
import type { Lang } from '@template/components/GetStartedWizard/wizard-flow';
import { LEARN_STEP_EVENT } from '@template/components/Learn/learn-controller';
import { addItem, removeItem, useReadingList } from './reading-list-store';
import { readingListTexts } from './texts';

type Props = {
	lang: Lang;
	/** Reading list id of the page, see pageId in reading-list-items.ts. */
	id: string;
	/** Page title per language. A language is missing when the page has no version in it. */
	title: { en?: string; de?: string };
};

/** The content of the page; the reader has finished it when its end is in view. */
const CONTENT_SELECTOR = '#main-content-section';
/** Tolerance in px, so rounding at the very end still counts as reached. */
const END_TOLERANCE = 4;

/**
 * True when the end of the page content is visible. The page scrolls inside the
 * shell content, so its bottom edge is the visible end; without the shell it is
 * the window.
 */
function contentEndInView(): boolean {
	const content = document.querySelector<HTMLElement>(CONTENT_SELECTOR);
	if (!content) return false;
	const shell = document.querySelector<HTMLElement>('.db-shell-content');
	const viewportEnd = shell ? shell.getBoundingClientRect().bottom : window.innerHeight;
	return content.getBoundingClientRect().bottom <= viewportEnd + END_TOLERANCE;
}

/**
 * Bookmark button right after the page headline: adds the page to the reading list
 * or removes it. Shown on pages with `readingList: true` in the frontmatter.
 *
 * Icon-only with a tooltip, like the other icon buttons of the site. The label names
 * the action, so it changes with the state; the status region announces the change,
 * because a label change on the focused button is not announced reliably.
 *
 * While the page is on the list, a dialog asks whether the reader has finished it and
 * wants to remove it: in the article view when they scroll to the end of the content,
 * in the stepper view when they click through to the last step. It asks once per page
 * visit. A page that fits without scrolling never asks, as nobody scrolled to its end.
 */
const ReadingListToggle = ({ lang, id, title }: Props) => {
	const text = readingListTexts[lang];
	const list = useReadingList();
	const saved = list.items.some((item) => item.id === id);
	const [status, setStatus] = useState('');
	const [askFinished, setAskFinished] = useState(false);
	const label = saved ? text.removeCurrent : text.add;

	// Read inside the listeners, which are attached once.
	const savedRef = useRef(saved);
	savedRef.current = saved;
	const askedRef = useRef(false);

	useEffect(() => {
		const ask = () => {
			if (askedRef.current || !savedRef.current) return;
			askedRef.current = true;
			setAskFinished(true);
		};

		// Article view: the end of the content scrolled into view. The scroll event does
		// not bubble, so it is caught in the capture phase from the shell content. In the
		// stepper view the step always fits between hero and navigation, so its end is
		// always in view; there the last step counts instead.
		let frame = 0;
		const onScroll = () => {
			if (frame) return;
			frame = window.requestAnimationFrame(() => {
				frame = 0;
				if (document.documentElement.dataset.learnView === 'stepper') return;
				if (contentEndInView()) ask();
			});
		};

		// Stepper view: clicked through to the last step.
		const onStep = (event: Event) => {
			const { index, total } = (event as CustomEvent<{ index: number; total: number }>).detail;
			if (index === total - 1) ask();
		};

		document.addEventListener('scroll', onScroll, { capture: true, passive: true });
		window.addEventListener(LEARN_STEP_EVENT, onStep);
		return () => {
			window.cancelAnimationFrame(frame);
			document.removeEventListener('scroll', onScroll, { capture: true });
			window.removeEventListener(LEARN_STEP_EVENT, onStep);
		};
	}, []);

	const toggle = () => {
		if (saved) {
			removeItem(id);
			setStatus(text.removedCurrent);
		} else {
			addItem({ id, title, source: 'bookmark' });
			setStatus(text.added);
		}
	};

	const removeFinished = () => {
		removeItem(id);
		setStatus(text.removedCurrent);
		setAskFinished(false);
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
			{/* Modal: Escape, the close button and the backdrop keep the page on the list.
			    onClose mirrors these back into the state. */}
			<DBDialog
				open={askFinished}
				onClose={() => setAskFinished(false)}
				header={<DBDialogHeader closeButtonText={text.finishedClose} text={text.finishedTitle} />}
				footer={
					<DBDialogFooter>
						<DBButton type="button" variant="ghost" onClick={() => setAskFinished(false)}>
							{text.finishedKeep}
						</DBButton>
						<DBButton type="button" variant="brand" onClick={removeFinished}>
							{text.removeCurrent}
						</DBButton>
					</DBDialogFooter>
				}
			>
				{text.finishedText}
			</DBDialog>
		</div>
	);
};

export default ReadingListToggle;
