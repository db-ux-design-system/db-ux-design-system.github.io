import { useState, type ReactElement } from 'react';
import { DBPagination } from '@db-ux/react-core-components';
import { type OverviewLabels, type Size } from './_shared.tsx';

/*
 * One pagination per specimen, with its own current page.
 *
 * The component never changes the page itself: it reports the requested one and
 * the parent has to write it back, so each specimen keeps that page in state.
 * Without it the pagination would look interactive and do nothing.
 *
 * The pages come from `totalCount` and `pageSize`, which is the data-driven API.
 * The Pagination Item is part of what the component composes from that — it is
 * documented as a sub component and needs no section of its own.
 */
const PaginationSpecimen = ({
	label,
	size,
	totalCount,
	initialPage,
	labels,
}: {
	label: string;
	size?: Size;
	totalCount: number;
	initialPage: number;
	labels: OverviewLabels;
}): ReactElement => {
	const [currentPage, setCurrentPage] = useState(initialPage);

	return (
		<DBPagination
			label={label}
			size={size}
			currentPage={currentPage}
			totalCount={totalCount}
			pageSize={10}
			previousLabel={labels.paginationPrevious}
			nextLabel={labels.paginationNext}
			pageLabel={labels.paginationPageLabel}
			onPageChange={(page) => setCurrentPage(page)}
		/>
	);
};

/*
 * Both sizes next to each other, on a list long enough to collapse. The size is
 * the one dimension this component has, so the two specimens are the whole
 * comparison and belong in one row rather than below each other.
 *
 * Both start in the middle of the list, which is where the component shows what
 * it does with a list it cannot fit: the pages around the current one stay, the
 * rest gives way to an ellipsis.
 *
 * Mounted in the browser. Which page is the current one is written onto the
 * markup from script — the filled page button and its `aria-current` — so a
 * rendered-only pagination shows no current page at all.
 */
export const PaginationOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<>
		<PaginationSpecimen
			label={labels.paginationLabels.medium}
			totalCount={200}
			initialPage={5}
			labels={labels}
		/>
		<PaginationSpecimen
			label={labels.paginationLabels.small}
			size="small"
			totalCount={200}
			initialPage={5}
			labels={labels}
		/>
	</>
);
