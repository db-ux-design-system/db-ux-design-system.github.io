import { useEffect } from 'react';

/**
 * Overlay notifications hang below the control panel. Its height is not available as a
 * token, and the control panel is outside the calling island, so the lower edge of the
 * visible panel is measured and written to a CSS custom property on <html>. Desktop and
 * mobile panel are both in the DOM, only one of them has a size.
 *
 * @param property Name of the custom property, e.g. `--gsw-saved-top`.
 */
export function useOverlayTop(property: string) {
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
			document.documentElement.style.setProperty(property, `${Math.max(bottom, 0)}px`);
		};
		update();
		const observer = new ResizeObserver(update);
		for (const panel of panels) observer.observe(panel);
		return () => {
			observer.disconnect();
			document.documentElement.style.removeProperty(property);
		};
	}, [property]);
}
