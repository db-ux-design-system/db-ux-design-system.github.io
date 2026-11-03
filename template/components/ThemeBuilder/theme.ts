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
	COLORS,
	hsluvOf,
	hsluvToHex,
	type ColorMode,
	type OriginDirection,
} from './color/palette-rule.ts';

/** Colors that are edited freely in the builder. */
export const COLOR_KEYS = ['brand', 'neutral'] as const;
export type ColorKey = (typeof COLOR_KEYS)[number];

/**
 * The built-in color families of the New Foundation (Figma collection "🎨 Color"). Their
 * origin can be changed, and further families can be added with a name and an origin.
 * Semantic colors point at one of them.
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
	'lilac',
] as const;
export type BuiltinFamilyKey = (typeof BUILTIN_FAMILY_KEYS)[number];
/** Key of a built-in or a custom family; also the CSS prefix (`--db-<key>-0`). */
export type FamilyKey = string;

/** A color family in the config. `name` is only used for custom families. */
export type FamilyConfig = ColorConfig & { key: FamilyKey; name: string; builtin: boolean };

/** Semantic colors are no palettes of their own, but an alias of a color family. */
export const SEMANTIC_KEYS = ['informational', 'successful', 'warning', 'critical'] as const;
export type SemanticKey = (typeof SEMANTIC_KEYS)[number];

export const SEMANTIC_DEFAULTS: Record<SemanticKey, FamilyKey> = {
	informational: 'blue',
	successful: 'green',
	warning: 'orange',
	critical: 'red',
};

type Family = {
	h: number;
	s: number;
	origin: string;
	hovered: string;
	pressed: string;
};

/**
 * Ramp hue/saturation from the palette rule (COLORS) and origin states from the Figma
 * export (`Import/figma-export.json`). Lilac is not part of COLORS yet (it still lists
 * Light Green), so its h/s are fitted to the Figma ramp.
 */
const FAMILIES: Record<BuiltinFamilyKey, Family> = {
	yellow: {
		...hs('Yellow'),
		origin: '#ffd800',
		hovered: '#e2bf00',
		pressed: '#c9ab00',
	},
	orange: {
		...hs('Orange'),
		origin: '#f69400',
		hovered: '#ffaf6f',
		pressed: '#ffcbab',
	},
	red: {
		...hs('Red'),
		origin: '#ec0016',
		hovered: '#cb0011',
		pressed: '#af000d',
	},
	burgundy: {
		...hs('Burgundy'),
		origin: '#a9455d',
		hovered: '#8f394e',
		pressed: '#782f40',
	},
	pink: {
		...hs('Pink'),
		origin: '#e93e8f',
		hovered: '#ed69a4',
		pressed: '#f18ab3',
	},
	violet: {
		...hs('Violet'),
		origin: '#814997',
		hovered: '#6c3c7e',
		pressed: '#593169',
	},
	blue: {
		...hs('Blue'),
		origin: '#1455c0',
		hovered: '#0f46a0',
		pressed: '#0b3883',
	},
	cyan: {
		...hs('Cyan'),
		origin: '#309fd1',
		hovered: '#5ab4e2',
		pressed: '#80c7f2',
	},
	turquoise: {
		...hs('Turquoise'),
		origin: '#00a099',
		hovered: '#00b7af',
		pressed: '#00cdc4',
	},
	green: {
		...hs('Green'),
		origin: '#408335',
		hovered: '#36702c',
		pressed: '#2d5f24',
	},
	lilac: {
		h: 270.98,
		s: 99.92,
		origin: '#aa99ff',
		hovered: '#beb3ff',
		pressed: '#d3cbff',
	},
};

function hs(name: string): { h: number; s: number } {
	return { h: COLORS[name].h, s: COLORS[name].s };
}

const isBuiltinFamily = (key: string): key is BuiltinFamilyKey =>
	(BUILTIN_FAMILY_KEYS as readonly string[]).includes(key);

