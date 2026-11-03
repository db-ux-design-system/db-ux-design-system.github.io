/**
 * Runs inside the preview document.
 *
 * The preview receives its theme two ways: on first load and when opened in a new tab it
 * reads `#preset=<key>&view=<view>` from its own URL; while the builder is open next to it,
 * the builder pushes live updates via postMessage so no URL change or reload is needed.
 */
import {
	buildTheme,
	componentCss,
	DEFAULT_CONFIG,
	iconCss,
	sanitizeConfig,
	tokensToDeclarations,
	typographyCss,
} from './theme.ts';
import { resolvePreset } from './preset-store.ts';
import type { ThemeConfig } from './theme.ts';

export const PREVIEW_VIEWS = ['modules', 'components', 'typography', 'palettes'] as const;
export type PreviewView = (typeof PREVIEW_VIEWS)[number];

/**
 * The white label icon font only contains the icons of the Core Foundation. The Tag
 * specimens of the shared Component Overview use `star`, which it does not ship, so the
 * preview shows the white label placeholder instead of an empty spot.
 */
const WHITE_LABEL_ICON_FALLBACK = `[data-icon="star"] {\n\t--db-icon: "x_placeholder";\n}`;

export const PREVIEW_MESSAGE_TYPE = 'db-ux-theme-builder:preview';

export type PreviewMessage = {
	type: typeof PREVIEW_MESSAGE_TYPE;
	config: ThemeConfig;
	view: PreviewView;
};

/** The iframe is addressed with the same short preset key as the page URL. */
export const createPreviewHash = (presetKey: string, view: PreviewView): string =>
	`#preset=${encodeURIComponent(presetKey)}&view=${view}`;

export const asView = (value: unknown): PreviewView =>
	PREVIEW_VIEWS.includes(value as PreviewView) ? (value as PreviewView) : 'modules';

const applyConfig = (config: ThemeConfig, view: PreviewView, doc: Document): void => {
	const { tokens } = buildTheme(config);
	let style = doc.getElementById('theme-builder-tokens');
	if (!style) {
		style = doc.createElement('style');
		style.id = 'theme-builder-tokens';
		doc.head.append(style);
	}
	const icons =
		config.icons === 'lucide' ? `\n${iconCss(config)}\n${WHITE_LABEL_ICON_FALLBACK}` : '';
	const components = componentCss(config);
	// In the preview the body font scope is the scroll container, not <body>
	const typography = typographyCss(config, '.tb-preview-main');
	style.textContent = `:root {\n${tokensToDeclarations(tokens)}\n}${typography ? `\n${typography}` : ''}${components ? `\n${components}` : ''}${icons}`;
	doc.documentElement.dataset.view = view;
	doc.body.dataset.density = config.density;
	doc.body.dataset.mode = config.mode;
	renderPalettes(config, tokens, doc);
};

/**
 * Renders the palettes view. Custom families only exist at runtime, so the markup is built
 * here. Names come from the URL or storage and are therefore only set as text content.
 */
const renderPalettes = (
	config: ThemeConfig,
	tokens: Record<string, string>,
	doc: Document,
): void => {
	const container = doc.querySelector<HTMLElement>('[data-tb-palettes]');
	if (!container) return;
	const groups = [
		{ key: 'brand', label: 'Primary' },
		{ key: 'neutral', label: 'Neutral' },
		...config.families.map(({ key, name }) => ({ key, label: name })),
	];
	const element = <K extends keyof HTMLElementTagNameMap>(tag: K, className: string) => {
		const node = doc.createElement(tag);
		node.className = className;
		return node;
	};
	const fragment = doc.createDocumentFragment();
	for (const { key, label } of groups) {
		const group = element('section', 'tb-palette-group');
		const title = element('h3', 'tb-palette-title');
		title.textContent = label;
		const list = element('ol', 'tb-palette');
		list.setAttribute('aria-label', `${label} palette`);
		for (let step = 0; step < 15; step += 1) {
			const value = tokens[`--db-${key}-${step}`] ?? '';
			const item = doc.createElement('li');
			const swatch = element('span', 'tb-swatch');
			swatch.style.backgroundColor = value;
			const stepLabel = element('span', 'tb-swatch-step');
			stepLabel.textContent = String(step);
			const hex = element('code', 'tb-swatch-hex');
			hex.textContent = value;
			item.append(swatch, stepLabel, hex);
			list.append(item);
		}
		// DB Tags filled with the origin states. The scheme-aware variables follow the
		// preview mode (a separate dark origin shows in dark mode); the light values are
		// the fallback when a family defines no scheme-aware variable.
		const chips = element('div', 'tb-origin-chips');
		for (const state of ['default', 'hovered', 'pressed']) {
			const chip = element('span', 'db-tag tb-origin-tag');
			chip.dataset['emphasis'] = 'strong';
			chip.style.setProperty(
				'--tb-chip-bg',
				`var(--db-${key}-origin-${state}, ${tokens[`--db-${key}-origin-light-${state}`] ?? 'transparent'})`,
			);
			chip.style.setProperty(
				'--tb-chip-fg',
				`var(--db-${key}-on-origin-default, ${tokens[`--db-${key}-on-origin-light-default`] ?? 'currentcolor'})`,
			);
			chip.textContent = `origin ${state}`;
			chips.append(chip);
		}
		// Order: headline, origin tags, then the palette swatches below
		group.append(title, chips, list);
		fragment.append(group);
	}
	container.replaceChildren(fragment);
};

export const applyPreviewFromHash = (doc: Document = document): void => {
	const params = new URLSearchParams(doc.location.hash.replace(/^#/, ''));
	const presetKey = params.get('preset');
	const config = (presetKey && resolvePreset(presetKey)) || DEFAULT_CONFIG;
	applyConfig(config, asView(params.get('view')), doc);
};

export const initPreview = (): void => {
	applyPreviewFromHash();
	// "Show more" in the single-column modules view reveals the remaining modules
	document.querySelector('[data-tb-show-more] button')?.addEventListener('click', () => {
		document.documentElement.dataset.modulesExpanded = '';
		// The button disappears, so the focus moves to the first revealed module instead of
		// falling back to the document start
		const next = document.querySelector<HTMLElement>('.tb-masonry > .tb-module:nth-child(5)');
		if (next) {
			next.tabIndex = -1;
			next.focus({ preventScroll: true });
		}
	});
	window.addEventListener('hashchange', () => applyPreviewFromHash());
	window.addEventListener('message', (event: MessageEvent) => {
		// Same-origin only: the builder and the preview are served from the same site.
		if (event.origin !== window.location.origin) return;
		const data = event.data as Partial<PreviewMessage> | null;
		if (!data || data.type !== PREVIEW_MESSAGE_TYPE) return;
		applyConfig(sanitizeConfig(data.config), asView(data.view), document);
	});
};
