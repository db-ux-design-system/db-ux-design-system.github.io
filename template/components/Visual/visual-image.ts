/**
 * Helpers for the raster visuals of the `Visual` component.
 *
 * Raster visuals are the PNGs in `static/assets/teasers/`. Unlike the inline SVGs they are served
 * as static files, so the component renders an `<img>` and only the name is registered. Colors and
 * stroke width can't be controlled – a PNG is expected to work in Light and Dark Mode as it is.
 */
import { visualImages, type VisualImageName } from '@template/visuals/images';
import { appConfig } from '@config';

export type { VisualImageName };
export { visualImages };

/** Public directory of the raster visuals, relative to the site root. */
const VISUAL_IMAGE_PATH = '/assets/teasers';

/** Returns the registered names, used for error messages. */
export function getVisualImageNames(): string[] {
	return [...visualImages];
}

export function isVisualImageName(name: string): name is VisualImageName {
	return (visualImages as readonly string[]).includes(name);
}

/**
 * Builds the URL of a raster visual, including the configured base path.
 * `basePath` may be `/` or carry a trailing slash, so the result is normalized to a single slash.
 */
export function resolveVisualImageSrc(name: VisualImageName): string {
	const base = (appConfig.basePath || '/').replace(/\/+$/, '');
	return `${base}${VISUAL_IMAGE_PATH}/${name}.png`;
}
