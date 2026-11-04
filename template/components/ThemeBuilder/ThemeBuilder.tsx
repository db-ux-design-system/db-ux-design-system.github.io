import { type ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	DBAccordion,
	DBAccordionItem,
	DBButton,
	DBDialog,
	DBDialogFooter,
	DBDialogHeader,
	DBDrawer,
	DBDrawerHeader,
	DBInfotext,
	DBInput,
	DBSelect,
	DBStack,
	DBTabItem,
	DBTabList,
	DBTabs,
	DBTooltip,
} from '@db-ux/react-core-components';
import {
	applyPreset,
	buildTheme,
	DEFAULT_CONFIG,
	familyKeyFromName,
	SEMANTIC_KEYS,
	SEMANTIC_DEFAULTS,
	validateFamilyName,
	FONTS,
	ICON_LIBRARIES,
	isHex,
	PRESETS,
	RADII,
	shuffleConfig,
	toCss,
	toStyleDictionary,
	type ColorConfig,
	type ColorKey,
	type FamilyConfig,
	type FamilyKey,
	type SemanticKey,
	type Preset,
	type ThemeConfig,
} from './theme.ts';
import type { ColorMode } from './color/palette-rule.ts';
import {
	asView,
	createPreviewHash,
	PREVIEW_MESSAGE_TYPE,
	PREVIEW_VIEWS,
	type PreviewMessage,
	type PreviewView,
} from './preview-runtime.ts';
import { configFromUrl, shareSearchParams, storePreset } from './preset-store.ts';
import {
	themeBuilderMessages,
	type ThemeBuilderLang,
	type ThemeBuilderMessages,
} from './messages.ts';
import './ThemeBuilder.css';

type Props = {
	lang?: ThemeBuilderLang;
};

type CodeFormat = 'css' | 'sd';

/** Same breakpoint as the CSS: below it the settings panel lives in a drawer. */
const COMPACT_QUERY = '(width < 64em)';

/** Tracks a media query; the builder renders client-only, so window is available. */
const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
	useEffect(() => {
		const list = window.matchMedia(query);
		const onChange = () => setMatches(list.matches);
		onChange();
		list.addEventListener('change', onChange);
		return () => list.removeEventListener('change', onChange);
	}, [query]);
	return matches;
};

/** The sections of the settings panel; one is open at a time. */
type SettingsSection = 'colors' | 'semantic' | 'families' | 'shape';

/** File name, MIME type and label per code format. */
const CODE_FILES: Record<CodeFormat, { name: string; type: string; label: string }> = {
	css: { name: 'theme.css', type: 'text/css', label: 'CSS' },
	sd: { name: 'theme.tokens.json', type: 'application/json', label: 'Style Dictionary' },
};

const SITE_MODE_KEY = 'db-ux-mode';

const getInitialConfig = (): ThemeConfig => {
	const fromUrl = configFromUrl();
	if (fromUrl) return fromUrl;
	// Guarded: where storage is blocked (private mode, hardened settings) this read throws,
	// and since it runs in the useState initializer that would stop the builder from mounting.
	let siteMode: string | null = null;
	try {
		siteMode = window.localStorage.getItem(SITE_MODE_KEY);
	} catch {
		// ignore: fall back to the default mode
	}
	return { ...DEFAULT_CONFIG, mode: siteMode === 'dark' ? 'dark' : 'light' };
};

/** Opens a specific preview tab from the URL, e.g. `?view=components`; defaults to modules. */
const getInitialView = (): PreviewView =>
	asView(new URLSearchParams(window.location.search).get('view'));

