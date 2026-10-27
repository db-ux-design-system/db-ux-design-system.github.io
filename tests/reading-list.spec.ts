import { expect, type Page, test } from '@playwright/test';

// Functional test of the reading list and the Get Started wizard (no screenshots). The helper is copied from
// navigation-screenshots.spec.ts, because importing that file would register its tests.
const waitForDBShell = async (page: Page) => {
	const dbPage = page.locator('.db-shell').first();
	await dbPage.evaluate((element) => {
		element.style.transition = 'none';
	});
	await expect(dbPage).toHaveCSS('opacity', '1');
	await expect(dbPage).not.toHaveAttribute('data-fonts-loaded', 'false');
};

const KEY = 'db-ux-reading-list';
const HINT_KEY = 'db-ux-reading-list-hint';

// The bookmark button is a client:load island. A click before hydration does nothing,
// so wait until Astro has hydrated it (it removes the ssr attribute then). Direct
// child only: the Shell island around the page contains the toggle as well.
const waitForToggle = async (page: Page) => {
	await expect(page.locator('astro-island:has(> .rl-toggle)')).not.toHaveAttribute('ssr', /.*/);
};

// Deleting asks first: confirms the dialog of the desktop reading list.
const confirmDelete = async (page: Page, button = 'Remove') => {
	const dialog = page.locator('.db-control-panel-desktop .rl-control dialog[open]');
	await expect(dialog).toBeVisible();
	await dialog.getByRole('button', { name: button, exact: true }).click();
	await expect(dialog).toHaveCount(0);
};

const readList = (page: Page) =>
	page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? 'null'), KEY);

