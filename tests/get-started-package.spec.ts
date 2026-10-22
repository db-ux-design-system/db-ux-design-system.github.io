import { expect, type Page, test } from '@playwright/test';

// Functional test of the learning package (no screenshots). The helper is copied from
// navigation-screenshots.spec.ts, because importing that file would register its tests.
const waitForDBShell = async (page: Page) => {
	const dbPage = page.locator('.db-shell').first();
	await dbPage.evaluate((element) => {
		element.style.transition = 'none';
	});
	await expect(dbPage).toHaveCSS('opacity', '1');
	await expect(dbPage).not.toHaveAttribute('data-fonts-loaded', 'false');
};

const KEY = 'db-ux-learning-package';

test('learning package is saved and available in the control panel', async ({ page }) => {
	await page.goto('/documentation/get-started?role=design&designIntent=new');
	await waitForDBShell(page);
	await expect(page.locator('#gsw-heading')).toHaveText('Your next steps');

	// Result page: intro in the hero, one brand CTA above the list, arrow links in the
	// list, no checkboxes.
	await expect(page.locator('.gsw > .gsw-hero > .gsw-result-intro')).toHaveCount(1);
	await expect(page.locator('.gsw-package-list .gsw-result-intro')).toHaveCount(0);
	const cta = page.locator('.gsw-start');
	await expect(cta).toHaveText('Start learning package');
	await expect(cta).toHaveAttribute('data-variant', 'brand');
	await expect(cta).toHaveAttribute('data-icon-trailing', 'arrow_right');
	await expect(cta).toHaveAttribute('href', '/documentation/resources/design');
	await expect(page.locator('.gsw-package-list a[data-variant=brand]')).toHaveCount(0);
	const firstArrow = page.locator('.gsw-package-button').first();
	await expect(firstArrow).toHaveAttribute('data-variant', 'ghost');
	await expect(firstArrow).toHaveAttribute('data-icon', 'arrow_right');
	await expect(firstArrow).toHaveAccessibleName('Open: Design Resources');
	await expect(firstArrow).toHaveAttribute('href', '/documentation/resources/design');
	await expect(page.locator('.gsw-package-list .gsw-package-item')).toHaveCount(3);
	await expect(page.locator('.gsw input[type=checkbox]')).toHaveCount(0);
	await expect(page.locator('.gsw .lp-progress')).toHaveCount(0);

	// Hint that the package is saved: headline, text and a picture of the button with
	// the number of pages.
	const saved = page.locator('.gsw-saved');
	await expect(saved.getByRole('heading')).toHaveText('Saved to your reading list');
	await expect(saved).toContainText('with the bookmark button at the top');
	await expect(saved.locator('.gsw-saved-icon')).toHaveAttribute('data-icon', 'bookmark');
	await expect(saved.locator('.gsw-saved-badge')).toHaveText('3');

	const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? 'null'), KEY);
	expect(stored.version).toBe(1);
	expect(stored.viewed).toEqual([]);

	const control = page.locator('.db-control-panel-desktop .lp-control');
	const trigger = control.locator('button.db-button').first();
	await expect(trigger).toHaveAttribute('data-icon', 'light_bulb');
	await expect(trigger).toHaveAccessibleName('Your next steps, 0/3 viewed');

	// Popover: opens on hover and focus like the language switch. Labels only, the
	// checkbox toggles without navigating.
	const popover = control.locator('article.db-popover-content');
	await expect(popover).toBeHidden();
	await trigger.hover();
	await expect(popover).toBeVisible();
	await popover.getByRole('checkbox', { name: 'Viewed: Design Resources' }).check();
	await expect(page).toHaveURL(/\/documentation\/get-started\?/);
	await expect(popover.locator('.lp-progress')).toHaveText('1 of 3 viewed');
	await expect(trigger).toHaveAccessibleName('Your next steps, 1/3 viewed');

	// The whole row is a link: a click on the row padding, outside the link text, navigates.
	await popover
		.locator('.lp-item')
		.first()
		.click({ position: { x: 4, y: 4 } });
	await page.waitForURL(/\/documentation\/resources\/design/);
	await waitForDBShell(page);

	// Keyboard focus opens it. Escape closes it while the trigger has focus (library
	// behavior: Escape from a control inside the popover does nothing).
	await page.mouse.move(0, 0);
	await expect(popover).toBeHidden();
	await trigger.focus();
	await expect(popover).toBeVisible();
	await expect(popover.locator('input[type=checkbox]').first()).toBeChecked();
	await page.keyboard.press('Escape');
	await expect(popover).toBeHidden();

	await trigger.hover();
	await popover.getByRole('button', { name: 'Remove' }).click();
	await expect(page.locator('.lp-control')).toHaveCount(0);
	expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBeNull();
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
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Designer', exact: true }) })
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
	await page.locator('.gsw-start').click();
	await page.waitForURL(/\/documentation\/resources\/design$/);
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
		'Produktmanager:in',
	]);

	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Designer:in' }) })
		.click();
	await page.getByRole('button', { name: 'Weiter' }).click();
	await expect(heading).toHaveText('Was hast du vor?');
	await page
		.locator('.gsw-option', { has: page.getByRole('radio', { name: 'Neues Projekt' }) })
		.click();
	await page.getByRole('button', { name: 'Weiter' }).click();

	await expect(heading).toHaveText('Deine nächsten Schritte');
	const cta = page.locator('.gsw-start');
	await expect(cta).toHaveText('Lernpaket starten');
	await expect(cta).toHaveAttribute('href', '/de/dokumentation/ressourcen/design');
	await expect(page.locator('.gsw-package-button').first()).toHaveAccessibleName(
		'Öffnen: Design-Ressourcen',
	);
	const hrefs = await page
		.locator('.gsw-package-button')
		.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
	expect(hrefs).toHaveLength(3);
	for (const href of hrefs) expect(href).toMatch(/^\/de\/dokumentation\//);
	// The anchor of the help item is localized as well.
	expect(hrefs.at(-1)).toMatch(/#wohin-welche-frage-geh/);
});

test('Start again in the popover opens the wizard start and keeps the list', async ({ page }) => {
	await page.goto('/documentation/get-started?role=design&designIntent=new');
	await waitForDBShell(page);
	await expect(page.locator('.gsw h1')).toHaveText('Your next steps');

	const control = page.locator('.db-control-panel-desktop .lp-control');
	await control.locator('button.db-button').first().hover();
	await control.getByRole('button', { name: 'Start again' }).click();

	await expect(page).toHaveURL(/\/documentation\/get-started$/);
	await expect(page.locator('.gsw h1')).toHaveText('What is your role?');
	await expect(page.locator('.gsw-option-check')).toHaveCount(0);
	expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).not.toBeNull();
	await expect(control).toHaveCount(1);
});

test.describe('mobile', () => {
	test.use({ viewport: { width: 375, height: 800 } });

	test('menu bar shows the learning package button', async ({ page }) => {
		await page.goto('/documentation/get-started?role=design&designIntent=new');
		await waitForDBShell(page);
		await expect(page.locator('.gsw h1')).toHaveText('Your next steps');

		const control = page.locator('.db-control-panel-mobile .lp-control');
		const trigger = control.locator('button.db-button').first();
		await expect(trigger).toBeVisible();
		await expect(trigger).toHaveAccessibleName('Your next steps, 0/3 viewed');
		const popover = control.locator('article.db-popover-content');
		await expect(popover).toBeHidden();
		await trigger.click();
		await expect(popover).toBeVisible();
		await expect(popover.getByRole('checkbox')).toHaveCount(3);
	});
});
