import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  LEGACY_SUFFIX_TO_SLOT,
  VIOLET_PLATFORM,
  buildEntityIndex,
  resolveEntityId,
  type RegistryDisplayEntry,
} from '../src/utils/entity-registry';

/** One entry as Home Assistant hands it over in hass.entities. */
const entry = (
  entity_id: string,
  translation_key?: string,
  platform: string = VIOLET_PLATFORM
): RegistryDisplayEntry => ({ entity_id, translation_key, platform });

/** The same, for an entity the user renamed. */
const renamed = (
  entity_id: string,
  name: string,
  translation_key: string
): RegistryDisplayEntry & { name: string } => ({
  entity_id,
  name,
  translation_key,
  platform: VIOLET_PLATFORM,
});

const registry = (...entries: RegistryDisplayEntry[]): Record<string, RegistryDisplayEntry> =>
  Object.fromEntries(entries.map((item) => [item.entity_id, item]));

describe('buildEntityIndex', () => {
  it('indexes the integration entities by domain and translation key', () => {
    const index = buildEntityIndex(
      registry(
        entry('switch.violet_pool_controller_filter_pump', 'pump'),
        entry('sensor.violet_pool_controller_pool_water', 'onewire1_value')
      )
    );

    expect(index.get('switch:pump')).toBe('switch.violet_pool_controller_filter_pump');
    expect(index.get('sensor:onewire1_value')).toBe('sensor.violet_pool_controller_pool_water');
  });

  it('ignores entities of other integrations', () => {
    const index = buildEntityIndex(
      registry(entry('switch.other_pump', 'pump', 'some_other_integration'))
    );

    expect(index.size).toBe(0);
  });

  it('ignores entities without a translation key', () => {
    const index = buildEntityIndex(registry(entry('sensor.violet_pool_controller_custom')));

    expect(index.size).toBe(0);
  });

  it('survives an installation without a registry', () => {
    expect(buildEntityIndex(undefined).size).toBe(0);
  });

  it('prefers the controller the card is configured for', () => {
    const index = buildEntityIndex(
      registry(
        entry('switch.garden_pool_filter_pump', 'pump'),
        entry('switch.violet_pool_controller_filter_pump', 'pump')
      ),
      'garden_pool'
    );

    expect(index.get('switch:pump')).toBe('switch.garden_pool_filter_pump');
  });

  it('finds an entity the user renamed', () => {
    // Renaming in Home Assistant changes the name and may change the entity
    // id; the integration's platform and translation key stay untouched, which
    // is exactly what the lookup goes by.
    const index = buildEntityIndex(
      registry(renamed('switch.hundepumpe', 'Hundepumpe', 'pump'))
    );

    expect(index.get('switch:pump')).toBe('switch.hundepumpe');
    expect(resolveEntityId(index, 'switch', 'filterpumpe')).toBe('switch.hundepumpe');
  });

  it('picks a stable entity when no prefix matches', () => {
    const entities = registry(
      entry('switch.pool_b_filter_pump', 'pump'),
      entry('switch.pool_a_filter_pump', 'pump')
    );

    expect(buildEntityIndex(entities).get('switch:pump')).toBe('switch.pool_a_filter_pump');
    expect(buildEntityIndex(entities, 'nothing').get('switch:pump')).toBe(
      'switch.pool_a_filter_pump'
    );
  });
});

describe('resolveEntityId', () => {
  const index = buildEntityIndex(
    registry(
      entry('switch.violet_pool_controller_filter_pump', 'pump'),
      entry('sensor.violet_pool_controller_ph_value', 'ph_value'),
      entry('climate.violet_pool_controller_pool_heater', 'heater'),
      entry('number.violet_pool_controller_orp_setpoint', 'orp_setpoint'),
      entry('sensor.violet_pool_controller_filter_pressure', 'adc1_value')
    )
  );

  it.each([
    ['switch', 'filterpumpe', 'switch.violet_pool_controller_filter_pump'],
    ['sensor', 'ph_wert', 'sensor.violet_pool_controller_ph_value'],
    ['climate', 'heizung', 'climate.violet_pool_controller_pool_heater'],
    ['number', 'redox_sollwert', 'number.violet_pool_controller_orp_setpoint'],
    ['sensor', 'filterdruck', 'sensor.violet_pool_controller_filter_pressure'],
  ])('resolves the %s the card used to guess as "%s"', (domain, suffix, expected) => {
    expect(resolveEntityId(index, domain, suffix)).toBe(expected);
  });

  it('returns nothing for a suffix the integration does not know', () => {
    // The card guesses these; the integration has no counterpart, so the
    // guessed id stays in place.
    expect(resolveEntityId(index, 'switch', 'counter_current')).toBeUndefined();
    expect(resolveEntityId(index, 'sensor', 'salzgehalt')).toBeUndefined();
  });

  it('returns nothing when the entity is not registered', () => {
    expect(resolveEntityId(index, 'switch', 'beleuchtung')).toBeUndefined();
  });

  it('does not confuse domains', () => {
    // "pvsurplus" exists as a switch and as a sensor in the integration.
    const both = buildEntityIndex(
      registry(
        entry('switch.violet_pool_controller_pv_surplus', 'pvsurplus'),
        entry('sensor.violet_pool_controller_pv_surplus_status', 'pvsurplus')
      )
    );

    expect(resolveEntityId(both, 'sensor', 'pv_uberschuss_status')).toBe(
      'sensor.violet_pool_controller_pv_surplus_status'
    );
  });
});

describe('LEGACY_SUFFIX_TO_SLOT', () => {
  /**
   * The entity keys of the integration, fetched by
   * `npm run keys:update` (the CI refreshes them before running the tests).
   */
  const integrationKeys: Record<string, string[]> = JSON.parse(
    readFileSync(new URL('./fixtures/integration-entity-keys.json', import.meta.url), 'utf-8')
  ).keys;

  it('points every entry at a key the integration really has', () => {
    // Without this the card would silently stop finding an entity when the
    // integration renames its translation key.
    const unknown = Object.entries(LEGACY_SUFFIX_TO_SLOT)
      .filter(([, slot]) => !integrationKeys[slot.domain]?.includes(slot.translationKey))
      .map(([suffix, slot]) => `${suffix} -> ${slot.domain}.${slot.translationKey}`);

    expect(unknown).toEqual([]);
  });

  it('names a domain the integration provides entities for', () => {
    for (const slot of Object.values(LEGACY_SUFFIX_TO_SLOT)) {
      expect(Object.keys(integrationKeys)).toContain(slot.domain);
    }
  });

  it('has no empty suffix or key', () => {
    for (const [suffix, slot] of Object.entries(LEGACY_SUFFIX_TO_SLOT)) {
      expect(suffix.trim()).not.toBe('');
      expect(slot.translationKey.trim()).not.toBe('');
    }
  });
});
