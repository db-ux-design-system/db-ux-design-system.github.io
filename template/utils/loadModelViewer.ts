/**
 * Dynamically loads the model-viewer library from local node_modules
 * This ensures the library is only loaded on pages that actually use it
 * and avoids external CDN dependencies
 */

let isLoading = false;
let isLoaded = false;

export async function loadModelViewer(): Promise<void> {
  // If already loaded, return immediately
  if (isLoaded) {
    return;
  }

  // If currently loading, wait for it to finish
  if (isLoading) {
    return new Promise((resolve) => {
      const checkLoaded = setInterval(() => {
        if (isLoaded) {
          clearInterval(checkLoaded);
          resolve();
        }
      }, 50);
    });
  }

  isLoading = true;

  try {
    // Dynamically import the model-viewer module
    await import('@google/model-viewer');
    isLoaded = true;
  } catch (error) {
    console.error('Failed to load model-viewer:', error);
    throw error;
  } finally {
    isLoading = false;
  }
}