const formatNumber = (value: number, lang: ThemeBuilderLang, digits = 2): string =>
	value.toLocaleString(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Native select based on DBSelect with typed options. */
function SelectField<T extends string>({
	id,
	label,
	value,
	options,
	onChange,
	showLabel,
}: {
	id: string;
	label: string;
	value: T;
	options: readonly { value: T; label: string }[];
	onChange: (value: T) => void;
	/** `false` hides the label visually; it stays the accessible name. */
	showLabel?: boolean;
}) {
	return (
		// eslint-disable-next-line db-ux/select-requires-options
		<DBSelect
			id={id}
			label={label}
			showLabel={showLabel}
			value={value}
			onChange={(event) => onChange(event.target.value as T)}
		>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</DBSelect>
	);
}

/** Built-in families use their translated name, custom families the name given by the user. */
const familyLabel = (family: FamilyConfig, m: ThemeBuilderMessages): string =>
	family.builtin
		? (m.familyNames[family.key as keyof ThemeBuilderMessages['familyNames']] ?? family.name)
		: family.name;

/** Semantic colors pick one of the color families; the ramp shows the chosen family. */
function SemanticField({
	semanticKey,
	family,
	families,
	palette,
	m,
	onChange,
}: {
	semanticKey: SemanticKey;
	family: FamilyKey;
	families: FamilyConfig[];
	palette: string[];
	m: ThemeBuilderMessages;
	onChange: (family: FamilyKey) => void;
}) {
	return (
		<div className="tb-color-field">
			<SelectField
				id={`tb-semantic-${semanticKey}`}
				label={m.semanticNames[semanticKey]}
				value={family}
				options={families.map((item) => ({ value: item.key, label: familyLabel(item, m) }))}
				onChange={onChange}
			/>
			<ol className="tb-ramp" aria-hidden="true">
				{palette.map((value, index) => (
					<li key={index} style={{ backgroundColor: value }} title={`${index}: ${value}`} />
				))}
			</ol>
		</div>
	);
}

/** Opens a modal dialog to add a custom family with a name and an origin color. */
function AddFamilyDialog({
	families,
	m,
	onAdd,
}: {
	families: FamilyConfig[];
	m: ThemeBuilderMessages;
	onAdd: (name: string, origin: string) => void;
}) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [origin, setOrigin] = useState('#2a9d8f');
	const [touched, setTouched] = useState(false);
	const error = validateFamilyName(name, families);
	const originValid = isHex(origin);
	const showError = touched && error !== undefined;

	const close = () => {
		setOpen(false);
		setName('');
		setTouched(false);
	};

	return (
		<>
			<DBButton
				wrap={false}
				variant="filled"
				icon="plus"
				width="full"
				type="button"
				onClick={() => setOpen(true)}
			>
				{m.addFamilyButton}
			</DBButton>
			<DBDialog
				open={open}
				onClose={close}
				containerSize="small"
				header={<DBDialogHeader closeButtonText={m.cancel} text={m.addFamily} />}
				footer={
					<DBDialogFooter>
						<DBButton wrap={false} variant="ghost" type="button" onClick={close}>
							{m.cancel}
						</DBButton>
						<DBButton
							wrap={false}
							variant="brand"
							type="button"
							disabled={error !== undefined || !originValid}
							onClick={() => {
								onAdd(name, origin.toLowerCase());
								close();
							}}
						>
							{m.addFamilyButton}
						</DBButton>
					</DBDialogFooter>
				}
			>
				<DBStack gap="small">
					<DBInput
						id="tb-new-family-name"
						label={m.familyName}
						value={name}
						maxLength={40}
						validation={showError ? 'invalid' : 'no-validation'}
						invalidMessage={error ? m.familyNameErrors[error] : undefined}
						showMessage={false}
						onChange={(event) => {
							setName(event.target.value);
							setTouched(true);
						}}
						type="text"
					/>
					{showError ? (
						<DBInfotext size="small" semantic="critical">
							{m.familyNameErrors[error]}
						</DBInfotext>
					) : null}
					<div className="tb-color-row">
						<DBInput
							id="tb-new-family-hex"
							label={m.hexLabel(m.familyOrigin)}
							value={origin}
							maxLength={7}
							validation={originValid ? 'no-validation' : 'invalid'}
							invalidMessage={m.hexInvalid}
							showMessage={false}
							onChange={(event) => setOrigin(event.target.value.trim())}
							type="text"
						/>
						<input
							type="color"
							className="tb-color-swatch"
							value={originValid ? origin : '#000000'}
							aria-label={m.colorPicker(m.familyOrigin)}
							onChange={(event) => setOrigin(event.target.value.toLowerCase())}
						/>
					</div>
				</DBStack>
			</DBDialog>
		</>
	);
}

