/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Utility: Entity Registry - finds the integration's entities instead of
 * IDs zu raten.
 *
 * Until now the card assembled every entity id from the prefix
 * (`switch.<präfix>_filterpumpe`). Die Integration bildet ihre Entity-IDs seit
 * builds its ids from the *English* names since 2.5.0, so that they are the
 * same on every installation - `filterpumpe` became `filter_pump`. On a newly
 * set up system none of the guessed names matched any more.
 *
 * Home Assistant hands every card the entity registry in `hass.entities`: it
 * records, per entity, which integration it comes from (`platform`) and which
 * language-independent key it carries (`translation_key`). That is enough to
 * look up the right entity regardless of language, renaming or prefix.
 */

/** The part of `hass.entities` the card needs. */
export interface RegistryDisplayEntry {
  entity_id: string;
  platform?: string;
  translation_key?: string;
  device_id?: string;
}

/** The integration whose entities this card displays. */
export const VIOLET_PLATFORM = 'violet_pool_controller';

/** Where a guessed entity-id suffix actually lives in the integration. */
export interface LegacyEntitySlot {
  /** The domain the card looks this entity up in. */
  domain: string;
  /** The key the integration files it under. */
  translationKey: string;
}

/**
 * Guessed entity-id suffix -> the matching entry in the integration.
 *
 * The suffixes on the left are the German ids the card used to guess; on the
 * right is where the same entity lives in the integration. Suffixes without a
 * counterpart (`inlet`, `counter_current`, `salzgehalt`) are absent on purpose -
 * the integration does not know them, so the guessed name stays in place.
 *
 * `tests/entity-registry.test.ts` checks every entry against the
 * translation keys of the integration; `npm run keys:update` refreshes them.
 */
export const LEGACY_SUFFIX_TO_SLOT: Record<string, LegacyEntitySlot> = {
  // Outputs
  filterpumpe: { domain: 'switch', translationKey: 'pump' },
  beleuchtung: { domain: 'switch', translationKey: 'light' },
  ruckspulung: { domain: 'switch', translationKey: 'backwash' },
  chlor_dosierung: { domain: 'switch', translationKey: 'dos_1_cl' },
  dosierung_ph_2: { domain: 'switch', translationKey: 'dos_4_phm' },
  schaltregel_1: { domain: 'switch', translationKey: 'dirule_1' },
  // Climate and cover
  heizung: { domain: 'climate', translationKey: 'heater' },
  solarabsorber: { domain: 'climate', translationKey: 'solar' },
  abdeckung: { domain: 'cover', translationKey: 'pool_cover' },
  // Sollwerte
  ph_sollwert: { domain: 'number', translationKey: 'ph_setpoint' },
  redox_sollwert: { domain: 'number', translationKey: 'orp_setpoint' },
  // Messwerte
  beckenwasser: { domain: 'sensor', translationKey: 'onewire1_value' },
  ph_wert: { domain: 'sensor', translationKey: 'ph_value' },
  redoxpotential: { domain: 'sensor', translationKey: 'orp_value' },
  chlorgehalt: { domain: 'sensor', translationKey: 'pot_value' },
  filterdruck: { domain: 'sensor', translationKey: 'adc1_value' },
  uberlaufbehalter: { domain: 'sensor', translationKey: 'adc2_value' },
  pumpen_durchfluss: { domain: 'sensor', translationKey: 'flow_rate' },
  pv_uberschuss_status: { domain: 'sensor', translationKey: 'pvsurplus' },
  diagnostics_status: { domain: 'sensor', translationKey: 'system_health' },
  // Dosing channel ranges (same name on both sides)
  dos_1_cl_remaining_range: { domain: 'sensor', translationKey: 'dos_1_cl_remaining_range' },
  dos_4_phm_remaining_range: { domain: 'sensor', translationKey: 'dos_4_phm_remaining_range' },
  dos_5_php_remaining_range: { domain: 'sensor', translationKey: 'dos_5_php_remaining_range' },
  dos_6_floc_remaining_range: { domain: 'sensor', translationKey: 'dos_6_floc_remaining_range' },
};


/**
 * The entity a card type shows when the configuration names none.
 *
 * Reported on the forum for 0.4.2: the pump card did not find its entities.
 * The overview card resolved its entities through the registry,
 * but `renderPumpCard` read `config.entity` directly and `setConfig` refused
 * to build the card at all without one - so the automatic resolution never
 * reached the equipment cards, and `card_type: pump` on its own could not
 * work. The suffixes are the same ones `resolveEntityId` maps.
 */
export const CARD_TYPE_MAIN_ENTITY: Record<string, { domain: string; suffix: string }> = {
  pump: { domain: 'switch', suffix: 'filterpumpe' },
  compact: { domain: 'switch', suffix: 'filterpumpe' },
  heater: { domain: 'climate', suffix: 'heizung' },
  solar: { domain: 'climate', suffix: 'solarabsorber' },
  dosing: { domain: 'switch', suffix: 'chlor_dosierung' },
  filter: { domain: 'sensor', suffix: 'filterdruck' },
  backwash: { domain: 'switch', suffix: 'ruckspulung' },
  refill: { domain: 'sensor', suffix: 'uberlaufbehalter' },
  solar_surplus: { domain: 'sensor', suffix: 'pv_uberschuss_status' },
  flow_rate: { domain: 'sensor', suffix: 'pumpen_durchfluss' },
  inlet: { domain: 'switch', suffix: 'inlet' },
  counter_current: { domain: 'switch', suffix: 'counter_current' },
};

