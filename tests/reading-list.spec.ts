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

// The bookmark button is a client:load island. A click before hydration does nothing,
// so wait until Astro has hydrated it (it removes the ssr attribute then). Direct
// child only: the Shell island around the page contains the toggle as well.
const waitForToggle = async (page: Page) => {
	await expect(page.locator('astro-island:has(> .rl-toggle)')).not.toHaveAttribute('ssr', /.*/);
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
	await expect(page.locator('.gsw-result .gsw-package-item')).toHaveCount(3);

	const stored = await readList(page);
	expect(stored.items.map((item: { id: string }) => item.id)).toEqual([
		'documentation/resources/design',
		'documentation/learn/figma-tutorial',
		'documentation/learn/about#where-to-ask-which-question',
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
		'Design Resources',
		'Figma Tutorial',
		'Where to ask which question',
	]);
	await expect(popover.locator('input[type=checkbox]')).toHaveCount(0);
	await expect(popover.getByRole('button', { name: /Start again|Remove$/ })).toHaveCount(0);

	// Delete: the focus moves to the delete button that takes the row's place.
	await popover.getByRole('button', { name: 'Remove: Figma Tutorial' }).click();
	await expect(popover.locator('.rl-item')).toHaveCount(2);
	await expect(
		popover.getByRole('button', { name: 'Remove: Where to ask which question' }),
	).toBeFocused();
	await expect(trigger).toHaveAccessibleName('Reading list, 2 pages');

	// The same result again (reload) does not bring the deleted page back.
	await page.reload();
	await waitForDBShell(page);
	await expect(page.locator('#gsw-heading')).toHaveText('Your next steps');
	expect((await readList(page)).items).toHaveLength(2);

	// Another result appends its pages without duplicates.
	await page.goto('/documentation/get-started?role=design&designIntent=learn');
	await waitForDBShell(page);
	await expect(page.locator('#gsw-heading')).toHaveText('Your next steps');
	expect((await readList(page)).items.map((item: { id: string }) => item.id)).toEqual([
		'documentation/resources/design',
		'documentation/learn/about#where-to-ask-which-question',
		'documentation/learn/about',
		'documentation/foundation',
		'documentation/components',
	]);

	// The whole row is a link: a click on the row padding, outside the link text, navigates.
	await trigger.hover();
	await popover
		.locator('.rl-item')
		.first()
		.click({ position: { x: 4, y: 4 } });
	await page.waitForURL(/\/documentation\/resources\/design/);
});

