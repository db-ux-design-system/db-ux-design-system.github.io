import { useEffect, useMemo, useRef, useState } from 'react';

interface UseActiveHeadingOptions {
	slugs: string[];
	tocMaxDepth?: number;
}

export function useActiveHeading({ slugs, tocMaxDepth }: UseActiveHeadingOptions) {
	const [currentID, setCurrentID] = useState('');
	const activeIDs = useRef(new Set<string>());

	const headingSelector = useMemo(
		() =>
			[2, 3, 4, 5, 6]
				.filter((depth) => !tocMaxDepth || tocMaxDepth >= depth)
				.map((depth) => `h${depth}[id]`)
				.join(','),
		[tocMaxDepth],
	);

	useEffect(() => {
		const highlightFirstActive = (id: string) => {
			const sortedActiveIds = [...activeIDs.current].sort(
				(a, b) => slugs.indexOf(a) - slugs.indexOf(b),
			);
			if (sortedActiveIds.length > 0) return setCurrentID(sortedActiveIds[0]);
			setCurrentID(id);
		};

		const setCurrent: IntersectionObserverCallback = (entries) => {
			for (const entry of entries) {
				const { id } = entry.target;
				if (id === 'on-this-page-heading') continue;
				entry.isIntersecting ? activeIDs.current.add(id) : activeIDs.current.delete(id);
				highlightFirstActive(id);
			}
		};

		const headingsObserver = new IntersectionObserver(setCurrent, {
			root: null,
			rootMargin: '-96px 0px 0px 0px',
			threshold: 1,
		});

		const allHeadings = document.querySelectorAll(headingSelector);
		allHeadings.forEach((h) => headingsObserver.observe(h));

		return () => headingsObserver.disconnect();
	}, [headingSelector, slugs]);

	return { currentID, setCurrentID };
}
