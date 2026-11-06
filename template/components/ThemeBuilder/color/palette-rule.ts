/**
 * Palette rule of the New Foundation color generator.
 *
 * TypeScript port of `New-Foundation/color-generator/palette-rule.js`. The generator is the
 * source of truth; this port keeps its constants and math unchanged. Differences:
 * - Only the generator functions are ported (no audit/diagnose helpers).
 * - `buildColorMode` returns warnings as structured objects so the UI can translate them.
 * - `buildColorMode` accepts `neutral: true` to build a neutral ramp (grey anchors, no chroma
 *   ceiling), which the original only does for the built-in Grey palette in `buildAll`.
 *
 * Color space: HSLuv / CIELUV LCh. HSLuv L equals CIELUV L*, which is a pure function of
 * luminance. Every color on the same step therefore has the same WCAG contrast.
 */
import { Hsluv } from './hsluv.ts';

const cv = new Hsluv();

// ---------- Conversions ----------
export const getMaxChroma = (h: number, l: number): number => {
	cv.hsluv_l = l;
	cv.calculateBoundingLines(l);
	const c = cv.calcMaxChromaHsluv(h);
	return isFinite(c) ? c : 0;
};

export const lchToHex = (l: number, c: number, h: number): string => {
	cv.lch_l = l;
	cv.lch_c = c;
	cv.lch_h = h;
	cv.lchToHsluv();
	cv.hsluvToHex();
	return cv.hex;
};

export const hsluvOf = (hex: string): { h: number; s: number; l: number } => {
	cv.hex = String(hex).toLowerCase();
	cv.hexToHsluv();
	return { h: cv.hsluv_h, s: cv.hsluv_s, l: cv.hsluv_l };
};

export const hsluvToHex = (h: number, s: number, l: number): string => {
	cv.hsluv_h = h;
	cv.hsluv_s = s;
	cv.hsluv_l = l;
	cv.hsluvToHex();
	return cv.hex;
};

export const chromaOf = (hex: string): number => {
	cv.hex = String(hex).toLowerCase();
	cv.hexToHsluv();
	cv.hsluvToLch();
	return cv.lch_c;
};

export function relLum(hex: string): number {
	let x = String(hex).replace('#', '');
	if (x.length === 3)
		x = x
			.split('')
			.map((c) => c + c)
			.join('');
	const s = [0, 2, 4]
		.map((i) => parseInt(x.slice(i, i + 2), 16) / 255)
		.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
	return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
}

