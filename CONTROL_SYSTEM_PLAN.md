# Complete Control System Implementation Plan
## v0.2.0 Release – Based on Firmware Analysis

### Phase 1: Control Cards Expansion
- [ ] **Pump Card v2** - Speed Slider (0-3), Eco/Boost Modes, Anti-Freeze Toggle
- [ ] **Heater Card v2** - Target Temp, Postrun Delay, Boiler Status
- [ ] **Solar Card v2** - Forced Flush, Anti-Freeze, PV Surplus Integration
- [ ] **Dosing Cards v2** - Target Level Sliders, Manual/Auto Toggle, Daytime Restrictions

### Phase 2: Rule Management UI
- [ ] **Temperature Rules** - Dual-Sensor, Hysterese Display
- [ ] **Analog Rules** - ADC Threshold Configuration
- [ ] **Switching Rules** - DI Input Management
- [ ] **Timer Rules** - Cron-like Scheduling UI

### Phase 3: System Dashboard
- [ ] **State Hierarchy Visualization** - 0-6 State System Display
- [ ] **Health Metrics** - Poll Rate, Latency, Request Count
- [ ] **Error Display** - Severity-based Error UI
- [ ] **Device Overview** - Multi-Controller Support

### Phase 4: Service Integration
- [ ] ServiceCaller: Control Methods (setPumpSpeed, configureHeater, etc.)
- [ ] ServiceCaller: Configuration Methods (setTargetLevel, configureRule, etc.)
- [ ] ServiceCaller: Diagnostic Methods (getHealthMetrics, getErrorSummary)

### Phase 5: Design & UX
- [ ] Consistent Card Design Language
- [ ] Responsive Layout (Mobile/Desktop)
- [ ] Dark Mode Support
- [ ] Accessibility (WCAG 2.1 AA)

### Phase 6: Translations
- [ ] English (en.json)
- [ ] German (de.json) - COMPLETE
- [ ] Additional Languages (es, fr, it, nl, pl, pt, ru, zh)

---

## Key Design Principles

1. **State Hierarchy**: Always show 0-6 state with priority indication
2. **Visual Feedback**: Real-time status updates via animated SVGs
3. **Safety First**: Confirmation dialogs for critical operations
4. **Mobile First**: Touch-friendly controls and responsive layouts
5. **Accessibility**: Keyboard navigation, screen reader support

## Service Architecture

All control operations map to violet_pool_controller domain services:
- `control_pump_http` → Speed, Mode, Duration
- `control_heater_http` → Target Temp, Postrun
- `control_solar_http` → Flush, Mode
- `manual_dosing_http` → Chemical, Duration
- `configure_*` → Rule and system configuration
- `get_*_status` → Status queries with response data

---

Generated: 2026-06-14
Status: In Progress