test('reading list is always visible and filled by the wizard result', async ({ page }) => {
	await page.goto('/documentation/learn');
	await waitForDBShell(page);

	// Empty list: the button is there, without badge, and the popover explains how to fill it.
	const control = page.locator('.db-control-panel-desktop .rl-control');
	const trigger = control.locator('button.rl-trigger');
	await expect(trigger).toHaveAttribute('data-icon', 'bookmark');
	await expect(trigger).not.toHaveAttribute('data-icon-variant', 'db-filled');
	await expect(trigger).toHaveAccessibleName('Reading list, empty');
	await expect(trigger.locator('.db-badge')).toHaveCount(0);
	const popover = control.locator('article.db-popover-content');
	await trigger.hover();
	await expect(popover).toBeVisible();
	await expect(popover.locator('.rl-empty a')).toHaveAttribute(
		'href',
		'/documentation/get-started',
	);

	await page.goto('/documentation/get-started?role=design&designIntent=new');
	await waitForDBShell(page);
	await expect(page.locator('#gsw-heading')).toHaveText('Your next steps');
	await expect(page.locator('.gsw-package-list .gsw-package-item')).toHaveCount(3);

	// One brand CTA above the list, arrow links inside it.
	const cta = page.locator('.gsw-start');
	await expect(cta).toHaveText('Start learning package');
	await expect(cta).toHaveAttribute('data-icon-trailing', 'arrow_right');
	await expect(cta).toHaveAttribute('href', '/documentation/learn/figma-setup');
	await expect(page.locator('.gsw-package-list a[data-variant=brand]')).toHaveCount(0);
	const firstArrow = page.locator('.gsw-package-button').first();
	await expect(firstArrow).toHaveAttribute('data-variant', 'ghost');
	await expect(firstArrow).toHaveAttribute('data-icon', 'arrow_right');
	await expect(firstArrow).toHaveAccessibleName('Open: Set up the Figma libraries');

	// Hint that the pages are on the reading list: an overlay notification below the
	// control panel, with the bookmark icon of the header button.
	const saved = page.locator('.gsw-saved.db-notification');
	await expect(saved).toHaveAttribute('data-variant', 'overlay');
	await expect(saved).toHaveAttribute('data-icon', 'bookmark');
	await expect(saved).toHaveAttribute('data-icon-variant', 'db-filled');
	await expect(saved.locator('header')).toHaveText('Saved to your reading list');
	await expect(saved).toContainText('with the \u201cReading list\u201d button in the header');
	await expect(saved.locator('.db-badge')).toHaveCount(0);
	// Hangs below the control panel at the end edge and stays until it is closed.
	const panelBottom = await page
		.locator('.db-control-panel-desktop')
		.evaluate((element) => element.getBoundingClientRect().bottom);
	const savedTop = await saved.evaluate((element) => element.getBoundingClientRect().top);
	expect(savedTop).toBeGreaterThanOrEqual(panelBottom);
	await saved.getByRole('button').click();
	await expect(saved).toHaveCount(0);

	// Below the list: starting over as a ghost button, the package CTA as the brand one.
	const actions = page.locator('.gsw-actions > *');
	await expect(actions).toHaveCount(2);
	await expect(actions.nth(0)).toHaveText('Start again');
	await expect(actions.nth(1)).toHaveText('Start learning package');
	await expect(page.getByRole('button', { name: 'Back' })).toHaveCount(0);

	// The bar of the wizard group in the popover has the color of the lines of the
	// result list.
	const lineColor = (selector: string) =>
		page
			.locator(selector)
			.first()
			.evaluate((element) => getComputedStyle(element).borderInlineStartColor);
	const resultLine = await lineColor('.gsw-package-item');
	await trigger.hover();
	await expect(popover).toBeVisible();
	expect(await lineColor('.rl-list[data-source=wizard]')).toBe(resultLine);
	await page.mouse.move(0, 0);

	const stored = await readList(page);
	expect(stored.items.map((item: { id: string }) => item.id)).toEqual([
		'documentation/learn/figma-setup',
		'documentation/learn/figma-tutorial',
		'documentation/learn/about#where-to-get-help',
	]);
	await expect(trigger).toHaveAccessibleName('Reading list, 3 pages');
	await expect(trigger.locator('.db-badge')).toHaveText('3');
	await expect(trigger).toHaveAttribute('data-icon-variant', 'db-filled');
	expect(stored.items.every((item: { source: string }) => item.source === 'wizard')).toBe(true);

	// Popover: links and delete buttons, no progress, no checkboxes, no footer actions.
	await trigger.hover();
	await expect(popover).toBeVisible();
	// All three come from the wizard: one group, marked by the bar.
	await expect(popover.locator('.rl-list')).toHaveCount(1);
	await expect(popover.locator('.rl-list[data-source=wizard]')).toHaveAccessibleName(
		'Suggested in Get Started',
	);
	await expect(popover.locator('.rl-item-link')).toHaveText([
		'Set up the Figma libraries',
		'Design a contact form in Figma',
		'Where to get help',
	]);
	await expect(popover.locator('input[type=checkbox]')).toHaveCount(0);
	await expect(popover.getByRole('button', { name: /Start again|Remove$/ })).toHaveCount(0);

	// Delete: the focus moves to the delete button that takes the row's place.
	await popover.getByRole('button', { name: 'Remove: Design a contact form in Figma' }).click();
	await confirmDelete(page);
	await expect(popover.locator('.rl-item')).toHaveCount(2);
	await expect(popover.getByRole('button', { name: 'Remove: Where to get help' })).toBeFocused();
	await expect(trigger).toHaveAccessibleName('Reading list, 2 pages');

	// The same result again (reload) does not bring the deleted page back.
	await page.reload();
	await waitForDBShell(page);
	await expect(page.locator('#gsw-heading')).toHaveText('Your next steps');
	expect((await readList(page)).items).toHaveLength(2);

	// Another result replaces the pages of the one before: only one package is on the
	// list at a time.
	await page.goto('/documentation/get-started?role=design&designIntent=learn');
	await waitForDBShell(page);
	await expect(page.locator('#gsw-heading')).toHaveText('Your next steps');
	expect((await readList(page)).items.map((item: { id: string }) => item.id)).toEqual([
		'documentation/learn/about',
		'documentation/foundation',
		'documentation/components',
	]);

	// The box of the page is the link: a click on its padding, outside the label,
	// navigates. The delete button next to it is not part of that box.
	await trigger.hover();
	await popover
		.locator('.rl-item')
		.first()
		.click({ position: { x: 4, y: 4 } });
	await page.waitForURL(/\/documentation\/learn\/about$/);
});

