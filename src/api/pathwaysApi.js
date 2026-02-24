import { pathways as fallbackPathways } from '../data/pathways';

export async function fetchPathways() {
  try {
    const response = await fetch('/pathways.json');

    if (!response.ok) {
      throw new Error(`Failed to load pathways: ${response.status}`);
    }

    const payload = await response.json();

    if (!Array.isArray(payload)) {
      throw new Error('Invalid pathways payload');
    }

    return {
      pathways: payload,
      usedFallback: false,
    };
  } catch (error) {
    return {
      pathways: fallbackPathways,
      usedFallback: true,
      error,
    };
  }
}
