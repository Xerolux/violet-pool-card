import { describe, expect, it } from 'vitest';
import { calibrationInfo } from '../src/components/calibration-status';

const NOW = Date.parse('2026-08-23T12:00:00Z');

describe('calibration status', () => {
  it('keeps a missing calibration unknown instead of inventing a date', () => {
    expect(calibrationInfo('pH Electrode', undefined, null, NOW)).toEqual({
      sensor_type: 'pH Electrode',
      last_calibration: null,
      days_since: null,
      status: 'Unknown',
      is_expired: false,
      is_warning: false,
      next_calibration: null,
    });
  });

  it('rejects a non-date sensor state as calibration history', () => {
    const info = calibrationInfo('ORP Electrode', '728', null, NOW);

    expect(info.last_calibration).toBeNull();
    expect(info.status).toBe('Unknown');
  });

  it.each([
    [30, 'OK'],
    [75, 'Warning'],
    [120, 'Expired'],
  ] as const)('classifies a calibration from %i days ago as %s', (days, status) => {
    const last = new Date(NOW - days * 86_400_000).toISOString();
    const info = calibrationInfo('pH Electrode', last, null, NOW);

    expect(info.days_since).toBe(days);
    expect(info.status).toBe(status);
  });
});
