import { type CSSProperties, type FormEvent, useEffect, useRef, useState } from 'react';
import { DBButton, DBCard, DBHeadingH2, DBNotification } from '@db-ux/react-core-components';
import {
	addWizardResult,
	useReadingList,
} from '@template/components/ReadingList/reading-list-store';
import { hasSeenSavedHint, markSavedHintSeen } from './saved-hint';
import { toReadingListId } from '@template/components/ReadingList/reading-list-items';
import { readingListTexts } from '@template/components/ReadingList/texts';
import {
	type Answers,
	type Lang,
	type QuestionId,
	askedQuestions,
	next,
	questions,
	roleColor,
	roleColors,
	toHref,
} from './wizard-flow';
// Styles: GetStartedWizard.css is imported by the .astro pages that render this island,
// ReadingList.css by global.css. Imported here, they only arrived with the
// client-only island and were missing after client-side navigation until a reload.

/** How long the hint about the reading list stays once it has been seen before. */
const HINT_SECONDS = 8;

const ui = {
	en: {
		next: 'Next',
		back: 'Back',
		restart: 'Start again',
		open: 'Open',
		start: 'Start learning package',
		resultTitle: 'Your next steps',
	},
	de: {
		next: 'Weiter',
		back: 'Zurück',
		restart: 'Neu starten',
		open: 'Öffnen',
		start: 'Lernpaket starten',
		resultTitle: 'Deine nächsten Schritte',
	},
} as const;

/** Reads the answers from the query string and drops anything off the valid path. */
function readAnswers(): Answers {
	const params = new URLSearchParams(window.location.search);
	const raw: Answers = {};
	for (const id of Object.keys(questions) as QuestionId[]) {
		const value = params.get(id);
		if (value && questions[id].options.some((option) => option.id === value)) raw[id] = value;
	}
	const valid: Answers = {};
	for (const id of askedQuestions(raw)) valid[id] = raw[id];
	return valid;
}

/**
 * Keeps the answers in the URL, so the browser back button and shared links work.
 * The new entry gets a copy of the ClientRouter state (index, scroll position):
 * ClientRouter ignores entries without state, so Back from another page to a step
 * only changed the URL and kept the other page on screen. All steps share the index
 * of the page entry, which keeps the router's back/forward detection right.
 */
function writeAnswers(answers: Answers) {
	const params = new URLSearchParams();
	for (const id of askedQuestions(answers)) params.set(id, answers[id]!);
	const query = params.toString();
	window.history.pushState(
		window.history.state,
		'',
		`${window.location.pathname}${query ? `?${query}` : ''}`,
	);
}

/**
 * Get Started as a step-by-step wizard: one question per view, a result at the end.
 * The decision tree lives in wizard-flow.ts. Links can preselect answers through the
 * query string, e.g. `?role=design`.
 */
