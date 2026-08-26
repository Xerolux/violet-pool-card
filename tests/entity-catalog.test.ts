import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface LiveCatalog {
  schema_version: number;
  captured_at: string;
  source: string;
  privacy: string;
  controller_prefix: string;
  total: number;
  domains: Record<string, number>;
  entities: string[];
}

interface IntegrationKeys {
  keys: Record<string, string[]>;
}

const live = JSON.parse(
  readFileSync(new URL('../catalog/live-violet-entities.json', import.meta.url), 'utf8')
) as LiveCatalog;
const supported = JSON.parse(
  readFileSync(new URL('./fixtures/integration-entity-keys.json', import.meta.url), 'utf8')
) as IntegrationKeys;

describe('live Violet entity catalog', () => {
  it('stores the complete integration helper snapshot without duplicates', () => {
    expect(live.schema_version).toBe(1);
    expect(live.total).toBe(266);
    expect(live.entities).toHaveLength(live.total);
    expect(new Set(live.entities).size).toBe(live.total);
  });

  it('contains only valid entity IDs belonging to the captured controller', () => {
    for (const entityId of live.entities) {
      expect(entityId).toMatch(/^[a-z_]+\.violet_pool_controller_[a-z0-9_]+$/);
    }
  });

  it('has domain totals that exactly match the IDs', () => {
    const actual: Record<string, number> = {};
    for (const entityId of live.entities) {
      const domain = entityId.split('.')[0];
      actual[domain] = (actual[domain] || 0) + 1;
    }
    expect(actual).toEqual(live.domains);
  });

  it('documents that no live values or private registry data are stored', () => {
    expect(live.privacy).toMatch(/Entity IDs only/i);
    expect(Object.keys(live).sort()).toEqual([
      'captured_at',
      'controller_prefix',
      'domains',
      'entities',
      'privacy',
      'schema_version',
      'source',
      'total',
    ]);
  });
});

describe('official Violet integration key catalog', () => {
  it('keeps the generated 583-key capability catalog alongside the live snapshot', () => {
    const count = Object.values(supported.keys).reduce((total, keys) => total + keys.length, 0);
    expect(count).toBe(583);
  });
});
