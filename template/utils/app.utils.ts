import type { AstroGlobal } from "astro";

/**
 * Attempts to retrieve the current pathname from the `astro` or the `window` global.
 * @param astro The Astro global object.
 * @returns The current pathname.
 */
export function getCurrentPathname(astro?: AstroGlobal): string {
  if (astro && astro.url) {
    return astro.url.pathname.replace(/\/+$/, "");
  } else if (window && window.location) {
    return window.location.pathname.replace(/\/+$/, "");
  } else {
    throw new Error("Unable to retrieve current path.");
  }
}

/**
 * Wait for a delay async
 * @param fn
 * @param ms
 */
export const delay = (fn: () => void, ms: number) =>
  new Promise(() => setTimeout(fn, ms));

/**
 * Get a start and end index of a content string based on a search term
 */
export const getMarkedContent = (
  content: string,
  term: string,
  range: number = 50,
): { start: number; termIndex: number; end: number } => {
  let start = 0;
  let end = content.length - 1;

  const termIndex = content.toLowerCase().indexOf(term.toLowerCase());
  if (termIndex - range > 0) {
    start = termIndex - range;
  }
  if (termIndex + range < end) {
    end = termIndex + range;
  }

  return { start, termIndex, end };
};
