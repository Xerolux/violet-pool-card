import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  CARD_TYPES_REQUIRING_ENTITY,
  CARD_TYPE_MAIN_ENTITY,
  DETAILS_DEFAULT_SUFFIXES,
  LEGACY_SUFFIX_TO_SLOT,
  VIOLET_PLATFORM,
  buildEntityIndex,
  defaultDetailEntities,
  fallbackSuffix,
  resolveEntityId,
  resolveSlotEntity,
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

describe('CARD_TYPE_MAIN_ENTITY', () => {
  /**
   * Reported on the forum for 0.4.2: the pump card did not find its entities.
   * The registry lookup existed, but the equipment cards never reached it -
   * `setConfig` threw "You need to define an entity" first, and the renderers
   * read `config.entity` directly.
   */
  it('covers the card types whose renderer reads the entity directly', () => {
    // These four render from config.entity with no fallback of their own.
    for (const cardType of ['pump', 'heater', 'solar', 'dosing']) {
      expect(CARD_TYPE_MAIN_ENTITY[cardType], cardType).toBeDefined();
    }
  });

  it('points every default at a suffix the registry can resolve', () => {
    // A default naming a suffix LEGACY_SUFFIX_TO_SLOT does not know would fall
    // straight back to the guessed id - the bug this replaces.
    const unresolvable = Object.entries(CARD_TYPE_MAIN_ENTITY)
      .filter(([, slot]) => {
        const mapped = LEGACY_SUFFIX_TO_SLOT[slot.suffix];
        return !mapped || mapped.domain !== slot.domain;
      })
      .map(([cardType, slot]) => `${cardType} -> ${slot.domain}.${slot.suffix}`);

    // 'inlet' and 'counter_current' have no counterpart in the integration on
    // purpose; they keep the guessed id.
    expect(unresolvable).toEqual([
      'inlet -> switch.inlet',
      'counter_current -> switch.counter_current',
    ]);
  });

  it('resolves the pump card to the registered pump', () => {
    const index = buildEntityIndex(
      registry(entry('switch.violet_pool_controller_filter_pump', 'pump'))
    );
    const slot = CARD_TYPE_MAIN_ENTITY.pump;

    expect(resolveEntityId(index, slot.domain, slot.suffix)).toBe(
      'switch.violet_pool_controller_filter_pump'
    );
  });

  it('resolves the pump card even when the user renamed the entity', () => {
    const index = buildEntityIndex(registry(entry('switch.hundepumpe', 'pump')));
    const slot = CARD_TYPE_MAIN_ENTITY.pump;

    expect(resolveEntityId(index, slot.domain, slot.suffix)).toBe('switch.hundepumpe');
  });

  it('requires an explicit entity only where none can be guessed', () => {
    // The generic sensor card is the one that genuinely cannot guess.
    expect([...CARD_TYPES_REQUIRING_ENTITY]).toEqual(['sensor']);

    for (const cardType of CARD_TYPES_REQUIRING_ENTITY) {
      expect(CARD_TYPE_MAIN_ENTITY[cardType]).toBeUndefined();
    }
  });
});

describe('the details card default list', () => {
  /**
   * Asked for on the forum: the details card refused to render without an
   * `entities:` list, and gave no hint what belonged in it. It now falls back
   * to the readings and outputs an installation actually has.
   */
  const registryEntry = (entityId: string, translationKey: string) => ({
    entity_id: entityId,
    platform: VIOLET_PLATFORM,
    translation_key: translationKey,
  });

  const FULL_POOL = {
    a: registryEntry('sensor.pool_water', 'onewire1_value'),
    b: registryEntry('sensor.ph', 'ph_value'),
    c: registryEntry('sensor.orp', 'orp_value'),
    d: registryEntry('switch.pump', 'pump'),
    e: registryEntry('climate.heater', 'heater'),
    f: registryEntry('climate.solar', 'solar'),
    g: registryEntry('cover.pool_cover', 'pool_cover'),
  };

  it('lists what the installation has, in the documented order', () => {
    const index = buildEntityIndex(FULL_POOL);
    const resolved = defaultDetailEntities(index, () => true);

    expect(resolved).toEqual([
      'sensor.pool_water',
      'sensor.ph',
      'sensor.orp',
      'switch.pump',
      'climate.heater',
      'climate.solar',
      'cover.pool_cover',
    ]);
  });

  it('leaves out what this pool does not have', () => {
    const withoutSolar = { ...FULL_POOL };
    delete (withoutSolar as Record<string, unknown>).f;
    const resolved = defaultDetailEntities(buildEntityIndex(withoutSolar), () => true);

    expect(resolved).not.toContain('climate.solar');
    expect(resolved).toContain('climate.heater');
  });

  it('skips entities the registry knows but that carry no state', () => {
    const index = buildEntityIndex(FULL_POOL);
    const resolved = defaultDetailEntities(index, (id) => id !== 'sensor.ph');

    expect(resolved).not.toContain('sensor.ph');
    expect(resolved).toContain('sensor.orp');
  });

  it('returns nothing when the integration is not installed', () => {
    expect(defaultDetailEntities(buildEntityIndex({}), () => true)).toEqual([]);
  });

  it('never lists the same entity twice', () => {
    const resolved = defaultDetailEntities(buildEntityIndex(FULL_POOL), () => true);
    expect(new Set(resolved).size).toBe(resolved.length);
  });

  it('every default suffix is one the registry can map', () => {
    for (const { suffix } of DETAILS_DEFAULT_SUFFIXES) {
      expect(LEGACY_SUFFIX_TO_SLOT[suffix], `${suffix} has no slot`).toBeDefined();
    }
  });

  it('every default suffix is looked up in the domain its slot lives in', () => {
    for (const { domain, suffix } of DETAILS_DEFAULT_SUFFIXES) {
      expect(LEGACY_SUFFIX_TO_SLOT[suffix].domain, suffix).toBe(domain);
    }
  });
});

