// @ts-check
import { defineConfig } from 'astro/config';
import { appConfig } from './app.config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { filterSitemapBlacklist } from './template/integrations/sitemap';
// TODO: Re-enable once @orama/plugin-astro supports Astro 6 (currently only supports ^2.x)
// import orama from '@orama/plugin-astro';

import { viteStaticCopy } from 'vite-plugin-static-copy';
import pngToWebpIntegration from './astro-integration-png-to-webp.mjs';
import { pageFrontmatterPlugin } from './template/integrations/vite-plugin-page-frontmatter';

// https://astro.build/config
export default defineConfig({
	site: appConfig.hostname,
	base: appConfig.basePath,
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'de'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		react({}),
		mdx(),
		sitemap({
			filter: filterSitemapBlacklist,
		}),
		// orama({
		// 	pages: {
		// 		pathMatcher: /\/.+\//,
		// 		language: 'english',
		// 	},
		// }),
		pngToWebpIntegration(),
	],
	// Pages that moved into the Learn area. The old URLs stay valid for links and bookmarks.
	redirects: {
		'/documentation/releases/content-status': '/documentation/learn/status',
		'/de/dokumentation/releases/content-status': '/de/dokumentation/lernen/status',
		'/documentation/releases/versioning': '/documentation/learn/versioning',
		'/de/dokumentation/releases/versionierung': '/de/dokumentation/lernen/versionierung',
	},
	markdown: {
		shikiConfig: {
			// Same theme as before (Astro's default). Code blocks stay dark in both modes.
			theme: 'github-dark',
			transformers: [
				{
					name: 'db-ux-dark-code',
					// The block is dark in light mode as well, so the tokens inside need
					// their dark mode values.
					pre(node) {
						node.properties['data-mode'] = 'dark';
					},
					// The comment color #6a737d has 3.05:1 on the code background (#24292e),
					// below WCAG 1.4.3 (4.5:1). It is replaced with a DB UX token, resolved in
					// dark mode (see pre above): #8a919e, 4.63:1. All other colors pass and
					// stay. Done per token: Shiki's colorReplacements missed the first line of
					// some blocks.
					span(node) {
						const { style } = node.properties;
						if (typeof style === 'string' && /#6a737d/i.test(style)) {
							node.properties.style = style.replace(
								/#6a737d/gi,
								'var(--db-adaptive-on-bg-basic-emphasis-70-default)',
							);
						}
					},
				},
			],
		},
	},
	srcDir: './content',
	outDir: './public',
	publicDir: './static',
	vite: {
		plugins: [
			// Frontmatter-only page imports for navigation (prevents page CSS leaking to all pages).
			pageFrontmatterPlugin(),
			viteStaticCopy({
				// Since vite-plugin-static-copy 4, the source directory structure is
				// preserved in the output. `rename: { stripBase: true }` restores the
				// flat copy, so the files are served from the site root.
				targets: [
					{
						src: './node_modules/@google/model-viewer/dist/model-viewer.min.js',
						dest: './',
						rename: { stripBase: true },
					},
					{
						src: './node_modules/@google/model-viewer/dist/model-viewer.min.js.map',
						dest: './',
						rename: { stripBase: true },
					},
					// Decoder for meshopt-compressed glb files (the teaser models). model-viewer only
					// loads it when `meshoptDecoderLocation` is set, see HtmlHead.astro. The UMD build
					// works as a classic script, as model-viewer loads it.
					{
						src: './node_modules/meshoptimizer/meshopt_decoder.cjs',
						dest: './',
						rename: { stripBase: true, name: 'meshopt_decoder.js' },
					},
					{
						src: 'node_modules/@db-ux/db-theme/build/images/light/db_logo.svg',
						dest: './',
						rename: { stripBase: true },
					},
				],
			}),
		],
		ssr: {
			noExternal: ['@db-ux/react-core-components'],
		},
		resolve: {
			alias: {
				'@db-ux': new URL('./node_modules/@db-ux', import.meta.url).pathname,
				'@components': new URL('./template/components', import.meta.url).pathname,
				'@template': new URL('./template', import.meta.url).pathname,
				'@content': new URL('./content', import.meta.url).pathname,
				'@config': new URL('./app.config.ts', import.meta.url).pathname,
				'@assets': new URL('./static/assets', import.meta.url).pathname,
			},
		},
	},
	devToolbar: {
		enabled: false,
	},
});
