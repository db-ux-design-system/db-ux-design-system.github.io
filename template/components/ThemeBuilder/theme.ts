/**
 * Theme model of the Theme Builder.
 *
 * A theme config is turned into the same CSS custom properties that `@db-ux/db-theme`
 * declares (palette, origin and on-origin per color, border radius, font families).
 * The semantic tokens (`--db-{color}-bg-*`, `--db-adaptive-*`) are derived by
 * `@db-ux/core-components`, so overriding these inputs on `:root` is enough.
 */
import {
	buildColorMode,
	contrast,
	hsluvOf,
	hsluvToHex,
	ON_VIBRANT,
	type ColorMode,
	type ColorStates,
	type OriginDirection,
} from './color/palette-rule.ts';
import { ADAPTIVE_COLOR_TOKENS } from './color/adaptive-tokens.ts';

/**
 * Default ramp saturation for a neutral color family. A dark origin like #090F1B carries a high
 * derived saturation (~52), which would tint the light steps blue. Capping the neutral ramp
 * at this value keeps the grey steps neutral with only a faint, constant cool undertone.
 * Editable per theme via the Neutral saturation input in the builder.
 */
export const NEUTRAL_RAMP_SATURATION = 15;

/**
 * The color families of the New Foundation (Figma collection "🎨 Color") that the DB theme
 * ships tokens for. Their origin can be changed, they can be removed and further families can
 * be added with a name and an origin. Semantic colors point at one of them. The DB theme
 * already ships the adaptive token set for these, so the builder does not re-emit it for them
 * (see `emitAdaptiveTokens`).
 */
export const BUILTIN_FAMILY_KEYS = [
	'yellow',
	'orange',
	'red',
	'burgundy',
	'pink',
	'violet',
	'blue',
	'cyan',
	'turquoise',
	'green',
] as const;
export type BuiltinFamilyKey = (typeof BUILTIN_FAMILY_KEYS)[number];

/**
 * Families that are seeded like a manually added color: the DB theme does not ship tokens for
 * them, so they carry the adaptive token set. Grey is the neutral family (its ramp saturation is
 * capped, see `FamilyConfig.neutral`); Lilac is part of the New Foundation palette but is not a
 * core color of the DB theme.
 */
export const DEFAULT_CUSTOM_FAMILY_KEYS = ['grey', 'lilac'] as const;
export type DefaultCustomFamilyKey = (typeof DEFAULT_CUSTOM_FAMILY_KEYS)[number];

/** Every family key the builder knows a default origin/name for (built-in + default custom). */
export type SeededFamilyKey = BuiltinFamilyKey | DefaultCustomFamilyKey;
/** Key of a built-in or a custom family; also the CSS prefix (`--db-<key>-0`). */
export type FamilyKey = string;

/**
 * A color family in the config. Every family can be removed and can carry a separate dark mode
 * origin. `builtin` only says that the DB theme already ships the adaptive token set for it.
 * `name` is only used for custom families. A `neutral` family caps its ramp saturation at `s`
 * instead of using the origin's own saturation, so the grey steps stay neutral.
 */
export type FamilyConfig = ColorConfig & {
	key: FamilyKey;
	name: string;
	builtin: boolean;
	neutral?: boolean;
};

/** Primary and neutral are the main colors: no palettes of their own, but aliases of a family. */
export const MAIN_COLOR_KEYS = ['brand', 'neutral'] as const;
/** Status colors, aliases of a family as well. */
export const STATUS_COLOR_KEYS = ['informational', 'successful', 'warning', 'critical'] as const;
/**
 * Semantic colors are no palettes of their own, but an alias of a color family. `brand`
 * (labelled Primary) and `neutral` keep their CSS prefix, so the DB theme tokens stay valid.
 */
export const SEMANTIC_KEYS = [...MAIN_COLOR_KEYS, ...STATUS_COLOR_KEYS] as const;
export type SemanticKey = (typeof SEMANTIC_KEYS)[number];

export const SEMANTIC_DEFAULTS: Record<SemanticKey, FamilyKey> = {
	brand: 'red',
	neutral: 'grey',
	informational: 'blue',
	successful: 'green',
	warning: 'orange',
	critical: 'red',
};

type Family = {
	origin: string;
	/** Neutral family: the ramp saturation is capped at `NEUTRAL_RAMP_SATURATION`. */
	neutral?: boolean;
};

/**
 * Seeded families: only an origin. Ramp hue, saturation and lightness are derived from the
 * origin by the palette rule – no pre-fitted h/s constants – and so is the hovered state, which
 * reaches a minimum contrast of 1.5:1 against the default. The neutral family is the exception:
 * it keeps a capped saturation.
 */
const FAMILIES: Record<SeededFamilyKey, Family> = {
	grey: { origin: '#090f1b', neutral: true },
	yellow: { origin: '#ffea00' },
	orange: { origin: '#f58f00' },
	red: { origin: '#ec0016' },
	burgundy: { origin: '#a1455c' },
	pink: { origin: '#eb4799' },
	violet: { origin: '#9145a1' },
	blue: { origin: '#144bb8' },
	cyan: { origin: '#269dd9' },
	turquoise: { origin: '#00998c' },
	green: { origin: '#80bf40' },
	lilac: { origin: '#aa99ff' },
};

const SEEDED_FAMILY_NAMES: Record<SeededFamilyKey, string> = {
	grey: 'Grey',
	yellow: 'Yellow',
	orange: 'Orange',
	red: 'Red',
	burgundy: 'Burgundy',
	pink: 'Pink',
	violet: 'Violet',
	blue: 'Blue',
	cyan: 'Cyan',
	turquoise: 'Turquoise',
	green: 'Green',
	lilac: 'Lilac',
};

const seededFamily = (key: SeededFamilyKey, builtin: boolean): FamilyConfig => {
	const { origin, neutral } = FAMILIES[key];
	return {
		key,
		name: SEEDED_FAMILY_NAMES[key],
		builtin,
		origin,
		// Grey starts with the saturation cap already on, so it stays neutral out of the box
		...(neutral ? { neutral: true, saturationCap: NEUTRAL_RAMP_SATURATION } : {}),
		direction: 'auto',
	};
};

const isSeededFamily = (key: string): key is SeededFamilyKey => key in FAMILIES;

/**
 * The families a fresh config starts with: Grey, the families the DB theme ships tokens for and
 * Lilac. All of them can be removed; the adaptive token set is only emitted for the ones the DB
 * theme does not ship (Grey, Lilac and every added family).
 */
export const DEFAULT_FAMILIES: FamilyConfig[] = [
	seededFamily('grey', false),
	...BUILTIN_FAMILY_KEYS.map((key) => seededFamily(key, true)),
	seededFamily('lilac', false),
];

/**
 * Keys that already carry tokens in the DB UX packages. A custom family must not use them,
 * otherwise its palette would overwrite unrelated tokens.
 */
