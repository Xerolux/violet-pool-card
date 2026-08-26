import { describe, it, expect } from 'vitest';
import {
  DEFAULT_THRESHOLDS,
  evaluate,
  formatRange,
  levelColor,
  levelLabel,
  percentOfRange,
  resolveAlertLevel,
  resolveBand,
  resolveOrpBand,
  resolveThresholds,
  shouldReport,
} from '../src/utils/thresholds';

describe('resolveBand', () => {
  it('falls back to the defaults when nothing is configured', () => {
    expect(resolveBand('ph')).toEqual(DEFAULT_THRESHOLDS.ph);
  });

  it('applies a user-configured range', () => {
    const band = resolveBand('ph', { min: 6.8, max: 7.8 });
    expect(band.min).toBe(6.8);
    expect(band.max).toBe(7.8);
  });

  it('swaps min and max when they are entered the wrong way round', () => {
    const band = resolveBand('orp', { min: 800, max: 600 });
    expect(band.min).toBe(600);
    expect(band.max).toBe(800);
  });

  it('accepts numeric strings coming from the YAML editor', () => {
    const band = resolveBand('orp', { min: '620' as unknown as number, max: '780' as unknown as number });
    expect(band.min).toBe(620);
    expect(band.max).toBe(780);
  });

  it('ignores NaN / null and keeps the default', () => {
    const band = resolveBand('chlorine', { min: Number.NaN, max: null as unknown as number });
    expect(band.min).toBe(DEFAULT_THRESHOLDS.chlorine.min);
    expect(band.max).toBe(DEFAULT_THRESHOLDS.chlorine.max);
  });

  it('widens the display range so the whole target band stays visible', () => {
    const band = resolveBand('ph', { min: 6.0, max: 8.6 });
    expect(band.range[0]).toBeLessThanOrEqual(6.0);
    expect(band.range[1]).toBeGreaterThanOrEqual(8.6);
  });

  it('never produces a zero-width display range', () => {
    const band = resolveBand('ph', { min: 7.2, max: 7.2, warn: 0, range: [7.2, 7.2] });
    expect(band.range[1]).toBeGreaterThan(band.range[0]);
  });

  it('resolves every metric at once', () => {
    const all = resolveThresholds({ orp: { min: 600 } });
    expect(all.orp.min).toBe(600);
    expect(all.ph).toEqual(DEFAULT_THRESHOLDS.ph);
  });
});

describe('evaluate', () => {
  const ph = resolveBand('ph');

  it('reports ok inside the target band', () => {
    const result = evaluate(7.2, ph);
    expect(result.ok).toBe(true);
    expect(result.level).toBe('ok');
    expect(result.side).toBe('in');
  });

  it('treats the band edges as ok', () => {
    expect(evaluate(7.0, ph).ok).toBe(true);
    expect(evaluate(7.4, ph).ok).toBe(true);
  });

  it('warns inside the tolerance and escalates beyond it', () => {
    expect(evaluate(6.9, ph).level).toBe('warning');
    expect(evaluate(6.7, ph).level).toBe('critical');
    expect(evaluate(7.5, ph).level).toBe('warning');
    expect(evaluate(7.9, ph).level).toBe('critical');
  });

  it('records which side of the band the value is on', () => {
    expect(evaluate(6.5, ph).side).toBe('low');
    expect(evaluate(7.9, ph).side).toBe('high');
  });

  it('returns unknown for missing or non-numeric readings', () => {
    expect(evaluate(undefined, ph).level).toBe('unknown');
    expect(evaluate(Number.NaN, ph).level).toBe('unknown');
  });

  it('honours a user-widened band – 7.6 is fine when max is 7.8', () => {
    const wide = resolveBand('ph', { min: 7.0, max: 7.8 });
    expect(evaluate(7.6, wide).ok).toBe(true);
  });

  it('suppresses the alert entirely when the metric is ignored', () => {
    const ignored = resolveBand('orp', { ignore: true });
    expect(evaluate(950, ignored).ok).toBe(true);
  });
});

describe('resolveOrpBand', () => {
  it('centres the default-width band on the live controller target', () => {
    const band = resolveOrpBand(undefined, 850);

    expect(band.min).toBe(800);
    expect(band.max).toBe(900);
    expect(evaluate(859, band).ok).toBe(true);
  });

  it('keeps explicit card limits instead of the controller target', () => {
    const band = resolveOrpBand({ min: 650, max: 750 }, 850);

    expect(band.min).toBe(650);
    expect(band.max).toBe(750);
    expect(evaluate(859, band).side).toBe('high');
  });

  it('falls back to the standard ORP band without a valid target', () => {
    expect(resolveOrpBand(undefined, Number.NaN)).toEqual(DEFAULT_THRESHOLDS.orp);
  });
});

describe('percentOfRange', () => {
  it('maps a value onto its display range', () => {
    expect(percentOfRange(7.25, [6.5, 8.0])).toBeCloseTo(50, 5);
  });

  it('clamps out-of-range values', () => {
    expect(percentOfRange(4, [6.5, 8.0])).toBe(0);
    expect(percentOfRange(12, [6.5, 8.0])).toBe(100);
  });

  it('returns 0 for a degenerate range instead of NaN', () => {
    expect(percentOfRange(5, [5, 5])).toBe(0);
  });
});

describe('resolveAlertLevel', () => {
  it('defaults to all', () => {
    expect(resolveAlertLevel(undefined)).toBe('all');
    expect(resolveAlertLevel('nonsense')).toBe('all');
  });

  it('keeps the explicit levels', () => {
    expect(resolveAlertLevel('critical')).toBe('critical');
    expect(resolveAlertLevel('none')).toBe('none');
  });

  it('honours the legacy show_alerts: false shorthand', () => {
    expect(resolveAlertLevel('all', false)).toBe('none');
  });
});

describe('shouldReport', () => {
  it('never reports healthy or unknown readings', () => {
    expect(shouldReport('ok', 'all')).toBe(false);
    expect(shouldReport('unknown', 'all')).toBe(false);
  });

  it('drops warnings when only critical values should be shown', () => {
    expect(shouldReport('warning', 'critical')).toBe(false);
    expect(shouldReport('critical', 'critical')).toBe(true);
  });

  it('stays silent at level none', () => {
    expect(shouldReport('critical', 'none')).toBe(false);
  });
});

describe('labels and colors stay in sync', () => {
  const orp = resolveBand('orp');

  it('never paints an out-of-range reading green', () => {
    const tooHigh = evaluate(880, orp);
    expect(levelLabel(tooHigh)).not.toBe('Optimal');
    expect(levelColor(tooHigh.level)).not.toContain('success');
  });

  it('labels the low and high side differently', () => {
    expect(levelLabel(evaluate(400, orp))).not.toBe(levelLabel(evaluate(950, orp)));
  });

  it('formats a range for the tooltip', () => {
    expect(formatRange(orp, 0, 'mV')).toBe('650 – 750 mV');
    expect(formatRange(resolveBand('ph'), 1)).toBe('7.0 – 7.4');
  });
});