export const contrast = (a: string, b: string): number => {
	const l1 = relLum(a);
	const l2 = relLum(b);
	return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

// ---------- Configuration ----------
/** The contrast ladder: 15 lightness steps (palette/0 … palette/14, dark to light). */
export const LIGHTNESS_STEPS = [4, 8, 14, 20, 26, 32, 40, 50, 60, 70, 80, 90, 94, 96, 98];
/** From this step on, chroma is capped at a shared ceiling. */
export const TINT_FROM = 10;
/** From this step on, the ceiling is a target instead of a cap. */
export const ALIGN_FROM = 11;
/** Neutral axis ends in real black and white. */
export const GREY_ANCHORS: Record<number, string> = { 0: '#000000', 14: '#ffffff' };

type ColorSpec = { h: number; s: number; neutral?: boolean };

/** Built-in hue families (h/s fitted to the Figma file). Used for the shared chroma ceiling. */
export const COLORS: Record<string, ColorSpec> = {
	Grey: { h: 249.09, s: 12.18, neutral: true },
	Brand: { h: 11.47, s: 99.95 },
	Yellow: { h: 69.33, s: 100 },
	Orange: { h: 39.62, s: 100 },
	Red: { h: 11.47, s: 99.95 },
	Burgundy: { h: 0.62, s: 55.72 },
	Pink: { h: 348.68, s: 80.17 },
	Violet: { h: 293.02, s: 54.9 },
	Blue: { h: 258.35, s: 95.89 },
	Cyan: { h: 233.63, s: 91.54 },
	Turquoise: { h: 184.95, s: 100 },
	'Light Green': { h: 115.48, s: 97.0 },
	Green: { h: 124.7, s: 76.69 },
};
const NAMES = Object.keys(COLORS);
const CHROMATIC = NAMES.filter((n) => !COLORS[n].neutral);

const withLightEnd = (five: number[]): number[] => LIGHTNESS_STEPS.slice(0, TINT_FROM).concat(five);

export type LadderVariant = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

/** Alternative lightness ladders of the generator. */
export const VARIANTS: Record<LadderVariant, { steps: number[] }> = {
	A: { steps: withLightEnd([80, 90, 94, 96, 98]) },
	B: { steps: withLightEnd([79, 87, 91, 94, 97]) },
	C: { steps: withLightEnd([77, 84, 89, 93, 96]) },
	D: { steps: withLightEnd([76, 82, 87, 92, 96]) },
	E: { steps: withLightEnd([77, 84, 89, 93, 98]) },
	F: { steps: [0, 6, 12, 16, 24, 32, 40, 50, 60, 70, 80, 88, 92, 96, 100] },
	G: { steps: [0, 6, 12, 16, 24, 32, 40, 50, 60, 70, 77, 84, 89, 93, 100] },
};

// ---------- Ceiling ----------
const ceilingCache = new Map<string, (number | null)[]>();

/** Highest chroma all chromatic hues can reach on a step (minimum of their gamut limits). */
export function chromaCeiling(steps?: number[], tintFrom?: number): (number | null)[] {
	const st = steps || LIGHTNESS_STEPS;
	const tf = tintFrom == null ? TINT_FROM : tintFrom;
	const key = `${st.join(',')}|${tf}`;
	const cached = ceilingCache.get(key);
	if (cached) return cached;
	const result = st.map((l, i) =>
		i < tf ? null : Math.min(...CHROMATIC.map((n) => getMaxChroma(COLORS[n].h, l))),
	);
	ceilingCache.set(key, result);
	return result;
}

// ---------- Generator ----------
export type PaletteOptions = {
	steps?: number[];
	tintFrom?: number;
	alignFrom?: number;
	raw?: boolean;
	separation?: number;
};

const FLARE = 0.005;
const SEPARATION_DL = 3;

function opt(o?: PaletteOptions) {
	const options = o || {};
	return {
		steps: options.steps || LIGHTNESS_STEPS,
		tintFrom: options.tintFrom == null ? TINT_FROM : options.tintFrom,
		alignFrom: options.alignFrom == null ? ALIGN_FROM : options.alignFrom,
		raw: !!options.raw,
		separation: options.separation == null ? SEPARATION_DL : options.separation,
		flare: FLARE,
		chromaScale: 1,
	};
}

/**
 * @param h  HSLuv hue
 * @param s  identity saturation in percent of the gamut boundary (0..100)
 * @param o  ladder options
 * @param anchors  hard overrides per step
 * @param neutral  excludes the color from ceiling and alignment
 */
export function buildPalette(
	h: number,
	s: number,
	o?: PaletteOptions,
	anchors?: Record<number, string> | null,
	neutral?: boolean,
): string[] {
	const c = opt(o);
	const ceiling = c.raw ? [] : chromaCeiling(c.steps, c.tintFrom);
	const achromatic = neutral || s < 1;
	return c.steps.map((l, i) => {
		if (anchors && anchors[i]) return anchors[i];
		const gamut = getMaxChroma(h, l);
		let chroma = gamut * (s / 100);
		const cap = ceiling[i];
		if (cap != null && !achromatic) {
			const t = cap * c.chromaScale;
			chroma = i >= c.alignFrom ? Math.min(t, gamut) : Math.min(chroma, t);
		}
		return lchToHex(l, chroma, h);
	});
}

const lToY = Hsluv.lToY;
const yToL = Hsluv.yToL;
const flareL = (L: number, f: number): number => (f > 0 ? yToL((lToY(L) + f) / (1 + f)) : L);
const perceivedGap = (steps: number[], i: number, j: number, f?: number): number =>
	Math.abs(flareL(steps[j], f == null ? FLARE : f) - flareL(steps[i], f == null ? FLARE : f));

export const ORIGIN_STATES = {
	darker: { hovered: -6.9, pressed: -13.1 },
	lighter: { hovered: 7.9, pressed: 15.5 },
};
export const ORIGIN_FLIP_L = 52;

export type OriginDirection = 'auto' | 'darker' | 'lighter';

export type ColorModeWarning =
	| { type: 'state-gap'; state: 'hovered' | 'pressed'; value: number; threshold: number }
	| { type: 'state-chroma'; state: 'hovered' | 'pressed'; from: number; to: number }
	| { type: 'on-origin-contrast'; value: number };

export type ColorModeInput = string | { origin: string; h?: number; s?: number };

export type ColorModeOptions = PaletteOptions & {
	direction?: OriginDirection;
	/** Builds a neutral ramp (grey anchors, no ceiling). Extension of the original rule. */
	neutral?: boolean;
};

export type ColorMode = {
	hex: string;
	h: number;
	s: number;
	l: number;
	direction: 'darker' | 'lighter';
	palette: string[];
	origin: { default: string; hovered: string; pressed: string };
	onOrigin: string;
	warnings: ColorModeWarning[];
	contrastOnOrigin: number;
};

/**
 * Builds one complete color mode from a brand color: 15 palette values,
 * origin default/hovered/pressed and the on-origin color.
 *
 * @param input hex string OR { origin, h, s } (h/s shape the ramp, origin is the set brand color)
 */
export function buildColorMode(input: ColorModeInput, o?: ColorModeOptions): ColorMode {
	const c = opt(o);
	const spec = typeof input === 'string' ? null : input;
	const hex = (spec ? spec.origin : (input as string)).toLowerCase();
	const rampSrc =
		spec && spec.h != null && isFinite(spec.h)
			? { h: spec.h, s: spec.s != null && isFinite(spec.s) ? spec.s : hsluvOf(hex).s }
			: hsluvOf(hex);
	const base = { h: rampSrc.h, s: rampSrc.s, l: hsluvOf(hex).l };
	const og = hsluvOf(hex);
	const dir: 'darker' | 'lighter' =
		o && o.direction && o.direction !== 'auto'
			? o.direction
			: og.l <= ORIGIN_FLIP_L
				? 'darker'
				: 'lighter';
	const step = ORIGIN_STATES[dir] || ORIGIN_STATES.darker;
	const atL = (dl: number): string => {
		const L = Math.max(0, Math.min(100, og.l + dl));
		return lchToHex(
			L,
			Math.min(getMaxChroma(og.h, L), getMaxChroma(og.h, og.l) * (og.s / 100)),
			og.h,
		);
	};
	const palette = o?.neutral
		? buildPalette(base.h, base.s, c, GREY_ANCHORS, true)
		: buildPalette(base.h, base.s, c, null, false);
	const origin = { default: hex, hovered: atL(step.hovered), pressed: atL(step.pressed) };
	const top = palette[palette.length - 1];
	const bottom = palette[0];
	const onOrigin = contrast(top, origin.default) >= contrast(bottom, origin.default) ? top : bottom;

	const warnings: ColorModeWarning[] = [];
	for (const st of ['hovered', 'pressed'] as const) {
		const g = perceivedGap([og.l, hsluvOf(origin[st]).l], 0, 1, c.flare);
		if (g < c.separation)
			warnings.push({ type: 'state-gap', state: st, value: g, threshold: c.separation });
		if (chromaOf(origin[st]) < chromaOf(origin.default) * 0.5)
			warnings.push({
				type: 'state-chroma',
				state: st,
				from: Math.round(chromaOf(origin.default)),
				to: Math.round(chromaOf(origin[st])),
			});
	}
	const cOn = contrast(onOrigin, origin.default);
	if (cOn < 4.5) warnings.push({ type: 'on-origin-contrast', value: cOn });

	return {
		hex,
		h: base.h,
		s: base.s,
		l: og.l,
		direction: dir,
		palette,
		origin,
		onOrigin,
		warnings,
		contrastOnOrigin: cOn,
	};
}
