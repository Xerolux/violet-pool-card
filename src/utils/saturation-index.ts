/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Utility: water balance - the Langelier Saturation Index (LSI).
 *
 * Requested on the forum: the chemistry card should be able to show "CSI bzw.
 * LSI". What it computes is the **Langelier** index, in its classic continuous
 * form, and it says so on the card - the Calcite Saturation Index used by some
 * pool calculators additionally models ionic strength and activity
 * coefficients, and quietly labelling one as the other would be misleading
 * about a number people dose their pool by.
 *
 *     pHs = (9.3 + A + B) - (C + D)
 *     A   = (log10(TDS) - 1) / 10
 *     B   = -13.12 * log10(T_Kelvin) + 34.55
 *     C   = log10(calcium hardness as CaCO3) - 0.4
 *     D   = log10(carbonate alkalinity as CaCO3)
 *     LSI = pH - pHs
 *
 * Sanity check, the textbook balanced pool: pH 7.5, 25 °C, 300 ppm calcium
 * hardness, 100 ppm alkalinity, 1000 ppm TDS gives LSI ≈ 0.00. That case is
 * pinned in `tests/saturation-index.test.ts`.
 *
 * The controller measures pH and water temperature. Calcium hardness,
 * alkalinity, cyanuric acid and TDS come from a test kit, so the card takes
 * them from the configuration - either as a fixed number or as an entity, so
 * an `input_number` helper can carry the last test result.
 *
 * Cyanuric acid matters because a stabilised pool's alkalinity reading
 * includes cyanurate, which does not buffer like carbonate. When a CYA value
 * is given, its pH-dependent share is subtracted before the index is computed;
 * without one the measured alkalinity is used unchanged.
 */

/** Where the index puts the water. */
export type SaturationLevel = 'corrosive' | 'balanced' | 'scaling';

/** Everything the index needs. Missing pieces are reported, not guessed. */
export interface SaturationInputs {
  /** Measured pH. */
  ph?: number;
  /** Water temperature in °C. */
  temperatureC?: number;
  /** Calcium hardness as ppm CaCO3. */
  calciumHardness?: number;
  /** Total alkalinity as ppm CaCO3, as the test kit reports it. */
  totalAlkalinity?: number;
  /** Cyanuric acid in ppm. Optional; corrects the alkalinity when present. */
  cyanuricAcid?: number;
  /** Total dissolved solids in ppm. Defaults to 1000. */
  tds?: number;
}

export interface SaturationResult {
  /** The index, rounded to two decimals. */
  index: number;
  /** The pH at which this water would be saturated. */
  phSaturation: number;
  level: SaturationLevel;
  /** The alkalinity the index was computed with, after any CYA correction. */
  carbonateAlkalinity: number;
  /** True when a cyanuric acid value was supplied and applied. */
  cyaCorrected: boolean;
}

/** Which inputs were missing, by the name the card shows for them. */
export interface SaturationMissing {
  missing: ReadonlyArray<keyof SaturationInputs>;
}

/**
 * Below and above this the water is no longer considered balanced. The band
 * is the one the pool industry uses: outside ±0.3 the water either dissolves
 * plaster and corrodes metal, or deposits scale.
 */
export const SATURATION_BALANCED_RANGE = 0.3;

/** Default TDS when the configuration names none, in ppm. */
export const DEFAULT_TDS = 1000;

/**
 * The share of a cyanuric acid reading that shows up in a total alkalinity
 * test, at the pH range pools are kept in. The cyanurate fraction rises with
 * pH; these are the values commonly used for correction.
 */
function cyanurateShare(ph: number): number {
  if (ph <= 7.0) return 0.19;
  if (ph <= 7.2) return 0.22;
  if (ph <= 7.4) return 0.26;
  if (ph <= 7.6) return 0.30;
  if (ph <= 7.8) return 0.33;
  if (ph <= 8.0) return 0.36;
  return 0.39;
}

/** A finite, positive number - anything else cannot enter a logarithm. */
function usable(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

/**
 * Computes the index.
 *
 * @returns The result, or the list of inputs that were missing or unusable.
 *   Reporting them is deliberate: a saturation index computed from assumed
 *   hardness would look authoritative and be wrong.
 */
export function saturationIndex(
  inputs: SaturationInputs
): SaturationResult | SaturationMissing {
  const tds = usable(inputs.tds) ? inputs.tds : DEFAULT_TDS;

  const missing: Array<keyof SaturationInputs> = [];
  if (!usable(inputs.ph)) missing.push('ph');
  if (typeof inputs.temperatureC !== 'number' || !Number.isFinite(inputs.temperatureC)) {
    missing.push('temperatureC');
  }
  if (!usable(inputs.calciumHardness)) missing.push('calciumHardness');
  if (!usable(inputs.totalAlkalinity)) missing.push('totalAlkalinity');
  if (missing.length > 0) {
    return { missing };
  }

  const ph = inputs.ph as number;
  const temperatureC = inputs.temperatureC as number;
  const calciumHardness = inputs.calciumHardness as number;
  const totalAlkalinity = inputs.totalAlkalinity as number;

  const cyaCorrected = usable(inputs.cyanuricAcid);
  const carbonateAlkalinity = cyaCorrected
    ? Math.max(1, totalAlkalinity - (inputs.cyanuricAcid as number) * cyanurateShare(ph))
    : totalAlkalinity;

  const a = (Math.log10(tds) - 1) / 10;
  const b = -13.12 * Math.log10(temperatureC + 273.15) + 34.55;
  const c = Math.log10(calciumHardness) - 0.4;
  const d = Math.log10(carbonateAlkalinity);

  const phSaturation = 9.3 + a + b - (c + d);
  const index = ph - phSaturation;

  return {
    index: Math.round(index * 100) / 100,
    phSaturation: Math.round(phSaturation * 100) / 100,
    level: saturationLevel(index),
    carbonateAlkalinity: Math.round(carbonateAlkalinity),
    cyaCorrected,
  };
}

/** Where an index value falls. */
export function saturationLevel(index: number): SaturationLevel {
  if (index < -SATURATION_BALANCED_RANGE) return 'corrosive';
  if (index > SATURATION_BALANCED_RANGE) return 'scaling';
  return 'balanced';
}

/** True when the call could not produce an index. */
export function isMissing(
  result: SaturationResult | SaturationMissing
): result is SaturationMissing {
  return 'missing' in result;
}
