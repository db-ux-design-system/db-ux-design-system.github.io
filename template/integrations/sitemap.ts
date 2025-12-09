import { appConfig } from '../../app.config';

/**
 * Filters out pages that are blacklisted from the sitemap.
 * @param page The page to check.
 * @returns Whether the page should be included in the sitemap.
 */
export function filterSitemapBlacklist(page: string): boolean {
  for (const blacklistedPage of appConfig.sitemapBlacklist) {
    let fullBlacklistedPage = `${appConfig.hostname}${appConfig.basePath}${blacklistedPage}`;
    // Make sure that trailing slashes match
    if (page.endsWith('/') && !fullBlacklistedPage.endsWith('/')) {
      fullBlacklistedPage = fullBlacklistedPage + '/';
    } else if (fullBlacklistedPage.endsWith('/') && !page.endsWith('/')) {
      page = page + '/';
    }
    if (fullBlacklistedPage === page) {
      return false;
    }
  }
  return true;
}
