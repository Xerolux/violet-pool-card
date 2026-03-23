import { describe, it, expect } from 'vitest';
import { StateColorHelper } from '../src/utils/state-color';

describe('StateColorHelper.getTemperatureColor', () => {
  it('returns blue for cold temperatures (< 18)', () => {
    expect(StateColorHelper.getTemperatureColor(10).color).toBe('#2196F3');
  });

  it('returns green for optimal range (24–30)', () => {
    expect(StateColorHelper.getTemperatureColor(27).color).toBe('#4CAF50');
  });

  it('returns red for hot temperatures (>= 35)', () => {
    expect(StateColorHelper.getTemperatureColor(38).color).toBe('#F44336');
  });
});

describe('StateColorHelper.getPhColor', () => {
  it('returns green when pH is very close to target', () => {
    const result = StateColorHelper.getPhColor(7.2, 7.2);
    expect(result.color).toBe('#4CAF50');
    expect(result.intensity).toBe('low');
  });

  it('returns red when pH is far from target', () => {
    const result = StateColorHelper.getPhColor(6.0, 7.2);
    expect(result.color).toBe('#F44336');
    expect(result.intensity).toBe('high');
  });
});

describe('StateColorHelper.getOrpColor', () => {
  it('returns green when ORP is within optimal range', () => {
    expect(StateColorHelper.getOrpColor(700, 700).color).toBe('#4CAF50');
  });

  it('returns red when ORP is too low', () => {
    expect(StateColorHelper.getOrpColor(550, 700).color).toBe('#F44336');
  });

  it('returns red when ORP is too high', () => {
    expect(StateColorHelper.getOrpColor(850, 700).color).toBe('#F44336');
  });
});

describe('StateColorHelper.getPumpSpeedColor', () => {
  it('returns gray for speed 0 (off)', () => {
    expect(StateColorHelper.getPumpSpeedColor(0).color).toBe('#757575');
  });

  it('returns blue for speed 1 (eco)', () => {
    expect(StateColorHelper.getPumpSpeedColor(1).color).toBe('#2196F3');
  });

  it('returns orange for speed 3 (boost)', () => {
    expect(StateColorHelper.getPumpSpeedColor(3).color).toBe('#FF9800');
  });
});

describe('StateColorHelper.getEntityStateColor', () => {
  it('returns green for "on" state', () => {
    expect(StateColorHelper.getEntityStateColor('on').color).toBe('#4CAF50');
  });

  it('returns gray for "off" state', () => {
    expect(StateColorHelper.getEntityStateColor('off').color).toBe('#757575');
  });

  it('returns red for "error" state', () => {
    expect(StateColorHelper.getEntityStateColor('error').color).toBe('#F44336');
  });

  it('is case-insensitive', () => {
    expect(StateColorHelper.getEntityStateColor('ON').color).toBe('#4CAF50');
  });
});

describe('StateColorHelper.getIntensityOpacity', () => {
  it('returns correct opacity for each intensity level', () => {
    expect(StateColorHelper.getIntensityOpacity('low')).toBe(0.15);
    expect(StateColorHelper.getIntensityOpacity('medium')).toBe(0.25);
    expect(StateColorHelper.getIntensityOpacity('high')).toBe(0.35);
  });
});
