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
