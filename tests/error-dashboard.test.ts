import { describe, expect, it } from 'vitest';
import { discoverVioletErrors } from '../src/components/error-dashboard';
import type { RegistryDisplayEntry } from '../src/utils/entity-registry';

const registryEntry = (
  entityId: string,
  platform: string
): RegistryDisplayEntry => ({
  entity_id: entityId,
  platform,
  translation_key: 'active_errors',
});

describe('error dashboard discovery', () => {
  it('ignores error-like entities from other integrations', () => {
    const entityId = 'sensor.robot_dock_error';
    const errors = discoverVioletErrors(
      {
        [entityId]: {
          state: 'water_empty',
          attributes: { friendly_name: 'Robot Dock Error' },
        },
      },
      { [entityId]: registryEntry(entityId, 'roborock') }
    );
    expect(errors).toEqual([]);
  });

  it('treats a clear Violet error sensor as healthy', () => {
    const entityId = 'sensor.violet_pool_controller_active_errors';
    const errors = discoverVioletErrors(
      {
        [entityId]: {
          state: 'No Error',
          attributes: { error_count: 0, errors: [], friendly_name: 'Active Errors' },
        },
      },
      { [entityId]: registryEntry(entityId, 'violet_pool_controller') }
    );
    expect(errors).toEqual([]);
  });

  it('maps a real Violet numeric error code', () => {
    const entityId = 'sensor.violet_pool_controller_active_errors';
    const errors = discoverVioletErrors(
      {
        [entityId]: {
          state: '5001',
          attributes: { error_count: 1, friendly_name: 'Active Errors' },
        },
      },
      { [entityId]: registryEntry(entityId, 'violet_pool_controller') }
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      code: 5001,
      message: 'pH Sensor Fault',
      severity: 'warning',
    });
  });
});
