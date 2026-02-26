import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function collectAllPaths(items: NavigationItem[]): string[] {
	const paths: string[] = [];
	for (const item of items) {
		if (item.path) paths.push(item.path.replace(/\.(mdx?|md)$/, ''));
		if (item.children) paths.push(...collectAllPaths(item.children));
	}
	return paths;
}

const response = await fetch('http://localhost:4321/api/app-navigation.json');
const appNavigation = await response.json();
const allPaths = [...collectAllPaths(appNavigation), 'demo-b2b', 'demo-b2c'];

export const waitForDBShell = async (page: Page) => {
	const dbPage = page.locator('.db-shell');
	// We wait till db-page fully loaded
	await dbPage.evaluate((element) => {
		element.style.transition = 'none';
	});
	await expect(dbPage).toHaveCSS('opacity', '1');
};

export const setScrollViewport = async (page: Page) => {
	const header = await page.waitForSelector('.db-control-panel-desktop');

	const headerHeight: number = await header.evaluate((node) => Number(node?.scrollHeight ?? 72));
	const main = await page.waitForSelector('.db-main');

	const mainHeight: number = await main.evaluate((node) => Number(node?.scrollHeight ?? 2500));

	const width = page.viewportSize()?.width ?? 0;
	const height = headerHeight + mainHeight;

	await page.setViewportSize({
		width,
		height,
	});

	expect(page.viewportSize()?.height).toEqual(height);
};

test.describe('Navigation Screenshots', () => {
	for (const path of allPaths) {
		test(`${path}`, async ({ page }) => {
			await page.goto(`/${path}`);
			await page.waitForLoadState('networkidle');
			await waitForDBShell(page);
			await setScrollViewport(page);
			await expect(page).toHaveScreenshot(`${path.replace(/\//g, '-')}.png`);

			const accessibilityScanResults = await new AxeBuilder({ page })
				.disableRules(
					// There is an a11y error inside DBShell implementation
					path.startsWith('documentation/components') || path === 'demo-b2b'
						? ['aria-required-parent', 'aria-required-children']
						: [],
				)
				.include('html')
				.analyze();

			expect(accessibilityScanResults.violations).toEqual([]);
		});
	}
});
