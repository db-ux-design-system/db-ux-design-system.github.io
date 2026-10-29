/**
 * Component Docs Snapshot (pilot)
 *
 * Copies the framework usage docs of one or more components into
 * `template/data/component-docs/<component>/`. The platform renders the
 * Usage tabs of the Code section from this folder; everything else (API,
 * examples, migration) is on the component's overview page in Storybook.
 *
 * The docs are read from the core-web git tag of the exact
 * `@db-ux/core-components` version pinned in package.json (with `git show`,
 * independent of the checked-out branch), so docs and rendered components
 * never drift apart. Once core-web publishes these files in a package, this
 * script is replaced by a plain dependency.
 *
 * Usage: node scripts/component-docs/build-snapshot.ts button [select ...]
 * Env:   CORE_WEB_PATH – path to a core-web checkout (default: ../core-web)
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..', '..');
const OUT_DIR = join(ROOT, 'template', 'data', 'component-docs');
const CORE_WEB = resolve(ROOT, process.env.CORE_WEB_PATH ?? '../core-web');

/** Framework docs files in core-web, in the order of the tabs. */
const DOC_FILES = ['HTML', 'Angular', 'React', 'Vue'] as const;

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
 * Prepares a framework docs file for a tab below an h3 of the Code section:
 * drops the leading `## <Framework>` heading (the tab already names it) and
 * moves the remaining headings one level down, so they start at h4.
 */
const normalizeMarkdown = (markdown: string): string =>
	markdown
		.replace(/^\s*##\s+\S+\s*\n/, '')
		.replace(/^(#{2,4})(\s)/gm, '#$1$2')
		.trim() + '\n';

const buildComponent = (name: string, version: string): void => {
	const tag = `v${version}`;
	const target = join(OUT_DIR, name);
	rmSync(target, { recursive: true, force: true });
	mkdirSync(target, { recursive: true });

	const docs: string[] = [];
	for (const file of DOC_FILES) {
		const content = readFromTag(tag, `packages/components/src/components/${name}/docs/${file}.md`);
		if (!content) continue;
		writeFileSync(join(target, `${file}.md`), normalizeMarkdown(content));
		docs.push(file);
	}
	if (docs.length === 0) {
		throw new Error(`[component-docs] No docs for "${name}" in core-web ${tag}`);
	}

	writeFileSync(
		join(target, 'meta.json'),
		JSON.stringify({ component: name, version, docs }, null, '\t') + '\n',
	);
	console.log(`[component-docs] ${name}@${version}: ${docs.join(', ')}`);
};

const components = process.argv.slice(2);
if (components.length === 0) {
	throw new Error('[component-docs] Pass at least one component name, e.g. "button"');
}
if (!existsSync(join(CORE_WEB, '.git'))) {
	throw new Error(`[component-docs] No core-web checkout at ${CORE_WEB}. Set CORE_WEB_PATH.`);
}

const version = getPinnedVersion();
for (const name of components) {
	buildComponent(name, version);
}
