import { i18n } from './i18n';
import { isDosingActive, isDosingBlocked } from './integration-attributes';

export type Severity = 'ok' | 'info' | 'warning' | 'critical';

export interface SeverityAlert {
  text: string;
  severity: Severity;
  icon: string;
  recommendation?: string;
  source?: string;
}

interface HeaterRecommendationOptions {
  currentTemp?: number;
  targetTemp?: number;
  outsideTemp?: number | null;
  minOutsideTemp?: number;
  isBlockedByOutsideTemp?: boolean;
}

interface SolarRecommendationOptions {
  poolTemp?: number;
  targetTemp?: number;
  absorberTemp?: number | null;
  tempDelta?: number;
}

interface DosingRecommendationOptions {
  dosingType: string;
  currentValue?: number;
  targetValue?: number;
  dosingState?: string[];
}

export class SeverityModel {
  static classifyText(text: string): Severity {
    const normalized = text.toLowerCase();
    if (normalized.includes('critical') || normalized.includes('alarm') || normalized.includes('freeze')) return 'critical';
    if (normalized.includes('blocked') || normalized.includes('warning') || normalized.includes('limit')) return 'warning';
    if (normalized.includes('active') || normalized.includes('auto') || normalized.includes('info')) return 'info';
    return 'ok';
  }

  static getPumpRecommendations(currentSpeed: number, isRunning: boolean, currentMode?: string): string[] {
    if (!isRunning) {
      return [i18n.t('pump_idle_hint')];
    }
    if (currentSpeed >= 3) {
      return [i18n.t('pump_boost_hint')];
    }
    if (currentSpeed === 1) {
      return [i18n.t('pump_eco_hint')];
    }
    if (currentMode === 'auto') {
      return [i18n.t('pump_auto_hint')];
    }
    return [i18n.t('pump_normal_hint')];
  }

  static getHeaterRecommendations(options: HeaterRecommendationOptions): SeverityAlert[] {
    const alerts: SeverityAlert[] = [];
    const { currentTemp, targetTemp, outsideTemp, minOutsideTemp = 14.5, isBlockedByOutsideTemp } = options;

    if (isBlockedByOutsideTemp) {
      alerts.push({
        text: i18n.t('heater_limited_outside'),
        severity: 'critical',
        icon: 'mdi:snowflake-alert',
        recommendation: i18n.t('heater_frost_hint', { min: minOutsideTemp }),
        source: 'heater',
      });
    }

    if (currentTemp !== undefined && targetTemp !== undefined && currentTemp + 1.5 < targetTemp) {
      alerts.push({
        text: 'Wassertemperatur deutlich unter Zielwert',
        severity: 'warning',
        icon: 'mdi:thermometer-chevron-up',
        recommendation: i18n.t('heater_check_output'),
        source: 'heater',
      });
    }

    if (outsideTemp != null && outsideTemp > minOutsideTemp + 4 && currentTemp !== undefined && targetTemp !== undefined && currentTemp >= targetTemp) {
      alerts.push({
        text: 'Heizung kann in Effizienzmodus wechseln',
        severity: 'info',
        icon: 'mdi:leaf',
        recommendation: i18n.t('heater_auto_enough'),
        source: 'heater',
      });
    }

    return alerts;
  }

  static getSolarRecommendations(options: SolarRecommendationOptions): SeverityAlert[] {
    const alerts: SeverityAlert[] = [];
    const { poolTemp, targetTemp, absorberTemp, tempDelta } = options;

    if (tempDelta !== undefined && tempDelta < 0) {
      alerts.push({
        text: i18n.t('solar_absorber_colder'),
        severity: 'warning',
        icon: 'mdi:weather-cloudy-alert',
        recommendation: i18n.t('solar_pause_hint'),
        source: 'solar',
      });
    } else if (tempDelta !== undefined && tempDelta >= 3) {
      alerts.push({
        text: 'Sehr gute Solarbedingungen',
        severity: 'info',
        icon: 'mdi:weather-sunny',
        recommendation: i18n.t('solar_ideal_hint'),
        source: 'solar',
      });
    }

    if (poolTemp !== undefined && targetTemp !== undefined && poolTemp >= targetTemp) {
      alerts.push({
        text: 'Zieltemperatur erreicht',
        severity: 'ok',
        icon: 'mdi:check-circle',
        recommendation: i18n.t('solar_maintain_hint'),
        source: 'solar',
      });
    }

    if (absorberTemp != null && absorberTemp > 45) {
      alerts.push({
        text: 'Sehr hoher Kollektorwert',
        severity: 'info',
        icon: 'mdi:solar-power-variant',
        recommendation: i18n.t('solar_surplus_hint'),
        source: 'solar',
      });
    }

    return alerts;
  }

  static getDosingRecommendations(options: DosingRecommendationOptions): SeverityAlert[] {
    const alerts: SeverityAlert[] = [];
    const { dosingType, currentValue, targetValue, dosingState = [] } = options;

    if (dosingType === 'chlorine' && currentValue !== undefined && targetValue !== undefined) {
      if (currentValue < targetValue - 40) {
        alerts.push({
          text: 'ORP unter Zielbereich',
          severity: 'warning',
          icon: 'mdi:lightning-bolt',
          recommendation: i18n.t('dosing_check_chlorine'),
          source: 'dosing',
        });
      }
      if (currentValue > targetValue + 40) {
        alerts.push({
          text: i18n.t('orp_above_target'),
          severity: 'warning',
          icon: 'mdi:lightning-bolt-outline',
          recommendation: i18n.t('dosing_reduce_verify'),
          source: 'dosing',
        });
      }
    }

    if ((dosingType === 'ph_minus' || dosingType === 'ph_plus') && currentValue !== undefined) {
      // Respect the configured target pH (±0.3 tolerance, DIN 19643: 7.0–7.4 default)
      const phLow = targetValue !== undefined ? targetValue - 0.3 : 7.0;
      const phHigh = targetValue !== undefined ? targetValue + 0.3 : 7.4;
      if (currentValue < phLow) {
        alerts.push({
          text: 'pH zu niedrig',
          severity: 'warning',
          icon: 'mdi:ph',
          recommendation: i18n.t('dosing_check_ph_plus'),
          source: 'dosing',
        });
      }
      if (currentValue > phHigh) {
        alerts.push({
          text: 'pH zu hoch',
          severity: 'warning',
          icon: 'mdi:ph',
          recommendation: i18n.t('dosing_check_ph_minus'),
          source: 'dosing',
        });
      }
    }

    if (isDosingBlocked(dosingState)) {
      alerts.push({
        text: 'Dosierung blockiert',
        severity: 'critical',
        icon: 'mdi:alert-octagon',
        recommendation: i18n.t('dosing_check_release'),
        source: 'dosing',
      });
    }

    if (isDosingActive(dosingState)) {
      alerts.push({
        text: i18n.t('dosing_running'),
        severity: 'info',
        icon: 'mdi:water-sync',
        recommendation: i18n.t('dosing_flow_hint'),
        source: 'dosing',
      });
    }

    return alerts;
  }
}
