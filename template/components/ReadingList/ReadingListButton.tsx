import { type CSSProperties, useEffect, useId, useRef, useState } from 'react';
import { DBBadge, DBButton, DBPopover } from '@db-ux/react-core-components';
import { useLanguage } from '@template/context/language-context';
import { roleColors, wizardHref } from '@template/components/GetStartedWizard/wizard-flow';
import { removeItem, useReadingList } from './reading-list-store';
import { resolveItems } from './reading-list-items';
import { readingListTexts } from './texts';

/**
 * Secondary action in the control panel: opens the reading list on every page.
 * Always visible. The badge shows the number of pages and is hidden while the list
 * is empty.
 *
 * The popover opens and closes like the language switch: uncontrolled DBPopover,
 * open while the pointer is over it or the focus is inside.
 *
 * Escape closes it in every case (WCAG 1.4.13, dismissible): while it is open by
 * hover, and while the focus is on the trigger or on a control inside. The library
 * only handles Escape on the trigger and then moves the focus to the page body, so
 * the component handles it itself: it hides the popover, keeps or puts the focus on
 * the trigger and shows the popover again once the pointer and the focus have left,
 * or on a click on the trigger.
 */
const ReadingListButton = ({ size }: { size?: 'small' }) => {
	const { language: lang } = useLanguage();
	const text = readingListTexts[lang];
	const list = useReadingList();
	const items = resolveItems(list.items, lang);
	const count = items.length;
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [status, setStatus] = useState('');
	// The desktop and the mobile control panel both render this button, so the ids
	// need to be unique per instance.
	const idPrefix = `rl-popover${useId().replace(/[^\w-]/g, '')}`;
	// True after Escape until the pointer and the focus have left (see above).
	const [dismissed, setDismissed] = useState(false);
	const dismissedRef = useRef(false);

	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return;
		const trigger = () => wrapper.querySelector<HTMLElement>('.rl-trigger');
		const setState = (value: boolean) => {
			dismissedRef.current = value;
			setDismissed(value);
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape' || dismissedRef.current) return;
			const focusInside = wrapper.contains(document.activeElement);
			if (!focusInside && !wrapper.matches(':hover')) return;
			if (focusInside) {
				// Registered on window in the capture phase: this keeps the library's
				// handler from blurring the trigger.
				event.stopPropagation();
				trigger()?.focus();
			}
			setState(true);
			trigger()?.setAttribute('aria-expanded', 'false');
		};
		const onMouseLeave = () => {
			if (!wrapper.contains(document.activeElement)) setState(false);
		};
		const onFocusOut = (event: FocusEvent) => {
			if (!wrapper.contains(event.relatedTarget as Node | null) && !wrapper.matches(':hover')) {
				setState(false);
			}
		};
		window.addEventListener('keydown', onKeyDown, true);
		wrapper.addEventListener('mouseleave', onMouseLeave);
		wrapper.addEventListener('focusout', onFocusOut);
		return () => {
			window.removeEventListener('keydown', onKeyDown, true);
			wrapper.removeEventListener('mouseleave', onMouseLeave);
			wrapper.removeEventListener('focusout', onFocusOut);
		};
	}, []);

	// A click on the trigger shows a dismissed popover again.
	const reopen = () => {
		if (!dismissedRef.current) return;
		dismissedRef.current = false;
		setDismissed(false);
		wrapperRef.current?.querySelector('.rl-trigger')?.setAttribute('aria-expanded', 'true');
	};

	// The bar of the wizard group takes the color of the role of the stored result, so
	// it matches the lines of the result list. The role is read from the stored answers
	// ("role=design&..."); without them the CSS falls back to brand.
	const wizardRole = new URLSearchParams(list.wizard ?? '').get('role');
	const wizardColor = wizardRole ? roleColors[wizardRole] : undefined;

	// Own bookmarks first, wizard suggestions below as a separate group. Within each
	// group, the order of the list is kept.
	const groups = (['bookmark', 'wizard'] as const)
		.map((source) => ({ source, items: items.filter((item) => item.source === source) }))
		.filter((group) => group.items.length > 0);

	// index: position across both groups, in the order of the delete buttons.
	const remove = (id: string, label: string, index: number) => {
		// The row disappears, so the focus moves to the delete button that takes its
		// place, or to the one above. With the last page gone, it moves to the trigger,
		// which keeps the popover open.
		const wrapper = wrapperRef.current;
		const buttons = [...(wrapper?.querySelectorAll<HTMLElement>('.rl-item-remove') ?? [])];
		const target = buttons[index + 1] ?? buttons[index - 1];
		const trigger = wrapper?.querySelector<HTMLElement>('.rl-trigger');
		removeItem(id);
		setStatus(text.removed(label));
		requestAnimationFrame(() => (target?.isConnected ? target : trigger)?.focus());
	};

	return (
		<div className="rl-control" ref={wrapperRef} data-dismissed={dismissed ? 'true' : undefined}>
			<DBPopover
				className="rl-popover"
				placement="bottom-end"
				spacing="medium"
				width="fixed"
				trigger={
					// No tooltip: the popover opens on hover and focus as well, so a
					// tooltip would overlap it. The popover title names the button visually,
					// aria-label names it for assistive technology.
					// eslint-disable-next-line db-ux/button-no-text-requires-tooltip
					<DBButton
						type="button"
						variant="ghost"
						size={size}
						icon="bookmark"
						// Filled while pages are on the list. See ReadingListToggle for
						// why the variant is "db-filled".
						data-icon-variant={count > 0 ? 'db-filled' : undefined}
						noText
						className="rl-trigger"
						aria-label={text.triggerLabel(count)}
						onClick={reopen}
					>
						{text.title}
						{count > 0 && (
							// The count is part of the accessible name of the button.
							<DBBadge
								placement="corner-top-right"
								size="small"
								semantic="informational"
								emphasis="strong"
								label={text.triggerLabel(count)}
								aria-hidden="true"
							>
								{count}
							</DBBadge>
						)}
					</DBButton>
				}
			>
				<div role="group" aria-labelledby={`${idPrefix}-title`} className="rl-popover-body">
					<p id={`${idPrefix}-title`} className="rl-popover-title">
						{text.title}
					</p>
					{count === 0 ? (
						<div className="rl-empty">
							<p>
								{text.empty[0]} {/* Same icon as the bookmark button on the pages. */}
								<span className="rl-inline-icon" data-icon="bookmark" aria-hidden="true" />{' '}
								{text.empty[1]}
							</p>
							{/* Styled and animated like a row of the list. */}
							<div className="rl-item rl-suggest">
								<a className="rl-item-link" data-icon="arrow_right" href={wizardHref(lang)}>
									<span className="rl-item-label">{text.suggest}</span>
								</a>
							</div>
						</div>
					) : (
						// One scroll area for both groups. Each group is its own list, named for
						// screen readers; visually the wizard group is marked by a bar.
						<div className="rl-lists">
							{groups.map((group, groupIndex) => {
								const offset = groups
									.slice(0, groupIndex)
									.reduce((sum, previous) => sum + previous.items.length, 0);
								return (
									<ol
										key={group.source}
										className="rl-list"
										data-source={group.source}
										style={
											group.source === 'wizard' && wizardColor
												? ({
														'--rl-wizard-color': `var(--db-${wizardColor}-on-bg-basic-emphasis-70-default)`,
													} as CSSProperties)
												: undefined
										}
										aria-label={group.source === 'wizard' ? text.wizardGroup : text.bookmarkGroup}
									>
										{group.items.map((item, index) => (
											<li key={item.id} className="rl-item">
												{/* Arrow in front of the label, shown on hover and focus. The
												    label is its own element, so it can be truncated instead of
												    wrapping (see ReadingList.css). */}
												<a className="rl-item-link" data-icon="arrow_right" href={item.href}>
													<span className="rl-item-label">{item.label}</span>
												</a>
												{/* No tooltip: inside the popover the library positions it wrongly (it covered
												    the button and ran beyond the list, adding a horizontal scrollbar). The
												    bin icon is self-explanatory; the button keeps its name through the visually
												    hidden label. */}
												{/* eslint-disable-next-line db-ux/button-no-text-requires-tooltip */}
												<DBButton
													type="button"
													variant="ghost"
													size="small"
													icon="bin"
													noText
													className="rl-item-remove"
													onClick={() => remove(item.id, item.label, offset + index)}
												>
													{text.remove(item.label)}
												</DBButton>
											</li>
										))}
									</ol>
								);
							})}
						</div>
					)}
					<span role="status" data-visually-hidden="true">
						{status}
					</span>
				</div>
			</DBPopover>
		</div>
	);
};

export default ReadingListButton;
