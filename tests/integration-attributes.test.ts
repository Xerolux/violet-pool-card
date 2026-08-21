import { describe, expect, it } from 'vitest';
import {
  dosedTodayMl,
  dosingStatus,
  operatingMode,
  pumpSpeedLevel,
  runtimeSeconds,
} from '../src/utils/integration-attributes';

/**
 * Reported on the forum for 0.4.3: the pump card showed the pump as off while
 * it was running, and the dosing card was broken.
 *
 * The card read raw controller keys off the entity - `PUMPSTATE`,
 * `PUMP_RPM_0..3`, `DOS_1_CL_STATE`. The integration does not pass those
 * through; it publishes `pump_speed_level`, `mode`, `dosing_status` and
 * friends. Every read came back undefined, and the speed fell back to 0.
 *
 * These fixtures are the attributes the integration's switch platform really
 * sets (custom_components/violet_pool_controller/switch.py).
 */
const INTEGRATION_PUMP = {
  mode: 'Manual ON (Forced)',
  status_description: 'Manual ON (Forced) | Level 2',
  raw_state: '4',
  state_code: 4,
  state_name: 'Manual ON',
  is_active: true,
  pump_speed_level: 2,
  runtime: '04h 33m 12s',
};

const INTEGRATION_DOSING = {
  mode: 'Auto - Standby',
  dosing_configured: true,
  dosing_status: 'Blocked by thresholds',
  remaining_range: '12 d',
  daily_amount_ml: 150,
  runtime: '00h 12m 30s',
};

describe('pumpSpeedLevel', () => {
  it('reads the level the integration publishes', () => {
    expect(pumpSpeedLevel(INTEGRATION_PUMP)).toBe(2);
  });

  it('reads a running pump as running, not as off', () => {
    // The regression in one line: this used to be 0.
    expect(pumpSpeedLevel(INTEGRATION_PUMP)).toBeGreaterThan(0);
  });

  it('still understands a passed-through raw state', () => {
    expect(pumpSpeedLevel({ PUMPSTATE: '3|PUMP_ANTI_FREEZE' })).toBe(3);
  });

  it('falls back to the RPM bands', () => {
    expect(pumpSpeedLevel({ PUMP_RPM_0: 0, PUMP_RPM_1: 1400, PUMP_RPM_2: 0 })).toBe(1);
  });

  it('returns nothing when no source reports a level', () => {
    expect(pumpSpeedLevel({ friendly_name: 'Pump' })).toBeUndefined();
    expect(pumpSpeedLevel(undefined)).toBeUndefined();
  });

  it('keeps a genuine zero distinct from "unknown"', () => {
    // A pump reporting level 0 is off; a pump reporting nothing is unknown.
    expect(pumpSpeedLevel({ pump_speed_level: 0 })).toBe(0);
  });
});

describe('runtimeSeconds', () => {
  it('parses the controller format', () => {
    // "04h 33m 12s" - Number() on this is NaN, which showed as 0 h 0 min.
    expect(runtimeSeconds(INTEGRATION_PUMP)).toBe(4 * 3600 + 33 * 60 + 12);
  });

  it('parses HH:MM:SS', () => {
    expect(runtimeSeconds({ runtime: '01:02:03' })).toBe(3723);
  });

  it('accepts plain seconds', () => {
    expect(runtimeSeconds({ runtime: 5400 })).toBe(5400);
  });

  it('returns nothing for an unparseable value', () => {
    expect(runtimeSeconds({ runtime: 'unknown' })).toBeUndefined();
    expect(runtimeSeconds({})).toBeUndefined();
  });
});

describe('operatingMode', () => {
  it('prefers the integration mode', () => {
    expect(operatingMode(INTEGRATION_PUMP)).toBe('Manual ON (Forced)');
  });

  it('falls back through the other descriptive attributes', () => {
    expect(operatingMode({ status_description: 'Auto - Standby' })).toBe('Auto - Standby');
  });

  it('ignores empty strings', () => {
    expect(operatingMode({ mode: '   ', state_name: 'Manual OFF' })).toBe('Manual OFF');
  });
});

describe('dosing attributes', () => {
  it('reads the status the integration publishes', () => {
    expect(dosingStatus(INTEGRATION_DOSING)).toBe('Blocked by thresholds');
  });

  it('still understands the raw state list', () => {
    expect(dosingStatus({ DOS_1_CL_STATE: ['BLOCKED_BY_TRESHOLDS', 'DOSING'] })).toBe(
      'BLOCKED BY TRESHOLDS, DOSING'
    );
  });

  it('returns nothing for an empty raw list', () => {
    expect(dosingStatus({ DOS_1_CL_STATE: [] })).toBeUndefined();
  });

  it('reads the daily amount', () => {
    expect(dosedTodayMl(INTEGRATION_DOSING)).toBe(150);
    expect(dosedTodayMl({ dosing_volume_24h: 90 })).toBe(90);
  });
});
