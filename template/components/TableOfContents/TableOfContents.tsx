import { getCurrentPathname } from '@root/template/utils/app.utils';
import type { AstroGlobal, MarkdownHeading } from 'astro';
import type { ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useActiveHeading } from './useActiveHeading';
import { DBIcon } from '@db-ux/react-core-components';

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
	const { currentID, activeIDs, setCurrentID } = useActiveHeading({
		slugs,
		tocMaxDepth: props.tocMaxDepth,
	});
	const indicatorRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const [expandedH2s, setExpandedH2s] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (!indicatorRef.current || !listRef.current || activeIDs.length === 0) return;

		// Filter only visible (rendered) elements
		const visibleActiveIDs = activeIDs.filter(slug => {
			const element = listRef.current?.querySelector(`[data-slug="${slug}"]`) as HTMLElement;
			return element && element.offsetParent !== null;
		});

		if (visibleActiveIDs.length === 0) return;

		const firstSlug = visibleActiveIDs[0];
		const lastSlug = visibleActiveIDs[visibleActiveIDs.length - 1];

		const firstElement = listRef.current.querySelector(`[data-slug="${firstSlug}"]`) as HTMLElement;
		const lastElement = listRef.current.querySelector(`[data-slug="${lastSlug}"]`) as HTMLElement;

		if (!firstElement || !lastElement) return;

		const top = firstElement.offsetTop;
		const bottom = lastElement.offsetTop + lastElement.offsetHeight;
		const height = bottom - top;

		indicatorRef.current.style.transform = `translateY(${top}px)`;
		indicatorRef.current.style.height = `${height}px`;
	}, [activeIDs]);

	const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		const id = e.currentTarget.getAttribute('href')?.split('#')[1];
		if (!id) return;
		const hashId = `#${id}`;
		history?.pushState(null, '', `${currentPath}${hashId}`);
		document.querySelector(hashId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		setTimeout(() => setCurrentID(id), 300);
	};

	const toggleH2 = (slug: string) => {
		setExpandedH2s(prev => {
			const next = new Set(prev);
			if (next.has(slug)) {
				next.delete(slug);
			} else {
				next.add(slug);
			}
			return next;
		});
	};

	let currentH2: string | null = null;
	const hasChildren = (index: number) => {
		return filteredHeadings[index + 1]?.depth > 2;
	};

	return (
		<aside className="dba-toc">
			<div ref={indicatorRef} className="dba-toc-indicator" />
			<ul ref={listRef}>
				{filteredHeadings.map(({ depth, slug, text }, index) => {
					if (depth === 2) {
						currentH2 = slug;
						const showChildren = hasChildren(index);
						return (
							<li
								key={slug}
								className="dba-toc-heading"
								data-depth={depth}
								data-slug={slug}
							>
								<a href={`${currentPath}#${slug}`} onClick={handleLinkClick} aria-current={activeIDs.includes(slug) ? 'location' : undefined}>
									{text}
								</a>
								{showChildren && (
									<button
										className="dba-toc-toggle"
										onClick={() => toggleH2(slug)}
										aria-label={expandedH2s.has(slug) ? 'Collapse' : 'Expand'}
										aria-expanded={expandedH2s.has(slug)}
										aria-controls={`toc-children-${slug}`}
									>
										<DBIcon icon={expandedH2s.has(slug) ? 'chevron_up' : 'chevron_down'} />
									</button>
								)}
							</li>
						);
					}
					if (depth > 2 && currentH2 && expandedH2s.has(currentH2)) {
						return (
							<li
								key={slug}
								className="dba-toc-heading"
								data-depth={depth}
								data-slug={slug}
							>
								<a href={`${currentPath}#${slug}`} onClick={handleLinkClick} aria-current={activeIDs.includes(slug) ? 'location' : undefined}>
									{text}
								</a>
							</li>
						);
					}
					return null;
				})}
			</ul>
		</aside>
	);
}
