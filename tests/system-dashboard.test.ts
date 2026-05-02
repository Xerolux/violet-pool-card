import { describe, it, expect } from 'vitest';
import { getSystemCardGroups } from '../src/utils/system-dashboard';

describe('getSystemCardGroups', () => {
  const c1 = { card_type: 'pump' } as any;
  const c2 = { card_type: 'heater' } as any;
  const u1 = { card_type: 'cover' } as any;
  const u2 = { card_type: 'filter' } as any;
  const m1 = { card_type: 'backwash' } as any;
  const a1 = { card_type: 'solar' } as any;
  const a2 = { card_type: 'diagnostics' } as any;

  it('returns default groups', () => {
    const result = getSystemCardGroups('default', [c1, c2], [u1, u2], [m1], [a1], [a2]);
    expect(result.controlCards.map(c => c.card_type)).toEqual(['pump', 'heater']);
    expect(result.utilityCards.map(c => c.card_type)).toEqual(['cover', 'filter']);
  });

  it('returns maintenance utility groups', () => {
    const result = getSystemCardGroups('maintenance', [c1, null], [u1, u2], [m1, null], [a1], [a2]);
    expect(result.controlCards.map(c => c.card_type)).toEqual(['pump']);
    expect(result.utilityCards.map(c => c.card_type)).toEqual(['backwash']);
  });

  it('returns alarm center groups', () => {
    const result = getSystemCardGroups('alarm_center', [c1, c2], [u1], [m1], [a1], [a2]);
    expect(result.controlCards.map(c => c.card_type)).toEqual(['solar']);
    expect(result.utilityCards.map(c => c.card_type)).toEqual(['diagnostics']);
  });
});
