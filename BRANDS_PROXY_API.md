# Home Assistant Brands Proxy API Integration

## Überblick

The Violet Pool Card supports the Home Assistant brands proxy API (HA 2026.3+) for loading brand images through the local Home Assistant API instead of straight from the CDN.

**Referenzen:**
- [Home Assistant Brands Proxy API Blog](https://developers.home-assistant.io/blog/2026/02/24/brands-proxy-api/)
- [Home Assistant Developer Docs](https://developers.home-assistant.io/)

## Features

✅ **Local caching** - images are cached locally and available offline  
✅ **Access token management** - the token is fetched and cached automatically  
✅ **Fallback-Support** — Funktioniert auch ohne Token mit reduzierter Funktionalität  
✅ **Two API endpoints** - support for integration and hardware branding  

## API Endpoints

### Integration Brand Images
```
GET /api/brands/integration/{domain}/{image}?access_token=...
```
Für custom Integrations (z.B. `violet_pool`)

**Unterstützte Bilder:**
- `icon.png` / `icon@2x.png` — Quadratisches Icon
- `logo.png` / `logo@2x.png` — Logo (beliebiges Format)
- `dark_icon.png` / `dark_icon@2x.png` — Dark Mode Icon
- `dark_logo.png` / `dark_logo@2x.png` — Dark Mode Logo

### Hardware Brand Images
```
GET /api/brands/hardware/{category}/{image}?access_token=...
```
Für Hardware-Kategorien (z.B. `raspberry_pi`, `zigbee_adapter`)

## Use inside the card

### 1. Einfache URL-Generierung

```typescript
import { brandsUrl } from './utils/brands-url';

// Integration Brand
const iconUrl = await brandsUrl(hass, 'integration', 'violet_pool', 'icon.png');

// Hardware Brand
const logoUrl = await brandsUrl(hass, 'hardware', 'raspberry_pi', 'logo.png');
```

### 2. In Komponenten

```typescript
import { brandsUrl } from '../utils/brands-url';

export class MyComponent extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;

  protected async render(): Promise<TemplateResult> {
    const brandIcon = await brandsUrl(this.hass, 'integration', 'violet_pool', 'icon.png');
    
    return html`
      <img src="${brandIcon}" alt="Brand Icon" />
    `;
  }
}
```

### 3. Mit Fehlerbehandlung

```typescript
try {
  const url = await brandsUrl(hass, 'integration', 'violet_pool', 'icon.png');
  // Nutze url...
} catch (error) {
  console.error('Brands API unavailable:', error);
  // Fallback verwenden
}
```

## Implementierungsdetails

### Access-Token Management

The token is fetched automatically and cached for one hour:

```typescript
// First call: fetches the token
const url1 = await brandsUrl(hass, 'integration', 'violet_pool', 'icon.png');

// Bei wiederholten Aufrufen: Nutzt gecachtes Token
const url2 = await brandsUrl(hass, 'integration', 'violet_pool', 'logo.png');

// Token-Cache leeren (falls nötig)
clearBrandsCacheToken();
```

### WebSocket-Befehl

Internally this WebSocket message is used:

```json
{
  "type": "brands/access_token"
}
```

The response carries the access token:

```json
{
  "access_token": "..."
}
```

## Best Practices

1. **Token reuse** - the token is cached automatically, no manual token requests needed
2. **Error handling** - the API returns URLs without a token when there is no connection
3. **Image formats** - use the `@2x` variants for high-resolution displays
4. **Dark mode** - use `dark_icon.png` / `dark_logo.png` for dark mode support

## Dateien

- `src/utils/brands-url.ts` - main implementation of the brands proxy API
- `src/utils/card-brand.ts` - card brand assets, local and proxy support
- `src/types/index.ts` — HomeAssistant-Type mit connection Property
- `brand/` - local brand assets for the Violet Pool Card
  - `icon.png` / `icon@2x.png`
  - `logo.png` / `logo@2x.png`
  - `dark_icon.png` / `dark_icon@2x.png`
  - `dark_logo.png` / `dark_logo@2x.png`

## Kompatibilität

- **Home Assistant 2026.3+** - required for the brands proxy API
- **Fallback-Mode** — URLs funktionieren auch ohne Token (eingeschränkt)

## Fehlerbehandlung

On error the function degrades gracefully:

```typescript
// When no connection is available
const url = await brandsUrl(hass, 'integration', 'violet_pool', 'icon.png');
// Gibt: `/api/brands/integration/violet_pool/icon.png` (ohne Token)

// Wenn WebSocket-Befehl fehlschlägt
// Gibt: `/api/brands/integration/violet_pool/icon.png` (ohne Token)
```
