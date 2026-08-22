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
  /**
   * The id suffix the integration produces today, from the English name.
   *
   * The suffix on the left of the table is the *old* German guess and is only
   * an index key. It must never reach an installation: when the registry
   * cannot resolve an entity, the card falls back to this one, so what it
   * reports looking for is a name that could actually exist. Reported on the
   * forum for 0.5.0 - the dosing card said it was looking for
   * `switch.…_chlor_dosierung`, an id no installation has had since 2.5.0.
   */
  currentSuffix: string;
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
  filterpumpe: { domain: 'switch', translationKey: 'pump', currentSuffix: 'filter_pump' },
  beleuchtung: { domain: 'switch', translationKey: 'light', currentSuffix: 'lighting' },
  ruckspulung: { domain: 'switch', translationKey: 'backwash', currentSuffix: 'backwash' },
  // Also created disabled by default, like the dosing channels.
  refill: { domain: 'switch', translationKey: 'refill', currentSuffix: 'water_refill' },
  chlor_dosierung: { domain: 'switch', translationKey: 'dos_1_cl', currentSuffix: 'chlorine_dosing' },
  dosierung_ph_2: { domain: 'switch', translationKey: 'dos_4_phm', currentSuffix: 'dosing_ph_minus' },
  // Reported on the forum for 0.5.2: `dosing_type` produced nothing but an
  // error. Two of the four channels had no entry here, so the registry was
  // never asked for them - the card guessed a German id, found nothing and
  // rendered its "entity not found" card. `tests/entity-registry.test.ts`
  // now checks that every channel in DOSING_CHANNELS has its slot.
  dosierung_ph_plus: { domain: 'switch', translationKey: 'dos_5_php', currentSuffix: 'dosing_ph_plus' },
  flockmittel: { domain: 'switch', translationKey: 'dos_6_floc', currentSuffix: 'flocculant' },
  schaltregel_1: { domain: 'switch', translationKey: 'dirule_1', currentSuffix: 'switching_rule_1' },
  // Climate and cover
  heizung: { domain: 'climate', translationKey: 'heater', currentSuffix: 'pool_heater' },
  solarabsorber: { domain: 'climate', translationKey: 'solar', currentSuffix: 'solar_heater' },
  abdeckung: { domain: 'cover', translationKey: 'pool_cover', currentSuffix: 'pool_cover' },
  // Sollwerte
  ph_sollwert: { domain: 'number', translationKey: 'ph_setpoint', currentSuffix: 'ph_setpoint' },
  redox_sollwert: { domain: 'number', translationKey: 'orp_setpoint', currentSuffix: 'orp_setpoint' },
  // Messwerte
  beckenwasser: { domain: 'sensor', translationKey: 'onewire1_value', currentSuffix: 'pool_water' },
  ph_wert: { domain: 'sensor', translationKey: 'ph_value', currentSuffix: 'ph_value' },
  redoxpotential: { domain: 'sensor', translationKey: 'orp_value', currentSuffix: 'orp_value' },
  chlorgehalt: { domain: 'sensor', translationKey: 'pot_value', currentSuffix: 'chlorine_content' },
  filterdruck: { domain: 'sensor', translationKey: 'adc1_value', currentSuffix: 'filter_pressure' },
  uberlaufbehalter: { domain: 'sensor', translationKey: 'adc2_value', currentSuffix: 'overflow_tank' },
  pumpen_durchfluss: { domain: 'sensor', translationKey: 'flow_rate', currentSuffix: 'flow_rate' },
  pv_uberschuss_status: { domain: 'sensor', translationKey: 'pvsurplus', currentSuffix: 'pv_surplus_status' },
  diagnostics_status: { domain: 'sensor', translationKey: 'system_health', currentSuffix: 'system_health' },
  // Dosing channel ranges (same name on both sides)
  dos_1_cl_remaining_range: { domain: 'sensor', translationKey: 'dos_1_cl_remaining_range', currentSuffix: 'chlorine_remaining_range' },
  dos_4_phm_remaining_range: { domain: 'sensor', translationKey: 'dos_4_phm_remaining_range', currentSuffix: 'ph_minus_remaining_range' },
  dos_5_php_remaining_range: { domain: 'sensor', translationKey: 'dos_5_php_remaining_range', currentSuffix: 'ph_plus_remaining_range' },
  dos_6_floc_remaining_range: { domain: 'sensor', translationKey: 'dos_6_floc_remaining_range', currentSuffix: 'flocculant_remaining_range' },
  // Aliases for controllers whose entities carry other German spellings.
  chlor_kanisterinhalt_ml: { domain: 'sensor', translationKey: 'dos_1_cl_remaining_range', currentSuffix: 'chlorine_remaining_range' },
  ph_kanisterinhalt_ml: { domain: 'sensor', translationKey: 'dos_4_phm_remaining_range', currentSuffix: 'ph_minus_remaining_range' },
  ph_kanisterinhalt_ml_2: { domain: 'sensor', translationKey: 'dos_5_php_remaining_range', currentSuffix: 'ph_plus_remaining_range' },
  flockmittel_kanisterinhalt_ml: { domain: 'sensor', translationKey: 'dos_6_floc_remaining_range', currentSuffix: 'flocculant_remaining_range' },
  poolwasser: { domain: 'sensor', translationKey: 'onewire1_value', currentSuffix: 'pool_water' },
  orp_wert: { domain: 'sensor', translationKey: 'orp_value', currentSuffix: 'orp_value' },
  sonnenkollektor: { domain: 'sensor', translationKey: 'onewire3_value', currentSuffix: 'solar_absorber' },
  pool_heizer: { domain: 'climate', translationKey: 'heater', currentSuffix: 'pool_heater' },
  solar_heizer: { domain: 'climate', translationKey: 'solar', currentSuffix: 'solar_heater' },
  pool_abdeckung: { domain: 'cover', translationKey: 'pool_cover', currentSuffix: 'pool_cover' },
  durchfluss: { domain: 'sensor', translationKey: 'flow_rate', currentSuffix: 'flow_rate' },
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
  chlorine_canister: { domain: 'sensor', suffix: 'dos_1_cl_remaining_range' },
  ph_plus_canister: { domain: 'sensor', suffix: 'dos_5_php_remaining_range' },
  ph_minus_canister: { domain: 'sensor', suffix: 'dos_4_phm_remaining_range' },
  flocculant_canister: { domain: 'sensor', suffix: 'dos_6_floc_remaining_range' },
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

