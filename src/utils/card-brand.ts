/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Utility: Card Brand Assets – Local and Proxy API Support
 *
 * Verwaltet Brand-Assets der Violet Pool Card:
 * - Lokale Assets aus /brand Verzeichnis
 * - Brands Proxy API für Integration-Icons (HA 2026.3+)
 *
 * Erstellt von Xerolux | MIT License
 */

import type { HomeAssistant } from '../types/index';
import { brandsUrl } from './brands-url';

export interface BrandAssets {
  icon: string;
  logo: string;
  iconDark?: string;
  logoDark?: string;
  icon2x?: string;
  logo2x?: string;
}

const LOCAL_BRAND_PATH = '/hacsfiles/violet-pool-card';

export const cardBrandAssets: BrandAssets = {
  icon: `${LOCAL_BRAND_PATH}/brand/icon.png`,
  logo: `${LOCAL_BRAND_PATH}/brand/logo.png`,
  iconDark: `${LOCAL_BRAND_PATH}/brand/dark_icon.png`,
  logoDark: `${LOCAL_BRAND_PATH}/brand/dark_logo.png`,
  icon2x: `${LOCAL_BRAND_PATH}/brand/icon@2x.png`,
  logo2x: `${LOCAL_BRAND_PATH}/brand/logo@2x.png`,
};

export async function getCardBrandUrl(
  hass: HomeAssistant,
  asset: keyof BrandAssets,
  useProxy = false
): Promise<string> {
  if (!useProxy) {
    return cardBrandAssets[asset];
  }

  // Try to load from Brands Proxy API (requires violet_pool integration)
  try {
    const imageName = getImageNameForAsset(asset);
    if (imageName) {
      return await brandsUrl(hass, 'integration', 'violet_pool', imageName);
    }
  } catch (error) {
    console.warn('Failed to load card brand from Brands Proxy API, falling back to local:', error);
  }

  return cardBrandAssets[asset];
}

function getImageNameForAsset(asset: keyof BrandAssets): string | null {
  const assetMap: Record<keyof BrandAssets, string> = {
    icon: 'icon.png',
    logo: 'logo.png',
    iconDark: 'dark_icon.png',
    logoDark: 'dark_logo.png',
    icon2x: 'icon@2x.png',
    logo2x: 'logo@2x.png',
  };

  return assetMap[asset];
}
