import { type FormEvent, useEffect, useRef, useState } from 'react';
import { DBButton, DBCard, DBHeadingH2 } from '@db-ux/react-core-components';
import { savePackage } from '@template/components/LearningPackage/learning-package-store';
import { learningPackageTexts } from '@template/components/LearningPackage/texts';
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
	toStoredItems,
} from './wizard-flow';
// Styles: GetStartedWizard.css is imported by the .astro pages that render this island,
// LearningPackage.css by global.css. Imported here, they only arrived with the
// client-only island and were missing after client-side navigation until a reload.

const ui = {
	en: {
		next: 'Next',
		back: 'Back',
		restart: 'Start again',
		open: 'Open',
	},
	de: {
		next: 'Weiter',
		back: 'Zurück',
		restart: 'Neu starten',
		open: 'Öffnen',
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
	const headingRef = useRef<HTMLHeadingElement>(null);
	// Focus only moves after a user action, not on the initial page load.
	const moveFocus = useRef(false);

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

	const step = next(answers);
	const asked = askedQuestions(answers);

	useEffect(() => {
		if (moveFocus.current) headingRef.current?.focus();
		moveFocus.current = false;
	}, [answers]);

	// Saves the package once a result is reached, also from a shared link or a reload.
	// Keyed on the answers only: "Remove" in the popover must not be undone while the
	// result stays on screen.
	const answersKey = asked.map((id) => `${id}=${answers[id]}`).join('&');
	useEffect(() => {
		if ('result' in step) savePackage(answers, toStoredItems(step.result.items));
		// step and answers follow answersKey.
	}, [answersKey]);

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
		if (value) update({ ...answers, [step.question.id]: value });
	};

	if ('result' in step) {
		const { result } = step;
		const lpText = learningPackageTexts[lang];
		return (
			<section className="gsw" aria-labelledby="gsw-heading">
				{/* Headline and intro as on the page hero of other pages: tight gap. */}
				<div className="gsw-hero">
					<h1 id="gsw-heading" className="gsw-heading" ref={headingRef} tabIndex={-1}>
						{lpText.title}
					</h1>
					<p className="gsw-result-intro">{lpText.intro}</p>
				</div>
				{/* Styled like the selected cards of the previous steps: elevation level 3,
				    tinted in the color of the chosen role. Static, because only the links
				    inside are interactive. Pages are ticked off in the popover only. */}
				<DBCard
					spacing="large"
					elevationLevel="3"
					className="gsw-result"
					data-color={roleColor(answers)}
				>
					{/* One row per page: text on the start side, button on the end side.
					    No package title above the list: it repeated the first page. Every
					    row has the same headline size as the option cards (sm = h4) and the
					    same button text. Only the button marks the first page: brand
					    instead of outlined. */}
					<ol className="gsw-package-list">
						{result.items.map((item, index) => {
							const first = index === 0;
							return (
								<li key={item.id} className="gsw-package-item">
									<div className="gsw-package-text">
										<DBHeadingH2 size="sm">{item.label[lang]}</DBHeadingH2>
										<p className="gsw-package-description">{item.description[lang]}</p>
									</div>
									<a
										className="db-button gsw-package-button"
										data-variant={first ? 'brand' : 'outlined'}
										href={toHref(item, lang)}
										// The visible text alone ("Open") does not name the page.
										aria-label={`${text.open}: ${item.label[lang]}`}
									>
										{text.open}
									</a>
								</li>
							);
						})}
					</ol>
				</DBCard>
				<div className="gsw-actions">
					<DBButton type="button" variant="ghost" onClick={goBack}>
						{text.back}
					</DBButton>
					<DBButton type="button" variant="filled" onClick={restart}>
						{text.restart}
					</DBButton>
				</div>
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
							// Same card spacing as the result card (spacing="large"). DBCard
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
									setSelection(option.id);
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
