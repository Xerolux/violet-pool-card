import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TDS,
  isMissing,
  saturationIndex,
  saturationLevel,
  type SaturationResult,
} from '../src/utils/saturation-index';

/**
 * Requested on the forum: show the saturation index on the chemistry card.
 *
 * The number tells people whether their water dissolves plaster or deposits
 * scale, so the formula is pinned against cases that can be checked by hand
 * rather than against whatever the implementation happened to return.
 */

const BALANCED = {
  ph: 7.5,
  temperatureC: 25,
  calciumHardness: 300,
  totalAlkalinity: 100,
  tds: 1000,
};

/** Narrow for the tests that expect a computed result. */
const computed = (input: Parameters<typeof saturationIndex>[0]): SaturationResult => {
  const result = saturationIndex(input);
  if (isMissing(result)) {
    throw new Error(`expected an index, got missing: ${result.missing.join(', ')}`);
  }
  return result;
};

describe('the textbook balanced pool', () => {
  /**
   * pH 7.5, 25 °C, 300 ppm calcium hardness, 100 ppm alkalinity, 1000 ppm TDS.
   * Worked through by hand:
   *   A = (log10(1000) - 1) / 10            = 0.200
   *   B = -13.12 * log10(298.15) + 34.55    = 2.086
   *   C = log10(300) - 0.4                  = 2.077
   *   D = log10(100)                        = 2.000
   *   pHs = 9.3 + 0.200 + 2.086 - 4.077     = 7.509
   *   LSI = 7.5 - 7.509                     = -0.009
   */
  it('comes out at zero', () => {
    const result = computed(BALANCED);
    expect(result.index).toBeCloseTo(0, 1);
    expect(result.phSaturation).toBeCloseTo(7.51, 1);
    expect(result.level).toBe('balanced');
  });
});

describe('which way the index moves', () => {
  it('a lower pH makes the water more corrosive', () => {
    expect(computed({ ...BALANCED, ph: 7.0 }).index).toBeLessThan(
      computed(BALANCED).index
    );
    expect(computed({ ...BALANCED, ph: 6.8 }).level).toBe('corrosive');
  });

  it('a higher pH makes it scaling', () => {
    expect(computed({ ...BALANCED, ph: 8.2 }).level).toBe('scaling');
  });

  it('warmer water scales sooner', () => {
    expect(computed({ ...BALANCED, temperatureC: 32 }).index).toBeGreaterThan(
      computed({ ...BALANCED, temperatureC: 18 }).index
    );
  });

  it('more calcium hardness raises it', () => {
    expect(computed({ ...BALANCED, calciumHardness: 600 }).index).toBeGreaterThan(
      computed(BALANCED).index
    );
  });

  it('more alkalinity raises it', () => {
    expect(computed({ ...BALANCED, totalAlkalinity: 200 }).index).toBeGreaterThan(
      computed(BALANCED).index
    );
  });

  it('doubling the calcium hardness moves it by log10(2)', () => {
    const delta =
      computed({ ...BALANCED, calciumHardness: 600 }).index - computed(BALANCED).index;
    expect(delta).toBeCloseTo(Math.log10(2), 2);
  });
});

describe('cyanuric acid', () => {
  it('lowers the index, because cyanurate does not buffer', () => {
    const withCya = computed({ ...BALANCED, cyanuricAcid: 60 });
    expect(withCya.index).toBeLessThan(computed(BALANCED).index);
    expect(withCya.cyaCorrected).toBe(true);
    expect(withCya.carbonateAlkalinity).toBeLessThan(BALANCED.totalAlkalinity);
  });

  it('is not applied when no value is given', () => {
    const result = computed(BALANCED);
    expect(result.cyaCorrected).toBe(false);
    expect(result.carbonateAlkalinity).toBe(BALANCED.totalAlkalinity);
  });

  it('never drives the carbonate alkalinity to zero or below', () => {
    const result = computed({
      ...BALANCED,
      totalAlkalinity: 20,
      cyanuricAcid: 300,
    });
    expect(result.carbonateAlkalinity).toBeGreaterThan(0);
    expect(Number.isFinite(result.index)).toBe(true);
  });
});

describe('missing inputs are reported, never assumed', () => {
  it.each([
    ['ph', { ...BALANCED, ph: undefined }],
    ['temperatureC', { ...BALANCED, temperatureC: undefined }],
    ['calciumHardness', { ...BALANCED, calciumHardness: undefined }],
    ['totalAlkalinity', { ...BALANCED, totalAlkalinity: undefined }],
  ])('%s missing means no index', (field, input) => {
    const result = saturationIndex(input);
    expect(isMissing(result)).toBe(true);
    if (isMissing(result)) {
      expect(result.missing).toContain(field);
    }
  });

  it('lists every missing input at once', () => {
    const result = saturationIndex({ ph: 7.4 });
    expect(isMissing(result)).toBe(true);
    if (isMissing(result)) {
      expect(result.missing).toEqual(
        expect.arrayContaining(['temperatureC', 'calciumHardness', 'totalAlkalinity'])
      );
    }
  });

  it('TDS is the one input that falls back to a default', () => {
    const withoutTds = computed({ ...BALANCED, tds: undefined });
    const withDefault = computed({ ...BALANCED, tds: DEFAULT_TDS });
    expect(withoutTds.index).toBe(withDefault.index);
  });

  it('a zero or negative reading counts as missing, not as a value', () => {
    const result = saturationIndex({ ...BALANCED, calciumHardness: 0 });
    expect(isMissing(result)).toBe(true);
  });

  it('a freezing pool is still a temperature, not a missing input', () => {
    expect(isMissing(saturationIndex({ ...BALANCED, temperatureC: 0 }))).toBe(false);
  });
});

describe('the bands', () => {
  it.each([
    [-1.2, 'corrosive'],
    [-0.31, 'corrosive'],
    [-0.3, 'balanced'],
    [0, 'balanced'],
    [0.3, 'balanced'],
    [0.31, 'scaling'],
    [1.5, 'scaling'],
  ])('%s is %s', (index, expected) => {
    expect(saturationLevel(index)).toBe(expected);
  });
});
