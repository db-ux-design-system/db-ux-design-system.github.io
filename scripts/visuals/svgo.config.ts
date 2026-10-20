/**
 * SVGO configuration for the visual library in `template/visuals/`.
 *
 * Optimizes the SVG sources and normalizes them so the `Visual` component can control
 * colors and stroke width via CSS custom properties:
 * - Hard stroke colors → `stroke="currentColor"` + class `v-stroke` (most frequent color)
 *   or `v-accent` (every other color)
 * - Hard fill colors → `fill="currentColor"` + `v-solid` / `v-accent-solid` (same color as a
 *   stroke) or `fill="none"` + `v-fill` (surface, switched on per usage)
 * - `stroke-width`, root `width`/`height`/`class`/`id`/`style`, `<title>`, `<desc>` are removed
 * - `stroke-linejoin` and every `stroke-linecap` except `square` are removed (attributes and
 *   `style` declarations), so the SVG defaults apply: sharp corners (miter joins) and butt caps –
 *   a library convention. `stroke-linecap="square"` and `stroke-miterlimit` are kept
 * - `viewBox` is always kept (derived from `width`/`height` if missing)
 * - Errors (the run aborts): hard `fill`/`stroke` on the root `<svg>`, and sources with hard fills
 *   but no stroke color (outlined strokes would render empty)
 *
 * The normalization is idempotent: running it on an already normalized file changes nothing.
 */
import type { Config, CustomPlugin, XastElement, XastParent } from 'svgo';

/** Classes written by the normalizer. Every other class value is removed. */
export const VISUAL_CLASSES = ['v-stroke', 'v-accent', 'v-solid', 'v-accent-solid', 'v-fill'];

/** Warnings collected during the last optimization run (e.g. multiple stroke widths). */
export const visualWarnings: string[] = [];

const KEEP_COLORS = new Set(['none', 'transparent', 'currentcolor', 'inherit']);

function isHardColor(value: string | undefined): value is string {
	if (value === undefined) return false;
	const normalized = value.trim().toLowerCase();
	return !KEEP_COLORS.has(normalized) && !normalized.startsWith('url(');
}

function normalizeColor(value: string): string {
	const normalized = value.trim().toLowerCase();
	// Expand short hex (#abc → #aabbcc) so equal colors are detected as equal
	const shortHex = normalized.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/);
	if (shortHex) {
		return `#${shortHex[1]}${shortHex[1]}${shortHex[2]}${shortHex[2]}${shortHex[3]}${shortHex[3]}`;
	}
	return normalized;
}

/** Clip paths and masks only define geometry/luminance – their colors stay untouched. */
const SKIPPED_ELEMENTS = new Set(['clipPath', 'mask']);

function walkElements(parent: XastParent, callback: (element: XastElement) => void): void {
	for (const child of parent.children) {
		if (child.type === 'element' && !SKIPPED_ELEMENTS.has(child.name)) {
			callback(child);
			walkElements(child, callback);
		}
	}
}

/**
 * Corner and cap styles: joins always use the SVG default (miter), so every `stroke-linejoin` is
 * removed. Caps use the default (butt); only `square` is allowed and kept, every other
 * `stroke-linecap` (e.g. `round`) is removed. `stroke-miterlimit` is not touched.
 */
const CORNER_PROPERTIES = ['stroke-linejoin', 'stroke-linecap'];
const ALLOWED_CORNER_VALUES: Record<string, string[]> = {
	'stroke-linecap': ['square'],
};

function isAllowedCornerValue(property: string, value: string): boolean {
	return (ALLOWED_CORNER_VALUES[property] ?? []).includes(value.trim().toLowerCase());
}

/** Visits every element, including `clipPath`/`mask` content. */
function walkAllElements(parent: XastParent, callback: (element: XastElement) => void): void {
	for (const child of parent.children) {
		if (child.type === 'element') {
			callback(child);
			walkAllElements(child, callback);
		}
	}
}

function removeCornerStyles(element: XastElement): void {
	for (const property of CORNER_PROPERTIES) {
		const value = element.attributes[property];
		if (value !== undefined && !isAllowedCornerValue(property, value)) {
			delete element.attributes[property];
		}
	}
	const { style } = element.attributes;
	if (style === undefined) return;
	const kept = style
		.split(';')
		.map((declaration) => declaration.trim())
		.filter(Boolean)
		.filter((declaration) => {
			const [property, ...value] = declaration.split(':');
			const name = property.trim().toLowerCase();
			return !CORNER_PROPERTIES.includes(name) || isAllowedCornerValue(name, value.join(':'));
		});
	if (kept.length > 0) {
		element.attributes.style = kept.join(';');
	} else {
		delete element.attributes.style;
	}
}

function addClass(element: XastElement, className: string): void {
	const classes = new Set((element.attributes.class ?? '').split(/\s+/).filter(Boolean));
	classes.add(className);
	element.attributes.class = [...classes].sort().join(' ');
}

function cleanClasses(element: XastElement): void {
	if (element.attributes.class === undefined) return;
	const kept = element.attributes.class
		.split(/\s+/)
		.filter((className) => VISUAL_CLASSES.includes(className));
	if (kept.length > 0) {
		element.attributes.class = [...new Set(kept)].sort().join(' ');
	} else {
		delete element.attributes.class;
	}
}

