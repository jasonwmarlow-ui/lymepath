import { pathways as fallbackPathways } from '../data/pathways';

const DEFAULT_PATHWAYS_URL = '/pathways.json';

function getPathwayUrl() {
  return process.env.REACT_APP_PATHWAYS_API_URL || DEFAULT_PATHWAYS_URL;
}

function normalizePayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.pathways)) {
    return payload.pathways;
  }

  throw new Error('Invalid pathways payload');
}

export async function fetchPathways() {
  const endpoint = getPathwayUrl();

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Failed to load pathways: ${response.status}`);
    }

    const payload = await response.json();

    return {
      pathways: normalizePayload(payload),
      usedFallback: false,
      endpoint,
    };
  } catch (error) {
    return {
      pathways: fallbackPathways,
      usedFallback: true,
      endpoint,
      error,
    };
  }
}