const GetStartedWizard = ({ lang = 'en' }: { lang?: Lang }) => {
	const text = ui[lang];
	// The island is client:only, so the query string can be read in the first render.
	// A deep link then paints the right step at once, without the role step first.
	const [answers, setAnswers] = useState<Answers>(readAnswers);
	const [selection, setSelection] = useState<string | undefined>();
	// The hint about the reading list. The first result ever keeps it open until it is
	// closed, every later one hides it after HINT_SECONDS. Read before the first
	// result marks it as seen.
	const [savedOpen, setSavedOpen] = useState(true);
	const hintSeen = useRef<boolean | undefined>(undefined);
	hintSeen.current ??= hasSeenSavedHint();
	// Hover and focus stop the countdown, so the hint cannot disappear while it is
	// being read. The rest of the time is kept, the countdown does not start over.
	const [hintPaused, setHintPaused] = useState(false);
	const hintLeft = useRef(HINT_SECONDS * 1000);
	const headingRef = useRef<HTMLHeadingElement>(null);
	// Focus only moves after a user action, not on the initial page load.
	const moveFocus = useRef(false);
	// Set by "Next", read by the effect that adds the result to the reading list.
	const submitted = useRef(false);

	useEffect(() => {
		const { pathname } = window.location;
		const onPopState = (event: PopStateEvent) => {
			// An entry of another page: ClientRouter swaps the page.
			if (window.location.pathname !== pathname) return;
			// A step of this wizard: the wizard re-renders itself. The steps carry the
			// ClientRouter state, so the router would otherwise fetch and swap the whole
			// page. Registered in the capture phase, this runs before the router's
			// listener on window and can stop it.
			event.stopImmediatePropagation();
			moveFocus.current = true;
			const nextAnswers = readAnswers();
			// Going Back drops the last answer from the URL: the step now shown is the
			// first id that is no longer answered. Preselect its previous value from the
			// current answers, like the wizard's own Back button, so the choice stays.
			setSelection((previous) => {
				const back = next(nextAnswers);
				return 'question' in back ? (answers[back.question.id] ?? previous) : undefined;
			});
			setAnswers(nextAnswers);
		};
		window.addEventListener('popstate', onPopState, { capture: true });
		return () => window.removeEventListener('popstate', onPopState, { capture: true });
		// `answers` is read in the handler to recover the preselection; re-register so
		// the closure sees the current answers.
	}, [answers]);

	// The overlay notification hangs below the control panel. Its height is not
	// available as a token, and the control panel is outside this island, so the lower
	// edge of the visible panel is measured and handed to the CSS. Desktop and mobile
	// panel are both in the DOM, only one of them has a size.
	useEffect(() => {
		const panels = [
			...document.querySelectorAll<HTMLElement>(
				'.db-control-panel-desktop, .db-control-panel-mobile',
			),
		];
		if (panels.length === 0) return;
		const update = () => {
			const visible = panels.find((panel) => panel.getBoundingClientRect().height > 0);
			const bottom = visible?.getBoundingClientRect().bottom ?? 0;
			document.documentElement.style.setProperty('--gsw-saved-top', `${Math.max(bottom, 0)}px`);
		};
		update();
		const observer = new ResizeObserver(update);
		for (const panel of panels) observer.observe(panel);
		return () => {
			observer.disconnect();
			document.documentElement.style.removeProperty('--gsw-saved-top');
		};
	}, []);

	const step = next(answers);
	const asked = askedQuestions(answers);
	const hasResult = 'result' in step;

	// Seen as soon as a result put the hint on screen, no matter how it ends.
	// Every further result in the same visit (e.g. after "Start again") shows the hint
	// again: closed or timed out before, it would otherwise stay hidden for good. It is
	// a later result, so it counts down from the full time.
	const resultShown = useRef(false);
	useEffect(() => {
		if (!hasResult) return;
		markSavedHintSeen();
		if (resultShown.current) {
			hintSeen.current = true;
			hintLeft.current = HINT_SECONDS * 1000;
			setSavedOpen(true);
		}
		resultShown.current = true;
	}, [hasResult]);

	// Countdown of the hint, only from the second time on. Paused while the pointer or
	// the focus is on it; the cleanup keeps the rest of the time.
	useEffect(() => {
		if (!hasResult || !hintSeen.current || !savedOpen || hintPaused) return;
		const startedAt = Date.now();
		const timer = window.setTimeout(() => setSavedOpen(false), hintLeft.current);
		return () => {
			window.clearTimeout(timer);
			hintLeft.current = Math.max(hintLeft.current - (Date.now() - startedAt), 0);
		};
	}, [hasResult, savedOpen, hintPaused]);

	useEffect(() => {
		if (moveFocus.current) headingRef.current?.focus();
		moveFocus.current = false;
	}, [answers]);

	// Adds the result pages to the reading list once a result is reached, also from a
	// shared link. Keyed on the answers only, and the store skips the result it added
	// last: pages deleted from the list are not added again while the result stays on
	// screen or after a reload.
	// Reaching the result with "Next" is a deliberate run: its pages are added even if
	// the same result was added before and its pages were deleted since.
	const answersKey = asked.map((id) => `${id}=${answers[id]}`).join('&');
	useEffect(() => {
		if ('result' in step) {
			addWizardResult(answersKey, step.result.items.map(toReadingListId), submitted.current);
		}
		submitted.current = false;
		// step and answers follow answersKey.
	}, [answersKey]);

	const readingList = useReadingList();
	const resultIds = 'result' in step ? step.result.items.map(toReadingListId) : [];
	const resultOnList = readingList.items.some((item) => resultIds.includes(item.id));

	const update = (nextAnswers: Answers, nextSelection?: string) => {
		moveFocus.current = true;
		setSelection(nextSelection);
		setAnswers(nextAnswers);
		writeAnswers(nextAnswers);
	};

	const goBack = () => {
		const last = asked.at(-1);
		if (!last) return;
		const { [last]: previous, ...rest } = answers;
		// Preselect the previous answer so going back and forth keeps the choice.
		update(rest, previous);
	};

	const restart = () => update({});

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();
		if (!('question' in step)) return;
		const value = selection ?? answers[step.question.id];
		if (value) {
			submitted.current = true;
			update({ ...answers, [step.question.id]: value });
		}
	};

	if ('result' in step) {
		const { result } = step;
		const rlText = readingListTexts[lang];
		return (
			<section className="gsw" aria-labelledby="gsw-heading">
				{/* Headline and intro as on the page hero of other pages: tight gap. */}
				<div className="gsw-hero">
					<h1 id="gsw-heading" className="gsw-heading" ref={headingRef} tabIndex={-1}>
						{text.resultTitle}
					</h1>
					<p className="gsw-result-intro">{rlText.intro}</p>
				</div>
				{/* One item per page, each standing on its own: no frame around the list and
				    no dividers, every item carries a 2 px line on its start side in the
				    color of the chosen role (emphasis 70). Text on the start side, the arrow
				    to the page on the end side. */}
				<ol
					className="gsw-package-list"
					// Not data-color: that attribute also tints the background and the text of
					// everything inside. Only the line needs the color, so the role color is
					// handed over as a custom property.
					style={
						{
							'--gsw-role-color': `var(--db-${roleColor(answers)}-on-bg-basic-emphasis-70-default)`,
						} as CSSProperties
					}
				>
					{result.items.map((item) => (
						<li key={item.id} className="gsw-package-item">
							<div className="gsw-package-text">
								{/* Font one step below the h1, set in the CSS: DBHeading has no
										    size property. */}
								<DBHeadingH2>{item.label[lang]}</DBHeadingH2>
								<p className="gsw-package-description">{item.description[lang]}</p>
							</div>
							{/* Arrow only: the headline next to it says where it goes, and the
								    package has one call to action above the list. data-no-text sets
								    the font size to 0, so the name comes from the aria-label. */}
							<a
								className="db-button gsw-package-button"
								data-variant="ghost"
								data-icon="arrow_right"
								data-no-text="true"
								href={toHref(item, lang)}
								aria-label={`${text.open}: ${item.label[lang]}`}
							>
								{text.open}
							</a>
						</li>
					))}
				</ol>
				{/* Below the list: starting over on the start side, the call to action for
				    the whole package on the end side. It opens the first page until the
				    walkthrough across all pages exists. No Back button here: from the
				    result the way on is the package or a new start, and the browser Back
				    still steps to the last question. */}
				<div className="gsw-actions">
					<DBButton type="button" variant="ghost" onClick={restart}>
						{text.restart}
					</DBButton>
					<a
						className="db-button gsw-start"
						data-variant="brand"
						// Arrow after the label: data-icon-trailing carries the icon name,
						// data-icon would put it in front of the label.
						data-icon-trailing="arrow_right"
						href={toHref(result.items[0], lang)}
					>
						{text.start}
					</a>
				</div>
				{/* The pages are added to the reading list automatically, so the hint is an
				    overlay notification below the control panel instead of a block in the
				    page: it belongs to the reading list button up there, not to the list of
				    pages. It stays until it is closed. Only shown while pages of this result are
				    on the list, so it never claims a save that did not happen. */}
				{savedOpen && resultOnList && (
					<DBNotification
						className="gsw-saved"
						variant="overlay"
						semantic="informational"
						headline={rlText.savedTitle}
						// Custom icon instead of the icon of the semantic: the same bookmark as
						// the button in the header, filled like there, because the list is never
						// empty at this point.
						icon="bookmark"
						data-icon-variant="db-filled"
						closeable
						onClose={() => setSavedOpen(false)}
						// Stops the countdown while it is read or operated.
						onMouseEnter={() => setHintPaused(true)}
						onMouseLeave={() => setHintPaused(false)}
						onFocusCapture={() => setHintPaused(true)}
						onBlurCapture={() => setHintPaused(false)}
					>
						{rlText.saved}
					</DBNotification>
				)}
			</section>
		);
	}

	const { question } = step;
	const current = selection ?? answers[question.id];

	// The color of the chosen path. On the role step it follows the option the user is
	// about to pick; every later step keeps the color of the already chosen role.
	const colorFor = (optionId: string) =>
		question.id === 'role' ? roleColors[optionId] : roleColor(answers);

	// Headline font of the option labels: sm for the role tiles and short lists, xs for
	// lists with more than 5 options.
	const labelSize = question.options.length > 5 ? 'xs' : 'sm';

	return (
		<form className="gsw" onSubmit={onSubmit}>
			<fieldset className="gsw-fieldset">
				<legend className="gsw-legend">
					<h1 className="gsw-heading" ref={headingRef} tabIndex={-1}>
						{question.title[lang]}
					</h1>
				</legend>
				<div className="gsw-options">
					{question.options.map((option) => {
						const checked = current === option.id;
						// Role tiles show their role color until one is picked; then only
						// the picked tile keeps it and the others turn neutral.
						const tinted = checked || (question.id === 'role' && !current);
						const id = `gsw-${question.id}-${option.id}`;
						return (
							// Card spacing="large" on every step. DBCard
							// renders a div, which may not sit inside a label, so the radio
							// gets its name through aria-labelledby and a click anywhere on
							// the card selects it.
							<DBCard
								key={option.id}
								behavior="interactive"
								spacing="large"
								className="gsw-option"
								// A tinted card moves up one background level, in the color of the
								// role.
								elevationLevel={tinted ? '3' : undefined}
								data-color={tinted ? colorFor(option.id) : undefined}
								onClick={(event) => {
									// A click on the selected card clears the selection again.
									setSelection(checked ? undefined : option.id);
									// A click on the card is not a click on a label, so the radio
									// does not get the focus by itself. Without this, the focus and
									// the arrow-key position stay on another card. focusVisible:
									// false keeps the focus ring off after a mouse click, like a
									// native label click; arrow keys bring it back.
									event.currentTarget
										.querySelector<HTMLInputElement>('input')
										?.focus({ preventScroll: true, focusVisible: false });
								}}
							>
								<input
									// The card shows the selection itself. The radio stays in the
									// accessibility tree and keyboard order, it is only hidden.
									data-visually-hidden="true"
									type="radio"
									name={question.id}
									value={option.id}
									checked={checked}
									aria-labelledby={`${id}-label`}
									aria-describedby={option.description ? `${id}-description` : undefined}
									onChange={() => setSelection(option.id)}
								/>
								{/* Not a heading: the labels are answers, not sections, so the
								    heading outline only contains the question. */}
								<span id={`${id}-label`} className="gsw-option-label" data-size={labelSize}>
									{option.label[lang]}
								</span>
								{/* Marks the selection by shape, not only by color. Hidden from
								    assistive technology, the radio already conveys the state. */}
								{checked && (
									<span className="gsw-option-check" data-icon="check" aria-hidden="true" />
								)}
								{option.description && (
									<p id={`${id}-description`} className="gsw-option-description">
										{option.description[lang]}
									</p>
								)}
							</DBCard>
						);
					})}
				</div>
			</fieldset>
			<div className="gsw-actions">
				{asked.length > 0 && (
					<DBButton type="button" variant="ghost" onClick={goBack}>
						{text.back}
					</DBButton>
				)}
				<DBButton type="submit" variant="brand" disabled={!current}>
					{text.next}
				</DBButton>
			</div>
		</form>
	);
};

export default GetStartedWizard;
