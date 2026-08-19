/**
 * Violet Pool Card – dropdown data for the visual editor
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Kept apart from the editor element so the option lists and the event
 * handling can be tested without a browser.
 */

/** One entry of a dropdown. */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Read the picked value out of a `selected` event.
 *
 * Home Assistant rewrote `<ha-select>`: the current one is its own element
 * that reports the choice as `detail.value`, while the older,
 * Material-Web-based one only updated its own `value` property. Accepting both
 * keeps the editor working across Home Assistant versions.
 */
/** Every card type the card can render - see the switch in violet-pool-card.ts. */
export const CARD_TYPE_OPTIONS: SelectOption[] = [
  { value: 'pump', label: '🔵 Pump' },
  { value: 'heater', label: '🔥 Heater' },
  { value: 'solar', label: '☀️ Solar' },
  { value: 'dosing', label: '💧 Dosing' },
  { value: 'cover', label: '🪟 Cover' },
  { value: 'light', label: '💡 Light' },
  { value: 'filter', label: '⏰ Filter' },
  { value: 'backwash', label: '🔄 Backwash' },
  { value: 'refill', label: '💧 Refill' },
  { value: 'overflow', label: '⚠️ Overflow' },
  { value: 'error', label: '🚨 Error Dashboard' },
  { value: 'solar_surplus', label: '☀️ PV Surplus' },
  { value: 'flow_rate', label: '💨 Flow Rate' },
  { value: 'inlet', label: '➡️ Inlet' },
  { value: 'counter_current', label: '🏊 Counter Current' },
  { value: 'chlorine_canister', label: '🧪 Chlorine Canister' },
  { value: 'ph_plus_canister', label: '➕ pH Plus Canister' },
  { value: 'ph_minus_canister', label: '➖ pH Minus Canister' },
  { value: 'flocculant_canister', label: '✨ Flocculant Canister' },
  { value: 'digital_rules', label: '📜 Digital Rules' },
  { value: 'calibration', label: '🎯 Calibration' },
  { value: 'update', label: '⬆️ Firmware Update' },
  { value: 'diagnostics', label: '🩺 Diagnostics' },
  { value: 'overview', label: '📊 Overview' },
  { value: 'compact', label: '📋 Compact' },
  { value: 'system', label: '🖥️ System Dashboard' },
  { value: 'details', label: '📝 Details' },
  { value: 'chemical', label: '🧪 Chemistry' },
  { value: 'sensor', label: '📡 Sensor' },
];

export const DOSING_TYPE_OPTIONS: SelectOption[] = [
  { value: 'chlorine', label: '💧 Chlorine (ORP)' },
  { value: 'ph_minus', label: '➖ pH Minus' },
  { value: 'ph_plus', label: '➕ pH Plus' },
  { value: 'flocculant', label: '🌊 Flocculant' },
];

export const SHADOW_INTENSITY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Default' },
  { value: 'none', label: 'None' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const LAYOUT_VARIANT_OPTIONS: SelectOption[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'glass', label: 'Glass UI' },
  { value: 'dashboard', label: 'Dashboard Focus' },
  { value: 'focus', label: 'Alert Focus' },
];

export const ALARM_STYLE_OPTIONS: SelectOption[] = [
  { value: 'soft', label: 'Soft' },
  { value: 'outline', label: 'Outline' },
  { value: 'pulse', label: 'Pulse' },
];

export const ACCESSIBILITY_OPTIONS: SelectOption[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'high_contrast', label: 'High Contrast' },
  { value: 'reduced_motion', label: 'Reduced Motion' },
];

export const DASHBOARD_MODE_OPTIONS: SelectOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'operations', label: 'Operations' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'compact_mobile', label: 'Compact Mobile' },
  { value: 'alarm_center', label: 'Alarm Center' },
];

export const CHEMISTRY_TYPE_OPTIONS: SelectOption[] = [
  { value: 'chlorine', label: '🧪 Chlorine Pool' },
  { value: 'salt', label: '🧂 Salt Water Pool' },
  { value: 'bromine', label: '🔄 Bromine Pool' },
  { value: 'ozone', label: '🌊 Ozone Pool' },
];

export const ALERT_LEVEL_OPTIONS: SelectOption[] = [
  { value: 'all', label: '🔔 Alle Abweichungen' },
  { value: 'warning', label: '⚠️ Warnungen und kritische Werte' },
  { value: 'critical', label: '🚨 Nur kritische Werte' },
  { value: 'none', label: '🔕 Keine Wasserwert-Meldungen' },
];

export function selectedValue(ev: Event): string | undefined {
  const detail = (ev as CustomEvent<{ value?: string | number }>).detail;
  if (detail && detail.value !== undefined && detail.value !== null) {
    return String(detail.value);
  }
  return (ev.target as { value?: string } | null)?.value;
}
