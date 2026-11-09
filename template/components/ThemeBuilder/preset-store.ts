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
const BUILTIN = new Set<string>(PRESETS);
/** How many stored custom presets to keep before evicting the oldest on write. */
const MAX_STORED_PRESETS = 20;

const isBuiltin = (value: string): value is Exclude<Preset, 'custom'> => BUILTIN.has(value);

/**
 * A built-in preset can be shared by name only when it is shown exactly as defined. Once the
 * user changes mode or density on top of it, the name alone would drop that on reload, so
 * such a config has to be encoded in full.
 */
const isPlainBuiltin = (
	config: ThemeConfig,
): config is ThemeConfig & { preset: Exclude<Preset, 'custom'> } =>
	config.preset !== 'custom' &&
	isBuiltin(config.preset) &&
	config.mode === DEFAULT_CONFIG.mode &&
	config.density === DEFAULT_CONFIG.density;

/** A short, stable key derived from the encoded config, so the same theme reuses one entry
 *  instead of writing a new one on every call. */
const keyForConfig = (encoded: string): string => {
	let hash = 0x811c9dc5;
	for (let i = 0; i < encoded.length; i += 1) {
		hash ^= encoded.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193);
	}
	return (hash >>> 0).toString(36);
};

/** Keeps the stored presets under the cap by removing the oldest extra entries. */
const prunePresets = (keepKey: string): void => {
	try {
		const keys: string[] = [];
		for (let i = 0; i < window.localStorage.length; i += 1) {
			const k = window.localStorage.key(i);
			if (k?.startsWith(STORAGE_PREFIX) && k !== STORAGE_PREFIX + keepKey) keys.push(k);
		}
		// localStorage has no insertion order guarantee, but removing any excess entries keeps
		// the origin from filling up; the just-written key is always kept.
		for (const k of keys.slice(0, Math.max(0, keys.length + 1 - MAX_STORED_PRESETS))) {
			window.localStorage.removeItem(k);
		}
	} catch {
		// ignore: pruning is best-effort
	}
};

/**
 * Returns a short key for the config and persists a custom theme so the key resolves later.
 * A plain built-in preset returns its name; anything else returns a stable hashed key and is
 * stored once. Repeated calls with the same config reuse the entry instead of growing storage.
 */
export const storePreset = (config: ThemeConfig): string => {
	if (isPlainBuiltin(config)) {
		return config.preset;
	}
	const encoded = encodeConfig(config);
	const key = keyForConfig(encoded);
	try {
		window.localStorage.setItem(STORAGE_PREFIX + key, encoded);
		prunePresets(key);
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
	if (isPlainBuiltin(config)) {
		params.set('preset', config.preset);
	} else {
		// Includes a built-in preset shown with a changed mode or density: encode it in full
		// so the link restores exactly what is displayed, not the preset defaults.
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
