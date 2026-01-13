import { getCurrentPathname } from '@root/template/utils/app.utils';
import type { AstroGlobal, MarkdownHeading } from 'astro';
import { useEffect, useRef, useState, type ReactElement } from 'react';

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
	const toc = useRef<HTMLUListElement>(null);
	const [currentID, setCurrentID] = useState('');
	const activeIDs = useRef(new Set<string>());
	const onThisPageID = 'on-this-page-heading';

	useEffect(() => {
		if (!toc.current) return;

		const setCurrent: IntersectionObserverCallback = (entries) => {
			for (const entry of entries) {
				const { id } = entry.target;
				if (id === onThisPageID) continue;
				entry.isIntersecting ? activeIDs.current.add(id) : activeIDs.current.delete(id);
				highlightFirstActive(id);
			}
		};

		const observerOptions: IntersectionObserverInit = {
			// Negative top margin accounts for `scroll-margin`.
			// Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
			root: null,
			rootMargin: '-96px 0px 0px 0px',
			threshold: 1,
		};

		const headingsObserver = new IntersectionObserver(setCurrent, observerOptions);

		// Observe all the headings in the main page content.
		// TODO: Create this based on depth
		const allHeadings = document.querySelectorAll(
			[2, 3, 4, 5, 6]
				.filter((depth) => !props.tocMaxDepth || props.tocMaxDepth >= depth)
				.map((depth) => `h${depth}[id]`)
				.join(','),
		);
		allHeadings.forEach((h) => headingsObserver.observe(h));

		// Stop observing when the component is unmounted.
		return () => headingsObserver.disconnect();
	}, [toc.current]);

	const highlightFirstActive = (id: string) => {
		if (!toc.current) return;
		const sortedActiveIds: string[] = [...activeIDs.current].sort(
			(a, b) => slugs.indexOf(a) - slugs.indexOf(b),
		);
		if (sortedActiveIds.length > 0) return setCurrentID(sortedActiveIds[0]);
		setCurrentID(id);
	};

	const handleLinkClick = (e: any) => {
		e.preventDefault();
		const id = e.target.getAttribute('href').split('#')[1];
		const hashId = `#${id}`;
		history?.pushState(null, '', `${currentPath}${hashId}`);
		document.querySelector(hashId)?.scrollIntoView();
		setTimeout(() => setCurrentID(id), 100);
	};

	return (
		<aside className="dba-toc">
			<ul ref={toc}>
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