/**
 * The id the card falls back to when the registry cannot resolve a slot.
 *
 * Never the German index key: that spelling stopped existing with 2.5.0, and
 * naming it only sends people looking for an entity that cannot be there.
 */
export function fallbackSuffix(suffix: string): string {
  return LEGACY_SUFFIX_TO_SLOT[suffix]?.currentSuffix ?? suffix;
}

/** What the card found for a slot, and what it can do with it. */
export interface SlotResolution {
  /** The entity to read. */
  entityId: string;
  /** False when this is the read-only sensor standing in for a switch. */
  controllable: boolean;
  /**
   * The switch that would carry the controls but has no state - almost always
   * because it is disabled in the entity registry. Set only when
   * `controllable` is false and the registry knows the switch.
   */
  unavailableSwitch?: string;
}

/**
 * Resolves the entity a card should show for a slot.
 *
 * Reported on the forum for 0.5.0: a switch.…_chlorine_dosing is nowhere to be
 * found on his installation. He is right - the integration creates the dosing,
 * backwash and refill switches with `entity_registry_enabled_default: False`,
 * so on an installation where nobody enabled them by hand they have no state,
 * and Home Assistant does not even hand them to a card. The card then fell
 * back to a guessed id and reported an entity that does not exist.
 *
 * Every one of those switches has a sensor counterpart under the same
 * translation key, and that one is enabled. So the switch is preferred - it is
 * the one that can be operated - and the sensor stands in for it when the
 * switch is not available, which at least shows the state.
 *
 * @param index Result of {@link buildEntityIndex}.
 * @param domain The domain the card would like.
 * @param suffix The slot, as the card names it.
 * @param hasState Whether an entity currently carries a state.
 */
export function resolveSlotEntity(
  index: Map<string, string>,
  domain: string,
  suffix: string,
  hasState: (entityId: string) => boolean
): SlotResolution | undefined {
  const slot = LEGACY_SUFFIX_TO_SLOT[suffix];
  const preferred = resolveEntityId(index, domain, suffix);

  if (preferred && hasState(preferred)) {
    return { entityId: preferred, controllable: true };
  }

  // Only a switch has a sensor to fall back to; for anything else the
  // requested entity is the only answer there is.
  if (slot && domain !== 'sensor') {
    const sensor = index.get(indexKey('sensor', slot.translationKey));
    if (sensor && hasState(sensor)) {
      return {
        entityId: sensor,
        controllable: false,
        unavailableSwitch: preferred,
      };
    }
  }

  return preferred ? { entityId: preferred, controllable: true } : undefined;
}
