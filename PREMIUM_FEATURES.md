# 🌟 Violet Pool Card - Premium Edition

## 🎨 Premium Design System - Complete Overview

### ✨ What's New in Premium Edition?

The **Violet Pool Card Premium Edition** is the ultimate custom Lovelace card for pool control, offering:

- **4 Card Sizes** - From compact to fullscreen
- **6 Premium Themes** - Professional to luxury designs
- **3 Animation Levels** - Subtle to energetic
- **Advanced Effects** - Glassmorphism, gradients, glows
- **Best UX on Market** - Pool is luxury, the card should be too

---

## 📏 Card Sizes

### Small
- **Padding**: 12px
- **Font Size**: 13px
- **Icon Size**: 20px
- **Use Case**: Dense dashboards, sidebar widgets
- **Perfect For**: Multiple cards in limited space

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
size: small
```

### Medium (Default)
- **Padding**: 16px
- **Font Size**: 16px
- **Icon Size**: 24px
- **Use Case**: Standard dashboards
- **Perfect For**: Balanced layout with good readability

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
size: medium  # or omit (default)
```

### Large
- **Padding**: 24px
- **Font Size**: 16px
- **Icon Size**: 32px
- **Use Case**: Main control panels, tablets
- **Perfect For**: Prominent display with enhanced visuals

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
size: large
```

### Fullscreen
- **Padding**: 32px
- **Font Size**: 18px
- **Icon Size**: 48px
- **Min Height**: calc(100vh - 100px)
- **Use Case**: Wall-mounted tablets, dedicated displays
- **Perfect For**: Immersive, room-filling control experience

```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: system
size: fullscreen
```

---

## 🎨 Premium Themes

### 1. Luxury (Default)
**Style**: Enhanced Glassmorphism

**Features**:
- Frosted glass background with blur
- Subtle gradient overlays
- Inset shadows for depth
- Light/dark mode adaptive

**Best For**: Modern smart homes, contemporary designs

**Example**:
```yaml
theme: luxury
animation: smooth
```

**Visual Characteristics**:
- Background: `rgba(255, 255, 255, 0.95)` with 20px blur
- Border: 2px solid with transparency
- Shadow: Soft, layered shadows
- Effect: Premium glassmorphism

---

### 2. Modern
**Style**: Clean & Minimal

**Features**:
- Flat design with subtle elevation
- Smooth hover effects
- Clean borders
- Professional appearance

**Best For**: Professional setups, office environments

**Example**:
```yaml
theme: modern
animation: subtle
```

**Visual Characteristics**:
- Background: Solid card background
- Border: 1px subtle divider
- Shadow: Minimal elevation
- Effect: Smooth transitions

---

### 3. Minimalist
**Style**: Ultra-Clean

**Features**:
- Borderless design
- Maximum simplicity
- Subtle separators
- Focus on content

**Best For**: Scandinavian design, minimalist aesthetics

**Example**:
```yaml
theme: minimalist
animation: none
```

**Visual Characteristics**:
- Background: Clean solid color
- Border: None (header divider only)
- Shadow: Barely visible
- Effect: Pure simplicity

---

### 4. Glass
**Style**: Pure Glassmorphism

**Features**:
- Deep blur effects (30px)
- Transparent backgrounds
- Frosted glass appearance
- Layered depth

**Best For**: Layered dashboards, background images

**Example**:
```yaml
theme: glass
animation: smooth
blur_intensity: 30
```

**Visual Characteristics**:
- Background: `rgba(255, 255, 255, 0.1)` with 30px blur
- Border: Subtle transparency
- Shadow: Soft depth
- Effect: True glass morphism

---

### 5. Neon
**Style**: Vibrant & Energetic

**Features**:
- Animated RGB borders
- Dark gradient backgrounds
- Glowing effects
- High energy aesthetics

**Best For**: Gaming rooms, entertainment areas, modern tech spaces

**Example**:
```yaml
theme: neon
animation: energetic
```

**Visual Characteristics**:
- Background: Dark gradient (navy/purple)
- Border: Animated RGB glow
- Shadow: Colorful glow effects
- Effect: Cyberpunk vibes

**Animation**: 6s gradient rotation around border

---

### 6. Premium
**Style**: High-End Luxury

**Features**:
- Luxury gradient backgrounds
- Animated shine effects
- White text on gradient
- Ultimate premium feel

**Best For**: Main displays, showcase installations, luxury homes

**Example**:
```yaml
theme: premium
animation: energetic
size: fullscreen
```

**Visual Characteristics**:
- Background: Purple gradient (#667eea → #764ba2)
- Border: None
- Shadow: Deep, colorful shadows
- Effect: Rotating radial shine

**Animation**: 8s continuous shine rotation

---

## ⚡ Animation Levels

### None
```yaml
animation: none
```
- No animations
- Static display
- Maximum performance
- For low-end devices

### Subtle
```yaml
animation: subtle
```
- Minimal movement
- Professional appearance
- Soft glow on active
- For business environments

### Smooth (Default)
```yaml
animation: smooth
```
- Balanced animations
- Pleasant motion
- Scale on active
- For standard use

### Energetic
```yaml
animation: energetic
```
- Dynamic effects
- Pulsing animations
- Eye-catching
- For entertainment spaces

---

## 🎯 Recommended Combinations

### 🏢 Professional Office
```yaml
size: medium
theme: modern
animation: subtle
```

### 🏡 Modern Home
```yaml
size: large
theme: luxury
animation: smooth
```

### 🎮 Gaming Room
```yaml
size: large
theme: neon
animation: energetic
```

### 🖼️ Art Gallery / Minimalist
```yaml
size: medium
theme: minimalist
animation: none
```

### 📱 Wall Tablet
```yaml
size: fullscreen
theme: premium
animation: energetic
```

### 🌃 Night Mode Background
```yaml
size: large
theme: glass
animation: smooth
blur_intensity: 30
```

---

## 💡 Advanced Customization

### Custom Blur Intensity
```yaml
blur_intensity: 20  # 0-30, default 10
```

### Custom Accent Color
```yaml
accent_color: "#FF6B35"
icon_color: "#FF6B35"
```

### Gradient Override
```yaml
gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
```

---

## 📊 Performance Notes

- **Bundle Size**: 97KB (optimized)
- **Animation Performance**: 60 FPS
- **Blur Performance**: Hardware-accelerated
- **Mobile Optimized**: Touch-friendly
- **Responsive**: All screen sizes

---

## 🚀 Quick Start Examples

### Complete Premium Dashboard
```yaml
title: Pool Control
views:
  - path: pool
    title: Pool
    cards:
      # Fullscreen Main Display
      - type: custom:violet-pool-card
        card_type: system
        size: fullscreen
        theme: premium
        animation: energetic

      # Alternative: Individual Cards
      - type: vertical-stack
        cards:
          - type: custom:violet-pool-card
            card_type: overview
            size: large
            theme: luxury
            animation: smooth

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

          - type: custom:violet-pool-card
            entity: switch.violet_pool_dos_1_cl
            card_type: dosing
            dosing_type: chlorine
            size: medium
            theme: neon
            animation: energetic
