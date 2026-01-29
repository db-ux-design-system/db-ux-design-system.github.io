import { getCurrentPathname } from '@root/template/utils/app.utils';
import type { AstroGlobal, MarkdownHeading } from 'astro';
import type { ReactElement } from 'react';
import { useActiveHeading } from './useActiveHeading';

interface Props {
	astro: AstroGlobal;
	headings: MarkdownHeading[];
	tocMaxDepth?: number;
}

export function TableOfContents(props: Props): ReactElement | null {
	const { headings = [] } = props;
	const filteredHeadings = headings.filter(
		({ depth }) => !props.tocMaxDepth || props.tocMaxDepth >= depth,
	);
	const slugs = filteredHeadings.map((h) => h.slug);
	const currentPath = getCurrentPathname(props.astro);
	const { currentID, setCurrentID } = useActiveHeading({ slugs, tocMaxDepth: props.tocMaxDepth });

	const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		const id = e.currentTarget.getAttribute('href')?.split('#')[1];
		if (!id) return;
		const hashId = `#${id}`;
		history?.pushState(null, '', `${currentPath}${hashId}`);
		document.querySelector(hashId)?.scrollIntoView();
		setTimeout(() => setCurrentID(id), 100);
	};

	return (
		<aside className="dba-toc">
			<ul>
				{filteredHeadings.map(({ depth, slug, text }) => (
					<li
						key={slug}
						className="dba-toc-heading"
						data-depth={depth}
						data-slug={slug}
						data-active={currentID === slug}
					>
						<a href={`${currentPath}#${slug}`} onClick={handleLinkClick}>
							{text}
						</a>
					</li>
				))}
			</ul>
		</aside>
	);
}