const RESERVED_KEYS = new Set<string>([
	...SEMANTIC_KEYS,
	'adaptive',
	'base',
	'border',
	'color',
	'container',
	'elevation',
	'focus',
	'font',
	'icon',
	'light-green',
	'logo',
	'opacity',
	'screen',
	'sizing',
	'spacing',
	'transition',
	'type',
	'typography',
	'wcag',
]);

/** Turns a family name into a CSS-safe key, e.g. "Mint Grün" → "mint-gruen". */
export const familyKeyFromName = (name: string): string =>
	name
		.trim()
		.toLowerCase()
		.replace(/ä/g, 'ae')
		.replace(/ö/g, 'oe')
		.replace(/ü/g, 'ue')
		.replace(/ß/g, 'ss')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/^[0-9-]+/, '')
		.slice(0, 32);

export type FamilyNameError = 'empty' | 'reserved' | 'duplicate';

/**
 * A family name is rejected when it contains a CSS comment terminator or a non-printable
 * character. `familyKeyFromName` only shapes the key; the name itself is kept verbatim and
 * lands in the exported CSS comment, so these have to be caught on the name, not the key.
 */
const hasUnsafeNameChars = (name: string): boolean =>
	name.includes('*/') || /[\u0000-\u001f\u007f]/.test(name);

/**
 * The key is a dash path; its first segment must not be a reserved color key. Otherwise a
 * key like `neutral-2` collides with the built-in `neutral` color in the Style Dictionary
 * export (`db.neutral.2`) and drops tokens.
 */
const hasReservedFirstSegment = (key: string): boolean => RESERVED_KEYS.has(key.split('-')[0]);

/** Validates the name of a new family against the reserved and existing keys. */
export const validateFamilyName = (
	name: string,
	families: readonly FamilyConfig[],
): FamilyNameError | undefined => {
	const key = familyKeyFromName(name);
	if (!key) return 'empty';
	if (hasUnsafeNameChars(name)) return 'reserved';
	if (RESERVED_KEYS.has(key) || hasReservedFirstSegment(key)) return 'reserved';
	if (families.some((family) => family.key === key)) return 'duplicate';
	return undefined;
};

export type ColorConfig = {
	/** The origin color as 6-digit hex. */
	origin: string;
	/**
	 * Optional separate origin for dark mode. Lets the dark scheme use a different color,
	 * e.g. a light one so it stays visible on a dark background.
	 */
	originDark?: string;
	/** Optional ramp hue/saturation (HSLuv). If not set, both are derived from the origin. */
	h?: number;
	s?: number;
	/**
	 * Optional ceiling (0-100) on the ramp saturation (HSLuv), opt-in per family. A tinted
	 * origin (e.g. a dark blue-black) is damped to this value instead of using its own
	 * saturation, so the steps keep only a faint, constant undertone – this is how the
	 * built-in Grey family stays neutral despite a tinted origin.
	 */
	saturationCap?: number;
	direction: OriginDirection;
};

export const DENSITIES = ['functional', 'regular', 'expressive'] as const;
export type Density = (typeof DENSITIES)[number];

export const MODES = ['light', 'dark'] as const;
export type Mode = (typeof MODES)[number];

export const RADII = ['none', 'small', 'medium', 'large', 'full'] as const;
export type Radius = (typeof RADII)[number];

export const FONTS = ['db', 'system', 'humanist', 'geometric', 'serif', 'rounded', 'mono'] as const;
export type Font = (typeof FONTS)[number];

/** `db` uses the DB Theme Icons, `lucide` the white label icons of the Core Foundation. */
export const ICON_LIBRARIES = ['db', 'lucide'] as const;
export type IconLibrary = (typeof ICON_LIBRARIES)[number];

export const PRESETS = ['db', 'station', 's-bahn', 'neutral'] as const;
export type Preset = (typeof PRESETS)[number] | 'custom';

export type ThemeConfig = {
	preset: Preset;
	families: FamilyConfig[];
	semantic: Record<SemanticKey, FamilyKey>;
	radius: Radius;
	headingFont: Font;
	bodyFont: Font;
	icons: IconLibrary;
	density: Density;
	mode: Mode;
};

/** The size steps that carry a corner radius, from smallest to largest component. */
const RADIUS_SIZES = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

/** `xs` is the step the form controls use (Button, Input, Tag), `sm`+ the card-like surfaces. */
const RADIUS_BASE_INDEX = RADIUS_SIZES.indexOf('xs');

/**
 * Corner radius per step, in rem.
 *
 * Except for `none` (all 0) and `full` (all the same, so single-line controls turn into
 * pills), the steps are staggered: a larger size is the next-smaller one plus a spacing
 * increment. This follows the DB nesting rule – an outer radius is the inner radius plus the
 * gap between them – so a button inside a card has the smaller corner and the two stay
 * concentric. `base` is the radius of the control step (`xs`); `step` is the increment.
 *
 * The values are a design choice for the builder, not the token values of the DB theme.
 */
const RADIUS_SCALE: Record<Radius, { base: number; step: number } | number> = {
	none: 0,
	small: { base: 0.125, step: 0.125 },
	medium: { base: 0.25, step: 0.25 },
	large: { base: 0.5, step: 0.375 },
	// Larger than half the height of any single-line control, so those become pills
	full: 1.5,
};

/** Resolves the radius for one size step, so larger surfaces get the staggered larger radius. */
const radiusForSize = (radius: Radius, index: number): number => {
	const value = RADIUS_SCALE[radius];
	if (typeof value === 'number') return value;
	// Steps at or below the control step share the base radius; above it they grow per step
	const stepsAbove = Math.max(0, index - RADIUS_BASE_INDEX);
	return Math.round((value.base + stepsAbove * value.step) * 10000) / 10000;
};

/** Font stacks use locally installed fonts only, so no font file is loaded from third parties. */
const FONT_STACKS: Record<Font, { head: string; sans: string }> = {
	db: {
		head: '"DB Neo Screen Head", helvetica, arial, sans-serif',
		sans: '"DB Neo Screen Sans", helvetica, arial, sans-serif',
	},
	system: {
		head: 'system-ui, sans-serif',
		sans: 'system-ui, sans-serif',
	},
	humanist: {
		head: 'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif',
		sans: 'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif',
	},
	geometric: {
		head: 'Avenir, Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif',
		sans: 'Avenir, Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif',
	},
	serif: {
		head: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif',
		sans: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif',
	},
	rounded: {
		head: 'ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT", Calibri, source-sans-pro, sans-serif',
		sans: 'ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT", Calibri, source-sans-pro, sans-serif',
	},
	mono: {
		head: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace',
		sans: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace',
	},
};

/** Neutral origin tinted towards a hue, at the lightness of the DB neutral origin. */
const tintedNeutral = (hue: number, saturation: number): string =>
	hsluvToHex(hue, saturation, hsluvOf('#646973').l);

/** A family that only carries a name and an origin, e.g. the primary color of a sub-brand. */
const brandFamily = (
	key: FamilyKey,
	name: string,
	origin: string,
	originDark?: string,
): FamilyConfig => ({
	key,
	name,
	builtin: false,
	origin,
	...(originDark ? { originDark } : {}),
	direction: 'auto',
});

