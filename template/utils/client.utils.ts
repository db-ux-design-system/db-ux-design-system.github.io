import { appConfig } from '@root/app.config';

/**
 * Get the aria-current attribute for the given path.
 * @param path - The path to check against the current URL.
 * @returns The aria-current attribute value if the path matches the current URL, otherwise undefined.
 */
export function getAriaCurrent(path?: string): 'page' | undefined {
  if (typeof window === 'undefined' || !path) return undefined;

  const { basePath } = appConfig;
  const pathname = window.location.pathname.replace(/\/+$/, '');
  const fullPath = `${basePath}${path}`.replace(/\/+$/, '');
  return pathname === fullPath ? 'page' : undefined;
}
