/**
 * Figma Image Cache Script
 *
 * Scans all MDX files for figmaUrl props, exports node images via the Figma API,
 * downloads them as PNG, and writes a manifest JSON for build-time lookup.
 *
 * Usage: node scripts/cache-figma-images.ts
 * Requires: FIGMA_TOKEN in .env
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { readdir } from 'fs/promises';
import { loadEnvFile } from 'node:process';

interface FigmaParsed {
	fileKey: string;
	nodeId: string;
}

interface CacheEntry {
	url: string;
	nodeId: string;
	filename: string;
}

type Manifest = Record<string, string>;

const ROOT = resolve(import.meta.dirname, '..');
const MDX_DIR = join(ROOT, 'content', 'pages', 'documentation', 'components');
const CACHE_DIR = join(ROOT, 'static', 'assets', 'figma-cache');
const MANIFEST_PATH = join(ROOT, 'static', 'assets', 'figma-cache', 'manifest.json');

loadEnvFile(join(ROOT, '.env'));
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;

if (!FIGMA_TOKEN) {
	console.error('❌ FIGMA_TOKEN not found. Add it to .env or set it as an environment variable.');
	process.exit(0);
}

mkdirSync(CACHE_DIR, { recursive: true });

function parseFigmaUrl(url: string): FigmaParsed | null {
	const fileKeyMatch = url.match(/\/design\/([^/?]+)/);
	const nodeIdMatch = url.match(/[?&]node-id=([^&]+)/);
	if (!fileKeyMatch || !nodeIdMatch) return null;
	return { fileKey: fileKeyMatch[1], nodeId: nodeIdMatch[1] };
}

function cacheFilename(fileKey: string, nodeId: string): string {
	return `${fileKey}_${nodeId.replace(/[:/]/g, '-')}.png`;
}

async function collectFigmaUrls(): Promise<string[]> {
	const files = (await readdir(MDX_DIR)).filter((f) => f.endsWith('.mdx'));
	const urlSet = new Set<string>();
	for (const file of files) {
		const content = readFileSync(join(MDX_DIR, file), 'utf-8');
		const matches = content.matchAll(/figmaUrl="([^"]+)"/g);
		for (const [, url] of matches) {
			const base = url.split('?')[0];
			const nodeIdMatch = url.match(/[?&]node-id=([^&]+)/);
			if (nodeIdMatch) urlSet.add(`${base}?node-id=${nodeIdMatch[1]}&embed-host=share`);
		}
	}
	return [...urlSet];
}

async function exportImages(fileKey: string, nodeIds: string[]): Promise<Record<string, string>> {
	// Figma API expects node IDs with `:` (e.g. 3:852), but embed URLs use `-` (e.g. 3-852)
	const ids = nodeIds.map((id) => id.replace('-', ':')).join(',');
	const res = await fetch(
		`https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(ids)}&format=png&scale=2`,
		{ headers: { 'X-Figma-Token': FIGMA_TOKEN! } },
	);
	if (!res.ok) throw new Error(`Figma API error ${res.status}: ${await res.text()}`);
	const data = await res.json();
	if (data.err) throw new Error(`Figma export error: ${data.err}`);
	return data.images;
}

async function downloadImage(imageUrl: string, destPath: string): Promise<void> {
	const res = await fetch(imageUrl);
	if (!res.ok) throw new Error(`Download failed ${res.status}: ${imageUrl}`);
	const buffer = await res.arrayBuffer();
	writeFileSync(destPath, Buffer.from(buffer));
}

async function main(): Promise<void> {
	const urls = await collectFigmaUrls();
	console.log(`Found ${urls.length} unique Figma URLs`);

	const manifest: Manifest = existsSync(MANIFEST_PATH)
		? JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))
		: {};

	const byFileKey = new Map<string, CacheEntry[]>();
	for (const url of urls) {
		const parsed = parseFigmaUrl(url);
		if (!parsed) continue;
		const filename = cacheFilename(parsed.fileKey, parsed.nodeId);
		if (existsSync(join(CACHE_DIR, filename))) {
			if (!manifest[url]) manifest[url] = `/assets/figma-cache/${filename}`;
			continue;
		}
		if (!byFileKey.has(parsed.fileKey)) byFileKey.set(parsed.fileKey, []);
		byFileKey.get(parsed.fileKey)!.push({ url, nodeId: parsed.nodeId, filename });
	}

	let fetched = 0;
	let failed = 0;

	for (const [fileKey, entries] of byFileKey) {
		const nodeIds = entries.map((e) => e.nodeId);
		console.log(`Exporting ${nodeIds.length} nodes from file ${fileKey}…`);

		let images: Record<string, string>;
		try {
			images = await exportImages(fileKey, nodeIds);
		} catch (err) {
			console.error(`  ❌ Failed to export from ${fileKey}: ${(err as Error).message}`);
			failed += entries.length;
			continue;
		}

		for (const { url, nodeId, filename } of entries) {
				const imageUrl = images[nodeId.replace('-', ':')];
			if (!imageUrl) {
				console.warn(`  ⚠️  No image returned for node ${nodeId}`);
				failed++;
				continue;
			}
			try {
				await downloadImage(imageUrl, join(CACHE_DIR, filename));
				manifest[url] = `/assets/figma-cache/${filename}`;
				fetched++;
				console.log(`  ✓ ${filename}`);
			} catch (err) {
				console.error(`  ❌ ${filename}: ${(err as Error).message}`);
				failed++;
			}
		}
	}

	writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
	console.log(`\nDone. ${fetched} fetched, ${failed} failed. Manifest: ${MANIFEST_PATH}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
