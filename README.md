# 🏊 Violet Pool Card - Premium Edition

<div align="center">

[![GitHub Release](https://img.shields.io/github/release/Xerolux/VIOLET_CARD_QUICK.svg?style=flat-square)](https://github.com/Xerolux/VIOLET_CARD_QUICK/releases)
[![GitHub Activity](https://img.shields.io/github/commit-activity/m/Xerolux/VIOLET_CARD_QUICK.svg?style=flat-square)](https://github.com/Xerolux/VIOLET_CARD_QUICK/commits/main)
[![License](https://img.shields.io/github/license/Xerolux/VIOLET_CARD_QUICK.svg?style=flat-square)](LICENSE)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square)](https://github.com/hacs/integration)

<p>
  <img src="https://img.shields.io/badge/Made%20with-Lit-324FFF?style=for-the-badge&logo=lit" alt="Made with Lit">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Size-100KB-green?style=for-the-badge" alt="Size Limit">
</p>

**The Ultimate Pool Control Experience** for Home Assistant.
Featuring iOS and OneUI inspired designs, smooth animations, and zero-dependency efficiency.

</div>

---

## 🎨 Premium Theme Gallery

The new **Premium Edition** introduces stunning themes designed to match high-end mobile operating systems.

### 💎 Luxury Theme (Default)
iOS-inspired glassmorphism with soft blurs and shadows.
![Luxury Theme](screenshots/theme_luxury_pump.png)

### 📱 Modern Theme
Clean, flat design with "squircle" corners, inspired by Samsung OneUI.
![Modern Theme](screenshots/theme_modern_heater.png)

### 🔮 Glass Theme
Deep frosted glass effect for modern dashboards.
![Glass Theme](screenshots/theme_glass_solar.png)

### ⚡ Neon Theme
High-contrast dark mode with glowing accents.
![Neon Theme](screenshots/theme_neon_dosing.png)

### 🌟 Premium Theme
The ultimate luxury experience with gradient backgrounds.
![Premium Theme](screenshots/theme_premium_pump.png)

---

## 📸 Card Types

### Pump Card
Complete control with RPM display, runtime tracking, and speed presets.
![Pump Card](screenshots/pump_card.png)

### Heater Card
Precise temperature control with outside temperature monitoring.
![Heater Card](screenshots/heater_card.png)

### Solar Card
Smart solar heating with efficiency indicators and temperature delta.
![Solar Card](screenshots/solar_card.png)

### Dosing Card
Chemical management for pH and Chlorine/ORP with history.
![Dosing Card](screenshots/dosing_card.png)

### Overview Card
At-a-glance status of your entire pool system.
![Overview Card](screenshots/overview_card.png)

### Compact Card
Minimalist one-line controls for dense dashboards.
![Compact Card](screenshots/compact_card.png)

---

## 🚀 Key Features

- **Zero Dependencies**: Optimized to <100KB for instant loading.
- **Premium UX**: Smooth transitions, animated icons, and haptic-like feedback.
- **Responsive**: Adapts from mobile screens to wall-mounted tablets.
- **Configurable**: Choose your theme, size, and animation level.
- **Smart Logic**: Automatic detection of dosing types and sensor capabilities.

---

## 📥 Installation

### HACS (Recommended)

1. Open **HACS** > **Frontend**
2. Add Custom Repository: `https://github.com/Xerolux/VIOLET_CARD_QUICK`
3. Install **Violet Pool Card**
4. Restart Home Assistant

### Manual

1. Download `violet-pool-card.js` from [Releases](https://github.com/Xerolux/VIOLET_CARD_QUICK/releases)
2. Copy to `www/violet-pool-card.js`
3. Add to Lovelace resources.

---

## ⚙️ Configuration

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
size: medium        # small, medium, large, fullscreen
theme: luxury       # luxury, modern, glass, neon, premium
animation: smooth   # none, subtle, smooth, energetic
```

### Full System Example

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: system
size: fullscreen
theme: premium
animation: energetic
```

![System View](screenshots/example_system_fullscreen.png)

---

## 📜 License

MIT License. Created by [Xerolux](https://github.com/Xerolux).
