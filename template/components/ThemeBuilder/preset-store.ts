/**
 * Short, shareable preset keys for the URL, e.g. `?preset=db` or `?preset=b6YWkyP8i`.
 *
 * Built-in presets use their name as the key. A custom theme is stored under a short random
 * key in localStorage, so the URL stays short like on ui.shadcn.com. Because there is no
 * backend, a custom-theme link only resolves on the device that created it; on another
 * device the builder falls back to the default. Built-in presets always resolve everywhere.
 */
import {
	applyPreset,
	decodeConfig,
	DEFAULT_CONFIG,
	encodeConfig,
	PRESETS,
	sanitizeConfig,
	type Preset,
	type ThemeConfig,
} from './theme.ts';

const STORAGE_PREFIX = 'db-ux-theme-builder:preset:';
const KEY_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const KEY_LENGTH = 9;
const BUILTIN = new Set<string>(PRESETS);

const isBuiltin = (value: string): value is Exclude<Preset, 'custom'> => BUILTIN.has(value);

const randomKey = (): string => {
	const bytes = new Uint8Array(KEY_LENGTH);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (byte) => KEY_ALPHABET[byte % KEY_ALPHABET.length]).join('');
};

/**
 * Returns a short key for the config and persists a custom theme so the key resolves later.
 * A built-in preset returns its name; a custom theme returns a stored random key.
 */
export const storePreset = (config: ThemeConfig): string => {
	if (config.preset !== 'custom' && isBuiltin(config.preset)) {
		return config.preset;
	}
	const key = randomKey();
	try {
		window.localStorage.setItem(STORAGE_PREFIX + key, encodeConfig(config));
	} catch {
		// Storage can be unavailable (private mode, quota). The link still carries the key;
		// it simply will not resolve, and the builder falls back to the default.
	}
	return key;
};

/** Resolves a preset key from the URL back into a config, or undefined if unknown. */
export const resolvePreset = (key: string): ThemeConfig | undefined => {
	if (isBuiltin(key)) {
		return applyPreset(key, { density: DEFAULT_CONFIG.density, mode: DEFAULT_CONFIG.mode });
	}
	try {
		const stored = window.localStorage.getItem(STORAGE_PREFIX + key);
		return stored ? decodeConfig(stored) : undefined;
	} catch {
		return undefined;
	}
};

/**
 * Search params for a shareable link. A built-in preset is a short `?preset=<name>`.
 * A custom theme is encoded in full as `?theme=<encoded>`, so the link carries the whole
 * config and resolves for anyone, not just on the device that created it.
 */
export const shareSearchParams = (config: ThemeConfig, view?: string): URLSearchParams => {
	const params = new URLSearchParams();
	if (config.preset !== 'custom' && isBuiltin(config.preset)) {
		params.set('preset', config.preset);
	} else {
		params.set('theme', encodeConfig(config));
	}
	// The active tab, so a shared link opens on the same view (e.g. `?view=components`)
	if (view && view !== 'modules') {
		params.set('view', view);
	}
	return params;
};

/**
 * Reads the config from the current URL: a full `?theme=`/`#theme=` first (shared links),
 * then a `?preset=<key>` (built-in name, or a custom key stored locally on this device).
 */
export const configFromUrl = (): ThemeConfig | undefined => {
	const search = new URLSearchParams(window.location.search);
	const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
	const encoded = search.get('theme') ?? hash.get('theme');
	if (encoded) {
		const decoded = decodeConfig(encoded);
		if (decoded) return decoded;
	}
	const presetKey = search.get('preset');
	if (presetKey) {
		const resolved = resolvePreset(presetKey);
		if (resolved) return resolved;
	}
	return undefined;
};

/** Validates a sanitized config, kept here so callers import one sharing module. */
export const ensureConfig = (input: unknown): ThemeConfig => sanitizeConfig(input);
