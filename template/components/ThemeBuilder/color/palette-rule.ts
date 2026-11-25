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

/**
 * Built-in color origins. These hex values are the single source of truth: every ramp
 * (hue, saturation and lightness) is derived from its origin via `hsluvOf`, and the shared
 * chroma ceiling derives its reference hues from the chromatic origins below. Nothing carries
 * pre-fitted h/s constants anymore – an origin is all a palette needs.
 */
export const BUILTIN_ORIGINS: Record<string, string> = {
	Yellow: '#ffd800',
	Orange: '#f69400',
	Red: '#ec0016',
	Burgundy: '#a9455d',
	Pink: '#e93e8f',
	Violet: '#814997',
	Blue: '#1455c0',
	Cyan: '#309fd1',
	Turquoise: '#00a099',
	Lilac: '#aa99ff',
	Green: '#80bf40',
};

/** Hues that define the shared chroma ceiling, derived from the chromatic built-in origins. */
const CEILING_HUES = Object.values(BUILTIN_ORIGINS).map((hex) => hsluvOf(hex).h);

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
		i < tf ? null : Math.min(...CEILING_HUES.map((h) => getMaxChroma(h, l))),
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

export const ORIGIN_FLIP_L = 52;

/**
 * Minimum contrast ratio between the default and the hovered state of a color. Hovered is the
 * only interaction state (there is no pressed state), so it has to be clearly visible.
 */
export const HOVER_MIN_CONTRAST = 1.5;

/**
 * Finds the hovered state of a color: the smallest lightness shift in the preferred direction
 * whose result reaches HOVER_MIN_CONTRAST against the default. When the preferred direction
 * runs into black or white before reaching it (e.g. a very dark origin cannot get darker), the
 * opposite direction is used. `isUsable` can reject candidates, e.g. an unreadable on-color.
 */
export function hoveredState(
	defaultHex: string,
	defaultL: number,
	atL: (lightness: number) => string,
	preferred: 1 | -1,
	isUsable: (hex: string) => boolean = () => true,
): string {
	for (const sign of [preferred, preferred === 1 ? -1 : 1] as const) {
		for (let shift = 0.5; shift <= 100; shift += 0.5) {
			const lightness = Math.max(0, Math.min(100, defaultL + sign * shift));
			const hex = atL(lightness);
			if (contrast(defaultHex, hex) >= HOVER_MIN_CONTRAST && isUsable(hex)) return hex;
			if (lightness === 0 || lightness === 100) break;
		}
	}
	return defaultHex;
}

export type OriginDirection = 'auto' | 'darker' | 'lighter';

export type ColorModeWarning =
	| { type: 'state-gap'; state: 'hovered'; value: number; threshold: number }
	| { type: 'state-chroma'; state: 'hovered'; from: number; to: number }
	| { type: 'on-origin-contrast'; value: number };

export type ColorModeInput = string | { origin: string; h?: number; s?: number };

export type ColorModeOptions = PaletteOptions & {
	direction?: OriginDirection;
	/** Builds a neutral ramp (grey anchors, no ceiling). Extension of the original rule. */
	neutral?: boolean;
};

export type ColorStates = { default: string; hovered: string };

export type ColorMode = {
	hex: string;
	h: number;
	s: number;
	l: number;
	direction: 'darker' | 'lighter';
	palette: string[];
	origin: ColorStates;
	/**
	 * The most colorful usable form of the color: the lightness where the color reaches its
	 * highest chroma at the origin's own saturation while black text still meets AA (>= 4.5:1).
	 * The same in light and dark mode: vibrant is a self-contained surface with its own
	 * on-color. Hovered shifts lightness until it reaches HOVER_MIN_CONTRAST. Keeps muted identities
	 * muted (uses the origin's saturation, not full chroma).
	 */
	vibrant: ColorStates;
	onOrigin: string;
	warnings: ColorModeWarning[];
	contrastOnOrigin: number;
};

/** The on-color of vibrant must meet WCAG AA for body text. */
const VIBRANT_MIN_CONTRAST = 4.5;
/**
 * Perceptual floor for the on-color of vibrant (APCA |Lc|). WCAG 2 ratios overrate black text
 * on saturated mid tones like red or blue, so vibrant also has to pass this APCA threshold.
 */
export const VIBRANT_MIN_APCA = 50;
/** The on-color of vibrant, identical in light and dark mode. */
export const ON_VIBRANT = '#000000';

/**
 * APCA lightness contrast (SAPC 0.0.98G-4g) of text on a background, as |Lc| (0..~108).
 * Used as a perceptual check next to the WCAG 2 ratio.
 */
