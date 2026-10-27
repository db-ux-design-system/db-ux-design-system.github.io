import { useEffect, useRef, useState } from 'react';
import { DBButton, DBNotification, DBTooltip } from '@db-ux/react-core-components';
import { useOverlayTop } from '@template/utils/overlay-top';
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
 * While the page is on the list, a notification asks whether the reader has finished
 * it and offers to remove it: in the article view when they scroll to the end of the
 * content, in the stepper view when they click through to the last step. It asks once
 * per page visit. A page that fits without scrolling never asks, as nobody scrolled to
 * its end.
 *
 * Not a modal dialog: that took the focus and pulled the reader out of the text. The
 * notification is an overlay below the control panel, like the hint on the wizard
 * result. It takes no focus and stays until it is closed or the page is removed, so
 * nobody misses the action (no time limit, WCAG 2.2.1). Screen readers hear it through
 * the status region of the button, without moving the reading cursor.
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

	useOverlayTop('--rl-finished-top');

	// Announced through the status region; the notification itself has no live role,
	// so it is not read twice.
	useEffect(() => {
		if (askFinished) setStatus(`${text.finishedTitle} ${text.finishedText}`);
	}, [askFinished]);

	// Removed in another way (bookmark button, reading list): nothing left to ask.
	const showFinished = askFinished && saved;

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
			{showFinished && (
				<DBNotification
					className="rl-finished"
					variant="overlay"
					semantic="informational"
					// Informational renders role="status", a live region. The status
					// region of the button announces it already; "off" renders a plain
					// article, so it is not read twice.
					ariaLive="off"
					headline={text.finishedTitle}
					// Same bookmark as in the header, filled: the page is on the list.
					icon="bookmark"
					data-icon-variant="db-filled"
					closeable
					closeButtonText={text.finishedClose}
					onClose={() => setAskFinished(false)}
				>
					<p className="rl-finished-text">{text.finishedText}</p>
					<DBButton type="button" variant="brand" size="small" onClick={removeFinished}>
						{text.removeCurrent}
					</DBButton>
				</DBNotification>
			)}
		</div>
	);
};

export default ReadingListToggle;
