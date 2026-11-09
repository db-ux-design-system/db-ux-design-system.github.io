/**
 * Adaptive color tokens.
 *
 * Every color family in the DB UX theme exposes a fixed set of adaptive semantic variables
 * (`--db-<color>-bg-basic-level-1-default`, `--db-<color>-on-bg-basic-emphasis-80-default`, …)
 * on top of its 15 palette steps and its origin/on-origin values. Each one is a
 * `light-dark(...)` reference into the palette steps of the same family, so it follows the
 * color mode.
 *
 * The mapping (which step feeds which variable in light and in dark) is identical for every
 * built-in family. It was extracted verbatim from `@db-ux/core-foundations`
 * (`build/styles/rollup.css`) and only parameterized by the family key, so a custom or
 * additional family gets exactly the same adaptive set the design system defines for its
 * built-in colors. Regenerate from that file if the design system changes the mapping.
 */

/** Builds `light-dark(var(--db-<color>-<a>), var(--db-<color>-<b>))`. */
const ld = (a: number, b: number) => (color: string) =>
	`light-dark(var(--db-${color}-${a}), var(--db-${color}-${b}))`;

/** Builds a transparent fill: `light-dark(color-mix(…), color-mix(…))`. */
const mix = (lightPct: number, darkPct: number) => (color: string) =>
	`light-dark(color-mix(in srgb, transparent ${lightPct}%, var(--db-${color}-6)), color-mix(in srgb, transparent ${darkPct}%, var(--db-${color}-9)))`;

/**
 * Suffix → value factory for every adaptive variable a color family provides, beyond its
 * palette steps and origin/on-origin tokens (those are emitted in buildTheme). The order
 * matches the design system's own output.
 */
export const ADAPTIVE_COLOR_TOKENS: ReadonlyArray<readonly [string, (color: string) => string]> = [
	['on-bg-basic-emphasis-50-default', ld(9, 5)],
	['on-bg-basic-emphasis-60-default', ld(10, 6)],
	['on-bg-basic-emphasis-70-default', ld(7, 8)],
	['on-bg-basic-emphasis-70-hovered', ld(4, 10)],
	['on-bg-basic-emphasis-70-pressed', ld(6, 9)],
	['on-bg-basic-emphasis-80-default', ld(6, 9)],
	['on-bg-basic-emphasis-80-hovered', ld(3, 12)],
	['on-bg-basic-emphasis-80-pressed', ld(5, 10)],
	['on-bg-basic-emphasis-90-default', ld(4, 10)],
	['on-bg-basic-emphasis-90-hovered', ld(0, 14)],
	['on-bg-basic-emphasis-90-pressed', ld(3, 11)],
	['on-bg-basic-emphasis-100-default', ld(1, 12)],
	['on-bg-basic-emphasis-100-hovered', ld(5, 9)],
	['on-bg-basic-emphasis-100-pressed', ld(2, 11)],
	['on-bg-inverted-default', ld(14, 3)],
	['on-bg-inverted-hovered', ld(11, 0)],
	['on-bg-inverted-pressed', ld(13, 2)],
	['on-bg-vibrant-default', ld(1, 1)],
	['on-bg-vibrant-hovered', ld(4, 4)],
	['on-bg-vibrant-pressed', ld(2, 2)],
	['bg-basic-level-1-default', ld(14, 1)],
	['bg-basic-level-1-hovered', ld(13, 3)],
	['bg-basic-level-1-pressed', ld(12, 4)],
	['bg-basic-level-2-default', ld(13, 2)],
	['bg-basic-level-2-hovered', ld(12, 4)],
	['bg-basic-level-2-pressed', ld(11, 5)],
	['bg-basic-level-3-default', ld(12, 3)],
	['bg-basic-level-3-hovered', ld(11, 1)],
	['bg-basic-level-3-pressed', ld(10, 0)],
	['bg-basic-transparent-full-default', mix(100, 100)],
	['bg-basic-transparent-semi-default', mix(92, 84)],
	['bg-basic-transparent-full-hovered', mix(76, 76)],
	['bg-basic-transparent-full-pressed', mix(68, 68)],
	['bg-basic-transparent-semi-hovered', mix(76, 76)],
	['bg-basic-transparent-semi-pressed', mix(68, 68)],
	['bg-inverted-contrast-max-default', ld(1, 12)],
	['bg-inverted-contrast-max-hovered', ld(5, 9)],
	['bg-inverted-contrast-max-pressed', ld(2, 11)],
	['bg-inverted-contrast-high-default', ld(6, 9)],
	['bg-inverted-contrast-high-hovered', ld(2, 12)],
	['bg-inverted-contrast-high-pressed', ld(5, 10)],
	['bg-inverted-contrast-low-default', ld(7, 8)],
	['bg-inverted-contrast-low-hovered', ld(3, 12)],
	['bg-inverted-contrast-low-pressed', ld(6, 9)],
	['bg-vibrant-default', ld(9, 9)],
	['bg-vibrant-hovered', ld(12, 12)],
	['bg-vibrant-pressed', ld(10, 10)],
];

/** The adaptive tokens for one color family, as a suffix → value map. */
export const adaptiveTokensFor = (color: string): Record<string, string> =>
	Object.fromEntries(ADAPTIVE_COLOR_TOKENS.map(([suffix, value]) => [suffix, value(color)]));
