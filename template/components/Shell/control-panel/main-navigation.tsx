import { useEffect, useRef } from 'react';
import { DBControlPanelNavigation } from '@db-ux/react-core-components';
import {
	createGrowTransition,
	createPresenceMotion,
	type PresenceMotion,
} from '@tobiasoberpaul/mdk';
import { buildAppNavigationFromContent } from '@template/utils/content-navigation.ts';
import { useTranslation } from '@template/i18n';
import NavItem from './nav-item.tsx';

const MainNavigation = ({ mobile }: { mobile?: boolean }) => {
	const navigation = buildAppNavigationFromContent(mobile);
	const { t } = useTranslation();
	const navRef = useRef<HTMLDivElement>(null);

	// Motion Library (MDK) enhancement: the desktop popover flyouts grow open from their
	// top-left corner and shrink back on close, instead of appearing instantly. The animation
	// comes from MDK (createGrowTransition driven by createPresenceMotion); the DB navigation
	// keeps full ownership of placement, the safe triangle, hover/focus and keyboard. Each
	// flyout is a <menu> whose open state lives on its sibling expand button (aria-expanded);
	// a MutationObserver mirrors that into the controller's open/close.
	useEffect(() => {
		if (mobile) return;
		const root = navRef.current?.querySelector<HTMLElement>('.db-control-panel-navigation');
		if (!root) return;
		const menuSelector = '.db-control-panel-navigation-item-group-menu';
		const buttonSelector = '.db-control-panel-navigation-item-group-expand-button';
		// Guard: only enhance where the browser can run the Web Animations timeline.
		if (typeof document.createElement('div').animate !== 'function') return;

		// One MDK controller per flyout menu, created lazily and kept per element.
		const controllers = new Map<HTMLElement, PresenceMotion>();
		const controllerFor = (menu: HTMLElement, initiallyOpen: boolean): PresenceMotion => {
			let presence = controllers.get(menu);
			if (!presence) {
				presence = createPresenceMotion({
					// A group that is already expanded on mount (the active path auto-opens its
					// group) starts open and settled, with no animation on load. Only later
					// user toggles animate.
					initiallyOpen,
					// The menu carries data-motion-state; db-ux-overrides.css holds it visible
					// through opening/closing so the shrink can play after hover/focus left.
					stateTarget: menu,
					// No trigger: the navigation owns placement. resize: 'transform' scales the
					// menu around --motion-scale-origin instead of resizing its box.
					createTransition: (lifecycle) =>
						createGrowTransition({
							...lifecycle,
							content: menu,
							resize: 'transform',
							reveal: [...menu.children].filter(
								(node): node is HTMLElement =>
									node instanceof HTMLElement &&
									// The back-button row is hidden on desktop; skip it as a reveal target.
									!node.classList.contains('db-control-panel-navigation-item-group-back-button'),
							),
						}),
				});
				controllers.set(menu, presence);
			}
			return presence;
		};

		const sync = (button: HTMLElement) => {
			const menu = button.parentElement?.querySelector<HTMLElement>(`:scope > ${menuSelector}`);
			if (!menu) return;
			const open = button.getAttribute('aria-expanded') === 'true';
			// First touch: if the group is already open (active path), initialize the controller
			// as open so it settles without animating; otherwise the open animation would run on
			// page load (and could be scanned mid-reveal).
			controllerFor(menu, open && !controllers.has(menu)).setOpen(open);
		};

		const observer = new MutationObserver((records) => {
			for (const record of records) {
				const target = record.target as HTMLElement;
				if (target.matches?.(buttonSelector)) sync(target);
			}
		});

		// Arm the enhancement only on the first real interaction with the navigation. On page
		// load the active path auto-expands its group; animating that initial open would run the
		// grow/reveal on load, where a static a11y scan can catch the items mid-fade (text below
		// contrast). Until the first hover/focus/key, the navigation stays native and instant, so
		// the auto-expanded flyout is fully opaque. The first open then seeds its controller from
		// the current aria-expanded, so an already-open group initializes settled (no animation).
		let armed = false;
		const arm = () => {
			if (armed) return;
			armed = true;
			root.dataset.navMotion = 'grow';
			for (const button of root.querySelectorAll<HTMLElement>(buttonSelector)) sync(button);
			observer.observe(root, {
				subtree: true,
				attributes: true,
				attributeFilter: ['aria-expanded'],
			});
		};
		const armEvents = ['pointerenter', 'focusin', 'keydown'] as const;
		for (const name of armEvents) root.addEventListener(name, arm, { once: true });

		return () => {
			for (const name of armEvents) root.removeEventListener(name, arm);
			observer.disconnect();
			for (const presence of controllers.values()) presence.destroy();
			controllers.clear();
			delete root.dataset.navMotion;
		};
	}, [mobile]);

	return (
		<div ref={navRef} style={{ display: 'contents' }}>
			<DBControlPanelNavigation
				variant={mobile ? 'drilldown' : 'popover'}
				aria-label={t('shell.mainNavigation')}
			>
				{navigation.map((navigationItem: NavigationItem) => (
					<NavItem
						key={`router-${navigationItem.path}-${navigationItem.title}`}
						{...navigationItem}
					/>
				))}
			</DBControlPanelNavigation>
		</div>
	);
};

export default MainNavigation;
