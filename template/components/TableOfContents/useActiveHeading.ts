import { useEffect, useMemo, useRef, useState } from 'react';

interface UseActiveHeadingOptions {
	slugs: string[];
	tocMaxDepth?: number;
}

export function useActiveHeading({ slugs, tocMaxDepth }: UseActiveHeadingOptions) {
	const [currentID, setCurrentID] = useState('');
	const [activeIDs, setActiveIDs] = useState<string[]>([]);
	const activeIDsRef = useRef(new Set<string>());

	const headingSelector = useMemo(
		() =>
			[2, 3, 4, 5, 6]
				.filter((depth) => !tocMaxDepth || tocMaxDepth >= depth)
				.map((depth) => `h${depth}[id]`)
				.join(','),
		[tocMaxDepth],
	);

	useEffect(() => {
		const updateActiveIDs = () => {
			const sortedActiveIds = [...activeIDsRef.current].sort(
				(a, b) => slugs.indexOf(a) - slugs.indexOf(b),
			);
			setActiveIDs(sortedActiveIds);
			if (sortedActiveIds.length > 0) {
				setCurrentID(sortedActiveIds[0]);
			}
		};

		const setCurrent: IntersectionObserverCallback = (entries) => {
			for (const entry of entries) {
				const { id } = entry.target;
				if (id === 'on-this-page-heading') continue;
				if (entry.isIntersecting) {
					activeIDsRef.current.add(id);
				} else {
					activeIDsRef.current.delete(id);
				}
				updateActiveIDs();
			}
		};

		const headingsObserver = new IntersectionObserver(setCurrent, {
			root: null,
			rootMargin: '-48px 0px 0px 0px',
			threshold: 1,
		});

		const allHeadings = document.querySelectorAll(headingSelector);
		allHeadings.forEach((h) => headingsObserver.observe(h));

		return () => headingsObserver.disconnect();
	}, [headingSelector, slugs]);

	return { currentID, activeIDs, setCurrentID };
}
