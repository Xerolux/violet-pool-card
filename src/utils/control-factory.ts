/**
 * Control Card Factory – Dynamic Control Component Generation
 * Generates cards from firmware knowledge for all pool systems
 */

export interface ControlDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'pump' | 'heater' | 'solar' | 'dosing' | 'refill' | 'overflow';
  controls: ControlItem[];
  status: StatusDisplay[];
}

export interface ControlItem {
  type: 'slider' | 'button' | 'toggle' | 'select' | 'numeric';
  label: string;
  key: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: unknown }>;
  presets?: Array<{ label: string; value: unknown }>;
  service: string;
  confirmRequired?: boolean;
}

export interface StatusDisplay {
  label: string;
  key: string;
  format?: 'temperature' | 'percentage' | 'time' | 'status' | 'duration';
  unit?: string;
  icon?: string;
  threshold?: { warn: number; critical: number };
}

/**
 * Complete control definitions derived from firmware analysis
 */
export const CONTROL_DEFINITIONS: Record<string, ControlDefinition> = {
  pump: {
    id: 'pump',
    name: 'Pump Control',
    icon: '🔵',
    color: '#0099FF',
    type: 'pump',
    controls: [
      {
        type: 'slider',
        label: 'Speed Control',
        key: 'speed',
        min: 0,
        max: 3,
        step: 1,
        service: 'control_pump_http',
      },
      {
        type: 'select',
        label: 'Operating Mode',
        key: 'mode',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'Eco', value: 'eco' },
          { label: 'Boost', value: 'boost' },
          { label: 'Manual Off', value: 'off' },
        ],
        service: 'control_pump_http',
      },
      {
        type: 'toggle',
        label: 'Anti-Freeze Protection',
        key: 'anti_freeze',
        service: 'control_pump_http',
      },
      {
        type: 'numeric',
        label: 'Max Runtime (hours)',
        key: 'max_runtime',
        min: 0,
        max: 24,
        service: 'control_pump_http',
      },
    ],
    status: [
      { label: 'Current Speed', key: 'speed', format: 'status' },
      { label: 'Runtime', key: 'runtime', format: 'duration', unit: 'hours' },
      { label: 'Power', key: 'power', format: 'percentage' },
      { label: 'State', key: 'state', format: 'status' },
    ],
  },

  heater: {
    id: 'heater',
    name: 'Heater Control',
    icon: '🔥',
    color: '#FF6B35',
    type: 'heater',
    controls: [
      {
        type: 'slider',
        label: 'Target Temperature',
        key: 'target_temp',
        min: 16,
        max: 40,
        step: 0.5,
        service: 'control_heater_http',
      },
      {
        type: 'select',
        label: 'Postrun Delay',
        key: 'postrun_delay',
        presets: [
          { label: 'Off', value: 0 },
          { label: '5 min', value: 300 },
          { label: '10 min', value: 600 },
          { label: '15 min', value: 900 },
          { label: '30 min', value: 1800 },
        ],
        service: 'control_heater_http',
      },
      {
        type: 'toggle',
        label: 'Boiler Monitoring',
        key: 'boiler_monitor',
        service: 'configure_sensor_calibration',
      },
    ],
    status: [
      { label: 'Current Temperature', key: 'pool_temp', format: 'temperature', unit: '°C' },
      { label: 'Target Temperature', key: 'target_temp', format: 'temperature', unit: '°C' },
      { label: 'Boiler Temperature', key: 'boiler_temp', format: 'temperature', unit: '°C' },
      { label: 'HX Temperature', key: 'hx_temp', format: 'temperature', unit: '°C', threshold: { warn: 55, critical: 60 } },
    ],
  },

  solar: {
    id: 'solar',
    name: 'Solar Control',
    icon: '☀️',
    color: '#FFD700',
    type: 'solar',
    controls: [
      {
        type: 'toggle',
        label: 'Solar Heating',
        key: 'solar_enabled',
        service: 'control_solar_http',
      },
      {
        type: 'button',
        label: 'Forced Flush',
        key: 'forced_flush',
        service: 'control_solar_http',
        confirmRequired: true,
      },
      {
        type: 'toggle',
        label: 'Anti-Freeze Mode',
        key: 'anti_freeze',
        service: 'control_solar_http',
      },
      {
        type: 'toggle',
        label: 'PV Surplus Mode',
        key: 'pv_surplus',
        service: 'manage_pv_surplus',
      },
    ],
    status: [
      { label: 'Solar Collector Temp', key: 'solar_temp', format: 'temperature', unit: '°C' },
      { label: 'Solar Efficiency', key: 'solar_efficiency', format: 'percentage' },
      { label: 'PV Power', key: 'pv_power', format: 'status' },
      { label: 'Flush Status', key: 'flush_state', format: 'status' },
    ],
  },

  dosing: {
    id: 'dosing',
    name: 'Dosing Systems',
    icon: '💧',
    color: '#00CC99',
    type: 'dosing',
    controls: [
      {
        type: 'select',
        label: 'Dosing Type',
        key: 'type',
        options: [
          { label: 'pH Minus', value: 'pH-' },
          { label: 'pH Plus', value: 'pH+' },
          { label: 'Chlorine', value: 'Chlor' },
          { label: 'Flocculant', value: 'Flockmittel' },
        ],
        service: 'manual_dosing_http',
      },
      {
        type: 'slider',
        label: 'Target Level',
        key: 'target_level',
        min: 0,
        max: 100,
        step: 1,
        service: 'set_dosing_target',
      },
      {
        type: 'toggle',
        label: 'Enable Auto-Dosing',
        key: 'auto_dosing',
        service: 'enable_dosing',
      },
      {
        type: 'numeric',
        label: 'Max Daily Limit (ml)',
        key: 'max_daily',
        min: 0,
        max: 10000,
        service: 'set_dosing_max_daily',
      },
    ],
    status: [
      { label: 'pH Value', key: 'ph_value', format: 'status', threshold: { warn: 7.2, critical: 6.8 } },
      { label: 'ORP Value', key: 'orp_value', format: 'status', threshold: { warn: 600, critical: 500 } },
      { label: 'Chlorine Level', key: 'chlorine_level', format: 'percentage' },
      { label: 'Dosing Status', key: 'dosing_status', format: 'status' },
    ],
  },

  refill: {
    id: 'refill',
    name: 'Refill Control',
    icon: '💧',
    color: '#00AAFF',
    type: 'refill',
    controls: [
      {
        type: 'select',
        label: 'Refill Type',
        key: 'refill_type',
        options: [
          { label: 'Single Switch', value: 1 },
          { label: 'Upper/Lower', value: 2 },
          { label: 'Conductive', value: 3 },
        ],
        service: 'configure_refill',
      },
      {
        type: 'toggle',
        label: 'Enable Refill',
        key: 'enabled',
        service: 'configure_refill',
      },
      {
        type: 'numeric',
        label: 'Target Level (%)',
        key: 'target_level',
        min: 0,
        max: 100,
        service: 'configure_refill',
      },
      {
        type: 'numeric',
        label: 'Max Fill Time (sec)',
        key: 'max_fill_time',
        min: 1,
        max: 3600,
        service: 'configure_refill',
      },
    ],
    status: [
      { label: 'Water Level', key: 'water_level', format: 'percentage' },
      { label: 'Refill Active', key: 'refill_active', format: 'status' },
      { label: 'Refill Type', key: 'refill_type', format: 'status' },
      { label: 'Error Code', key: 'refill_error', format: 'status' },
    ],
  },

  overflow: {
    id: 'overflow',
    name: 'Overflow Protection',
    icon: '⚠️',
    color: '#FF6B6B',
    type: 'overflow',
    controls: [
      {
        type: 'toggle',
        label: 'Enable Protection',
        key: 'enabled',
        service: 'configure_overflow',
      },
      {
        type: 'slider',
        label: 'Overflow Threshold (%)',
        key: 'overflow_level',
        min: 50,
        max: 100,
        step: 1,
        service: 'configure_overflow',
      },
      {
        type: 'slider',
        label: 'Dry-Run Threshold (%)',
        key: 'dryrun_level',
        min: 0,
        max: 50,
        step: 1,
        service: 'configure_overflow',
      },
      {
        type: 'toggle',
        label: 'Bathing AI Detection',
        key: 'bathing_ai_enabled',
        service: 'configure_overflow',
      },
    ],
    status: [
      { label: 'Water Level', key: 'water_level', format: 'percentage' },
      { label: 'Overflow Active', key: 'overflow_active', format: 'status' },
      { label: 'Dry-Run Active', key: 'dryrun_active', format: 'status' },
      { label: 'Bathing Detected', key: 'bathing_detected', format: 'status' },
    ],
  },
};

/**
 * Get all available control definitions
 */
export function getAvailableControls(): ControlDefinition[] {
  return Object.values(CONTROL_DEFINITIONS);
}

/**
 * Get control definition by ID
 */
export function getControlDefinition(id: string): ControlDefinition | undefined {
  return CONTROL_DEFINITIONS[id];
}

/**
 * Get related controls for a given type
 */
export function getRelatedControls(type: string): ControlDefinition[] {
  const typeMap: Record<string, string[]> = {
    heating: ['heater', 'solar'],
    water: ['refill', 'overflow'],
    circulation: ['pump'],
    chemistry: ['dosing'],
  };

  const types = typeMap[type] || [type];
  return types.map(t => CONTROL_DEFINITIONS[t]).filter(Boolean);
}
