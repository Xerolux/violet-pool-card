/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Utility: Thresholds – benutzerdefinierte Grenzwerte für die Wasserwerte
 *
 * Bis v0.3.0 waren alle Grenzwerte (pH 7.0–7.4, ORP 650–750 mV, …) fest im
 * Code verdrahtet. Dadurch meldete die Karte Werte als "außerhalb des
 * Bereichs", die für den jeweiligen Pool völlig in Ordnung waren.
 * Ab v0.4.0 lassen sich alle Bereiche über die Karten-Konfiguration setzen:
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
 * Erstellt von Xerolux | MIT License
 */

import { i18n } from './i18n';

/** Bewertung eines Messwerts relativ zum konfigurierten Zielbereich. */
export type ThresholdLevel = 'ok' | 'warning' | 'critical' | 'unknown';

/** Auf welcher Seite des Zielbereichs der Wert liegt. */
export type ThresholdSide = 'low' | 'in' | 'high' | 'unknown';

/** Welche Messgröße – bestimmt Standardwerte und Statustexte. */
export type MetricKey = 'ph' | 'orp' | 'chlorine' | 'salt' | 'temperature' | 'cyanuric_acid' | 'alkalinity';

/**
 * Vom Benutzer konfigurierbarer Grenzwert-Block.
 * Alle Felder sind optional; nicht gesetzte Felder fallen auf die Defaults zurück.
 */
export interface ThresholdBandConfig {
  /** Untere Grenze des Optimalbereichs. */
  min?: number;
  /** Obere Grenze des Optimalbereichs. */
  max?: number;
  /**
   * Toleranz ausserhalb von min/max, die nur als "Warnung" (nicht "kritisch")
   * gilt. Beispiel pH: min 7.0, warn 0.2 → 6.8–7.0 ist Warnung, < 6.8 kritisch.
   */
  warn?: number;
  /** Anzeigebereich der Skala/Gauge als [von, bis]. */
  range?: [number, number];
  /** Diese Messgröße komplett von der Alarm-/Statusbewertung ausnehmen. */
  ignore?: boolean;
}

/** Vollständig aufgelöster Grenzwert-Block (keine optionalen Felder mehr). */
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
 * Wie geschwätzig die Karte bei Abweichungen sein soll.
 * - `all`      – jede Abweichung wird gemeldet (Standard, Verhalten bis v0.3.0)
 * - `warning`  – nur Warnungen und kritische Werte (kein Info-Rauschen)
 * - `critical` – nur kritische Werte
 * - `none`     – keine Wasserwert-Hinweise
 */
export type AlertLevel = 'all' | 'warning' | 'critical' | 'none';

/**
 * Standard-Zielbereiche.
 * Orientiert an DIN 19643 / typischen Empfehlungen für private Pools.
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
 * Liest einen konfigurierten Zahlenwert und fällt bei Unsinn (null, NaN,
 * String aus dem YAML-Editor …) auf den Default zurück.
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
 * Löst einen einzelnen Grenzwert-Block gegen die Defaults auf und repariert
 * widersprüchliche Eingaben, damit die Karte niemals mit min > max rendert.
 */
export function resolveBand(metric: MetricKey, config?: ThresholdBandConfig): ThresholdBand {
  const base = DEFAULT_THRESHOLDS[metric];
  if (!config) return { ...base, range: [...base.range] as [number, number] };

  let min = num(config.min, base.min);
  let max = num(config.max, base.max);
  if (min > max) [min, max] = [max, min];

  const warn = Math.max(0, num(config.warn, base.warn));

  // Anzeigebereich: konfiguriert, sonst Default – aber immer so weit, dass der
  // Zielbereich samt Warntoleranz vollständig sichtbar bleibt.
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

/** Löst alle Grenzwerte einer Karten-Konfiguration auf. */
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
  /** true, solange der Wert im Zielbereich liegt (oder bewusst ignoriert wird). */
  ok: boolean;
  /** Position 0–100 des Werts innerhalb des Anzeigebereichs. */
  percent: number;
  band: ThresholdBand;
  value?: number;
}

/**
 * Bewertet einen Messwert gegen seinen Zielbereich.
 * Innerhalb `warn` ausserhalb von min/max → Warnung, darüber hinaus → kritisch.
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

/** Position eines Werts (0–100) innerhalb eines Bereichs, geklemmt. */
export function percentOfRange(value: number, range: [number, number]): number {
  const [min, max] = range;
  if (!(max > min)) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

/**
 * Farbe passend zur Bewertung – konsistent über die ganze Karte.
 *
 * Bewusst als Hex-Literal und nicht als `var(--vpc-…)`: Die Farbe landet auch
 * in SVG-Präsentationsattributen (`fill`, `stroke`), und dort ist `var()`
 * ungültig – der Zeiger und der Wertbogen der Gauges blieben dadurch unsichtbar.
 * Die Werte entsprechen den Defaults aus `:host`.
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
 * Statustext zu einer Bewertung – nutzt die vorhandenen i18n-Schlüssel und
 * bleibt dadurch mit der bestehenden Übersetzung konsistent.
 */
export function levelLabel(evaluation: ThresholdEvaluation): string {
  if (evaluation.level === 'unknown') return i18n.t('unknown');
  if (evaluation.ok) return i18n.t('optimal');
  if (evaluation.side === 'low') {
    return evaluation.level === 'critical' ? i18n.t('status_too_low') : i18n.t('status_low');
  }
  return evaluation.level === 'critical' ? i18n.t('status_too_high') : i18n.t('status_elevated');
}

/** true, wenn eine Abweichung dieser Stufe beim gewählten Alarm-Level gemeldet wird. */
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
 * Formatiert einen Zielbereich für Tooltips ("7.0 – 7.4").
 * `decimals` steuert die Nachkommastellen der jeweiligen Messgröße.
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

/** Einheit je Messgröße (für Tooltips und Gauge-Beschriftung). */
export const METRIC_UNITS: Record<MetricKey, string> = {
  ph: '',
  orp: 'mV',
  chlorine: 'mg/l',
  salt: 'ppm',
  temperature: '°C',
  cyanuric_acid: 'mg/l',
  alkalinity: 'mg/l',
};
