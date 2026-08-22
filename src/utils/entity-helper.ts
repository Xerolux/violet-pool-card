/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Utility: Entity Helper - helpers for working with Home Assistant entities
 * Created by Xerolux | MIT License
 */

export interface EntityState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
}

export interface PumpState {
  level?: number;
  status: string;
  rawState: string;
  mode?: string;
}

export interface DosingState {
  state: string;
  rawState: string;
  mode: string;
  isDosing: boolean;
  isActive: boolean;
  dosingType: 'chlorine' | 'ph_minus' | 'ph_plus' | 'flocculant';
  dailyUsageMl?: number;
}

export interface SaturationIndexResult {
  value: number;
  status: 'corrosive' | 'balanced' | 'scaling';
  statusLabel: string;
  color: string;
  description: string;
  recommendation: string;
}

export interface EntityFindOptions {
  preferred?: string;
  domain?: string | string[];
  prefix?: string;
  suffixes?: string[];
  patterns?: (string | RegExp)[];
  excludePatterns?: (string | RegExp)[];
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

  static getCurrentTemperature(entity: EntityState | undefined): number | undefined {
    if (!entity) return undefined;
    const temp = entity.attributes?.current_temperature ?? entity.attributes?.temperature;
    if (temp != null && !isNaN(Number(temp))) return Number(temp);
    const parsed = parseFloat(entity.state);
    return !isNaN(parsed) ? parsed : undefined;
  }

  static getTargetTemperature(entity: EntityState | undefined): number | undefined {
    if (!entity) return undefined;
    const temp = entity.attributes?.temperature ?? entity.attributes?.target_temperature;
    if (temp != null && !isNaN(Number(temp))) return Number(temp);
    const parsed = parseFloat(entity.state);
    return !isNaN(parsed) ? parsed : undefined;
  }

  static getMinTemperature(entity: EntityState | undefined): number | undefined {
    if (!entity) return undefined;
    const temp = entity.attributes?.min_temp;
    return temp != null ? Number(temp) : undefined;
  }

  static getMaxTemperature(entity: EntityState | undefined): number | undefined {
    if (!entity) return undefined;
    const temp = entity.attributes?.max_temp;
    return temp != null ? Number(temp) : undefined;
  }

  /**
   * Smart entity ID finder:
   * 1. Checks preferred entity (if present in states).
   * 2. Checks domain + prefix + English & German suffixes.
   * 3. Scans all states matching domain + pattern / regex.
   */
  static findEntityId(
    states: Record<string, EntityState> | undefined,
    options: EntityFindOptions
  ): string | undefined {
    if (!states) return options.preferred;

    // 1. Explicit preference that actually exists
    if (options.preferred && states[options.preferred]) {
      return options.preferred;
    }

    const domainList = options.domain
      ? Array.isArray(options.domain)
        ? options.domain
        : [options.domain]
      : [];

    const prefix = options.prefix || 'violet_pool_controller';
    const suffixes = options.suffixes || [];

    // 2. Direct lookup: domain.prefix_suffix
    for (const d of domainList.length ? domainList : ['switch', 'climate', 'sensor', 'number', 'select', 'cover', 'light', 'update']) {
      for (const s of suffixes) {
        const directId = `${d}.${prefix}_${s}`;
        if (states[directId]) {
          return directId;
        }
      }
    }

    // 3. Look for any entity where entity_id matches prefix + suffixes or ends with suffix
    for (const s of suffixes) {
      for (const entityId of Object.keys(states)) {
        const [domain, rest] = entityId.split('.');
        if (domainList.length && !domainList.includes(domain)) continue;
        if (rest && (rest === `${prefix}_${s}` || rest.endsWith(`_${s}`))) {
          return entityId;
        }
      }
    }

    // 4. Pattern / keyword matching
    const patterns = options.patterns || [];
    const excludePatterns = options.excludePatterns || [];

    for (const entityId of Object.keys(states)) {
      const [domain] = entityId.split('.');
      if (domainList.length && !domainList.includes(domain)) continue;

      // Check excludes
      let isExcluded = false;
      for (const ex of excludePatterns) {
        if (typeof ex === 'string' && entityId.includes(ex)) {
          isExcluded = true;
          break;
        } else if (ex instanceof RegExp && ex.test(entityId)) {
          isExcluded = true;
          break;
        }
      }
      if (isExcluded) continue;

      // Check includes
      for (const p of patterns) {
        if (typeof p === 'string' && entityId.includes(p)) {
          return entityId;
        } else if (p instanceof RegExp && p.test(entityId)) {
          return entityId;
        }
      }
    }

    // 5. Fallback: if preferred was specified, return it even if not yet in states
    if (options.preferred) {
      return options.preferred;
    }

    // Nothing matched. Constructing `domain.prefix_suffix` from the first
    // suffix used to happen here, which is what put a German id in front of
    // the reporter on the forum - the card named an entity that has not
    // existed since 2.5.0 and sent him looking for it. Saying nothing is the
    // honest answer; the caller decides what to show for it.
    return undefined;
  }

