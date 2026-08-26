/**
 * Data model for the configurable pool circulation diagram.
 *
 * Keeping state interpretation outside the visual component makes the flow
 * direction, visible equipment and fact selection independently testable.
 */

export type PoolFlowMode = 'circulation' | 'treatment' | 'complete';

export interface PoolFlowEntity {
  state: string;
  attributes?: Record<string, unknown>;
}

export interface PoolFlowHass {
  states: Record<string, PoolFlowEntity | undefined>;
}

export interface PoolFlowEntities {
  pump?: string;
  filterPressure?: string;
  flowRate?: string;
  poolTemperature?: string;
  poolLevel?: string;
  heater?: string;
  solar?: string;
  dosing?: string;
  backwash?: string;
  refill?: string;
  ph?: string;
  orp?: string;
  chlorine?: string;
}

export interface PoolFlowOptions {
  mode: PoolFlowMode;
  showHeater: boolean;
  showSolar: boolean;
  showDosing: boolean;
  showBackwash: boolean;
  showRefill: boolean;
  showChemistry: boolean;
  showFacts: boolean;
}

export type PoolFlowNodeKey = 'pool' | 'pump' | 'filter' | 'heater' | 'solar' | 'dosing';

export interface PoolFlowNode {
  key: PoolFlowNodeKey;
  entityId?: string;
  value?: string;
  active: boolean;
}

export interface PoolFlowFact {
  key: 'temperature' | 'flow' | 'pressure' | 'level' | 'ph' | 'orp' | 'chlorine' | 'backwash' | 'refill';
  entityId?: string;
  value: string;
  available: boolean;
  active: boolean;
}

export interface PoolFlowModel {
  active: boolean;
  nodes: PoolFlowNode[];
  facts: PoolFlowFact[];
}

const ACTIVE_STATES = new Set([
  '1',
  'active',
  'auto',
  'heat',
  'heating',
  'on',
  'open',
  'opening',
  'ready',
  'running',
]);

export function entityIsActive(entity?: PoolFlowEntity): boolean {
  if (!entity) return false;
  return ACTIVE_STATES.has(String(entity.state).trim().toLowerCase());
}

export function numericEntityValue(entity?: PoolFlowEntity): number | undefined {
  if (!entity) return undefined;
  const parsed = Number.parseFloat(entity.state);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function entityUnit(entity?: PoolFlowEntity, fallback = ''): string {
  const unit = entity?.attributes?.unit_of_measurement;
  return typeof unit === 'string' && unit.trim() ? unit.trim() : fallback;
}

function formattedNumber(
  entity: PoolFlowEntity | undefined,
  decimals: number,
  fallbackUnit = ''
): string | undefined {
  const value = numericEntityValue(entity);
  if (value === undefined) return undefined;
  const unit = entityUnit(entity, fallbackUnit);
  return `${value.toFixed(decimals)}${unit ? ` ${unit}` : ''}`;
}

function readableState(entity?: PoolFlowEntity): string | undefined {
  const state = entity?.state?.trim();
  if (!state || ['unknown', 'unavailable'].includes(state.toLowerCase())) return undefined;
  return state.replace(/_/g, ' ');
}

function getEntity(hass: PoolFlowHass, entityId?: string): PoolFlowEntity | undefined {
  return entityId ? hass.states[entityId] : undefined;
}

function node(
  hass: PoolFlowHass,
  key: PoolFlowNodeKey,
  entityId?: string,
  value?: string
): PoolFlowNode {
  return {
    key,
    entityId,
    value,
    active: key === 'pool' || entityIsActive(getEntity(hass, entityId)),
  };
}

function fact(
  key: PoolFlowFact['key'],
  entityId: string | undefined,
  value: string | undefined,
  active = false
): PoolFlowFact {
  return {
    key,
    entityId,
    value: value ?? '–',
    available: value !== undefined,
    active,
  };
}

export function buildPoolFlowModel(
  hass: PoolFlowHass,
  entities: PoolFlowEntities,
  options: PoolFlowOptions
): PoolFlowModel {
  const pumpEntity = getEntity(hass, entities.pump);
  const flowEntity = getEntity(hass, entities.flowRate);
  const flowValue = numericEntityValue(flowEntity);
  const active = entityIsActive(pumpEntity) || (flowValue !== undefined && flowValue > 0.05);

  const poolTemperature = getEntity(hass, entities.poolTemperature);
  const pressure = getEntity(hass, entities.filterPressure);
  const level = getEntity(hass, entities.poolLevel);
  const heater = getEntity(hass, entities.heater);
  const solar = getEntity(hass, entities.solar);
  const dosing = getEntity(hass, entities.dosing);
  const backwash = getEntity(hass, entities.backwash);
  const refill = getEntity(hass, entities.refill);
  const ph = getEntity(hass, entities.ph);
  const orp = getEntity(hass, entities.orp);
  const chlorine = getEntity(hass, entities.chlorine);

  const nodes: PoolFlowNode[] = [
    node(hass, 'pool', entities.poolTemperature, formattedNumber(poolTemperature, 1, '°C')),
    node(hass, 'pump', entities.pump, formattedNumber(flowEntity, 1, 'm³/h')),
    node(hass, 'filter', entities.filterPressure, formattedNumber(pressure, 2, 'bar')),
  ];

  if (options.mode === 'complete' && options.showHeater) {
    nodes.push(node(hass, 'heater', entities.heater, readableState(heater)));
  }
  if (options.mode === 'complete' && options.showSolar) {
    nodes.push(node(hass, 'solar', entities.solar, readableState(solar)));
  }
  if (options.mode !== 'circulation' && options.showDosing) {
    nodes.push(node(hass, 'dosing', entities.dosing, readableState(dosing)));
  }

  const facts: PoolFlowFact[] = [];
  if (options.showFacts) {
    facts.push(
      fact('temperature', entities.poolTemperature, formattedNumber(poolTemperature, 1, '°C')),
      fact('flow', entities.flowRate, formattedNumber(flowEntity, 1, 'm³/h'), active),
      fact('pressure', entities.filterPressure, formattedNumber(pressure, 2, 'bar')),
      fact('level', entities.poolLevel, formattedNumber(level, 1, '%'))
    );

    if (options.showChemistry) {
      facts.push(
        fact('ph', entities.ph, formattedNumber(ph, 1)),
        fact('orp', entities.orp, formattedNumber(orp, 0, 'mV')),
        fact('chlorine', entities.chlorine, formattedNumber(chlorine, 2, 'mg/l'))
      );
    }

    if (options.showBackwash) {
      facts.push(fact('backwash', entities.backwash, readableState(backwash), entityIsActive(backwash)));
    }
    if (options.showRefill) {
      facts.push(fact('refill', entities.refill, readableState(refill), entityIsActive(refill)));
    }
  }

  return { active, nodes, facts };
}
