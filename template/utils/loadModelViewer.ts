/**
 * Dynamically loads the model-viewer library from local node_modules
 * This ensures the library is only loaded on pages that actually use it
 * and avoids external CDN dependencies
 */

let loadingPromise: Promise<void> | null = null;

export async function loadModelViewer(): Promise<void> {
  // If already loaded or currently loading, return the existing promise
  if (loadingPromise) {
    return loadingPromise;
  }

  // Create and store the loading promise
  loadingPromise = (async () => {
    try {
      // Dynamically import the model-viewer module
      await import('@google/model-viewer');
    } catch (error) {
      console.error('Failed to load model-viewer:', error);
      // Reset the promise so it can be retried
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
}
