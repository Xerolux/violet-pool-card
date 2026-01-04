# 🚀 Violet Pool Card - Premium Edition Quick Reference

## ⚡ Copy & Paste Examples

### 🏆 Best Overall (Recommended)
```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
size: medium
theme: luxury
animation: smooth
```

---

## 📏 Sizes

```yaml
size: small       # Compact (12px padding, 13px font, 20px icons)
size: medium      # Default (16px padding, 16px font, 24px icons)
size: large       # Spacious (24px padding, 16px font, 32px icons)
size: fullscreen  # Immersive (32px padding, 18px font, 48px icons)
```

---

## 🎨 Themes

```yaml
theme: luxury      # Glassmorphism, subtle gradients (DEFAULT)
theme: modern      # Clean, minimal, professional
theme: minimalist  # Ultra-clean, borderless
theme: glass       # Pure glassmorphism, deep blur
theme: neon        # Vibrant, animated RGB borders
theme: premium     # Gradient background, shine effect
```

---

## ⚡ Animations

```yaml
animation: none       # No animations, static
animation: subtle     # Minimal, professional
animation: smooth     # Balanced, pleasant (DEFAULT)
animation: energetic  # Dynamic, eye-catching
```

---

## 🎯 Quick Combinations

### Professional Office
```yaml
size: medium
theme: modern
animation: subtle
```

### Modern Smart Home
```yaml
size: large
theme: luxury
animation: smooth
```

### Gaming / Entertainment
```yaml
size: large
theme: neon
animation: energetic
```

### Minimalist Design
```yaml
size: medium
theme: minimalist
animation: none
```

### Wall Tablet / Main Display
```yaml
size: fullscreen
theme: premium
animation: energetic
```

### Background Image Dashboard
```yaml
size: large
theme: glass
animation: smooth
blur_intensity: 30
```

---

## 📋 All Card Types

```yaml
card_type: pump       # Pump control (speed, runtime)
card_type: heater     # Heater control (temperature)
card_type: solar      # Solar control (temperature delta)
card_type: dosing     # Dosing control (pH, ORP, chlorine)
card_type: overview   # Dashboard overview (all at once)
card_type: compact    # One-line compact view
card_type: system     # Full system dashboard
```

---

## 🎨 Advanced Customization

### Custom Blur
```yaml
blur_intensity: 20  # 0-30, default 10
```

### Custom Colors
```yaml
accent_color: "#FF6B35"
icon_color: "#00BCD4"
```

### Custom Gradient
```yaml
gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
```

---

## 📊 Complete Examples

### Premium Fullscreen Dashboard
```yaml
type: custom:violet-pool-card
card_type: system
size: fullscreen
theme: premium
animation: energetic
```

### Compact Sidebar
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
```

### Mixed Theme Dashboard
```yaml
type: vertical-stack
cards:
  # Large luxury overview
  - type: custom:violet-pool-card
    card_type: overview
    size: large
    theme: luxury
    animation: smooth

  # Glass theme row
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

  # Neon dosing
  - type: custom:violet-pool-card
    entity: switch.violet_pool_dos_1_cl
    card_type: dosing
    dosing_type: chlorine
    size: medium
    theme: neon
    animation: energetic
```

---

## 🔧 Legacy (Still Works!)

### Old Style
```yaml
style: standard  # or modern, luxury
show_flow_animation: true
```

### New Style (Recommended)
```yaml
theme: luxury
animation: smooth
```

---

## 📱 Responsive Behavior

- **Small**: Perfect for mobile, compact layouts
- **Medium**: Works everywhere, default choice
- **Large**: Best on tablets, large screens
- **Fullscreen**: Wall tablets, dedicated displays only

All sizes are **responsive** and adapt to screen size automatically!

---

## 🎯 Theme Selection Guide

| Theme | Best For | Design Style | Standout Feature |
|-------|----------|--------------|------------------|
| **Luxury** | Modern homes | Glassmorphism | Perfect balance |
| **Modern** | Offices | Clean minimal | Professional |
| **Minimalist** | Scandinavian | Ultra-clean | Pure simplicity |
| **Glass** | Image backgrounds | Pure glass | Deep blur |
| **Neon** | Gaming rooms | Cyberpunk | RGB glow |
| **Premium** | Showcase | High-end | Gradient shine |

---

## 💡 Pro Tips

1. **Match Your Home**: Choose theme that fits interior design
2. **Size for Device**: Small for phones, large for tablets
3. **Animation Energy**: Subtle for offices, energetic for entertainment
4. **Mix & Match**: Different themes per card works great!
5. **Fullscreen Magic**: Use for dedicated pool control displays
6. **Glass + Background**: Glass theme amazing with dashboard backgrounds

---

## 🚀 Getting Started

1. **Install**: Add via HACS
2. **Choose Size**: Start with `medium`
3. **Pick Theme**: Try `luxury` first
4. **Set Animation**: Use `smooth`
5. **Adjust**: Tweak to your liking!

---

## 📊 Performance

- **Bundle**: 97KB (optimized)
- **FPS**: 60 (smooth animations)
- **Blur**: Hardware-accelerated
- **Mobile**: Touch-optimized
- **Responsive**: All screens

---

## 🌟 Unique Features

✨ **Only pool card with**:
- 4 flexible sizes
- 6 premium themes
- Glassmorphism effects
- RGB animated borders
- Fullscreen mode
- Complete design system

---

## 📖 Full Docs

- **README.md** - Complete documentation
- **PREMIUM_FEATURES.md** - Detailed theme guide
- **PREMIUM_NAMES.md** - Repository naming ideas
- **VIOLET_CARD_EXAMPLES.yaml** - Configuration examples

---

**Made with ❤️ for the ultimate pool control experience**

*Premium design because your pool deserves it!* 🏊‍♂️✨
