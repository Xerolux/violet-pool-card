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
      return ['Pumpe steht. Für Grundzirkulation ECO oder AUTO aktivieren.'];
    }
    if (currentSpeed >= 3) {
      return ['Boost nur kurz nutzen, um Energieverbrauch und Verschleiß zu begrenzen.'];
    }
    if (currentSpeed === 1) {
      return ['ECO läuft effizient. Ideal für Dauerfiltration und Nachtbetrieb.'];
    }
    if (currentMode === 'auto') {
      return ['AUTO hält die Anlage flexibel. Prüfe, ob Zeitpläne und Regeln passend gesetzt sind.'];
    }
    return ['Normale Filtration aktiv. Bei Chemiedosierung kurzzeitig auf höhere Leistung wechseln.'];
  }

  static getHeaterRecommendations(options: HeaterRecommendationOptions): SeverityAlert[] {
    const alerts: SeverityAlert[] = [];
    const { currentTemp, targetTemp, outsideTemp, minOutsideTemp = 14.5, isBlockedByOutsideTemp } = options;

    if (isBlockedByOutsideTemp) {
      alerts.push({
        text: 'Heizung durch Außentemperatur begrenzt',
        severity: 'critical',
        icon: 'mdi:snowflake-alert',
        recommendation: `Außentemperatur liegt unter ${minOutsideTemp}°C. Frostschutz aktiv lassen und Zieltemperatur später prüfen.`,
        source: 'heater',
      });
    }

    if (currentTemp !== undefined && targetTemp !== undefined && currentTemp + 1.5 < targetTemp) {
      alerts.push({
        text: 'Wassertemperatur deutlich unter Zielwert',
        severity: 'warning',
        icon: 'mdi:thermometer-chevron-up',
        recommendation: 'Heizleistung, Laufzeit und Wärmequelle prüfen, damit der Zielwert erreicht wird.',
        source: 'heater',
      });
    }

    if (outsideTemp != null && outsideTemp > minOutsideTemp + 4 && currentTemp !== undefined && targetTemp !== undefined && currentTemp >= targetTemp) {
      alerts.push({
        text: 'Heizung kann in Effizienzmodus wechseln',
        severity: 'info',
        icon: 'mdi:leaf',
        recommendation: 'Bei warmer Außenluft genügt oft AUTO statt Dauer-HEAT.',
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
        text: 'Absorber kälter als Poolwasser',
        severity: 'warning',
        icon: 'mdi:weather-cloudy-alert',
        recommendation: 'Solarheizung pausieren oder AUTO nutzen, bis der Kollektor wieder Wärme aufbaut.',
        source: 'solar',
      });
    } else if (tempDelta !== undefined && tempDelta >= 3) {
      alerts.push({
        text: 'Sehr gute Solarbedingungen',
        severity: 'info',
        icon: 'mdi:weather-sunny',
        recommendation: 'Jetzt eignet sich Solar ideal zum Vorwärmen oder zum kostenlosen Nachheizen.',
        source: 'solar',
      });
    }

    if (poolTemp !== undefined && targetTemp !== undefined && poolTemp >= targetTemp) {
      alerts.push({
        text: 'Zieltemperatur erreicht',
        severity: 'ok',
        icon: 'mdi:check-circle',
        recommendation: 'Solar kann auf Erhaltung laufen, um Überheizung zu vermeiden.',
        source: 'solar',
      });
    }

    if (absorberTemp != null && absorberTemp > 45) {
      alerts.push({
        text: 'Sehr hoher Kollektorwert',
        severity: 'info',
        icon: 'mdi:solar-power-variant',
        recommendation: 'Wärmeüberschuss kann für Boost-Betrieb oder Warmhaltephasen genutzt werden.',
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
          recommendation: 'Chlordosierung, Vorrat und Pumpenlaufzeit prüfen.',
          source: 'dosing',
        });
      }
      if (currentValue > targetValue + 40) {
        alerts.push({
          text: 'ORP über Zielbereich',
          severity: 'warning',
          icon: 'mdi:lightning-bolt-outline',
          recommendation: 'Dosierung reduzieren und Messwert gegenprüfen.',
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
          recommendation: 'pH+ Vorrat und Dosierlogik prüfen.',
          source: 'dosing',
        });
      }
      if (currentValue > phHigh) {
        alerts.push({
          text: 'pH zu hoch',
          severity: 'warning',
          icon: 'mdi:ph',
          recommendation: 'pH- Dosierung und Sensorwert prüfen.',
          source: 'dosing',
        });
      }
    }

    if (dosingState.some((entry) => entry.includes('BLOCKED') || entry.includes('ERROR'))) {
      alerts.push({
        text: 'Dosierung blockiert',
        severity: 'critical',
        icon: 'mdi:alert-octagon',
        recommendation: 'Freigaben, Kanisterstand und Sicherheitssperren prüfen.',
        source: 'dosing',
      });
    }

    if (dosingState.some((entry) => entry.includes('ACTIVE'))) {
      alerts.push({
        text: 'Dosierung läuft aktuell',
        severity: 'info',
        icon: 'mdi:water-sync',
        recommendation: 'Während aktiver Dosierung auf ausreichenden Pumpenfluss achten.',
        source: 'dosing',
      });
    }

    return alerts;
  }
}
