import { expect, type Page, test } from '@playwright/test';

// Functional test of the Learn stepper (no screenshots). The helper is copied from
// navigation-screenshots.spec.ts, because importing that file would register its tests.
const waitForDBShell = async (page: Page) => {
	const dbPage = page.locator('.db-shell').first();
	await dbPage.evaluate((element) => {
		element.style.transition = 'none';
	});
	await expect(dbPage).toHaveCSS('opacity', '1');
	await expect(dbPage).not.toHaveAttribute('data-fonts-loaded', 'false');
};

const VIEW_KEY = 'db-ux-learn-view';

test.describe('stepper with a saved stepper preference', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript((key) => window.localStorage.setItem(key, 'stepper'), VIEW_KEY);
	});

	test('a link to a section opens the step that holds it', async ({ page }) => {
		// The help section is linked from the wizard and the reading list.
		await page.goto('/documentation/learn/about#where-to-get-help');
		await waitForDBShell(page);
		await expect(page.locator('html')).toHaveAttribute('data-learn-view', 'stepper');
		const target = page.locator('#where-to-get-help');
		await expect(target).toBeVisible();
		await expect(target).toBeInViewport();
		// It is not the first step, so the step status moved on.
		await expect(page.locator('[data-step-status]')).not.toHaveText(/^(Step|Schritt) 1 /);
	});

	test('without a section link the stepper starts at step 1', async ({ page }) => {
		await page.goto('/documentation/learn/about');
		await waitForDBShell(page);
		await expect(page.locator('html')).toHaveAttribute('data-learn-view', 'stepper');
		await expect(page.locator('[data-step-status]')).toHaveText(/^Step 1 /);
		await expect(page.locator('#where-to-get-help')).toBeHidden();
	});

	test('a section link on the open page switches to its step', async ({ page }) => {
		await page.goto('/documentation/learn/about');
		await waitForDBShell(page);
		await expect(page.locator('#where-to-get-help')).toBeHidden();
		await page.evaluate(() => {
			window.location.hash = 'where-to-get-help';
		});
		await expect(page.locator('#where-to-get-help')).toBeVisible();
	});
});
