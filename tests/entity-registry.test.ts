import { describe, expect, it } from 'vitest';
import {
  LEGACY_SUFFIX_TO_TRANSLATION_KEY,
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

describe('LEGACY_SUFFIX_TO_TRANSLATION_KEY', () => {
  it('maps every suffix to a non-empty key', () => {
    for (const [suffix, key] of Object.entries(LEGACY_SUFFIX_TO_TRANSLATION_KEY)) {
      expect(suffix.trim()).not.toBe('');
      expect(key.trim()).not.toBe('');
    }
  });
});
