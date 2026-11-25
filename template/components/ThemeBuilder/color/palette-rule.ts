/**
 * Palette rule of the New Foundation color generator.
 *
 * TypeScript port of `New-Foundation/color-generator/palette-rule.js`. The generator is the
 * source of truth; this port keeps its constants and math unchanged. Differences:
 * - Only the generator functions are ported (no audit/diagnose helpers).
 * - `buildColorMode` returns warnings as structured objects so the UI can translate them.
 * - `buildColorMode` accepts `neutral: true` to build a neutral ramp (grey anchors, no chroma
 *   ceiling), which the original only does for the built-in Grey palette in `buildAll`.
 * - Tint floor (TINT_FLOOR, 50 %): the light steps keep at least half of each color's own
 *   chroma, plus a hue shift for yellow. This deviates from the generator on purpose and only
 *   changes Yellow, Green and Turquoise. `tintFloor: 0` restores the generator output.
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
/**
 * Tint floor (not part of the generator yet).
 *
 * The shared ceiling is the minimum chroma all hues reach, which red/pink dictate on the light
 * steps. Wide-gamut hues (yellow, green, turquoise) keep only about a third of their own
 * chroma there; yellow then reads beige instead of pastel. With the tint floor (TINT_FLOOR,
 * overridable via `tintFloor`, 0..1) every chromatic color keeps at least that share of its
 * own chroma (at the origin's saturation) on the light steps – the same rule for all hues.
 * 50 % balances color identity against an even look of the levels: step 10 stays at the
 * shared ceiling for every hue unless the transition into the lifted steps needs smoothing.
 * Hues whose gamut is already at the ceiling (red, pink, blue …) do not change; the floor
 * only lifts hues that have room.
 * On top, a yellow hue below YELLOW_TINT_HUE turns apricot when it gets light, so the light
 * steps of such hues rotate towards YELLOW_TINT_HUE (fading out towards ±YELLOW_BAND around
 * YELLOW_HUE). Hues at or above it, e.g. the DB yellow #ffea00, keep their hue.
 * Everything the floor adds is capped at the origin's chroma, so a tint never gets more
 * colorful than the origin. Lightness is untouched: contrast stays identical on every step.
 * `tintFloor: 0` turns the rule off completely (no floor, no hue shift).
 */
export const TINT_FLOOR = 0.5;
export const YELLOW_HUE = 70;
export const YELLOW_BAND = 30;
/** Lowest HSLuv hue a light yellow tint may have without reading apricot. */
export const YELLOW_TINT_HUE = 76;

/** 1 at YELLOW_HUE, cosine falloff to 0 at ±YELLOW_BAND. */
export const yellowWeight = (h: number): number => {
	const d = Math.abs(((h - YELLOW_HUE + 540) % 360) - 180);
	return d >= YELLOW_BAND ? 0 : 0.5 * (1 + Math.cos((Math.PI * d) / YELLOW_BAND));
};

/** Neutral axis ends in real black and white. */
export const GREY_ANCHORS: Record<number, string> = { 0: '#000000', 14: '#ffffff' };

/**
 * Built-in color origins. These hex values are the single source of truth: every ramp
 * (hue, saturation and lightness) is derived from its origin via `hsluvOf`, and the shared
 * chroma ceiling derives its reference hues from the chromatic origins below. Nothing carries
 * pre-fitted h/s constants anymore – an origin is all a palette needs.
 * Red (#ec0016) and Lilac (#aa99ff) are brand colors and fixed. The other origins use round
 * HSL values (e.g. Blue 220/80/40) chosen so every color keeps its name in perceptual hue
 * (OKLCH), in particular Blue and Violet stay clearly apart from Lilac. This deviates from
 * the generator's origins.
 */
