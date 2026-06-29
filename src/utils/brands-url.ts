/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Utility: Brands Proxy API Helper – Home Assistant Brand Images via Local API
 *
 * Integration mit Home Assistant Brands Proxy API (ab HA 2026.3)
 * https://developers.home-assistant.io/blog/2026/02/24/brands-proxy-api/
 *
 * Die API dient zum Laden von Brand-Images (Icons/Logos) über die lokale
 * Home Assistant API statt direkt vom CDN. Dies ermöglicht:
 * - Offline-Funktionalität (Bilder werden lokal gecacht)
 * - Bessere Kontrolle über externe Anfragen
 * - Unterstützung für benutzerdefinierte Brand-Assets
 *
 * Beispiel:
 *   const url = await brandsUrl(hass, 'integration', 'violet_pool', 'icon.png');
 *   const hwUrl = await brandsUrl(hass, 'hardware', 'raspberry_pi', 'logo.png');
 *
 * Erstellt von Xerolux | MIT License
 */

import type { HomeAssistant } from '../types/index';

let cachedAccessToken: string | null = null;
let tokenCacheTime = 0;
const TOKEN_CACHE_DURATION = 3600000; // 1 hour in milliseconds

export async function getBrandsAccessToken(hass: HomeAssistant): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid
  if (cachedAccessToken && now - tokenCacheTime < TOKEN_CACHE_DURATION) {
    return cachedAccessToken;
  }

  try {
    if (!hass.connection) {
      console.warn('Home Assistant connection not available for brands token');
      return '';
    }

    const token = await hass.connection.sendMessageAwaitResponse({
      type: 'brands/access_token',
    }) as { access_token: string };

    cachedAccessToken = token.access_token;
    tokenCacheTime = now;
    return cachedAccessToken;
  } catch (error) {
    console.error('Failed to get brands access token:', error);
    // Return empty string if token retrieval fails - URLs will work without token on fallback
    return '';
  }
}

export function getIntegrationBrandImageUrl(
  domain: string,
  imageName: string,
  accessToken?: string
): string {
  const baseUrl = `/api/brands/integration/${domain}/${imageName}`;

  if (accessToken) {
    return `${baseUrl}?access_token=${accessToken}`;
  }

  return baseUrl;
}

export function getHardwareBrandImageUrl(
  category: string,
  imageName: string,
  accessToken?: string
): string {
  const baseUrl = `/api/brands/hardware/${category}/${imageName}`;

  if (accessToken) {
    return `${baseUrl}?access_token=${accessToken}`;
  }

  return baseUrl;
}

export async function brandsUrl(
  hass: HomeAssistant,
  type: 'integration' | 'hardware',
  identifier: string,
  imageName: string
): Promise<string> {
  const accessToken = await getBrandsAccessToken(hass);

  if (type === 'integration') {
    return getIntegrationBrandImageUrl(identifier, imageName, accessToken);
  }

  return getHardwareBrandImageUrl(identifier, imageName, accessToken);
}

// Helper to clear token cache (useful for testing or manual cache invalidation)
export function clearBrandsCacheToken(): void {
  cachedAccessToken = null;
  tokenCacheTime = 0;
}
