# Violet Pool Card

<div align="center">
<img src="https://raw.githubusercontent.com/Xerolux/violet-pool-card/main/logo.png" width="360" alt="Violet Pool Card">
<br><br>

[![GitHub Release][releases-shield]][releases]
[![Downloads][downloads-shield]][releases]
[![GitHub Activity][commits-shield]][commits]
[![License][license-shield]](LICENSE)
[![HACS][hacs-badge]][hacs]

[![Discord][discord-shield]][discord]
[![Community Forum][forum-shield]][forum]
[![Buy Me A Coffee][buymeacoffee-badge]][buymeacoffee]
[![Tesla](https://img.shields.io/badge/Tesla-Referral-red?style=for-the-badge&logo=tesla)](https://ts.la/sebastian564489)

[![Validate](https://github.com/Xerolux/violet-pool-card/actions/workflows/validate.yml/badge.svg)](https://github.com/Xerolux/violet-pool-card/actions/workflows/validate.yml)

A premium Lovelace card for the [Violet Pool Controller](https://github.com/Xerolux/violet-hass) Integration in Home Assistant.

**[English version below](#english-version)**

</div>

---

## Funktionen

### Neu im aktuellen UI-Ausbau
- **Severity model** with `ok`, `info`, `warning`, `critical` for consistent alarm prioritisation
- **Recommendation engine** for pump, heater, solar, dosing and filter
- **Dashboard-Modi**: `default`, `operations`, `chemistry`, `maintenance`, `compact_mobile`, `alarm_center`
- **Editor-Presets**: Modern Glass, Alarm Focus, Technikraum, Familienansicht
- **Accessibility-Modi**: `standard`, `high_contrast`, `reduced_motion`
- **Trend sparklines** on snapshot tiles and filter pressure, where sensors supply value arrays
- **Refined special cards**: backwash, refill, flow rate, inlet, counter current, canisters, digital rules and diagnostics with more distinct layouts
- **Subject-specific iconography** for pool equipment and chemistry instead of generic placeholders
- **Actionable hints on support and maintenance cards too**, not only on chemistry and alarms

### Spezialkarten mit eigener Rolle
- **Backwash**: cycle progress, remaining time and maintenance hints
- **Refill**: level, trend, valve status and level warnings
- **Flow rate**: trend, min/max values, calibration and flow warnings
- **Inlet**: inflow status, trend check and flow plausibility
- **Counter current**: power profile for training, soft and power mode
- **Canister cards**: remaining-reserve estimate, consumption trend and refill hints
- **Digital rules**: rule overview with visual roles and direct trigger / lock / unlock actions
- **Diagnostics**: support panel with quick actions, logic hints and a clearer health focus

### 🎨 Design & Themes
- **7 Premium-Themes** — Luxury (Glassmorphism), Modern, Minimalist, Glass, Neon, Premium, Lagoon (Dark)
- **8 vorgesetzte Farbkombinationen** — Apple, Dark, Luxury, Modern, Minimalist, Glass, Neon, Premium
- **4 Größen-Varianten** — Small, Medium, Large, Fullscreen
- **3 Animations-Stufen** — None, Subtle, Smooth, Energetic
- **Dark/Light Mode Support** — Automatische Anpassung ans Home Assistant Theme
- **Responsive design** - optimised for desktop, tablet and phone

### 🎴 Card Types (28 Total)

#### Equipment (7)
1. **Pump** (`pump`) — speed control with ECO/normal/boost, RPM readout, animated icon
2. **Heater** (`heater`) — temperature control 18-35 °C, actual vs. target, frost warnings
3. **Solar** (`solar`) — pool vs. absorber temperature, delta analysis, target control
4. **Dosing** (`dosing`) — chlorine / pH+ / pH- / flocculant with an animated drop
5. **Cover** (`cover`) — pool cover with position slider and controls
6. **Light** (`light`) — RGB colour picker, brightness, animated glow
7. **Filter** (`filter`) — pressure with colour-coded warning (green / yellow / red)

#### Water treatment (8)
8. **Backwash** (`backwash`) — cycle progress, remaining time, maintenance hints
9. **Refill** (`refill`) — level, trend, valve status, level warnings
10. **Overflow** (`overflow`) — overflow tank state and protection
11. **PV Surplus** (`solar_surplus`) — solar surplus and grid export
12. **Flow Rate** (`flow_rate`) — flow in m³/h with min/max warnings
13. **Inlet** (`inlet`) — inlet status, trend check, flow plausibility
14. **Counter Current** (`counter_current`) — power profile for training, soft and power mode
15. **Chemistry** (`chemical`) — pH / ORP / temperature with recommendations

#### Canisters (4)
16. **Chlorine Canister** (`chlorine_canister`) — chlorine canister level
17. **pH+ Canister** (`ph_plus_canister`) — pH+ canister level
18. **pH- Canister** (`ph_minus_canister`) — pH- canister level
19. **Flocculant Canister** (`flocculant_canister`) — flocculant canister level

#### Diagnostics & maintenance (5)
20. **Error Dashboard** (`error`) — active errors with severity
21. **Digital Rules** (`digital_rules`) — rule overview with trigger / lock / unlock actions
22. **Calibration** (`calibration`) — sensor calibration history
23. **Firmware Update** (`update`) — installed and available version, update from the card
24. **Diagnostics** (`diagnostics`) — support panel with quick actions and health focus

#### Dashboards (5)
25. **Overview** (`overview`) — all devices and readings at a glance
26. **Details** (`details`) — detailed entity list with toggle controls
27. **Compact** (`compact`) — space-saving layout with icons and status
28. **System** (`system`) — full-screen multi-channel view
29. **Sensor** (`sensor`) — generic sensor display with units

### 🎬 Animations & Visualizations
- **SVG animations** for pump (spinning), heater (flickering), solar (breathing), cover (motor), light (glowing)
- **Neue Animationen** — Animierter Tropfen (Dosierung), Druckmesser-Nadel (Chemie), Filter-Gauge (Druck)
- **Charts & graphs** - line charts for trends, pressure gauge with live readout
- **Loading-Skelette** — Placeholder-Animation beim Laden von Entitäten
- **Pulse animations** - pulsing icons for active and critical states

### 📊 Features & Funktionen
- **25+ Keyframe-Animationen** — Dropdown, Gauge-Fill, Alert-Pulse, Shimmer, Rainbow-Border, etc.
- **Automatic entity detection** - through the Home Assistant entity registry
- **Tooltip-System** — Kontextabhängige Hilfetexte (Deutsch/Englisch)
- **Dynamischer Entity-Prefix** — Unterstützung mehrerer Violet Controller
- **Touch optimised** - 44 px minimum height on every element
- **Visueller Editor** — Vollständige GUI-Konfiguration ohne YAML
- **Mobile first** - optimised for every screen size
- **Barrierefreiheit** — WCAG 2.1 AA Compliance

### 💾 Performance
- **Memoization** — Optimierte Berechnung teurer Operationen
- **GPU optimised** - will-change hints for animations
- **Small bundle** - minified and optimised output
- **Memory-Leak-Fixes** — Proper Event/Timer Cleanup

---

## Installation

### Voraussetzung

The [Violet Pool Controller](https://github.com/Xerolux/violet-hass) integration must be installed and set up in Home Assistant.

### HACS (Empfohlen)

1. **HACS** öffnen → **Frontend**
2. Drei-Punkte-Menü → **Eigene Repositories**
3. Repository-URL: `https://github.com/Xerolux/violet-pool-card`
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
card_type: pump
```

### How the card finds its entities

The card queries the Home Assistant entity registry: it takes the entities
that come from the *Violet Pool Controller* integration and maps them to its
displays through their language-independent keys. That works no matter what the
entity ids are called - German, English, renamed.

So if you rename your filter pump to "Dog pump", or give it the entity id
`switch.dog_pump`, the card still finds it: name and entity id belong to you,
the integration's key stays put. What is **not** found is anything that does not
come from the integration - your own template sensor, say; point at that one
directly with `entity:`.

You therefore do not have to configure anything. With **several controllers**,
`entity_prefix` says which one you mean:

```yaml
type: custom:violet-pool-card
card_type: pump
entity_prefix: garten_pool
```

And to force a specific entity - your own template sensor, for instance -
set it directly, as before:

```yaml
type: custom:violet-pool-card
card_type: pump
entity: switch.meine_eigene_pumpe
```

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
- Every device and sensor
- Vollbildansicht
- Optimised for tablets

### Diagnose & Wartung

#### Digitale Regeln (`digital_rules`)
```yaml
type: custom:violet-pool-card
card_type: digital_rules
entity_prefix: violet_pool_controller
```

**Funktionen:**
- State of switching rules 1-8
- Restlaufzeit laufender Regeln

#### Diagnose (`diagnostics`)
```yaml
type: custom:violet-pool-card
card_type: diagnostics
entity_prefix: violet_pool_controller
```

**Funktionen:**
- Systemzustand, Latenz, Speicher
- Modul-Erkennung (Basis, Dosierung, Erweiterungen)

#### Kalibrierung (`calibration`)
```yaml
type: custom:violet-pool-card
card_type: calibration
entity_prefix: violet_pool_controller
```

**Funktionen:**
- Letzte Kalibrierung je Sonde
- Fälligkeitshinweis

#### Firmware-Update (`update`)
```yaml
type: custom:violet-pool-card
card_type: update
entity_prefix: violet_pool_controller
```

**Funktionen:**
- Installed and available version
- Start the update from the card

### Allgemein

| Option | Wert | Standard | Beschreibung |
|--------|------|----------|-------------|
| `type` | `custom:violet-pool-card` | — | Card-Typ |
| `card_type` | String | — | Kartentyp (pump, heater, solar, etc.) |
| `entity` | String | — | Primary Entity-ID |
| `entities` | Array | - | Several entities (for details / system) |
| `name` | String | Auto | Karten-Titel |
| `icon` | String | Auto | MD-Icon |

### Design & Styling

| Option | Wert | Standard | Beschreibung |
|--------|------|----------|-------------|
| `theme` | apple/dark/luxury/modern/minimalist/glass/neon/premium | apple | Design-Theme |
| `size` | small/medium/large/fullscreen | medium | Karten-Größe |
| `animation` | none/subtle/smooth/energetic | smooth | Animations-Stil |
| `layout_variant` | standard/glass/dashboard/focus | glass | Visuelle Kartenhierarchie |
| `dashboard_mode` | default/operations/chemistry/maintenance/compact_mobile/alarm_center | default | System-/Dashboard-Anordnung |
| `alarm_style` | soft/outline/pulse | pulse | How warnings and alarms are drawn |
| `accessibility_mode` | standard/high_contrast/reduced_motion | standard | Contrast and motion mode |
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

### Thresholds (target ranges for the water values)

Up to v0.3.0 the "optimal" ranges were hardcoded (pH 7.0-7.4, ORP 650-750 mV, ...).
Anyone deliberately running their pool differently got a permanent "value out of range" notice.
Since **v0.4.0** you set the target ranges yourself - in the visual editor under **Thresholds**, or in YAML:

```yaml
type: custom:violet-pool-card
card_type: chemical
thresholds:
  ph:          { min: 7.0, max: 7.6 }
  orp:         { min: 600, max: 800 }
  chlorine:    { min: 0.3, max: 1.5 }
  salt:        { min: 3000, max: 4500 }
  temperature: { min: 26, max: 31 }
alerts: warning
```

| Field | Type | Description |
|------|-----|--------------|
| `min` | number | Lower bound of the optimal range |
| `max` | number | Upper bound of the optimal range |
| `warn` | number | Tolerance beyond `min`/`max` that counts as a **warning** rather than **critical** |
| `range` | `[from, to]` | Displayed span of the scale/gauge. Widened automatically so the target range always stays visible |
| `ignore` | boolean | Exclude this metric from evaluation - it is still displayed, but never raises a notice |

Configurable metrics: `ph`, `orp`, `chlorine`, `salt`, `temperature`, `cyanuric_acid`, `alkalinity`.
Unset fields keep their default (based on DIN 19643).

**Alert level** through `alerts`, so the card does not shout at every small deviation:

| Value | Behaviour |
|------|-----------|
| `all` (default) | Every deviation is reported |
| `warning` | Warnings and critical values |
| `critical` | Critical values only (beyond `min`/`max` **plus** `warn`) |
| `none` | No water-value notices - the values are still displayed |

The thresholds apply to `chemical`, `overview`, `system`, `heater` and `dosing`, where they drive
status texts, colours, the optimal zone in the gauges **and** the notices - all consistent.

### Trend data for sparklines

When a sensor supplies one of these arrays in its attributes, the card draws a mini trend automatically:

- `history`
- `values`
- `recent_values`
- `trend`
- `samples`
- `sparkline`

This trend data is now used not only by `overview` and `filter` but also by specialised cards such as `refill`, `flow_rate`, `inlet` and the chemistry canisters, wherever matching attribute arrays exist.

Beispiel:

```yaml
sensor.violet_pool_filter_pressure:
  attributes:
    recent_values: [0.82, 0.85, 0.87, 0.93, 1.01, 1.08]
```

### Entity-Mappings

The card supports both automatic and manual entity mapping. Automatic detection works through the entity registry, with `entity_prefix` as the tie-breaker.

#### Automatische Erkennung (Empfohlen)

```yaml
type: custom:violet-pool-card
card_type: pump
entity: switch.violet_pool_controller_filter_pump
# Detects every matching sensor and control automatically
```

#### Manuelle Entity-Zuordnung (Optional)

```yaml
# For custom setups with non-standard entity ids
entity_prefix: violet_pool_controller    # Basis-Prefix

# Pumpen
pump_entity: switch.violet_pool_controller_filter_pump
pump_status: sensor.violet_pool_controller_pump_status
pump_speed: number.violet_pool_controller_pump_speed
pump_mode: select.violet_pool_controller_pump_mode

# Heizung
heater_entity: climate.violet_pool_controller_pool_heater
heater_target_temp: number.violet_pool_controller_heater_target_temperature
heater_mode: select.violet_pool_controller_heater_mode
pool_temp_entity: sensor.violet_pool_controller_pool_water

# Solar
solar_entity: climate.violet_pool_controller_solar_heater
solar_target_temp: number.violet_pool_controller_solar_target_temperature
solar_mode: select.violet_pool_controller_solar_mode
absorber_temp: sensor.violet_pool_controller_solarabsorber

# Dosierung
chlorine_entity: switch.violet_pool_controller_chlorine_dosing
ph_plus_entity: switch.violet_pool_controller_dosing_ph_plus
ph_minus_entity: switch.violet_pool_controller_dosing_ph_minus
flocculant_entity: switch.violet_pool_controller_flockmittel

# Chemie-Zielwerte
target_ph_entity: number.violet_pool_controller_ph_setpoint
target_orp_entity: number.violet_pool_controller_orp_setpoint
target_chlorine_entity: number.violet_pool_controller_chlorine_setpoint

# Chemie-Messwerte
ph_value_entity: sensor.violet_pool_controller_ph_value
orp_value_entity: sensor.violet_pool_controller_orp_value
chlorine_value_entity: sensor.violet_pool_controller_chlorine_content

# Abdeckung & Licht
cover_entity: cover.violet_pool_controller_pool_cover
light_entity: switch.violet_pool_controller_lighting

# Wasser
filter_pressure_entity: sensor.violet_pool_controller_filter_pressure
backwash_entity: switch.violet_pool_controller_backwash
refill_entity: switch.violet_pool_controller_nachspulung

# PV & Energie
pv_surplus_entity: switch.violet_pool_controller_pv_surplus
pv_mode: select.violet_pool_controller_pv_surplus_mode
eco_mode_entity: binary_sensor.violet_pool_controller_eco_mode
```

#### Konfiguration über dashboard.yaml

A complete `dashboard.yaml` covering every entity ships with the repository. Use it as a starting point for your own configuration:

```yaml
# dashboard.yaml - Vollständige Entitäten-Konfiguration
# Enthält alle 100+ verfügbaren Entities vom Violet Pool Controller
```

---

## Beispiele

### Vollständiges Pumpen-Setup

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_controller_filter_pump
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

# Auto-erkannte verwandte Entities:
# - Geschwindigkeit: number.violet_pool_controller_pump_speed
# - Modus: select.violet_pool_controller_pump_mode
# - Status: sensor.violet_pool_controller_pump_status
# - RPM: sensor.violet_pool_controller_pump_rpm_0
```

### Heizungs-Steuerung

```yaml
type: custom:violet-pool-card
entity: climate.violet_pool_controller_pool_heater
card_type: heater
name: "Heizung"
theme: luxury
size: medium
animation: smooth

# Mit Entity-Mappings:
heater_target_temp: number.violet_pool_controller_heater_target_temperature
heater_mode: select.violet_pool_controller_heater_mode
pool_temp_entity: sensor.violet_pool_controller_pool_water
```

### Solar-Absorber

```yaml
type: custom:violet-pool-card
entity: climate.violet_pool_controller_solar_heater
card_type: solar
name: "Solar & Absorber"
theme: luxury
size: large

# Auto-erkannte Entities:
# - Absorber Temp: sensor.violet_pool_controller_solarabsorber
# - Rücklauf: sensor.violet_pool_controller_absorber_return
# - Zieltemperatur: number.violet_pool_controller_solar_target_temperature
```

### Dosierungs-Dashboard - Chlor

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_controller_chlorine_dosing
card_type: dosing
name: "Chlor Dosierung"
dosing_type: chlorine
theme: modern
size: medium
animation: energetic
show_history: true
show_controls: true

# Automatisch erkannte Entities:
# - Status: sensor.violet_pool_controller_chlorine_dosing_state
# - Zielwert: number.violet_pool_controller_chlorine_setpoint
# - Kanister: number.violet_pool_controller_chlorine_canister_volume
```

### Dosierungs-Dashboard - pH+

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_controller_dosing_ph_plus
card_type: dosing
name: "pH+ Dosierung"
dosing_type: ph_plus
theme: modern
size: medium

# Entities:
# - Status: sensor.violet_pool_controller_ph_plus_dosing_state
# - Zielwert: number.violet_pool_controller_ph_setpoint
```

### Chemie-Überwachung

```yaml
type: custom:violet-pool-card
card_type: chemical
theme: luxury
size: large

pool_temp_entity: sensor.violet_pool_controller_pool_water
ph_value_entity: sensor.violet_pool_controller_ph_value
orp_value_entity: sensor.violet_pool_controller_orp_value
target_ph_entity: number.violet_pool_controller_ph_setpoint
target_orp_entity: number.violet_pool_controller_orp_setpoint
```

### Rückspülung & Wartung

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_controller_backwash
card_type: backwash
name: "Rückspülung"
theme: luxury
size: medium

# Verwandte Entities:
# - Status: sensor.violet_pool_controller_backwash_state
# - Runtime: sensor.violet_pool_controller_backwash_runtime
# - Nachspülung: switch.violet_pool_controller_nachspulung
```

### System-Vollbild mit allen Modulen

```yaml
type: custom:violet-pool-card
card_type: system
theme: luxury
size: fullscreen
animation: smooth
show_runtime: true
show_history: true

# Zeigt alle:
# - Extension Module 1 & 2 (je 8 Ausgänge)
# - DMX Szenen (12 Szenen)
# - Digitale Eingänge (12+ Eingänge)
# - System Status & Health
```

### Multi-Sensor Grid - Übersicht

```yaml
type: custom:violet-pool-card
card_type: overview
name: "Poolstatus"
theme: glass
size: large
show_detail_status: true
animation: smooth

# Zeigt zusammengefasste Daten von:
# - Pumpe, Heizung, Solar, Abdeckung, Licht
# - Chemie-Werte (pH, ORP, Chlor)
# - Active Devices & Alerts
```

### Alarm Center Preset

```yaml
type: custom:violet-pool-card
card_type: system
theme: midnight
layout_variant: focus
dashboard_mode: alarm_center
alarm_style: outline
accessibility_mode: high_contrast
```

### Compact Mobile Preset

```yaml
type: custom:violet-pool-card
card_type: system
size: fullscreen
layout_variant: glass
dashboard_mode: compact_mobile
accessibility_mode: reduced_motion
```

### Erweiterungs-Module

```yaml
# Extension Module 1
type: custom:violet-pool-card
card_type: compact
entities:
  - switch.violet_pool_controller_extension_1_1
  - switch.violet_pool_controller_extension_1_2
  - switch.violet_pool_controller_extension_1_3
  - switch.violet_pool_controller_extension_1_4
  - switch.violet_pool_controller_extension_1_5
  - switch.violet_pool_controller_extension_1_6
  - switch.violet_pool_controller_extension_1_7
  - switch.violet_pool_controller_extension_1_8

# Extension Module 2
type: custom:violet-pool-card
card_type: compact
entities:
  - switch.violet_pool_controller_extension_2_1
  - switch.violet_pool_controller_extension_2_2
  - switch.violet_pool_controller_extension_2_3
  - switch.violet_pool_controller_extension_2_4
  - switch.violet_pool_controller_extension_2_5
  - switch.violet_pool_controller_extension_2_6
  - switch.violet_pool_controller_extension_2_7
  - switch.violet_pool_controller_extension_2_8
```

### Maintenance, support and special cards

```yaml
type: custom:violet-pool-card
card_type: refill
name: "Nachfuellung"
layout_variant: glass
show_controls: true
water_level_entity: sensor.violet_pool_controller_wasserstand
refill_valve_entity: switch.violet_pool_controller_nachspulung
max_level: 100
```

```yaml
type: custom:violet-pool-card
card_type: flow_rate
name: "Durchfluss"
layout_variant: dashboard
show_detail_status: true
entity: sensor.violet_pool_controller_pump_flow_rate
```

```yaml
type: custom:violet-pool-card
card_type: digital_rules
name: "Digitale Regeln"
layout_variant: focus
theme: glow
```

```yaml
type: custom:violet-pool-card
card_type: diagnostics
name: "Diagnose"
layout_variant: dashboard
theme: metallic
```

### DMX Szenen-Steuerung

```yaml
type: custom:violet-pool-card
card_type: compact
name: "DMX Szenen"
entities:
  - switch.violet_pool_controller_dmx_scene_1
  - switch.violet_pool_controller_dmx_scene_2
  - switch.violet_pool_controller_dmx_scene_3
  - switch.violet_pool_controller_dmx_scene_4
  - switch.violet_pool_controller_dmx_scene_5
  - switch.violet_pool_controller_dmx_scene_6
  - switch.violet_pool_controller_dmx_scene_7
  - switch.violet_pool_controller_dmx_scene_8
  - switch.violet_pool_controller_dmx_scene_9
  - switch.violet_pool_controller_dmx_scene_10
  - switch.violet_pool_controller_dmx_scene_11
  - switch.violet_pool_controller_dmx_scene_12
```

---

## Troubleshooting

### An entity is not detected
1. Check the entity id in Home Assistant (Settings -> Devices & Services)
2. Set the entity explicitly in the card configuration
3. Adjust `entity_prefix`

### Animations are not smooth
- Try `animation: subtle` or `animation: none`
- Enable GPU acceleration in the browser
- Check the tablet hardware

### The card does not appear
1. **Restart** Home Assistant
2. Clear the browser cache
3. Check the console for errors (F12 -> Console)

---

## Technische Details

### Performance
- **Bundle-Size:** ~45KB (minified+gzipped)
- **Runtime:** < 5 ms per re-render
- **Memory:** ~2MB pro Karte-Instanz
- **GPU optimised:** will-change hints for animations

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
Bitte auf GitHub erstellen: [Issues](https://github.com/Xerolux/violet-pool-card/issues)

### Feature Requests
Im [Discussions](https://github.com/Xerolux/violet-pool-card/discussions) Forum

### Development
```bash
npm install
npm run dev      # Entwicklungs-Server
npm run build    # Production build
npm test         # Tests ausführen
```

---

## Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei

---

## Vollständige Entity-Referenz

### Hauptsteuerung (Main Control Entities)

| Komponente | Entity ID | Typ |
|-----------|-----------|-----|
| Filterpumpe | `switch.violet_pool_controller_filter_pump` | Switch |
| Heizung | `climate.violet_pool_controller_pool_heater` | Climate |
| Solar/Absorber | `climate.violet_pool_controller_solar_heater` | Climate |
| Abdeckung | `cover.violet_pool_controller_pool_cover` | Cover |
| Beleuchtung | `switch.violet_pool_controller_lighting` | Switch |

### Dosierung & Chemie (Dosing & Chemistry)

| Dosierung | Entity | Status | Zielwert |
|-----------|--------|--------|----------|
| Chlor | `switch.violet_pool_controller_chlorine_dosing` | `sensor.violet_pool_controller_chlorine_dosing_state` | `number.violet_pool_controller_chlorine_setpoint` |
| pH+ | `switch.violet_pool_controller_dosing_ph_plus` | `sensor.violet_pool_controller_ph_plus_dosing_state` | `number.violet_pool_controller_ph_setpoint` |
| pH- | `switch.violet_pool_controller_dosing_ph_minus` | `sensor.violet_pool_controller_ph_minus_dosing_state` | — |
| Flockung | `switch.violet_pool_controller_flockmittel` | `sensor.violet_pool_controller_flockung_status` | — |

### Chemie-Messwerte (Chemistry Values)

| Messwert | Entity | Min/Max | Zielwert |
|----------|--------|---------|----------|
| pH | `sensor.violet_pool_controller_ph_value` | min: `sensor.violet_pool_controller_ph_value_min`, max: `sensor.violet_pool_controller_ph_value_max` | `number.violet_pool_controller_ph_setpoint` |
| ORP/Redox | `sensor.violet_pool_controller_orp_value` | min: `sensor.violet_pool_controller_orp_value_min`, max: `sensor.violet_pool_controller_orp_value_max` | `number.violet_pool_controller_orp_setpoint` |
| Chlor | `sensor.violet_pool_controller_chlorine_content` | min: `sensor.violet_pool_controller_pot_value_min`, max: `sensor.violet_pool_controller_pot_value_max` | `number.violet_pool_controller_chlorine_setpoint` |

### Temperatur-Sensoren (Temperature Sensors)

| Sensor | Entity ID |
|--------|-----------|
| Beckenwasser | `sensor.violet_pool_controller_pool_water` |
| Außentemperatur | `sensor.violet_pool_controller_outside_temperature` |
| Solar Absorber | `sensor.violet_pool_controller_solarabsorber` |
| Absorber Rücklauf | `sensor.violet_pool_controller_absorber_return` |
| Wärmetauscher | `sensor.violet_pool_controller_heat_exchanger` |
| Heizungsspeicher | `sensor.violet_pool_controller_heat_storage` |
| OneWire 7-12 | `sensor.violet_pool_controller_onewire[7-12]_value` |

### Wasser & Durchfluss (Water & Flow)

| Komponente | Entity |
|-----------|--------|
| Überlauf-Behälter | `sensor.violet_pool_controller_overflow_tank` |
| Durchflussmesser | `sensor.violet_pool_controller_pump_flow_rate` |
| Durchflussschalter | `sensor.violet_pool_controller_flow_switch` |
| Filter-Druck | `sensor.violet_pool_controller_filter_pressure` |

### Rückspülung & Wartung (Backwash & Maintenance)

| Komponente | Entity |
|-----------|--------|
| Rückspülung | `switch.violet_pool_controller_backwash` |
| Nachspülung | `switch.violet_pool_controller_nachspulung` |
| Backwash Status | `sensor.violet_pool_controller_backwash_state` |
| Backwash Runtime | `sensor.violet_pool_controller_backwash_runtime` |
| Rückspül Status | `sensor.violet_pool_controller_backwash_status` |

### Erweiterungsmodule (Extension Modules)

| Modul | Ausgänge |
|-------|----------|
| Extension 1 | `switch.violet_pool_controller_extension_1_[1-8]` |
| Extension 2 | `switch.violet_pool_controller_extension_2_[1-8]` |

### DMX Szenen (DMX Scenes)

```yaml
DMX Scenen: switch.violet_pool_controller_dmx_szene_[1-12]
Sensoren: sensor.violet_pool_controller_dmx_scene[1-12]
```

### Digitale Eingänge (Digital Inputs)

```yaml
# Normale Eingänge
Eingänge 1-12: sensor.violet_pool_controller_input[1-12]
Binary Sensoren: binary_sensor.violet_pool_controller_digital_input_[1-12]

# Counter/Edge Eingänge
CE Eingänge: sensor.violet_pool_controller_input_ce[1-4]
CE Binary: binary_sensor.violet_pool_controller_digital_input_ce[1-4]

# Z1/Z2
Z1Z2: sensor.violet_pool_controller_inputz1z2
```

### Analoge Sensoren (Analog Sensors)

| Sensor | Entity |
|--------|--------|
| Durchflussmesser 4-20mA | `sensor.violet_pool_controller_flow_meter_4_20ma` |
| Analog Sensor 4-20mA | `sensor.violet_pool_controller_analogsensor_4_4_20ma` |
| Analog Sensor 0-10V | `sensor.violet_pool_controller_analogsensor_5_0_10v` |
| ADC6 Value | `sensor.violet_pool_controller_adc6_value` |
| Pump RS485 Power | `sensor.violet_pool_controller_pump_rs485_pwr` |

### System & Status (System & Status)

| Info | Entity |
|------|--------|
| Firmware | `sensor.violet_pool_controller_fw` |
| Software Version | `sensor.violet_pool_controller_sw_version` |
| CPU Temp | `sensor.violet_pool_controller_cpu_temp` |
| CPU Uptime | `sensor.violet_pool_controller_cpu_uptime` |
| Memory Usage | `sensor.violet_pool_controller_memory_used` |
| System Date | `sensor.violet_pool_controller_date` |
| System Time | `sensor.violet_pool_controller_time` |

### Updates & Software Management

| Entity | Type |
|--------|------|
| `update.violet_pool_card_update` | Update |
| `update.violet_pool_controller_update` | Update |
| `switch.violet_pool_controller_pre_release` | Switch (Pre-Release) |

---

## Changelog

### v2.1.0 (Aktuell)
- ✨ Vollständige Entity-Referenz dokumentiert (100+ Entities)
- ✨ dashboard.yaml mit allen Entitäten-Zuordnungen
- ✨ Support for every Violet controller module (EXT1, EXT2, DMX, dosing)
- ✨ Detaillierte OneWire-Sensor Dokumentation (Temp 1-12)
- ✨ Digital inputs and switching rules fully integrated
- 🔧 Entity mapping for advanced configuration
- 📊 System Health Monitoring erweitert
- 📋 YAML examples for every card type

### v2.0.0
- ✨ 5 neue Analytics Card-Typen (Statistics, Weather, Maintenance, Alerts, Comparison)
- ✨ 25+ neue Keyframe-Animationen
- ✨ SVG animations for dosing, chemistry and filter
- ✨ Gauge-Nadel-Animationen
- 🐛 Memory-Leak-Fixes in Slider-Komponenten
- 🔧 TypeScript-Typsicherheit erweitert
- 📊 Performance-Optimierungen mit Memoization
- ♿ Accessibility Improvements

### v1.x.x
- 13 Standard-Kartentypen
- 7 Premium-Themes (inkl. Lagoon Dark)
- RGB-Farbwähler
- Tooltip-System
- Responsive Design

---

## Danksagungen

Built for the [Violet Pool Controller](https://github.com/Xerolux/violet-hass) community.

---

## 🌐 English Version

# Violet Pool Card

A premium Lovelace dashboard card for the [Violet Pool Controller](https://github.com/Xerolux/violet-hass) Home Assistant integration.

## Key Features

- **28 Card Types** — Standard equipment + newly added expansion, monitoring, and analytics cards
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

### Erweiterungskarten (10)
Backwash, Refill, PV Surplus, Flow Rate, Inlet, Counter Current, Chlorine Canister, pH+ Canister, pH- Canister, Flocculant Canister

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

<!-- Badge Links -->
[releases-shield]: https://img.shields.io/github/release/xerolux/violet-pool-card.svg?style=for-the-badge
[releases]: https://github.com/xerolux/violet-pool-card/releases
[downloads-shield]: https://img.shields.io/github/downloads/xerolux/violet-pool-card/latest/total.svg?style=for-the-badge
[commits-shield]: https://img.shields.io/github/commit-activity/y/xerolux/violet-pool-card.svg?style=for-the-badge
[commits]: https://github.com/xerolux/violet-pool-card/commits/main
[license-shield]: https://img.shields.io/github/license/xerolux/violet-pool-card.svg?style=for-the-badge
[hacs]: https://hacs.xyz
[hacs-badge]: https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge
[discord]: https://discord.gg/Qa5fW2R
[discord-shield]: https://img.shields.io/discord/330944238910963714.svg?style=for-the-badge
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge
[forum]: https://community.home-assistant.io/
[buymeacoffee]: https://www.buymeacoffee.com/xerolux
[buymeacoffee-badge]: https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg?style=for-the-badge