```

---

## 🎨 Theme Comparison Chart

| Theme | Style | Blur | Gradient | Animation | Best For |
|-------|-------|------|----------|-----------|----------|
| **Luxury** | Glassmorphism | ✓✓ | Subtle | Built-in | Modern homes |
| **Modern** | Clean | ✗ | ✗ | Hover | Professional |
| **Minimalist** | Ultra-clean | ✗ | ✗ | ✗ | Scandinavian |
| **Glass** | Pure glass | ✓✓✓ | ✗ | Built-in | Layered UI |
| **Neon** | Cyberpunk | ✗ | RGB | Border | Gaming |
| **Premium** | Luxury | ✗ | ✓✓✓ | Shine | Showcase |

---

## 📝 Migration Guide

### From Old to New Config

**Old (Legacy)**:
```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
style: luxury
show_flow_animation: true
```

**New (Premium)**:
```yaml
type: custom:violet-pool-card
entity: switch.violet_pool_pump
card_type: pump
size: medium
theme: luxury
animation: smooth
```

**Note**: Old configs still work (backward compatible)!

---

## 🌟 Why Premium Edition?

1. **Pool is Luxury** - Your pool control should look premium too
2. **Flexibility** - From small to fullscreen, choose what fits
3. **Variety** - 6 themes means perfect match for any home
4. **Animations** - Bring life to your dashboard
5. **Best UX** - Smooth, intuitive, beautiful
6. **Market Leader** - Best pool card available

---

Created with ❤️ for the ultimate pool control experience.