/** The default families with the grey origin replaced, keeping the capped ramp saturation. */
const familiesWithGrey = (origin: string): FamilyConfig[] =>
	DEFAULT_FAMILIES.map((family) =>
		family.key === 'grey' ? { ...family, origin, h: hsluvOf(origin).h } : family,
	);

type PresetDefinition = Omit<ThemeConfig, 'preset' | 'density' | 'mode'>;

/**
 * Shape, typography and supporting colors of the DB theme. The DB sub-brands are
 * identical to it and only swap the primary color, so every component, semantic color,
 * density and font stays the same – only the primary hue changes.
 */
const DB_BASE: PresetDefinition = {
	families: DEFAULT_FAMILIES,
	semantic: SEMANTIC_DEFAULTS,
	radius: 'none',
	headingFont: 'db',
	bodyFont: 'db',
	icons: 'db',
};

export const PRESET_DEFINITIONS: Record<Exclude<Preset, 'custom'>, PresetDefinition> = {
	db: DB_BASE,
	station: {
		...DB_BASE,
		families: [...DEFAULT_FAMILIES, brandFamily('station', 'Station', '#17217c')],
		semantic: { ...SEMANTIC_DEFAULTS, brand: 'station' },
	},
	's-bahn': {
		...DB_BASE,
		families: [...DEFAULT_FAMILIES, brandFamily('s-bahn', 'S-Bahn', '#408335')],
		semantic: { ...SEMANTIC_DEFAULTS, brand: 's-bahn' },
	},
	neutral: {
		...DB_BASE,
		// This preset uses a pure black primary and grey instead of the tinted Cold Black. Dark
		// mode uses a white primary, so it stays visible on the dark background.
		families: [...familiesWithGrey('#000000'), brandFamily('black', 'Black', '#000000', '#ffffff')],
		semantic: { ...SEMANTIC_DEFAULTS, brand: 'black' },
	},
};

export const applyPreset = (
	preset: Exclude<Preset, 'custom'>,
	current: Pick<ThemeConfig, 'density' | 'mode'>,
): ThemeConfig => {
	const definition = PRESET_DEFINITIONS[preset];
	return {
		...definition,
		families: structuredClone(definition.families),
		semantic: { ...definition.semantic },
		preset,
		density: current.density,
		mode: current.mode,
	};
};

export const DEFAULT_CONFIG: ThemeConfig = applyPreset('db', { density: 'regular', mode: 'light' });

const HEX_PATTERN = /^#[0-9a-f]{6}$/i;
export const isHex = (value: unknown): value is string =>
	typeof value === 'string' && HEX_PATTERN.test(value);

export type ThemeResult = {
	tokens: Record<string, string>;
	/** Generated mode per family key (palette, origin states, contrast). */
	familyModes: Record<FamilyKey, ColorMode>;
};

const PALETTE_STEPS = Array.from({ length: 15 }, (_, index) => index);
const SCHEMES = ['light', 'dark'] as const;
const STATES = ['default', 'hovered'] as const;

/**
 * The scheme-less origin aggregators. The design system exposes `--db-<c>-origin-default`
 * (and hovered, plus on-origin-default) as `light-dark(...)` over the per-scheme
 * values the builder emits, so a family can be used without picking a mode. Suffix → value.
 */
const ORIGIN_AGGREGATORS: ReadonlyArray<readonly [string, (c: string) => string]> = [
	...STATES.map(
		(state) =>
			[
				`origin-${state}`,
				(c: string) =>
					`light-dark(var(--db-${c}-origin-light-${state}), var(--db-${c}-origin-dark-${state}))`,
			] as const,
	),
	[
		'on-origin-default',
		(c: string) =>
			`light-dark(var(--db-${c}-on-origin-light-default), var(--db-${c}-on-origin-dark-default))`,
	],
];

/**
 * Vibrant tokens (`vibrant-default|hovered`, `on-vibrant-default`). Identical in light
 * and dark mode: vibrant is a self-contained surface with black as its on-color, so there is
 * no per-scheme split and no `light-dark(...)` aggregator.
 */
const VIBRANT_TOKEN_SUFFIXES = [...STATES.map((state) => `vibrant-${state}`), 'on-vibrant-default'];

/**
 * Emits the vibrant tokens of one color key for every color (core colors and families), since
 * the DB theme does not ship them yet.
 */
const emitVibrantTokens = (
	tokens: Record<string, string>,
	key: string,
	vibrant: ColorStates,
): void => {
	for (const state of STATES) tokens[`--db-${key}-vibrant-${state}`] = vibrant[state];
	tokens[`--db-${key}-on-vibrant-default`] = ON_VIBRANT;
};

/**
 * Emits the aggregated origin tokens and the full adaptive semantic set (`bg-*`, `on-bg-*`)
 * for one color key, so a manually added family is usable like a built-in design system color.
 * Only called for custom families – the built-in families and the core colors already ship
 * this set with the DB theme.
 */
const emitAdaptiveTokens = (tokens: Record<string, string>, key: string): void => {
	for (const [suffix, value] of ORIGIN_AGGREGATORS) tokens[`--db-${key}-${suffix}`] = value(key);
	for (const [suffix, value] of ADAPTIVE_COLOR_TOKENS) tokens[`--db-${key}-${suffix}`] = value(key);
};

/**
 * The base token suffixes every color provides: the 15 palette steps, the origin base and the
 * per-scheme origin/on-origin states, plus the scheme-less origin aggregators. These are the
 * inputs the DB theme derives its adaptive (`bg-*`/`on-bg-*`) tokens from; the adaptive set
 * itself is added separately (see `ADAPTIVE_COLOR_TOKENS`), only for custom families.
 */
const BASE_TOKEN_SUFFIXES = [
	...PALETTE_STEPS.map(String),
	'origin-base',
	...VIBRANT_TOKEN_SUFFIXES,
	...SCHEMES.flatMap((scheme) => [
		...STATES.map((state) => `origin-${scheme}-${state}`),
		`on-origin-${scheme}-default`,
	]),
	...ORIGIN_AGGREGATORS.map(([suffix]) => suffix),
];

/**
 * On-origin is always pure white or pure black, whichever contrasts more with the origin.
 * This deviates from the palette rule, which uses the end of the color's own ramp
 * (e.g. #fff8f8 for DB red, 4.38:1 instead of 4.59:1 with white).
 */
const applyPureOnOrigin = (mode: ColorMode): ColorMode => {
	const onWhite = contrast('#ffffff', mode.origin.default);
	const onBlack = contrast('#000000', mode.origin.default);
	mode.onOrigin = onWhite >= onBlack ? '#ffffff' : '#000000';
	mode.contrastOnOrigin = Math.max(onWhite, onBlack);
	mode.warnings = mode.warnings.filter((warning) => warning.type !== 'on-origin-contrast');
	if (mode.contrastOnOrigin < 4.5) {
		mode.warnings.push({ type: 'on-origin-contrast', value: mode.contrastOnOrigin });
	}
	return mode;
};