test('bookmark button adds and removes the page', async ({ page }) => {
	await page.goto('/documentation/learn/figma');
	await waitForDBShell(page);
	// Icon-only, next to the headline, with a tooltip that repeats the label.
	const toggle = page.locator('.page-hero-headline-row .rl-toggle button');
	await expect(toggle).toHaveAccessibleName('Add to reading list');
	await expect(toggle).toHaveAttribute('data-icon', 'bookmark');
	await expect(toggle).not.toHaveAttribute('data-icon-variant', 'db-filled');
	await expect(toggle.locator('.db-tooltip')).toHaveText('Add to reading list');
	// The button sits outside the heading, so the heading name stays the headline.
	await expect(page.locator('h1')).toHaveAccessibleName('Figma');

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
	const deToggle = page.locator('.rl-toggle button');
	await expect(deToggle).toHaveAccessibleName('Von der Leseliste entfernen');
	await trigger.hover();
	const link = page.locator('.db-control-panel-desktop .rl-item-link');
	await expect(link).toHaveText('Figma-Tipps');
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
	await page.locator('.rl-toggle button').click();

	const control = page.locator('.db-control-panel-desktop .rl-control');
	await control.locator('button.rl-trigger').hover();
	const lists = control.locator('.rl-list');
	await expect(lists).toHaveCount(2);
	await expect(lists.nth(0)).toHaveAttribute('data-source', 'bookmark');
	await expect(lists.nth(0)).toHaveAccessibleName('Saved by you');
	await expect(lists.nth(0).locator('.rl-item-link')).toHaveText(['Connect your AI coding agent']);
	await expect(lists.nth(1)).toHaveAttribute('data-source', 'wizard');
	await expect(lists.nth(1).locator('.rl-item')).toHaveCount(3);
	await expect(lists.nth(1)).toHaveCSS('border-inline-start-width', '2px');

	// Deleting the last bookmark moves the focus into the wizard group.
	await lists.nth(0).getByRole('button', { name: 'Remove: Connect your AI coding agent' }).click();
	await expect(control.locator('.rl-list')).toHaveCount(1);
	await expect(control.getByRole('button', { name: 'Remove: Design Resources' })).toBeFocused();
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

	const designer = page.getByRole('radio', { name: 'Design', exact: true });
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

	const newProject = page.getByRole('radio', { name: 'New project' });
	await page.locator('.gsw-option', { has: newProject }).click();
	await expect(newProject).toBeChecked();
	await page.getByRole('button', { name: 'Next' }).click();
	await expect(heading).toHaveText('Your next steps');
	await expect(heading).toBeFocused();

	// Back preselects the previous answer.
	await page.getByRole('button', { name: 'Back' }).click();
	await expect(heading).toHaveText('What are you about to do?');
	await expect(heading).toBeFocused();
	await expect(newProject).toBeChecked();
	await expect(
		page.locator('.gsw-option', { has: newProject }).locator('.gsw-option-check'),
	).toHaveCount(1);
});

test('browser Back and Forward between steps and from a result link', async ({ page }) => {
	await page.goto('/documentation/get-started');
	await waitForDBShell(page);
	const heading = page.locator('.gsw h1');
	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Design', exact: true }) })
		.click();
	await page.getByRole('button', { name: 'Next', exact: true }).click();
	await expect(heading).toHaveText('What are you about to do?');
	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'New project' }) })
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
	await page.locator('.gsw-result a.db-button[data-variant=brand]').click();
	await page.waitForURL(/\/documentation\/resources\/design$/);
	await expect(page.locator('.gsw')).toHaveCount(0);
	await page.goBack();
	await expect(page).toHaveURL(/\/documentation\/get-started\?role=design&designIntent=new$/);
	await expect(heading).toHaveText('Your next steps');
	await expect(page.locator('.gsw-result .gsw-package-item')).toHaveCount(3);
});

test('German wizard path', async ({ page }) => {
	await page.goto('/de/dokumentation/erste-schritte');
	await waitForDBShell(page);
	const heading = page.locator('.gsw h1');
	await expect(heading).toHaveText('Was ist deine Rolle?');
	await expect(page.locator('.gsw-option-label')).toHaveText([
		'Design',
		'Entwicklung',
		'Produktmanagement',
	]);

	await page.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Design' }) }).click();
	await page.getByRole('button', { name: 'Weiter' }).click();
	await expect(heading).toHaveText('Was hast du vor?');
	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Neues Projekt' }) })
		.click();
	await page.getByRole('button', { name: 'Weiter' }).click();

	await expect(heading).toHaveText('Deine nächsten Schritte');
	const cta = page.locator('.gsw-result a.db-button[data-variant=brand]');
	await expect(cta).toHaveText('Öffnen');
	await expect(cta).toHaveAccessibleName('Öffnen: Design-Ressourcen');
	await expect(cta).toHaveAttribute('href', '/de/dokumentation/ressourcen/design');
	const hrefs = await page
		.locator('.gsw-package-button')
		.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
	expect(hrefs).toHaveLength(3);
	for (const href of hrefs) expect(href).toMatch(/^\/de\/dokumentation\//);
	// The anchor of the help item is localized as well.
	expect(hrefs.at(-1)).toMatch(/#wohin-welche-frage-geh/);
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
