import { type FormEvent, useEffect, useRef, useState } from 'react';
import { DBButton, DBCard } from '@db-ux/react-core-components';
import { toDeSlug } from '@template/i18n/slug-mapping';
import {
	type Answers,
	type Lang,
	type Link,
	type QuestionId,
	askedQuestions,
	next,
	questions,
} from './wizard-flow';
// Styles (GetStartedWizard.css, TeaserCard.css) are imported by the .astro pages that
// render this island. Imported here, they only arrived with the client-only island and
// were missing after client-side navigation until a reload.

const ui = {
	en: {
		next: 'Next',
		back: 'Back',
		restart: 'Start again',
		resultHeading: 'Your next step',
		more: 'Also helpful',
	},
	de: {
		next: 'Weiter',
		back: 'Zurück',
		restart: 'Nochmals starten',
		resultHeading: 'Dein nächster Schritt',
		more: 'Außerdem hilfreich',
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

/** Keeps the answers in the URL, so the browser back button and shared links work. */
function writeAnswers(answers: Answers) {
	const params = new URLSearchParams();
	for (const id of askedQuestions(answers)) params.set(id, answers[id]!);
	const query = params.toString();
	window.history.pushState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
}

const toHref = (target: Link, lang: Lang) => {
	const path = lang === 'de' ? `/de/${toDeSlug(target.path.replace(/^\//, ''))}` : target.path;
	return target.anchor ? `${path}#${target.anchor[lang]}` : path;
};

/**
 * Get Started as a step-by-step wizard: one question per view, a result at the end.
 * The decision tree lives in wizard-flow.ts. Links can preselect answers through the
 * query string, e.g. `?role=design`.
 */
const GetStartedWizard = ({ lang = 'en' }: { lang?: Lang }) => {
	const text = ui[lang];
	const [answers, setAnswers] = useState<Answers>({});
	const [selection, setSelection] = useState<string | undefined>();
	const headingRef = useRef<HTMLHeadingElement>(null);
	// Focus only moves after a user action, not on the initial page load.
	const moveFocus = useRef(false);

	useEffect(() => {
		setAnswers(readAnswers());
		const onPopState = () => {
			moveFocus.current = true;
			setSelection(undefined);
			setAnswers(readAnswers());
		};
		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	}, []);

	const step = next(answers);
	const asked = askedQuestions(answers);

	useEffect(() => {
		if (moveFocus.current) headingRef.current?.focus();
		moveFocus.current = false;
	}, [answers]);

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
		return (
			<section className="gsw" aria-labelledby="gsw-heading">
				<h1 id="gsw-heading" className="gsw-heading" ref={headingRef} tabIndex={-1}>
					{text.resultHeading}
				</h1>
				<div className="gsw-result">
					<h2 className="gsw-result-title">{result.title[lang]}</h2>
					<p>{result.description[lang]}</p>
					<a className="db-button" data-variant="brand" href={toHref(result.primary, lang)}>
						{result.primary.label[lang]}
					</a>
				</div>
				{result.more.length > 0 && (
					<div className="gsw-more">
						<h2 className="gsw-more-title">{text.more}</h2>
						{/* Same markup and classes as TeaserCard, which the Learn page uses
						    through ChildPageOverview. TeaserCard is an Astro component and
						    cannot be rendered inside this React island. */}
						<div className="teaser-cards teaser-cards-cols-1 teaser-cards-medium">
							{result.more.map((item) => (
								<a
									key={item.path + (item.anchor?.en ?? '')}
									href={toHref(item, lang)}
									className="teaser-card-link"
								>
									<DBCard behavior="interactive" spacing="small">
										<div className="teaser-content">
											<h3 className="teaser-title">{item.label[lang]}</h3>
											{item.description && (
												<p className="teaser-description">{item.description[lang]}</p>
											)}
										</div>
									</DBCard>
								</a>
							))}
						</div>
					</div>
				)}
				<div className="gsw-actions">
					<DBButton type="button" variant="ghost" onClick={goBack}>
						{text.back}
					</DBButton>
					<DBButton type="button" variant="outlined" onClick={restart}>
						{text.restart}
					</DBButton>
				</div>
			</section>
		);
	}

	const { question } = step;
	const current = selection ?? answers[question.id];

	return (
		<form className="gsw" onSubmit={onSubmit}>
			<fieldset className="gsw-fieldset">
				<legend className="gsw-legend">
					<h1 className="gsw-heading" ref={headingRef} tabIndex={-1}>
						{question.title[lang]}
					</h1>
				</legend>
				<div className={`gsw-options gsw-options-${question.layout}`}>
					{question.options.map((option) => (
						<label key={option.id} className="gsw-option">
							<input
								// The card shows the selection itself. The radio stays in the
								// accessibility tree and keyboard order, it is only hidden.
								data-visually-hidden="true"
								type="radio"
								name={question.id}
								value={option.id}
								checked={current === option.id}
								onChange={() => setSelection(option.id)}
							/>
							{question.layout === 'tiles' && option.icon && (
								<span className="gsw-option-icon" data-icon={option.icon} aria-hidden="true" />
							)}
							<span className="gsw-option-text">
								<span className="gsw-option-label">{option.label[lang]}</span>
								{option.description && (
									<span className="gsw-option-description">{option.description[lang]}</span>
								)}
							</span>
						</label>
					))}
				</div>
			</fieldset>
			<div className="gsw-actions">
				{asked.length > 0 && (
					<DBButton type="button" variant="ghost" onClick={goBack}>
						{text.back}
					</DBButton>
				)}
				<DBButton type="submit" variant="brand" disabled={!current} className="gsw-next">
					{text.next}
				</DBButton>
			</div>
		</form>
	);
};

export default GetStartedWizard;
