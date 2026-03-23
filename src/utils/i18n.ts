/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Utility: i18n – Mehrsprachigkeit (Deutsch / Englisch) für alle Kartentexte
 * Erstellt von Xerolux | MIT License
 */

export type Language = 'en' | 'de';
export type TranslationKey = keyof typeof TRANSLATIONS.en;

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

    // Service call toasts
    svc_pump_speed_control: 'Speed control',
    svc_pump_force_off: 'Force OFF',
    svc_pump_eco_mode: 'ECO Mode',
    svc_pump_boost_mode: 'BOOST Mode',
    svc_pump_auto: 'Auto Mode',
    svc_speed_label: 'Speed',
    svc_duration_label: 'for',
    svc_seconds_label: 's',
    svc_pv_activate: 'PV Surplus ACTIVATED',
    svc_pv_deactivate: 'PV Surplus DEACTIVATED',
    svc_pv_auto: 'PV Surplus AUTO mode',
    svc_lights_all_on: 'All Lights ON',
    svc_lights_all_off: 'All Lights OFF',
    svc_lights_all_auto: 'All Lights AUTO',
    svc_lights_sequence: 'Sequence mode',
    svc_lights_party: 'Party Mode',
    svc_lights_pulse: 'Light pulse',
    svc_lights_delay: 'Delay',
    svc_dosing_manual: 'Manual dosing',
    svc_dosing_auto: 'Auto dosing',
    svc_dosing_stop: 'Stop dosing',
    svc_temp_set: 'Temperature set to',
    svc_hvac_mode: 'HVAC mode set to',
    svc_value_set: 'Value set to',
    svc_turned_on: 'turned ON',
    svc_turned_off: 'turned OFF',
    svc_toggled: 'toggled',
    svc_cover_position: 'Cover position set to',
    svc_light_brightness: 'Light brightness set to',
    svc_light_color: 'Light color set to',
    svc_light_temp: 'Light temperature set to',
    svc_backwash_start: 'Filter backwash started',
    svc_rinse_start: 'Filter rinse started',
    svc_pressure_reset: 'Filter pressure reset',
    svc_refill_start: 'Refill started to',
    svc_refill_stop: 'Refill stopped',
    svc_sensor_calibrated: 'sensor calibrated to',
    svc_cycle_started: 'cycle started',
    svc_schedule_created: 'Schedule created',
    svc_schedule_deleted: 'Schedule deleted',
    svc_weather_updated: 'Weather settings updated',
    svc_energy_profile: 'Energy profile set to',
    svc_energy_report: 'Energy report for',
    svc_energy_generated: 'generated',
    svc_connection_test: 'Connection test started',
    svc_connection_status: 'Connection status retrieved',
    svc_error_summary: 'Error summary retrieved',
    svc_logs_exported: 'Diagnostic logs exported',
    svc_lines: 'lines',
    svc_error_history_cleared: 'Error history cleared',
    svc_rule_triggered: 'triggered',
    svc_rule_locked: 'locked',
    svc_rule_unlocked: 'unlocked',

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
    minutesAgo: 'Minuten her',
    hoursAgo: 'Stunden her',
    daysAgo: 'Tage her',

    // Service call toasts
    svc_pump_speed_control: 'Geschwindigkeitsregelung',
    svc_pump_force_off: 'Force AUS',
    svc_pump_eco_mode: 'ECO-Modus',
    svc_pump_boost_mode: 'BOOST-Modus',
    svc_pump_auto: 'Automatikmodus',
    svc_speed_label: 'Stufe',
    svc_duration_label: 'für',
    svc_seconds_label: 's',
    svc_pv_activate: 'PV-Überschuss AKTIVIERT',
    svc_pv_deactivate: 'PV-Überschuss DEAKTIVIERT',
    svc_pv_auto: 'PV-Überschuss AUTOMATIK',
    svc_lights_all_on: 'Alle Lichter AN',
    svc_lights_all_off: 'Alle Lichter AUS',
    svc_lights_all_auto: 'Alle Lichter AUTOMATIK',
    svc_lights_sequence: 'Sequenzmodus',
    svc_lights_party: 'Party-Modus',
    svc_lights_pulse: 'Lichtpuls',
    svc_lights_delay: 'Verzögerung',
    svc_dosing_manual: 'Manuelle Dosierung',
    svc_dosing_auto: 'Automatische Dosierung',
    svc_dosing_stop: 'Dosierung gestoppt',
    svc_temp_set: 'Temperatur gesetzt auf',
    svc_hvac_mode: 'HVAC-Modus gesetzt auf',
    svc_value_set: 'Wert gesetzt auf',
    svc_turned_on: 'eingeschaltet',
    svc_turned_off: 'ausgeschaltet',
    svc_toggled: 'umgeschaltet',
    svc_cover_position: 'Abdeckung Position gesetzt auf',
    svc_light_brightness: 'Lichthelligkeit gesetzt auf',
    svc_light_color: 'Lichtfarbe gesetzt auf',
    svc_light_temp: 'Lichttemperatur gesetzt auf',
    svc_backwash_start: 'Filterrückspülung gestartet',
    svc_rinse_start: 'Filterspülung gestartet',
    svc_pressure_reset: 'Filterdruck zurückgesetzt',
    svc_refill_start: 'Nachfüllen gestartet auf',
    svc_refill_stop: 'Nachfüllen gestoppt',
    svc_sensor_calibrated: 'Sensor kalibriert auf',
    svc_cycle_started: 'Zyklus gestartet',
    svc_schedule_created: 'Zeitplan erstellt',
    svc_schedule_deleted: 'Zeitplan gelöscht',
    svc_weather_updated: 'Wettereinstellungen aktualisiert',
    svc_energy_profile: 'Energieprofil gesetzt auf',
    svc_energy_report: 'Energiebericht für',
    svc_energy_generated: 'erstellt',
    svc_connection_test: 'Verbindungstest gestartet',
    svc_connection_status: 'Verbindungsstatus abgerufen',
    svc_error_summary: 'Fehlerzusammenfassung abgerufen',
    svc_logs_exported: 'Diagnoseprotokolle exportiert',
    svc_lines: 'Zeilen',
    svc_error_history_cleared: 'Fehlerverlauf gelöscht',
    svc_rule_triggered: 'ausgelöst',
    svc_rule_locked: 'gesperrt',
    svc_rule_unlocked: 'entsperrt',

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
    if (this.language !== lang) {
      this.language = lang;
    }
  }

  static getLanguage(): Language {
    return this.language;
  }

  static t(key: TranslationKey): string {
    const translations = TRANSLATIONS[this.language];
    return translations[key as keyof typeof translations] || key;
  }
}
