import { describe, it, expect } from 'vitest';
import { isValidTheme } from '../src/types';

describe('isValidTheme', () => {
  it('accepts the new lagoon dark theme', () => {
    expect(isValidTheme('lagoon')).toBe(true);
  });

  it('still accepts every previously supported theme (no regression)', () => {
    const previous = [
      'classic', 'midnight', 'elegance', 'vibrant', 'pure', 'frost',
      'glow', 'metallic', 'ocean', 'sunset', 'forest', 'aurora',
    ];
    for (const theme of previous) {
      expect(isValidTheme(theme)).toBe(true);
    }
  });

  it('rejects unknown theme names', () => {
    expect(isValidTheme('oceanic')).toBe(false);
    expect(isValidTheme('')).toBe(false);
  });
});
