# 🎨 Actions & Colors Integration Guide

## ✅ Integration Complete!

Die Action Handlers und State Colors sind jetzt in der Haupt-Card integriert und bereit zur Nutzung!

---

## 🎯 Action Handlers - Usage

### In Card Render hinzufügen:

```typescript
// Beispiel: Pump Card mit Actions
<ha-card
  class="${this._getCardClasses(isActive, config)}"
  @click="${(e: Event) => this._handleTap(e, config.entity!)}"
  @dblclick="${(e: Event) => this._handleDoubleTap(e, config.entity!)}"
  @mousedown="${(e: Event) => this._handleHoldStart(e, config.entity!)}"
  @mouseup="${() => this._handleHoldEnd()}"
  @touchstart="${(e: Event) => this._handleHoldStart(e, config.entity!)}"
  @touchend="${() => this._handleHoldEnd()}"
>
  <!-- Card Content -->
</ha-card>
```

### YAML Configuration:

```yaml
# Single Tap: Toggle
tap_action:
  action: toggle

# Hold (500ms): More Info
hold_action:
  action: more-info

# Double Tap: Call Service
double_tap_action:
  action: call-service
  service: violet_pool_controller.control_pump
  service_data:
    action: 'on'
    speed: 3
```

---

## 🎨 State Colors - Usage

### Temperature Coloring:

```typescript
// In renderHeaterCard:
const currentTemp = parseFloat(entity.attributes.current_temperature);
const tempColor = this._getTemperatureColor(currentTemp);

// Apply to element:
<div class="temp-display" style="color: ${tempColor}">
  ${currentTemp}°C
</div>

// Or with background:
const tempConfig = StateColorHelper.getTemperatureColor(currentTemp);
const bgColor = this._getStateBackground(tempConfig);

<div style="background: ${bgColor}; color: ${tempColor}">
  ${currentTemp}°C
</div>
```

**Color Ranges**:
- < 15°C → 🔵 Blue `#2196F3`
- 15-20°C → 💧 Cyan `#00BCD4`
- 20-26°C → 🟢 Green `#4CAF50`
- 26-30°C → 🟠 Orange `#FF9800`
- \> 30°C → 🔴 Red `#F44336`

---

### pH Coloring:

```typescript
// In renderDosingCard:
const currentPh = parseFloat(entity.attributes.ph_value);
const targetPh = parseFloat(entity.attributes.target_ph) || 7.2;
const phColor = this._getPhColor(currentPh, targetPh);

<div style="color: ${phColor}">
  pH ${currentPh.toFixed(1)}
</div>
```

**Color Ranges** (from target):
- ±0.1 → 🟢 Green (Perfect)
- ±0.3 → 🟢 Light Green (Good)
- ±0.5 → 🟠 Orange (Attention)
- \>±0.5 → 🔴 Red (Critical)

---

### ORP/Chlorine Coloring:

```typescript
// In renderDosingCard (Chlorine):
const currentOrp = parseFloat(entity.attributes.orp_value);
const targetOrp = parseFloat(entity.attributes.target_orp) || 700;
const orpColor = this._getOrpColor(currentOrp, targetOrp);

<div style="color: ${orpColor}">
  ${currentOrp} mV
</div>
```

**Color Ranges** (from target):
- <target-100 → 🔴 Red (Too low)
- <target-50 → 🟠 Orange (Low)
- ±50 → 🟢 Green (Good)
- \>target+50 → 🟠 Orange (High)
- \>target+100 → 🔴 Red (Too high)

---

### Pump Speed Coloring:

```typescript
// In renderPumpCard:
const currentSpeed = parsedState.level || 0;
const speedColor = this._getPumpSpeedColor(currentSpeed);

<div class="speed-indicator" style="color: ${speedColor}">
  Speed ${currentSpeed}
</div>
```

**Color Map**:
- 0 (OFF) → ⚫ Gray `#757575`
- 1 (ECO) → 🔵 Blue `#2196F3`
- 2 (Normal) → 🟢 Green `#4CAF50`
- 3 (Boost) → 🟠 Orange `#FF9800`

---

### Entity State Coloring:

```typescript
// For any entity state:
const stateColor = StateColorHelper.getEntityStateColor(entity.state);

<div style="background: ${this._getStateBackground(stateColor)}">
  State: ${entity.state}
</div>
```

**Color Map**:
- ON/Active → 🟢 Green
- OFF/Idle → ⚫ Gray
- AUTO → 🔵 Blue
- MANUAL → 🟠 Orange
- Blocked/Error → 🔴 Red
- Warning → 🟡 Amber

---

## 📊 Available Helper Methods

### In VioletPoolCard class:

**Action Handlers**:
```typescript
_handleTap(event: Event, entity: string): void
_handleHoldStart(event: Event, entity: string): void
_handleHoldEnd(): void
_handleDoubleTap(event: Event, entity: string): void
_createActionHandler(entity: string): ActionHandler
```