const BUILTIN_NAMES: Record<BuiltinFamilyKey, string> = {
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

export const DEFAULT_FAMILIES: FamilyConfig[] = BUILTIN_FAMILY_KEYS.map((key) => ({
	key,
	name: BUILTIN_NAMES[key],
	builtin: true,
	origin: FAMILIES[key].origin,
	h: FAMILIES[key].h,
	s: FAMILIES[key].s,
	direction: 'auto',
}));

/**
 * Keys that already carry tokens in the DB UX packages. A custom family must not use them,
 * otherwise its palette would overwrite unrelated tokens.
 */
const RESERVED_KEYS = new Set([
	...COLOR_KEYS,
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

/** Validates the name of a new family against the reserved and existing keys. */
export const validateFamilyName = (
	name: string,
	families: readonly FamilyConfig[],
): FamilyNameError | undefined => {
	const key = familyKeyFromName(name);
	if (!key) return 'empty';
	if (RESERVED_KEYS.has(key)) return 'reserved';
	if (families.some((family) => family.key === key)) return 'duplicate';
	return undefined;
};

export type ColorConfig = {
	/** The origin (brand) color as 6-digit hex. */
	origin: string;
	/**
	 * Optional separate origin for dark mode (Primary only). Lets the dark scheme use a
	 * different brand color, e.g. a light one so it stays visible on a dark background.
	 */
	originDark?: string;
	/** Optional ramp hue/saturation (HSLuv). If not set, both are derived from the origin. */
	h?: number;
	s?: number;
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
	colors: Record<ColorKey, ColorConfig>;
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

const color = (origin: string, h?: number, s?: number): ColorConfig => ({
	origin,
	h,
	s,
	direction: 'auto',
});

/** Neutral color tinted towards a hue, at the lightness of the DB neutral origin. */
const tintedNeutral = (hue: number, saturation: number): ColorConfig =>
	color(hsluvToHex(hue, saturation, hsluvOf('#646973').l));

/** DB grey ramp (h/s fitted in the New Foundation generator). Shared by the DB brands. */
const DB_NEUTRAL = color('#646973', 249.09, 12.18);

const presetColors = (brand: ColorConfig, neutral: ColorConfig): Record<ColorKey, ColorConfig> => ({
	brand,
	neutral,
});

type PresetDefinition = Omit<ThemeConfig, 'preset' | 'density' | 'mode'>;

/**
 * Shape, typography and supporting colors of the DB theme. The DB sub-brands are
 * identical to it and only swap the brand origin, so every component, semantic color,
 * density and font stays the same – only the brand hue changes.
 */
const DB_BASE: Omit<PresetDefinition, 'colors'> = {
	families: DEFAULT_FAMILIES,
	semantic: SEMANTIC_DEFAULTS,
	radius: 'none',
	headingFont: 'db',
	bodyFont: 'db',
	icons: 'db',
};

export const PRESET_DEFINITIONS: Record<Exclude<Preset, 'custom'>, PresetDefinition> = {
	db: {
		...DB_BASE,
		// h/s of the DB brand ramp as fitted in the New Foundation generator
		colors: presetColors(color('#ec0016', 11.47, 99.95), DB_NEUTRAL),
	},
	station: {
		...DB_BASE,
		colors: presetColors(color('#17217c'), DB_NEUTRAL),
	},
	's-bahn': {
		...DB_BASE,
		colors: presetColors(color('#408335'), DB_NEUTRAL),
	},
	neutral: {
		...DB_BASE,
		// Dark mode uses a white primary, so it stays visible on the dark background
		colors: presetColors({ ...color('#1a1a1a'), originDark: '#ffffff' }, DB_NEUTRAL),
	},
};

export const applyPreset = (
	preset: Exclude<Preset, 'custom'>,
	current: Pick<ThemeConfig, 'density' | 'mode'>,
): ThemeConfig => {
	const definition = PRESET_DEFINITIONS[preset];
	return {
		...definition,
		colors: structuredClone(definition.colors),
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
	modes: Record<ColorKey, ColorMode>;
	/** Generated mode per family key (palette, origin states, contrast). */
	familyModes: Record<FamilyKey, ColorMode>;
};

const PALETTE_STEPS = Array.from({ length: 15 }, (_, index) => index);
const SCHEMES = ['light', 'dark'] as const;
const STATES = ['default', 'hovered', 'pressed'] as const;

/** All token suffixes a color provides, e.g. `7` or `origin-light-hovered`. */
const COLOR_TOKEN_SUFFIXES = [
	...PALETTE_STEPS.map(String),
	'origin-base',
	...SCHEMES.flatMap((scheme) => [
		...STATES.map((state) => `origin-${scheme}-${state}`),
		`on-origin-${scheme}-default`,
	]),
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

/** Generates all color modes and the CSS custom properties for a config. */
export const buildTheme = (config: ThemeConfig): ThemeResult => {
	const tokens: Record<string, string> = {};
	const modes = {} as Record<ColorKey, ColorMode>;

	// Color families: palette from the palette rule. Unchanged built-in families keep the
	// origin states defined in Figma; a changed or custom origin gets the generator convention.
	const familyModes: Record<FamilyKey, ColorMode> = {};
	for (const family of config.families) {
		const { key, origin, h, s } = family;
		// The state direction is always automatic
		const mode = buildColorMode(h == null ? origin : { origin, h, s });
		const figma = isBuiltinFamily(key) ? FAMILIES[key] : undefined;
		const keepFigmaStates = figma && origin === figma.origin;
		if (keepFigmaStates) {
			mode.origin = { default: figma.origin, hovered: figma.hovered, pressed: figma.pressed };
		}
		applyPureOnOrigin(mode);
		familyModes[key] = mode;
		mode.palette.forEach((value, index) => {
			tokens[`--db-${key}-${index}`] = value;
		});
		tokens[`--db-${key}-origin-base`] = mode.origin.default;
		for (const scheme of SCHEMES) {
			tokens[`--db-${key}-origin-${scheme}-default`] = mode.origin.default;
			tokens[`--db-${key}-origin-${scheme}-hovered`] = mode.origin.hovered;
			tokens[`--db-${key}-origin-${scheme}-pressed`] = mode.origin.pressed;
			tokens[`--db-${key}-on-origin-${scheme}-default`] = mode.onOrigin;
		}
	}

	// Semantic colors alias a color family instead of carrying a palette of their own
	for (const key of SEMANTIC_KEYS) {
		const family = config.semantic[key];
		for (const suffix of COLOR_TOKEN_SUFFIXES) {
			tokens[`--db-${key}-${suffix}`] = `var(--db-${family}-${suffix})`;
		}
	}

	for (const key of COLOR_KEYS) {
		const { origin, originDark, h, s } = config.colors[key];
		// The state direction is always automatic
		const mode = buildColorMode(h == null ? origin : { origin, h, s }, {
			neutral: key === 'neutral',
		});
		applyPureOnOrigin(mode);
		modes[key] = mode;
		mode.palette.forEach((value, index) => {
			tokens[`--db-${key}-${index}`] = value;
		});
		tokens[`--db-${key}-origin-base`] = mode.origin.default;
		// A separate dark origin (Primary only) gets its own states and on-origin color;
		// otherwise dark uses the same origin as light.
		const darkMode = originDark ? applyPureOnOrigin(buildColorMode(originDark)) : mode;
		const perScheme = { light: mode, dark: darkMode };
		for (const scheme of ['light', 'dark'] as const) {
			const schemeMode = perScheme[scheme];
			tokens[`--db-${key}-origin-${scheme}-default`] = schemeMode.origin.default;
			tokens[`--db-${key}-origin-${scheme}-hovered`] = schemeMode.origin.hovered;
			tokens[`--db-${key}-origin-${scheme}-pressed`] = schemeMode.origin.pressed;
			tokens[`--db-${key}-on-origin-${scheme}-default`] = schemeMode.onOrigin;
		}
	}

	RADIUS_SIZES.forEach((size, index) => {
		const value = radiusForSize(config.radius, index);
		tokens[`--db-border-radius-${size}`] = value === 0 ? '0' : `${value}rem`;
	});

	tokens['--db-font-family-head'] = FONT_STACKS[config.headingFont].head;
	tokens['--db-font-family-sans'] = FONT_STACKS[config.bodyFont].sans;

	return { tokens, modes, familyModes };
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
	if (config.headingFont !== 'db') {
		rules.push(
			`h1, h2, h3, h4, h5, h6, .db-heading, .db-heading * {\n\tfont-family: var(--db-font-family-head) !important;\n}`,
		);
	}
	return rules.join('\n\n');
};

export const tokensToDeclarations = (tokens: Record<string, string>, indent = '\t'): string =>
	Object.entries(tokens)
		.map(([name, value]) => `${indent}${name}: ${value};`)
		.join('\n');

export const toCss = (config: ThemeConfig, tokens: Record<string, string>): string => {
	const groups: string[] = [];
	const colorGroups: { key: string; label: string }[] = [
		...COLOR_KEYS.map((key) => ({ key, label: key === 'brand' ? 'primary (brand)' : key })),
		...config.families.map(({ key, name }) => ({ key, label: name })),
		...SEMANTIC_KEYS.map((key) => ({ key, label: `${key} → ${config.semantic[key]}` })),
	];
	for (const { key, label } of colorGroups) {
		const entries = Object.fromEntries(
			Object.entries(tokens).filter(([name]) => name.startsWith(`--db-${key}-`)),
		);
		groups.push(`\t/* ${label} */\n${tokensToDeclarations(entries)}`);
	}
	const rest = Object.fromEntries(
		Object.entries(tokens).filter(
			([name]) => !colorGroups.some(({ key }) => name.startsWith(`--db-${key}-`)),
		),
	);
	groups.push(`\t/* border radius & fonts */\n${tokensToDeclarations(rest)}`);

	return `/**
 * DB UX Design System – generated theme (${config.preset})
 * Palette rule: New Foundation color generator (HSLuv)
 *
 * Load this file after @db-ux/db-theme.
 * Density: set data-density="${config.density}" on <body> or a container.
 * Mode: set data-mode="${config.mode}" (or leave it unset to follow the OS).
 */
:root {
${groups.join('\n\n')}
}
${typographyCss(config) ? `\n/* Apply the chosen fonts over the DB typography shorthands */\n${typographyCss(config)}\n` : ''}${componentCss(config) ? `\n/* Component adjustments for rounded corners */\n${componentCss(config)}\n` : ''}${config.icons === 'lucide' ? `\n/* Icons: Lucide (white label icon fonts of @db-ux/core-foundations) */\n${iconCss(config)}\n` : ''}`;
};

export const toJson = (config: ThemeConfig, tokens: Record<string, string>): string =>
	JSON.stringify(
		{
			$schema: 'db-ux-theme-builder/v1',
			config,
			tokens,
		},
		null,
		2,
	);

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

const VAR_PATTERN = /^var\(\s*(--[a-z0-9-]+)\s*\)$/i;

/**
 * Turns a token value into a DTCG value. A `var(--db-x)` reference becomes a Style
 * Dictionary alias `{db.x}`, so the semantic-color aliases stay references instead of being
 * flattened. Other values are passed through unchanged.
 */
const sdValue = (value: string): string => {
	const match = value.match(VAR_PATTERN);
	if (!match) return value;
	const path = match[1].replace(/^--/, '').split('-').join('.');
	return `{${path}}`;
};

/** Inserts a token at the dotted path (`db.brand.7`) into the nested tree. */
const setSdToken = (root: SdNode, name: string, value: string): void => {
	const segments = name.replace(/^--/, '').split('-');
	let node = root;
	for (let i = 0; i < segments.length - 1; i += 1) {
		const segment = segments[i];
		const next = node[segment];
		if (!next || '$value' in next) node[segment] = {};
		node = node[segment] as SdNode;
	}
	node[segments[segments.length - 1]] = { $type: sdTypeFor(name), $value: sdValue(value) };
};

/**
 * Serializes the theme as Amazon Style Dictionary tokens (DTCG: `$type`/`$value`, nested).
 * Feed the file to a `style-dictionary` build as a source. Semantic colors stay aliases
 * (`{db.red.7}`), so changing the target family in one place updates everything that uses it.
 */
export const toStyleDictionary = (config: ThemeConfig, tokens: Record<string, string>): string => {
	const root: SdNode = {};
	for (const [name, value] of Object.entries(tokens)) {
		setSdToken(root, name, value);
	}
	return JSON.stringify(
		{
			$description: `DB UX Design System – generated theme (${config.preset}). Style Dictionary (DTCG) tokens. Density: data-density="${config.density}". Mode: data-mode="${config.mode}".`,
			...root,
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

/** Validates untrusted input (URL hash, JSON) and merges it onto the defaults. */
export const sanitizeConfig = (input: unknown): ThemeConfig => {
	const raw = (input && typeof input === 'object' ? input : {}) as Partial<
		Record<keyof ThemeConfig, unknown>
	>;
	const rawColors = (raw.colors && typeof raw.colors === 'object' ? raw.colors : {}) as Record<
		string,
		Partial<Record<keyof ColorConfig, unknown>> | undefined
	>;
	const rawSemantic = (
		raw.semantic && typeof raw.semantic === 'object' ? raw.semantic : {}
	) as Record<string, unknown>;
	const families = sanitizeFamilies(raw.families);
	const colors = {} as Record<ColorKey, ColorConfig>;
	for (const key of COLOR_KEYS) {
		const fallback = DEFAULT_CONFIG.colors[key];
		const candidate = rawColors[key] ?? {};
		const origin = isHex(candidate.origin) ? candidate.origin.toLowerCase() : fallback.origin;
		const keepRamp = isHex(candidate.origin);
		colors[key] = {
			origin,
			// A separate dark origin is only kept for Primary (brand)
			originDark:
				key === 'brand' && isHex(candidate.originDark)
					? candidate.originDark.toLowerCase()
					: undefined,
			h: keepRamp ? finiteOrUndefined(candidate.h) : fallback.h,
			s: keepRamp ? finiteOrUndefined(candidate.s) : fallback.s,
			direction: pick(candidate.direction, ['auto', 'darker', 'lighter'] as const, 'auto'),
		};
	}
	return {
		preset: pick(raw.preset, [...PRESETS, 'custom'] as const, 'custom'),
		colors,
		families,
		semantic: Object.fromEntries(
			SEMANTIC_KEYS.map((key) => [
				key,
				pick(
					rawSemantic[key],
					families.map((family) => family.key),
					SEMANTIC_DEFAULTS[key],
				),
			]),
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
 * Built-in families are always present (missing ones get their defaults, a valid origin is
 * kept). Custom families are kept when key, name and origin are valid.
 */
const sanitizeFamilies = (input: unknown): FamilyConfig[] => {
	const list = Array.isArray(input) ? input : [];
	const byKey = new Map<string, Record<string, unknown>>();
	for (const item of list) {
		if (item && typeof item === 'object' && typeof (item as { key?: unknown }).key === 'string') {
			byKey.set((item as { key: string }).key, item as Record<string, unknown>);
		}
	}
	const direction = (value: unknown) => pick(value, ['auto', 'darker', 'lighter'] as const, 'auto');
	const result: FamilyConfig[] = DEFAULT_FAMILIES.map((fallback) => {
		const candidate = byKey.get(fallback.key);
		if (!candidate || !isHex(candidate.origin)) return { ...fallback };
		const origin = candidate.origin.toLowerCase();
		const changed = origin !== fallback.origin;
		return {
			...fallback,
			origin,
			h: changed ? finiteOrUndefined(candidate.h) : fallback.h,
			s: changed ? finiteOrUndefined(candidate.s) : fallback.s,
			direction: direction(candidate.direction),
		};
	});
	for (const candidate of byKey.values()) {
		const key = candidate.key as string;
		const name = typeof candidate.name === 'string' ? candidate.name.trim().slice(0, 40) : '';
		if (isBuiltinFamily(key) || !name || !isHex(candidate.origin)) continue;
		if (familyKeyFromName(name) !== key || RESERVED_KEYS.has(key)) continue;
		if (result.some((family) => family.key === key)) continue;
		result.push({
			key,
			name,
			builtin: false,
			origin: candidate.origin.toLowerCase(),
			direction: direction(candidate.direction),
		});
	}
	return result;
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

export const shuffleConfig = (current: ThemeConfig): ThemeConfig => {
	const hue = randomBetween(0, 360);
	const brand = hsluvToHex(hue, randomBetween(70, 100), randomBetween(38, 56));
	const neutralHue = Math.random() < 0.5 ? hue : randomBetween(0, 360);
	return {
		...current,
		preset: 'custom',
		colors: {
			...current.colors,
			brand: color(brand),
			neutral: tintedNeutral(neutralHue, randomBetween(2, 16)),
		},
		radius: randomOf(RADII),
		headingFont: randomOf(FONTS.filter((font) => font !== 'db')),
		bodyFont: randomOf(FONTS.filter((font) => font !== 'db' && font !== 'mono')),
		icons: 'lucide',
	};
};
