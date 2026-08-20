/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Utility: Thresholds - user-configurable limits for the water values
 *
 * Up to v0.3.0 every limit (pH 7.0-7.4, ORP 650-750 mV, ...) was hardcoded.
 * The card therefore reported values as "out of range" that were perfectly
 * fine for the pool in question. Since v0.4.0 every range can be set from the
 * card configuration:
 *
 * ```yaml
 * type: custom:violet-pool-card
 * card_type: chemical
 * thresholds:
 *   ph: { min: 7.0, max: 7.6, warn: 0.2, range: [6.5, 8.0] }
 *   orp: { min: 600, max: 800 }
 *   chlorine: { min: 0.3, max: 1.5 }
 *   temperature: { min: 24, max: 30 }
 * alerts: warning   # all | warning | critical | none
 * ```
 *
 * Created by Xerolux | MIT License
 */

import { i18n } from './i18n';

/** How a reading rates against its configured target range. */
export type ThresholdLevel = 'ok' | 'warning' | 'critical' | 'unknown';

/** Which side of the target range the value sits on. */
export type ThresholdSide = 'low' | 'in' | 'high' | 'unknown';

/** Which metric - decides the defaults and the status texts. */
export type MetricKey = 'ph' | 'orp' | 'chlorine' | 'salt' | 'temperature' | 'cyanuric_acid' | 'alkalinity';

/**
 * A user-configurable threshold block.
 * Every field is optional; unset fields fall back to the defaults.
 */
export interface ThresholdBandConfig {
  /** Lower bound of the optimal range. */
  min?: number;
  /** Upper bound of the optimal range. */
  max?: number;
  /**
   * Tolerance beyond min/max that still counts as "warning" rather than
   * "critical". Example pH: min 7.0, warn 0.2 -> 6.8-7.0 warns, < 6.8 is
   * critical.
   */
  warn?: number;
  /** Displayed span of the scale/gauge as [from, to]. */
  range?: [number, number];
  /** Exclude this metric from alarm and status evaluation entirely. */
  ignore?: boolean;
}

/** A fully resolved threshold block - no optional fields left. */
export interface ThresholdBand {
  min: number;
  max: number;
  warn: number;
  range: [number, number];
  ignore: boolean;
}

export type ThresholdsConfig = Partial<Record<MetricKey, ThresholdBandConfig>>;
export type ResolvedThresholds = Record<MetricKey, ThresholdBand>;

/**
 * How talkative the card should be about deviations.
 * - `all`      - every deviation is reported (default, the behaviour up to v0.3.0)
 * - `warning`  - warnings and critical values only (no informational noise)
 * - `critical` - critical values only
 * - `none`     - no water-value notices at all
 */
export type AlertLevel = 'all' | 'warning' | 'critical' | 'none';

/**
 * Default target ranges.
 * Based on DIN 19643 and the usual recommendations for private pools.
 */
export const DEFAULT_THRESHOLDS: ResolvedThresholds = {
  ph: { min: 7.0, max: 7.4, warn: 0.2, range: [6.5, 8.0], ignore: false },
  orp: { min: 650, max: 750, warn: 50, range: [500, 900], ignore: false },
  chlorine: { min: 0.5, max: 1.5, warn: 0.3, range: [0, 3], ignore: false },
  salt: { min: 3000, max: 4000, warn: 500, range: [2000, 5000], ignore: false },
  temperature: { min: 24, max: 30, warn: 3, range: [18, 35], ignore: false },
  cyanuric_acid: { min: 30, max: 50, warn: 20, range: [0, 100], ignore: false },
  alkalinity: { min: 80, max: 120, warn: 20, range: [0, 200], ignore: false },
};

export const METRIC_KEYS: MetricKey[] = [
  'ph',
  'orp',
  'chlorine',
  'salt',
  'temperature',
  'cyanuric_acid',
  'alkalinity',
];

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

/**
 * Reads a configured number and falls back to the default on nonsense
 * (null, NaN, a string typed into the YAML editor, ...).
 */
