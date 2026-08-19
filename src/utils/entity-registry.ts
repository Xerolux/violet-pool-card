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

/**
 * Geratene Entity-ID-Endung → Übersetzungsschlüssel der Integration.
 *
 * Die Endungen links sind die deutschen IDs, die die Karte bisher geraten hat;
 * rechts steht der Schlüssel, unter dem die Integration dieselbe Entität
 * führt. Endungen ohne Gegenstück (`inlet`, `counter_current`, `salzgehalt`)
 * fehlen hier bewusst – die Integration kennt sie nicht, dafür bleibt es beim
 * geratenen Namen.
 */
export const LEGACY_SUFFIX_TO_TRANSLATION_KEY: Record<string, string> = {
  // Ausgänge
  filterpumpe: 'pump',
  beleuchtung: 'light',
  ruckspulung: 'backwash',
  chlor_dosierung: 'dos_1_cl',
  dosierung_ph_2: 'dos_4_phm',
  schaltregel_1: 'dirule_1',
  // Klima und Abdeckung
  heizung: 'heater',
  solarabsorber: 'solar',
  abdeckung: 'pool_cover',
  // Sollwerte
  ph_sollwert: 'ph_setpoint',
  redox_sollwert: 'orp_setpoint',
  // Messwerte
  beckenwasser: 'onewire1_value',
  ph_wert: 'ph_value',
  redoxpotential: 'orp_value',
  chlorgehalt: 'pot_value',
  filterdruck: 'adc1_value',
  uberlaufbehalter: 'adc2_value',
  pumpen_durchfluss: 'flow_rate',
  pv_uberschuss_status: 'pvsurplus',
  diagnostics_status: 'system_health',
  // Reichweiten der Dosierkanäle (gleicher Name auf beiden Seiten)
  dos_1_cl_remaining_range: 'dos_1_cl_remaining_range',
  dos_4_phm_remaining_range: 'dos_4_phm_remaining_range',
  dos_5_php_remaining_range: 'dos_5_php_remaining_range',
  dos_6_floc_remaining_range: 'dos_6_floc_remaining_range',
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
  const translationKey = LEGACY_SUFFIX_TO_TRANSLATION_KEY[suffix];
  if (!translationKey) {
    return undefined;
  }
  return index.get(indexKey(domain, translationKey));
}
