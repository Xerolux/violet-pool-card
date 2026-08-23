import { describe, expect, it } from 'vitest';
import {
  DOSING_CHANNELS,
  DOSING_TYPES,
  detectDosingType,
  dosingChannel,
  dosingMeasurement,
  isDosingType,
  normalizeDosingType,
} from '../src/utils/dosing-type';

/**
 * Reported on the forum after 0.4.5: the pump card finds its entities now,
 * the dosing card still does not - visually unchanged.
 *
 * The card decided which channel it was showing by searching the entity id for
 * the integration's translation keys - `_cl`, `_phm`, `_php`, `_floc`. Since
 * 2.5.0 the ids come from the English names and contain none of them, so every
 * channel except flocculant fell through to the `chlorine` default: a pH card
 * showed the ORP value in mV and judged it against the ORP thresholds.
 *
 * These ids are the ones the integration really creates. They are derived from
 * the English names in `translations/en.json` through the same slugify Home
 * Assistant applies (`entity.py: suggested_object_id`).
 */
const P = 'switch.violet_pool_controller_';

const CURRENT_IDS: ReadonlyArray<[string, string]> = [
  [`${P}chlorine_dosing`, 'chlorine'],
  [`${P}dosing_ph_minus`, 'ph_minus'],
  [`${P}dosing_ph_plus`, 'ph_plus'],
  [`${P}flocculant`, 'flocculant'],
  ['select.violet_pool_controller_electrolysis_dosing_mode', 'electrolysis'],
];

/** What installations set up before 2.5.0 still carry. */
const LEGACY_IDS: ReadonlyArray<[string, string]> = [
  [`${P}chlor_dosierung`, 'chlorine'],
  [`${P}dosierung_ph_2`, 'ph_minus'],
  [`${P}flockmittel`, 'flocculant'],
  ['sensor.violet_pool_controller_elektrolyse_dosiersystem', 'electrolysis'],
];

describe('the channel comes from the registry', () => {
  it.each(DOSING_CHANNELS)(
    'a $type entity is recognised by its translation key',
    (channel) => {
      // A deliberately unhelpful id: the key alone has to carry the decision.
      expect(detectDosingType('switch.some_renamed_entity', channel.translationKey)).toBe(
        channel.type
      );
    }
  );

  it('the key wins over an id that suggests another channel', () => {
    expect(detectDosingType(`${P}chlorine_dosing`, 'dos_4_phm')).toBe('ph_minus');
  });

  it('a key from another domain does not decide anything', () => {
    expect(detectDosingType('switch.unrelated', 'pump')).toBeUndefined();
  });
});

describe('falling back to the entity id', () => {
  it.each(CURRENT_IDS)('%s is a %s channel', (entityId, expected) => {
    expect(detectDosingType(entityId)).toBe(expected);
  });

  it.each(LEGACY_IDS)('%s is a %s channel', (entityId, expected) => {
    expect(detectDosingType(entityId)).toBe(expected);
  });

  it('pH minus is never mistaken for pH plus', () => {
    expect(detectDosingType(`${P}dosing_ph_minus`)).not.toBe('ph_plus');
    expect(detectDosingType(`${P}dosing_ph_plus`)).not.toBe('ph_minus');
  });

  it('an entity that names no channel returns nothing, rather than guessing', () => {
    expect(detectDosingType('switch.living_room_lamp')).toBeUndefined();
    expect(detectDosingType(undefined)).toBeUndefined();
  });
});

describe('the channel table', () => {
  it('covers every physical dosing channel exactly once', () => {
    const types = DOSING_CHANNELS.map((channel) => channel.type);
    expect(new Set(types).size).toBe(types.length);
    expect(new Set(types)).toEqual(
      new Set(['chlorine', 'electrolysis', 'ph_minus', 'ph_plus', 'flocculant'])
    );
  });

  it('offers both chlorine measurements as selectable dosing types', () => {
    expect(DOSING_TYPES).toContain('chlorine');
    expect(DOSING_TYPES).toContain('free_chlorine');
  });

  it('resolves a type back to its channel', () => {
    expect(dosingChannel('ph_plus').translationKey).toBe('dos_5_php');
    expect(dosingChannel('chlorine').translationKey).toBe('dos_1_cl');
    expect(dosingChannel('free_chlorine').translationKey).toBe('dos_1_cl');
    expect(dosingChannel('electrolysis').translationKey).toBe('dos_2_elo');
  });

  it('recognises every type and nothing else', () => {
    expect(isDosingType('ph_minus')).toBe(true);
    expect(isDosingType('electrolysis')).toBe(true);
    expect(isDosingType('free_chlorine')).toBe(true);
    expect(isDosingType('bleach')).toBe(false);
    expect(isDosingType(undefined)).toBe(false);
  });

  it('normalizes German and English electrolysis labels', () => {
    expect(normalizeDosingType('electrolysis')).toBe('electrolysis');
    expect(normalizeDosingType('Elektrolyse')).toBe('electrolysis');
  });

  it('normalizes German and English free-chlorine labels', () => {
    expect(normalizeDosingType('free chlorine')).toBe('free_chlorine');
    expect(normalizeDosingType('Freies Chlor (mg/l)')).toBe('free_chlorine');
  });
});

describe('chlorine measurement selection', () => {
  it('keeps legacy chlorine bound to the advertised ORP value', () => {
    expect(dosingMeasurement('chlorine', true)).toBe('orp');
  });

  it('uses mg/l only for the explicit free-chlorine option', () => {
    expect(dosingMeasurement('free_chlorine', true)).toBe('free_chlorine');
    expect(dosingMeasurement('free_chlorine', false)).toBe('free_chlorine');
  });

  it('keeps electrolysis auto-detection for existing configurations', () => {
    expect(dosingMeasurement('electrolysis', true)).toBe('free_chlorine');
    expect(dosingMeasurement('electrolysis', false)).toBe('orp');
  });
});
