# 🏊 Violet Pool Card

<div align="center">

[![GitHub Release](https://img.shields.io/github/release/Xerolux/VIOLET_CARD_QUICK.svg?style=flat-square)](https://github.com/Xerolux/VIOLET_CARD_QUICK/releases)
[![GitHub Activity](https://img.shields.io/github/commit-activity/m/Xerolux/VIOLET_CARD_QUICK.svg?style=flat-square)](https://github.com/Xerolux/VIOLET_CARD_QUICK/commits/main)
[![License](https://img.shields.io/github/license/Xerolux/VIOLET_CARD_QUICK.svg?style=flat-square)](LICENSE)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square)](https://github.com/hacs/integration)
[![Validate](https://github.com/Xerolux/VIOLET_CARD_QUICK/actions/workflows/validate.yml/badge.svg)](https://github.com/Xerolux/VIOLET_CARD_QUICK/actions/workflows/validate.yml)

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-donate-yellow.svg?style=for-the-badge&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/xerolux)
[![PayPal](https://img.shields.io/badge/PayPal-donate-blue.svg?style=for-the-badge&logo=paypal)](https://paypal.me/xerolux)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-donate-red.svg?style=for-the-badge&logo=ko-fi)](https://ko-fi.com/xerolux)
[![Tesla Referral](https://img.shields.io/badge/Tesla-Referral-red?style=for-the-badge&logo=tesla)](https://ts.la/sebastian564489)

<p>
  <img src="https://img.shields.io/badge/Made%20with-Lit-324FFF?style=for-the-badge&logo=lit" alt="Made with Lit">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Home%20Assistant-41BDF5?style=for-the-badge&logo=home-assistant&logoColor=white" alt="Home Assistant">
</p>

**Die Premium Lovelace Card** für die [Violet Pool Controller](https://github.com/Xerolux/violet-hass) Integration für Home Assistant.

> ⚠️ **HINWEIS:** Aufgrund einer Speicherbeschränkung von 100kb mussten einige Design-Themes konsolidiert werden. Die Kartenfunktion bleibt vollständig erhalten, aber die visuellen Unterschiede zwischen den Themes sind nun minimal.

</div>

---

## 🌐 Language / Sprache

**[🇩🇪 Deutsche Dokumentation](#-deutsche-dokumentation)** | **[🇬🇧 English Documentation](#-english-documentation)**

---

# 🇩🇪 Deutsche Dokumentation

## 📋 Inhaltsverzeichnis

- [✨ Hauptfunktionen](#-hauptfunktionen)
- [📸 Screenshots](#-screenshots)
- [📥 Installation](#-installation)
- [⚙️ Konfiguration](#️-konfiguration)
- [🎴 Kartentypen](#-kartentypen)
- [📖 Beispiele](#-beispiele)
- [🛠️ Entwicklung](#️-entwicklung)
- [🤝 Mitwirken](#-mitwirken)
- [💝 Unterstützung](#-unterstützung)
- [📜 Lizenz](#-lizenz)

---

## ✨ Hauptfunktionen

### 🎴 Mehrere Kartentypen
- **Pump Card** - Geschwindigkeitskontrolle mit RPM-Anzeige und Laufzeit-Zähler
- **Heater Card** - Temperaturkontrolle mit Außentemperatur-Überwachung
- **Solar Card** - Temperatur-Delta-Berechnung mit farbcodierten Hinweisen
- **Dosing Card** - Auto-Erkennung des Dosiertyps mit aktuellen/Zielwerten
- **Overview Card** - Wasserchemie-Dashboard mit Ampel-System
- **Compact Card** - Ein-Zeilen-Anzeige für Dashboard-Übersicht

### 🎯 Intelligente Funktionen
- **Animierte Icons** - Rotierende Pumpe, pulsierende Heizungs-/Dosier-Icons
- **Laufzeit-Zähler** - Pumpen-Laufzeit im h/min-Format
- **RPM-Anzeige** - Zeigt aktuelle Pumpengeschwindigkeit in RPM
- **Temperatur-Delta** - Solar-Absorber vs. Pool-Temperatur mit Hinweisen
- **Wasserchemie** - Ampel-Status für pH, ORP und Temperatur
- **Auto-Erkennung** - Intelligente Sensor-Auslesung und Icon-Auswahl

---

## 📸 Screenshots

### Kartentypen (Aktuelles Design)

Hier sehen Sie das aktuelle Design der Violet Pool Card. Aufgrund von Optimierungen teilen sich nun alle Varianten ein konsistentes, modernes Erscheinungsbild.

#### Pump Card
![Pump Card](screenshots/pump_card.png)

#### Heater Card
![Heater Card](screenshots/heater_card.png)

#### Solar Card
![Solar Card](screenshots/solar_card.png)

#### Dosing Card
![Dosing Card](screenshots/dosing_card.png)

#### Overview Card
![Overview Card](screenshots/overview_card.png)

#### Compact Card
![Compact Card](screenshots/compact_card.png)

#### System View (Beispiel)
![System View](screenshots/example_system_fullscreen.png)

---

## 📥 Installation

### HACS (Empfohlen)

1. Öffne **HACS** in deinem Home Assistant
2. Klicke auf **"Frontend"**
3. Klicke auf die **drei Punkte** in der oberen rechten Ecke
4. Wähle **"Custom repositories"**
5. Füge `https://github.com/Xerolux/VIOLET_CARD_QUICK` als **Lovelace** Plugin hinzu
6. Klicke auf **"Install"**
7. **Starte Home Assistant neu**

### Manuelle Installation

1. Lade `violet-pool-card.js` vom [neuesten Release](https://github.com/Xerolux/VIOLET_CARD_QUICK/releases) herunter
2. Kopiere es nach `config/www/violet-pool-card.js`
3. Füge die Ressource in deiner `configuration.yaml` hinzu:

```yaml
lovelace:
  resources:
    - url: /local/violet-pool-card.js
      type: module
```

4. **Starte Home Assistant neu**

---

## ⚙️ Konfiguration

### Basis-Konfiguration

| Name | Typ | Standard | Beschreibung |
|------|-----|----------|--------------|
| `type` | string | **Erforderlich** | `custom:violet-pool-card` |
| `entity` | string | **Erforderlich** | Entity ID (außer für overview) |
| `card_type` | string | **Erforderlich** | `pump`, `heater`, `solar`, `dosing`, `overview`, `compact`, oder `system` |
| `name` | string | Optional | Benutzerdefinierter Name für die Karte |
| `icon` | string | Optional | Benutzerdefiniertes Icon (MDI) |

### Design-Optionen (Eingeschränkt)

> Hinweis: Die Theme-Auswahl ist weiterhin verfügbar, aber visuelle Unterschiede sind minimal.

| Name | Typ | Standard | Beschreibung |
|------|-----|----------|--------------|
| `size` | string | `medium` | Kartengröße: `small`, `medium`, `large`, oder `fullscreen` |
| `theme` | string | `luxury` | Design-Theme (jetzt vereinheitlicht) |
| `animation` | string | `smooth` | Animations-Level: `none`, `subtle`, `smooth`, oder `energetic` |

### Anzeige-Optionen

| Name | Typ | Standard | Beschreibung |
|------|-----|----------|--------------|
| `show_state` | boolean | `true` | Status-Badge anzeigen |
| `show_detail_status` | boolean | `true` | Detaillierte Status-Info anzeigen |
| `show_controls` | boolean | `true` | Kontroll-Slider/Buttons anzeigen |
| `show_runtime` | boolean | `false` | Laufzeit-Zähler anzeigen (nur Pumpe) |
| `show_history` | boolean | `false` | Dosier-Historie anzeigen (nur Dosierung) |

### Dosier-Optionen

| Name | Typ | Standard | Beschreibung |
|------|-----|----------|--------------|
| `dosing_type` | string | Auto-Erkennung | `chlorine`, `ph_minus`, `ph_plus`, oder `flocculant` |

---

## 🎴 Kartentypen

### 🔵 Pump Card (Pumpen-Karte)
- Geschwindigkeitskontrolle (0-3: OFF/ECO/Normal/Boost)
- Animiertes rotierendes Pumpen-Icon wenn aktiv ⚙️
- RPM-Anzeige für aktuelles Geschwindigkeitslevel
- Status-Badge mit aktuellem Level-Indikator
- Detail-Status (z.B. "Pump Anti Freeze")
- Schnell-Aktions-Buttons (OFF/AUTO/ECO/Normal/Boost)
- Optionaler Laufzeit-Zähler (h/min Format)

### 🔥 Heater Card (Heizungs-Karte)
- Temperatur-Slider (18-35°C mit 0.5° Schritten)
- Animiertes pulsierendes Icon beim Heizen 🔥
- Aktuelle vs. Ziel-Temperatur-Anzeige
- Außentemperatur-Indikator mit Warnung
- Blockade-Status-Anzeige (min. Außentemperatur)
- Schnell-Aktions-Buttons (OFF/AUTO/HEAT)

### ☀️ Solar Card (Solar-Karte)
- Pool- vs. Absorber-Temperatur-Anzeige
- Temperatur-Delta-Berechnung mit farbcodierten Hinweisen:
  - 🔴 **Rot**: Zu kalt zum Heizen (negatives Delta)
  - 🟡 **Gelb**: Heizen möglich (0-3°C)
  - 🟢 **Grün**: Ideal zum Heizen (>3°C)
- Zieltemperatur-Kontrolle (18-32°C)
- Frostschutz-Status-Anzeige
- Schnell-Aktions-Buttons (OFF/AUTO/ON)

### 💧 Dosing Card (Dosier-Karte)
- Auto-Erkennung des Dosier-Typs (Chlor, pH-, pH+, Flockungsmittel)
- Aktueller Wert-Anzeige mit korrekter Formatierung:
  - ORP: 0 Dezimalstellen (650mV)
  - pH: 1 Dezimalstelle (7.2)
- Zielwert mit Pfeil-Indikator (→)
- Min/Max-Schwellenwert-Anzeige
- Animiertes pulsierendes Icon beim Dosieren 💫
- Blockade-Gründe als abweisbare Chips
- Schnell-Aktions-Buttons (OFF/AUTO/Dosieren 30s/Dosieren 60s)
- Optionale Dosier-Historie (24h Volumen)

### 🏊 Overview Card (Übersichts-Karte)
- Wasserchemie-Dashboard mit Ampel-Indikatoren:
  - 🌡️ Pool-Temperatur mit OK-Status
  - 🧪 pH-Wert mit Bereichsprüfung (7.0-7.4)
  - ⚡ ORP-Wert mit Bereichsprüfung (650-750mV)
- Aktive Geräte-Liste mit Status-Icons
- Farbcodierte Gerätezustände (aktiv/inaktiv)
- Warnungs-Bereich mit Icons:
  - ORP zu niedrig/hoch Alarme
  - pH außerhalb des Bereichs Alarme
  - ❄️ Frostschutz-Status
- ✅ "Alle Systeme normal" Indikator wenn keine Warnungen

### 🖥️ System Card (System-Karte)
- Vollbild-Dashboard-Ansicht mit allen Kontrollen kombiniert
- Responsive Grid-Layout (Desktop/Mobile)
- Aggregiert Pumpe, Heizung, Solar, Dosierung und Übersicht
- Perfekt für eine Hauptpanel-Ansicht

### 📊 Compact Card (Kompakt-Karte)
- Ein-Zeilen-Kompakt-Anzeige pro Entity
- Auto-erkanntes Icon basierend auf Entity-Typ
- Status-Badge mit Zustands-Indikator
- Aktueller Wert-Anzeige (Temperatur, Level, pH, ORP)
- Detail-Status (Frostschutz, Blockade, etc.)
- Farbcodierte aktive/inaktive Icons
- Hover-Effekt für bessere UX
- Perfekt für Dashboard-Übersicht

---

## 📖 Beispiele

### Premium Showcase Dashboard

```yaml
# Vollbild Premium Hauptkarte
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: system
size: fullscreen
theme: premium
animation: energetic
```

### Gemischte Größen Dashboard

```yaml
type: vertical-stack
cards:
  # Große Übersicht mit Luxury Theme
  - type: custom:violet-pool-card
    card_type: overview
    name: Pool Status
    size: large
    theme: luxury
    animation: smooth

  # Reihe von Medium-Karten
  - type: horizontal-stack
    cards:
      - type: custom:violet-pool-card
        entity: switch.violet_pool_pump
        card_type: pump
        size: medium
        theme: glass
        animation: smooth

      - type: custom:violet-pool-card
        entity: climate.violet_pool_heater
        card_type: heater
        size: medium
        theme: glass
        animation: smooth

  # Neon Theme für Dosierung
  - type: custom:violet-pool-card
    entity: switch.violet_pool_dos_1_cl
    card_type: dosing
    dosing_type: chlorine
    size: medium
    theme: neon
    animation: energetic
```

### Vollständiges Dashboard

```yaml
type: vertical-stack
cards:
  # Übersicht oben
  - type: custom:violet-pool-card
    card_type: overview
    name: Pool Status

  # Detaillierte Karten
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

Siehe [VIOLET_CARD_EXAMPLES.yaml](VIOLET_CARD_EXAMPLES.yaml) für weitere Konfigurationsbeispiele.

---

## 🛠️ Entwicklung

### Aus Quellcode bauen

```bash
# Repository klonen
git clone https://github.com/Xerolux/VIOLET_CARD_QUICK.git
cd VIOLET_CARD_QUICK

# Abhängigkeiten installieren
npm install

# Build
npm run build

# Entwicklung mit Auto-Reload
npm run watch
```

### Entwicklungsserver

```bash
npm run serve
# Card verfügbar unter http://localhost:5000/violet-pool-card.js
```

Zur Home Assistant Konfiguration für Entwicklung hinzufügen:

```yaml
lovelace:
  resources:
    - url: http://localhost:5000/violet-pool-card.js
      type: module
```

---

## 🤝 Mitwirken

Beiträge sind willkommen! Bitte erstelle gerne einen Pull Request.

1. Fork das Repository
2. Erstelle deinen Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

---

## 💝 Unterstützung

Wenn du dieses Projekt hilfreich findest, unterstütze bitte die Entwicklung:

<div align="center">

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-donate-yellow.svg?style=for-the-badge&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/xerolux)
[![PayPal](https://img.shields.io/badge/PayPal-donate-blue.svg?style=for-the-badge&logo=paypal)](https://paypal.me/xerolux)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-donate-red.svg?style=for-the-badge&logo=ko-fi)](https://ko-fi.com/xerolux)

</div>

### Hilfe erhalten

- 🐛 **Issues**: [GitHub Issues](https://github.com/Xerolux/VIOLET_CARD_QUICK/issues)
- 💬 **Diskussionen**: [GitHub Discussions](https://github.com/Xerolux/VIOLET_CARD_QUICK/discussions)
- 🏠 **Violet Pool Controller**: [Haupt-Integration](https://github.com/Xerolux/violet-hass)

---

## 📜 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details

---

## 🙏 Credits

- Gebaut mit [Lit](https://lit.dev/)
- Für die [Violet Pool Controller](https://github.com/Xerolux/violet-hass) Integration
- Erstellt von [Xerolux](https://github.com/Xerolux)

---

## 📊 Projekt-Stats

![GitHub stars](https://img.shields.io/github/stars/Xerolux/VIOLET_CARD_QUICK?style=social)
![GitHub forks](https://img.shields.io/github/forks/Xerolux/VIOLET_CARD_QUICK?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/Xerolux/VIOLET_CARD_QUICK?style=social)

---

## 📝 Changelog

Siehe [CHANGELOG.md](CHANGELOG.md) für Versions-Historie.

**Aktuelle Version**: 1.0.0
**Bundle-Größe**: 84KB
**Karten**: 6 Typen
**Komponenten**: 7
**Status**: ✅ Produktionsreif

---
---
---

# 🇬🇧 English Documentation

## 📋 Table of Contents

- [✨ Features](#-features-1)
- [📸 Screenshots](#-screenshots-1)
- [📥 Installation](#-installation-1)
- [⚙️ Configuration](#️-configuration-1)
- [🎴 Card Types](#-card-types-1)
- [📖 Examples](#-examples-1)
- [🛠️ Development](#️-development-1)
- [🤝 Contributing](#-contributing)
- [💝 Support](#-support-1)
- [📜 License](#-license)

---

## ✨ Features

### 🎴 Multiple Card Types
- **Pump Card** - Speed control with RPM display and runtime counter
- **Heater Card** - Temperature control with outside temp monitoring
- **Solar Card** - Temperature delta calculation with color-coded hints
- **Dosing Card** - Auto-detect dosing type with current/target values
- **Overview Card** - Water chemistry dashboard with traffic lights
- **Compact Card** - One-line display for dashboard overview

### 🎯 Smart Features
- **Animated Icons** - Rotating pump, pulsing heater/dosing icons
- **Runtime Counter** - Display pump runtime in h/min format
- **RPM Display** - Shows current pump speed in RPM
- **Temperature Delta** - Solar absorber vs pool temperature with hints
- **Water Chemistry** - Traffic light status for pH, ORP, and temperature
- **Auto-Detection** - Smart sensor reading and icon selection

---

## 📸 Screenshots

### Card Types (Current Design)

Here you can see the current design of the Violet Pool Card. Due to size optimizations (100kb limit), all variants now share a consistent, modern appearance.

#### Pump Card
![Pump Card](screenshots/pump_card.png)

#### Heater Card
![Heater Card](screenshots/heater_card.png)

#### Solar Card
![Solar Card](screenshots/solar_card.png)

#### Dosing Card
![Dosing Card](screenshots/dosing_card.png)

#### Overview Card
![Overview Card](screenshots/overview_card.png)

#### Compact Card
![Compact Card](screenshots/compact_card.png)

#### System View (Example)
![System View](screenshots/example_system_fullscreen.png)

---

## 📥 Installation

### HACS (Recommended)

1. Open **HACS** in your Home Assistant
2. Click on **"Frontend"**
3. Click the **three dots** in the top right corner
4. Select **"Custom repositories"**
5. Add `https://github.com/Xerolux/VIOLET_CARD_QUICK` as a **Lovelace** plugin
6. Click **"Install"**
7. **Restart Home Assistant**

### Manual Installation

1. Download `violet-pool-card.js` from the [latest release](https://github.com/Xerolux/VIOLET_CARD_QUICK/releases)
2. Copy it to `config/www/violet-pool-card.js`
3. Add the resource in your `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/violet-pool-card.js
      type: module
```

4. **Restart Home Assistant**

---

## ⚙️ Configuration

### Basic Configuration

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | **Required** | `custom:violet-pool-card` |
| `entity` | string | **Required** | Entity ID (except for overview) |
| `card_type` | string | **Required** | `pump`, `heater`, `solar`, `dosing`, `overview`, `compact`, or `system` |
| `name` | string | Optional | Custom name for the card |
| `icon` | string | Optional | Custom icon (MDI) |

### Design Options (Limited)

> Note: Theme selection is still available but visual differences are minimal.

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `size` | string | `medium` | Card size: `small`, `medium`, `large`, or `fullscreen` |
| `theme` | string | `luxury` | Design theme (now unified) |
| `animation` | string | `smooth` | Animation level: `none`, `subtle`, `smooth`, or `energetic` |

### Display Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `show_state` | boolean | `true` | Show state badge |
| `show_detail_status` | boolean | `true` | Show detailed status info |
| `show_controls` | boolean | `true` | Show control sliders/buttons |
| `show_runtime` | boolean | `false` | Show runtime counter (pump only) |
| `show_history` | boolean | `false` | Show dosing history (dosing only) |

### Dosing Options

| Name | Type | Default | Description |
|------|-----|---------|-------------|
| `dosing_type` | string | Auto-detect | `chlorine`, `ph_minus`, `ph_plus`, or `flocculant` |

---

## 🎴 Card Types

### 🔵 Pump Card
- Speed control (0-3: OFF/ECO/Normal/Boost)
- Animated rotating pump icon when running ⚙️
- RPM display for current speed level
- Status badge with current level indicator
- Detail status (e.g., "Pump Anti Freeze")
- Quick action buttons (OFF/AUTO/ECO/Normal/Boost)
- Optional runtime counter (h/min format)

### 🔥 Heater Card
- Temperature slider (18-35°C with 0.5° steps)
- Animated pulsing icon when heating 🔥
- Current vs target temperature display
- Outside temperature indicator with warning
- Blockage status display (min outside temp)
- Quick action buttons (OFF/AUTO/HEAT)

### ☀️ Solar Card
- Pool vs absorber temperature display
- Temperature delta calculation with color-coded hints:
  - 🔴 **Red**: Too cold for heating (negative delta)
  - 🟡 **Yellow**: Heating possible (0-3°C)
  - 🟢 **Green**: Ideal for heating (>3°C)
- Target temperature control (18-32°C)
- Anti-freeze status display
- Quick action buttons (OFF/AUTO/ON)

### 💧 Dosing Card
- Auto-detect dosing type (chlorine, pH-, pH+, flocculant)
- Current value display with proper formatting:
  - ORP: 0 decimals (650mV)
  - pH: 1 decimal (7.2)
- Target value with arrow indicator (→)
- Min/Max threshold display
- Animated pulsing icon when dosing 💫
- Blockage reasons as dismissable chips
- Quick action buttons (OFF/AUTO/Dose 30s/Dose 60s)
- Optional dosing history (24h volume)

### 🏊 Overview Card
- Water chemistry dashboard with traffic light indicators:
  - 🌡️ Pool temperature with OK status
  - 🧪 pH value with range check (7.0-7.4)
  - ⚡ ORP value with range check (650-750mV)
- Active devices list with status icons
- Color-coded device states (active/inactive)
- Warnings section with icons:
  - ORP too low/high alerts
  - pH out of range alerts
  - ❄️ Frost protection status
- ✅ "All systems normal" indicator when no warnings

### 🖥️ System Card
- Full-screen dashboard view combining all controls
- Responsive grid layout (desktop/mobile)
- Aggregates Pump, Heater, Solar, Dosing, and Overview
- Perfect for a main panel view

### 📊 Compact Card
- One-line compact display per entity
- Auto-detected icon based on entity type
- Status badge with state indicator
- Current value display (temperature, level, pH, ORP)
- Detail status (anti-freeze, blockage, etc.)
- Color-coded active/inactive icons
- Hover effect for better UX
- Perfect for dashboard overview

---

## 📖 Examples

### Premium Showcase Dashboard

```yaml
# Fullscreen Premium Main Card
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: system
size: fullscreen
theme: premium
animation: energetic
```

### Mixed Sizes Dashboard

```yaml
type: vertical-stack
cards:
  # Large Overview with Luxury Theme
  - type: custom:violet-pool-card
    card_type: overview
    name: Pool Status
    size: large
    theme: luxury
    animation: smooth

  # Row of Medium Cards with Glass Theme
  - type: horizontal-stack
    cards:
      - type: custom:violet-pool-card
        entity: switch.violet_pool_pump
        card_type: pump
        size: medium
        theme: glass
        animation: smooth

      - type: custom:violet-pool-card
        entity: climate.violet_pool_heater
        card_type: heater
        size: medium
        theme: glass
        animation: smooth

  # Neon Theme for Dosing
  - type: custom:violet-pool-card
    entity: switch.violet_pool_dos_1_cl
    card_type: dosing
    dosing_type: chlorine
    size: medium
    theme: neon
    animation: energetic
```

### Complete Dashboard

```yaml
type: vertical-stack
cards:
  # Overview at top
  - type: custom:violet-pool-card
    card_type: overview
    name: Pool Status

  # Detailed cards
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

See [VIOLET_CARD_EXAMPLES.yaml](VIOLET_CARD_EXAMPLES.yaml) for more configuration examples.

---

## 🛠️ Development

### Build from Source

```bash
# Clone repository
git clone https://github.com/Xerolux/VIOLET_CARD_QUICK.git
cd VIOLET_CARD_QUICK

# Install dependencies
npm install

# Build
npm run build

# Development with auto-reload
npm run watch
```

### Development Server

```bash
npm run serve
# Card available at http://localhost:5000/violet-pool-card.js
```

Add to your Home Assistant configuration for development:

```yaml
lovelace:
  resources:
    - url: http://localhost:5000/violet-pool-card.js
      type: module
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 💝 Support

If you find this project helpful, please consider supporting its development:

<div align="center">

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-donate-yellow.svg?style=for-the-badge&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/xerolux)
[![PayPal](https://img.shields.io/badge/PayPal-donate-blue.svg?style=for-the-badge&logo=paypal)](https://paypal.me/xerolux)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-donate-red.svg?style=for-the-badge&logo=ko-fi)](https://ko-fi.com/xerolux)

</div>

### Get Help

- 🐛 **Issues**: [GitHub Issues](https://github.com/Xerolux/VIOLET_CARD_QUICK/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Xerolux/VIOLET_CARD_QUICK/discussions)
- 🏠 **Violet Pool Controller**: [Main Integration](https://github.com/Xerolux/violet-hass)

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Credits

- Built with [Lit](https://lit.dev/)
- For the [Violet Pool Controller](https://github.com/Xerolux/violet-hass) integration
- Created by [Xerolux](https://github.com/Xerolux)

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/Xerolux/VIOLET_CARD_QUICK?style=social)
![GitHub forks](https://img.shields.io/github/forks/Xerolux/VIOLET_CARD_QUICK?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/Xerolux/VIOLET_CARD_QUICK?style=social)

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

**Current Version**: 1.0.0
**Bundle-Size**: 84KB
**Cards**: 6 Types
**Components**: 7
**Status**: ✅ Production Ready