**Color Helpers**:
```typescript
_getTemperatureColor(temp: number): string
_getPhColor(ph: number, target?: number): string
_getOrpColor(orp: number, target?: number): string
_getPumpSpeedColor(speed: number): string
_getStateBackground(colorConfig): string
```

---

## 🎯 Complete Example: Enhanced Pump Card

```typescript
private renderPumpCard(config: VioletPoolCardConfig): TemplateResult {
  const entity = this.hass.states[config.entity!];
  const pumpState = entity.attributes?.PUMPSTATE || '';
  const parsedState = EntityHelper.parsePumpState(pumpState);
  const currentSpeed = parsedState.level || 0;

  // Get state colors
  const speedColor = this._getPumpSpeedColor(currentSpeed);
  const speedConfig = StateColorHelper.getPumpSpeedColor(currentSpeed);
  const speedBg = this._getStateBackground(speedConfig);

  const isActive = entity.state === 'on';

  return html`
    <ha-card
      class="${this._getCardClasses(isActive, config)}"
      @click="${(e: Event) => this._handleTap(e, config.entity!)}"
      @dblclick="${(e: Event) => this._handleDoubleTap(e, config.entity!)}"
      @mousedown="${(e: Event) => this._handleHoldStart(e, config.entity!)}"
      @mouseup="${() => this._handleHoldEnd()}"
      @touchstart="${(e: Event) => this._handleHoldStart(e, config.entity!)}"
      @touchend="${() => this._handleHoldEnd()}"
    >
      <div class="card-content">
        <!-- Header with state coloring -->
        <div class="header">
          <ha-icon icon="mdi:pump" style="color: ${speedColor}"></ha-icon>
          <span>${config.name || 'Pump'}</span>
        </div>

        <!-- Speed indicator with background -->
        <div class="speed-indicator" style="
          background: ${speedBg};
          color: ${speedColor};
          border: 2px solid ${speedColor};
        ">
          <span class="speed-label">Speed ${currentSpeed}</span>
          <span class="speed-name">${this._getSpeedName(currentSpeed)}</span>
        </div>

        <!-- Rest of card content... -->
      </div>
    </ha-card>
  `;
}
```

---

## 🎨 Visual Examples

### Temperature Display:

```
15°C ← 🔵 Blue
20°C ← 🟢 Green (Ideal)
28°C ← 🟠 Orange
32°C ← 🔴 Red
```

### pH Display:

```
Target: 7.2

7.2 ← 🟢 Green (Perfect ±0.1)
7.4 ← 🟢 Light Green (Good ±0.3)
7.6 ← 🟠 Orange (Attention ±0.5)
7.9 ← 🔴 Red (Critical >±0.5)
```

### ORP Display:

```
Target: 700 mV

550 mV ← 🔴 Red (Too low)
650 mV ← 🟠 Orange (Low)
700 mV ← 🟢 Green (Good)
750 mV ← 🟠 Orange (High)
850 mV ← 🔴 Red (Too high)
```

### Pump Speed:

```
OFF  ← ⚫ Gray
ECO  ← 🔵 Blue
Normal ← 🟢 Green
Boost ← 🟠 Orange
```

---

## 🚀 Usage Tips

### 1. **Consistent Coloring**
Use the same color helper for related values:
```typescript
// All temperature values should use same helper
const poolTemp = this._getTemperatureColor(24.5);
const solarTemp = this._getTemperatureColor(22.0);
const heaterTemp = this._getTemperatureColor(26.0);
```

### 2. **Background Opacity**
Use `_getStateBackground()` for subtle backgrounds:
```typescript
const colorConfig = StateColorHelper.getTemperatureColor(temp);
const bg = this._getStateBackground(colorConfig);
// Returns: rgba(76, 175, 80, 0.15) for low intensity
```

### 3. **Custom Targets**
Always pass custom targets for pH and ORP:
```typescript
const targetPh = entity.attributes.target_ph || 7.2;
const phColor = this._getPhColor(currentPh, targetPh);
```

### 4. **Action Priority**
Actions are prioritized:
1. Double-tap (if within 300ms of first tap)
2. Hold (if held for 500ms)
3. Tap (default)

### 5. **Mobile Haptics**
Hold actions automatically vibrate on mobile (50ms)

---

## ✅ Integration Checklist

- [x] Action Handlers imported
- [x] State Colors imported
- [x] Helper methods added to VioletPoolCard
- [x] Event handlers created (_handleTap, _handleHold, etc.)
- [x] Color helpers created (_getTemperatureColor, etc.)
- [ ] Applied to Pump Card (Example ready)
- [ ] Applied to Heater Card
- [ ] Applied to Solar Card
- [ ] Applied to Dosing Card
- [ ] Applied to Overview Card
- [ ] Applied to System Card

**Status**: Core utilities integrated, ready for full deployment! ✅

---

## 🎯 Next Steps

1. Apply action handlers to all ha-card elements
2. Apply state colors to all value displays
3. Test all actions (tap/hold/double-tap)
4. Test all color ranges with real data
5. Create screenshots
6. Update README

---

**Actions & Colors are ready to make your cards SMART and BEAUTIFUL!** 🎨✨
