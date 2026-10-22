import { useId, useRef, useState } from 'react';
import { DBBadge, DBButton, DBPopover, DBTooltip } from '@db-ux/react-core-components';
import { useLanguage } from '@template/context/language-context';
import { wizardHref } from '@template/components/GetStartedWizard/wizard-flow';
import { removeItem, useReadingList } from './reading-list-store';
import { resolveItems } from './reading-list-items';
import { readingListTexts } from './texts';

/**
 * Secondary action in the control panel: opens the reading list on every page.
 * Always visible. The badge shows the number of pages and is hidden while the list
 * is empty.
 *
 * The popover opens and closes like the language switch: uncontrolled DBPopover,
 * open while the pointer is over it or the focus is inside. Escape is handled by the
 * library: it only closes the popover while the trigger has focus, and the focus then
 * moves to the page body. Escape from a control inside the popover does nothing.
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
		<div className="rl-control" ref={wrapperRef}>
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
							<p>{text.empty}</p>
							<a href={wizardHref(lang)}>{text.suggest}</a>
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
										aria-label={group.source === 'wizard' ? text.wizardGroup : text.bookmarkGroup}
									>
										{group.items.map((item, index) => (
											<li key={item.id} className="rl-item">
												<a className="rl-item-link" href={item.href}>
													{item.label}
												</a>
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
													<DBTooltip>{text.removeShort}</DBTooltip>
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