function normalizeRoot(svg: XastElement, path: string): void {
	const { width, height } = svg.attributes;
	if (svg.attributes.viewBox === undefined) {
		const numericWidth = Number.parseFloat(width ?? '');
		const numericHeight = Number.parseFloat(height ?? '');
		const isPixelValue = (value: string | undefined) =>
			value !== undefined && /^\d+(\.\d+)?(px)?$/.test(value.trim());
		if (isPixelValue(width) && isPixelValue(height)) {
			svg.attributes.viewBox = `0 0 ${numericWidth} ${numericHeight}`;
		} else {
			throw new Error(`[visuals] ${path}: root <svg> needs a viewBox or numeric width/height.`);
		}
	}
	for (const attribute of ['class', 'id', 'width', 'height', 'style']) {
		delete svg.attributes[attribute];
	}
	// The `Visual` component keeps only `xmlns`, `viewBox` and `fill` on the root and can't map
	// root colors to the visual classes. Hard colors on the root would either render as hex values
	// (`fill`) or get lost for every inheriting child (`stroke`).
	const rootColors = (['fill', 'stroke'] as const).filter((attribute) =>
		isHardColor(svg.attributes[attribute]),
	);
	if (rootColors.length > 0) {
		throw new Error(
			`[visuals] ${path}: root <svg> has a hard color (${rootColors
				.map((attribute) => `${attribute}="${svg.attributes[attribute]}"`)
				.join(', ')}). Set the colors on the shapes instead and keep the root at fill="none" ` +
				'(default Figma export of a frame without background fill).',
		);
	}
}

/** Custom SVGO plugin: maps hard colors/stroke widths to the visual classes. */
export const normalizeVisual: CustomPlugin = {
	name: 'normalizeVisual',
	fn: (root, _params, info) => {
		const path = info.path ?? 'unknown file';
		const svg = root.children.find(
			(child): child is XastElement => child.type === 'element' && child.name === 'svg',
		);
		if (!svg) {
			throw new Error(`[visuals] ${path}: no root <svg> element found.`);
		}
		removeCornerStyles(svg);
		walkAllElements(svg, removeCornerStyles);
		normalizeRoot(svg, path);

		// 1. Collect stroke colors (by frequency) and stroke widths
		const strokeColorCount = new Map<string, number>();
		const strokeWidths = new Set<string>();
		walkElements(svg, (element) => {
			const { stroke } = element.attributes;
			if (isHardColor(stroke)) {
				const color = normalizeColor(stroke);
				strokeColorCount.set(color, (strokeColorCount.get(color) ?? 0) + 1);
			}
			if (element.attributes['stroke-width'] !== undefined) {
				strokeWidths.add(element.attributes['stroke-width'].trim());
			}
		});
		const [primaryColor] = [...strokeColorCount.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([color]) => color);

		// Without any stroke color every hard fill would become a switched-off surface
		// (`fill="none"` + `v-fill`) and the visual would render empty – e.g. "Outline stroke" exports
		if (primaryColor === undefined) {
			let hasHardFill = false;
			walkElements(svg, (element) => {
				if (isHardColor(element.attributes.fill)) hasHardFill = true;
			});
			if (hasHardFill) {
				throw new Error(
					`[visuals] ${path}: no stroke color found, only hard fills. The visual would render ` +
						'empty. Don\'t outline strokes in Figma ("Outline stroke"/flatten) – export the ' +
						'strokes as strokes.',
				);
			}
		}

		if (strokeWidths.size > 1) {
			visualWarnings.push(
				`${path}: found ${strokeWidths.size} different stroke widths (${[...strokeWidths].join(', ')}). ` +
					'All strokes now share one width, controlled by --visual-stroke-width.',
			);
		}

		// 2. Rewrite colors to currentColor + classes
		walkElements(svg, (element) => {
			cleanClasses(element);
			const { stroke, fill } = element.attributes;
			if (isHardColor(stroke)) {
				const color = normalizeColor(stroke);
				element.attributes.stroke = 'currentColor';
				addClass(element, color === primaryColor ? 'v-stroke' : 'v-accent');
			}
			if (isHardColor(fill)) {
				const color = normalizeColor(fill);
				if (color === primaryColor) {
					element.attributes.fill = 'currentColor';
					addClass(element, 'v-solid');
				} else if (strokeColorCount.has(color)) {
					element.attributes.fill = 'currentColor';
					addClass(element, 'v-accent-solid');
				} else {
					element.attributes.fill = 'none';
					addClass(element, 'v-fill');
				}
			}
			delete element.attributes['stroke-width'];
		});
		return null;
	},
};

export const visualsSvgoConfig: Config = {
	multipass: true,
	js2svg: { pretty: true, indent: '\t', finalNewline: true },
	plugins: [
		'convertStyleToAttrs',
		{
			name: 'preset-default',
			params: {
				overrides: {
					// Keep `currentColor` and avoid color keywords replacing hex values
					convertColors: { currentColor: false, names2hex: true, rgb2hex: true },
				},
			},
		},
		'removeTitle',
		'removeDesc',
		normalizeVisual,
		'removeDimensions',
	],
};
