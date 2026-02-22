
export interface EntityState {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface PumpState {
  level?: number;
  status: string;
  rawState: string;
}

export class EntityHelper {
  static parsePumpState(pumpState: string): PumpState {
    if (!pumpState || typeof pumpState !== 'string') {
      return { status: '', rawState: '' };
    }

    const parts = pumpState.split('|');
    if (parts.length === 2) {
      const level = parseInt(parts[0], 10);
      const status = this.formatSnakeCase(parts[1]);
      return {
        level: isNaN(level) ? undefined : level,
        status,
        rawState: pumpState,
      };
    }

    return {
      status: this.formatSnakeCase(pumpState),
      rawState: pumpState,
    };
  }

  static parseHeaterState(heaterState: string): PumpState {
    return this.parsePumpState(heaterState);
  }

  static parseSolarState(solarState: string): PumpState {
    return this.parsePumpState(solarState);
  }

  static formatSnakeCase(text: string): string {
    if (!text) return '';

    return text
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  static getCurrentTemperature(entity: EntityState): number | undefined {
    const temp = entity?.attributes?.current_temperature;
    return temp !== undefined ? Number(temp) : undefined;
  }

  static getTargetTemperature(entity: EntityState): number | undefined {
    const temp = entity?.attributes?.temperature;
    return temp !== undefined ? Number(temp) : undefined;
  }

  static getMinTemperature(entity: EntityState): number | undefined {
    const temp = entity?.attributes?.min_temp;
    return temp !== undefined ? Number(temp) : undefined;
  }

  static getMaxTemperature(entity: EntityState): number | undefined {
    const temp = entity?.attributes?.max_temp;
    return temp !== undefined ? Number(temp) : undefined;
  }
}
