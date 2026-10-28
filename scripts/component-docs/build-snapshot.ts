/**
 * Component Docs Snapshot (pilot)
 *
 * Builds the code documentation of one or more components into
 * `template/data/component-docs/<component>/`. The platform renders the Code
 * section of a component page from this folder.
 *
 * Stand-in for a dedicated docs artifact published by core-web. Once that
 * artifact exists, it delivers the same folder structure and this script is
 * replaced by a plain dependency. Until then, the sources are read for the
 * exact `@db-ux/core-components` version pinned in package.json, so code docs
 * and rendered components never drift apart:
 *
 * - Framework docs (HTML, Angular, React, Vue, Migration, Accessibility):
 *   `packages/components/src/components/<name>/docs/*.md` from the core-web
 *   git tag `v<version>` (read with `git show`, independent of the checked-out
 *   branch)
 * - Properties, slots and events: `dist/web-types.json` of the published
 *   `@db-ux/wc-core-components@<version>` package
 *
 * Usage: node scripts/component-docs/build-snapshot.ts button [select ...]
 * Env:   CORE_WEB_PATH – path to a core-web checkout (default: ../core-web)
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..', '..');
const OUT_DIR = join(ROOT, 'template', 'data', 'component-docs');
const CACHE_DIR = join(ROOT, 'node_modules', '.cache', 'component-docs');
const CORE_WEB = resolve(ROOT, process.env.CORE_WEB_PATH ?? '../core-web');

/** Docs files in core-web, in the order they appear on the page. */
const DOC_FILES = ['HTML', 'Angular', 'React', 'Vue', 'Migration', 'Accessibility'] as const;

interface WebTypesProperty {
	name: string;
	description?: string;
	type?: string;
}

interface WebTypesElement {
	name: string;
	slots?: { name: string; description?: string }[];
	events?: { name: string; description?: string; type?: string }[];
	js?: { properties?: WebTypesProperty[] };
}

/** Props that exist on the web component class but are not part of the component API. */
const INTERNAL_PROPS = new Set(['rootElement']);

const getPinnedVersion = (): string => {
	const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
	const version = pkg.devDependencies?.['@db-ux/core-components'];
	if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
		throw new Error(
			`[component-docs] @db-ux/core-components must be pinned exactly, got "${version}"`,
		);
	}
	return version;
};

/** Reads a file from the core-web tag, or `undefined` if it does not exist there. */
const readFromTag = (tag: string, path: string): string | undefined => {
	try {
		return execFileSync('git', ['-C', CORE_WEB, 'show', `${tag}:${path}`], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		});
	} catch {
		return undefined;
	}
};

/**
 * Downloads `@db-ux/wc-core-components@<version>` once and returns its web-types.
 * The tarball is cached in node_modules/.cache, so repeated runs stay offline.
 */
const loadWebTypes = async (version: string): Promise<WebTypesElement[]> => {
	const dir = join(CACHE_DIR, `wc-core-components-${version}`);
	const file = join(dir, 'package', 'dist', 'web-types.json');

	if (!existsSync(file)) {
		mkdirSync(dir, { recursive: true });
		const url = `https://registry.npmjs.org/@db-ux/wc-core-components/-/wc-core-components-${version}.tgz`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`[component-docs] Download failed (${response.status}): ${url}`);
		}
		const tarball = join(dir, 'package.tgz');
		writeFileSync(tarball, Buffer.from(await response.arrayBuffer()));
		execFileSync('tar', ['-xzf', tarball, '-C', dir, 'package/dist/web-types.json']);
		rmSync(tarball);
	}

	const webTypes = JSON.parse(readFileSync(file, 'utf8'));
	return webTypes.contributions.html.elements as WebTypesElement[];
};

const FRAMEWORK_DOCS = new Set<string>(['HTML', 'Angular', 'React', 'Vue']);

/**
 * Prepares a core-web docs file for embedding below an h3 of the Code section,
 * so its own headings start at h4.
 *
 * - Framework docs: the leading `## <Framework>` heading is dropped (the tab
 *   already names it); the remaining `###` headings move one level down.
 * - Other docs (Migration, Accessibility) start at `##` and move two levels down.
 */
const normalizeMarkdown = (file: string, markdown: string): string => {
	const isFramework = FRAMEWORK_DOCS.has(file);
	const shift = '#'.repeat(isFramework ? 1 : 2);
	const body = isFramework ? markdown.replace(/^\s*##\s+\S+\s*\n/, '') : markdown;
	return (
		body
			.replace(/^(#{2,4})(\s)/gm, (_, hashes: string, space: string) => `${shift}${hashes}${space}`)
			.trim() + '\n'
	);
};

const buildComponent = (name: string, version: string, elements: WebTypesElement[]): void => {
	const tag = `v${version}`;
	const target = join(OUT_DIR, name);
	rmSync(target, { recursive: true, force: true });
	mkdirSync(target, { recursive: true });

	const docs: string[] = [];
	for (const file of DOC_FILES) {
		const content = readFromTag(tag, `packages/components/src/components/${name}/docs/${file}.md`);
		if (!content) continue;
		writeFileSync(join(target, `${file}.md`), normalizeMarkdown(file, content));
		docs.push(file);
	}

	const element = elements.find((entry) => entry.name === `db-${name}`);
	if (!element) {
		throw new Error(`[component-docs] db-${name} not found in web-types of ${version}`);
	}

	const api = {
		properties: (element.js?.properties ?? [])
			.filter((prop) => !INTERNAL_PROPS.has(prop.name))
			.map(({ name: propName, description = '', type = '' }) => ({
				name: propName,
				type,
				description,
			})),
		slots: (element.slots ?? []).map(({ name: slotName, description = '' }) => ({
			name: slotName,
			description,
		})),
		events: (element.events ?? []).map(({ name: eventName, description = '' }) => ({
			name: eventName,
			description,
		})),
	};

	writeFileSync(
		join(target, 'meta.json'),
		JSON.stringify({ component: name, version, docs }, null, '\t') + '\n',
	);
	writeFileSync(join(target, 'api.json'), JSON.stringify(api, null, '\t') + '\n');

	console.log(
		`[component-docs] ${name}@${version}: ${docs.length} docs, ${api.properties.length} properties, ${api.slots.length} slots, ${api.events.length} events`,
	);
};

const components = process.argv.slice(2);
if (components.length === 0) {
	throw new Error('[component-docs] Pass at least one component name, e.g. "button"');
}
if (!existsSync(join(CORE_WEB, '.git'))) {
	throw new Error(`[component-docs] No core-web checkout at ${CORE_WEB}. Set CORE_WEB_PATH.`);
}

const version = getPinnedVersion();
const elements = await loadWebTypes(version);
for (const name of components) {
	buildComponent(name, version, elements);
}
