# 🏊 Violet Pool Card - Premium Edition

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

**Die ultimative Premium Lovelace Card** für die [Violet Pool Controller](https://github.com/Xerolux/violet-hass) Integration für Home Assistant.

> 🌟 **Visual Editor** · **Kein YAML!** · **6 Premium Themes** · **4 Flexible Größen** · **Smart Auto-Coloring** · **Die beste Pool Card überhaupt**

</div>

---

## 🌐 Language / Sprache

**[🇩🇪 Deutsche Dokumentation](#-deutsche-dokumentation)** | **[🇬🇧 English Documentation](#-english-documentation)**

---

# 🇩🇪 Deutsche Dokumentation

## 📋 Inhaltsverzeichnis

- [🎉 Neu in v2.0: Visual Editor!](#-neu-in-v20-visual-editor)
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

## 🎉 Neu in v2.0: Visual Editor!

**Keine YAML-Bearbeitung mehr nötig!** Konfiguriere alles über unseren schönen Visual Editor:

### ✨ Visual Editor Funktionen

**🎨 Visueller Theme-Picker**
- Vorschau aller 6 Themes mit echtem Styling
- Klicken zum Auswählen - Live-Update
- Emoji-Icons mit Beschreibungen
- Hover-Effekte

**📐 Visueller Größen-Picker**
- Größenvorschau (Klein → Vollbild)
- Visuelle Kartengröße
- Ein-Klick-Auswahl

**⚡ Animations-Auswahl**
- Animations-Level mit Vorschau wählen
- Keine / Subtil / Smooth / Energetisch
- Icon mit Beschreibung

**🎯 Intelligente Picker**
- Entity-Picker mit Auto-Complete
- Icon-Picker (MDI-Integration)
- Farbwähler für Akzente & Icons
- Blur-Intensität Slider (0-30)

**👆 Interaktive Aktionen**
- **Tap** - Klicken zum Umschalten oder Details öffnen
- **Hold** (500ms) - Lange drücken für andere Aktion
- **Double-Tap** - Doppelklick für benutzerdefinierte Aktion
- Mobile Vibrations-Feedback

**🎨 Intelligente Auto-Färbung**
- **Temperatur**: Blau (kalt) → Grün (ideal) → Rot (heiß)
- **pH-Wert**: Farbcodiert basierend auf Zielwert (±0.1/0.3/0.5)
- **ORP/Chlor**: Bereichsbasierte Färbung
- **Pumpen-Geschwindigkeit**: Grau/Blau/Grün/Orange für 0/1/2/3
- **Entity-Zustände**: Farbige Badges (ON/OFF/AUTO/MANUAL/Blockiert/Fehler)

**Die erste Pool-Card mit visueller Theme- und Größenvorschau!** 🏆

---

## ✨ Hauptfunktionen

### 🎨 Premium Design-System

**4 Kartengrößen** - Perfekt für jedes Dashboard-Layout:
- **Small** - Kompakte Karten für dichte Layouts
- **Medium** - Standardgröße (Standard)
- **Large** - Geräumige Karten mit erweiterten Visuals
- **Fullscreen** - Immersives Vollbild-Erlebnis

**6 Premium Themes** - Wähle deinen perfekten Stil:
- **Luxury** - Verbesserter Glassmorphismus mit subtilen Gradienten
- **Modern** - Sauberes, minimales Design mit sanften Übergängen
- **Minimalist** - Ultra-clean, randloses Design
- **Glass** - Reiner Glassmorphismus mit Blur-Effekten
- **Neon** - Lebendig, energetisch mit animierten Glows
- **Premium** - High-End Gradient-Design mit dynamischem Glanz

**3 Animations-Level** - Kontrolliere die Energie:
- **Subtle** - Minimale, professionelle Animationen
- **Smooth** - Ausgewogene, angenehme Bewegung
- **Energetic** - Dynamische, auffällige Effekte

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

### 🎨 Design & UX
- **Status-Visualisierung** - Farbcodierte Status-Badges (OFF/ON/AUTO/MANUAL/BLOCKIERT)
- **Interaktive Kontrollen** - Touch-optimierte Slider für Geschwindigkeit, Temperatur und Zielwerte
- **Schnell-Aktionen** - Ein-Klick-Buttons für häufige Operationen
- **Detail-Status** - Parst und zeigt komplexe Status-Informationen (Frostschutz, Blockaden)
- **Responsive Design** - Funktioniert perfekt auf Desktop, Tablet und Mobile
- **Theme-Unterstützung** - Volle Dark/Light Mode Integration mit HA-Themes

---

## 📸 Screenshots

### Premium Theme Galerie

#### 🌟 Luxury Theme (Standard)
![Luxury Theme](screenshots/theme_luxury_pump.png)

#### 🎯 Modern Theme
![Modern Theme](screenshots/theme_modern_heater.png)

#### 💎 Glass Theme
![Glass Theme](screenshots/theme_glass_solar.png)

#### ⚡ Neon Theme
![Neon Theme](screenshots/theme_neon_dosing.png)

#### 👑 Premium Theme
![Premium Theme](screenshots/theme_premium_pump.png)

### Kartentypen

![Pump Card](screenshots/pump_card.png)
![Heater Card](screenshots/heater_card.png)
![Solar Card](screenshots/solar_card.png)
![Dosing Card](screenshots/dosing_card.png)
![Overview Card](screenshots/overview_card.png)
![Compact Card](screenshots/compact_card.png)

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

### Premium Design-Optionen

| Name | Typ | Standard | Beschreibung |
|------|-----|----------|--------------|
| `size` | string | `medium` | Kartengröße: `small`, `medium`, `large`, oder `fullscreen` |
| `theme` | string | `luxury` | Design-Theme: `luxury`, `modern`, `minimalist`, `glass`, `neon`, oder `premium` |
| `animation` | string | `smooth` | Animations-Level: `none`, `subtle`, `smooth`, oder `energetic` |
| `blur_intensity` | number | `10` | Blur-Intensität für Glassmorphismus-Effekte (0-30) |

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

### Styling-Optionen

| Name | Typ | Standard | Beschreibung |
|------|-----|----------|--------------|
| `accent_color` | string | Theme-Standard | Benutzerdefinierte Akzentfarbe |
| `icon_color` | string | Theme-Standard | Benutzerdefinierte Icon-Farbe |

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
- Unterstützt alle Themes (Modern/Luxury)

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

  # Reihe von Medium-Karten mit Glass Theme
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

- [🎉 NEW in v2.0: Visual Editor!](#-new-in-v20-visual-editor)
- [✨ Features](#-features)
- [📸 Screenshots](#-screenshots-1)
- [📥 Installation](#-installation-1)
- [⚙️ Configuration](#️-configuration-1)
- [🎴 Card Types](#-card-types)
- [📖 Examples](#-examples-1)
- [🛠️ Development](#️-development-1)
- [🤝 Contributing](#-contributing)
- [💝 Support](#-support-1)
- [📜 License](#-license)

---

## 🎉 NEW in v2.0: Visual Editor!

**No YAML editing needed!** Configure everything through our beautiful visual editor:

### ✨ Visual Editor Features

**🎨 Visual Theme Picker**
- See actual styled previews of all 6 themes
- Click to select - live update
- Emoji icons + descriptions
- Hover effects

**📐 Visual Size Picker**
- See size previews (Small → Fullscreen)
- Visual card size representation
- One-click selection

**⚡ Animation Selector**
- Choose animation level with preview
- None / Subtle / Smooth / Energetic
- Icon + description

**🎯 Smart Pickers**
- Entity picker with auto-complete
- Icon picker (MDI integration)
- Color pickers for accent & icons
- Blur intensity slider (0-30)

**👆 Interactive Actions**
- **Tap** - Click to toggle or open details
- **Hold** (500ms) - Long press for different action
- **Double-Tap** - Double click for custom action
- Mobile vibration feedback

**🎨 Smart Auto-Coloring**
- **Temperature**: Blue (cold) → Green (ideal) → Red (hot)
- **pH**: Color-coded based on target (±0.1/0.3/0.5)
- **ORP/Chlorine**: Range-based coloring
- **Pump Speed**: Gray/Blue/Green/Orange for 0/1/2/3
- **Entity States**: Colored badges (ON/OFF/AUTO/MANUAL/Blocked/Error)

**First pool card with visual theme and size previews!** 🏆

---

## ✨ Features

### 🎨 Premium Design System

**4 Card Sizes** - Perfect for any dashboard layout:
- **Small** - Compact cards for dense layouts
- **Medium** - Standard size (default)
- **Large** - Spacious cards with enhanced visuals
- **Fullscreen** - Immersive full-screen experience

**6 Premium Themes** - Choose your perfect style:
- **Luxury** - Enhanced glassmorphism with subtle gradients
- **Modern** - Clean, minimal design with smooth transitions
- **Minimalist** - Ultra-clean, borderless aesthetic
- **Glass** - Pure glassmorphism with blur effects
- **Neon** - Vibrant, energetic with animated glows
- **Premium** - High-end gradient design with dynamic shine

**3 Animation Levels** - Control the energy:
- **Subtle** - Minimal, professional animations
- **Smooth** - Balanced, pleasant motion
- **Energetic** - Dynamic, eye-catching effects

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

### 🎨 Design & UX
- **Status Visualization** - Color-coded status badges (OFF/ON/AUTO/MANUAL/BLOCKED)
- **Interactive Controls** - Touch-optimized sliders for speed, temperature, and target values
- **Quick Actions** - One-click buttons for common operations
- **Detail Status** - Parse and display complex state information (anti-freeze, blockages)
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Theme Support** - Full Dark/Light mode integration with HA themes

---

## 📸 Screenshots

### Premium Theme Gallery

#### 🌟 Luxury Theme (Default)
![Luxury Theme](screenshots/theme_luxury_pump.png)

#### 🎯 Modern Theme
![Modern Theme](screenshots/theme_modern_heater.png)

#### 💎 Glass Theme
![Glass Theme](screenshots/theme_glass_solar.png)

#### ⚡ Neon Theme
![Neon Theme](screenshots/theme_neon_dosing.png)

#### 👑 Premium Theme
![Premium Theme](screenshots/theme_premium_pump.png)

### Card Types

![Pump Card](screenshots/pump_card.png)
![Heater Card](screenshots/heater_card.png)
![Solar Card](screenshots/solar_card.png)
![Dosing Card](screenshots/dosing_card.png)
![Overview Card](screenshots/overview_card.png)
![Compact Card](screenshots/compact_card.png)

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

### Premium Design Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `size` | string | `medium` | Card size: `small`, `medium`, `large`, or `fullscreen` |
| `theme` | string | `luxury` | Design theme: `luxury`, `modern`, `minimalist`, `glass`, `neon`, or `premium` |
| `animation` | string | `smooth` | Animation level: `none`, `subtle`, `smooth`, or `energetic` |
| `blur_intensity` | number | `10` | Blur intensity for glassmorphism effects (0-30) |

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

### Styling Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `accent_color` | string | Theme default | Custom accent color |
| `icon_color` | string | Theme default | Custom icon color |

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
- Supports all themes (Modern/Luxury)

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
**Bundle Size**: 84KB
**Cards**: 6 Types
**Components**: 7
**Status**: ✅ Production Ready