test('bookmark button adds and removes the page', async ({ page }) => {
	await page.goto('/documentation/learn/figma');
	await waitForDBShell(page);
	// Icon-only, next to the headline, with a tooltip that repeats the label.
	const toggle = page.locator('.page-hero-headline-row .rl-toggle > button');
	await expect(toggle).toHaveAccessibleName('Add to reading list');
	await expect(toggle).toHaveAttribute('data-icon', 'bookmark');
	await expect(toggle).not.toHaveAttribute('data-icon-variant', 'db-filled');
	await expect(toggle.locator('.db-tooltip')).toHaveText('Add to reading list');
	// The button sits outside the heading, so the heading name stays the headline.
	await expect(page.locator('h1')).toHaveAccessibleName('Work with the components in Figma');

	await waitForToggle(page);
	await toggle.click();
	await expect(toggle).toHaveAccessibleName('Remove from reading list');
	await expect(toggle).toHaveAttribute('data-icon-variant', 'db-filled');
	await expect(page.locator('.rl-toggle [role=status]')).toHaveText('Added to reading list');
	const stored = await readList(page);
	expect(stored.items).toHaveLength(1);
	expect(stored.items[0]).toMatchObject({ id: 'documentation/learn/figma', source: 'bookmark' });
	expect(stored.items[0].title.de).toBeTruthy();
	const trigger = page.locator('.db-control-panel-desktop .rl-trigger');
	await expect(trigger).toHaveAccessibleName('Reading list, 1 page');

	// Same page in German: the toggle shows the saved state, the list the German label.
	await page.goto('/de/dokumentation/lernen/figma');
	await waitForDBShell(page);
	const deToggle = page.locator('.rl-toggle > button');
	await expect(deToggle).toHaveAccessibleName('Von der Leseliste entfernen');
	await trigger.hover();
	const link = page.locator('.db-control-panel-desktop .rl-item-link');
	await expect(link).toHaveText('Mit den Komponenten in Figma arbeiten');
	await expect(link).toHaveAttribute('href', '/de/dokumentation/lernen/figma');

	await page.mouse.move(0, 0);
	await waitForToggle(page);
	await deToggle.click();
	await expect(deToggle).toHaveAccessibleName('Zur Leseliste hinzufügen');
	expect((await readList(page)).items).toEqual([]);
	await expect(trigger).toHaveAccessibleName('Leseliste, leer');
});

test('bookmarks come first, wizard suggestions below as their own group', async ({ page }) => {
	await page.goto('/documentation/get-started?role=design&designIntent=new');
	await waitForDBShell(page);
	await expect(page.locator('#gsw-heading')).toHaveText('Your next steps');
	await page.goto('/documentation/learn/ai');
	await waitForDBShell(page);
	await waitForToggle(page);
	await page.locator('.rl-toggle > button').click();

	const control = page.locator('.db-control-panel-desktop .rl-control');
	await control.locator('button.rl-trigger').hover();
	const lists = control.locator('.rl-list');
	await expect(lists).toHaveCount(2);
	await expect(lists.nth(0)).toHaveAttribute('data-source', 'bookmark');
	await expect(lists.nth(0)).toHaveAccessibleName('Saved by you');
	await expect(lists.nth(0).locator('.rl-item-link')).toHaveText(['Work with AI coding agents']);
	await expect(lists.nth(1)).toHaveAttribute('data-source', 'wizard');
	await expect(lists.nth(1).locator('.rl-item')).toHaveCount(3);
	await expect(lists.nth(1)).toHaveCSS('border-inline-start-width', '2px');

	// Deleting the last bookmark moves the focus into the wizard group.
	await lists.nth(0).getByRole('button', { name: 'Remove: Work with AI coding agents' }).click();
	await confirmDelete(page);
	await expect(control.locator('.rl-list')).toHaveCount(1);
	await expect(
		control.getByRole('button', { name: 'Remove: Set up the Figma libraries' }),
	).toBeFocused();
});

test('a new result replaces the pages of the one before', async ({ page }) => {
	// A page saved by hand, so it can be told apart from the wizard pages.
	await page.goto('/documentation/learn/figma');
	await waitForDBShell(page);
	await waitForToggle(page);
	await page.locator('.rl-toggle > button').click();

	await page.goto('/documentation/get-started?role=design&designIntent=new');
	await waitForDBShell(page);
	const sources = async () =>
		(await readList(page)).items.map(
			(item: { source?: string; id: string }) => `${item.source}:${item.id}`,
		);
	await expect
		.poll(sources)
		.toEqual([
			'bookmark:documentation/learn/figma',
			'wizard:documentation/learn/figma-setup',
			'wizard:documentation/learn/figma-tutorial',
			'wizard:documentation/learn/about#where-to-get-help',
		]);

	// Start again with another role: only the pages of the new package are left, the
	// bookmark stays.
	await page.getByRole('button', { name: 'Start again' }).click();
	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Product manager' }) })
		.click();
	await page.getByRole('button', { name: 'Next' }).click();
	await page.locator('.gsw-option').first().click();
	await page.getByRole('button', { name: 'Next' }).click();
	await expect(page.locator('.gsw-package-list .gsw-package-item')).toHaveCount(2);
	await expect
		.poll(sources)
		.toEqual([
			'bookmark:documentation/learn/figma',
			'wizard:documentation/learn/about',
			'wizard:documentation/learn/accessibility',
		]);

	// The same result again does not add the pages a second time.
	await page.reload();
	await waitForDBShell(page);
	expect((await readList(page)).items).toHaveLength(3);
});