/**
 * Builds the color mode of one family. A saturation cap (opt-in per family) limits the ramp
 * saturation to the configured value instead of using the origin's own saturation directly. A
 * tinted origin (e.g. #090F1B, s≈52) is damped to the cap so the steps keep only a faint,
 * constant undertone; a pure grey origin (e.g. #1a1a1a, s≈0) carries no hue and therefore stays
 * fully neutral regardless of the cap. The built-in Grey family additionally gets real black
 * and white ramp ends (`neutral: true` on the palette rule) – that part stays specific to it,
 * since only the one family used for the Neutral semantic color needs to reach the extremes.
 */
const buildFamilyMode = ({ origin, h, s, saturationCap, neutral }: FamilyConfig): ColorMode => {
	if (saturationCap != null) {
		return applyPureOnOrigin(
			buildColorMode(
				{ origin, h: h ?? hsluvOf(origin).h, s: Math.min(hsluvOf(origin).s, saturationCap) },
				{ neutral },
			),
		);
	}
	// The state direction is always automatic
	return applyPureOnOrigin(buildColorMode(h == null ? origin : { origin, h, s }));
};

/** The family a semantic color falls back to when its assignment is missing or was removed. */
export const defaultFamilyFor = (
	key: SemanticKey,
	families: readonly { key: FamilyKey }[],
): FamilyKey =>
	families.some((family) => family.key === SEMANTIC_DEFAULTS[key])
		? SEMANTIC_DEFAULTS[key]
		: (families[0]?.key ?? SEMANTIC_DEFAULTS[key]);

/** Generates all color modes and the CSS custom properties for a config. */
export const buildTheme = (config: ThemeConfig): ThemeResult => {
	const tokens: Record<string, string> = {};

	// Color families: palette and hovered state from the palette rule, for the families the DB
	// theme ships and for custom ones alike.
	const familyModes: Record<FamilyKey, ColorMode> = {};
	for (const family of config.families) {
		const { key, originDark } = family;
		const mode = buildFamilyMode(family);
		familyModes[key] = mode;
		mode.palette.forEach((value, index) => {
			tokens[`--db-${key}-${index}`] = value;
		});
		tokens[`--db-${key}-origin-base`] = mode.origin.default;
		// A separate dark origin gets its own states and on-origin color; otherwise dark uses
		// the same origin as light.
		const darkMode = originDark ? applyPureOnOrigin(buildColorMode(originDark)) : mode;
		const perScheme = { light: mode, dark: darkMode };
		// Vibrant is the same in both modes and derives from the main origin.
		emitVibrantTokens(tokens, key, mode.vibrant);
		for (const scheme of SCHEMES) {
			const schemeMode = perScheme[scheme];
			tokens[`--db-${key}-origin-${scheme}-default`] = schemeMode.origin.default;
			tokens[`--db-${key}-origin-${scheme}-hovered`] = schemeMode.origin.hovered;
			tokens[`--db-${key}-on-origin-${scheme}-default`] = schemeMode.onOrigin;
		}
		// Only a family the DB theme does not ship gets the adaptive set. The families the DB
		// theme ships already carry it, so re-emitting it would only bloat the export.
		if (!family.builtin) emitAdaptiveTokens(tokens, key);
	}

	// Semantic colors (primary, neutral and the status colors) alias a color family instead of
	// carrying a palette of their own. Only the base tokens are aliased: the DB theme's adaptive
	// semantic tokens reference `--db-<key>-N`, so they follow the aliased palette automatically
	// and must not be overwritten here.
	for (const key of SEMANTIC_KEYS) {
		const family = config.semantic[key];
		for (const suffix of BASE_TOKEN_SUFFIXES) {
			tokens[`--db-${key}-${suffix}`] = `var(--db-${family}-${suffix})`;
		}
	}

	RADIUS_SIZES.forEach((size, index) => {
		const value = radiusForSize(config.radius, index);
		tokens[`--db-border-radius-${size}`] = value === 0 ? '0' : `${value}rem`;
	});

	tokens['--db-font-family-head'] = FONT_STACKS[config.headingFont].head;
	tokens['--db-font-family-sans'] = FONT_STACKS[config.bodyFont].sans;

	return { tokens, familyModes };
};

/**
 * Icon font switch. `@db-ux/db-theme` registers `--db-icon-default-font-family` and
 * `--db-icon-filled-font-family` with the DB icon fonts as initial value. Without the DB
 * theme, the components fall back to the white label fonts of `@db-ux/core-foundations`
 * (Lucide based). For the Lucide library these properties are reset to those fonts.
 * The properties do not inherit, so they are set on every element.
 */
export const iconCss = (config: ThemeConfig): string =>
	config.icons === 'lucide'
		? `*,\n::before,\n::after {\n\t--db-icon-default-font-family: "db-ux-default", icon-font-fallback;\n\t--db-icon-filled-font-family: "db-ux-filled", icon-font-fallback;\n}`
		: '';

/**
 * Component adjustments for rounded corners. The Textarea always shows its custom scrollbar
 * (`overflow-y: scroll`, a 0.5rem strip on `bg-basic-level-1`). With radius 0 it sits flush
 * with the edge; with a larger radius it cuts through the rounded corner. With rounded
 * corners the scrollbar is therefore only shown when needed and its track keeps clear of
 * the corners.
 */
export const componentCss = (config: ThemeConfig): string =>
	config.radius === 'none'
		? ''
		: `.db-textarea textarea {
	overflow-y: auto;
}

.db-textarea textarea::-webkit-scrollbar {
	background-color: transparent;
}

.db-textarea textarea::-webkit-scrollbar-track {
	margin-block: var(--db-border-radius-xs);
}`;

/**
 * Typography font override. The DB typography tokens (`--db-type-headline-*`,
 * `--db-type-body-*`) are `font` shorthands that embed the DB font family as a literal, so
 * components using them ignore `--db-font-family-head`/`--db-font-family-sans`. When a
 * non-DB font is chosen, the family is therefore re-applied after the shorthand: headings
 * get the heading font, the rest the body font. Not emitted while both fonts are the DB one.
 */
export const typographyCss = (config: ThemeConfig, bodyScope = 'body'): string => {
	const rules: string[] = [];
	// The DB typography tokens (--db-type-body-*, --db-type-headline-*) are `font` shorthands
	// that embed the DB font family as a literal, applied on the components themselves. The
	// family is therefore re-applied with !important on every element, so it reaches controls
	// like buttons, infotext or badges, not just the text that inherits it. The heading rule
	// comes second and, at equal specificity, wins for headings.
	if (config.bodyFont !== 'db') {
		rules.push(
			`${bodyScope},\n${bodyScope} * {\n\tfont-family: var(--db-font-family-sans) !important;\n}`,
		);
	}
	// A heading rule is needed whenever either font is overridden: when only the heading font
	// changes, to apply it; and when the body font changes, to keep headings on the heading
	// font instead of inheriting the body override from `body *`. The selector is doubled so
	// it outranks `body *` (and `.tb-preview-main *` in the preview) at higher specificity.
	if (config.headingFont !== 'db' || config.bodyFont !== 'db') {
		rules.push(
			`h1, h2, h3, h4, h5, h6, .db-heading, .db-heading *,\n${bodyScope} :is(h1, h2, h3, h4, h5, h6, .db-heading, .db-heading *) {\n\tfont-family: var(--db-font-family-head) !important;\n}`,
		);
	}
	return rules.join('\n\n');
};

