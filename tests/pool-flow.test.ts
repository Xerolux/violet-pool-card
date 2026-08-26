import { describe, expect, it } from 'vitest';
import {
  buildPoolFlowModel,
  entityIsActive,
  numericEntityValue,
  type PoolFlowHass,
  type PoolFlowOptions,
} from '../src/utils/pool-flow';

const complete: PoolFlowOptions = {
  mode: 'complete',
  showHeater: true,
  showSolar: true,
  showDosing: true,
  showBackwash: true,
  showRefill: true,
  showChemistry: true,
  showFacts: true,
};

const entities = {
  pump: 'switch.pool_pump',
  filterPressure: 'sensor.filter_pressure',
  flowRate: 'sensor.flow_rate',
  poolTemperature: 'sensor.pool_temperature',
  poolLevel: 'sensor.pool_level',
  heater: 'climate.pool_heater',
  solar: 'climate.solar_heater',
  dosing: 'switch.chlorine_dosing',
  backwash: 'select.backwash',
  refill: 'select.refill',
  ph: 'sensor.ph',
  orp: 'sensor.orp',
  chlorine: 'sensor.chlorine',
};

const hass: PoolFlowHass = {
  states: {
    'switch.pool_pump': { state: 'on' },
    'sensor.filter_pressure': { state: '0.84', attributes: { unit_of_measurement: 'bar' } },
    'sensor.flow_rate': { state: '12.6', attributes: { unit_of_measurement: 'm³/h' } },
    'sensor.pool_temperature': { state: '27.34', attributes: { unit_of_measurement: '°C' } },
    'sensor.pool_level': { state: '73', attributes: { unit_of_measurement: '%' } },
    'climate.pool_heater': { state: 'heating' },
    'climate.solar_heater': { state: 'off' },
    'switch.chlorine_dosing': { state: 'on' },
    'select.backwash': { state: 'automatic' },
    'select.refill': { state: 'off' },
    'sensor.ph': { state: '7.2' },
    'sensor.orp': { state: '859', attributes: { unit_of_measurement: 'mV' } },
    'sensor.chlorine': { state: '0.76', attributes: { unit_of_measurement: 'mg/l' } },
  },
};

describe('pool flow state helpers', () => {
  it('recognises operating states without treating unavailable values as active', () => {
    expect(entityIsActive({ state: 'RUNNING' })).toBe(true);
    expect(entityIsActive({ state: 'off' })).toBe(false);
    expect(entityIsActive({ state: 'unavailable' })).toBe(false);
  });

  it('returns finite numeric states only', () => {
    expect(numericEntityValue({ state: '12.4' })).toBe(12.4);
    expect(numericEntityValue({ state: 'unavailable' })).toBeUndefined();
  });
});

describe('buildPoolFlowModel', () => {
  it('builds the complete configured equipment path and live facts', () => {
    const model = buildPoolFlowModel(hass, entities, complete);

    expect(model.active).toBe(true);
    expect(model.nodes.map((node) => node.key)).toEqual([
      'pool', 'pump', 'filter', 'heater', 'solar', 'dosing',
    ]);
    expect(model.facts.map((fact) => fact.key)).toEqual([
      'temperature', 'flow', 'pressure', 'level', 'ph', 'orp', 'chlorine', 'backwash', 'refill',
    ]);
    expect(model.facts.find((fact) => fact.key === 'temperature')?.value).toBe('27.3 °C');
    expect(model.facts.find((fact) => fact.key === 'pressure')?.value).toBe('0.84 bar');
    expect(model.facts.find((fact) => fact.key === 'orp')?.value).toBe('859 mV');
  });

  it('uses positive measured flow when the pump switch is off', () => {
    const model = buildPoolFlowModel(
      { states: { ...hass.states, 'switch.pool_pump': { state: 'off' } } },
      entities,
      complete
    );
    expect(model.active).toBe(true);
  });

  it('limits circulation mode to pool, pump and filter', () => {
    const model = buildPoolFlowModel(hass, entities, { ...complete, mode: 'circulation' });
    expect(model.nodes.map((node) => node.key)).toEqual(['pool', 'pump', 'filter']);
  });

  it('respects optional equipment and fact switches', () => {
    const model = buildPoolFlowModel(hass, entities, {
      ...complete,
      showHeater: false,
      showSolar: false,
      showDosing: false,
      showFacts: false,
    });
    expect(model.nodes.map((node) => node.key)).toEqual(['pool', 'pump', 'filter']);
    expect(model.facts).toEqual([]);
  });

  it('keeps missing readings visible as unavailable facts', () => {
    const model = buildPoolFlowModel({ states: {} }, entities, complete);
    expect(model.active).toBe(false);
    expect(model.facts.every((fact) => fact.value === '–')).toBe(true);
    expect(model.facts.every((fact) => fact.available === false)).toBe(true);
  });
});
