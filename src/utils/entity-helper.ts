/**
 * Entity Helper Utility
 * Parse and extract information from Home Assistant entity states and attributes
 */

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
  /**
   * Parse PUMPSTATE attribute
   * Format: "3|PUMP_ANTI_FREEZE" -> { level: 3, status: "Pump Anti Freeze", rawState: "..." }
   */
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

  /**
   * Parse HEATERSTATE attribute
   */
  static parseHeaterState(heaterState: string): PumpState {
    return this.parsePumpState(heaterState);
  }

  /**
   * Parse SOLARSTATE attribute
   */
  static parseSolarState(solarState: string): PumpState {
    return this.parsePumpState(solarState);
  }

  /**
   * Format SNAKE_CASE to readable text
   * Example: "PUMP_ANTI_FREEZE" -> "Pump Anti Freeze"
   */
  static formatSnakeCase(text: string): string {
    if (!text) return '';

    return text
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Get current temperature (for climate entities)
   */
  static getCurrentTemperature(entity: EntityState): number | undefined {
    const temp = entity?.attributes?.current_temperature;
    return temp !== undefined ? Number(temp) : undefined;
  }

  /**
   * Get target temperature (for climate entities)
   */
  static getTargetTemperature(entity: EntityState): number | undefined {
    const temp = entity?.attributes?.temperature;
    return temp !== undefined ? Number(temp) : undefined;
  }

  /**
   * Get min temperature (for climate entities)
   */
  static getMinTemperature(entity: EntityState): number | undefined {
    const temp = entity?.attributes?.min_temp;
    return temp !== undefined ? Number(temp) : undefined;
  }

  /**
   * Get max temperature (for climate entities)
   */
  static getMaxTemperature(entity: EntityState): number | undefined {
    const temp = entity?.attributes?.max_temp;
    return temp !== undefined ? Number(temp) : undefined;
  }
}
