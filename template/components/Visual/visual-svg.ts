/**
 * Helpers for the `Visual` component: types, token resolution, SVG parsing and ID prefixing.
 */
import { visuals, type VisualName } from '@template/visuals';

export type { VisualName };

/** DB UX color families (`--db-<family>-…`). */
export const VISUAL_COLOR_FAMILIES = [
	'adaptive',
	'brand',
	'neutral',
	'informational',
	'successful',
	'warning',
	'critical',
	'blue',
	'burgundy',
	'cyan',
	'green',
	'orange',
	'pink',
	'red',
	'turquoise',
	'violet',
	'yellow',
] as const;
export type VisualColorFamily = (typeof VISUAL_COLOR_FAMILIES)[number];

export const VISUAL_EMPHASIS_LEVELS = [50, 60, 70, 80, 90, 100] as const;
export type VisualEmphasis = (typeof VISUAL_EMPHASIS_LEVELS)[number];

/** DB UX scale used by `--db-border-width-*` and `--db-sizing-*`. */
export const VISUAL_SCALE = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
export type VisualScale = (typeof VISUAL_SCALE)[number];

/**
 * Color value for `stroke`, `accent` and `fill`. Only DB UX tokens are accepted – no hex values.
 * - `critical` → `var(--db-critical-on-bg-basic-emphasis-100-default)`
 * - `critical-emphasis-60` → `var(--db-critical-on-bg-basic-emphasis-60-default)`
 * - `brand-origin` → `var(--db-brand-origin-default)`
 * - `--db-…` / `var(--db-…)` → any DB UX color token
 * - `currentColor` → inherits the text color
 */
export type VisualColor =
	| VisualColorFamily
	| `${VisualColorFamily}-emphasis-${VisualEmphasis}`
	| `${VisualColorFamily}-origin`
	| `--db-${string}`
	| `var(--db-${string})`
	| 'currentColor';

/** Stroke width: number (CSS px), DB UX border width scale or `var(--db-border-width-…)`. */
export type VisualStrokeWidth =
	number | `${number}` | VisualScale | `var(--db-border-width-${string})`;

/**
 * Stroke width behavior:
 * - `fixed`: constant stroke width in screen px at every size (`vector-effect: non-scaling-stroke`)
 * - `scale`: stroke width in viewBox units, grows and shrinks with the rendered size
 */
export const VISUAL_STROKE_SCALING = ['fixed', 'scale'] as const;
export type VisualStrokeScaling = (typeof VISUAL_STROKE_SCALING)[number];

type VisualLengthUnit = 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh' | 'svw' | 'cqi';

/** Size: DB UX sizing scale, `var(--db-…)`, a CSS length (e.g. `120px`, `50%`) or `auto`. */
export type VisualSize =
	VisualScale | `var(--db-${string})` | `${number}${VisualLengthUnit}` | 'auto';

const TOKEN_NAME = /^--db-[a-z0-9-]+$/;
const TOKEN_VAR = /^var\(--db-[a-z0-9-]+\)$/;
const CSS_LENGTH = /^\d+(\.\d+)?(px|rem|em|%|vw|vh|svw|cqi)$/;
const NUMBER = /^\d+(\.\d+)?$/;

function isColorFamily(value: string): value is VisualColorFamily {
	return (VISUAL_COLOR_FAMILIES as readonly string[]).includes(value);
}

function isScale(value: string): value is VisualScale {
	return (VISUAL_SCALE as readonly string[]).includes(value);
}

/** Maps a `VisualColor` to a CSS value. Throws for anything that is not a DB UX token. */
export function resolveVisualColor(value: string): string {
	if (value === 'currentColor') return value;
	if (isColorFamily(value)) return `var(--db-${value}-on-bg-basic-emphasis-100-default)`;

	const emphasis = value.match(/^([a-z]+)-emphasis-(\d+)$/);
	if (
		emphasis &&
		isColorFamily(emphasis[1]) &&
		(VISUAL_EMPHASIS_LEVELS as readonly number[]).includes(Number(emphasis[2]))
	) {
		return `var(--db-${emphasis[1]}-on-bg-basic-emphasis-${emphasis[2]}-default)`;
	}

	const origin = value.match(/^([a-z]+)-origin$/);
	if (origin && isColorFamily(origin[1])) return `var(--db-${origin[1]}-origin-default)`;

	if (TOKEN_NAME.test(value)) return `var(${value})`;
	if (TOKEN_VAR.test(value)) return value;

	throw new Error(
		`[Visual] Invalid color "${value}". Use a DB UX token, e.g. "critical", "brand-origin", ` +
			'"neutral-emphasis-70", "--db-…" or "var(--db-…)". Hex values are not supported.',
	);
}