test('going through the wizard again adds the same result after Remove all', async ({ page }) => {
	await page.goto('/documentation/get-started?role=design&designIntent=new');
	await waitForDBShell(page);
	await expect.poll(async () => (await readList(page))?.items.length).toBe(3);
	const control = page.locator('.db-control-panel-desktop .rl-control');
	await control.locator('button.rl-trigger').hover();
	await control.getByRole('button', { name: 'Remove all' }).click();
	await confirmDelete(page, 'Remove all');
	await expect.poll(async () => (await readList(page)).items).toEqual([]);

	// A reload of the result must not bring the pages back, and the hint says nothing.
	await page.reload();
	await waitForDBShell(page);
	await expect(page.locator('#gsw-heading')).toBeVisible();
	expect((await readList(page)).items).toEqual([]);
	await expect(page.locator('.gsw-saved')).toHaveCount(0);

	// Going through the wizard to the same result adds its pages again.
	await page.mouse.move(0, 0);
	await page.getByRole('button', { name: 'Start again' }).click();
	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Designer', exact: true }) })
		.click();
	await page.getByRole('button', { name: 'Next', exact: true }).click();
	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Start a new project' }) })
		.click();
	await page.getByRole('button', { name: 'Next', exact: true }).click();
	await expect.poll(async () => (await readList(page)).items.length).toBe(3);
	await expect(page.locator('.gsw-saved')).toBeVisible();
});

test('the saved hint comes back on the next result after it was closed', async ({ page }) => {
	await page.goto('/documentation/get-started?role=design&designIntent=new');
	await waitForDBShell(page);
	const saved = page.locator('.gsw-saved');
	await expect(saved).toBeVisible();
	await saved.getByRole('button').click();
	await expect(saved).toHaveCount(0);

	await page.getByRole('button', { name: 'Start again' }).click();
	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Designer', exact: true }) })
		.click();
	await page.getByRole('button', { name: 'Next', exact: true }).click();
	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Explore the design system' }) })
		.click();
	await page.getByRole('button', { name: 'Next', exact: true }).click();
	await expect(page.locator('#gsw-heading')).toBeVisible();
	await expect(saved).toBeVisible();
});

test('pages saved under a renamed anchor are kept with the new id', async ({ page }) => {
	await page.goto('/documentation/learn');
	await waitForDBShell(page);
	await page.evaluate(
		(key) =>
			localStorage.setItem(
				key,
				JSON.stringify({
					version: 1,
					items: [
						{ id: 'documentation/learn/about#where-to-ask-which-question', source: 'wizard' },
						{ id: 'documentation/learn/about#where-to-get-help', source: 'wizard' },
					],
				}),
			),
		KEY,
	);
	await page.reload();
	await waitForDBShell(page);
	const control = page.locator('.db-control-panel-desktop .rl-control');
	await control.locator('button.rl-trigger').hover();
	// Old and new id are the same page: listed once, linking to the current anchor.
	const link = control.locator('.rl-item-link');
	await expect(link).toHaveCount(1);
	await expect(link).toHaveAttribute('href', '/documentation/learn/about#where-to-get-help');
});