/**
 * Card types that cannot guess their entity, so the configuration must name
 * one. Everything else either has a default above or resolves its entities
 * itself while rendering.
 */
export const CARD_TYPES_REQUIRING_ENTITY = new Set(['sensor']);

/** Index key: domain and translation key combined. */
const indexKey = (domain: string, translationKey: string): string =>
  `${domain}:${translationKey}`;

/**
 * Builds the "domain + translation key -> entity id" index.
 *
 * @param entities `hass.entities`, the Home Assistant entity registry.
 * @param preferredPrefix Prefix from the card configuration. With several
 *   controllers on one installation, the one whose entity ids start with this
 *   prefix wins.
 * @returns The index; empty when no entity of the integration is registered.
 */
export function buildEntityIndex(
  entities: Record<string, RegistryDisplayEntry> | undefined,
  preferredPrefix?: string
): Map<string, string> {
  const index = new Map<string, string>();
  if (!entities) {
    return index;
  }

  const prefix = preferredPrefix || undefined;

  // Sorted so the same entity always wins when several match.
  for (const entry of Object.values(entities).sort((a, b) =>
    a.entity_id.localeCompare(b.entity_id)
  )) {
    if (entry.platform !== VIOLET_PLATFORM || !entry.translation_key) {
      continue;
    }

    const domain = entry.entity_id.split('.')[0];
    if (!domain) {
      continue;
    }

    const key = indexKey(domain, entry.translation_key);
    const current = index.get(key);
    if (current === undefined) {
      index.set(key, entry.entity_id);
      continue;
    }

    // Already taken: only the configured prefix may replace the entry.
    if (prefix && entry.entity_id.startsWith(`${domain}.${prefix}_`)) {
      if (!current.startsWith(`${domain}.${prefix}_`)) {
        index.set(key, entry.entity_id);
      }
    }
  }

  return index;
}

/**
 * Looks up the entity behind a guessed id suffix.
 *
 * @param index Result of {@link buildEntityIndex}.
 * @param domain The domain of the entity being looked for.
 * @param suffix The suffix the card used to guess.
 * @returns The registered entity id, or `undefined` when the integration
 *   has no counterpart.
 */
export function resolveEntityId(
  index: Map<string, string>,
  domain: string,
  suffix: string
): string | undefined {
  const slot = LEGACY_SUFFIX_TO_SLOT[suffix];
  if (!slot || slot.domain !== domain) {
    return undefined;
  }
  return index.get(indexKey(domain, slot.translationKey));
}

/**
 * What the details card lists when the configuration names no entities.
 *
 * Asked for on the forum: the card refused to render without an `entities:`
 * list, which is correct but unhelpful - the reporter had no way of knowing
 * what to put in it. These are the readings and outputs a pool owner looks at
 * first, given as the same suffixes `resolveEntityId` maps, so they resolve
 * through the registry like everything else.
 *
 * Only the ones the installation actually has are shown: a pool without solar
 * or without a cover simply lists fewer rows, rather than showing entities
 * that do not exist.
 */
export const DETAILS_DEFAULT_SUFFIXES: ReadonlyArray<{ domain: string; suffix: string }> = [
  { domain: 'sensor', suffix: 'beckenwasser' },
  { domain: 'sensor', suffix: 'ph_wert' },
  { domain: 'sensor', suffix: 'redoxpotential' },
  { domain: 'sensor', suffix: 'chlorgehalt' },
  { domain: 'sensor', suffix: 'filterdruck' },
  { domain: 'sensor', suffix: 'pumpen_durchfluss' },
  { domain: 'switch', suffix: 'filterpumpe' },
  { domain: 'switch', suffix: 'ruckspulung' },
  { domain: 'switch', suffix: 'chlor_dosierung' },
  { domain: 'switch', suffix: 'dosierung_ph_2' },
  { domain: 'switch', suffix: 'beleuchtung' },
  { domain: 'climate', suffix: 'heizung' },
  { domain: 'climate', suffix: 'solarabsorber' },
  { domain: 'cover', suffix: 'abdeckung' },
];

/**
 * Resolves the default list against one installation.
 *
 * @param index Result of {@link buildEntityIndex}.
 * @param exists Whether an entity id is present in `hass.states`.
 * @returns The entity ids that exist here, in the order above.
 */
export function defaultDetailEntities(
  index: Map<string, string>,
  exists: (entityId: string) => boolean
): string[] {
  const resolved: string[] = [];
  for (const { domain, suffix } of DETAILS_DEFAULT_SUFFIXES) {
    const entityId = resolveEntityId(index, domain, suffix);
    if (entityId && exists(entityId) && !resolved.includes(entityId)) {
      resolved.push(entityId);
    }
  }
  return resolved;
}
