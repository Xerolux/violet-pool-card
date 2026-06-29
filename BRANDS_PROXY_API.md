# Home Assistant Brands Proxy API Integration

## Überblick

Die Violet Pool Card unterstützt die Home Assistant Brands Proxy API (ab HA 2026.3) für das Laden von Brand-Images über die lokale Home Assistant API statt direkt vom CDN.

**Referenzen:**
- [Home Assistant Brands Proxy API Blog](https://developers.home-assistant.io/blog/2026/02/24/brands-proxy-api/)
- [Home Assistant Developer Docs](https://developers.home-assistant.io/)

## Features

✅ **Lokales Caching** — Bilder werden lokal gecacht und sind offline verfügbar  
✅ **Access-Token Management** — Automatisches Holen und Cachen des Zugriff-Tokens  
✅ **Fallback-Support** — Funktioniert auch ohne Token mit reduzierter Funktionalität  
✅ **Zwei API-Endpoints** — Support für Integration- und Hardware-Branding  

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

## Verwendung in der Card

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
  console.error('Brands API nicht verfügbar:', error);
  // Fallback verwenden
}
```

## Implementierungsdetails

### Access-Token Management

Das Token wird automatisch geholt und für 1 Stunde gecacht:

```typescript
// Beim ersten Aufruf: Holt das Token
const url1 = await brandsUrl(hass, 'integration', 'violet_pool', 'icon.png');

// Bei wiederholten Aufrufen: Nutzt gecachtes Token
const url2 = await brandsUrl(hass, 'integration', 'violet_pool', 'logo.png');

// Token-Cache leeren (falls nötig)
clearBrandsCacheToken();
```

### WebSocket-Befehl

Intern wird folgendes WebSocket-Message verwendet:

```json
{
  "type": "brands/access_token"
}
```

Die Antwort enthält das Access-Token:

```json
{
  "access_token": "..."
}
```

## Best Practices

1. **Token Reuse** — Das Token wird automatisch gecacht, keine manuellen Token-Anfragen nötig
2. **Fehlerbehandlung** — Die API gibt URLs ohne Token zurück, wenn keine Verbindung existiert
3. **Image-Formate** — Nutze `@2x` Varianten für hochauflösende Displays
4. **Dark Mode** — Nutze `dark_icon.png` / `dark_logo.png` für Dark Mode Support

## Dateien

- `src/utils/brands-url.ts` — Hauptimplementierung der Brands Proxy API
- `src/types/index.ts` — HomeAssistant-Type mit connection Property
- `brands/` — Lokale Brand-Assets für die Violet Pool Card
  - `icon.png` / `icon@2x.png`
  - `logo.png` / `logo@2x.png`
  - `dark_icon.png` / `dark_icon@2x.png`
  - `dark_logo.png` / `dark_logo@2x.png`

## Kompatibilität

- **Home Assistant 2026.3+** — Erforderlich für Brands Proxy API
- **Fallback-Mode** — URLs funktionieren auch ohne Token (eingeschränkt)

## Fehlerbehandlung

Bei Fehlern wird die Funktion graceful degradieren:

```typescript
// Wenn connection nicht verfügbar
const url = await brandsUrl(hass, 'integration', 'violet_pool', 'icon.png');
// Gibt: `/api/brands/integration/violet_pool/icon.png` (ohne Token)

// Wenn WebSocket-Befehl fehlschlägt
// Gibt: `/api/brands/integration/violet_pool/icon.png` (ohne Token)
```
