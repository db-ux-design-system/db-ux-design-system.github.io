import { expect, type Page, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Functional test of the Theme Builder intro dialog (no screenshots). The helper is copied
// from navigation-screenshots.spec.ts, because importing that file would register its tests.
const waitForDBShell = async (page: Page) => {
	const dbPage = page.locator('.db-shell').first();
	await dbPage.evaluate((element) => {
		element.style.transition = 'none';
	});
	await expect(dbPage).toHaveCSS('opacity', '1');
	await expect(dbPage).not.toHaveAttribute('data-fonts-loaded', 'false');
};

const INTRO_KEY = 'db-ux-theme-builder:intro-dismissed';

const pages = [
	{
		lang: 'EN',
		path: '/themebuilder',
		title: 'Welcome to the Theme Builder',
		learnHref: '/documentation/learn/theme-builder',
		dismiss: 'Do not show again',
		start: 'Get started',
	},
	{
		lang: 'DE',
		path: '/de/themebuilder',
		title: 'Willkommen im Theme Builder',
		learnHref: '/de/dokumentation/lernen/theme-builder',
		dismiss: 'Nicht mehr anzeigen',
		start: 'Loslegen',
	},
];

for (const { lang, path, title, learnHref, dismiss, start } of pages) {
	test.describe(`Theme Builder intro dialog (${lang})`, () => {
		const intro = (page: Page) => page.locator('dialog').filter({ hasText: title });

		const open = async (page: Page) => {
			await page.goto(path);
			await waitForDBShell(page);
			await expect(intro(page)).toBeVisible();
		};

		test('opens as a modal on the first visit and links to the Learn article', async ({ page }) => {
			await open(page);
			const dialog = intro(page);
			expect(await dialog.evaluate((element) => element.matches(':modal'))).toBe(true);
			expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(
				true,
			);
			await expect(dialog.locator('a')).toHaveAttribute('href', learnHref);
		});

		test('has no accessibility violations', async ({ page }) => {
			await open(page);
			const results = await new AxeBuilder({ page }).include('html').analyze();
			expect(results.violations).toEqual([]);
		});

		test('shows again after closing it without the opt-out', async ({ page }) => {
			await open(page);
			await intro(page).getByRole('button', { name: start }).click();
			await expect(intro(page)).toBeHidden();
			expect(await page.evaluate((key) => localStorage.getItem(key), INTRO_KEY)).toBeNull();

			await page.reload();
			await waitForDBShell(page);
			await expect(intro(page)).toBeVisible();
		});

		test('stays hidden after closing it with the opt-out, also via Escape', async ({ page }) => {
			await open(page);
			await intro(page).getByText(dismiss).click();
			await page.keyboard.press('Escape');
			await expect(intro(page)).toBeHidden();
			expect(await page.evaluate((key) => localStorage.getItem(key), INTRO_KEY)).toBe('true');

			await page.reload();
			await waitForDBShell(page);
			await expect(page.locator('.theme-builder')).toBeVisible();
			await expect(intro(page)).toBeHidden();
		});
	});
}
