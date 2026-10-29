/**
 * Renders the inline Markdown used in property descriptions of the web-types
 * (links, inline code, emphasis) to HTML.
 *
 * The input is escaped first, so only the markup produced here reaches the
 * page. Links are limited to http(s) and site-relative URLs.
 */

const escapeHtml = (value: string): string =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

/**
 * Links in core-web descriptions that point to Patternhub pages with a
 * counterpart on the platform. Mapped per language.
 */
const PATTERNHUB_LINKS: Record<string, { en: string; de: string }> = {
	'https://design-system.deutschebahn.com/core-web/review/main/foundations/icons/overview': {
		en: '/documentation/icons',
		de: '/de/dokumentation/icons',
	},
};

export const renderInlineMarkdown = (markdown: string, lang: 'en' | 'de' = 'en'): string => {
	const codeSpans: string[] = [];

	return (
		escapeHtml(markdown.replace(/\s*\n\s*/g, ' '))
			// Inline code first, so its content is not parsed as emphasis or links.
			.replace(/`([^`]+)`/g, (_, code: string) => {
				codeSpans.push(`<code>${code}</code>`);
				return `\u0000${codeSpans.length - 1}\u0000`;
			})
			.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, text: string, rawUrl: string) => {
				const url = PATTERNHUB_LINKS[rawUrl]?.[lang] ?? rawUrl;
				if (!/^(https?:\/\/|\/)/.test(url)) return match;
				const external = url.startsWith('http');
				return external
					? `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
					: `<a href="${url}">${text}</a>`;
			})
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			.replace(/(^|[\s(])_([^_]+)_(?=[\s).,;:]|$)/g, '$1<em>$2</em>')
			.replace(/\u0000(\d+)\u0000/g, (_, index: string) => codeSpans[Number(index)])
	);
};
