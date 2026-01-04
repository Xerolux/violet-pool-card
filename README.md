# 🏊 Violet Pool Card - Premium Edition

[![GitHub Release](https://img.shields.io/github/release/Xerolux/VIOLET_CARD_QUICK.svg?style=flat-square)](https://github.com/Xerolux/VIOLET_CARD_QUICK/releases)
[![GitHub Activity](https://img.shields.io/github/commit-activity/m/Xerolux/VIOLET_CARD_QUICK.svg?style=flat-square)](https://github.com/Xerolux/VIOLET_CARD_QUICK/commits/main)
[![License](https://img.shields.io/github/license/Xerolux/VIOLET_CARD_QUICK.svg?style=flat-square)](LICENSE)
[![hacs](https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square)](https://github.com/hacs/integration)
[![Validate](https://github.com/Xerolux/VIOLET_CARD_QUICK/actions/workflows/validate.yml/badge.svg)](https://github.com/Xerolux/VIOLET_CARD_QUICK/actions/workflows/validate.yml)

[![Buy Me A Coffee](https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg?style=flat-square)](https://www.buymeacoffee.com/xerolux)
[![PayPal](https://img.shields.io/badge/paypal-donate-blue.svg?style=flat-square)](https://paypal.me/xerolux)
[![Ko-fi](https://img.shields.io/badge/ko--fi-donate-red.svg?style=flat-square)](https://ko-fi.com/xerolux)

**The Ultimate Premium Lovelace Card** for the [Violet Pool Controller](https://github.com/Xerolux/violet-hass) integration for Home Assistant.

> 🌟 **Luxury Design** · **Flexible Sizes** · **6 Premium Themes** · **Advanced Animations** · **Best-in-Class UX**

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-Lit-324FFF?style=for-the-badge&logo=lit" alt="Made with Lit">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Home%20Assistant-41BDF5?style=for-the-badge&logo=home-assistant&logoColor=white" alt="Home Assistant">
</p>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [📸 Screenshots](#-screenshots)
- [📥 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🎴 Card Types](#-card-types)
- [📖 Examples](#-examples)
- [🛠️ Development](#️-development)
- [🤝 Contributing](#-contributing)
- [💝 Support](#-support)
- [📜 License](#-license)

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

## 📸 Screenshots & Design Showcase

### Premium Theme Gallery

#### 🌟 Luxury Theme (Default)
```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
size: large
theme: luxury
animation: smooth
```
- **Glassmorphism** with enhanced blur effects
- **Subtle gradients** for depth
- **Inset shadows** for premium feel
- **Perfect for** modern dashboards

#### 🎯 Modern Theme
```yaml
type: custom:violet-pool-card
entity: climate.violet_pool_heater
card_type: heater
size: medium
theme: modern
animation: subtle
```
- **Clean lines** and minimal design
- **Smooth hover effects**
- **Elevation on interaction**
- **Perfect for** professional setups

#### 💎 Glass Theme
```yaml
type: custom:violet-pool-card
entity: climate.violet_pool_solar
card_type: solar
size: large
theme: glass
animation: smooth
```
- **Pure glassmorphism** with deep blur
- **Transparent backgrounds**
- **Frosted glass effect**
- **Perfect for** layered dashboards

#### ⚡ Neon Theme
```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_dos_1_cl
card_type: dosing
size: medium
theme: neon
animation: energetic
```
- **Vibrant animated borders**
- **Dark gradient backgrounds**
- **RGB glow effects**
- **Perfect for** gaming rooms

#### 👑 Premium Theme
```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
size: fullscreen
theme: premium
animation: energetic
```
- **Luxury gradient backgrounds**
- **Animated shine effects**
- **High-end feel**
- **Perfect for** main displays

### Size Comparison

#### Small - Perfect for compact dashboards
```yaml
size: small    # 12px padding, 13px font
```

#### Medium - Balanced default (Recommended)
```yaml
size: medium   # 16px padding, 16px font (default)
```

#### Large - Spacious and prominent
```yaml
size: large    # 24px padding, 16px font, 32px icons
```

#### Fullscreen - Immersive experience
```yaml
size: fullscreen   # 32px padding, 18px font, 48px icons, full viewport
```

### Pump Card
```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
show_runtime: true
```
- Animated rotating icon when running
- RPM display for current speed
- Speed slider (OFF/ECO/Normal/Boost)
- Runtime counter (2h 34min)
- Quick action buttons

### Heater Card
```yaml
type: custom:violet-pool-card
entity: climate.violet_pool_heater
card_type: heater
```
- Animated pulsing icon when heating
- Current vs target temperature
- Outside temperature warning
- Temperature slider (18-35°C)
- Blockage status display

### Solar Card
```yaml
type: custom:violet-pool-card
entity: climate.violet_pool_solar
card_type: solar
```
- Pool vs absorber temperature
- Temperature delta with color hints
  - 🔴 Too cold (negative delta)
  - 🟡 Heating possible (0-3°C)
  - 🟢 Ideal (>3°C)
- Target temperature control

### Dosing Card
```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_dos_1_cl
card_type: dosing
dosing_type: chlorine
show_history: true
```
- Auto-detect dosing type
- Current → Target display (650mV → 700mV)
- Min/Max thresholds
- Manual dosing buttons (30s/60s)
- 24h volume history

### Overview Card
```yaml
type: custom:violet-pool-card
card_type: overview
```
- Water chemistry dashboard
  - Temperature: 24.5°C ✅
  - pH: 7.2 ✅
  - ORP: 650mV ⚠️
- Active devices list
- Warnings & alerts
- "All systems normal" indicator

### Compact Card
```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: compact
```
- One-line compact display
- Auto-detected icons
- Current values (temp, level, pH, ORP)
- Status badge
- Perfect for dashboards

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

### Legacy Options (Backward Compatible)

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `style` | string | `standard` | Legacy: `standard`, `modern`, or `luxury` |
| `show_flow_animation` | boolean | `false` | Legacy: Enable animated flow effects |

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
|------|------|---------|-------------|
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

### Compact Modern Dashboard

```yaml
type: vertical-stack
cards:
  - type: custom:violet-pool-card
    entity: switch.violet_pool_pump
    card_type: compact
    size: small
    theme: modern

  - type: custom:violet-pool-card
    entity: climate.violet_pool_heater
    card_type: compact
    size: small
    theme: modern

  - type: custom:violet-pool-card
    entity: climate.violet_pool_solar
    card_type: compact
    size: small
    theme: modern
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

### Compact Dashboard

```yaml
type: vertical-stack
cards:
  - type: custom:violet-pool-card
    entity: switch.violet_pool_pump
    card_type: compact

  - type: custom:violet-pool-card
    entity: climate.violet_pool_heater
    card_type: compact

  - type: custom:violet-pool-card
    entity: climate.violet_pool_solar
    card_type: compact

  - type: custom:violet-pool-card
    entity: switch.violet_pool_dos_1_cl
    card_type: compact
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

### Project Structure

```
violet-pool-card/
├── src/
│   ├── violet-pool-card.ts          # Main card class
│   ├── components/                   # Reusable components
│   │   ├── status-badge.ts
│   │   ├── value-display.ts
│   │   ├── detail-status.ts
│   │   ├── warning-chips.ts
│   │   ├── slider-control.ts
│   │   └── quick-actions.ts
│   └── utils/                        # Helper utilities
│       ├── service-caller.ts
│       └── entity-helper.ts
├── dist/                             # Build output
│   └── violet-pool-card.js
├── .github/
│   ├── workflows/
│   │   ├── release.yml              # Release automation
│   │   └── validate.yml             # Build validation
│   └── FUNDING.yml                   # Sponsorship info
├── package.json
├── tsconfig.json
├── rollup.config.mjs
├── hacs.json
├── README.md
├── CHANGELOG.md
└── LICENSE
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

[![Buy Me A Coffee](https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg?style=for-the-badge)](https://www.buymeacoffee.com/xerolux)
[![PayPal](https://img.shields.io/badge/paypal-donate-blue.svg?style=for-the-badge)](https://paypal.me/xerolux)
[![Ko-fi](https://img.shields.io/badge/ko--fi-donate-red.svg?style=for-the-badge)](https://ko-fi.com/xerolux)

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
