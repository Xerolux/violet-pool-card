# Violet Pool Card

<div align="center">

[![GitHub Release](https://img.shields.io/github/release/Xerolux/VIOLET_CARD_QUICK.svg?style=flat-square)](https://github.com/Xerolux/VIOLET_CARD_QUICK/releases)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square)](https://github.com/hacs/integration)
[![License](https://img.shields.io/github/license/Xerolux/VIOLET_CARD_QUICK.svg?style=flat-square)](LICENSE)
[![Validate](https://github.com/Xerolux/VIOLET_CARD_QUICK/actions/workflows/validate.yml/badge.svg)](https://github.com/Xerolux/VIOLET_CARD_QUICK/actions/workflows/validate.yml)

A premium Lovelace card for the [Violet Pool Controller](https://github.com/Xerolux/violet-hass) integration in Home Assistant.

**[Deutsche Version weiter unten](#deutsche-version)**

</div>

---

## Screenshots

| Pump | Heater | Solar | Dosing |
|------|--------|-------|--------|
| ![Pump](screenshots/pump_card.png) | ![Heater](screenshots/heater_card.png) | ![Solar](screenshots/solar_card.png) | ![Dosing](screenshots/dosing_card.png) |

| Overview | Compact | System (Fullscreen) |
|----------|---------|---------------------|
| ![Overview](screenshots/overview_card.png) | ![Compact](screenshots/compact_card.png) | ![System](screenshots/example_system_fullscreen.png) |

---

## Features

- **7 card types** - Pump, Heater, Solar, Dosing, Overview, Compact, System
- **Animated icons** - rotating pump, pulsing heater/dosing indicators
- **Smart auto-detection** - entity types, dosing chemicals, sensor values
- **Visual editor** - full GUI configuration, no YAML needed
- **Touch-optimized** - sliders and quick-action buttons
- **Multiple sizes** - small, medium, large, fullscreen
- **Theme support** - luxury, modern, minimalist, glass, neon, premium
- **Dynamic entity prefix** - supports multiple Violet controllers

---

## Installation

### HACS (Recommended)

1. Open **HACS** > **Frontend**
2. Click the three dots (top right) > **Custom repositories**
3. Add `https://github.com/Xerolux/VIOLET_CARD_QUICK` as **Dashboard**
4. Install **Violet Pool Card**
5. Restart Home Assistant

### Manual

1. Download `violet-pool-card.js` from the [latest release](https://github.com/Xerolux/VIOLET_CARD_QUICK/releases)
2. Copy to `config/www/violet-pool-card.js`
3. Add the resource:

```yaml
lovelace:
  resources:
    - url: /local/violet-pool-card.js
      type: module
```

4. Restart Home Assistant

---

## Quick Start

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
```

That's it. The card auto-detects related entities based on your Violet Pool Controller setup.

---

## Configuration

### Required

| Option | Type | Description |
|--------|------|-------------|
| `type` | string | `custom:violet-pool-card` |
| `card_type` | string | `pump` \| `heater` \| `solar` \| `dosing` \| `overview` \| `compact` \| `system` |
| `entity` | string | Entity ID (not required for `overview` and `system`) |

### Optional

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | string | Auto | Custom card name |
| `icon` | string | Auto | Custom MDI icon |
| `entity_prefix` | string | `violet_pool` | Entity prefix for auto-discovery |
| `size` | string | `medium` | `small` \| `medium` \| `large` \| `fullscreen` |
| `theme` | string | `luxury` | `luxury` \| `modern` \| `minimalist` \| `glass` \| `neon` \| `premium` |
| `animation` | string | `smooth` | `none` \| `subtle` \| `smooth` \| `energetic` |
| `show_state` | boolean | `true` | Show status badge |
| `show_detail_status` | boolean | `true` | Show detailed status info |
| `show_controls` | boolean | `true` | Show sliders and buttons |
| `show_runtime` | boolean | `false` | Show pump runtime (pump only) |
| `show_history` | boolean | `false` | Show dosing history (dosing only) |
| `dosing_type` | string | Auto | `chlorine` \| `ph_minus` \| `ph_plus` \| `flocculant` |

---

## Card Types

### Pump
Speed control with OFF/ECO/Normal/Boost modes, RPM display, animated rotating icon, and optional runtime counter.

### Heater
Temperature slider (18-35 C, 0.5 steps), current vs. target display, outside temperature monitoring with frost warnings.

### Solar
Pool vs. absorber temperature with color-coded delta hints (red = too cold, yellow = possible, green = ideal). Target temperature control.

### Dosing
Auto-detects chemical type (chlorine, pH+/-, flocculant). Shows current/target values with proper formatting (ORP: mV, pH: decimal). Dismissable warning chips for blockage reasons.

### Overview
Water chemistry dashboard with traffic-light indicators for temperature, pH (7.0-7.4), and ORP (650-750 mV). Active device list and warning section.

### Compact
Single-line display per entity. Auto-detected icons, status badge, and value display. Ideal for sidebar dashboards.

### System
Full-screen dashboard combining all controls in a responsive grid layout. Aggregates pump, heater, solar, dosing, and overview.

---

## Example: Full Dashboard

```yaml
type: vertical-stack
cards:
  - type: custom:violet-pool-card
    card_type: overview
    name: Pool Status

  - type: custom:violet-pool-card
    entity: switch.violet_pool_pump
    card_type: pump
    show_runtime: true

  - type: custom:violet-pool-card
    entity: climate.violet_pool_heater
    card_type: heater

  - type: custom:violet-pool-card
    entity: climate.violet_pool_solar
    card_type: solar

  - type: custom:violet-pool-card
    entity: switch.violet_pool_dos_1_cl
    card_type: dosing
    dosing_type: chlorine
    show_history: true
```

See [VIOLET_CARD_EXAMPLES.yaml](VIOLET_CARD_EXAMPLES.yaml) for more examples.

---

## Development

```bash
git clone https://github.com/Xerolux/VIOLET_CARD_QUICK.git
cd VIOLET_CARD_QUICK
npm install
npm run build        # Production build
npm run watch        # Dev mode with auto-rebuild
npm run serve        # Dev server at localhost:5000
```

---

## Support

- [GitHub Issues](https://github.com/Xerolux/VIOLET_CARD_QUICK/issues) - Bug reports
- [GitHub Discussions](https://github.com/Xerolux/VIOLET_CARD_QUICK/discussions) - Questions
- [Violet Pool Controller](https://github.com/Xerolux/violet-hass) - Main integration

<div align="center">

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-donate-yellow.svg?style=for-the-badge&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/xerolux)
[![PayPal](https://img.shields.io/badge/PayPal-donate-blue.svg?style=for-the-badge&logo=paypal)](https://paypal.me/xerolux)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-donate-red.svg?style=for-the-badge&logo=ko-fi)](https://ko-fi.com/xerolux)

</div>

---

## Contributing

1. Fork the repository
2. Create your branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'Add my feature'`)
4. Push (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

MIT - see [LICENSE](LICENSE)

---

## Credits

Built with [Lit](https://lit.dev/) by [Xerolux](https://github.com/Xerolux)

---

<a id="deutsche-version"></a>

## Deutsche Version

### Installation (HACS)

1. **HACS** > **Frontend** offnen
2. Drei Punkte (oben rechts) > **Eigene Repositories**
3. `https://github.com/Xerolux/VIOLET_CARD_QUICK` als **Dashboard** hinzufugen
4. **Violet Pool Card** installieren
5. Home Assistant neustarten

### Schnellstart

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
```

Die Karte erkennt automatisch zugehorige Entities basierend auf deinem Violet Pool Controller Setup.

### Kartentypen

| Typ | Beschreibung |
|-----|-------------|
| `pump` | Pumpensteuerung mit Geschwindigkeit, RPM und Laufzeit |
| `heater` | Temperaturregelung mit Aussentemperatur-Uberwachung |
| `solar` | Solar-Absorber mit Temperatur-Delta und Farbhinweisen |
| `dosing` | Dosierung mit Auto-Erkennung (Chlor, pH, Flockung) |
| `overview` | Wasserchemie-Dashboard mit Ampelsystem |
| `compact` | Einzeilige Anzeige fur Dashboard-Ubersicht |
| `system` | Vollbild-Dashboard mit allen Kontrollen |

Vollstandige Konfigurationsoptionen: siehe [englische Dokumentation oben](#configuration).

### Hilfe

- [GitHub Issues](https://github.com/Xerolux/VIOLET_CARD_QUICK/issues) - Fehlerberichte
- [GitHub Discussions](https://github.com/Xerolux/VIOLET_CARD_QUICK/discussions) - Fragen
- [Violet Pool Controller](https://github.com/Xerolux/violet-hass) - Haupt-Integration