export function apcaContrast(text: string, background: string): number {
	const luminance = (hex: string): number => {
		const x = String(hex).replace('#', '');
		const [r, g, b] = [0, 2, 4].map((i) => Math.pow(parseInt(x.slice(i, i + 2), 16) / 255, 2.4));
		const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
		return y < 0.022 ? y + Math.pow(0.022 - y, 1.414) : y;
	};
	const yText = luminance(text);
	const yBackground = luminance(background);
	if (Math.abs(yBackground - yText) < 0.0005) return 0;
	if (yBackground > yText) {
		const sapc = (Math.pow(yBackground, 0.56) - Math.pow(yText, 0.57)) * 1.14;
		return sapc < 0.1 ? 0 : (sapc - 0.027) * 100;
	}
	const sapc = (Math.pow(yBackground, 0.65) - Math.pow(yText, 0.62)) * 1.14;
	return sapc > -0.1 ? 0 : -(sapc + 0.027) * 100;
}

/** Whether the on-color is readable on a vibrant surface: WCAG AA and the APCA floor. */
const vibrantReadableOn = (onColor: string, background: string): boolean =>
	contrast(onColor, background) >= VIBRANT_MIN_CONTRAST &&
	apcaContrast(onColor, background) >= VIBRANT_MIN_APCA;

/**
 * Finds the vibrant base for a hue at a given saturation fraction (0..1 of the gamut): the
 * lightness that maximizes chroma while the on-color stays readable on top (WCAG AA and the
 * APCA floor). Returns the hex.
 */
export function vibrantBase(h: number, sFraction: number, onColor: string): string {
	let best: { l: number; chroma: number; hex: string } | null = null;
	for (let l = 1; l <= 99; l += 0.5) {
		const chroma = getMaxChroma(h, l) * sFraction;
		const hex = lchToHex(l, chroma, h);
		if (!vibrantReadableOn(onColor, hex)) continue;
		if (!best || chroma > best.chroma) best = { l, chroma, hex };
	}
	// Fallback: if no lightness satisfies AA at this saturation (very rare), use the origin
	// flip lightness at the same saturation.
	return best ? best.hex : lchToHex(ORIGIN_FLIP_L, getMaxChroma(h, ORIGIN_FLIP_L) * sFraction, h);
}

/**
 * Builds one complete color mode from a brand color: 15 palette values,
 * origin default/hovered and the on-origin color.
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
	const atL = (L: number): string =>
		lchToHex(L, Math.min(getMaxChroma(og.h, L), getMaxChroma(og.h, og.l) * (og.s / 100)), og.h);
	const palette = o?.neutral
		? buildPalette(base.h, base.s, c, GREY_ANCHORS, true)
		: buildPalette(base.h, base.s, c, null, false);
	// Hovered is the only state: the smallest shift that reaches HOVER_MIN_CONTRAST, in the
	// preferred direction (darker for dark origins, lighter for light ones) or the other one when
	// the preferred direction hits black or white first.
	const origin = {
		default: hex,
		hovered: hoveredState(hex, og.l, atL, dir === 'darker' ? -1 : 1),
	};

	// Vibrant: most colorful usable form at the origin's own saturation, with black text readable
	// on every state (WCAG >= 4.5:1 and APCA |Lc| >= VIBRANT_MIN_APCA), identical in light and dark
	// mode. Every state is clamped to the same saturation so a muted color stays muted. Hovered
	// reaches HOVER_MIN_CONTRAST against the default: darker is preferred (more vivid), lighter is
	// used when darker would break readability for black text.
	// The ramp's effective saturation is used (already capped for neutral), so vibrant carries
	// the same undertone as the palette instead of snapping to pure grey.
	const sFraction = base.s / 100;
	const vibrantDefault = vibrantBase(base.h, sFraction, ON_VIBRANT);
	const vibrantAtL = (L: number): string =>
		lchToHex(L, getMaxChroma(base.h, L) * sFraction, base.h);
	const vibrant = {
		default: vibrantDefault,
		hovered: hoveredState(vibrantDefault, hsluvOf(vibrantDefault).l, vibrantAtL, -1, (candidate) =>
			vibrantReadableOn(ON_VIBRANT, candidate),
		),
	};
	const top = palette[palette.length - 1];
	const bottom = palette[0];
	const onOrigin = contrast(top, origin.default) >= contrast(bottom, origin.default) ? top : bottom;

	const warnings: ColorModeWarning[] = [];
	for (const st of ['hovered'] as const) {
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
		vibrant,
		onOrigin,
		warnings,
		contrastOnOrigin: cOn,
	};
}