/**
 * Makes a string safe inside a CSS comment. A custom family name is user-controlled and
 * ends up in `/* … *\/` of the exported theme; without escaping, a name containing `*\/`
 * would close the comment early and inject arbitrary CSS into the file the user copies.
 */
const cssComment = (text: string): string => text.replace(/\*\//g, '*\\/');

export const tokensToDeclarations = (tokens: Record<string, string>, indent = '\t'): string =>
	Object.entries(tokens)
		.map(([name, value]) => `${indent}${name}: ${value};`)
		.join('\n');

// ---------- Grouped token model (the single source for the exports) ----------
//
// The flat `tokens` map from buildTheme is grouped once into `{ colors, border, font }`.
// Both the JSON download and the CSS downloads are derived from this structure, so there is
// one source of truth and the shapes stay in sync (see the review on theme.ts).

export type ThemeLayer = '@db-ux/core-components' | '@db-ux/db-theme';

export type GroupedTheme = {
	/** Every color key (each family and each semantic color) with its tokens. */
	colors: Record<string, Record<string, string>>;
	/** Border radius tokens, keyed by size (`xs`, `md`, …). */
	border: Record<string, string>;
	/** Font family tokens, keyed by role (`head`, `sans`). */
	font: Record<string, string>;
};

/** The layer the exported theme is imported into (see the @layer usage in the README). */
export const THEME_LAYER = 'db-ux-theme';

/** Strips the shared `--db-<key>-` prefix from a token name, leaving the suffix. */
const suffixAfter = (name: string, key: string): string => name.slice(`--db-${key}-`.length);

/**
 * Groups the flat token map into `{ colors, border, font }`. The color keys are the configured
 * families and the semantic colors (primary, neutral and the status colors); everything else is a border
 * radius or a font family token.
 */
export const groupTokens = (config: ThemeConfig, tokens: Record<string, string>): GroupedTheme => {
	const colorKeys = [...config.families.map(({ key }) => key), ...SEMANTIC_KEYS];
	const colors: Record<string, Record<string, string>> = {};
	for (const key of colorKeys) {
		const entries = Object.entries(tokens).filter(([name]) => name.startsWith(`--db-${key}-`));
		if (entries.length === 0) continue;
		colors[key] = Object.fromEntries(
			entries.map(([name, value]) => [suffixAfter(name, key), value]),
		);
	}
	const border: Record<string, string> = {};
	const font: Record<string, string> = {};
	for (const [name, value] of Object.entries(tokens)) {
		if (name.startsWith('--db-border-radius-')) border[suffixAfter(name, 'border-radius')] = value;
		else if (name.startsWith('--db-font-family-')) font[suffixAfter(name, 'font-family')] = value;
	}
	return { colors, border, font };
};

/** Human label for a color group in a CSS comment. */
const colorLabel = (config: ThemeConfig, key: string): string => {
	if ((SEMANTIC_KEYS as readonly string[]).includes(key)) {
		const label = key === 'brand' ? 'primary (brand)' : key;
		return `${label} → ${config.semantic[key as SemanticKey]}`;
	}
	const family = config.families.find((f) => f.key === key);
	return family ? family.name : key;
};

export const toJson = (config: ThemeConfig, tokens: Record<string, string>): string =>
	JSON.stringify(
		{
			$schema: 'db-ux-theme-builder/v1',
			config,
			...groupTokens(config, tokens),
		},
		null,
		2,
	);

// ---------- CSS export (generated from the grouped model) ----------

/** `@property` registration for a color custom property (typed, so it animates and validates). */
const colorProperty = (name: string, value: string): string =>
	`@property ${name} {\n\tsyntax: "<color>";\n\tinitial-value: ${value};\n\tinherits: true;\n}`;

/** A plain color is a concrete value (hex/rgb/hsl); everything else is computed (light-dark/var). */
const isPlainColor = (value: string): boolean => /^#|^rgb|^hsl/i.test(value);

/**
 * Splits a color group into plain and computed declarations. A plain color carries its value
 * through the typed `@property` `initial-value`, so its `:root` line is only a fallback (it
 * goes to theme.legacy.css). A computed color (`light-dark(...)` / `var(...)`) can not be a
 * `<color>` initial value, so it is registered with `syntax: "*"` and its value stays in the
 * theme.css layer block.
 */
const groupColorDeclarations = (
	config: ThemeConfig,
	grouped: GroupedTheme,
): { properties: string[]; computed: string[]; legacy: string[] } => {
	const properties: string[] = [];
	const computed: string[] = [];
	const legacy: string[] = [];
	for (const [key, entries] of Object.entries(grouped.colors)) {
		const computedDecls: string[] = [];
		const legacyDecls: string[] = [];
		for (const [suffix, value] of Object.entries(entries)) {
			const name = `--db-${key}-${suffix}`;
			if (isPlainColor(value)) {
				properties.push(colorProperty(name, value));
				legacyDecls.push(`\t${name}: ${value};`);
			} else {
				properties.push(`@property ${name} {\n\tsyntax: "*";\n\tinherits: true;\n}`);
				computedDecls.push(`\t${name}: ${value};`);
			}
		}
		const label = cssComment(colorLabel(config, key));
		if (computedDecls.length > 0) computed.push(`\t/* ${label} */\n${computedDecls.join('\n')}`);
		if (legacyDecls.length > 0) legacy.push(`\t/* ${label} */\n${legacyDecls.join('\n')}`);
	}
	return { properties, computed, legacy };
};

/**
 * The theme CSS: every color token registered as a typed `@property`, wrapped in the theme
 * layer. Plain colors carry their value in the `@property` `initial-value`; the computed
 * `light-dark(...)` / `var(...)` tokens and the border radii are set in the layer block.
 * The concrete `:root` fallback for the plain colors lives in theme.legacy.css.
 */
export const toThemeCss = (config: ThemeConfig, tokens: Record<string, string>): string => {
	const grouped = groupTokens(config, tokens);
	const { properties, computed } = groupColorDeclarations(config, grouped);
	const border = Object.entries(grouped.border).map(
		([size, value]) => `\t--db-border-radius-${size}: ${value};`,
	);

	const header = `/**
 * DB UX Design System – generated theme (${config.preset})
 * Palette rule: New Foundation color generator (HSLuv)
 *
 * This file replaces the color and border tokens of the DB theme. Import it in its own
 * cascade layer after the components, so it overrides them:
 *
 *   @layer db-ux, ${THEME_LAYER};
 *   @import "@db-ux/core-components/build/styles/bundle.css" layer(db-ux);
 *   @import "./theme.legacy.css" layer(${THEME_LAYER});
 *   @import "./theme.css" layer(${THEME_LAYER});
 *
 * The plain color values are registered as typed @property, so no :root block is needed for
 * them. theme.legacy.css ships the same values as a plain :root fallback for engines that do
 * not honor @property initial values. The fonts are in theme.fonts.css. See README.md.
 * Density: set data-density="${config.density}" on <body> or a container.
 * Mode: set data-mode="${config.mode}" (or leave it unset to follow the OS).
 */`;

	const rootEntries = [...computed, `\t/* border radius */\n${border.join('\n')}`].join('\n\n');
	const layerBlock = `@layer ${THEME_LAYER} {
\t:root {
${rootEntries}
\t}
${componentCss(config) ? `\n\t/* Component adjustments for rounded corners */\n${indentBlock(componentCss(config))}\n` : ''}${config.icons === 'lucide' ? `\n\t/* Icons: Lucide (white label icon fonts of @db-ux/core-foundations) */\n${indentBlock(iconCss(config))}\n` : ''}}`;

	return `${header}\n${properties.join('\n')}\n\n${layerBlock}\n`;
};

/**
 * The legacy CSS: the plain color tokens as a flat `:root` block, with their concrete values.
 * These are the same values the typed `@property` registrations in theme.css carry as their
 * `initial-value`; this file is the fallback for engines that do not apply `@property` initial
 * values. Import it before theme.css so the typed properties win where they are supported.
 */
export const toLegacyCss = (config: ThemeConfig, tokens: Record<string, string>): string => {
	const grouped = groupTokens(config, tokens);
	const { legacy } = groupColorDeclarations(config, grouped);
	const header = `/**
 * DB UX Design System – generated theme, legacy fallback (${config.preset})
 *
 * Plain :root color variables with their concrete values. theme.css registers the same
 * tokens as typed @property; this file is only needed for engines that do not honor the
 * @property initial values. Import it in the theme layer, before theme.css:
 *
 *   @import "./theme.legacy.css" layer(${THEME_LAYER});
 *   @import "./theme.css" layer(${THEME_LAYER});
 */`;
	return `${header}\n:root {\n${legacy.join('\n\n')}\n}\n`;
};

/** Indents every line of a block by one tab, for nesting inside the @layer rule. */
const indentBlock = (css: string): string =>
	css
		.split('\n')
		.map((line) => (line ? `\t${line}` : line))
		.join('\n');

/**
 * The fonts CSS. The font families are registered with `syntax: "*"` (a font stack is not a
 * typed value), plus a `:root` workaround that sets the concrete stacks for the current DB
 * implementation. The chosen fonts are also re-applied over the DB typography shorthands.
 */
export const toFontsCss = (config: ThemeConfig, tokens: Record<string, string>): string => {
	const { font } = groupTokens(config, tokens);
	const properties = Object.entries(font)
		.map(
			([role, value]) =>
				`@property --db-font-family-${role} {\n\tsyntax: "*";\n\tinitial-value: ${value};\n\tinherits: true;\n}`,
		)
		.join('\n');
	const workaround = Object.entries(font)
		.map(([role, value]) => `\t--db-font-family-${role}: ${value};`)
		.join('\n');
	const typography = typographyCss(config);
	return `/**
 * DB UX Design System – generated theme fonts (${config.preset})
 *
 * Import this file the same way as theme.css (see README.md). The @property registrations
 * carry the font stacks; the :root block is a workaround for the current DB implementation.
 */
${properties}

:root {
\t/* Workaround for the current implementation */
${workaround}
}
${typography ? `\n/* Apply the chosen fonts over the DB typography shorthands */\n${typography}\n` : ''}`;
};

/** The README that ships in the ZIP: what the files are and how to import them. */
export const toReadme = (config: ThemeConfig): string =>
	`# DB UX Design System – generated theme

Preset: ${config.preset}
Density: data-density="${config.density}"
Mode: data-mode="${config.mode}" (or leave unset to follow the OS)

## Files

- theme.css          Color and border tokens, registered as @property and set in a cascade layer.
- theme.legacy.css   The plain color tokens as a :root fallback, for engines that do not honor @property initial values.
- theme.fonts.css    Font family tokens (@property) plus the typography overrides.
- theme.tokens.json  The same theme as Style Dictionary (DTCG) tokens, grouped into colors, border and font.

## Usage

Import the generated files in their own cascade layer, after the design system, so they
replace its tokens. Import theme.legacy.css before theme.css so the typed @property values
win wherever they are supported:

\`\`\`css
@layer db-ux, ${THEME_LAYER};
@import "@db-ux/core-components/build/styles/bundle.css" layer(db-ux);
@import "./theme.legacy.css" layer(${THEME_LAYER});
@import "./theme.css" layer(${THEME_LAYER});
@import "./theme.fonts.css" layer(${THEME_LAYER});
\`\`\`

theme.legacy.css is optional: drop it if you only target engines that apply @property initial
values.
`;

/**
 * Kept for the live preview, which injects a plain `:root { … }` block (no @layer, no
 * @property) into the iframe. The downloads use toThemeCss / toFontsCss instead.
 */
export const toCss = (config: ThemeConfig, tokens: Record<string, string>): string =>
	`${toThemeCss(config, tokens)}\n${toFontsCss(config, tokens)}`;

// ---------- Style Dictionary export (DTCG) ----------

type SdTokenType = 'color' | 'dimension' | 'fontFamily';

type SdToken = { $type: SdTokenType; $value: string };
type SdNode = { [key: string]: SdNode | SdToken };

/** Picks the DTCG `$type` from the token name, so the SD build knows how to transform it. */
const sdTypeFor = (name: string): SdTokenType => {
	if (name.startsWith('--db-border-radius-')) return 'dimension';
	if (name.startsWith('--db-font-family-')) return 'fontFamily';
	return 'color';
};

const VAR_PATTERN = /^var\(\s*--db-([a-z0-9-]+)\s*\)$/i;

/**
 * Turns a token value into a DTCG value. A semantic alias `var(--db-<color>-<suffix>)`
 * becomes a Style Dictionary reference into the grouped tree, `{colors.<color>.<suffix>}`,
 * so changing the target family updates everything that uses it. Other values pass through.
 * Only single `var(--db-…)` color references are aliased; composite values (light-dark,
 * color-mix) stay literal, which is what the design system ships for those tokens too.
 */
const sdValue = (value: string): string => {
	const match = value.match(VAR_PATTERN);
	if (!match) return value;
	return `{colors.${match[1].split('-').join('.')}}`;
};

/** A group node with no inherited keys, so segments like `constructor` cannot collide
 *  with `Object.prototype`. */
const sdGroup = (): SdNode => Object.create(null) as SdNode;

/**
 * Inserts a token at the dotted path (`db.brand.7`) into the nested tree. Uses own-property
 * checks and null-prototype groups, so a family keyed `constructor` does not resolve to the
 * inherited `Object` constructor, and a leaf never silently replaces a populated group (or
 * the other way round). On such a conflict the existing node is kept and the token skipped.
 */
const setSdToken = (root: SdNode, path: string, value: string, type: SdTokenType): void => {
	const segments = path.split('-');
	let node = root;
	for (let i = 0; i < segments.length - 1; i += 1) {
		const segment = segments[i];
		const next = Object.hasOwn(node, segment) ? node[segment] : undefined;
		if (next === undefined) {
			const group = sdGroup();
			node[segment] = group;
			node = group;
		} else if ('$value' in next) {
			// A leaf already sits here (e.g. `2` before `2-0`): keep it and drop this token
			// rather than overwriting the other export silently.
			return;
		} else {
			node = next as SdNode;
		}
	}
	const leaf = segments[segments.length - 1];
	// Do not overwrite a populated group with a leaf of the same path either.
	if (Object.hasOwn(node, leaf) && !('$value' in (node[leaf] as SdNode | SdToken))) return;
	node[leaf] = { $type: type, $value: sdValue(value) };
};

/**
 * Builds a nested DTCG tree from suffix → value entries. The suffix (e.g.
 * `bg-basic-level-1-default`) is the path inside the group; `fullName` reconstructs the
 * token name only so `sdTypeFor` can still tell a color from a dimension or font family.
 */
const sdTreeFrom = (entries: [string, string][], fullName: (suffix: string) => string): SdNode => {
	const root = sdGroup();
	for (const [suffix, value] of entries) {
		setSdToken(root, suffix, value, sdTypeFor(fullName(suffix)));
	}
	return root;
};

/**
 * Serializes the theme as Amazon Style Dictionary tokens (DTCG: `$type`/`$value`, nested),
 * grouped into `colors`, `border` and `font` – the same structure as the JSON export. Feed
 * the file to a `style-dictionary` build as a source. Semantic colors stay aliases
 * (`{db.red.7}`), so changing the target family in one place updates everything that uses it.
 */
export const toStyleDictionary = (config: ThemeConfig, tokens: Record<string, string>): string => {
	const grouped = groupTokens(config, tokens);
	const colors = sdGroup();
	for (const [key, entries] of Object.entries(grouped.colors)) {
		colors[key] = sdTreeFrom(Object.entries(entries), (suffix) => `--db-${key}-${suffix}`);
	}
	const border = sdTreeFrom(Object.entries(grouped.border), (s) => `--db-border-radius-${s}`);
	const font = sdTreeFrom(Object.entries(grouped.font), (s) => `--db-font-family-${s}`);
	return JSON.stringify(
		{
			$description: `DB UX Design System – generated theme (${config.preset}). Style Dictionary (DTCG) tokens. Density: data-density="${config.density}". Mode: data-mode="${config.mode}".`,
			colors,
			border,
			font,
		},
		null,
		2,
	);
};

// ---------- Sharing (URL hash) ----------
const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
	allowed.includes(value as T) ? (value as T) : fallback;

const finiteOrUndefined = (value: unknown): number | undefined =>
	typeof value === 'number' && Number.isFinite(value) ? value : undefined;

/** Clamps a finite number into `[min, max]`, or returns undefined for anything else. These
 *  come from an untrusted `?theme=` link and feed the HSLuv math, so out-of-range values
 *  would produce malformed colors. */
const clampOrUndefined = (value: unknown, min: number, max: number): number | undefined => {
	const n = finiteOrUndefined(value);
	return n === undefined ? undefined : Math.min(max, Math.max(min, n));
};

/** Hue is modulo 360; a value outside `[0, 360)` is wrapped instead of clamped. */
const hueOrUndefined = (value: unknown): number | undefined => {
	const n = finiteOrUndefined(value);
	return n === undefined ? undefined : ((n % 360) + 360) % 360;
};

const rawDirection = (value: unknown) =>
	pick(value, ['auto', 'darker', 'lighter'] as const, 'auto');

/**
 * Brings a config saved before Primary and Neutral became semantic colors up to date. Those
 * configs carry `colors.brand` and `colors.neutral` with a palette of their own and no Grey
 * family. The neutral values move into the Grey family; the brand maps to a family with the
 * same origin (e.g. Red) or, when it differs, to a new "Primary" family that carries the origin,
 * the dark origin and the ramp.
 */
const migrateLegacyColors = (
	families: FamilyConfig[],
	rawColors: Record<string, Partial<Record<keyof ColorConfig, unknown>> | undefined>,
): { families: FamilyConfig[]; semantic: Partial<Record<SemanticKey, FamilyKey>> } => {
	const result = families.map((family) => ({ ...family }));
	const semantic: Partial<Record<SemanticKey, FamilyKey>> = {};

	const neutral = rawColors.neutral ?? {};
	const grey = result.find((family) => family.key === 'grey') ?? seededFamily('grey', false);
	if (isHex(neutral.origin)) {
		const origin = neutral.origin.toLowerCase();
		grey.origin = origin;
		grey.h = hueOrUndefined(neutral.h) ?? hsluvOf(origin).h;
		grey.saturationCap = clampOrUndefined(neutral.s, 0, 100) ?? NEUTRAL_RAMP_SATURATION;
		grey.direction = rawDirection(neutral.direction);
	}
	if (!result.includes(grey)) result.unshift(grey);
	semantic.neutral = 'grey';

	const brand = rawColors.brand ?? {};
	const origin = isHex(brand.origin) ? brand.origin.toLowerCase() : SEEDED_ORIGIN_RED;
	const originDark = isHex(brand.originDark) ? brand.originDark.toLowerCase() : undefined;
	const plain =
		hueOrUndefined(brand.h) === undefined && clampOrUndefined(brand.s, 0, 100) === undefined;
	const sameOrigin = result.find(
		(family) => !family.neutral && family.origin === origin && !family.originDark,
	);
	if (sameOrigin && !originDark && plain) {
		semantic.brand = sameOrigin.key;
	} else {
		let key = 'primary';
		for (let n = 2; result.some((family) => family.key === key); n += 1) key = `primary-${n}`;
		result.push({
			key,
			name: 'Primary',
			builtin: false,
			origin,
			...(originDark ? { originDark } : {}),
			h: hueOrUndefined(brand.h),
			s: clampOrUndefined(brand.s, 0, 100),
			direction: rawDirection(brand.direction),
		});
		semantic.brand = key;
	}
	return { families: result, semantic };
};

const SEEDED_ORIGIN_RED = FAMILIES.red.origin;

/** Validates untrusted input (URL hash, JSON) and merges it onto the defaults. */
export const sanitizeConfig = (input: unknown): ThemeConfig => {
	const raw = (input && typeof input === 'object' ? input : {}) as Partial<
		Record<keyof ThemeConfig | 'colors', unknown>
	>;
	const rawSemantic = (
		raw.semantic && typeof raw.semantic === 'object' ? raw.semantic : {}
	) as Record<string, unknown>;
	let families = sanitizeFamilies(raw.families);
	let migrated: Partial<Record<SemanticKey, FamilyKey>> = {};
	// Configs from before Primary and Neutral became semantic colors still carry `colors`
	if (raw.colors && typeof raw.colors === 'object') {
		({ families, semantic: migrated } = migrateLegacyColors(
			families,
			raw.colors as Record<string, Partial<Record<keyof ColorConfig, unknown>> | undefined>,
		));
	}
	const familyKeys = families.map((family) => family.key);
	return {
		preset: pick(raw.preset, [...PRESETS, 'custom'] as const, 'custom'),
		families,
		semantic: Object.fromEntries(
			SEMANTIC_KEYS.map((key) => {
				const fallback = migrated[key] ?? defaultFamilyFor(key, families);
				return [key, pick(rawSemantic[key], familyKeys, fallback)];
			}),
		) as Record<SemanticKey, FamilyKey>,
		radius: pick(raw.radius, RADII, DEFAULT_CONFIG.radius),
		headingFont: pick(raw.headingFont, FONTS, DEFAULT_CONFIG.headingFont),
		bodyFont: pick(raw.bodyFont, FONTS, DEFAULT_CONFIG.bodyFont),
		icons: pick(raw.icons, ICON_LIBRARIES, DEFAULT_CONFIG.icons),
		density: pick(raw.density, DENSITIES, DEFAULT_CONFIG.density),
		mode: pick(raw.mode, MODES, DEFAULT_CONFIG.mode),
	};
};

/**
 * Keeps the families of a saved config in their saved order. Every family can be removed, so
 * a missing one is not restored. A seeded family (e.g. Red, Grey) keeps its defaults where the
 * saved value is invalid; a custom family is kept when key, name and origin are valid. Without
 * a family list (or without a single valid family) the default families are used.
 */
const sanitizeFamilies = (input: unknown): FamilyConfig[] => {
	if (!Array.isArray(input)) return structuredClone(DEFAULT_FAMILIES);
	const result: FamilyConfig[] = [];
	for (const candidate of input as Record<string, unknown>[]) {
		if (!candidate || typeof candidate !== 'object' || typeof candidate.key !== 'string') continue;
		const key = candidate.key;
		if (result.some((family) => family.key === key)) continue;
		const originDark = isHex(candidate.originDark) ? candidate.originDark.toLowerCase() : undefined;
		const seeded = DEFAULT_FAMILIES.find((family) => family.key === key);
		// The saturation cap is opt-in for every family (seeded or custom) and independent of
		// the ramp hue/saturation fit below. A missing cap means it was removed, also for Grey;
		// configs from before Grey existed get theirs from the migration (`migrateLegacyColors`).
		const saturationCap = clampOrUndefined(candidate.saturationCap, 0, 100);
		if (seeded && isSeededFamily(key)) {
			const origin = isHex(candidate.origin) ? candidate.origin.toLowerCase() : seeded.origin;
			const changed = origin !== seeded.origin;
			result.push({
				...seeded,
				origin,
				...(originDark ? { originDark } : {}),
				// The others derive hue and saturation from the origin, unless the saved origin
				// carries its own ramp fit.
				h: changed ? hueOrUndefined(candidate.h) : seeded.h,
				s: changed ? clampOrUndefined(candidate.s, 0, 100) : seeded.s,
				// Set explicitly: the seeded default (Grey's cap) must not survive a removed cap
				saturationCap,
				direction: rawDirection(candidate.direction),
			});
			continue;
		}
		const name = typeof candidate.name === 'string' ? candidate.name.trim().slice(0, 40) : '';
		if (!name || !isHex(candidate.origin)) continue;
		if (hasUnsafeNameChars(name)) continue;
		if (familyKeyFromName(name) !== key || RESERVED_KEYS.has(key)) continue;
		if (hasReservedFirstSegment(key)) continue;
		result.push({
			key,
			name,
			builtin: false,
			origin: candidate.origin.toLowerCase(),
			...(originDark ? { originDark } : {}),
			...(saturationCap != null ? { saturationCap } : {}),
			direction: rawDirection(candidate.direction),
		});
	}
	return result.length > 0 ? result : structuredClone(DEFAULT_FAMILIES);
};

/*
 * The whole config is serialized into a URL-safe base64 string (base64url: no `+`, `/`
 * or `=`), so a shared link carries the complete theme and resolves on any device.
 */
export const encodeConfig = (config: ThemeConfig): string =>
	btoa(encodeURIComponent(JSON.stringify(config)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

export const decodeConfig = (value: string): ThemeConfig | undefined => {
	try {
		// Restore standard base64 from base64url; old links (plain base64) still decode.
		const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
		return sanitizeConfig(JSON.parse(decodeURIComponent(atob(base64))));
	} catch {
		return undefined;
	}
};

// ---------- Shuffle ----------
const randomBetween = (min: number, max: number): number => min + Math.random() * (max - min);
const randomOf = <T>(values: readonly T[]): T => values[Math.floor(Math.random() * values.length)];

/** Replaces the family with the same key, or appends it. */
const upsertFamily = (families: FamilyConfig[], family: FamilyConfig): FamilyConfig[] =>
	families.some(({ key }) => key === family.key)
		? families.map((item) => (item.key === family.key ? family : item))
		: [...families, family];

export const shuffleConfig = (current: ThemeConfig): ThemeConfig => {
	const hue = randomBetween(0, 360);
	const brand = hsluvToHex(hue, randomBetween(70, 100), randomBetween(38, 56));
	const neutralHue = Math.random() < 0.5 ? hue : randomBetween(0, 360);
	// The primary color gets a family of its own, so shuffling it does not recolor the status
	// colors that may use the same family (e.g. Red for critical).
	let families = upsertFamily(current.families, {
		key: 'primary',
		name: 'Primary',
		builtin: false,
		origin: brand,
		direction: 'auto',
	});
	// The neutral family is tinted; any other family assigned to neutral stays untouched.
	const neutralFamily = families.find(({ key }) => key === current.semantic.neutral);
	if (neutralFamily?.neutral) {
		families = upsertFamily(families, {
			...neutralFamily,
			origin: tintedNeutral(neutralHue, randomBetween(2, 16)),
			originDark: undefined,
			h: undefined,
			saturationCap: neutralFamily.saturationCap ?? NEUTRAL_RAMP_SATURATION,
		});
	}
	return {
		...current,
		preset: 'custom',
		families,
		semantic: { ...current.semantic, brand: 'primary' },
		radius: randomOf(RADII),
		headingFont: randomOf(FONTS.filter((font) => font !== 'db')),
		bodyFont: randomOf(FONTS.filter((font) => font !== 'db' && font !== 'mono')),
		icons: 'lucide',
	};
};
