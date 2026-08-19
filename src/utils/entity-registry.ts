/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Utility: Entity Registry – findet die Entitäten der Integration, statt ihre
 * IDs zu raten.
 *
 * Bis hierher hat die Karte jede Entität aus dem Präfix zusammengesetzt
 * (`switch.<präfix>_filterpumpe`). Die Integration bildet ihre Entity-IDs seit
 * 2.5.0 aber aus den *englischen* Namen, damit sie auf jeder Installation
 * gleich heißen – aus `filterpumpe` wurde `filter_pump`. Auf einer neu
 * eingerichteten Anlage traf deshalb keiner der geratenen Namen mehr.
 *
 * Home Assistant stellt jeder Karte mit `hass.entities` das Entitätsregister
 * zur Verfügung: darin steht zu jeder Entität, von welcher Integration sie
 * stammt (`platform`) und welchen sprachunabhängigen Schlüssel sie trägt
 * (`translation_key`). Damit lässt sich die richtige Entität nachschlagen,
 * unabhängig von Sprache, Umbenennungen und Präfix.
 */

/** Der Ausschnitt von `hass.entities`, den die Karte braucht. */
export interface RegistryDisplayEntry {
  entity_id: string;
  platform?: string;
  translation_key?: string;
  device_id?: string;
}

/** Die Integration, deren Entitäten diese Karte anzeigt. */
export const VIOLET_PLATFORM = 'violet_pool_controller';

/** Wo eine geratene Entity-ID-Endung bei der Integration wirklich liegt. */
export interface LegacyEntitySlot {
  /** Die Domain, in der die Karte diese Entität sucht. */
  domain: string;
  /** Der Schlüssel, unter dem die Integration sie führt. */
  translationKey: string;
}

/**
 * Geratene Entity-ID-Endung → Eintrag bei der Integration.
 *
 * Die Endungen links sind die deutschen IDs, die die Karte bisher geraten hat;
 * rechts steht, wo dieselbe Entität bei der Integration liegt. Endungen ohne
 * Gegenstück (`inlet`, `counter_current`, `salzgehalt`) fehlen hier bewusst –
 * die Integration kennt sie nicht, dafür bleibt es beim geratenen Namen.
 *
 * `tests/entity-registry.test.ts` prüft jeden Eintrag gegen die
 * Übersetzungsschlüssel der Integration; `npm run keys:update` holt sie neu.
 */
export const LEGACY_SUFFIX_TO_SLOT: Record<string, LegacyEntitySlot> = {
  // Ausgänge
  filterpumpe: { domain: 'switch', translationKey: 'pump' },
  beleuchtung: { domain: 'switch', translationKey: 'light' },
  ruckspulung: { domain: 'switch', translationKey: 'backwash' },
  chlor_dosierung: { domain: 'switch', translationKey: 'dos_1_cl' },
  dosierung_ph_2: { domain: 'switch', translationKey: 'dos_4_phm' },
  schaltregel_1: { domain: 'switch', translationKey: 'dirule_1' },
  // Klima und Abdeckung
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
  // Reichweiten der Dosierkanäle (gleicher Name auf beiden Seiten)
  dos_1_cl_remaining_range: { domain: 'sensor', translationKey: 'dos_1_cl_remaining_range' },
  dos_4_phm_remaining_range: { domain: 'sensor', translationKey: 'dos_4_phm_remaining_range' },
  dos_5_php_remaining_range: { domain: 'sensor', translationKey: 'dos_5_php_remaining_range' },
  dos_6_floc_remaining_range: { domain: 'sensor', translationKey: 'dos_6_floc_remaining_range' },
};

/** Schlüssel im Index: Domain und Übersetzungsschlüssel zusammen. */
const indexKey = (domain: string, translationKey: string): string =>
  `${domain}:${translationKey}`;

/**
 * Baut den Index „Domain + Übersetzungsschlüssel → Entity-ID" auf.
 *
 * @param entities `hass.entities`, das Entitätsregister von Home Assistant.
 * @param preferredPrefix Präfix aus der Kartenkonfiguration. Hängen mehrere
 *   Controller an einer Installation, gewinnt der, dessen Entity-IDs mit
 *   diesem Präfix beginnen.
 * @returns Den Index; leer, wenn keine Entität der Integration registriert ist.
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

  // Sortiert, damit bei mehreren Treffern immer dieselbe Entität gewinnt.
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

    // Bereits belegt: nur das konfigurierte Präfix darf den Eintrag ersetzen.
    if (prefix && entry.entity_id.startsWith(`${domain}.${prefix}_`)) {
      if (!current.startsWith(`${domain}.${prefix}_`)) {
        index.set(key, entry.entity_id);
      }
    }
  }

  return index;
}

/**
 * Schlägt die Entität nach, die hinter einer geratenen ID-Endung steckt.
 *
 * @param index Ergebnis von {@link buildEntityIndex}.
 * @param domain Die Domain der gesuchten Entität.
 * @param suffix Die Endung, die die Karte bisher geraten hat.
 * @returns Die registrierte Entity-ID oder `undefined`, wenn die Integration
 *   nichts Passendes führt.
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
