/**
 * Violet Pool Card - Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Utility: Integration Attributes - reads the attributes the Violet Pool
 * Controller integration actually publishes.
 *
 * The card used to read raw controller keys off the entity: `PUMPSTATE`,
 * `PUMP_RPM_0..3`, `DOS_1_CL_STATE`. The integration does not pass those
 * through - it publishes its own, differently named attributes
 * (`pump_speed_level`, `mode`, `dosing_status`, ...). Every one of those reads
 * therefore came back undefined, which is why a running pump was drawn as
 * "OFF": the speed fell back to 0.
 *
 * Each reader below prefers the integration's attribute and falls back to the
 * raw key, so an installation that does expose the raw values still works.
 *
 * Created by Xerolux | MIT License
 */

export type Attributes = Record<string, unknown> | undefined;

const num = (value: unknown): number | undefined => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/**
 * Speed level of the pump, 0-3.
 *
 * @returns The level, or `undefined` when nothing reports one.
 */
export function pumpSpeedLevel(attributes: Attributes): number | undefined {
  if (!attributes) return undefined;

  // What the integration publishes.
  const level = num(attributes.pump_speed_level);
  if (level !== undefined) return level;

  // "3|PUMP_ANTI_FREEZE" - the raw state key, if it is passed through.
  const raw = attributes.PUMPSTATE ?? attributes.raw_state;
  if (typeof raw === 'string' && raw.trim() !== '') {
    const parsed = num(raw.split('|')[0]);
    if (parsed !== undefined) return parsed;
  }

  // Last resort: the highest RPM band that reports a non-zero speed.
  let fromRpm: number | undefined;
  for (let band = 0; band < 4; band += 1) {
    const rpm = num(attributes[`PUMP_RPM_${band}`]);
    if (rpm !== undefined && rpm > 0) fromRpm = band;
  }
  return fromRpm;
}

/**
 * Operating mode of a switch, e.g. "Manual ON (Forced)".
 */
export function operatingMode(attributes: Attributes): string | undefined {
  if (!attributes) return undefined;
  for (const key of ['mode', 'state_name', 'status_description']) {
    const value = attributes[key];
    if (typeof value === 'string' && value.trim() !== '') return value;
  }
  return undefined;
}

/**
 * Daily runtime in seconds.
 *
 * The controller delivers `"04h 33m 12s"`, and the integration passes that
 * string straight through. `Number()` on it is NaN, so the card showed 0.
 */
export function runtimeSeconds(attributes: Attributes): number | undefined {
  if (!attributes) return undefined;
  const raw = attributes.runtime;

  const plain = num(raw);
  if (plain !== undefined) return plain;

  if (typeof raw !== 'string') return undefined;

  // "04h 33m 12s"
  const spelled = raw.match(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?\s*(?:(\d+)\s*s)?/i);
  if (spelled && (spelled[1] || spelled[2] || spelled[3])) {
    return Number(spelled[1] ?? 0) * 3600 + Number(spelled[2] ?? 0) * 60 + Number(spelled[3] ?? 0);
  }

  // "HH:MM:SS"
  const colons = raw.split(':').map((part) => Number(part));
  if (colons.length === 3 && colons.every((part) => Number.isFinite(part))) {
    return colons[0] * 3600 + colons[1] * 60 + colons[2];
  }

  return undefined;
}

/**
 * Human-readable dosing status, e.g. "Blocked by thresholds".
 */
export function dosingStatus(attributes: Attributes): string | undefined {
  if (!attributes) return undefined;

  const status = attributes.dosing_status;
  if (typeof status === 'string' && status.trim() !== '') return status;

  // The raw `DOS_*_STATE` key, which arrives as a list.
  const rawKey = Object.keys(attributes).find(
    (key) => key.includes('DOS_') && key.includes('_STATE')
  );
  const raw = rawKey ? attributes[rawKey] : undefined;
  if (Array.isArray(raw) && raw.length) {
    return raw.map((entry) => String(entry).replace(/_/g, ' ')).join(', ');
  }
  return undefined;
}

/**
 * Millilitres dosed today.
 */
export function dosedTodayMl(attributes: Attributes): number | undefined {
  if (!attributes) return undefined;
  return num(attributes.daily_amount_ml) ?? num(attributes.dosing_volume_24h);
}

/**
 * Whether the controller reports this output as active, independent of the
 * Home Assistant on/off state.
 */
export function reportsActive(attributes: Attributes): boolean | undefined {
  if (!attributes) return undefined;
  return typeof attributes.is_active === 'boolean' ? attributes.is_active : undefined;
}
