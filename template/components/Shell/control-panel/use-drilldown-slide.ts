import { useEffect, type RefObject } from 'react';
import {
	createPresenceMotion,
	createSlideTransition,
	type PresenceMotion,
	type Transition,
} from '@tobiasoberpaul/mdk';

/**
 * Motion Library (MDK) enhancement for a drilldown navigation, following the MDK Slide example:
 * on open, the sub-level slides in from the inline end while the level behind it shifts out to
 * the inline start, both on one timeline. The incoming menu runs one MDK Slide with its rows
 * revealed by blur and fade; the outgoing level follows that slide and blurs and fades out.
 * Close plays the same in reverse. It replaces the library's own transitions for both levels.
 *
 * The DB navigation keeps full ownership of the drilldown: it toggles aria-expanded on the
 * expand button, sets inert on the level behind, moves focus into the sub-level and back,
 * and resets the scroll offset. All of that hangs on aria-expanded, not on the animation, so
 * MDK only animates. A MutationObserver mirrors aria-expanded into one controller per menu.
 *
 * @param rootRef - An element containing the drilldown `.db-control-panel-navigation`.
 * @param enabled - Set to false to leave the navigation native (no controllers, no marker).
 */
export const useDrilldownSlide = (rootRef: RefObject<HTMLElement | null>, enabled = true) => {
	useEffect(() => {
		if (!enabled) return;
		// No [data-variant] filter: the navigation may set it only after this effect has run.
		// The CSS scopes every rule to [data-variant='drilldown'] instead.
		const root = rootRef.current?.querySelector<HTMLElement>('.db-control-panel-navigation');
		if (!root) return;
		// Guard: only enhance where the browser can run the Web Animations timeline.
		if (typeof document.createElement('div').animate !== 'function') return;

		const menuSelector = '.db-control-panel-navigation-item-group-menu';
		const buttonSelector = '.db-control-panel-navigation-item-group-expand-button';

		// The level a sub-level menu covers, with the same targets the library shifts natively:
		// the entries of the parent <menu> (including its back-button row on deeper levels),
		// where a group is represented by its expand button. A group <li> never moves: it
		// contains its sub-menu, and a transform would make it the overlay's containing block.
		const outgoingItemsFor = (menu: HTMLElement): HTMLElement[] => {
			const parentMenu = menu.parentElement?.parentElement?.closest('menu');
			if (!parentMenu) return [];
			return elementChildren(parentMenu).map((entry) =>
				entry.matches('.db-control-panel-navigation-item-group')
					? (entry.querySelector<HTMLElement>(`:scope > ${buttonSelector}`) ?? entry)
					: entry,
			);
		};

		// One MDK controller per sub-level menu, created lazily and kept per element.
		const controllers = new Map<HTMLElement, PresenceMotion>();
		const controllerFor = (menu: HTMLElement, initiallyOpen: boolean): PresenceMotion => {
			let presence = controllers.get(menu);
			if (!presence) {
				presence = createPresenceMotion({
					// A level that is already open on mount (the active path auto-expands its group)
					// starts open and settled, with no animation on load.
					initiallyOpen,
					// The menu carries data-motion-state; db-ux-overrides.css keeps it visible while
					// closing, so the slide-out can play after aria-expanded turned false.
					stateTarget: menu,
					createTransition: (lifecycle) => {
						// Outgoing level: follows the incoming menu frame by frame (see createFollower).
						// It replaces the library's own level shift (500ms, emotional easing), which
						// db-ux-overrides.css turns off, so both levels move on one timeline.
						const outgoing = createFollower(menu, () => outgoingItemsFor(menu));
						// Incoming level: enters from the inline end, like the native drilldown. The
						// default --motion-slide-distance of 100% moves the full menu width.
						const incoming = createSlideTransition({
							...lifecycle,
							content: menu,
							mode: 'enter',
							side: 'right',
							// Direct children: the back-button row and the items. Nested sub-levels sit
							// inside these items and stay hidden, so nothing animates twice.
							reveal: revealRows(menu),
						});
						return withFollower(incoming, outgoing);
					},
				});
				controllers.set(menu, presence);
			}
			return presence;
		};

		const sync = (button: HTMLElement) => {
			const menu = button.parentElement?.querySelector<HTMLElement>(`:scope > ${menuSelector}`);
			if (!menu) return;
			const open = button.getAttribute('aria-expanded') === 'true';
			// First touch: an already open level initializes settled instead of sliding in.
			controllerFor(menu, open && !controllers.has(menu)).setOpen(open);
		};

		const observer = new MutationObserver((records) => {
			for (const record of records) {
				const target = record.target as HTMLElement;
				if (target.matches?.(buttonSelector)) sync(target);
			}
		});

		// Arm on the first real interaction, as in the main navigation: on load the active path
		// auto-expands its group, and a static a11y scan must not catch those items mid-fade.
		let armed = false;
		const arm = () => {
			if (armed) return;
			armed = true;
			root.dataset.navMotion = 'slide';
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
	}, [rootRef, enabled]);
};

const elementChildren = (element: Element): HTMLElement[] =>
	[...element.children].filter((node): node is HTMLElement => node instanceof HTMLElement);

/**
 * The rows of a sub-level as reveal targets, each revealed as a whole. MDK's progressive
 * reveal otherwise descends into a row and keeps only known content elements (button, p,
 * headings …). In the back-button row that kept the arrow button but skipped the <span> with
 * the level title, which stayed sharp while everything else blurred in.
 */
const revealRows = (menu: HTMLElement): HTMLElement[] => {
	const rows = elementChildren(menu);
	for (const row of rows) row.dataset.motionContentGroup = '';
	return rows;
};

type Follower = { start: () => void; stop: () => void };

/**
 * Moves the outgoing level with the incoming menu's MDK slide. It copies the keyframes, timing
 * and play state of the menu's slide animation onto each outgoing item, offset by the menu
 * width, so the old level's trailing edge stays attached to the new level's leading edge
 * (also with an overshoot, should one be configured). Both run on the same timeline, frame-exact and without a
 * per-frame script. The copies end when MDK settles (finishes or cancels) its animation.
 *
 * One MDK controller per outgoing item would also work, but MDK resolves its tokens per
 * controller and trip with style probes; on this navigation that blocked the click by ~0.5s.
 */
const createFollower = (menu: HTMLElement, getItems: () => HTMLElement[]): Follower => {
	let copies: Animation[] = [];
	let held: HTMLElement[] = [];
	const sizeProperties = ['padding', 'block-size', 'min-block-size'] as const;
	const stop = () => {
		for (const copy of copies) copy.cancel();
		copies = [];
		for (const item of held) for (const name of sizeProperties) item.style.removeProperty(name);
		held = [];
	};
	// The library collapses the covered level (padding and block-size to 0) after a CSS delay
	// that starts when aria-expanded flips, not when the slide starts. When the main thread is
	// busy, the slide starts later and the collapse hit mid-slide: the rows of the moving level
	// lost their height and overlapped. Hold each item's current size inline for the whole
	// trip instead; once it is released, the collapse applies behind the opaque overlay.
	const holdSizes = (items: HTMLElement[]) => {
		// Read all sizes first, then write, so the reads cost one style recalc in total.
		const sizes = items.map((item) => {
			const style = getComputedStyle(item);
			return {
				padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
				'block-size': style.blockSize,
				'min-block-size': style.minBlockSize,
			};
		});
		items.forEach((item, index) => {
			for (const name of sizeProperties) item.style.setProperty(name, sizes[index][name]);
		});
		held = items;
	};
	return {
		start: () => {
			stop();
			// The slide track is the one MDK runs on the menu itself; the reveals run on its items.
			const slide = menu
				.getAnimations()
				.find((animation) => (animation.effect as KeyframeEffect | null)?.target === menu);
			const effect = slide?.effect as KeyframeEffect | undefined;
			if (!slide || !effect) return; // Settled at once (reduced motion): nothing to follow.
			// The keyframes translate by percentages of the menu width (--motion-slide-distance)
			// plus a px overshoot if configured (here it is 0). Resolve the percentages against the menu, then prepend the
			// offset that parks each item one menu width further towards the inline start.
			const width = menu.offsetWidth;
			const toPx = (transform: string) =>
				transform === 'none'
					? ''
					: transform.replace(
							/(-?\d*\.?\d+)%/g,
							(_, value) => `${(Number(value) / 100) * width}px`,
						);
			const frames = effect.getKeyframes().map(({ offset, easing, transform }) => ({
				offset,
				easing,
				transform: `translateX(${-width}px) ${toPx(String(transform ?? 'none'))}`.trim(),
			}));
			// The outgoing level blurs and fades out like MDK's Slide `outgoing` targets, with the
			// same reveal tokens. MDK only accepts outgoing targets inside the sliding surface,
			// which the level behind is not, so the track is built here. One style read per trip.
			const style = getComputedStyle(menu);
			const tokenOf = (name: string) => style.getPropertyValue(`--motion-${name}`).trim();
			const start = Number(tokenOf('slide-reveal-offset'));
			const end = Number(tokenOf('slide-reveal-end'));
			const blurred = `blur(${tokenOf('slide-reveal-blur')})`;
			const fade: Keyframe[] = [
				{ offset: 0, opacity: 1, filter: 'none' },
				{ offset: 1 - end, opacity: 1, filter: 'none' },
				{ offset: 1 - start, opacity: 0, filter: blurred },
				{ offset: 1, opacity: 0, filter: blurred },
			];
			const timing = effect.getTiming();
			const items = getItems();
			holdSizes(items);
			copies = items.flatMap((item) => [
				item.animate(frames, { duration: timing.duration, easing: timing.easing, fill: 'both' }),
				item.animate(fade, {
					duration: timing.duration,
					easing: tokenOf('easing-reveal'),
					fill: 'both',
				}),
			]);
			for (const copy of copies) {
				copy.currentTime = slide.currentTime;
				copy.playbackRate = slide.playbackRate;
				if (slide.playState === 'paused') copy.pause();
			}
			// MDK cancels its animation when the trip settles; finished rejects on cancel.
			slide.finished.then(stop, stop);
		},
		stop,
	};
};

/** The incoming level's MDK transition, with the outgoing level following each trip. */
const withFollower = (lead: Transition, follower: Follower): Transition => ({
	get state() {
		return lead.state;
	},
	get isOpen() {
		return lead.isOpen;
	},
	open: () => {
		lead.open();
		follower.start();
	},
	close: () => {
		lead.close();
		follower.start();
	},
	toggle: () => {
		lead.toggle();
		follower.start();
	},
	seek: (progress) => {
		lead.seek(progress);
		follower.start();
	},
	destroy: () => {
		follower.stop();
		lead.destroy();
	},
});