test('Remove all empties the list and is only shown with entries', async ({ page }) => {
	await page.goto('/documentation/learn');
	await waitForDBShell(page);
	const control = page.locator('.db-control-panel-desktop .rl-control');
	const trigger = control.locator('button.rl-trigger');
	const popover = control.locator('article.db-popover-content');
	const removeAll = popover.getByRole('button', { name: 'Remove all' });

	// Empty list: no button.
	await trigger.hover();
	await expect(popover).toBeVisible();
	await expect(removeAll).toHaveCount(0);

	await page.goto('/documentation/get-started?role=design&designIntent=new');
	await waitForDBShell(page);
	await expect(page.locator('#gsw-heading')).toBeVisible();
	await expect.poll(async () => (await readList(page))?.items.length).toBeGreaterThan(0);

	await trigger.hover();
	await expect(removeAll).toBeVisible();
	await removeAll.click();
	await confirmDelete(page, 'Remove all');
	await expect.poll(async () => (await readList(page)).items).toEqual([]);
	await expect(popover.locator('.rl-empty')).toBeVisible();
	await expect(removeAll).toHaveCount(0);
	await expect(trigger).toBeFocused();
	await expect(trigger).toHaveAccessibleName('Reading list, empty');
	await expect(popover.locator('[role=status]')).toHaveText(
		'All pages removed from the reading list',
	);
});

test('deleting asks first; cancel and Escape keep the entry', async ({ page }) => {
	await page.goto('/de/dokumentation/erste-schritte?role=design&designIntent=new');
	await waitForDBShell(page);
	await expect.poll(async () => (await readList(page))?.items.length).toBe(3);
	const control = page.locator('.db-control-panel-desktop .rl-control');
	const dialog = control.locator('dialog');
	const bin = control.getByRole('button', {
		name: 'Entfernen: Ein Kontaktformular in Figma gestalten',
	});

	await control.locator('button.rl-trigger').hover();
	await bin.click();
	await expect(dialog).toBeVisible();
	await expect(dialog).toHaveAccessibleName('Eintrag entfernen?');
	await expect(dialog).toHaveAccessibleDescription(
		'„Ein Kontaktformular in Figma gestalten“ wird von deiner Leseliste entfernt.',
	);

	// Cancel: nothing removed, the focus returns to the bin button.
	await dialog.getByRole('button', { name: 'Abbrechen' }).click();
	await expect(dialog).toBeHidden();
	await expect(bin).toBeFocused();
	expect((await readList(page)).items).toHaveLength(3);

	// Escape cancels as well.
	await bin.click();
	await expect(dialog).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(dialog).toBeHidden();
	expect((await readList(page)).items).toHaveLength(3);

	// "Remove all" asks with the number of pages.
	await control.getByRole('button', { name: 'Alle entfernen' }).click();
	await expect(dialog).toHaveAccessibleName('Alle Einträge entfernen?');
	await expect(dialog).toHaveAccessibleDescription(
		'Alle 3 Seiten werden von deiner Leseliste entfernt.',
	);
	await dialog.getByRole('button', { name: 'Abbrechen' }).click();
	expect((await readList(page)).items).toHaveLength(3);
});

test.describe('finished reading', () => {
	const saveAbout = async (page: Page) => {
		await page.goto('/documentation/learn/about');
		await waitForDBShell(page);
		await waitForToggle(page);
		await page.locator('.rl-toggle > button').click();
		await expect.poll(async () => (await readList(page))?.items.length).toBe(1);
	};

	test('article view: a notification at the end, without taking the focus', async ({ page }) => {
		await page.addInitScript(() => window.localStorage.setItem('db-ux-learn-view', 'article'));
		await saveAbout(page);
		const finished = page.locator('.rl-finished');
		await expect(finished).toHaveCount(0);

		// Focus somewhere in the page, then scroll to the end.
		await page.locator('.rl-toggle > button').focus();
		await page
			.locator('.db-shell-content')
			.evaluate((shell) => shell.scrollTo({ top: shell.scrollHeight }));
		await expect(finished).toBeVisible();
		await expect(finished).toContainText('Finished reading?');
		// No modal: the focus stays where it was, nothing is inert.
		await expect(page.locator('.rl-toggle > button')).toBeFocused();
		await expect(page.locator('dialog[open]')).toHaveCount(0);
		await expect(page.locator('.rl-toggle > [role=status]')).toContainText('Finished reading?');
		// Announced once: the notification itself is no live region.
		await expect(finished).toHaveAttribute('role', 'article');

		await finished.getByRole('button', { name: 'Remove from reading list' }).click();
		await expect(finished).toHaveCount(0);
		expect((await readList(page)).items).toEqual([]);
	});

	test('stepper view: the notification comes on the last step and can be closed', async ({
		page,
	}) => {
		await page.addInitScript(() => window.localStorage.setItem('db-ux-learn-view', 'stepper'));
		await saveAbout(page);
		const finished = page.locator('.rl-finished');
		const next = page.locator('[data-step-next]');
		while (await next.isEnabled()) await next.click();
		await expect(finished).toBeVisible();

		await finished.getByRole('button', { name: 'Close' }).click();
		await expect(finished).toHaveCount(0);
		// Closing keeps the page on the list.
		expect((await readList(page)).items).toHaveLength(1);
	});
});

