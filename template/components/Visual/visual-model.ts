/**
 * Helpers for the 3D visuals of the `Visual` component.
 *
 * 3D visuals are the glb models in `static/assets/teasers/3d/`. They share the base name with the
 * raster teaser of the same topic (e.g. `foundation.png` and `foundation.glb`), so a page can opt
 * into a model with the same `heroVisualImage` name it already uses for the PNG. The PNG stays the
 * poster, shown until the model has loaded.
 */
import type { VisualImageName } from '@template/visuals/images';
import { appConfig } from '@config';

/** Public directory of the 3D visuals, relative to the site root. */
const VISUAL_MODEL_PATH = '/assets/teasers/3d';

/**
 * Teaser names that have a glb model in `static/assets/teasers/3d/`. Keep in sync with the files
 * in that directory. Only these names render a `<model-viewer>`; every other visual stays a PNG.
 */
export const visualModels = [
	'components',
	'design',
	'development',
	'extensions',
	'foundation',
	'getting-started',
	'patterns',
	'product-management',
	'releases',
	'resources',
	'templates',
] as const satisfies readonly VisualImageName[];

export type VisualModelName = (typeof visualModels)[number];

/**
 * Camera framing shared by all teaser models, as set in the 3D studio: rotation -20°, tilt -10°
 * (seen slightly from below), field of view 35°, looking at the model center. Shared values keep
 * the teasers consistent across pages.
 *
 * The loading poster is scaled to match this distance (.page-hero-model-poster in PageHero.css),
 * so change both together.
 *
 * All models are about 0.2 m in size. At 0.5 m distance they fill most of the viewer
 * height, which leaves room for the "Schwenken" animation. Zoom is disabled, so the distance
 * stays fixed.
 */
/** Camera rotation around the model in degrees, as set in the 3D studio. */
const CAMERA_THETA = -20;

/**
 * Rotation of the lighting environment around the vertical axis, in degrees.
 *
 * model-viewer has no attribute to rotate the environment. Instead the model is turned by this
 * angle (`orientation`) and the camera follows by the same angle. The view on the model stays the
 * same, only the light falls in from another direction.
 */
const ENVIRONMENT_ROTATION = -30;

export const visualModelCamera = {
	cameraOrbit: `${CAMERA_THETA + ENVIRONMENT_ROTATION}deg 100deg 0.6m`,
	// roll, pitch, yaw – see ENVIRONMENT_ROTATION
	orientation: `0deg 0deg ${ENVIRONMENT_ROTATION}deg`,
	cameraTarget: '0m 0m 0m',
	// model-viewer clamps the distance to an auto value per model by default. Locking min and max
	// to the same distance keeps the framing identical for every model.
	minCameraOrbit: 'auto auto 0.6m',
	maxCameraOrbit: 'auto auto 0.6m',
	fieldOfView: '35deg',
} as const;

/**
 * Time in milliseconds without interaction before the hand prompt invites users to rotate the
 * model. Rotating is possible right away.
 */
export const VISUAL_MODEL_PROMPT_DELAY = 8000;

export function isVisualModelName(name: string): name is VisualModelName {
	return (visualModels as readonly string[]).includes(name);
}

/**
 * Builds the URL of a 3D model, including the configured base path.
 * `basePath` may be `/` or carry a trailing slash, so the result is normalized to a single slash.
 */
export function resolveVisualModelSrc(name: VisualModelName): string {
	const base = (appConfig.basePath || '/').replace(/\/+$/, '');
	return `${base}${VISUAL_MODEL_PATH}/${name}.glb`;
}
