import { describe, expect, it } from 'vitest';
import { SeverityModel } from '../src/utils/severity-model';

describe('direct chlorine dosing recommendations', () => {
  it('uses a concentration-sized tolerance for mg/l targets', () => {
    const low = SeverityModel.getDosingRecommendations({
      dosingType: 'free_chlorine',
      currentValue: 0.1,
      targetValue: 0.5,
    });
    expect(low.some((alert) => alert.text.toLowerCase().includes('chlor'))).toBe(true);
  });

  it('keeps the ORP-sized tolerance for millivolt targets', () => {
    const close = SeverityModel.getDosingRecommendations({
      dosingType: 'chlorine',
      currentValue: 720,
      targetValue: 750,
    });
    expect(close).toEqual([]);
  });

  it('evaluates electrolysis against the same chlorine target', () => {
    const high = SeverityModel.getDosingRecommendations({
      dosingType: 'electrolysis',
      currentValue: 0.9,
      targetValue: 0.4,
    });
    expect(high.some((alert) => alert.text.toLowerCase().includes('chlor'))).toBe(true);
  });
});