test('Escape closes the reading list popover by hover and from inside', async ({ page }) => {
	await page.goto('/documentation/get-started?role=design&designIntent=new');
	await waitForDBShell(page);
	await expect(page.locator('#gsw-heading')).toHaveText('Your next steps');
	const control = page.locator('.db-control-panel-desktop .rl-control');
	const trigger = control.locator('button.rl-trigger');
	const popover = control.locator('article.db-popover-content');

	// Open by hover, focus elsewhere: Escape hides it although the pointer stays.
	await trigger.hover();
	await expect(popover).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(popover).toBeHidden();
	await expect(trigger).toHaveAttribute('aria-expanded', 'false');

	// Leaving and coming back shows it again.
	await page.mouse.move(0, 0);
	await trigger.hover();
	await expect(popover).toBeVisible();

	// Focus on a link inside: Escape hides it and puts the focus on the trigger.
	await page.mouse.move(0, 0);
	await trigger.focus();
	// The first Tab reaches "Remove all" in the header, the second the first link.
	await page.keyboard.press('Tab');
	await expect(popover.getByRole('button', { name: 'Remove all' })).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(popover.locator('.rl-item-link').first()).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(popover).toBeHidden();
	await expect(trigger).toBeFocused();

	// A click on the trigger shows it again.
	await trigger.click();
	await expect(popover).toBeVisible();
	await expect(trigger).toHaveAttribute('aria-expanded', 'true');
});

test('wizard steps by click, with focus, check icon and Back', async ({ page }) => {
	await page.goto('/documentation/get-started');
	await waitForDBShell(page);
	const heading = page.locator('.gsw h1');
	await expect(heading).toHaveText('What is your role?');
	// The answers are no headings: the question is the only heading of the step.
	await expect(page.locator('.gsw :is(h2, h3, h4, h5, h6)')).toHaveCount(0);

	// Role tiles are tinted before a pick, but none shows the check icon.
	const check = page.locator('.gsw-option-check');
	await expect(check).toHaveCount(0);

	const designer = page.getByRole('radio', { name: 'Designer', exact: true });
	await page.locator('.gsw-option', { has: designer }).click();
	await expect(designer).toBeChecked();
	await expect(designer).toBeFocused();
	await expect(check).toHaveCount(1);
	await expect(
		page.locator('.gsw-option', { has: designer }).locator('.gsw-option-check'),
	).toHaveCount(1);

	await page.getByRole('button', { name: 'Next' }).click();
	await expect(page).toHaveURL(/\?role=design$/);
	await expect(heading).toHaveText('What are you about to do?');
	await expect(heading).toBeFocused();
	await expect(check).toHaveCount(0);

	// Back on a question step preselects the previous answer. The result has no Back
	// button, so this is checked between the two questions.
	await page.getByRole('button', { name: 'Back' }).click();
	await expect(page).toHaveURL(/\/documentation\/get-started$/);
	await expect(heading).toHaveText('What is your role?');
	await expect(heading).toBeFocused();
	await expect(designer).toBeChecked();
	await expect(
		page.locator('.gsw-option', { has: designer }).locator('.gsw-option-check'),
	).toHaveCount(1);

	await page.getByRole('button', { name: 'Next' }).click();
	const newProject = page.getByRole('radio', { name: 'Start a new project' });
	await page.locator('.gsw-option', { has: newProject }).click();
	await expect(newProject).toBeChecked();
	await page.getByRole('button', { name: 'Next' }).click();
	await expect(heading).toHaveText('Your next steps');
	await expect(heading).toBeFocused();
});

