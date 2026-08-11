/**
 * Client-side filter logic for release notes tag-based filtering.
 * Shared between EN and DE release notes pages.
 */
(function () {
	var filterContainer: HTMLElement | null;
	var filterTags: NodeListOf<Element>;
	var releaseNotes: NodeListOf<Element>;
	var tocHeadingNotes: NodeListOf<Element>;

	function ensureCached() {
		if (filterContainer) return;
		filterContainer = document.getElementById('filter-tags');
		if (!filterContainer) return;
		filterTags = filterContainer.querySelectorAll('[data-category]');
		releaseNotes = document.querySelectorAll('.release-note');
		tocHeadingNotes = document.querySelectorAll('.dba-toc-heading');
	}

	document.addEventListener(
		'change',
		function (event) {
			const checkbox = event.target as HTMLInputElement;
			if (!checkbox || checkbox.type !== 'checkbox') return;

			ensureCached();
			if (!filterContainer || !filterContainer.contains(checkbox)) return;

			const activeCategories: string[] = [];
			filterTags.forEach(function (tag) {
				const cb = tag.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
				if (cb && cb.checked) {
					activeCategories.push(tag.getAttribute('data-category')!);
				}
			});

			releaseNotes.forEach(function (note) {
				const noteCategory = note.getAttribute('data-category');
				(note as HTMLElement).hidden = !(
					activeCategories.length === 0 || activeCategories.includes(noteCategory!)
				);
			});

			tocHeadingNotes.forEach(function (heading) {
				(heading as HTMLElement).style.display =
					activeCategories.length === 0 ||
					activeCategories.some(function (category) {
						return heading.textContent!.startsWith(category);
					})
						? 'flex'
						: 'none';
			});
		},
		true,
	);
})();