describe('a switch the integration creates disabled', () => {
  /**
   * Reported on the forum for 0.5.0: the dosing card said it was looking for
   * `switch.violet_pool_controller_chlor_dosierung` - a German id no
   * installation has had since 2.5.0 - and the reporter had no
   * `switch.…_chlorine_dosing` either.
   *
   * Both observations were right. The integration creates DOS_1_CL, DOS_4_PHM,
   * DOS_5_PHP, DOS_6_FLOC, BACKWASH and REFILL with
   * `entity_registry_enabled_default: False`, so unless someone enables them
   * by hand they carry no state and never reach a card. Each has an enabled
   * sensor under the same translation key, and that is what the card falls
   * back to.
   */
  const CHLORINE_SENSOR = 'sensor.violet_pool_controller_chlorine_dosing_system';
  const CHLORINE_SWITCH = 'switch.violet_pool_controller_chlorine_dosing';

  /** What Home Assistant hands the card when the switch is enabled too. */
  const BOTH = {
    a: { entity_id: CHLORINE_SWITCH, platform: VIOLET_PLATFORM, translation_key: 'dos_1_cl' },
    b: { entity_id: CHLORINE_SENSOR, platform: VIOLET_PLATFORM, translation_key: 'dos_1_cl' },
  };

  /** A disabled entity is not in the registry the frontend sees. */
  const SENSOR_ONLY = {
    b: { entity_id: CHLORINE_SENSOR, platform: VIOLET_PLATFORM, translation_key: 'dos_1_cl' },
  };

  it('prefers the switch when it is there', () => {
    const resolution = resolveSlotEntity(
      buildEntityIndex(BOTH),
      'switch',
      'chlor_dosierung',
      () => true
    );

    expect(resolution).toEqual({ entityId: CHLORINE_SWITCH, controllable: true });
  });

  it('falls back to the sensor when the switch is disabled', () => {
    const resolution = resolveSlotEntity(
      buildEntityIndex(SENSOR_ONLY),
      'switch',
      'chlor_dosierung',
      () => true
    );

    expect(resolution?.entityId).toBe(CHLORINE_SENSOR);
    expect(resolution?.controllable).toBe(false);
  });

  it('falls back when the switch is registered but carries no state', () => {
    const resolution = resolveSlotEntity(
      buildEntityIndex(BOTH),
      'switch',
      'chlor_dosierung',
      (id) => id !== CHLORINE_SWITCH
    );

    expect(resolution?.entityId).toBe(CHLORINE_SENSOR);
    expect(resolution?.controllable).toBe(false);
    expect(resolution?.unavailableSwitch).toBe(CHLORINE_SWITCH);
  });

  it('reports nothing when neither exists', () => {
    expect(
      resolveSlotEntity(buildEntityIndex({}), 'switch', 'chlor_dosierung', () => true)
    ).toBeUndefined();
  });

  it('does not invent a sensor fallback for a slot that is already a sensor', () => {
    const index = buildEntityIndex({
      a: { entity_id: 'sensor.ph', platform: VIOLET_PLATFORM, translation_key: 'ph_value' },
    });

    const resolution = resolveSlotEntity(index, 'sensor', 'ph_wert', () => false);
    expect(resolution?.controllable).toBe(true);
  });
});

describe('the id the card falls back to', () => {
  /**
   * The German suffixes are index keys into the slot table, not entity ids.
   * When the registry cannot resolve a slot the card builds an id from the
   * *current* spelling - naming a German one only sent the reporter looking
   * for an entity that cannot exist.
   */
  const names: Record<string, Record<string, string>> = JSON.parse(
    readFileSync(new URL('./fixtures/integration-entity-keys.json', import.meta.url), 'utf-8')
  ).names;

  const slugify = (name: string): string =>
    name
      .normalize('NFKD')
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase()
      .replace(/_+/g, '_');

  it('is never the German spelling', () => {
    expect(fallbackSuffix('chlor_dosierung')).toBe('chlorine_dosing');
    expect(fallbackSuffix('filterpumpe')).toBe('filter_pump');
    expect(fallbackSuffix('ruckspulung')).toBe('backwash');
  });

  it('matches what the integration would name the entity, for every slot', () => {
    for (const [suffix, slot] of Object.entries(LEGACY_SUFFIX_TO_SLOT)) {
      const name = names[slot.domain]?.[slot.translationKey];
      expect(name, `${suffix}: ${slot.domain}.${slot.translationKey} has no English name`)
        .toBeDefined();
      expect(slot.currentSuffix, suffix).toBe(slugify(name as string));
    }
  });

  it('leaves an unknown suffix alone', () => {
    expect(fallbackSuffix('something_else')).toBe('something_else');
  });
});
