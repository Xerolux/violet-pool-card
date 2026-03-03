# Violet Pool Card

<div align="center">

[![GitHub Release](https://img.shields.io/github/release/Xerolux/VIOLET_CARD_QUICK.svg?style=flat-square)](https://github.com/Xerolux/VIOLET_CARD_QUICK/releases)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square)](https://github.com/hacs/integration)
[![License](https://img.shields.io/github/license/Xerolux/VIOLET_CARD_QUICK.svg?style=flat-square)](LICENSE)
[![Validate](https://github.com/Xerolux/VIOLET_CARD_QUICK/actions/workflows/validate.yml/badge.svg)](https://github.com/Xerolux/VIOLET_CARD_QUICK/actions/workflows/validate.yml)

A premium Lovelace card for the [Violet Pool Controller](https://github.com/Xerolux/violet-hass) Integration in Home Assistant.

**[English version below](#english-version)**

</div>

---

## Funktionen

### 🎨 Design & Themes
- **6 Premium-Themes** — Luxury (Glassmorphism), Modern, Minimalist, Glass, Neon, Premium
- **8 vorgesetzte Farbkombinationen** — Apple, Dark, Luxury, Modern, Minimalist, Glass, Neon, Premium
- **4 Größen-Varianten** — Small, Medium, Large, Fullscreen
- **3 Animations-Stufen** — None, Subtle, Smooth, Energetic
- **Dark/Light Mode Support** — Automatische Anpassung ans Home Assistant Theme
- **Responsive Design** — Optimiert für Desktop, Tablet, Smartphone

### 🎴 Card Types (18 Total)

#### Standard Equipment Cards (13)
1. **Pumpe** (`pump`) — Geschwindigkeitssteuerung mit ECO/Normal/Boost, RPM-Anzeige, animiertes Icon
2. **Heizung** (`heater`) — Temperaturregler 18–35°C, Ist/Soll-Vergleich, Frostwarnungen
3. **Solar** (`solar`) — Pool- vs. Absorbertemperatur, Delta-Analyse, Zieltemperatur-Steuerung
4. **Dosierung** (`dosing`) — Chlor/pH+/pH-/Flockungsmittel mit animiertem Tropfen-SVG
5. **Abdeckung** (`cover`) — Poolabdeckung mit Positionsregler und Steuerung
6. **Licht** (`light`) — RGB-Farbwähler, Helligkeitsregler, animierte Leuchteffekte
7. **Filter** (`filter`) — Druckmessung mit farbcodierter Warnung (Grün/Gelb/Rot)
8. **Chemie** (`chemical`) — pH/ORP/Temperatur mit Empfehlungen
9. **Sensor** (`sensor`) — Universale Sensoranzeige mit Einheiten
10. **Übersicht** (`overview`) — Dashboard mit allen Geräten und Messwerten
11. **Details** (`details`) — Detaillierte Entity-Liste mit Toggle-Steuerung
12. **Kompakt** (`compact`) — Platzsparendes Layout mit Icons und Status
13. **System** (`system`) — Vollbildansicht mit Mehrkanal-Übersicht

#### New Analysis & Monitoring Cards (5)
14. **Statistiken** (`statistics`) — Trendanalyse mit Linien-Charts und historische Daten
15. **Wetter** (`weather`) — Aktuelle Wetterbedingungen und Pool-Auswirkungen
16. **Wartung** (`maintenance`) — Service-Zeitplan mit Aufgabenverfolgung
17. **Benachrichtigungen** (`alerts`) — Aktive Alarme und Notifications mit Severity-Levels
18. **Vergleich** (`comparison`) — Ist-Wert vs. Sollwert mit Delta-Anzeige

### 🎬 Animations & Visualizations
- **SVG-Animationen** für Pumpe (rotierend), Heizung (flackernd), Solar (atmend), Abdeckung (Motor), Licht (glühend)
- **Neue Animationen** — Animierter Tropfen (Dosierung), Druckmesser-Nadel (Chemie), Filter-Gauge (Druck)
- **Charts & Graphs** — Linien-Charts für Trends, Druckmesser mit Echtzeitanzeige
- **Loading-Skelette** — Placeholder-Animation beim Laden von Entitäten
- **Pulse-Animationen** — Pulserende Icons für aktive/kritische Zustände

### 📊 Features & Funktionen
- **25+ Keyframe-Animationen** — Dropdown, Gauge-Fill, Alert-Pulse, Shimmer, Rainbow-Border, etc.
- **Automatische Entity-Erkennung** — Basierend auf Entity-Prefix und Namen
- **Tooltip-System** — Kontextabhängige Hilfetexte (Deutsch/Englisch)
- **Dynamischer Entity-Prefix** — Unterstützung mehrerer Violet Controller
- **Touch-optimiert** — 44px+ Mindesthöhe für alle Elemente
- **Visueller Editor** — Vollständige GUI-Konfiguration ohne YAML
- **Mobile-First** — Optimiert für alle Bildschirmgrößen
- **Barrierefreiheit** — WCAG 2.1 AA Compliance

### 💾 Performance
- **Memoization** — Optimierte Berechnung teurer Operationen
- **GPU-Optimiert** — will-change Hints für Animations
- **Kleine Bundle-Größe** — Minifizierte und optimierte Ausgabe
- **Memory-Leak-Fixes** — Proper Event/Timer Cleanup

---

## Installation

### Voraussetzung

Die [Violet Pool Controller](https://github.com/Xerolux/violet-hass) Integration muss in Home Assistant installiert und eingerichtet sein.

### HACS (Empfohlen)

1. **HACS** öffnen → **Frontend**
2. Drei-Punkte-Menü → **Eigene Repositories**
3. Repository-URL: `https://github.com/Xerolux/VIOLET_CARD_QUICK`
4. Kategorie **Dashboard** → **Hinzufügen**
5. **Violet Pool Card** installieren
6. Home Assistant **neustarten**

### Manuell

1. `violet-pool-card.js` herunterladen
2. Nach `config/www/violet-pool-card.js` kopieren
3. In Home Assistant hinzufügen:

```yaml
lovelace:
  resources:
    - url: /local/violet-pool-card.js
      type: module
```

4. Home Assistant **neustarten**

---

## Quick Start

### Basis-Konfiguration

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
```

Die Karte erkennt automatisch zugehörige Entities!

### Mit Anpassungen

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
name: "Pool Pumpe"
icon: mdi:pump
theme: luxury
size: medium
animation: smooth
accent_color: "#2196F3"
show_state: true
show_detail_status: true
show_controls: true
show_runtime: false
show_history: false
```

---

## Kartentypen - Konfiguration

### Standard Cards

#### Pumpe (`pump`)
```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
show_runtime: true  # Zeigt Betriebsstunden
```

**Funktionen:**
- Geschwindigkeitssegmente (OFF/ECO/Normal/Boost)
- Animiertes rotierendes Impeller-Icon
- RPM-Anzeige
- Optionaler Laufzähler

#### Heizung (`heater`)
```yaml
type: custom:violet-pool-card
entity: climate.violet_pool_heater
card_type: heater
```

**Funktionen:**
- Temperaturregler 18–35°C in 0,5° Schritten
- Ist- vs. Zieltemperatur
- Frostwarnungen
- Pulsierendes Icon bei Betrieb

#### Solar (`solar`)
```yaml
type: custom:violet-pool-card
entity: climate.violet_pool_solar
card_type: solar
```

**Funktionen:**
- Pool- vs. Absorbertemperatur-Vergleich
- Delta-Analyse (Rot/Gelb/Grün)
- Zieltemperatur-Steuerung
- Atmende Kreis-Animation

#### Dosierung (`dosing`)
```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_dos_1_cl
card_type: dosing
dosing_type: chlorine  # oder: ph_minus, ph_plus, flocculant
show_history: true
```

**Funktionen:**
- Automatische Typ-Erkennung
- Animiertes Tropfen-SVG
- Ist/Soll-Vergleich mit korrekter Formatierung
- Schnelle Dosier-Aktionen (30s, 60s)

#### Abdeckung (`cover`)
```yaml
type: custom:violet-pool-card
entity: cover.violet_pool_cover
card_type: cover
```

**Funktionen:**
- Abdeckungsposition (0–100%)
- Animiertes Motor-Icon
- Open/Stop/Close Steuerung
- Bewegungsstatus

#### Licht (`light`)
```yaml
type: custom:violet-pool-card
entity: light.violet_pool_light
card_type: light
```

**Funktionen:**
- An/Aus Schalter
- Helligkeitsregler
- RGB-Farbwähler
- Animierte Leuchteffekte
- Farbvoreinstellungen

#### Filter (`filter`)
```yaml
type: custom:violet-pool-card
entity: sensor.violet_pool_filter_pressure
card_type: filter
filter_entity: switch.violet_pool_filter
backwash_entity: switch.violet_pool_backwash
```

**Funktionen:**
- Drucküberwachung mit Gauge
- Farbcodierte Zonen (Grün/Gelb/Rot)
- Rückspüle-Steuerung
- Wartungshinweise

#### Chemie (`chemical`)
```yaml
type: custom:violet-pool-card
card_type: chemical
pool_temp_entity: sensor.violet_pool_temperature
ph_value_entity: sensor.violet_pool_ph
orp_value_entity: sensor.violet_pool_orp
target_ph_entity: number.violet_pool_target_ph
target_orp_entity: number.violet_pool_target_orp
```

**Funktionen:**
- pH/ORP/Temperatur-Überwachung
- Zielbereich-Vergleich
- Farbcodierte Status
- Automatische Empfehlungen

#### Sensor (`sensor`)
```yaml
type: custom:violet-pool-card
entity: sensor.violet_pool_temperature
card_type: sensor
```

**Funktionen:**
- Universale Sensoranzeige
- Unit-Erkennung
- Typ-spezifische Icons
- Geräteklassen-Unterstützung

#### Übersicht (`overview`)
```yaml
type: custom:violet-pool-card
card_type: overview
```

**Funktionen:**
- Gesamtstatus aller Geräte
- Chemie-Schnellübersicht
- Aktivgeräte-Anzeige
- Warnsystem

#### Details (`details`)
```yaml
type: custom:violet-pool-card
card_type: details
entities:
  - switch.violet_pool_pump
  - climate.violet_pool_heater
  - sensor.violet_pool_temperature
```

**Funktionen:**
- Detaillierte Entity-Liste
- Toggle-Steuerung
- States mit Units
- More-Info Dialog

#### Kompakt (`compact`)
```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: compact
```

**Funktionen:**
- Minimales Layout
- Inline-Status
- Schnelle Aktionen
- Responsive

#### System (`system`)
```yaml
type: custom:violet-pool-card
card_type: system
size: fullscreen
```

**Funktionen:**
- Mehrkanal-Grid-Layout
- Alle Geräte und Sensoren
- Vollbildansicht
- Optimiert für Tablets

### New Analytics Cards

#### Statistiken (`statistics`)
```yaml
type: custom:violet-pool-card
entity: sensor.violet_pool_temperature
card_type: statistics
```

**Funktionen:**
- Trendanalyse mit Charts
- Historische Daten (letzte 12 Messwerte)
- Gain/Loss-Anzeige
- Sparkline-Visualization

#### Wetter (`weather`)
```yaml
type: custom:violet-pool-card
entity: weather.openweathermap
card_type: weather
```

**Funktionen:**
- Aktuelle Wetterdaten
- Pool-Auswirkungen-Warnung
- Luftfeuchte/Temperatur
- Regenprognose

#### Wartung (`maintenance`)
```yaml
type: custom:violet-pool-card
card_type: maintenance
```

**Funktionen:**
- Service-Kalender
- Task-Tracking
- Fälligkeitsindikatoren
- Maintenance-Logging

#### Benachrichtigungen (`alerts`)
```yaml
type: custom:violet-pool-card
card_type: alerts
```

**Funktionen:**
- Aktive Alarme-Liste
- Severity-Levels (Info/Warning/Error)
- Zeitstempel
- Dismissible Alerts

#### Vergleich (`comparison`)
```yaml
type: custom:violet-pool-card
entity: sensor.violet_pool_temperature
card_type: comparison
target_entity: number.violet_pool_target_temp
```

**Funktionen:**
- Ist vs. Soll
- Delta-Berechnung (Wert + %)
- Visual Diff
- Trend-Indikatoren

---

## Konfigurationsoptionen

### Allgemein

| Option | Wert | Standard | Beschreibung |
|--------|------|----------|-------------|
| `type` | `custom:violet-pool-card` | — | Card-Typ |
| `card_type` | String | — | Kartentyp (pump, heater, solar, etc.) |
| `entity` | String | — | Primary Entity-ID |
| `entities` | Array | — | Multiple Entities (für Details/System) |
| `name` | String | Auto | Karten-Titel |
| `icon` | String | Auto | MD-Icon |

### Design & Styling

| Option | Wert | Standard | Beschreibung |
|--------|------|----------|-------------|
| `theme` | apple/dark/luxury/modern/minimalist/glass/neon/premium | apple | Design-Theme |
| `size` | small/medium/large/fullscreen | medium | Karten-Größe |
| `animation` | none/subtle/smooth/energetic | smooth | Animations-Stil |
| `accent_color` | HEX | Auto | Akzentfarbe |
| `icon_color` | HEX | Auto | Icon-Farbe |
| `blur_intensity` | 0-100 | 10 | Backdrop-Blur |

### Display-Optionen

| Option | Wert | Standard | Beschreibung |
|--------|------|----------|-------------|
| `show_state` | boolean | true | Status-Badge anzeigen |
| `show_detail_status` | boolean | true | Detailstatus anzeigen |
| `show_controls` | boolean | true | Control-Buttons anzeigen |
| `show_runtime` | boolean | false | Betriebsstunden anzeigen |
| `show_history` | boolean | false | Historie anzeigen |

### Entity-Mappings

```yaml
# Manuelle Entity-Zuordnung (optional)
entity_prefix: violet_pool           # Basis-Prefix
pump_entity: switch.my_pump          # Pumpen-Entity
heater_entity: climate.my_heater     # Heizer-Entity
solar_entity: climate.my_solar       # Solar-Entity
chlorine_entity: switch.my_chlorine  # Chlor-Dosier
ph_minus_entity: switch.my_phm       # pH- Dosier
ph_plus_entity: switch.my_php        # pH+ Dosier
pool_temp_entity: sensor.my_temp     # Pool-Temp
ph_value_entity: sensor.my_ph        # pH-Wert
orp_value_entity: sensor.my_orp      # ORP-Wert
target_orp_entity: number.my_orp     # ORP-Ziel
target_ph_entity: number.my_ph       # pH-Ziel
cover_entity: cover.my_cover         # Abdeckung
light_entity: light.my_light         # Licht
filter_entity: switch.my_filter      # Filter
filter_pressure_entity: sensor.my_fp # Filter-Druck
backwash_entity: switch.my_backwash  # Rückspüle
```

---

## Beispiele

### Vollständiges Pumpen-Setup

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
name: "Pool Pumpe"
icon: mdi:pump
theme: luxury
size: large
animation: smooth
accent_color: "#2196F3"
show_state: true
show_detail_status: true
show_controls: true
show_runtime: true
```

### Dosierungs-Dashboard

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_dos_1_cl
card_type: dosing
name: "Chlor Dosierung"
dosing_type: chlorine
theme: modern
size: medium
animation: energetic
show_history: true
show_controls: true
```

### System-Vollbild

```yaml
type: custom:violet-pool-card
card_type: system
theme: luxury
size: fullscreen
animation: smooth
show_runtime: true
show_history: true
```

### Multi-Sensor Grid

```yaml
type: custom:violet-pool-card
card_type: overview
name: "Poolstatus"
theme: glass
size: large
show_detail_status: true
```

---

## Troubleshooting

### Entity wird nicht erkannt
1. Entity-ID in HA überprüfen (Einstellungen → Geräte & Services)
2. Manuelle Entity-Zuordnung in Konfiguration verwenden
3. Entity-Prefix anpassen

### Animationen flüssig nicht
- `animation: subtle` oder `animation: none` versuchen
- GPU-Beschleunigung in Browser aktivieren
- Tablet-Hardware überprüfen

### Karte wird nicht angezeigt
1. Home Assistant **neustarten**
2. Browser-Cache leeren
3. Konsole auf Fehler überprüfen (F12 → Console)

---

## Technische Details

### Performance
- **Bundle-Size:** ~45KB (minified+gzipped)
- **Runtime:** <5ms für Re-Render
- **Memory:** ~2MB pro Karte-Instanz
- **GPU-Optimiert:** will-change hints für Animationen

### Browser-Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile: iOS Safari 14+, Chrome Mobile 90+

### Accessibility
- **WCAG 2.1 AA** compliant
- Keyboard-Navigation
- Screen-Reader Support
- Touch-Target Größen ≥44px

### Dependencies
- Lit Element 2.x
- Home Assistant Frontend API
- No external CSS frameworks

---

## Support & Entwicklung

### Bug Reports
Bitte auf GitHub erstellen: [Issues](https://github.com/Xerolux/VIOLET_CARD_QUICK/issues)

### Feature Requests
Im [Discussions](https://github.com/Xerolux/VIOLET_CARD_QUICK/discussions) Forum

### Development
```bash
npm install
npm run dev      # Entwicklungs-Server
npm run build    # Build für Produktion
npm test         # Tests ausführen
```

---

## Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei

---

## Changelog

### v2.0.0 (Aktuell)
- ✨ 5 neue Analytics Card-Typen (Statistics, Weather, Maintenance, Alerts, Comparison)
- ✨ 25+ neue Keyframe-Animationen
- ✨ SVG-Animationen für Dosierung, Chemie, Filter
- ✨ Gauge-Nadel-Animationen
- 🐛 Memory-Leak-Fixes in Slider-Komponenten
- 🔧 TypeScript-Typsicherheit erweitert
- 📊 Performance-Optimierungen mit Memoization
- ♿ Accessibility Improvements

### v1.x.x
- 13 Standard-Kartentypen
- 6 Premium-Themes
- RGB-Farbwähler
- Tooltip-System
- Responsive Design

---

## Danksagungen

Entwickelt für die [Violet Pool Controller](https://github.com/Xerolux/violet-hass) Community.

---

## 🌐 English Version

# Violet Pool Card

A premium Lovelace dashboard card for the [Violet Pool Controller](https://github.com/Xerolux/violet-hass) Home Assistant integration.

## Key Features

- **18 Card Types** — Standard equipment + new analytics cards
- **6 Premium Themes** — Luxury, Modern, Glass, Neon, Premium, Minimalist
- **4 Sizes** — Small, Medium, Large, Fullscreen
- **SVG Animations** — Rotating pump, pulsing heater, animated cover, glowing lights
- **Advanced Charts** — Trend analysis, pressure gauges, line charts
- **25+ Keyframe Animations** — Droplets, gauges, alerts, shimmer effects
- **Touch Optimized** — 44px+ minimum targets for mobile
- **Visual Editor** — Full GUI configuration, no YAML needed
- **Responsive Design** — Works on all screen sizes

## Quick Start (English)

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
theme: luxury
size: medium
animation: smooth
```

## Card Types

### Standard (13)
Pump, Heater, Solar, Dosing, Cover, Light, Filter, Chemical, Sensor, Overview, Details, Compact, System

### New Analytics (5)
Statistics (trends), Weather (conditions), Maintenance (schedules), Alerts (notifications), Comparison (actual vs target)

## Installation

1. Install via HACS or manually
2. Add resource to Home Assistant
3. Create card in dashboard
4. Auto-detect entities or configure manually

## Themes

- **Luxury** — Glassmorphism with blur
- **Modern** — Clean flat design
- **Glass** — Frosted glass effect
- **Neon** — Cyberpunk-inspired
- **Premium** — Gradient backgrounds
- **Minimalist** — Minimal styling

## Documentation

Full configuration options, examples, and troubleshooting available above in German. Configuration options are identical for English usage.

---

**For support and feature requests, visit the GitHub repository.**
