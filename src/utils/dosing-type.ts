/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Utility: which dosing channel a card is showing.
 *
 * Reported on the forum after 0.4.5: the pump card finds its entities now,
 * the dosing card still does not - visually unchanged. The card decided the
 * channel by searching the entity id for `_cl`, `_phm`, `_php` and `_floc` -
 * the integration's translation keys, which never appear in an entity id.
 * Since 2.5.0 the ids come from the English names:
 *
 *     switch.<prefix>_chlorine_dosing     no `_cl`
 *     switch.<prefix>_dosing_ph_minus     no `_phm`
 *     switch.<prefix>_dosing_ph_plus      no `_php`
 *     switch.<prefix>_flocculant          `_floc` - the only one that matched
 *
 * Every unmatched id fell through to the `chlorine` default, so a pH card
 * showed the ORP value in mV, judged it against the ORP thresholds and wrote
 * to the ORP setpoint.
 *
 * The registry knows the answer exactly - `translation_key` is the key the
 * integration files an entity under, independent of language and renaming -
 * so that is what decides here. Matching the id is kept only for entities the
 * registry cannot explain (a template sensor, a manually named helper), and
 * now covers the spellings that actually occur.
 */

import type { DosingType } from '../types';

export type { DosingType };

/** What identifies one channel across the integration and the old card ids. */
export interface DosingChannel {
  type: DosingType;
  /** The integration's translation key for the channel's switch. */
  translationKey: string;
  /**
   * The translation key of the channel's mode select - the entity that says
   * whether the channel runs automatically, and the last one the card can fall
   * back to when neither the switch nor the sensor is registered.
   */
  modeTranslationKey: string;
  /** The suffix the card used to guess before it read the registry. */
  legacySuffix: string;
  /**
   * Fragments that identify the channel inside an entity id. Ordered most
   * specific first, and checked in the order of `DOSING_CHANNELS`, so
   * `ph_minus` is never mistaken for `ph_plus`.
   */
  idFragments: readonly string[];
}

/**
 * Ordered on purpose: the pH channels come before chlorine so that a
 * chlorine-flavoured fragment cannot claim a pH entity.
 */
export const DOSING_CHANNELS: readonly DosingChannel[] = [
  {
    type: 'ph_minus',
    translationKey: 'dos_4_phm',
    modeTranslationKey: 'dos_phm_mode',
    legacySuffix: 'dosierung_ph_2',
    idFragments: ['_phm', 'ph_minus', 'ph_min', 'dosierung_ph_2', 'ph_dosierung_2'],
  },
  {
    type: 'ph_plus',
    translationKey: 'dos_5_php',
    modeTranslationKey: 'dos_php_mode',
    legacySuffix: 'dosierung_ph_plus',
    idFragments: ['_php', 'ph_plus', 'ph_pl'],
  },
  {
    type: 'flocculant',
    translationKey: 'dos_6_floc',
    modeTranslationKey: 'dos_floc_mode',
    legacySuffix: 'flockmittel',
    idFragments: ['_floc', 'flocculant', 'flockmittel'],
  },
  {
    type: 'chlorine',
    translationKey: 'dos_1_cl',
    modeTranslationKey: 'dos_cl_mode',
    legacySuffix: 'chlor_dosierung',
    idFragments: ['_cl', 'chlorine', 'chlor'],
  },
] as const;

/** The channel record for a type, for callers that start from the type. */
export function dosingChannel(type: DosingType): DosingChannel {
  // The list covers every member of DosingType, so this cannot miss.
  return DOSING_CHANNELS.find((channel) => channel.type === type) as DosingChannel;
}

/** True when the value is one of the four channels a card can show. */
export function isDosingType(value: unknown): value is DosingType {
  return DOSING_CHANNELS.some((channel) => channel.type === value);
}

/**
 * Determines which channel an entity belongs to.
 *
 * @param entityId The entity the card is showing.
 * @param translationKey The registry's `translation_key` for that entity, when
 *   Home Assistant reports one. It decides on its own - the id is not consulted.
 * @returns The channel, or `undefined` when neither source identifies one.
 *   Callers decide what to do with that; guessing a channel is what produced
 *   the bug this module exists for.
 */
export function detectDosingType(
  entityId: string | undefined,
  translationKey?: string
): DosingType | undefined {
  if (translationKey) {
    const byKey = DOSING_CHANNELS.find(
      (channel) => channel.translationKey === translationKey
    );
    if (byKey) {
      return byKey.type;
    }
  }

  if (!entityId) {
    return undefined;
  }

  const id = entityId.toLowerCase();
  for (const channel of DOSING_CHANNELS) {
    if (channel.idFragments.some((fragment) => id.includes(fragment))) {
      return channel.type;
    }
  }

  return undefined;
}