test('browser Back and Forward between steps and from a result link', async ({ page }) => {
	await page.goto('/documentation/get-started');
	await waitForDBShell(page);
	const heading = page.locator('.gsw h1');
	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Designer', exact: true }) })
		.click();
	await page.getByRole('button', { name: 'Next', exact: true }).click();
	await expect(heading).toHaveText('What are you about to do?');
	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Start a new project' }) })
		.click();
	await page.getByRole('button', { name: 'Next', exact: true }).click();
	await expect(heading).toHaveText('Your next steps');

	// Back between steps: the wizard re-renders itself, the page is not swapped.
	await page.evaluate(() => document.body.setAttribute('data-test-same-page', ''));
	await page.goBack();
	await expect(page).toHaveURL(/\?role=design$/);
	await expect(heading).toHaveText('What are you about to do?');
	await expect(heading).toBeFocused();
	await page.goForward();
	await expect(page).toHaveURL(/\?role=design&designIntent=new$/);
	await expect(heading).toHaveText('Your next steps');
	await expect(heading).toBeFocused();
	await expect(page.locator('body[data-test-same-page]')).toHaveCount(1);

	// A result link navigates to another page; Back shows the result again.
	await page.locator('.gsw-start').click();
	await page.waitForURL(/\/documentation\/learn\/figma-setup$/);
	await expect(page.locator('.gsw')).toHaveCount(0);
	await page.goBack();
	await expect(page).toHaveURL(/\/documentation\/get-started\?role=design&designIntent=new$/);
	await expect(heading).toHaveText('Your next steps');
	await expect(page.locator('.gsw-package-list .gsw-package-item')).toHaveCount(3);
});

test('German wizard path', async ({ page }) => {
	await page.goto('/de/dokumentation/erste-schritte');
	await waitForDBShell(page);
	const heading = page.locator('.gsw h1');
	await expect(heading).toHaveText('Was ist deine Rolle?');
	await expect(page.locator('.gsw-option-label')).toHaveText([
		'Designer:in',
		'Entwickler:in',
		// Carries a soft hyphen (U+00AD) so the long word hyphenates instead of being
		// split at an arbitrary character. See wizard-flow.ts.
		'Produkt\u00ADmanager:in',
	]);

	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Designer:in' }) })
		.click();
	await page.getByRole('button', { name: 'Weiter' }).click();
	await expect(heading).toHaveText('Was hast du vor?');
	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Neues Projekt starten' }) })
		.click();
	await page.getByRole('button', { name: 'Weiter' }).click();

	await expect(heading).toHaveText('Deine nächsten Schritte');
	const cta = page.locator('.gsw-start');
	await expect(cta).toHaveText('Lernpaket starten');
	await expect(cta).toHaveAttribute('href', '/de/dokumentation/lernen/figma-einrichten');
	await expect(page.locator('.gsw-package-button').first()).toHaveAccessibleName(
		'Öffnen: Figma-Bibliotheken einrichten',
	);
	await expect(cta).toHaveAttribute('href', '/de/dokumentation/lernen/figma-einrichten');
	const hrefs = await page
		.locator('.gsw-package-button')
		.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
	expect(hrefs).toHaveLength(3);
	for (const href of hrefs) expect(href).toMatch(/^\/de\/dokumentation\//);
	// The anchor of the help item is localized as well.
	expect(hrefs.at(-1)).toMatch(/#wo-du-hilfe-bekommst/);
});

test('the hint stays the first time and disappears on the next result', async ({ page }) => {
	await page.goto('/documentation/get-started?role=design&designIntent=new');
	await waitForDBShell(page);
	const saved = page.locator('.gsw-saved');

	// First result ever: the hint stays and is marked as seen.
	await expect(saved).toBeVisible();
	expect(await page.evaluate((key) => localStorage.getItem(key), HINT_KEY)).toBe('seen');
	await page.waitForTimeout(9_000);
	await expect(saved).toBeVisible();

	// Every later result: gone after 8 seconds. Hover and focus pause that countdown,
	// which is not part of this test because it would double its runtime.
	await page.reload();
	await waitForDBShell(page);
	await expect(saved).toBeVisible();
	await expect(saved).toHaveCount(0, { timeout: 15_000 });
});

test.describe('mobile', () => {
	test.use({ viewport: { width: 375, height: 800 } });

	test('menu bar shows the reading list button', async ({ page }) => {
		await page.goto('/documentation/get-started?role=design&designIntent=new');
		await waitForDBShell(page);
		await expect(page.locator('.gsw h1')).toHaveText('Your next steps');

		const control = page.locator('.db-control-panel-mobile .rl-control');
		const trigger = control.locator('button.rl-trigger');
		await expect(trigger).toBeVisible();
		await expect(trigger).toHaveAccessibleName('Reading list, 3 pages');
		const popover = control.locator('article.db-popover-content');
		await expect(popover).toBeHidden();
		await trigger.click();
		await expect(popover).toBeVisible();
		await expect(popover.locator('.rl-item')).toHaveCount(3);
	});
});