  /**
   * Helper to parse dosing entity state (works for sensor, switch, or select)
   */
  static parseDosingState(
    entity: EntityState | undefined,
    defaultType: 'chlorine' | 'ph_minus' | 'ph_plus' | 'flocculant' = 'chlorine'
  ): DosingState {
    if (!entity) {
      return {
        state: 'off',
        rawState: 'off',
        mode: 'off',
        isDosing: false,
        isActive: false,
        dosingType: defaultType,
      };
    }

    const stateStr = (entity.state || '').toLowerCase();
    const isSwitch = entity.entity_id.startsWith('switch.');
    const isSensor = entity.entity_id.startsWith('sensor.');
    const isSelect = entity.entity_id.startsWith('select.');

    let isDosing = false;
    let isActive = false;
    let mode = 'off';

    if (isSwitch) {
      isActive = stateStr === 'on';
      mode = isActive ? 'auto' : 'off';
    } else if (isSelect) {
      isActive = stateStr !== 'off' && stateStr !== 'disabled';
      mode = stateStr;
    } else if (isSensor) {
      isActive = !['off', 'disabled', 'inactive'].includes(stateStr);
      isDosing = ['dosing', 'active', 'running', 'on'].includes(stateStr);
      mode = ['ready', 'standby', 'auto', 'ok', 'active'].includes(stateStr) ? 'auto' : stateStr;
    } else {
      isActive = stateStr === 'on' || stateStr === 'auto';
      isDosing = stateStr === 'dosing';
      mode = stateStr;
    }

    // Check attributes for active dosing flags
    const attrs = entity.attributes || {};
    for (const [key, val] of Object.entries(attrs)) {
      if (key.includes('DOS_') && key.includes('_STATE')) {
        if (Array.isArray(val) && val.length > 0) {
          const first = String(val[0]).toLowerCase();
          if (first.includes('dose') || first.includes('run') || first.includes('on')) {
            isDosing = true;
          }
        }
      }
    }

    const dailyUsageMl = typeof attrs.daily_usage_ml === 'number'
      ? attrs.daily_usage_ml
      : typeof attrs.dosing_volume_24h === 'number'
      ? attrs.dosing_volume_24h
      : undefined;

    return {
      state: entity.state,
      rawState: entity.state,
      mode,
      isDosing,
      isActive,
      dosingType: defaultType,
      dailyUsageMl,
    };
  }

  /**
   * Calculate Langelier Saturation Index (LSI) & Calcite Saturation Index (CSI)
   */
  static calculateLSI(
    ph: number,
    tempC: number,
    calciumPpm = 250,
    alkalinityPpm = 100,
    tdsPpm = 1000,
    cyaPpm = 0
  ): SaturationIndexResult {
    if (isNaN(ph) || ph <= 0) {
      return {
        value: 0,
        status: 'balanced',
        statusLabel: 'Balanced',
        color: '#34C759',
        description: 'No pH data available to calculate saturation index.',
        recommendation: 'Ensure pH sensor is connected.',
      };
    }

    const t = isNaN(tempC) || tempC <= 0 ? 25 : tempC;
    const ch = Math.max(10, calciumPpm);
    const ta = Math.max(10, alkalinityPpm);
    const cya = Math.max(0, cyaPpm);
    const tds = Math.max(100, tdsPpm);

    // Temperature Factor (TF) - standard NSPF / LSI formula
    const tf = 13.12 * Math.log10(t + 273.15) - 31.95;

    // Calcium Factor (CF)
    const cf = Math.log10(ch) - 0.4;

    // Alkalinity Factor with CYA correction (AF)
    const cyaCorrection = cya * 0.33;
    const correctedTa = Math.max(10, ta - cyaCorrection);
    const af = Math.log10(correctedTa);

    // TDS Factor (TDSF)
    const tdsf = tds > 2000 ? 12.29 : tds > 1000 ? 12.19 : 12.1;

    // LSI Calculation
    const lsi = ph + tf + cf + af - tdsf;
    const rounded = Math.round(lsi * 100) / 100;

    if (rounded < -0.3) {
      return {
        value: rounded,
        status: 'corrosive',
        statusLabel: 'Corrosive (Under-saturated)',
        color: '#FF3B30',
        description: 'Water is corrosive and may etch pool surfaces, grout, and metal components.',
        recommendation: 'Increase pH, Calcium Hardness, or Alkalinity to protect equipment.',
      };
    } else if (rounded > 0.3) {
      return {
        value: rounded,
        status: 'scaling',
        statusLabel: 'Scale-forming (Over-saturated)',
        color: '#FF9500',
        description: 'Water is scale-forming and may cause cloudy water or calcium deposits on cells and heaters.',
        recommendation: 'Lower pH or Alkalinity to prevent scaling.',
      };
    } else {
      return {
        value: rounded,
        status: 'balanced',
        statusLabel: 'Ideal / Balanced',
        color: '#34C759',
        description: 'Water balance is in equilibrium. Safe for pool surfaces and heating equipment.',
        recommendation: 'Water is balanced. Maintain current chemical levels.',
      };
    }
  }

  /**
   * Calcite Saturation Index (CSI) - alias for LSI with salt consideration
   */
  static calculateCSI(
    ph: number,
    tempC: number,
    calciumPpm = 250,
    alkalinityPpm = 100,
    tdsPpm = 1000,
    cyaPpm = 0,
    saltPpm = 0
  ): SaturationIndexResult {
    const totalTds = Math.max(tdsPpm, saltPpm > 0 ? saltPpm + 1000 : tdsPpm);
    return this.calculateLSI(ph, tempC, calciumPpm, alkalinityPpm, totalTds, cyaPpm);
  }
}
