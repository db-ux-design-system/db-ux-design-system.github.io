import { test, expect, type Page, type Locator } from '@playwright/test';
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

const pageMasks: Record<string, string> = {
	'about-us': '.avatar-viewer',
};

const getMasks = async (page: Page, path: string): Promise<Locator[]> => {
	const masks: Locator[] = [];

	if (path.startsWith('documentation')) {
		masks.push(...(await page.locator('.db-shell-sub-navigation').all()));
	}
	if (path.startsWith('documentation/components')) {
		masks.push(...(await page.locator('.guideline-example-iframe').all()));
	}
	if (pageMasks[path]) {
		masks.push(...(await page.locator(pageMasks[path]).all()));
	}
	return masks;
};

export const waitForDBShell = async (page: Page) => {
	const dbPage = page.locator('.db-shell').first();
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

const setupPage = async (page: Page, path: string) => {
	await page.goto(`/${path}`);
	await page.waitForLoadState('domcontentloaded');
	await waitForDBShell(page);
	await setScrollViewport(page);
};

test.describe('Navigation Screenshots', () => {
	for (const path of allPaths) {
		test(`${path}`, async ({ page }) => {
			await setupPage(page, path);

			if (path === 'documentation/icons') {
				// We wait till icons are loaded
				await page.waitForTimeout(10000);
			}

			const mask = await getMasks(page, path);

			await expect(page).toHaveScreenshot(`${path.replace(/\//g, '-')}.png`, {
				mask,
				timeout: 10_000,
			});
		});
	}
});

test.describe('Axe Core', () => {
	for (const path of allPaths) {
		test(`${path}`, async ({ page }) => {
			await setupPage(page, path);

			if (path === 'documentation/icons') {
				// We wait till input get id correctly
				await page.waitForTimeout(2000);
			}

			const disabledRules: string[] = [];

			// There is an a11y error inside DBShell implementation
			if (path.startsWith('documentation') || path === 'demo-b2b') {
				disabledRules.push(
					'aria-required-parent',
					'aria-required-children',
					'presentation-role-conflict',
				);
			}

			// There is an a11y error inside Googles model viewer / nested landmark setup
			if (['documentation/components/header', 'about-us'].includes(path)) {
				disabledRules.push('landmark-unique');
			}

			// Header playground embeds a nested <main> via DBShell
			if (path === 'documentation/components/header') {
				disabledRules.push('landmark-main-is-top-level', 'landmark-no-duplicate-main');
			}

			const accessibilityScanResults = await new AxeBuilder({ page })
				.disableRules([...new Set(disabledRules)])
				.include('html')
				.analyze();

			expect(accessibilityScanResults.violations).toEqual([]);
		});
	}
});
