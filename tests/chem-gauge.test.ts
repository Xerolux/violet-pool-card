import { describe, it, expect } from 'vitest';
import { chemGaugeSVG, gaugePoint } from '../src/utils/animated-icons';

/** Centre and radius the gauge is drawn around (see animated-icons.ts). */
const CX = 50;
const CY = 46;
const R = 34;

const distanceFromCentre = (p: { x: number; y: number }) =>
  Math.hypot(p.x - CX, p.y - CY);

describe('gauge geometry', () => {
  it('puts the start of the sweep at the left end of the semicircle', () => {
    const p = gaugePoint(0);
    expect(p.x).toBeCloseTo(CX - R, 5);
    expect(p.y).toBeCloseTo(CY, 5);
  });

  it('puts the end of the sweep at the right end of the semicircle', () => {
    const p = gaugePoint(1);
    expect(p.x).toBeCloseTo(CX + R, 5);
    expect(p.y).toBeCloseTo(CY, 5);
  });

  it('puts the midpoint at the top of the arc', () => {
    const p = gaugePoint(0.5);
    expect(p.x).toBeCloseTo(CX, 5);
    expect(p.y).toBeCloseTo(CY - R, 5);
  });

  it('keeps every point on the circle – the pre-0.4.0 bug drew a straight chord', () => {
    for (let i = 0; i <= 20; i++) {
      expect(distanceFromCentre(gaugePoint(i / 20))).toBeCloseTo(R, 5);
    }
  });

  it('clamps fractions outside 0..1 onto the arc ends', () => {
    expect(gaugePoint(-3)).toEqual(gaugePoint(0));
    expect(gaugePoint(7)).toEqual(gaugePoint(1));
  });

  it('sweeps monotonically from left to right', () => {
    let previous = -Infinity;
    for (let i = 0; i <= 10; i++) {
      const { x } = gaugePoint(i / 10);
      expect(x).toBeGreaterThan(previous);
      previous = x;
    }
  });
});

describe('chemGaugeSVG', () => {
  const flatten = (result: unknown): string => {
    const node = result as { strings?: readonly string[]; values?: unknown[] };
    if (!node || !node.strings) return String(result ?? '');
    return node.strings
      .map((chunk, index) => chunk + (index < (node.values?.length ?? 0) ? flatten(node.values?.[index]) : ''))
      .join('');
  };

  it('renders the numeric reading, not just a needle', () => {
    const svg = flatten(chemGaugeSVG({ value: 7.2, range: [6.5, 8.0], color: '#34C759', decimals: 1 }));
    expect(svg).toContain('7.2');
  });

  it('renders the unit next to the reading', () => {
    const svg = flatten(chemGaugeSVG({ value: 812, range: [500, 900], color: '#FF9F0A', unit: 'mV', decimals: 0 }));
    expect(svg).toContain('812');
    expect(svg).toContain('mV');
  });

  it('labels both ends of the configured scale', () => {
    const svg = flatten(chemGaugeSVG({ value: 700, range: [400, 1000], color: '#34C759', decimals: 0 }));
    expect(svg).toContain('400');
    expect(svg).toContain('1000');
  });

  it('falls back to a placeholder when no value is available', () => {
    const svg = flatten(chemGaugeSVG({ range: [6.5, 8.0], color: '#8E8E93', decimals: 1 }));
    expect(svg).toContain('--');
  });

  it('exposes an accessible label', () => {
    const svg = flatten(chemGaugeSVG({ value: 7.2, range: [6.5, 8.0], color: '#34C759', ariaLabel: 'pH 7.2 – Optimal' }));
    expect(svg).toContain('pH 7.2 – Optimal');
  });

  it('never takes the long way round the circle', () => {
    // Every segment of a semicircular gauge is <= 180°, so the SVG arc
    // large-arc-flag must stay 0. A reading past the midpoint used to flip it,
    // which drew the arc backwards across the gauge.
    for (const value of [510, 700, 812, 899]) {
      const svg = flatten(chemGaugeSVG({ value, range: [500, 900], color: '#34C759', decimals: 0 }));
      expect(svg).toMatch(/A [\d.]+ [\d.]+ 0 0 1/);
      expect(svg).not.toMatch(/A [\d.]+ [\d.]+ 0 1 1/);
    }
  });

  it('keeps the optimal zone visible behind a full value arc', () => {
    // The zone is drawn after the value arc on a smaller radius, so a high
    // reading cannot paint over it.
    const svg = flatten(chemGaugeSVG({
      value: 890, range: [500, 900], ideal: [650, 750], color: '#FF3B30', decimals: 0,
    }));
    const zoneRadius = String(34 - 6.5);
    expect(svg).toContain(`A ${zoneRadius} ${zoneRadius}`);
    expect(svg.indexOf('--vpc-success')).toBeGreaterThan(svg.indexOf('#FF3B30'));
  });

  it('does not reference the removed gauge-fill animation', () => {
    const svg = flatten(chemGaugeSVG({ value: 7.2, range: [6.5, 8.0], color: '#34C759' }));
    expect(svg).not.toContain('gauge-fill');
    expect(svg).not.toContain('--gauge-dash');
  });
});
