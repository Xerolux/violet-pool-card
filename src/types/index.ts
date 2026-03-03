/**
 * Comprehensive type definitions for Violet Pool Card
 * Ensures type safety across all components
 */

// ============================================================================
// Entity & State Types
// ============================================================================

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id: unknown;
    user_id: unknown;
  };
}

export interface HassEntityAttributes extends Record<string, unknown> {
  friendly_name?: string;
  icon?: string;
  unit_of_measurement?: string;
  [key: string]: unknown;
}

export interface TemperatureEntity extends HassEntity {
  attributes: HassEntityAttributes & {
    current_temperature?: number;
    temperature?: number;
    min_temp?: number;
    max_temp?: number;
    hvac_modes?: string[];
    hvac_mode?: string;
  };
}

export interface LightEntity extends HassEntity {
  attributes: HassEntityAttributes & {
    brightness?: number;
    rgb_color?: [number, number, number];
    xy_color?: [number, number];
    color_temp?: number;
    supported_features?: number;
  };
}

export interface CoverEntity extends HassEntity {
  attributes: HassEntityAttributes & {
    current_position?: number;
    current_tilt_position?: number;
    supported_features?: number;
  };
}

export interface SwitchEntity extends HassEntity {
  state: 'on' | 'off';
  attributes: HassEntityAttributes & {
    current_power_w?: number;
    power?: string;
  };
}

export interface SensorEntity extends HassEntity {
  attributes: HassEntityAttributes & {
    state_class?: string;
    last_reset?: string;
    unit_of_measurement?: string;
  };
}

// ============================================================================
// Card Configuration Types
// ============================================================================

export type CardType =
  | 'pump'
  | 'heater'
  | 'solar'
  | 'dosing'
  | 'overview'
  | 'compact'
  | 'system'
  | 'details'
  | 'chemical'
  | 'sensor'
  | 'cover'
  | 'light'
  | 'filter'
  | 'backwash'
  | 'refill'
  | 'solar_surplus'
  | 'flow_rate'
  | 'inlet'
  | 'counter_current'
  | 'chlorine_canister'
  | 'ph_plus_canister'
  | 'ph_minus_canister'
  | 'flocculant_canister';

export type CardSize = 'small' | 'medium' | 'large' | 'fullscreen';

export type Theme =
  | 'classic'
  | 'midnight'
  | 'elegance'
  | 'vibrant'
  | 'pure'
  | 'frost'
  | 'glow'
  | 'metallic'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'aurora';

export type Animation = 'none' | 'subtle' | 'smooth' | 'energetic';

export type DosingType = 'chlorine' | 'ph_minus' | 'ph_plus' | 'flocculant';

export interface CardAction {
  action?: string;
  service?: string;
  service_data?: Record<string, unknown>;
  navigation_path?: string;
  url_path?: string;
  confirmation?: {
    text?: string;
  };
}

export interface VioletPoolCardConfig {
  // Basic configuration
  type: string;
  card_type: CardType;
  entity?: string;
  entities?: string[];

  // Entity overrides
  entity_prefix?: string;
  pump_entity?: string;
  heater_entity?: string;
  solar_entity?: string;
  chlorine_entity?: string;
  ph_minus_entity?: string;
  ph_plus_entity?: string;
  pool_temp_entity?: string;
  ph_value_entity?: string;
  orp_value_entity?: string;
  target_orp_entity?: string;
  target_ph_entity?: string;
  cover_entity?: string;
  light_entity?: string;
  filter_entity?: string;
  filter_pressure_entity?: string;
  backwash_entity?: string;
  inlet_entity?: string;
  chlorine_level_entity?: string; // For chlorine canister
  salt_level_entity?: string; // For salt water pools
  cyanuric_acid_entity?: string; // For stabilizer
  alkalinity_entity?: string; // For total alkalinity
  flow_rate_entity?: string;
  level_entity?: string; // Generic canister level
  max_level?: number; // Max level for canisters

  // Chemistry card display options
  chemistry_type?: 'chlorine' | 'salt' | 'bromine' | 'ozone';
  show_chlorine?: boolean;
  show_salt?: boolean;
  show_cyanuric_acid?: boolean;
  show_alkalinity?: boolean;
  show_temperature?: boolean;
  show_ph?: boolean;
  show_orp?: boolean;
  show_inlet?: boolean;

  // Display options
  name?: string;
  icon?: string;
  show_state?: boolean;
  show_detail_status?: boolean;
  show_controls?: boolean;
  show_runtime?: boolean;
  show_history?: boolean;