/** Maps a `VisualStrokeWidth` to a CSS value. */
export function resolveVisualStrokeWidth(value: number | string): string {
	if (typeof value === 'number') {
		if (Number.isFinite(value) && value >= 0) return String(value);
	} else {
		if (NUMBER.test(value)) return value;
		if (isScale(value)) return `var(--db-border-width-${value})`;
		if (/^var\(--db-border-width-[a-z0-9-]+\)$/.test(value)) return value;
	}
	throw new Error(
		`[Visual] Invalid strokeWidth "${value}". Use a number (px), a border width ("3xs"–"3xl") ` +
			'or "var(--db-border-width-…)".',
	);
}

/** Maps a `VisualSize` to a CSS value. */
export function resolveVisualSize(value: string): string {
	if (value === 'auto') return value;
	if (isScale(value)) return `var(--db-sizing-${value})`;
	if (TOKEN_VAR.test(value) || CSS_LENGTH.test(value)) return value;
	throw new Error(
		`[Visual] Invalid size "${value}". Use a sizing token ("3xs"–"3xl"), "var(--db-…)", ` +
			'a CSS length (e.g. "120px", "50%") or "auto".',
	);
}

/** Root attributes kept from the source `<svg>`. Everything else is controlled by the component. */
const ROOT_ATTRIBUTES = ['xmlns', 'viewBox', 'fill'];

export interface ParsedVisualSvg {
	attributes: Record<string, string>;
	inner: string;
}

const parsedCache = new Map<VisualName, ParsedVisualSvg>();

/** Returns the registered names, used for error messages. */
export function getVisualNames(): string[] {
	return Object.keys(visuals);
}

export function isVisualName(name: string): name is VisualName {
	return Object.hasOwn(visuals, name);
}

/** Splits a visual source into kept root attributes and inner markup (memoized per name). */
export function parseVisualSvg(name: VisualName): ParsedVisualSvg {
	const cached = parsedCache.get(name);
	if (cached) return cached;

	const source: string = visuals[name];
	const match = source.match(/<svg\b([^>]*)>([\s\S]*)<\/svg>/);
	if (!match) throw new Error(`[Visual] "${name}" has no root <svg> element.`);

	const attributes: Record<string, string> = {};
	for (const [, key, value] of match[1].matchAll(/([\w:-]+)="([^"]*)"/g)) {
		if (ROOT_ATTRIBUTES.includes(key)) attributes[key] = value;
	}
	if (!attributes.viewBox) {
		throw new Error(`[Visual] "${name}" has no viewBox. Run \`pnpm run visuals:optimize\`.`);
	}

	// Titles/descriptions come from the `label` prop only
	const inner = match[2]
		.replace(/<title\b[\s\S]*?<\/title>/g, '')
		.replace(/<desc\b[\s\S]*?<\/desc>/g, '')
		.trim();

	const parsed = { attributes, inner };
	parsedCache.set(name, parsed);
	return parsed;
}

let visualCounter = 0;

/** Returns a page-unique ID prefix, e.g. `visual-foundation-3`. */
export function nextVisualPrefix(name: VisualName): string {
	visualCounter += 1;
	return `visual-${name}-${visualCounter}`;
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Prefixes every ID inside the markup and all references to it (`url(#…)`, `href="#…"`,
 * `xlink:href="#…"`, `aria-*`), so the same visual can appear several times on one page.
 */
export function prefixSvgIds(inner: string, prefix: string): string {
	const ids = new Set([...inner.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id));
	if (ids.size === 0) return inner;
	const idPattern = [...ids].map(escapeRegExp).join('|');
	const prefixed = (id: string) => `${prefix}-${id}`;

	return inner
		.replace(
			new RegExp(`\\bid="(${idPattern})"`, 'g'),
			(_match, id: string) => `id="${prefixed(id)}"`,
		)
		.replace(
			new RegExp(`url\\(\\s*['"]?#(${idPattern})['"]?\\s*\\)`, 'g'),
			(_match, id: string) => `url(#${prefixed(id)})`,
		)
		.replace(
			new RegExp(`\\b((?:xlink:)?href)="#(${idPattern})"`, 'g'),
			(_match, attribute: string, id: string) => `${attribute}="#${prefixed(id)}"`,
		)
		.replace(/\b(aria-[a-z]+)="([^"]*)"/g, (match, attribute: string, value: string) => {
			const tokens = value.split(/\s+/);
			if (!tokens.some((token) => ids.has(token))) return match;
			return `${attribute}="${tokens.map((token) => (ids.has(token) ? prefixed(token) : token)).join(' ')}"`;
		});
}