export const BUILTIN_ORIGINS: Record<string, string> = {
	Yellow: '#ffea00',
	Orange: '#f58f00',
	Red: '#ec0016',
	Burgundy: '#a1455c',
	Pink: '#eb4799',
	Violet: '#9145a1',
	Blue: '#144bb8',
	Cyan: '#269dd9',
	Turquoise: '#00998c',
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
	/** Chroma floor on the light steps for all hues (0..1, default TINT_FLOOR, 0 = generator). */
	tintFloor?: number;
	/** Upper limit for everything the tint floor adds: the chroma of the origin (LCh). */
	originChroma?: number;
	/**
	 * Experimental, not used by the Theme Builder: no step gets more chroma than the origin,
	 * neither absolutely (origin chroma) nor relatively (origin saturation). Off by default.
	 */
	capAtOrigin?: boolean;
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
		tintFloor: Math.max(0, Math.min(1, options.tintFloor ?? TINT_FLOOR)),
		originChroma: options.originChroma == null ? Infinity : options.originChroma,
		capAtOrigin: !!options.capAtOrigin,
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
	const floorOn = c.tintFloor > 0 && !achromatic;
	const yw = floorOn ? yellowWeight(h) : 0;
	const tones = c.steps.map((l, i) => {
		const tint = floorOn && i >= c.tintFrom;
		// The yellow hue shift ramps in over two steps (half on the first tint step), so the
		// ramp does not jump in hue between the last full step and the first tint.
		const ramp = tint ? Math.min(1, (i - c.tintFrom + 1) / 2) : 0;
		// Only hues below YELLOW_TINT_HUE are rotated (towards green); greener yellows keep theirs.
		const hue = h + Math.max(0, YELLOW_TINT_HUE - h) * yw * ramp;
		const gamut = getMaxChroma(hue, l);
		let chroma = gamut * (s / 100);
		const cap = ceiling[i];
		if (cap != null && !achromatic) {
			const t = cap * c.chromaScale;
			chroma = i >= c.alignFrom ? Math.min(t, gamut) : Math.min(chroma, t);
		}
		// Experimental: no step may be more colorful than the origin. This caps the absolute
		// chroma at the origin's chroma (mid steps of wide-gamut hues) and the relative one at the
		// origin's saturation (the aligned light steps), so a muted origin keeps muted tints.
		if (c.capAtOrigin && !achromatic) {
			chroma = Math.min(chroma, gamut * (s / 100), c.originChroma);
		}
		// Never lift a tint above the origin itself: the floor is capped at the origin's chroma.
		const floor = tint ? Math.min(gamut * (s / 100) * c.tintFloor, c.originChroma) : 0;
		const lifted = floor > chroma;
		if (lifted) chroma = floor;
		return { l, hue, gamut, chroma, lifted };
	});
	// The first tint step sits between the last full step and the floor-lifted steps above.
	// Hues with a wide light gamut (yellow, green) would otherwise dip on it (ceiling) and rise
	// again on the next step (floor). Lifting it to at least the midpoint of its neighbours
	// keeps chroma falling steadily from the last full step into the tints. Only colors whose
	// next step was lifted are touched; colors at the ceiling keep their first tint step.
	const tf = c.tintFrom;
	if (floorOn && tones[tf - 1] && tones[tf + 1]?.lifted) {
		const mid = Math.min((tones[tf - 1].chroma + tones[tf + 1].chroma) / 2, c.originChroma);
		tones[tf].chroma = Math.min(tones[tf].gamut, Math.max(tones[tf].chroma, mid));
	}
	return tones.map(({ l, hue, chroma }, i) =>
		anchors && anchors[i] ? anchors[i] : lchToHex(l, chroma, hue),
	);
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
/**
 * Upper lightness limit (L*) of the vibrant default. Dark hues sit at L* ≈ 64–71 because of the
 * APCA floor above. Wide-gamut hues (yellow, green, turquoise) reach their highest chroma at the
 * tip of the gamut around L* 91 and would turn neon next to them. Capping the lightness keeps
 * them in a shared band and only touches those three; chroma stays free. Not part of the
 * generator.
 */
export const VIBRANT_MAX_L = 85;
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
 * lightness (up to VIBRANT_MAX_L) that maximizes chroma while the on-color stays readable on
 * top (WCAG AA and the APCA floor). Returns the hex.
 */
export function vibrantBase(h: number, sFraction: number, onColor: string): string {
	let best: { l: number; chroma: number; hex: string } | null = null;
	for (let l = 1; l <= VIBRANT_MAX_L; l += 0.5) {
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
	// The tint floor must never make a tint more colorful than the origin itself.
	const paletteOptions = { ...c, originChroma: chromaOf(hex) };
	const palette = o?.neutral
		? buildPalette(base.h, base.s, paletteOptions, GREY_ANCHORS, true)
		: buildPalette(base.h, base.s, paletteOptions, null, false);
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
