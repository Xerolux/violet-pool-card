import { describe, it, expect } from 'vitest';
import { EntityHelper } from '../src/utils/entity-helper';

describe('EntityHelper.parsePumpState', () => {
  it('parses a state with pipe separator into level and status', () => {
    const result = EntityHelper.parsePumpState('2|running');
    expect(result.level).toBe(2);
    expect(result.status).toBe('Running');
    expect(result.rawState).toBe('2|running');
  });

  it('returns undefined level when the level part is not a number', () => {
    const result = EntityHelper.parsePumpState('x|running');
    expect(result.level).toBeUndefined();
    expect(result.status).toBe('Running');
  });

  it('handles a plain state string without pipe', () => {
    const result = EntityHelper.parsePumpState('eco_mode');
    expect(result.level).toBeUndefined();
    expect(result.status).toBe('Eco Mode');
    expect(result.rawState).toBe('eco_mode');
  });

  it('handles empty string gracefully', () => {
    const result = EntityHelper.parsePumpState('');
    expect(result.status).toBe('');
    expect(result.rawState).toBe('');
  });
});

describe('EntityHelper.formatSnakeCase', () => {
  it('converts snake_case to Title Case', () => {
    expect(EntityHelper.formatSnakeCase('speed_control')).toBe('Speed Control');
    expect(EntityHelper.formatSnakeCase('eco_mode')).toBe('Eco Mode');
  });

  it('returns empty string for empty input', () => {
    expect(EntityHelper.formatSnakeCase('')).toBe('');
  });

  it('handles single-word input', () => {
    expect(EntityHelper.formatSnakeCase('running')).toBe('Running');
  });
});

describe('EntityHelper temperature helpers', () => {
  const makeEntity = (attrs: Record<string, unknown>) => ({
    entity_id: 'climate.pool',
    state: 'heat',
    attributes: attrs,
    last_changed: '',
    last_updated: '',
  });

  it('returns current temperature', () => {
    expect(EntityHelper.getCurrentTemperature(makeEntity({ current_temperature: 26.5 }))).toBe(26.5);
  });

  it('returns undefined when attribute is missing', () => {
    expect(EntityHelper.getCurrentTemperature(makeEntity({}))).toBeUndefined();
  });

  it('returns target temperature', () => {
    expect(EntityHelper.getTargetTemperature(makeEntity({ temperature: 28 }))).toBe(28);
  });

  it('returns min/max temperature', () => {
    expect(EntityHelper.getMinTemperature(makeEntity({ min_temp: 15 }))).toBe(15);
    expect(EntityHelper.getMaxTemperature(makeEntity({ max_temp: 40 }))).toBe(40);
  });
});

describe('EntityHelper.findEntityId', () => {
  const mockStates = {
    'switch.violet_pool_controller_filter_pump': { state: 'on' },
    'climate.violet_pool_controller_heater': { state: 'heat' },
    'sensor.violet_pool_controller_pool_temperature': { state: '28.5' },
    'sensor.violet_pool_controller_ph_value': { state: '7.2' },
    'sensor.violet_pool_controller_chlorine_dosing_system': { state: 'ready' },
    'sensor.custom_pool_beckenwasser': { state: '27.0' },
    'switch.garden_pool_pumpe': { state: 'on' },
  };

  it('returns preferred entity if present', () => {
    expect(
      EntityHelper.findEntityId(mockStates, {
        preferred: 'switch.violet_pool_controller_filter_pump',
        domain: 'switch',
        suffixes: ['filterpumpe'],
      })
    ).toBe('switch.violet_pool_controller_filter_pump');
  });

  it('finds entity with prefix and english suffix', () => {
    expect(
      EntityHelper.findEntityId(mockStates, {
        prefix: 'violet_pool_controller',
        domain: 'switch',
        suffixes: ['filter_pump', 'filterpumpe'],
      })
    ).toBe('switch.violet_pool_controller_filter_pump');
  });

  it('finds entity with legacy german suffix fallback', () => {
    expect(
      EntityHelper.findEntityId(mockStates, {
        prefix: 'custom_pool',
        domain: 'sensor',
        suffixes: ['pool_temperature', 'beckenwasser'],
      })
    ).toBe('sensor.custom_pool_beckenwasser');
  });

  it('finds entity by pattern matching when exact prefix match fails', () => {
    expect(
      EntityHelper.findEntityId(mockStates, {
        domain: 'switch',
        suffixes: ['pumpe'],
        patterns: ['garden'],
      })
    ).toBe('switch.garden_pool_pumpe');
  });

  it('returns undefined when no entity matches', () => {
    expect(
      EntityHelper.findEntityId(mockStates, {
        domain: 'cover',
        suffixes: ['abdeckung', 'cover'],
      })
    ).toBeUndefined();
  });
});

describe('EntityHelper.parseDosingState', () => {
  it('parses sensor entity with ready state', () => {
    const entity = {
      entity_id: 'sensor.violet_pool_controller_chlorine_dosing_system',
      state: 'ready',
      attributes: { daily_usage_ml: 120 },
    };
    const parsed = EntityHelper.parseDosingState(entity, 'chlorine');
    expect(parsed.mode).toBe('auto');
    expect(parsed.isActive).toBe(true);
    expect(parsed.isDosing).toBe(false);
    expect(parsed.dailyUsageMl).toBe(120);
  });

  it('parses sensor entity with active dosing in attributes', () => {
    const entity = {
      entity_id: 'sensor.violet_pool_controller_chlorine_dosing_system',
      state: 'dosing',
      attributes: { DOS_1_STATE: ['DOSING_ACTIVE'] },
    };
    const parsed = EntityHelper.parseDosingState(entity, 'chlorine');
    expect(parsed.isDosing).toBe(true);
    expect(parsed.isActive).toBe(true);
  });

  it('parses switch entity turned off', () => {
    const entity = {
      entity_id: 'switch.violet_pool_controller_chlor_dosierung',
      state: 'off',
      attributes: {},
    };
    const parsed = EntityHelper.parseDosingState(entity, 'chlorine');
    expect(parsed.mode).toBe('off');
    expect(parsed.isActive).toBe(false);
    expect(parsed.isDosing).toBe(false);
  });
});

describe('EntityHelper CSI & LSI calculation', () => {
  it('calculates balanced saturation index for ideal pool water (pH 7.4, 28°C)', () => {
    const result = EntityHelper.calculateCSI(7.4, 28, 250, 100, 1000);
    expect(result.value).toBeGreaterThanOrEqual(-0.3);
    expect(result.value).toBeLessThanOrEqual(0.3);
    expect(result.status).toBe('balanced');
  });

  it('detects corrosive water when pH and alkalinity are very low', () => {
    const result = EntityHelper.calculateCSI(6.6, 15, 80, 40, 500);
    expect(result.value).toBeLessThan(-0.3);
    expect(result.status).toBe('corrosive');
  });

  it('detects scale-forming water when pH and hardness are very high', () => {
    const result = EntityHelper.calculateCSI(8.2, 34, 600, 250, 4000);
    expect(result.value).toBeGreaterThan(0.3);
    expect(result.status).toBe('scaling');
  });
});
