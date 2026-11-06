import { useEffect, useRef } from 'react';
import { DBButton, DBPopover, DBControlPanelNavigationItem } from '@db-ux/react-core-components';
import { createGrowTransition, createPresenceMotion } from '@tobiasoberpaul/mdk';
import { useLanguage } from '@template/context/language-context';
import { getLocalizedPath } from '@template/i18n/slug-mapping';
import { useTranslation } from '@template/i18n/useTranslation';

const LanguageSwitch = () => {
	const { language } = useLanguage();
	const { t } = useTranslation();
	const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
	const enPath = getLocalizedPath(currentPath, 'en');
	const dePath = getLocalizedPath(currentPath, 'de');
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Motion Library (MDK) enhancement: the popover grows open from its top-right corner and
	// shrinks back on close, like the reading list. The DB popover keeps placement, hover/focus
	// and dismissal; MDK only animates. The article it measures and places stays untransformed
	// (an invisible box); the inner .language-switch-surface is what grows (see the CSS). Host
	// mode via createPresenceMotion with stateTarget, no trigger, resize: 'transform'.
	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return;
		const panel = wrapper.querySelector<HTMLElement>(
			'.language-switch-popover > .db-popover-content',
		);
		const surface = panel?.querySelector<HTMLElement>(':scope > .language-switch-surface');
		if (!panel || !surface) return;
		if (typeof surface.animate !== 'function') return;

		const presence = createPresenceMotion({
			stateTarget: panel,
			createTransition: (lifecycle) =>
				createGrowTransition({
					...lifecycle,
					content: surface,
					resize: 'transform',
					reveal: [...surface.querySelectorAll<HTMLElement>('.db-control-panel-navigation-item')],
				}),
		});
		wrapper.dataset.motionEnhanced = 'true';

		// The popover shows/hides itself via :hover / :focus-within; read the settled state one
		// frame later (focusout/mouseleave fire before :hover and activeElement settle).
		const isVisible = () => wrapper.matches(':hover') || wrapper.contains(document.activeElement);
		let frame = 0;
		const sync = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => presence.setOpen(isVisible()));
		};
		const events = ['mouseenter', 'mouseleave', 'focusin', 'focusout'] as const;
		for (const name of events) wrapper.addEventListener(name, sync);

		return () => {
			cancelAnimationFrame(frame);
			for (const name of events) wrapper.removeEventListener(name, sync);
			presence.destroy();
			delete wrapper.dataset.motionEnhanced;
		};
	}, []);

	return (
		<div ref={wrapperRef} className="language-switch">
			<DBPopover
				className="language-switch-popover"
				placement="bottom-end"
				spacing="none"
				// MDK owns the open animation; turn off the popover's own opacity keyframe.
				animation={false}
				trigger={
					<DBButton
						type="button"
						variant="ghost"
						icon="globe"
						aria-label={t('shell.languageSwitch.label')}
					>
						{language.toUpperCase()}
					</DBButton>
				}
			>
				<nav
					className="language-switch-surface"
					aria-label={language === 'de' ? 'Sprachauswahl' : 'Language selection'}
				>
					<DBControlPanelNavigationItem active={language === 'en'} style={{ width: '100%' }}>
						<a href={enPath}>English</a>
					</DBControlPanelNavigationItem>
					<DBControlPanelNavigationItem active={language === 'de'} style={{ width: '100%' }}>
						<a href={dePath}>Deutsch</a>
					</DBControlPanelNavigationItem>
				</nav>
			</DBPopover>
		</div>
	);
};

export default LanguageSwitch;
