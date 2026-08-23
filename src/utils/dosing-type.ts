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

/**
 * The values the integration's `smart_dosing` service accepts for
 * `dosing_type`. `Electrolysis` and `H2O2` exist there too; no card shows
 * them.
 */
export type DosingServiceType = 'pH-' | 'pH+' | 'Chlorine' | 'Electrolysis' | 'Flocculant';

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
  /**
   * What the channel is called in the `smart_dosing` service.
   *
   * The card sent `Chlor` and `Flockmittel` - the names the *controller's*
   * HTTP API uses. The service takes the English ones and translates them for
   * the controller itself (`DOSING_API_MAPPING` in the integration), so
   * `vol.In` rejected both before the handler ever ran: chlorine and
   * flocculant dosing could not be triggered from the card at all.
   */
  serviceValue: DosingServiceType;
  /** The suffix the card used to guess before it read the registry. */
  legacySuffix: string;
  /**
   * Fragments that identify the channel inside an entity id. Ordered most
   * specific first, and checked in the order of `DOSING_CHANNELS`, so
   * `ph_minus` is never mistaken for `ph_plus`.
   */
  idFragments: readonly string[];
}

/** Values users can select. Free chlorine shares the physical chlorine channel. */
export const DOSING_TYPES: readonly DosingType[] = [
  'chlorine',
  'free_chlorine',
  'electrolysis',
  'ph_minus',
  'ph_plus',
  'flocculant',
] as const;

export type ChlorinationMeasurement = 'orp' | 'free_chlorine';

/**
 * Ordered on purpose: the pH channels come before chlorine so that a
 * chlorine-flavoured fragment cannot claim a pH entity.
 */
export const DOSING_CHANNELS: readonly DosingChannel[] = [
  {
    type: 'electrolysis',
    translationKey: 'dos_2_elo',
    serviceValue: 'Electrolysis',
    modeTranslationKey: 'dos_elo_mode',
    legacySuffix: 'elektrolyse',
    idFragments: ['dos_2_elo', '_elo', 'electrolysis', 'elektrolyse'],
  },
  {
    type: 'ph_plus',
    translationKey: 'dos_5_php',
    serviceValue: 'pH+',
    modeTranslationKey: 'dos_php_mode',
    legacySuffix: 'dosierung_ph_plus',
    idFragments: ['_php', 'ph_plus', 'ph_pl', 'dosierung_ph_plus', 'dosierung_ph_1', 'ph_dosierung_2', 'ph_dosier_modus_2', 'ph_dosiersystem_2'],
  },
  {
    type: 'ph_minus',
    translationKey: 'dos_4_phm',
    serviceValue: 'pH-',
    modeTranslationKey: 'dos_phm_mode',
    legacySuffix: 'dosierung_ph_2',
    idFragments: ['_phm', 'ph_minus', 'ph_min', 'dosierung_ph_2', 'ph_dosierung', 'ph_dosier_modus', 'ph_dosiersystem'],
  },
  {
    type: 'flocculant',
    translationKey: 'dos_6_floc',
    serviceValue: 'Flocculant',
    modeTranslationKey: 'dos_floc_mode',
    legacySuffix: 'flockmittel',
    idFragments: ['_floc', 'flocculant', 'flockmittel', 'flockung'],
  },
  {
    type: 'chlorine',
    translationKey: 'dos_1_cl',
    serviceValue: 'Chlorine',
    modeTranslationKey: 'dos_cl_mode',
    legacySuffix: 'chlor_dosierung',
    idFragments: ['_cl', 'chlorine', 'chlor', 'chlordosier'],
  },
] as const;

/** The channel record for a type, for callers that start from the type. */
export function dosingChannel(type: DosingType): DosingChannel {
  // Both chlorine readings control the same DOS_1_CL dosing channel.
  const channelType = type === 'free_chlorine' ? 'chlorine' : type;
  return DOSING_CHANNELS.find((channel) => channel.type === channelType) as DosingChannel;
}

/** True when the value is one of the dosing channels a card can show. */
export function isDosingType(value: unknown): value is DosingType {
  return DOSING_TYPES.some((type) => type === value);
}

/** Selects the displayed control value without conflating ORP and free chlorine. */
export function dosingMeasurement(
  type: DosingType,
  directChlorineAvailable = false
): ChlorinationMeasurement | undefined {
  if (type === 'chlorine') return 'orp';
  if (type === 'free_chlorine') return 'free_chlorine';
  if (type === 'electrolysis') {
    return directChlorineAvailable ? 'free_chlorine' : 'orp';
  }
  return undefined;
}

/** Leniently parses and normalizes user input into a valid DosingType. */
export function normalizeDosingType(value: unknown): DosingType | undefined {
  if (!value || typeof value !== 'string') return undefined;
  const str = value.trim().toLowerCase();
  if (isDosingType(str)) return str;
  if (str.includes('ph_plus') || str.includes('ph+') || str.includes('ph_pl') || str.includes('plus')) return 'ph_plus';
  if (str.includes('ph_minus') || str.includes('ph-') || str.includes('ph_min') || str.includes('minus')) return 'ph_minus';
  if (str.includes('floc') || str.includes('flock')) return 'flocculant';
  if (str.includes('electrolysis') || str.includes('elektrolyse') || str.includes('_elo')) return 'electrolysis';
  if (str.includes('free_chlorine') || str.includes('free chlorine') || str.includes('freies chlor') || str.includes('mg/l') || str.includes('ppm')) return 'free_chlorine';
  if (str.includes('chlor') || str.includes('cl') || str.includes('orp') || str.includes('redox')) return 'chlorine';
  return undefined;
}

/**
 * Determines which channel an entity belongs to.
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
