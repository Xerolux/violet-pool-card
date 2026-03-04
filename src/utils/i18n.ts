/**
 * Simple Internationalization (i18n) System
 * Supports English (EN) and German (DE)
 */

export type Language = 'en' | 'de';

export const TRANSLATIONS = {
  en: {
    // Card Types
    pump: 'Pump',
    heater: 'Heater',
    solar: 'Solar',
    dosing: 'Dosing',
    cover: 'Cover',
    light: 'Light',
    filter: 'Filter',
    chemical: 'Chemistry',
    sensor: 'Sensor',
    overview: 'Overview',
    details: 'Details',
    compact: 'Compact',
    system: 'System',
    statistics: 'Statistics',
    weather: 'Weather',
    maintenance: 'Maintenance',
    alerts: 'Alerts',
    comparison: 'Comparison',

    // Common
    on: 'On',
    off: 'Off',
    unknown: 'Unknown',
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    close: 'Close',
    ok: 'OK',
    cancel: 'Cancel',
    save: 'Save',

    // Status
    active: 'Active',
    inactive: 'Inactive',
    optimal: 'Optimal',
    warning: 'Warning',
    critical: 'Critical',
    running: 'Running',
    stopped: 'Stopped',

    // Time
    justNow: 'Just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',

    // Pool specific
    temperature: 'Temperature',
    brightness: 'Brightness',
    pressure: 'Pressure',
    pH: 'pH',
    ORP: 'ORP',
    chlorine: 'Chlorine',
    target: 'Target',
    current: 'Current',
    stale_data: 'Data is stale',
    data_not_available: 'Data not available',

    // Additions
    devices: 'Devices',
    all_systems_idle: 'All systems idle',
    all_systems_normal: 'All systems normal',
    frost_protection_active: 'Frost protection active',
    orp_too_low: 'ORP too low - Check chlorine dosing',
    orp_too_high: 'ORP too high - Stop chlorine dosing',
    ph_out_of_range: 'pH out of range - Check dosing',
    device_active: 'device active',
    devices_active: 'devices active',
    heater_plus_two: 'Heater +2°',
    ph_minus: 'pH-',
    chlorine_short: 'Chlorine',
    pump_short: 'Pump',
    heater_short: 'Heater',
  },
  de: {
    // Card Types
    pump: 'Pumpe',
    heater: 'Heizung',
    solar: 'Solar',
    dosing: 'Dosierung',
    cover: 'Abdeckung',
    light: 'Licht',
    filter: 'Filter',
    chemical: 'Chemie',
    sensor: 'Sensor',
    overview: 'Übersicht',
    details: 'Details',
    compact: 'Kompakt',
    system: 'System',
    statistics: 'Statistiken',
    weather: 'Wetter',
    maintenance: 'Wartung',
    alerts: 'Benachrichtigungen',
    comparison: 'Vergleich',

    // Common
    on: 'An',
    off: 'Aus',
    unknown: 'Unbekannt',
    loading: 'Lädt...',
    error: 'Fehler',
    retry: 'Erneut versuchen',
    close: 'Schließen',
    ok: 'OK',
    cancel: 'Abbrechen',
    save: 'Speichern',

    // Status
    active: 'Aktiv',
    inactive: 'Inaktiv',
    optimal: 'Optimal',
    warning: 'Warnung',
    critical: 'Kritisch',
    running: 'Läuft',
    stopped: 'Gestoppt',

    // Time
    justNow: 'Gerade eben',
    minutesAgo: 'Minuten ago',
    hoursAgo: 'Stunden ago',
    daysAgo: 'Tage ago',

    // Pool specific
    temperature: 'Temperatur',
    brightness: 'Helligkeit',
    pressure: 'Druck',
    pH: 'pH',
    ORP: 'ORP',
    chlorine: 'Chlor',
    target: 'Ziel',
    current: 'Aktuell',
    stale_data: 'Daten sind veraltet',
    data_not_available: 'Daten nicht verfügbar',

    // Additions
    devices: 'Geräte',
    all_systems_idle: 'Alle Systeme im Ruhezustand',
    all_systems_normal: 'Alle Systeme normal',
    frost_protection_active: 'Frostschutz aktiv',
    orp_too_low: 'ORP zu niedrig - Chlordosierung prüfen',
    orp_too_high: 'ORP zu hoch - Chlordosierung stoppen',
    ph_out_of_range: 'pH-Wert außerhalb des Bereichs - Dosierung prüfen',
    device_active: 'Gerät aktiv',
    devices_active: 'Geräte aktiv',
    heater_plus_two: 'Heizung +2°',
    ph_minus: 'pH-',
    chlorine_short: 'Chlor',
    pump_short: 'Pumpe',
    heater_short: 'Heizung',
  },
};

/**
 * Simple i18n helper
 */
export class i18n {
  private static language: Language = 'de';

  static setLanguage(lang: Language): void {
    this.language = lang;
  }

  static getLanguage(): Language {
    return this.language;
  }

  static t(key: keyof typeof TRANSLATIONS.en): string {
    const translations = TRANSLATIONS[this.language];
    return translations[key as keyof typeof translations] || key;
  }

  static translateCardType(cardType: string): string {
    return this.t(cardType as keyof typeof TRANSLATIONS.en);
  }
}