/** A hex input with a color swatch inside it, used for every origin field. */
function HexField({
	id,
	label,
	value,
	pickerLabel,
	invalidMessage,
	onChange,
}: {
	id: string;
	label: string;
	value: string;
	pickerLabel: string;
	invalidMessage: string;
	onChange: (value: string) => void;
}) {
	const [draft, setDraft] = useState(value);
	useEffect(() => setDraft(value), [value]);
	const invalid = !isHex(draft);
	return (
		<>
			{/* The swatch sits inside the input, in front of the hex value */}
			<div className="tb-color-row">
				<DBInput
					id={id}
					label={label}
					value={draft}
					maxLength={7}
					validation={invalid ? 'invalid' : 'no-validation'}
					invalidMessage={invalidMessage}
					showMessage={false}
					onChange={(event) => {
						const next = event.target.value.trim();
						setDraft(next);
						if (isHex(next)) onChange(next.toLowerCase());
					}}
					type="text"
				/>
				<input
					type="color"
					className="tb-color-swatch"
					value={isHex(draft) ? draft : '#000000'}
					aria-label={pickerLabel}
					onChange={(event) => onChange(event.target.value.toLowerCase())}
				/>
			</div>
			{invalid ? (
				<DBInfotext size="small" semantic="critical">
					{invalidMessage}
				</DBInfotext>
			) : null}
		</>
	);
}

function ColorField({
	id,
	name,
	color,
	mode,
	m,
	lang,
	allowDarkOrigin,
	onOriginChange,
	onDarkOriginChange,
}: {
	id: string;
	name: string;
	color: ColorConfig;
	mode: ColorMode;
	m: ThemeBuilderMessages;
	lang: ThemeBuilderLang;
	/** Primary offers a separate dark-mode origin; the other colors do not. */
	allowDarkOrigin?: boolean;
	onOriginChange: (value: string) => void;
	onDarkOriginChange?: (value: string | undefined) => void;
}) {
	const contrastOk = mode.contrastOnOrigin >= 4.5;
	const hasDark = color.originDark != null;

	return (
		<div className="tb-color-field">
			<HexField
				id={`tb-${id}-hex`}
				label={allowDarkOrigin ? m.originLight(name) : m.hexLabel(name)}
				value={color.origin}
				pickerLabel={m.colorPicker(name)}
				invalidMessage={m.hexInvalid}
				onChange={onOriginChange}
			/>
			{allowDarkOrigin ? (
				hasDark ? (
					<>
						<HexField
							id={`tb-${id}-hex-dark`}
							label={m.originDark(name)}
							value={color.originDark ?? color.origin}
							pickerLabel={m.colorPickerDark(name)}
							invalidMessage={m.hexInvalid}
							onChange={(value) => onDarkOriginChange?.(value)}
						/>
						<DBButton
							wrap={false}
							variant="ghost"
							size="small"
							icon="cross"
							width="full"
							type="button"
							onClick={() => onDarkOriginChange?.(undefined)}
						>
							{m.removeDarkOrigin}
						</DBButton>
					</>
				) : (
					<DBButton
						wrap={false}
						variant="ghost"
						size="small"
						icon="plus"
						width="full"
						type="button"
						onClick={() => onDarkOriginChange?.(color.origin)}
					>
						{m.addDarkOrigin}
					</DBButton>
				)
			) : null}
			<ol className="tb-ramp" aria-hidden="true">
				{mode.palette.map((value, index) => (
					<li key={index} style={{ backgroundColor: value }} title={`${index}: ${value}`} />
				))}
			</ol>
			<DBInfotext size="small" semantic={contrastOk ? 'successful' : 'warning'}>
				{m.onOriginContrast(formatNumber(mode.contrastOnOrigin, lang))} ·{' '}
				{contrastOk ? m.contrastAa : m.contrastFail}
			</DBInfotext>
		</div>
	);
}