  // Design options
  size?: CardSize;
  theme?: Theme;
  animation?: Animation;
  accent_color?: string;
  icon_color?: string;
  gradient?: string;
  blur_intensity?: number;

  // Advanced design options
  custom_width?: number;
  custom_height?: number;
  custom_padding?: number;
  border_radius?: number;
  shadow_intensity?: 'none' | 'low' | 'medium' | 'high';

  // Dosing options
  dosing_type?: DosingType;

  // Legacy options
  style?: 'standard' | 'modern' | 'luxury';
  show_flow_animation?: boolean;

  // Actions
  tap_action?: CardAction;
  hold_action?: CardAction;
  double_tap_action?: CardAction;
}

// ============================================================================
// Component State Types
// ============================================================================

export interface PumpState {
  level?: number;
  status: string;
  isRunning: boolean;
  speed: 0 | 1 | 2 | 3;
  runtime?: number;
}

export interface TemperatureState {
  current: number;
  target?: number;
  min?: number;
  max?: number;
  mode?: 'off' | 'heat' | 'cool' | 'auto';
}

export interface ChemistryReading {
  label: string;
  value: number;
  unit: string;
  target?: number;
  min?: number;
  max?: number;
  status: 'ok' | 'warning' | 'critical';
}

export interface LightState {
  on: boolean;
  brightness: number;
  color?: {
    rgb: [number, number, number];
    hex: string;
  };
}

export interface CoverState {
  open: boolean;
  position: number; // 0-100
  isMoving: boolean;
}

// ============================================================================
// Action & Event Types
// ============================================================================

export interface QuickAction {
  icon: string;
  label: string;
  action: () => Promise<void> | void;
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  color?: string;
  confirmMessage?: string;
}

export interface ActionEvent<T = Record<string, unknown>> {
  type: string;
  detail: T;
  bubbles: boolean;
  composed: boolean;
}

export interface ServiceCallOptions {
  domain: string;
  service: string;
  serviceData?: Record<string, unknown>;
}

export interface ServiceCallResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

// ============================================================================
// Color & Styling Types
// ============================================================================

export interface ColorConfig {
  color: string;
  intensity: 'low' | 'medium' | 'high';
  opacity?: number;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// ============================================================================
// Utility Types
// ============================================================================

export type Optional<T> = T | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface AsyncState<T> {
  loading: boolean;
  error?: Error;
  data?: T;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl?: number;
}

// ============================================================================
// Home Assistant Integration Types
// ============================================================================

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>
  ) => Promise<unknown>;
  auth?: {
    accessToken: string;
    expires: number;
  };
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  lovelace?: {
    mode: 'yaml' | 'storage';
    resources: unknown[];
    dashboards: Record<string, unknown>;
  };
  setConfig(config: VioletPoolCardConfig): void;
}

// ============================================================================
// Validation & Guard Types
// ============================================================================

/**
 * Type guards for runtime type checking
 */

export function isHassEntity(obj: unknown): obj is HassEntity {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'entity_id' in obj &&
    'state' in obj &&
    'attributes' in obj
  );
}

export function isTemperatureEntity(obj: unknown): obj is TemperatureEntity {
  return (
    isHassEntity(obj) &&
    ('current_temperature' in obj.attributes ||
      'temperature' in obj.attributes)
  );
}

export function isLightEntity(obj: unknown): obj is LightEntity {
  return (
    isHassEntity(obj) &&
    obj.state in ['on', 'off'] &&
    ('brightness' in obj.attributes || 'rgb_color' in obj.attributes)
  );
}

export function isCoverEntity(obj: unknown): obj is CoverEntity {
  return (
    isHassEntity(obj) &&
    'current_position' in obj.attributes &&
    typeof obj.attributes.current_position === 'number'
  );
}

export function isValidCardType(value: unknown): value is CardType {
  const validTypes: CardType[] = [
    'pump',
    'heater',
    'solar',
    'dosing',
    'overview',
    'compact',
    'system',
    'details',
    'chemical',
    'sensor',
    'cover',
    'light',
    'filter',
  ];
  return typeof value === 'string' && validTypes.includes(value as CardType);
}

export function isValidTheme(value: unknown): value is Theme {
  const validThemes: Theme[] = [
    'classic',
    'midnight',
    'elegance',
    'vibrant',
    'pure',
    'frost',
    'glow',
    'metallic',
    'ocean',
    'sunset',
    'forest',
    'aurora',
  ];
  return typeof value === 'string' && validThemes.includes(value as Theme);
}