function num(value: unknown, fallback: number): number {
  if (isFiniteNumber(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

/**
 * Resolves a single threshold block against the defaults and repairs
 * contradictory input, so the card never renders with min > max.
 */
export function resolveBand(metric: MetricKey, config?: ThresholdBandConfig): ThresholdBand {
  const base = DEFAULT_THRESHOLDS[metric];
  if (!config) return { ...base, range: [...base.range] as [number, number] };

  let min = num(config.min, base.min);
  let max = num(config.max, base.max);
  if (min > max) [min, max] = [max, min];

  const warn = Math.max(0, num(config.warn, base.warn));

  // Displayed span: configured, otherwise the default - but always wide enough
  // to keep the target range and its warning tolerance fully visible.
  const rawRange = Array.isArray(config.range) && config.range.length === 2 ? config.range : base.range;
  let rangeMin = num(rawRange[0], base.range[0]);
  let rangeMax = num(rawRange[1], base.range[1]);
  if (rangeMin > rangeMax) [rangeMin, rangeMax] = [rangeMax, rangeMin];

  const span = Math.max(max - min, Number.EPSILON);
  const padding = Math.max(warn, span * 0.5);
  rangeMin = Math.min(rangeMin, min - padding);
  rangeMax = Math.max(rangeMax, max + padding);
  if (rangeMax - rangeMin < Number.EPSILON) rangeMax = rangeMin + 1;

  return {
    min,
    max,
    warn,
    range: [rangeMin, rangeMax],
    ignore: config.ignore === true,
  };
}

/** Resolves every threshold of a card configuration. */
export function resolveThresholds(config?: ThresholdsConfig): ResolvedThresholds {
  const resolved = {} as ResolvedThresholds;
  for (const metric of METRIC_KEYS) {
    resolved[metric] = resolveBand(metric, config?.[metric]);
  }
  return resolved;
}

/** Normalisiert die `alerts`-Option; unbekannte Werte ergeben `all`. */
export function resolveAlertLevel(value?: string, showAlerts?: boolean): AlertLevel {
  if (showAlerts === false) return 'none';
  switch (value) {
    case 'none':
    case 'critical':
    case 'warning':
    case 'all':
      return value;
    default:
      return 'all';
  }
}

/** Ergebnis einer Messwert-Bewertung. */
export interface ThresholdEvaluation {
  level: ThresholdLevel;
  side: ThresholdSide;
  /** true while the value is inside the target range (or deliberately ignored). */
  ok: boolean;
  /** Position of the value inside the displayed span, 0-100. */
  percent: number;
  band: ThresholdBand;
  value?: number;
}

/**
 * Rates a reading against its target range.
 * Within `warn` beyond min/max -> warning, anything further -> critical.
 */
export function evaluate(value: number | undefined, band: ThresholdBand): ThresholdEvaluation {
  if (value === undefined || !Number.isFinite(value)) {
    return { level: 'unknown', side: 'unknown', ok: true, percent: 0, band, value: undefined };
  }

  const percent = percentOfRange(value, band.range);

  if (band.ignore) {
    return { level: 'ok', side: 'in', ok: true, percent, band, value };
  }

  if (value < band.min) {
    const level: ThresholdLevel = value >= band.min - band.warn ? 'warning' : 'critical';
    return { level, side: 'low', ok: false, percent, band, value };
  }

  if (value > band.max) {
    const level: ThresholdLevel = value <= band.max + band.warn ? 'warning' : 'critical';
    return { level, side: 'high', ok: false, percent, band, value };
  }

  return { level: 'ok', side: 'in', ok: true, percent, band, value };
}

/** Position of a value inside a range, 0-100, clamped. */
export function percentOfRange(value: number, range: [number, number]): number {
  const [min, max] = range;
  if (!(max > min)) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

/**
 * Colour matching the rating - consistent across the whole card.
 *
 * Deliberately a hex literal rather than `var(--vpc-...)`: the colour also
 * ends up in SVG presentation attributes (`fill`, `stroke`), where `var()` is
 * invalid - which left the gauge needle and value arc invisible. The values
 * match the defaults from `:host`.
 */
export function levelColor(level: ThresholdLevel): string {
  switch (level) {
    case 'critical':
      return '#FF3B30';
    case 'warning':
      return '#FF9F0A';
    case 'unknown':
      return '#8E8E93';
    default:
      return '#34C759';
  }
}

/**
 * Status text for a rating - uses the existing i18n keys and therefore stays
 * consistent with the translations already in place.
 */
export function levelLabel(evaluation: ThresholdEvaluation): string {
  if (evaluation.level === 'unknown') return i18n.t('unknown');
  if (evaluation.ok) return i18n.t('optimal');
  if (evaluation.side === 'low') {
    return evaluation.level === 'critical' ? i18n.t('status_too_low') : i18n.t('status_low');
  }
  return evaluation.level === 'critical' ? i18n.t('status_too_high') : i18n.t('status_elevated');
}

/** true when a deviation of this level is reported at the chosen alert level. */
export function shouldReport(level: ThresholdLevel, alertLevel: AlertLevel): boolean {
  if (level === 'ok' || level === 'unknown') return false;
  switch (alertLevel) {
    case 'none':
      return false;
    case 'critical':
      return level === 'critical';
    case 'warning':
    case 'all':
    default:
      return true;
  }
}

/**
 * Formats a target range for tooltips ("7.0 - 7.4").
 * `decimals` controls the decimal places of the metric in question.
 */
export function formatRange(band: ThresholdBand, decimals: number, unit = ''): string {
  const suffix = unit ? ` ${unit}` : '';
  return `${band.min.toFixed(decimals)} – ${band.max.toFixed(decimals)}${suffix}`;
}

/** Übliche Nachkommastellen je Messgröße. */
export const METRIC_DECIMALS: Record<MetricKey, number> = {
  ph: 1,
  orp: 0,
  chlorine: 2,
  salt: 0,
  temperature: 1,
  cyanuric_acid: 0,
  alkalinity: 0,
};

/** Unit per metric, for tooltips and gauge labels. */
export const METRIC_UNITS: Record<MetricKey, string> = {
  ph: '',
  orp: 'mV',
  chlorine: 'mg/l',
  salt: 'ppm',
  temperature: '°C',
  cyanuric_acid: 'mg/l',
  alkalinity: 'mg/l',
};