const ThemeBuilder = ({ lang = 'en' }: Props) => {
	const m = themeBuilderMessages[lang];
	const [config, setConfig] = useState<ThemeConfig>(getInitialConfig);
	const [view, setView] = useState<PreviewView>(getInitialView);
	const [codeOpen, setCodeOpen] = useState(false);
	const [codeFormat, setCodeFormat] = useState<CodeFormat>('css');
	const isCompact = useMediaQuery(COMPACT_QUERY);
	const [settingsOpen, setSettingsOpen] = useState(false);
	// The open settings section. One at a time, controlled here so every item's state
	// matches what is shown (see the accordion below).
	const [openSection, setOpenSection] = useState<SettingsSection | null>('colors');
	const sectionProps = (section: SettingsSection) => ({
		open: openSection === section,
		onToggle: (open: boolean) => setOpenSection(open ? section : null),
	});
	const [status, setStatus] = useState('');
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const rootRef = useRef<HTMLDivElement>(null);

	const theme = useMemo(() => buildTheme(config), [config]);
	const basePath = lang === 'de' ? '/de/theme-builder' : '/theme-builder';
	const previewPath = `${basePath}/preview`;
	// The iframe loads once with the current state as a preset key; later updates go through
	// postMessage, so the frame never reloads while the builder is used.
	const [initialPreviewUrl] = useState(
		() => `${previewPath}${createPreviewHash(storePreset(config), view)}`,
	);

	const code = useMemo(
		() =>
			codeFormat === 'sd' ? toStyleDictionary(config, theme.tokens) : toCss(config, theme.tokens),
		[codeFormat, config, theme.tokens],
	);

	// Push live updates into the preview without changing its URL or reloading it.
	useEffect(() => {
		const frameWindow = iframeRef.current?.contentWindow;
		if (!frameWindow) return;
		const message: PreviewMessage = { type: PREVIEW_MESSAGE_TYPE, config, view };
		frameWindow.postMessage(message, window.location.origin);
	}, [config, view]);

	/*
	 * The page itself must not scroll, only the settings, preview and code panels.
	 * The shell content is the scroll container of the platform, so it is locked while
	 * the builder is mounted and the builder fills its visible height.
	 */
	useEffect(() => {
		const root = rootRef.current;
		const scroller = root?.closest<HTMLElement>('.db-shell-content');
		if (!root || !scroller) return;
		scroller.classList.add('tb-scroll-lock');
		scroller.scrollTop = 0;
		// In the compact layout the preset sits in the drawer, so the headers are not aligned
		const preset = isCompact ? null : root.querySelector<HTMLElement>('.tb-preset');
		const bar = root.querySelector<HTMLElement>('.tb-stage-bar');
		const fit = () => {
			// The locked container never keeps an offset, otherwise the builder sits too high
			scroller.scrollTop = 0;
			/*
			 * Measured against the viewport, not the shell container: the container grows with
			 * its content, so a larger height from the mobile layout kept itself after a resize
			 * and cut off the bottom of the builder.
			 */
			const available = window.innerHeight - root.getBoundingClientRect().top;
			root.style.setProperty('--tb-height', `${Math.max(available, 0)}px`);
			// Both headers share one height: the taller of the two, so they line up at any density.
			// The property is cleared first so each header reports its own content height again.
			root.style.removeProperty('--tb-header-height');
			if (preset && bar) {
				const height = Math.max(preset.offsetHeight, bar.offsetHeight);
				root.style.setProperty('--tb-header-height', `${height}px`);
			}
		};
		fit();
		const observer = new ResizeObserver(fit);
		observer.observe(scroller);
		if (preset) observer.observe(preset);
		if (bar) observer.observe(bar);
		// The viewport and the shell header (which switches between mobile and desktop) both
		// change the available height without resizing the observed elements
		window.addEventListener('resize', fit);
		return () => {
			window.removeEventListener('resize', fit);
			observer.disconnect();
			scroller.classList.remove('tb-scroll-lock');
		};
		// Re-measure when the layout switches, the panel and its preset are mounted anew
	}, [isCompact]);

	useEffect(() => {
		if (!status) return;
		const timeout = window.setTimeout(() => setStatus(''), 3000);
		return () => window.clearTimeout(timeout);
	}, [status]);

	const update = useCallback((patch: Partial<ThemeConfig>, keepPreset = false) => {
		setConfig((previous) => ({
			...previous,
			...patch,
			preset: keepPreset ? previous.preset : 'custom',
		}));
	}, []);

	const updateColor = useCallback((key: ColorKey, patch: Partial<ColorConfig>) => {
		setConfig((previous) => {
			const current = previous.colors[key];
			const originChanged = patch.origin != null && patch.origin !== current.origin;
			return {
				...previous,
				preset: 'custom',
				colors: {
					...previous.colors,
					// A new origin defines the ramp, so the fitted h/s of a preset are dropped
					[key]: originChanged
						? { ...current, ...patch, h: undefined, s: undefined }
						: { ...current, ...patch },
				},
			};
		});
	}, []);

	const copyText = async (text: string, message: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setStatus(message);
		} catch {
			setStatus('');
		}
	};

	/**
	 * Builds the shareable URL for the current config. A built-in preset stays short
	 * (`?preset=<name>`); a custom theme is encoded in full (`?theme=<encoded>`), so the
	 * link resolves for anyone. Also writes it into the address bar, so the current link
	 * always reflects what is shown.
	 */
	const buildShareUrl = useCallback((): string => {
		const url = new URL(basePath, window.location.origin);
		url.search = shareSearchParams(config, view).toString();
		// Keep Astro's ClientRouter navigation state; replacing it with null makes the router
		// ignore the entry, so pressing Back later restores the URL but not the page.
		window.history.replaceState(window.history.state, '', url.pathname + url.search);
		return url.href;
	}, [config, view, basePath]);

	// Switches the preview tab and reflects it in the address bar (`?view=`), so the current
	// link always points at the shown view. Other params (preset/theme) are kept.
	const changeView = useCallback((next: PreviewView) => {
		setView(next);
		const url = new URL(window.location.href);
		if (next === 'modules') {
			url.searchParams.delete('view');
		} else {
			url.searchParams.set('view', next);
		}
		// Preserve the ClientRouter state (see buildShareUrl), so Back after leaving the page
		// restores both the URL and the rendered page.
		window.history.replaceState(window.history.state, '', url.pathname + url.search);
	}, []);

	// Open the standalone preview in a new tab, carrying the current state and view.
	const openPreview = useCallback(() => {
		const key = storePreset(config);
		window.open(`${previewPath}${createPreviewHash(key, view)}`, '_blank', 'noopener');
	}, [config, previewPath, view]);

	// The frame may mount after the first state changes, so send the current state on load.
	const handleFrameLoad = useCallback(() => {
		const frameWindow = iframeRef.current?.contentWindow;
		if (!frameWindow) return;
		const message: PreviewMessage = { type: PREVIEW_MESSAGE_TYPE, config, view };
		frameWindow.postMessage(message, window.location.origin);
	}, [config, view]);

	const downloadCode = () => {
		const file = CODE_FILES[codeFormat];
		const blob = new Blob([code], { type: file.type });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = file.name;
		anchor.click();
		URL.revokeObjectURL(url);
	};

	const updateFamily = (key: FamilyKey, patch: Partial<ColorConfig>) => {
		setConfig((previous) => ({
			...previous,
			preset: 'custom',
			families: previous.families.map((family) => {
				if (family.key !== key) return family;
				const originChanged = patch.origin != null && patch.origin !== family.origin;
				// A new origin defines the ramp, so the fitted h/s of the built-in family are dropped
				return originChanged
					? { ...family, ...patch, h: undefined, s: undefined }
					: { ...family, ...patch };
			}),
		}));
	};

	const addFamily = (name: string, origin: string) => {
		setConfig((previous) => ({
			...previous,
			preset: 'custom',
			families: [
				...previous.families,
				{
					key: familyKeyFromName(name),
					name: name.trim(),
					builtin: false,
					origin,
					direction: 'auto',
				},
			],
		}));
	};

	const removeFamily = (key: FamilyKey) => {
		setConfig((previous) => ({
			...previous,
			preset: 'custom',
			families: previous.families.filter((family) => family.key !== key),
			// Semantic colors that used the removed family fall back to their default
			semantic: Object.fromEntries(
				SEMANTIC_KEYS.map((semanticKey) => [
					semanticKey,
					previous.semantic[semanticKey] === key
						? SEMANTIC_DEFAULTS[semanticKey]
						: previous.semantic[semanticKey],
				]),
			) as ThemeConfig['semantic'],
		}));
	};

	const renderColor = (key: ColorKey) => (
		<ColorField
			key={key}
			id={key}
			name={m.colorNames[key]}
			color={config.colors[key]}
			mode={theme.modes[key]}
			m={m}
			lang={lang}
			allowDarkOrigin={key === 'brand'}
			onOriginChange={(origin) => updateColor(key, { origin })}
			onDarkOriginChange={(originDark) => updateColor(key, { originDark })}
		/>
	);

	/*
	 * Below 64em the settings panel moves into a drawer, like the mobile menu of the shell.
	 * The same panel is rendered in either place, so there is a single source of state.
	 */
	const wrapSettings = (panel: ReactElement): ReactElement =>
		isCompact ? (
			<DBDrawer
				id="tb-settings-drawer"
				className="tb-settings-drawer"
				open={settingsOpen}
				onClose={() => setSettingsOpen(false)}
				direction="to-right"
				showSpacing={false}
				header={<DBDrawerHeader closeButtonText={m.closeSettings} text={m.settings} />}
			>
				{panel}
			</DBDrawer>
		) : (
			panel
		);

	const presetOptions: { value: Preset; label: string }[] = [
		...PRESETS.map((value) => ({ value, label: m.presets[value] })),
		...(config.preset === 'custom' ? [{ value: 'custom' as const, label: m.presets.custom }] : []),
	];

	return (
		<>
			<div ref={rootRef} className="theme-builder">
				{wrapSettings(
					<aside className="tb-controls" aria-label={m.settings}>
						{/* Preset stays in place; only the sections below it scroll */}
						<div className="tb-preset">
							<SelectField
								id="tb-preset"
								label={m.preset}
								value={config.preset}
								options={presetOptions}
								onChange={(value) => {
									if (value !== 'custom') setConfig(applyPreset(value, config));
								}}
							/>
						</div>
						<div className="tb-controls-scroll">
							{/* Every section is an accordion item, separated by full-width dividers */}
							{/*
							 * The items are controlled (`open` + `onToggle`) instead of `behavior="single"`:
							 * single mode lets the browser close the other items natively, while each item
							 * keeps its own state open, so the next click on it did nothing.
							 */}
							<DBAccordion variant="divider">
								<DBAccordionItem headline={m.colors} {...sectionProps('colors')}>
									<DBStack gap="small">
										{renderColor('brand')}
										{renderColor('neutral')}
									</DBStack>
								</DBAccordionItem>
								<DBAccordionItem headline={m.semanticColors} {...sectionProps('semantic')}>
									<DBStack gap="small">
										<p className="tb-hint">{m.semanticHint}</p>
										{SEMANTIC_KEYS.map((key) => (
											<SemanticField
												key={key}
												semanticKey={key}
												family={config.semantic[key]}
												families={config.families}
												palette={theme.familyModes[config.semantic[key]]?.palette ?? []}
												m={m}
												onChange={(family) =>
													setConfig((previous) => ({
														...previous,
														preset: 'custom',
														semantic: { ...previous.semantic, [key]: family },
													}))
												}
											/>
										))}
									</DBStack>
								</DBAccordionItem>
								<DBAccordionItem headline={m.colorFamilies} {...sectionProps('families')}>
									<DBStack gap="small">
										<p className="tb-hint">{m.colorFamiliesHint}</p>
										{config.families.map((family) => (
											<div key={family.key} className="tb-family">
												<ColorField
													id={`family-${family.key}`}
													name={familyLabel(family, m)}
													color={family}
													mode={theme.familyModes[family.key]}
													m={m}
													lang={lang}
													onOriginChange={(origin) => updateFamily(family.key, { origin })}
												/>
												{family.builtin ? null : (
													<DBButton
														wrap={false}
														variant="ghost"
														size="small"
														icon="cross"
														type="button"
														onClick={() => removeFamily(family.key)}
													>
														{m.removeFamily(family.name)}
													</DBButton>
												)}
											</div>
										))}
										<AddFamilyDialog families={config.families} m={m} onAdd={addFamily} />
									</DBStack>
								</DBAccordionItem>
								<DBAccordionItem headline={m.shapeAndType} {...sectionProps('shape')}>
									<DBStack gap="small">
										<SelectField
											id="tb-radius"
											label={m.radius}
											value={config.radius}
											options={RADII.map((value) => ({ value, label: m.radii[value] }))}
											onChange={(radius) => update({ radius })}
										/>
										<SelectField
											id="tb-heading-font"
											label={m.headingFont}
											value={config.headingFont}
											options={FONTS.map((value) => ({ value, label: m.fonts[value] }))}
											onChange={(headingFont) => update({ headingFont })}
										/>
										<SelectField
											id="tb-body-font"
											label={m.bodyFont}
											value={config.bodyFont}
											options={FONTS.map((value) => ({ value, label: m.fonts[value] }))}
											onChange={(bodyFont) => update({ bodyFont })}
										/>
										<p className="tb-hint">{m.fontHint}</p>
										<SelectField
											id="tb-icons"
											label={m.iconLibrary}
											value={config.icons}
											options={ICON_LIBRARIES.map((value) => ({
												value,
												label: m.iconLibraries[value],
											}))}
											onChange={(icons) => update({ icons })}
										/>
									</DBStack>
								</DBAccordionItem>
							</DBAccordion>
						</div>

						<div className="tb-actions">
							<DBStack direction="row" gap="x-small">
								<DBButton
									wrap={false}
									variant="filled"
									icon="circular_arrows"
									width="full"
									onClick={() => setConfig(shuffleConfig(config))}
									type="button"
								>
									{m.shuffle}
								</DBButton>
								<DBButton
									wrap={false}
									variant="filled"
									icon="undo"
									width="full"
									onClick={() => setConfig({ ...DEFAULT_CONFIG, mode: config.mode })}
									type="button"
								>
									{m.reset}
								</DBButton>
							</DBStack>
							<DBButton
								wrap={false}
								variant="filled"
								icon="copy"
								width="full"
								onClick={() => copyText(buildShareUrl(), m.linkCopied)}
								type="button"
							>
								{m.copyLink}
							</DBButton>
							<DBButton
								wrap={false}
								variant="brand"
								width="full"
								aria-haspopup="dialog"
								aria-controls="tb-code-panel"
								onClick={() => {
									// The drawer closes first, so the code dialog is the only modal
									setSettingsOpen(false);
									setCodeOpen(true);
								}}
								type="button"
							>
								{m.getCode}
							</DBButton>
						</div>
					</aside>,
				)}

				<div className="tb-stage">
					<div className="tb-stage-bar">
						{isCompact ? (
							<DBButton
								wrap={false}
								variant="ghost"
								icon="gear_wheel"
								noText={true}
								type="button"
								className="tb-settings-toggle"
								aria-haspopup="dialog"
								aria-controls="tb-settings-drawer"
								onClick={() => setSettingsOpen(true)}
							>
								{m.openSettings}
								<DBTooltip>{m.openSettings}</DBTooltip>
							</DBButton>
						) : null}
						{/* Four tabs do not fit a phone width, so the views become a select there */}
						{isCompact ? (
							<div className="tb-view-select">
								<SelectField
									id="tb-view"
									label={m.previewViews}
									showLabel={false}
									value={view}
									options={PREVIEW_VIEWS.map((value) => ({ value, label: m.views[value] }))}
									onChange={changeView}
								/>
							</div>
						) : (
							<DBTabs
								label={m.previewViews}
								activeIndex={PREVIEW_VIEWS.indexOf(view)}
								onIndexChange={(index) => changeView(PREVIEW_VIEWS[index] ?? 'modules')}
							>
								<DBTabList>
									{PREVIEW_VIEWS.map((value) => (
										<DBTabItem key={value}>{m.views[value]}</DBTabItem>
									))}
								</DBTabList>
							</DBTabs>
						)}
						<div className="tb-stage-actions">
							<DBButton
								wrap={false}
								variant="ghost"
								icon={config.mode === 'dark' ? 'sun' : 'moon'}
								noText={true}
								type="button"
								aria-pressed={config.mode === 'dark'}
								onClick={() => update({ mode: config.mode === 'dark' ? 'light' : 'dark' }, true)}
							>
								{config.mode === 'dark' ? m.lightMode : m.darkMode}
								<DBTooltip>{config.mode === 'dark' ? m.lightMode : m.darkMode}</DBTooltip>
							</DBButton>
							{/* On small screens the preview already fills the screen, so a new tab adds nothing */}
							{isCompact ? null : (
								<DBButton
									wrap={false}
									variant="ghost"
									icon="arrow_up_right"
									noText={true}
									type="button"
									onClick={openPreview}
								>
									{m.openInNewTab}
									<DBTooltip>{m.openInNewTab}</DBTooltip>
								</DBButton>
							)}
						</div>
					</div>
					<iframe
						ref={iframeRef}
						className="tb-frame"
						src={initialPreviewUrl}
						title={m.previewTitle}
						onLoad={handleFrameLoad}
					/>
				</div>
			</div>

			<DBDialog
				id="tb-code-panel"
				className="tb-code-dialog"
				open={codeOpen}
				onClose={() => setCodeOpen(false)}
				containerSize="large"
				header={<DBDialogHeader closeButtonText={m.hideCode} text={m.code} />}
				footer={
					<DBDialogFooter>
						<DBButton
							wrap={false}
							variant="filled"
							icon="copy"
							type="button"
							onClick={() => copyText(code, m.copied)}
						>
							{m.copy}
						</DBButton>
						<DBButton
							wrap={false}
							variant="brand"
							icon="download"
							type="button"
							onClick={downloadCode}
						>
							{m.download}
						</DBButton>
					</DBDialogFooter>
				}
			>
				<div className="tb-code-body">
					<section aria-labelledby="tb-usage-title">
						{/* Headline left, format switch right in one row */}
						<div className="tb-usage-head">
							<h2 id="tb-usage-title" className="tb-usage-title">
								{codeFormat === 'sd' ? m.usageSdTitle : m.usageTitle}
							</h2>
							{/* Segmented button group, same look as the Learn article/steps toggle */}
							<div
								className="tb-format-switch db-button-group"
								role="group"
								aria-label={m.codeFormat}
							>
								{(['css', 'sd'] as const).map((format) => (
									<button
										key={format}
										type="button"
										className="db-button"
										data-variant="filled"
										data-size="small"
										aria-pressed={codeFormat === format}
										onClick={() => setCodeFormat(format)}
									>
										{CODE_FILES[format].label}
									</button>
								))}
							</div>
						</div>
						<ol className="tb-usage">
							{(codeFormat === 'sd' ? m.usageSdSteps : m.usageSteps).map((step) => (
								<li key={step}>{step}</li>
							))}
						</ol>
					</section>

					<pre className="tb-code-block" tabIndex={0}>
						<code>{code}</code>
					</pre>
				</div>
			</DBDialog>

			<p className="tb-status" role="status" aria-live="polite">
				{status}
			</p>
		</>
	);
};

export default ThemeBuilder;
