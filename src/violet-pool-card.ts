import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';

// Import components
import './components/status-badge';
import './components/value-display';
import './components/detail-status';
import './components/warning-chips';
import './components/slider-control';
import './components/quick-actions';
import './components/duration-slider';
import './components/action-selector';
import './components/safety-toggle';
import './components/speed-slider';
import type { QuickAction } from './components/quick-actions';

// Import utilities
import { ServiceCaller } from './utils/service-caller';
import { EntityHelper } from './utils/entity-helper';
import { StateColorHelper } from './utils/state-color';
import { i18n } from './utils/i18n';
import { pumpSVG, heaterSVG, solarSVG, coverSVG, lightSVG, dosingDropletSVG, gaugeNeedleSVG, filterGaugeSVG, chartSVG, backwashSVG, refillSVG, solarSurplusSVG, flowRateSVG, inletSVG, counterCurrentSVG, chlorineCanisterSVG, phPlusCanisterSVG, phMinusCanisterSVG, flocculantCanisterSVG } from './utils/animated-icons';


// HomeAssistant types
interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
  context: { id: string; parent_id: unknown; user_id: unknown };
}

interface HomeAssistant {
  states: { [entity_id: string]: HassEntity };
  callService: (domain: string, service: string, serviceData?: Record<string, unknown>) => Promise<unknown>;
  locale?: { language: string };
  language?: string;
}

interface LovelaceCardConfig {
  type: string;
  entity?: string;
  entities?: string[];
  card_type: 'pump' | 'heater' | 'solar' | 'dosing' | 'overview' | 'details' | 'sensor' | 'cover' | 'light' | 'compact' | 'system' | 'chemical' | 'filter' | 'backwash' | 'refill' | 'solar_surplus' | 'flow_rate' | 'inlet' | 'counter_current' | 'chlorine_canister' | 'ph_plus_canister' | 'ph_minus_canister' | 'flocculant_canister';
  name?: string;
  icon?: string;

  // Chemistry card options
  chemistry_type?: 'chlorine' | 'salt' | 'bromine' | 'ozone';
  show_temperature?: boolean;
  show_ph?: boolean;
  show_orp?: boolean;
  show_chlorine?: boolean;
  show_salt?: boolean;
  show_inlet?: boolean;

  // PREMIUM DESIGN SYSTEM
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  theme?: 'classic' | 'midnight' | 'elegance' | 'vibrant' | 'pure' | 'frost' | 'glow' | 'metallic' | 'ocean' | 'sunset' | 'forest' | 'aurora';
  animation?: 'none' | 'subtle' | 'smooth' | 'energetic';

  // Legacy (backward compatible)
  style?: 'standard' | 'modern' | 'luxury';
  show_flow_animation?: boolean;

  // Display Options
  show_state?: boolean;
  show_detail_status?: boolean;
  show_controls?: boolean;
  show_runtime?: boolean;
  show_history?: boolean;
  dosing_type?: 'chlorine' | 'ph_minus' | 'ph_plus' | 'flocculant';

  // Customization
  accent_color?: string;
  icon_color?: string;
  gradient?: string;
  blur_intensity?: number;

  // Advanced customization
  custom_width?: number;
  custom_height?: number;
  custom_padding?: number;
  border_radius?: number;
  shadow_intensity?: 'none' | 'low' | 'medium' | 'high';

  // Actions
  tap_action?: Record<string, unknown>;
  hold_action?: Record<string, unknown>;
  double_tap_action?: Record<string, unknown>;
}

export interface VioletPoolCardConfig extends LovelaceCardConfig {
  // Dynamic entity naming - supports multiple controllers
  entity_prefix?: string;

  // Individual entity overrides
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

  // New entity types
  cover_entity?: string;
  light_entity?: string;
  filter_entity?: string;
  filter_pressure_entity?: string;
  backwash_entity?: string;
}

export class VioletPoolCard extends LitElement {
  @property({ attribute: false })
  public set hass(hass: HomeAssistant) {
    this._hass = hass;
    // Detect language: prefer locale.language, fallback to language property
    const langStr = hass.locale?.language || hass.language;
    if (langStr) {
      // Switch i18n to German if language starts with 'de', else fallback to English
      i18n.setLanguage(langStr.startsWith('de') ? 'de' : 'en');
    }
  }

  public get hass(): HomeAssistant {
    return this._hass;
  }

  private _hass!: HomeAssistant;
  @state() private config!: VioletPoolCardConfig;

  public setConfig(config: VioletPoolCardConfig): void {
    if (!config.card_type) {
      throw new Error('You need to define a card_type');
    }

    if (config.card_type !== 'overview' && config.card_type !== 'system' && config.card_type !== 'details' && config.card_type !== 'chemical' && config.card_type !== 'cover' && config.card_type !== 'light' && !config.entity) {
      throw new Error('You need to define an entity');
    }

    this.config = {
      show_state: true,
      show_detail_status: true,
      show_controls: true,
      show_runtime: false,
      show_history: false,
      size: 'medium',
      theme: 'classic',
      animation: 'smooth',
      blur_intensity: 10,
      style: 'standard',
      show_flow_animation: false,
      entity_prefix: 'violet_pool',
      ...config,
    };
  }

  private _buildEntityId(domain: string, suffix: string): string {
    const prefix = this.config.entity_prefix || 'violet_pool';
    return `${domain}.${prefix}_${suffix}`;
  }

  private _getEntityId(
    configKey: keyof VioletPoolCardConfig,
    domain: string,
    suffix: string,
    entitiesIndex?: number
  ): string {
    const configValue = this.config[configKey] as string | undefined;
    if (configValue) {
      return configValue;
    }
    if (entitiesIndex !== undefined && this.config.entities && this.config.entities[entitiesIndex]) {
      return this.config.entities[entitiesIndex];
    }
    return this._buildEntityId(domain, suffix);
  }

  /**
   * Returns human-readable state label
   */
  private _getFriendlyState(state: string, cardType?: string): string {
    const map: Record<string, string> = {
      'on': 'Active',
      'off': 'Off',
      'auto': 'Auto',
      'heat': 'Heating',
      'heating': 'Heating',
      'cool': 'Cooling',
      'cooling': 'Cooling',
      'idle': 'Idle',
      'unavailable': 'Unavailable',
      'unknown': 'Unknown',
      'manual': 'Manual',
    };
    if (cardType === 'pump' && state === 'on') return 'Running';
    return map[state] ?? state.charAt(0).toUpperCase() + state.slice(1);
  }

  /**
   * Returns percentage (0-100) of value within min-max range, clamped.
   */
  private _getValuePercent(value: number, min: number, max: number): number {
    if (max <= min) return 0;
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  }

  /**
   * Open more-info dialog for an entity
   */
  private _showMoreInfo(entityId: string): void {
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  /**
   * Convert HSV to RGB for color wheel
   */
  private _hsvToRgb(h: number, s: number, v: number): [number, number, number] {
    let r = 0, g = 0, b = 0;

    if (s === 0) {
      r = g = b = v; // achromatic (gray)
    } else {
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);

      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
      }
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  private _getRgbColorName(rgb: [number, number, number] | null): string {
    if (!rgb) return 'Keine Farbe';

    const [r, g, b] = rgb;

    // Check for near-white
    if (r > 200 && g > 200 && b > 200) return 'Weiß';

    // Check for near-black
    if (r < 50 && g < 50 && b < 50) return 'Schwarz';

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // Hue calculation
    let hue = 0;
    if (delta !== 0) {
      if (max === r) {
        hue = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
      } else if (max === g) {
        hue = ((b - r) / delta + 2) / 6;
      } else {
        hue = ((r - g) / delta + 4) / 6;
      }
    }

    // Saturation
    const saturation = max === 0 ? 0 : delta / max;

    // Determine color name based on hue
    if (saturation < 0.1) {
      return 'Grau';
    }

    if (hue < 0.05 || hue >= 0.95) return 'Rot';
    if (hue < 0.15) return 'Orange';
    if (hue < 0.25) return 'Gelb';
    if (hue < 0.4) return 'Grün';
    if (hue < 0.55) return 'Cyan';
    if (hue < 0.7) return 'Blau';
    if (hue < 0.85) return 'Magenta';
    return 'Rot';
  }

  protected render(): TemplateResult {
    if (!this.config || !this.hass) {
      return html``;
    }

    if (this.config.entity) {
      const entity = this.hass.states[this.config.entity];
      if (!entity) {
        return html` <ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Entity Not Found</span><span class="error-entity">${this.config.entity}</span></div></div></ha-card> `;
      }
    }

    switch (this.config.card_type) {
      case 'pump':
        return this.renderPumpCard();
      case 'heater':
        return this.renderHeaterCard();
      case 'solar':
        return this.renderSolarCard();
      case 'dosing':
        return this.renderDosingCard();
      case 'overview':
        return this.renderOverviewCard();
      case 'compact':
        return this.renderCompactCard();
      case 'system':
        return this.renderSystemCard();
      case 'details':
        return this.renderDetailsCard();
      case 'chemical':
        return this.renderChemicalCard();
      case 'sensor':
        return this.renderSensorCard();
      case 'cover':
        return this.renderCoverCard();
      case 'light':
        return this.renderLightCard();
      case 'filter':
        return this.renderFilterCard();
      case 'backwash':
        return this.renderBackwashCard();
      case 'refill':
        return this.renderRefillCard();
      case 'solar_surplus':
        return this.renderSolarSurplusCard();
      case 'flow_rate':
        return this.renderFlowRateCard();
      case 'inlet':
        return this.renderInletCard();
      case 'counter_current':
        return this.renderCounterCurrentCard();
      case 'chlorine_canister':
        return this.renderChlorineCanisterCard();
      case 'ph_plus_canister':
        return this.renderPhPlusCanisterCard();
      case 'ph_minus_canister':
        return this.renderPhMinusCanisterCard();
      case 'flocculant_canister':
        return this.renderFlocculantCanisterCard();
      case 'digital_rules':
        return this.renderDigitalRulesCard();
      case 'diagnostics':
        return this.renderDiagnosticsCard();
      default:
        return html` <ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Unknown Card Type</span><span class="error-entity">${this.config.card_type}</span></div></div></ha-card> `;
    }
  }

  private _getCardClasses(isActive: boolean, config: VioletPoolCardConfig): string {
    const classes = [];

    classes.push(`size-${config.size || 'medium'}`);

    if (config.theme) {
      classes.push(`theme-${config.theme}`);
    } else {
      classes.push(config.style || 'standard');
    }

    if (config.animation && config.animation !== 'none') {
      classes.push(`animation-${config.animation}`);
    }

    if ((config.show_flow_animation || config.animation === 'energetic') && isActive) {
      classes.push('flow-active');
    }

    if (isActive) {
      classes.push('is-active');
    }

    return classes.join(' ');
  }

  private _getCardStyles(config: VioletPoolCardConfig): string {
    const styles: string[] = [];

    if (config.custom_width) {
      styles.push(`width: ${config.custom_width}px;`);
    }

    if (config.custom_height) {
      styles.push(`height: ${config.custom_height}px;`);
    }

    if (config.custom_padding) {
      styles.push(`--vpc-spacing: ${config.custom_padding}px;`);
    }

    if (config.border_radius) {
      styles.push(`--vpc-radius: ${config.border_radius}px;`);
    }

    if (config.shadow_intensity) {
      const shadows = {
        none: 'none',
        low: '0 2px 8px rgba(0,0,0,0.06)',
        medium: '0 4px 20px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.05)',
        high: '0 8px 30px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
      };
      styles.push(`--vpc-shadow: ${shadows[config.shadow_intensity]};`);
    }

    return styles.join(' ');
  }

  /**
   * Render loading skeleton for entity while data loads
   */
  private _renderLoadingSkeleton(config: VioletPoolCardConfig): TemplateResult {
    return html`
      <ha-card class="${this._getCardClasses(false, config)}" style="${this._getCardStyles(config)}">
        <div class="accent-bar" style="opacity: 0.3;"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon" style="background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%); background-size: 1000px 100%; animation: skeleton-loading 2s infinite;"></div>
            <div class="header-info">
              <div style="width: 120px; height: 18px; background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%); background-size: 1000px 100%; animation: skeleton-loading 2s infinite; border-radius: 4px; margin-bottom: 8px;"></div>
              <div style="width: 80px; height: 14px; background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%); background-size: 1000px 100%; animation: skeleton-loading 2s infinite; border-radius: 4px;"></div>
            </div>
          </div>
          <div style="margin-top: 12px; height: 48px; background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%); background-size: 1000px 100%; animation: skeleton-loading 2s infinite; border-radius: 8px;"></div>
          <div style="margin-top: 12px; height: 44px; background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%); background-size: 1000px 100%; animation: skeleton-loading 2s infinite; border-radius: 8px;"></div>
        </div>
      </ha-card>
    `;
  }

  /**
   * Render Quick-Settings Panel with common pool actions
   */
  private _renderQuickSettingsPanel(): TemplateResult {
    const heaterEntityId = this._getEntityId('heater_entity', 'climate', 'heater', 1);

    return html`
      <div style="display: grid; gap: 8px; padding: 12px; background: var(--vpc-surface); border-radius: 12px; margin-top: 12px;">
        <!-- Heater Control -->
        <button style="padding: 10px; border: 1px solid var(--vpc-warning); border-radius: 8px; background: transparent; color: var(--vpc-warning); font-weight: 600; cursor: pointer; font-size: 12px;"
                @click="${(e: Event) => { e.stopPropagation(); this.hass.callService('climate', 'set_temperature', { entity_id: heaterEntityId, temperature: 26 }); }}">
          🔥 ${i18n.t('heater_plus_two')}
        </button>
      </div>
    `;
  }

  /**
   * Get accent color for card type
   */
  private _getAccentColor(cardType: string, config: VioletPoolCardConfig): string {
    if (config.accent_color) return config.accent_color;
    switch (cardType) {
      case 'pump': return '#2196F3';
      case 'heater': return '#FF5722';
      case 'solar': return '#FF9800';
      case 'dosing': return '#4CAF50';
      case 'overview': return '#7C4DFF';
      case 'cover': return '#5AC8FA';
      case 'light': return '#AF52DE';
      case 'filter': return '#FF9500';
      case 'backwash': return '#00BCD4';
      case 'refill': return '#00BCD4';
      case 'solar_surplus': return '#FFB300';
      case 'flow_rate': return '#2196F3';
      case 'inlet': return '#00BCD4';
      case 'counter_current': return '#9C27B0';
      case 'chlorine_canister': return '#4CAF50';
      case 'ph_plus_canister': return '#2196F3';
      case 'ph_minus_canister': return '#FF9800';
      case 'flocculant_canister': return '#9C27B0';
      case 'digital_rules': return '#00BCD4';
      case 'diagnostics': return '#9C27B0';
      default: return '#2196F3';
    }
  }

  private renderSystemCard(): TemplateResult {
    const pumpEntity = this._getEntityId('pump_entity', 'switch', 'pump', 0);
    const heaterEntity = this._getEntityId('heater_entity', 'climate', 'heater', 1);
    const solarEntity = this._getEntityId('solar_entity', 'climate', 'solar', 2);
    const dosingEntity = this._getEntityId('chlorine_entity', 'switch', 'dos_1_cl', 3);

    const createSubConfig = (type: string, entity: string, extra: any = {}): VioletPoolCardConfig | null => {
      if (type !== 'overview' && !this.hass.states[entity]) return null;
      return {
        ...this.config,
        card_type: type as any,
        entity: entity,
        // Ensure entity_prefix is always propagated to sub-cards (bug fix)
        entity_prefix: this.config.entity_prefix || 'violet_pool',
        ...extra
      };
    };

    const coverEntitySys = this._getEntityId('cover_entity', 'cover', 'cover');
    const lightEntitySys = this._getEntityId('light_entity', 'light', 'light');
    const filterEntitySys = this._getEntityId('filter_entity' as any, 'sensor', 'filter_pressure');

    const overviewConfig = createSubConfig('overview', '', { name: 'Pool Overview' });
    const pumpConfig = createSubConfig('pump', pumpEntity, { show_runtime: true });
    const heaterConfig = createSubConfig('heater', heaterEntity);
    const solarConfig = createSubConfig('solar', solarEntity);
    const dosingConfig = createSubConfig('dosing', dosingEntity, { dosing_type: 'chlorine' });
    const coverConfig = createSubConfig('cover', coverEntitySys);
    const lightConfig = createSubConfig('light', lightEntitySys);
    const filterConfig = createSubConfig('filter' as any, filterEntitySys);

    return html` <div class="system-grid"> ${overviewConfig ? this.renderOverviewCard(overviewConfig) : ''} ${pumpConfig ? this.renderPumpCard(pumpConfig) : ''} ${heaterConfig ? this.renderHeaterCard(heaterConfig) : ''} ${solarConfig ? this.renderSolarCard(solarConfig) : ''} ${dosingConfig ? this.renderDosingCard(dosingConfig) : ''} ${coverConfig ? this.renderCoverCard(coverConfig) : ''} ${lightConfig ? this.renderLightCard(lightConfig) : ''} ${filterConfig ? this.renderFilterCard(filterConfig) : ''} </div> `;
  }

  private renderPumpCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entity = this.hass.states[config.entity!];
    if (!entity) return this._renderLoadingSkeleton(config);
    const state = entity.state;
    const name = config.name || entity.attributes.friendly_name || 'Pump';
    const pumpState = (entity.attributes?.PUMPSTATE as string) || '';
    const accentColor = this._getAccentColor('pump', config);

    const parsedState = EntityHelper.parsePumpState(pumpState);
    const currentSpeed = parsedState.level !== undefined ? parsedState.level : 0;
    const currentMode = parsedState.mode || 'manual';

    const rpmLevel0 = Number(entity.attributes?.PUMP_RPM_0) || 0;
    const rpmLevel1 = Number(entity.attributes?.PUMP_RPM_1) || 0;
    const rpmLevel2 = Number(entity.attributes?.PUMP_RPM_2) || 0;
    const rpmLevel3 = Number(entity.attributes?.PUMP_RPM_3) || 0;
    const rpmValues = [rpmLevel0, rpmLevel1, rpmLevel2, rpmLevel3];
    const currentRPM = rpmValues[currentSpeed] || 0;

    const runtimeSeconds = Number(entity.attributes?.runtime) || 0;
    const runtimeHours = Math.floor(runtimeSeconds / 3600);
    const runtimeMinutes = Math.floor((runtimeSeconds % 3600) / 60);
    const runtimeDisplay = runtimeHours > 0
      ? `${runtimeHours}h ${runtimeMinutes}min`
      : `${runtimeMinutes}min`;

    const speedColor = StateColorHelper.getPumpSpeedColor(currentSpeed);
    const isRunning = state === 'on' || currentSpeed > 0;
    const speedLabels = ['OFF', 'ECO', 'Normal', 'Boost'];
    const speedColors = ['#8E8E93', '#34C759', '#FF9F0A', '#FF3B30'];
    const speedIcons = ['mdi:power-off', 'mdi:speedometer-slow', 'mdi:speedometer-medium', 'mdi:speedometer'];

    // Mode Quick Actions (OFF/AUTO/MANUAL)
    const modeActions: QuickAction[] = [
      {
        icon: 'mdi:power-off',
        label: 'OFF',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.forcePumpOff(config.entity!);
        },
        active: currentMode === 'off' || !isRunning,
        color: '#757575',
      },
      {
        icon: 'mdi:leaf',
        label: 'ECO',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.setPumpEcoMode(config.entity!);
        },
        active: false,
        color: '#34C759',
      },
      {
        icon: 'mdi:flash',
        label: 'BOOST',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.setPumpBoostMode(config.entity!);
        },
        active: false,
        color: '#FF3B30',
      },
      {
        icon: 'mdi:autorenew',
        label: 'AUTO',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.setPumpAuto(config.entity!);
        },
        active: currentMode === 'auto',
        color: '#2196F3',
      },
    ];

    // Timer Quick Actions (30min, 1h, 2h, 4h)
    const timerActions: QuickAction[] = [
      {
        icon: 'mdi:timer-outline',
        label: '30m',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.controlPump(config.entity!, 'speed_control', currentSpeed > 0 ? currentSpeed : 2, 30 * 60);
        },
        active: false,
        color: '#4CAF50',
      },
      {
        icon: 'mdi:timer',
        label: '1h',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.controlPump(config.entity!, 'speed_control', currentSpeed > 0 ? currentSpeed : 2, 60 * 60);
        },
        active: false,
        color: '#4CAF50',
      },
      {
        icon: 'mdi:timer-sand',
        label: '2h',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.controlPump(config.entity!, 'speed_control', currentSpeed > 0 ? currentSpeed : 2, 2 * 60 * 60);
        },
        active: false,
        color: '#4CAF50',
      },
      {
        icon: 'mdi:timer-sand-full',
        label: '4h',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.controlPump(config.entity!, 'speed_control', currentSpeed > 0 ? currentSpeed : 2, 4 * 60 * 60);
        },
        active: false,
        color: '#4CAF50',
      },
    ];

    return html` <ha-card class="${this._getCardClasses(isRunning, config)}" style="--card-accent: ${accentColor}" @click="${() => this._showMoreInfo(config.entity!)}" ><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon ${isRunning ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">${config.icon ? html`<ha-icon icon="${config.icon}" class="${isRunning ? 'pump-running' : ''}"></ha-icon>` : pumpSVG(currentSpeed, accentColor)}</div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle" style="${isRunning ? `color: ${speedColor.color}` : ''}">
                ${isRunning
                  ? `${speedLabels[currentSpeed]}${currentRPM > 0 ? ` \u00B7 ${currentRPM} RPM` : ''}`
                  : this._getFriendlyState(state, 'pump')}
              </span>
            </div>
            ${config.show_state
              ? html`<vpc-status-badge .state="${state}" .pulse="${isRunning}"></vpc-status-badge>`
              : ''}
          </div>

          <!-- Speed Segments Visual Indicator -->
          <div class="speed-segments-container">
            <div class="speed-segments">
              ${[1, 2, 3].map(level => {
                const speedHelp = [
                  '',
                  'ECO-Modus – Langsame Filtration, sehr energieeffizient. Ideal für Nacht-Grundzirkulation.',
                  'Normal-Modus – Standard-Filtration für den täglichen Betrieb.',
                  'Boost-Modus – Maximale Leistung. Für Rückspülung, Staubsaugen oder schnelles Chemikalien-Mischen.'
                ];
                return html` <button class="speed-segment tooltip-wrap ${currentSpeed === level ? 'seg-active' : currentSpeed > level ? 'seg-past' : ''}" style="--seg-color: ${speedColors[level]}" @click="${(e: Event) => { e.stopPropagation(); const sc = new ServiceCaller(this.hass); sc.setPumpSpeed(config.entity!, level); }}" ><ha-icon icon="${speedIcons[level]}" style="--mdc-icon-size: 14px"></ha-icon><span>${speedLabels[level]}</span>
                  <div class="t-tip t-up">
                    <div class="t-tip-title">${speedLabels[level]}-Geschwindigkeit</div>
                    <div class="t-tip-desc">${speedHelp[level]}</div>
                  </div>
                </button> `;
              })}
            </div>
            <button
              class="speed-off-btn tooltip-wrap ${currentSpeed === 0 ? 'seg-active' : ''}"
              style="--seg-color: ${speedColors[0]}"
              @click="${(e: Event) => { e.stopPropagation(); const sc = new ServiceCaller(this.hass); sc.turnOff(config.entity!); }}"
            >
              <ha-icon icon="mdi:power" style="--mdc-icon-size: 16px"></ha-icon>
              <div class="t-tip t-up">
                <div class="t-tip-title">Pumpe AUS</div>
                <div class="t-tip-desc">Pumpe vollständig ausschalten. Die Filtration wird gestoppt.</div>
              </div>
            </button>
          </div>

          <!-- Mode Control (OFF/AUTO/MANUAL) -->
          ${config.show_controls
            ? html`<vpc-quick-actions .actions="${modeActions}"></vpc-quick-actions>`
            : ''}

          <!-- Timer Control (30min, 1h, 2h, 4h) -->
          ${config.show_controls
            ? html`
              <div style="display: flex; gap: 8px; margin-top: 12px;">
                <div style="flex: 1; font-size: 11px; font-weight: 600; color: var(--vpc-text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">
                  Timer
                </div>
              </div>
              <vpc-quick-actions .actions="${timerActions}"></vpc-quick-actions>
            `
            : ''}

          ${config.show_detail_status && pumpState
            ? html`<vpc-detail-status .raw="${pumpState}"></vpc-detail-status>`
            : ''}


          ${config.show_runtime && runtimeSeconds > 0
            ? html` <div class="info-row"><ha-icon icon="mdi:timer-outline"></ha-icon><span class="info-label">Runtime</span><span class="info-value">${runtimeDisplay}</span></div> `
            : ''}
        </div>
      </ha-card>
    `;
  }


  private renderHeaterCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entity = this.hass.states[config.entity!];
    if (!entity) return this._renderLoadingSkeleton(config);
    const state = entity.state;
    const name = config.name || entity.attributes.friendly_name || 'Heater';
    const accentColor = this._getAccentColor('heater', config);

    const currentTemp = EntityHelper.getCurrentTemperature(entity);
    const targetTemp = EntityHelper.getTargetTemperature(entity);
    const minTemp = EntityHelper.getMinTemperature(entity) || 18;
    const maxTemp = EntityHelper.getMaxTemperature(entity) || 35;

    const heaterState = (entity.attributes?.HEATERSTATE as string) || '';

    const outsideTemp = entity.attributes?.outside_temperature as number | null | undefined;
    const minOutsideTemp = (entity.attributes?.min_outside_temperature as number) || 14.5;

    const isBlockedByOutsideTemp =
      (heaterState as string).includes('BLOCKED_BY_OUTSIDE_TEMP') ||
      (outsideTemp != null && outsideTemp < minOutsideTemp);

    const tempColor = currentTemp !== undefined
      ? StateColorHelper.getTemperatureColor(currentTemp)
      : undefined;

    const quickActions: QuickAction[] = [
      {
        icon: 'mdi:power-off',
        label: 'OFF',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.setHvacMode(config.entity!, 'off');
        },
        active: state === 'off',
        color: '#757575',
        confirmMessage: undefined,
      },
      {
        icon: 'mdi:autorenew',
        label: 'AUTO',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.setHvacMode(config.entity!, 'auto');
        },
        active: state === 'auto',
        color: '#2196F3',
      },
      {
        icon: 'mdi:fire',
        label: 'HEAT',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.setHvacMode(config.entity!, 'heat');
        },
        active: state === 'heat' || state === 'heating',
        color: '#FF5722',
      },
    ];

    const isHeating = state === 'heating' || state === 'heat';
    const tempPct = currentTemp !== undefined
      ? this._getValuePercent(currentTemp, minTemp, maxTemp)
      : undefined;
    const targetPct = targetTemp !== undefined
      ? this._getValuePercent(targetTemp, minTemp, maxTemp)
      : undefined;

    return html` <ha-card class="${this._getCardClasses(isHeating, config)}" style="--card-accent: ${accentColor}" @click="${() => this._showMoreInfo(config.entity!)}" ><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon ${isHeating ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">${config.icon ? html`<ha-icon icon="${config.icon}" class="${isHeating ? 'heater-active' : ''}"></ha-icon>` : heaterSVG(isHeating, accentColor)}</div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle">${this._getFriendlyState(state)}</span></div> ${config.show_state ? html`<vpc-status-badge .state="${state}"></vpc-status-badge>`
              : ''}
          </div>

          ${currentTemp !== undefined
            ? html` <div class="temp-hero tooltip-wrap" style="--temp-color: ${tempColor?.color || 'var(--vpc-primary)'}; position: relative;"><div class="temp-hero-main"><span class="temp-hero-value">${currentTemp.toFixed(1)}</span><span class="temp-hero-unit">°C</span></div> ${targetTemp !== undefined ? html`
                        <div class="temp-hero-target-pill">
                          <ha-icon icon="mdi:target" style="--mdc-icon-size: 13px"></ha-icon>
                          <span>${targetTemp.toFixed(1)}°C</span>
                        </div>
                      `
                    : ''}
                <div class="t-tip">
                  <div class="t-tip-title"><ha-icon icon="mdi:thermometer-water"></ha-icon>Wassertemperatur</div>
                  <div class="t-tip-desc">Aktuelle Pooltemperatur${targetTemp !== undefined ? `. Ziel: ${targetTemp.toFixed(1)}°C` : ''}. ${currentTemp < 24 ? 'Noch kalt zum Schwimmen.' : currentTemp <= 30 ? 'Ideale Badetemperatur.' : 'Etwas warm – Heizung prüfen.'}</div>
                  <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>24°C – 30°C Komfort</div>
                </div>
                </div>
                ${tempPct !== undefined
                  ? html` <div class="temp-range-bar"><div class="temp-range-track"><div class="temp-range-fill" style="width: ${tempPct}%; background: ${tempColor?.color || accentColor}"></div> ${targetPct !== undefined ? html`<div class="temp-range-target" style="left: ${targetPct}%"></div>`
                            : ''}
                        </div>
                        <div class="temp-range-labels">
                          <span>${minTemp}°C</span>
                          <span>${maxTemp}°C</span>
                        </div>
                      </div>
                    `
                  : ''}
              `
            : ''}

          ${config.show_detail_status && heaterState
            ? html`<vpc-detail-status .raw="${heaterState}"></vpc-detail-status>`
            : ''}

          ${outsideTemp != null
            ? html` <div class="info-row tooltip-wrap ${isBlockedByOutsideTemp ? 'info-row-warning' : ''}" style="position:relative"><ha-icon icon="mdi:thermometer"></ha-icon><span class="info-label">Außentemperatur</span><span class="info-value">${outsideTemp.toFixed(1)}°C</span> ${isBlockedByOutsideTemp ? html`<span class="info-badge warning">Min ${minOutsideTemp}°C</span>`
                    : ''}
                <div class="t-tip">
                  <div class="t-tip-title"><ha-icon icon="mdi:thermometer-alert"></ha-icon>Außentemperatur</div>
                  <div class="t-tip-desc">${isBlockedByOutsideTemp ? `Heizung gesperrt! Außentemperatur (${outsideTemp.toFixed(1)}°C) liegt unter dem Minimum von ${minOutsideTemp}°C. Frostschutz aktiv.` : `Aktuelle Außentemperatur. Heizung wird bei unter ${minOutsideTemp}°C Außentemperatur gesperrt (Frostschutz).`}</div>
                  ${isBlockedByOutsideTemp ? html`<div class="t-tip-warn"><ha-icon icon="mdi:snowflake-alert"></ha-icon>Heizung gesperrt</div>` : ''}
                </div>
                </div>
              `
            : ''}

          ${config.show_controls
            ? html` ${targetTemp !== undefined ? html`
                      <vpc-slider-control
                        label="Target Temperature"
                        .min="${minTemp}"
                        .max="${maxTemp}"
                        step="0.5"
                        .value="${targetTemp}"
                        unit="°C"
                        showMinMax
                        @value-changed="${(e: CustomEvent) => this._handleTemperatureChange(e, config.entity!)}"
                      ></vpc-slider-control>
                    `
                  : ''}
                <vpc-quick-actions .actions="${quickActions}"></vpc-quick-actions>
              `
            : ''}
        </div>
      </ha-card>
    `;
  }

  private async _handleTemperatureChange(e: CustomEvent, entityId: string) {
    const temperature = e.detail.value;
    const serviceCaller = new ServiceCaller(this.hass);
    await serviceCaller.setTemperature(entityId, temperature);
  }

  private renderSolarCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entity = this.hass.states[config.entity!];
    if (!entity) return this._renderLoadingSkeleton(config);
    const state = entity.state;
    const name = config.name || entity.attributes.friendly_name || 'Solar';
    const accentColor = this._getAccentColor('solar', config);

    const poolTemp = EntityHelper.getCurrentTemperature(entity);
    const targetTemp = EntityHelper.getTargetTemperature(entity);
    const minTemp = EntityHelper.getMinTemperature(entity) || 18;
    const maxTemp = EntityHelper.getMaxTemperature(entity) || 32;

    const absorberTemp = entity.attributes?.absorber_temperature as number | null | undefined;

    const tempDelta = absorberTemp != null && poolTemp !== undefined
      ? absorberTemp - poolTemp
      : undefined;

    const solarState = entity.attributes?.SOLARSTATE || '';

    const quickActions: QuickAction[] = [
      {
        icon: 'mdi:power-off',
        label: 'OFF',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.setHvacMode(config.entity!, 'off');
        },
        active: state === 'off',
        color: '#757575',
      },
      {
        icon: 'mdi:autorenew',
        label: 'AUTO',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.setHvacMode(config.entity!, 'auto');
        },
        active: state === 'auto',
        color: '#2196F3',
      },
      {
        icon: 'mdi:sun-thermometer',
        label: 'HEAT',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.setHvacMode(config.entity!, 'heat');
        },
        active: state === 'heat' || state === 'heating',
        color: '#FF9800',
      },
      {
        icon: 'mdi:lightning-bolt',
        label: 'PV BOOST',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.managePvSurplus('activate', 2);
        },
        active: false,
        color: '#FFD700',
        confirmMessage: 'Activate PV surplus heating with pump speed 2?',
      },
    ];

    const isSolarActive = state === 'heating' || state === 'heat';
    const poolTempPct = poolTemp !== undefined
      ? this._getValuePercent(poolTemp, minTemp, maxTemp)
      : undefined;
    const targetTempPct = targetTemp !== undefined
      ? this._getValuePercent(targetTemp, minTemp, maxTemp)
      : undefined;

    return html` <ha-card class="${this._getCardClasses(isSolarActive, config)}" style="--card-accent: ${accentColor}" @click="${() => this._showMoreInfo(config.entity!)}" ><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon ${isSolarActive ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">${config.icon ? html`<ha-icon icon="${config.icon}" class="${isSolarActive ? 'solar-active' : ''}"></ha-icon>` : solarSVG(isSolarActive, accentColor)}</div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle">${this._getFriendlyState(state)}</span></div> ${config.show_state ? html`<vpc-status-badge .state="${state}"></vpc-status-badge>`
              : ''}
          </div>

          ${config.show_detail_status && solarState
            ? html`<vpc-detail-status .raw="${solarState}"></vpc-detail-status>`
            : ''}

          <div class="solar-temps">
            <!-- Solar temperature comparison: pool vs absorber -->
            <div class="solar-temp-comparison">
              ${poolTemp !== undefined
                ? html` <div class="solar-temp-tile"><ha-icon icon="mdi:pool" style="--mdc-icon-size: 18px"></ha-icon><div class="solar-temp-tile-val">${poolTemp.toFixed(1)}°C</div><div class="solar-temp-tile-label">Pool</div></div> `
                : ''}
              ${tempDelta !== undefined
                ? html` <div class="solar-delta-badge tooltip-wrap ${tempDelta >= 3 ? 'delta-great' : tempDelta > 0 ? 'delta-ok' : 'delta-low'}" style="position:relative"><ha-icon icon="${tempDelta >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'}" style="--mdc-icon-size: 16px"></ha-icon><span>${tempDelta > 0 ? '+' : ''}${tempDelta.toFixed(1)}°C</span>
                  <div class="t-tip">
                    <div class="t-tip-title"><ha-icon icon="mdi:delta"></ha-icon>Temperaturdifferenz</div>
                    <div class="t-tip-desc">Differenz zwischen Absorber (Kollektor) und Pool. ${tempDelta >= 3 ? 'Sehr gute Solarbedingungen! Heizung wird aktiv.' : tempDelta > 0 ? 'Solarbeheizung möglich, aber noch schwach.' : 'Absorber kälter als Pool – keine Solarheizung möglich.'}</div>
                    <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>&gt; 3°C für aktive Solarheizung</div>
                  </div>
                </div> `
                : ''}
              ${absorberTemp != null
                ? html` <div class="solar-temp-tile"><ha-icon icon="mdi:solar-panel" style="--mdc-icon-size: 18px"></ha-icon><div class="solar-temp-tile-val">${absorberTemp.toFixed(1)}°C</div><div class="solar-temp-tile-label">Absorber</div></div> `
                : ''}
            </div>
            ${poolTempPct !== undefined
              ? html` <div class="temp-range-bar"><div class="temp-range-track"><div class="temp-range-fill" style="width: ${poolTempPct}%; background: ${accentColor}"></div> ${targetTempPct !== undefined ? html`<div class="temp-range-target" style="left: ${targetTempPct}%"></div>`
                        : ''}
                    </div>
                    <div class="temp-range-labels">
                      <span>${minTemp}°C</span>
                      <span>${maxTemp}°C</span>
                    </div>
                  </div>
                `
              : ''}
            ${tempDelta !== undefined
              ? html` <div class="delta-hint-text"> ${tempDelta < 0 ? '❄ Too cold for solar heating' : tempDelta < 3 ? '⚡ Solar heating possible' : '☀ Ideal conditions for solar heating'} </div> `
              : ''}
          </div>

          ${config.show_controls
            ? html` ${targetTemp !== undefined ? html`
                      <vpc-slider-control
                        label="Target Temperature"
                        .min="${minTemp}"
                        .max="${maxTemp}"
                        step="0.5"
                        .value="${targetTemp}"
                        unit="°C"
                        showMinMax
                        @value-changed="${(e: CustomEvent) => this._handleTemperatureChange(e, config.entity!)}"
                      ></vpc-slider-control>
                    `
                  : ''}
                <vpc-quick-actions .actions="${quickActions}"></vpc-quick-actions>
              `
            : ''}
        </div>
      </ha-card>
    `;
  }

  private renderDosingCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entity = this.hass.states[config.entity!];
    if (!entity) return this._renderLoadingSkeleton(config);
    const state = entity.state;
    const name = config.name || entity.attributes.friendly_name || 'Dosing';
    const accentColor = this._getAccentColor('dosing', config);

    const dosingType = config.dosing_type || this._detectDosingType(config.entity!);

    const dosingStateKey = Object.keys(entity.attributes || {}).find(
      (key) => key.includes('DOS_') && key.includes('_STATE')
    );
    const dosingState = dosingStateKey ? entity.attributes[dosingStateKey] : [];

    let currentValue: number | undefined;
    let targetValue: number | undefined;
    let minValue: number | undefined;
    let maxValue: number | undefined;
    let unit = '';

    if (dosingType === 'chlorine') {
      const orpSensorId = this._getEntityId('orp_value_entity', 'sensor', 'orp_value');
      const orpSensor = this.hass.states[orpSensorId];
      currentValue = orpSensor ? parseFloat(orpSensor.state) : undefined;
      const targetOrpId = this._getEntityId('target_orp_entity', 'number', 'target_orp');
      const targetEntity = this.hass.states[targetOrpId];
      targetValue = targetEntity ? parseFloat(targetEntity.state) : undefined;
      minValue = Number(targetEntity?.attributes?.min) || 600;
      maxValue = Number(targetEntity?.attributes?.max) || 800;
      unit = 'mV';
    } else if (dosingType === 'ph_minus' || dosingType === 'ph_plus') {
      const phSensorId = this._getEntityId('ph_value_entity', 'sensor', 'ph_value');
      const phSensor = this.hass.states[phSensorId];
      currentValue = phSensor ? parseFloat(phSensor.state) : undefined;
      const targetPhId = this._getEntityId('target_ph_entity', 'number', 'target_ph');
      const targetEntity = this.hass.states[targetPhId];
      targetValue = targetEntity ? parseFloat(targetEntity.state) : undefined;
      minValue = Number(targetEntity?.attributes?.min) || 6.8;
      maxValue = Number(targetEntity?.attributes?.max) || 7.8;
      unit = '';
    }

    const dosingVolume24h = entity.attributes?.dosing_volume_24h;

    const quickActions: QuickAction[] = [
      {
        icon: 'mdi:power-off',
        label: 'OFF',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.turnOff(config.entity!);
        },
        active: state === 'off',
        color: '#757575',
      },
      {
        icon: 'mdi:autorenew',
        label: 'AUTO',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.turnOn(config.entity!);
        },
        active: state === 'on' || state === 'auto',
        color: '#2196F3',
      },
      {
        icon: 'mdi:play-circle',
        label: 'Dose 30s',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.manualDosing(config.entity!, 30);
        },
        color: '#4CAF50',
        confirmMessage: 'Start manual dosing for 30 seconds?',
      },
      {
        icon: 'mdi:play-speed',
        label: 'Dose 60s',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.manualDosing(config.entity!, 60);
        },
        color: '#FF9800',
        confirmMessage: 'Start manual dosing for 60 seconds?',
      },
      {
        icon: 'mdi:stop-circle',
        label: 'STOP',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          const dosType = dosingType === 'chlorine' ? 'Chlor' : dosingType === 'ph_minus' ? 'pH-' : dosingType === 'ph_plus' ? 'pH+' : 'Flockmittel';
          await serviceCaller.stopDosing(dosType as any);
        },
        color: '#FF3B30',
        confirmMessage: 'Stop current dosing?',
      },
    ];

    // Safely check dosingState is an array before calling .some()
    const isDosing = state === 'on' && Array.isArray(dosingState) && dosingState.some((s: string) => s.includes('ACTIVE'));

    // Get color and percent for current value
    const valueColor = currentValue !== undefined
      ? dosingType === 'chlorine'
        ? StateColorHelper.getOrpColor(currentValue, targetValue)
        : StateColorHelper.getPhColor(currentValue, targetValue)
      : undefined;

    const valuePct = currentValue !== undefined && minValue !== undefined && maxValue !== undefined
      ? this._getValuePercent(currentValue, minValue, maxValue)
      : undefined;
    const targetPct = targetValue !== undefined && minValue !== undefined && maxValue !== undefined
      ? this._getValuePercent(targetValue, minValue, maxValue)
      : undefined;

    const decimals = dosingType === 'chlorine' ? 0 : 1;
    const dosingLabel = dosingType === 'chlorine' ? 'ORP' : dosingType === 'ph_minus' ? 'pH' : dosingType === 'ph_plus' ? 'pH' : 'Floc';
    const valueStatusLabel = valueColor
      ? (dosingType === 'chlorine'
          ? (currentValue! < (targetValue ?? 650) ? 'Low' : currentValue! > (targetValue ?? 750) ? 'High' : 'Optimal')
          : (currentValue! < 7.0 ? 'Acidic' : currentValue! > 7.4 ? 'Alkaline' : 'Optimal'))
      : '';

    return html` <ha-card class="${this._getCardClasses(isDosing, config)}" style="--card-accent: ${accentColor}" @click="${() => this._showMoreInfo(config.entity!)}" ><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon ${isDosing ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">${isDosing ? dosingDropletSVG(isDosing, currentValue ? (currentValue / (maxValue || 100)) * 100 : 50, accentColor) : html`<ha-icon icon="${config.icon || this._getDosingIcon(dosingType)}" class="${isDosing ? 'dosing-active' : ''}" ></ha-icon>`}</div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle">${this._getFriendlyState(state)}</span></div> ${config.show_state ? html`<vpc-status-badge .state="${state}" .pulse="${isDosing}"></vpc-status-badge>`
              : ''}
          </div>

          ${currentValue !== undefined
            ? html` <!-- Dosing value hero with progress bar --><div class="dosing-value-block tooltip-wrap" style="position:relative"><div class="dosing-value-row"><div class="dosing-value-main" style="color: ${valueColor?.color || 'var(--vpc-text)'}"><span class="dosing-label-tag">${dosingLabel}</span><span class="dosing-current-value">${currentValue.toFixed(decimals)}</span><span class="dosing-current-unit">${unit}</span></div><div class="dosing-status-pill" style="background: ${valueColor?.color ? valueColor.color + '18' : 'rgba(0,0,0,0.05)'}; color: ${valueColor?.color || 'var(--vpc-text-secondary)'}"> ${valueStatusLabel} </div></div>
              <div class="t-tip t-up">
                <div class="t-tip-title"><ha-icon icon="${this._getDosingIcon(dosingType)}"></ha-icon>${dosingType === 'chlorine' ? 'ORP – Chlorwirksamkeit' : 'pH-Wert'}</div>
                <div class="t-tip-desc">${dosingType === 'chlorine' ? `Redoxpotential (ORP) zeigt, wie wirksam das Chlor Keime abtötet. Aktuell: ${currentValue.toFixed(0)} mV${targetValue !== undefined ? `, Ziel: ${targetValue.toFixed(0)} mV` : ''}.` : `pH-Wert des Poolwassers. Aktuell: ${currentValue.toFixed(1)}${targetValue !== undefined ? `, Ziel: ${targetValue.toFixed(1)}` : ''}.`}</div>
                <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>${dosingType === 'chlorine' ? '650 – 750 mV Optimal' : '7.0 – 7.4 Optimal'}</div>
              </div> ${valuePct !== undefined ? html`
                        <div class="chem-range-bar">
                          <div class="chem-range-track">
                            <div class="chem-range-fill" style="width: ${valuePct}%; background: ${valueColor?.color || accentColor}"></div>
                            ${targetPct !== undefined
                              ? html` <div class="chem-range-target" style="left: ${targetPct}%"><div class="chem-target-line"></div><div class="chem-target-label">${targetValue!.toFixed(decimals)}${unit}</div></div> `
                              : ''}
                          </div>
                          <div class="chem-range-labels">
                            <span>${minValue!.toFixed(decimals)}${unit}</span>
                            <span>${maxValue!.toFixed(decimals)}${unit}</span>
                          </div>
                        </div>
                      `
                    : ''}
                </div>
              `
            : ''}

          ${config.show_detail_status && Array.isArray(dosingState) && dosingState.length > 0
            ? html`<vpc-warning-chips .warnings="${dosingState}" defaultType="warning"></vpc-warning-chips>`
            : ''}

          ${config.show_controls
            ? html`
              <!-- Enhanced Dosing Controls -->
              <div style="background: var(--vpc-surface); border-radius: 10px; padding: 12px; margin-bottom: 12px;">
                <div style="font-size: 11px; font-weight: 600; color: var(--vpc-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
                  Manual Dosing Control
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                  <button style="padding: 8px; border: none; border-radius: 6px; background: ${accentColor}; color: white; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
                          @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).manualDose(dosingType === 'chlorine' ? 'Chlor' : dosingType === 'ph_minus' ? 'pH-' : dosingType === 'ph_plus' ? 'pH+' : 'Flockmittel' as any, 30, false); }}">
                    <ha-icon icon="mdi:play" style="--mdc-icon-size: 14px;"></ha-icon> 30s
                  </button>
                  <button style="padding: 8px; border: none; border-radius: 6px; background: ${accentColor}; color: white; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
                          @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).manualDose(dosingType === 'chlorine' ? 'Chlor' : dosingType === 'ph_minus' ? 'pH-' : dosingType === 'ph_plus' ? 'pH+' : 'Flockmittel' as any, 60, false); }}">
                    <ha-icon icon="mdi:play" style="--mdc-icon-size: 14px;"></ha-icon> 60s
                  </button>
                  <button style="padding: 8px; border: none; border-radius: 6px; background: #34C759; color: white; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
                          @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).autoDose(dosingType === 'chlorine' ? 'Chlor' : dosingType === 'ph_minus' ? 'pH-' : dosingType === 'ph_plus' ? 'pH+' : 'Flockmittel' as any); }}">
                    <ha-icon icon="mdi:auto-fix" style="--mdc-icon-size: 14px;"></ha-icon> Auto
                  </button>
                  <button style="padding: 8px; border: none; border-radius: 6px; background: #FF3B30; color: white; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
                          @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).stopDosing(dosingType === 'chlorine' ? 'Chlor' : dosingType === 'ph_minus' ? 'pH-' : dosingType === 'ph_plus' ? 'pH+' : 'Flockmittel' as any); }}">
                    <ha-icon icon="mdi:stop" style="--mdc-icon-size: 14px;"></ha-icon> Stop
                  </button>
                </div>
              </div>

              <vpc-quick-actions .actions="${quickActions}"></vpc-quick-actions>
            `
            : ''}

          ${config.show_history && dosingVolume24h !== undefined
            ? html` <div class="info-row"><ha-icon icon="mdi:chart-line"></ha-icon><span class="info-label">Last 24h</span><span class="info-value">${dosingVolume24h}ml</span></div> `
            : ''}
        </div>
      </ha-card>
    `;
  }

  private _detectDosingType(entity: string): string {
    if (entity.includes('_cl')) return 'chlorine';
    if (entity.includes('_phm')) return 'ph_minus';
    if (entity.includes('_php')) return 'ph_plus';
    if (entity.includes('_floc')) return 'flocculant';
    return 'chlorine';
  }

  private _getDosingIcon(dosingType: string): string {
    switch (dosingType) {
      case 'chlorine': return 'mdi:flask-outline';
      case 'ph_minus': return 'mdi:flask-minus';
      case 'ph_plus': return 'mdi:flask-plus';
      case 'flocculant': return 'mdi:flask';
      default: return 'mdi:flask-outline';
    }
  }

  private renderOverviewCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const name = config.name || 'Pool Status';
    const accentColor = this._getAccentColor('overview', config);

    const pumpEntityId = this._getEntityId('pump_entity', 'switch', 'pump', 0);
    const heaterEntityId = this._getEntityId('heater_entity', 'climate', 'heater', 1);
    const solarEntityId = this._getEntityId('solar_entity', 'climate', 'solar', 2);
    const chlorineEntityId = this._getEntityId('chlorine_entity', 'switch', 'dos_1_cl', 3);
    const phEntityId = this._getEntityId('ph_minus_entity', 'switch', 'dos_2_phm', 4);

    const pumpEntity = this.hass.states[pumpEntityId];
    const heaterEntity = this.hass.states[heaterEntityId];
    const solarEntity = this.hass.states[solarEntityId];
    const chlorineEntity = this.hass.states[chlorineEntityId];
    const phEntity = this.hass.states[phEntityId];

    const poolTempSensorId = this._getEntityId('pool_temp_entity', 'sensor', 'temperature', 5);
    const phSensorId = this._getEntityId('ph_value_entity', 'sensor', 'ph_value', 6);
    const orpSensorId = this._getEntityId('orp_value_entity', 'sensor', 'orp_value', 7);

    const poolTempSensor = this.hass.states[poolTempSensorId];
    const phSensor = this.hass.states[phSensorId];
    const orpSensor = this.hass.states[orpSensorId];

    const poolTemp = poolTempSensor ? parseFloat(poolTempSensor.state) : undefined;
    const phValue = phSensor ? parseFloat(phSensor.state) : undefined;
    const orpValue = orpSensor ? parseFloat(orpSensor.state) : undefined;

    // Color-coded values
    const tempColor = poolTemp !== undefined ? StateColorHelper.getTemperatureColor(poolTemp) : undefined;
    const phColor = phValue !== undefined ? StateColorHelper.getPhColor(phValue) : undefined;
    const orpColor = orpValue !== undefined ? StateColorHelper.getOrpColor(orpValue) : undefined;

    const getPhStatus = (ph?: number) => {
      if (ph === undefined || isNaN(ph)) return 'unknown';
      if (ph < 7.0 || ph > 7.4) return 'warning';
      return 'ok';
    };

    const getOrpStatus = (orp?: number) => {
      if (orp === undefined || isNaN(orp)) return 'unknown';
      if (orp < 650) return 'warning';
      if (orp > 750) return 'high';
      return 'ok';
    };

    const phStatus = getPhStatus(phValue);
    const orpStatus = getOrpStatus(orpValue);

    const activeDevices: Array<{icon: string; name: string; status: string; state: string; entityId: string}> = [];

    if (pumpEntity) {
      const pumpState = (pumpEntity.attributes?.PUMPSTATE as string) || '';
      const parsedPumpState = EntityHelper.parsePumpState(pumpState);
      activeDevices.push({
        icon: 'mdi:pump',
        name: i18n.t('pump_short'),
        status: parsedPumpState.status || pumpEntity.state,
        state: pumpEntity.state,
        entityId: pumpEntityId,
      });
    }

    if (heaterEntity) {
      const heaterState = (heaterEntity.attributes?.HEATERSTATE as string) || '';
      const parsedHeaterState = EntityHelper.parseHeaterState(heaterState);
      activeDevices.push({
        icon: 'mdi:radiator',
        name: i18n.t('heater_short'),
        status: parsedHeaterState.status || heaterEntity.state,
        state: heaterEntity.state,
        entityId: heaterEntityId,
      });
    }

    if (solarEntity) {
      const solarState = (solarEntity.attributes?.SOLARSTATE as string) || '';
      const parsedSolarState = EntityHelper.parseSolarState(solarState);
      activeDevices.push({
        icon: 'mdi:solar-power',
        name: 'Solar',
        status: parsedSolarState.status || solarEntity.state,
        state: solarEntity.state,
        entityId: solarEntityId,
      });
    }

    if (chlorineEntity) {
      const clState = chlorineEntity.attributes?.DOS_1_CL_STATE || [];
      const statusText = Array.isArray(clState) && clState.length > 0
        ? EntityHelper.formatSnakeCase(clState[0])
        : chlorineEntity.state;
      activeDevices.push({
        icon: 'mdi:flask-outline',
        name: i18n.t('chlorine_short'),
        status: statusText,
        state: chlorineEntity.state,
        entityId: chlorineEntityId,
      });
    }

    if (phEntity) {
      const phState = phEntity.attributes?.DOS_2_PHM_STATE || [];
      const statusText = Array.isArray(phState) && phState.length > 0
        ? EntityHelper.formatSnakeCase(phState[0])
        : phEntity.state;
      activeDevices.push({
        icon: 'mdi:flask-minus',
        name: i18n.t('ph_minus'),
        status: statusText,
        state: phEntity.state,
        entityId: phEntityId,
      });
    }

    // Cover entity
    const coverEntityId = this._getEntityId('cover_entity', 'cover', 'cover');
    const coverEntity = this.hass.states[coverEntityId];
    if (coverEntity) {
      const pos = coverEntity.attributes?.current_position;
      const isMoving = coverEntity.state === 'opening' || coverEntity.state === 'closing';
      activeDevices.push({
        icon: coverEntity.state === 'open' ? 'mdi:window-shutter-open' : isMoving ? 'mdi:window-shutter' : 'mdi:window-shutter',
        name: (coverEntity.attributes.friendly_name as string) || 'Abdeckung',
        status: pos != null ? `${Math.round(Number(pos))}%${isMoving ? (coverEntity.state === 'opening' ? ' ↑' : ' ↓') : ''}` : (coverEntity.state === 'open' ? 'Offen' : 'Zu'),
        state: coverEntity.state === 'open' ? 'on' : coverEntity.state === 'closed' ? 'off' : 'auto',
        entityId: coverEntityId,
      });
    }

    // Light entity
    const lightEntityId = this._getEntityId('light_entity', 'light', 'light');
    const lightEntity = this.hass.states[lightEntityId];
    if (lightEntity) {
      const br = lightEntity.attributes?.brightness as number | undefined;
      const brText = br != null ? ` · ${Math.round(br / 255 * 100)}%` : '';
      activeDevices.push({
        icon: lightEntity.state === 'on' ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off-outline',
        name: (lightEntity.attributes.friendly_name as string) || 'Beleuchtung',
        status: lightEntity.state === 'on' ? `An${brText}` : 'Aus',
        state: lightEntity.state,
        entityId: lightEntityId,
      });
    }

    const warnings: string[] = [];

    // Filter entity
    const filterEntityId = this._getEntityId('filter_entity' as any, 'sensor', 'filter_pressure');
    const filterEntity = this.hass.states[filterEntityId];
    if (filterEntity) {
      const pressureVal = parseFloat(filterEntity.state);
      activeDevices.push({
        icon: 'mdi:filter',
        name: (filterEntity.attributes.friendly_name as string) || 'Filter',
        status: !isNaN(pressureVal) ? `${pressureVal.toFixed(2)} bar` : filterEntity.state,
        state: !isNaN(pressureVal) && pressureVal > 1.2 ? 'auto' : 'on',
        entityId: filterEntityId,
      });
    }

    // Pool level / Füllstand
    const poolLevelEntityId = this._getEntityId('pool_level_entity' as any, 'sensor', 'pool_level');
    const poolLevelEntity = this.hass.states[poolLevelEntityId];
    if (poolLevelEntity) {
      const levelVal = parseFloat(poolLevelEntity.state);
      activeDevices.push({
        icon: 'mdi:water-percent',
        name: (poolLevelEntity.attributes.friendly_name as string) || 'Füllstand',
        status: !isNaN(levelVal) ? `${levelVal.toFixed(0)}%` : poolLevelEntity.state,
        state: 'on',
        entityId: poolLevelEntityId,
      });
    }

    // Flow rate / Durchfluss
    const flowRateEntityId = this._getEntityId('flow_rate_entity' as any, 'sensor', 'flow_rate');
    const flowRateEntity = this.hass.states[flowRateEntityId];
    if (flowRateEntity) {
      const flowVal = parseFloat(flowRateEntity.state);
      const unit = flowRateEntity.attributes.unit_of_measurement || 'm³/h';
      activeDevices.push({
        icon: 'mdi:water-flow',
        name: (flowRateEntity.attributes.friendly_name as string) || 'Durchfluss',
        status: !isNaN(flowVal) ? `${flowVal.toFixed(2)} ${unit}` : flowRateEntity.state,
        state: flowVal > 0 ? 'on' : 'off',
        entityId: flowRateEntityId,
      });
    }

    // Inlet / Anströmung
    const inletEntityId = this._getEntityId('inlet_entity' as any, 'sensor', 'inlet');
    const inletEntity = this.hass.states[inletEntityId];
    if (inletEntity) {
      const inletVal = parseFloat(inletEntity.state);
      const unit = inletEntity.attributes.unit_of_measurement || '';
      activeDevices.push({
        icon: 'mdi:water-inlet',
        name: (inletEntity.attributes.friendly_name as string) || 'Anströmung',
        status: !isNaN(inletVal) ? `${inletVal.toFixed(2)} ${unit}` : inletEntity.state,
        state: inletVal > 0 ? 'on' : 'off',
        entityId: inletEntityId,
      });
    }

    // Chlorine value / Chlor-Wert (sensor)
    const chlorineValueEntityId = this._getEntityId('chlorine_value_entity' as any, 'sensor', 'chlorine_value');
    const chlorineValueEntity = this.hass.states[chlorineValueEntityId];
    if (chlorineValueEntity) {
      const clVal = parseFloat(chlorineValueEntity.state);
      const unit = chlorineValueEntity.attributes.unit_of_measurement || 'ppm';
      activeDevices.push({
        icon: 'mdi:flask-outline',
        name: (chlorineValueEntity.attributes.friendly_name as string) || 'Chlor-Wert',
        status: !isNaN(clVal) ? `${clVal.toFixed(2)} ${unit}` : chlorineValueEntity.state,
        state: 'on',
        entityId: chlorineValueEntityId,
      });
    }

    if (orpStatus === 'warning') warnings.push(i18n.t('orp_too_low'));
    if (orpStatus === 'high') warnings.push(i18n.t('orp_too_high'));
    if (phStatus === 'warning') warnings.push(i18n.t('ph_out_of_range'));

    if ((pumpEntity?.attributes?.PUMPSTATE as string | undefined)?.includes('ANTI_FREEZE')) {
      const outsideTempRaw = heaterEntity?.attributes?.outside_temperature as number | null | undefined;
      warnings.push(`${i18n.t('frost_protection_active')}${outsideTempRaw != null ? ` (${outsideTempRaw.toFixed(1)}°C)` : ''}`);
    }

    const anyActive = activeDevices.some(d => ['on', 'auto', 'heat', 'heating'].includes(d.state));
    const activeCount = activeDevices.filter(d => ['on', 'auto', 'heat', 'heating'].includes(d.state)).length;

    // Progress percentages for chemistry tiles
    const tempPct = poolTemp !== undefined ? this._getValuePercent(poolTemp, 18, 35) : undefined;
    const phPct = phValue !== undefined ? this._getValuePercent(phValue, 6.5, 8.0) : undefined;
    const orpPct = orpValue !== undefined ? this._getValuePercent(orpValue, 500, 900) : undefined;

    // Ideal zone positions for range bar (pH: 7.0-7.4, ORP: 650-750)
    const phIdealStartPct = this._getValuePercent(7.0, 6.5, 8.0);
    const phIdealEndPct = this._getValuePercent(7.4, 6.5, 8.0);
    const orpIdealStartPct = this._getValuePercent(650, 500, 900);
    const orpIdealEndPct = this._getValuePercent(750, 500, 900);

    return html` <ha-card class="${this._getCardClasses(anyActive, config)}" style="--card-accent: ${accentColor}" ><div class="accent-bar"></div><div class="card-content"><!-- Header --><div class="header"><div class="header-icon ${anyActive ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}"><ha-icon icon="mdi:pool"></ha-icon></div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle"> ${anyActive ? `${activeCount} ${activeCount === 1 ? i18n.t('device_active') : i18n.t('devices_active')}` : i18n.t('all_systems_idle')}
              </span>
            </div>
            ${warnings.length > 0
              ? html`<div class="overview-warning-badge">${warnings.length}</div>`
              : anyActive
              ? html`<div class="overview-active-dot"></div>`
              : ''}
          </div>

          <!-- Water Chemistry - Apple Health style metric tiles -->
          <div class="chemistry-grid">
            ${poolTemp !== undefined
              ? html` <div class="chemistry-card tooltip-wrap" style="--chem-color: ${tempColor?.color || '#4CAF50'}" @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(poolTempSensorId); }}"><div class="chem-icon-wrap"><ha-icon icon="mdi:thermometer-water"></ha-icon></div><span class="chemistry-val">${poolTemp.toFixed(1)}°</span><span class="chemistry-unit">°C</span><span class="chemistry-label">${poolTemp < 22 ? 'Kalt' : poolTemp < 26 ? 'OK' : poolTemp <= 30 ? 'Ideal' : 'Warm'}</span> ${tempPct !== undefined ? html`<div class="chem-mini-bar"><div class="chem-mini-ideal" style="left:${this._getValuePercent(24,18,35)}%;width:${this._getValuePercent(30,18,35)-this._getValuePercent(24,18,35)}%"></div><div class="chem-mini-fill" style="width: ${tempPct}%; background: ${tempColor?.color || '#4CAF50'}"></div></div>`
                      : ''}
                  <div class="t-tip">
                    <div class="t-tip-title"><ha-icon icon="mdi:thermometer-water"></ha-icon>Wassertemperatur</div>
                    <div class="t-tip-desc">Aktuelle Pooltemperatur. Der grüne Bereich zeigt die Komfortzone zum Schwimmen.</div>
                    <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>24°C – 30°C Komfort</div>
                  </div>
                  </div>
                `
              : ''}
            ${phValue !== undefined
              ? html` <div class="chemistry-card tooltip-wrap" style="--chem-color: ${phColor?.color || '#4CAF50'}" @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(phSensorId); }}"><div class="chem-icon-wrap"><ha-icon icon="mdi:ph"></ha-icon></div><span class="chemistry-val">${phValue.toFixed(1)}</span><span class="chemistry-unit">pH</span><span class="chemistry-label">${phStatus === 'ok' ? 'Optimal' : 'Achtung'}</span> ${phPct !== undefined ? html`
                          <div class="chem-mini-bar">
                            <div class="chem-mini-ideal" style="left: ${phIdealStartPct}%; width: ${phIdealEndPct - phIdealStartPct}%"></div>
                            <div class="chem-mini-fill" style="width: ${phPct}%; background: ${phColor?.color || '#4CAF50'}"></div>
                          </div>
                        `
                      : ''}
                  <div class="t-tip">
                    <div class="t-tip-title"><ha-icon icon="mdi:ph"></ha-icon>pH-Wert</div>
                    <div class="t-tip-desc">Misst den Säuregehalt des Wassers. Zu niedrig: reizt Haut/Augen. Zu hoch: Chlor verliert Wirkung.</div>
                    <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>7.0 – 7.4 Optimal</div>
                    ${phValue < 7.0 ? html`<div class="t-tip-warn"><ha-icon icon="mdi:arrow-up"></ha-icon>pH+ zugeben zum Erhöhen</div>` : phValue > 7.4 ? html`<div class="t-tip-warn"><ha-icon icon="mdi:arrow-down"></ha-icon>pH- zugeben zum Senken</div>` : ''}
                  </div>
                  </div>
                `
              : ''}
            ${orpValue !== undefined
              ? html` <div class="chemistry-card tooltip-wrap" style="--chem-color: ${orpColor?.color || '#4CAF50'}" @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(orpSensorId); }}"><div class="chem-icon-wrap"><ha-icon icon="mdi:lightning-bolt"></ha-icon></div><span class="chemistry-val">${orpValue.toFixed(0)}</span><span class="chemistry-unit">mV</span><span class="chemistry-label">${orpStatus === 'ok' ? 'Optimal' : orpStatus === 'warning' ? 'Niedrig' : 'Hoch'}</span> ${orpPct !== undefined ? html`
                          <div class="chem-mini-bar">
                            <div class="chem-mini-ideal" style="left: ${orpIdealStartPct}%; width: ${orpIdealEndPct - orpIdealStartPct}%"></div>
                            <div class="chem-mini-fill" style="width: ${orpPct}%; background: ${orpColor?.color || '#4CAF50'}"></div>
                          </div>
                        `
                      : ''}
                  <div class="t-tip">
                    <div class="t-tip-title"><ha-icon icon="mdi:lightning-bolt"></ha-icon>ORP – Desinfektionskraft</div>
                    <div class="t-tip-desc">Redoxpotential zeigt, wie wirksam das Chlor Bakterien abtöten kann. Zu niedrig = unzureichende Desinfektion.</div>
                    <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>650 – 750 mV Optimal</div>
                    ${orpValue < 650 ? html`<div class="t-tip-warn"><ha-icon icon="mdi:flask-outline"></ha-icon>Chlordosierung erhöhen</div>` : orpValue > 750 ? html`<div class="t-tip-warn"><ha-icon icon="mdi:flask-outline"></ha-icon>Chlordosierung reduzieren</div>` : ''}
                  </div>
                  </div>
                `
              : ''}
          </div>

          <!-- Quick Settings Panel -->
          ${config.show_controls !== false ? this._renderQuickSettingsPanel() : ''}

          <!-- Device List - clean rows -->
          ${activeDevices.length > 0
            ? html` <div class="overview-section"><div class="section-title"><span>${i18n.t('devices')}</span><span class="section-count">${activeDevices.length}</span></div><div class="device-list"> ${activeDevices.map( (device) => html`
                        <div class="device-row"
                          @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(device.entityId); }}">
                          <div class="device-icon-wrap ${['on', 'auto', 'heat', 'heating'].includes(device.state) ? 'device-icon-active' : ''}">
                            <ha-icon icon="${device.icon}"></ha-icon>
                          </div>
                          <div class="device-info">
                            <span class="device-name">${device.name}</span>
                            <span class="device-status">${device.status}</span>
                          </div>
                          <div class="device-dot ${['on', 'auto', 'heat', 'heating'].includes(device.state) ? 'dot-active' : 'dot-inactive'}"></div>
                        </div>
                      `
                    )}
                  </div>
                </div>
              `
            : ''}

          <!-- Warnings / All OK -->
          ${warnings.length > 0
            ? html` <div class="overview-section"><div class="section-title warning-title"><ha-icon icon="mdi:alert-outline" style="--mdc-icon-size: 14px"></ha-icon><span>${i18n.t('alerts')}</span></div><div class="warning-list"> ${warnings.map( (warning) => html`
                        <div class="warning-row">
                          <ha-icon icon="${warning.includes('Frost') ? 'mdi:snowflake-alert' : 'mdi:alert-circle'}" style="--mdc-icon-size: 16px"></ha-icon>
                          <span>${warning}</span>
                        </div>
                      `
                    )}
                  </div>
                </div>
              `
            : html` <div class="all-ok-display"><ha-icon icon="mdi:check-circle" style="--mdc-icon-size: 18px"></ha-icon><span>${i18n.t('all_systems_normal')}</span></div> `}
        </div>
      </ha-card>
    `;
  }

  private renderDetailsCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const title = config.name || (config as any).title || 'Details';
    const entities = config.entities || [];
    const icon = config.icon;

    if (!entities.length) {
      return html`
        <ha-card class="${this._getCardClasses(false, config)}" style="${this._getCardStyles(config)}">
          <div class="error-state">
            <div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div>
            <div class="error-info">
              <span class="error-title">No Entities Configured</span>
              <span class="error-entity">Please provide 'entities' list in card config</span>
            </div>
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card class="${this._getCardClasses(false, config)}" style="${this._getCardStyles(config)}">
        <div class="card-content" style="padding: var(--vpc-spacing, 16px);">
          ${title ? html`
          <div class="card-header" style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            ${icon ? html`<div class="header-icon" style="width:38px;height:38px;border-radius:10px;background:var(--vpc-surface);display:flex;align-items:center;justify-content:center;color:var(--vpc-primary);"><ha-icon icon="${icon}"></ha-icon></div>` : ''}
            <div class="name" style="font-size:16px;font-weight:600;color:var(--vpc-text);margin:0;">${title}</div>
          </div>
          ` : ''}
          <div class="device-list">
            ${entities.map(entityConf => {
              let entityId = '';
              let entityName = '';
              let entityIcon = '';

              if (typeof entityConf === 'string') {
                entityId = entityConf;
              } else {
                entityId = (entityConf as any).entity;
                entityName = (entityConf as any).name;
                entityIcon = (entityConf as any).icon;
              }

              const stateObj = this.hass.states[entityId];
              if (!stateObj) {
                return html`
                  <div class="device-row">
                    <div class="device-info">
                      <div class="device-name">${entityId}</div>
                      <div class="device-status" style="color:var(--vpc-danger, #FF3B30)">Not found</div>
                    </div>
                  </div>
                `;
              }

              const domain = entityId.split('.')[0];
              const dispName = entityName || stateObj.attributes.friendly_name || entityId;
              let dispIcon = entityIcon || stateObj.attributes.icon;

              if (!dispIcon) {
                if (domain === 'switch' || domain === 'light' || domain === 'binary_sensor') {
                  dispIcon = stateObj.state === 'on' ? 'mdi:check-circle' : 'mdi:circle-outline';
                } else if (domain === 'sensor' && stateObj.attributes.device_class === 'temperature') {
                  dispIcon = 'mdi:thermometer';
                } else if (domain === 'sensor' && stateObj.attributes.unit_of_measurement === '%') {
                  dispIcon = 'mdi:water-percent';
                } else {
                  dispIcon = 'mdi:information-outline';
                }
              }

              const isSwitchLike = ['switch', 'light', 'input_boolean'].includes(domain);
              const isBinary = domain === 'binary_sensor';
              const isOn = stateObj.state === 'on';
              const isActionable = isSwitchLike;

              let dispState = stateObj.state;
              if (stateObj.attributes.unit_of_measurement) {
                dispState += ' ' + stateObj.attributes.unit_of_measurement;
              }

              const onClick = () => {
                if (isActionable) {
                  this.hass.callService('homeassistant', 'toggle', { entity_id: entityId });
                } else {
                  const event = new Event('hass-more-info', { bubbles: true, composed: true });
                  (event as any).detail = { entityId: entityId };
                  this.dispatchEvent(event);
                }
              };

              return html`
                <div class="device-row" @click="${onClick}">
                  <div class="device-icon-wrap ${isOn && (isSwitchLike || isBinary) ? 'device-icon-active' : ''}">
                    <ha-icon icon="${dispIcon}"></ha-icon>
                  </div>
                  <div class="device-info">
                    <div class="device-name">${dispName}</div>
                    <div class="device-status">${dispState}</div>
                  </div>
                  ${isSwitchLike ? html`
                    <div class="device-dot ${isOn ? 'dot-active' : 'dot-inactive'}"></div>
                  ` : ''}
                </div>
              `;
            })}
          </div>
        </div>
      </ha-card>
    `
  }


  private renderCompactCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entity = this.hass.states[config.entity!];
    const state = entity.state;
    const name = config.name || entity.attributes.friendly_name || 'Entity';
    const domain = config.entity!.split('.')[0];

    let icon = config.icon;
    if (!icon) {
      if (domain === 'switch' && config.entity!.includes('pump')) {
        icon = 'mdi:pump';
      } else if (domain === 'climate' && config.entity!.includes('heater')) {
        icon = 'mdi:radiator';
      } else if (domain === 'climate' && config.entity!.includes('solar')) {
        icon = 'mdi:solar-power';
      } else if (domain === 'switch' && config.entity!.includes('dos')) {
        icon = 'mdi:flask-outline';
      } else if (domain === 'cover') {
        icon = entity.state === 'open' ? 'mdi:window-shutter-open' : 'mdi:window-shutter';
      } else if (domain === 'light') {
        icon = entity.state === 'on' ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off-outline';
      } else if (domain === 'sensor' && config.entity!.includes('filter')) {
        icon = 'mdi:filter';
      } else {
        icon = 'mdi:circle';
      }
    }

    let detailStatus = '';
    let currentValue = '';

    if (entity.attributes?.PUMPSTATE) {
      const parsedState = EntityHelper.parsePumpState(entity.attributes.PUMPSTATE as string);
      detailStatus = parsedState.status;
      if (parsedState.level !== undefined && parsedState.level > 0) {
        currentValue = `Level ${parsedState.level}`;
      }
    } else if (entity.attributes?.HEATERSTATE) {
      const parsedState = EntityHelper.parseHeaterState(entity.attributes.HEATERSTATE as string);
      detailStatus = parsedState.status;
      const temp = EntityHelper.getCurrentTemperature(entity);
      if (temp !== undefined) {
        currentValue = `${temp.toFixed(1)}°C`;
      }
    } else if (entity.attributes?.SOLARSTATE) {
      const parsedState = EntityHelper.parseSolarState(entity.attributes.SOLARSTATE as string);
      detailStatus = parsedState.status;
      const temp = EntityHelper.getCurrentTemperature(entity);
      if (temp !== undefined) {
        currentValue = `${temp.toFixed(1)}°C`;
      }
    } else if (Object.keys(entity.attributes || {}).some(key => key.includes('DOS_') && key.includes('_STATE'))) {
      const dosingStateKey = Object.keys(entity.attributes || {}).find(
        key => key.includes('DOS_') && key.includes('_STATE')
      );
      const dosingState = dosingStateKey ? entity.attributes[dosingStateKey] : [];
      if (Array.isArray(dosingState) && dosingState.length > 0) {
        detailStatus = EntityHelper.formatSnakeCase(dosingState[0]);
      }

      const dosingType = this._detectDosingType(config.entity!);
      if (dosingType === 'chlorine') {
        const orpSensorId = this._getEntityId('orp_value_entity', 'sensor', 'orp_value');
        const orpSensor = this.hass.states[orpSensorId];
        if (orpSensor) {
          currentValue = `${parseFloat(orpSensor.state).toFixed(0)}mV`;
        }
      } else if (dosingType === 'ph_minus' || dosingType === 'ph_plus') {
        const phSensorId = this._getEntityId('ph_value_entity', 'sensor', 'ph_value');
        const phSensor = this.hass.states[phSensorId];
        if (phSensor) {
          currentValue = `pH ${parseFloat(phSensor.state).toFixed(1)}`;
        }
      }
    } else if (domain === 'cover') {
      const pos = entity.attributes?.current_position as number | null | undefined;
      if (pos != null) currentValue = `${Math.round(pos)}%`;
      detailStatus = entity.state === 'open' ? 'Geöffnet' : entity.state === 'closed' ? 'Geschlossen' : entity.state === 'opening' ? 'Öffnet…' : entity.state === 'closing' ? 'Schließt…' : entity.state;
    } else if (domain === 'light') {
      const br = entity.attributes?.brightness as number | null | undefined;
      if (br != null) currentValue = `${Math.round(br / 255 * 100)}%`;
      detailStatus = entity.state === 'on' ? 'An' : 'Aus';
    } else if (domain === 'sensor') {
      const unit = entity.attributes?.unit_of_measurement || '';
      const num = parseFloat(entity.state);
      if (!isNaN(num)) currentValue = `${num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)}${unit}`;
      detailStatus = (entity.attributes.device_class as string) || '';
    }

    const isActive = state === 'on' || state === 'auto' || state === 'heat' || state === 'heating' || state === 'open' || state === 'opening';

    return html` <ha-card class="compact-card ${this._getCardClasses(isActive, config)}" @click="${() => this._showMoreInfo(config.entity!)}" ><div class="card-content compact"><div class="compact-icon ${isActive ? 'compact-icon-active' : ''}"><ha-icon icon="${icon}" class="${isActive ? 'active' : 'inactive'}" ></ha-icon></div><div class="compact-info"><span class="name">${name}</span><div class="compact-details"> ${currentValue ? html`<span class="compact-value">${currentValue}</span>` : ''}
              ${detailStatus ? html`<span class="compact-detail">${detailStatus}</span>` : ''}
            </div>
          </div>
          <vpc-status-badge .state="${state}"></vpc-status-badge>
        </div>
      </ha-card>
    `;
  }

  private renderChemicalCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const name = config.name || 'Wasserchemie';
    const accentColor = '#4CAF50';
    const chemistryType = config.chemistry_type || 'chlorine';

    // Get sensors with show_ config options
    const showTemp = config.show_temperature !== false;
    const showPh = config.show_ph !== false;
    const showOrp = config.show_orp !== false && chemistryType === 'chlorine';
    const showChlorine = config.show_chlorine !== false && chemistryType === 'chlorine';
    const showSalt = config.show_salt === true && chemistryType === 'salt';
    const showInlet = config.show_inlet === true;

    // Get sensor entities
    const poolTempSensorId = showTemp ? this._getEntityId('pool_temp_entity', 'sensor', 'temperature', 5) : null;
    const phSensorId = showPh ? this._getEntityId('ph_value_entity', 'sensor', 'ph_value', 6) : null;
    const orpSensorId = showOrp ? this._getEntityId('orp_value_entity', 'sensor', 'orp_value', 7) : null;
    const chlorineSensorId = showChlorine ? ((config as any).chlorine_entity || this._buildEntityId('sensor', 'chlorine')) : null;
    const saltSensorId = showSalt ? ((config as any).salt_level_entity || this._buildEntityId('sensor', 'salt_level')) : null;
    const inletEntityId = showInlet ? ((config as any).inlet_entity || this._buildEntityId('switch', 'inlet')) : null;
    const targetPhId = this._getEntityId('target_ph_entity', 'number', 'target_ph');
    const targetOrpId = showOrp ? this._getEntityId('target_orp_entity', 'number', 'target_orp') : null;

    // Get sensor states
    const poolTempSensor = poolTempSensorId ? this.hass.states[poolTempSensorId] : undefined;
    const phSensor = phSensorId ? this.hass.states[phSensorId] : undefined;
    const orpSensor = orpSensorId ? this.hass.states[orpSensorId] : undefined;
    const chlorineSensor = chlorineSensorId ? this.hass.states[chlorineSensorId] : undefined;
    const saltSensor = saltSensorId ? this.hass.states[saltSensorId] : undefined;
    const inletEntity = inletEntityId ? this.hass.states[inletEntityId] : undefined;
    const targetPhEntity = this.hass.states[targetPhId];
    const targetOrpEntity = targetOrpId ? this.hass.states[targetOrpId] : undefined;

    // Parse values
    const poolTemp = poolTempSensor ? parseFloat(poolTempSensor.state) : undefined;
    const phValue = phSensor ? parseFloat(phSensor.state) : undefined;
    const orpValue = orpSensor ? parseFloat(orpSensor.state) : undefined;
    const chlorineValue = chlorineSensor ? parseFloat(chlorineSensor.state) : undefined;
    const saltValue = saltSensor ? parseFloat(saltSensor.state) : undefined;
    const isInletActive = inletEntity ? (inletEntity.state === 'on' || inletEntity.state === 'active') : undefined;
    const targetPh = targetPhEntity ? parseFloat(targetPhEntity.state) : 7.2;
    const targetOrp = targetOrpEntity ? parseFloat(targetOrpEntity.state) : 700;

    // Get colors
    const tempColor = poolTemp !== undefined ? StateColorHelper.getTemperatureColor(poolTemp) : undefined;
    const phColor = phValue !== undefined ? StateColorHelper.getPhColor(phValue, targetPh) : undefined;
    const orpColor = orpValue !== undefined ? StateColorHelper.getOrpColor(orpValue, targetOrp) : undefined;

    // Status helpers
    const getTempStatus = (t?: number) => {
      if (t === undefined) return '';
      if (t < 20) return 'Sehr kalt';
      if (t < 24) return 'Kühl';
      if (t <= 28) return 'Perfekt';
      if (t <= 32) return 'Angenehm warm';
      return 'Zu warm';
    };

    const getPhStatus = (ph?: number) => {
      if (ph === undefined) return 'Unbekannt';
      if (ph < 6.8) return 'Zu sauer';
      if (ph < 7.0) return 'Leicht sauer';
      if (ph <= 7.4) return 'Optimal';
      if (ph <= 7.6) return 'Leicht basisch';
      return 'Zu basisch';
    };

    const getOrpStatus = (orp?: number) => {
      if (orp === undefined) return 'Unbekannt';
      if (orp < 600) return 'Zu niedrig';
      if (orp < 650) return 'Niedrig';
      if (orp <= 750) return 'Optimal';
      if (orp <= 800) return 'Erhöht';
      return 'Zu hoch';
    };

    const getChlorineStatus = (cl?: number) => {
      if (cl === undefined) return 'Unbekannt';
      if (cl < 0.3) return 'Zu niedrig';
      if (cl < 0.5) return 'Niedrig';
      if (cl <= 1.5) return 'Optimal';
      if (cl <= 2.0) return 'Erhöht';
      return 'Zu hoch';
    };

    const getSaltStatus = (salt?: number) => {
      if (salt === undefined) return 'Unbekannt';
      if (salt < 2500) return 'Zu niedrig';
      if (salt < 3000) return 'Niedrig';
      if (salt <= 4000) return 'Optimal';
      if (salt <= 4500) return 'Erhöht';
      return 'Zu hoch';
    };

    // Check values
    const phOk = phValue !== undefined && phValue >= 7.0 && phValue <= 7.4;
    const orpOk = orpValue !== undefined && orpValue >= 650 && orpValue <= 750;
    const chlorineOk = chlorineValue !== undefined && chlorineValue >= 0.5 && chlorineValue <= 1.5;
    const saltOk = saltValue !== undefined && saltValue >= 3000 && saltValue <= 4000;

    // Count issues only for visible values
    const issuesCount = [
      showPh && !phOk,
      showOrp && !orpOk,
      showChlorine && !chlorineOk,
      showSalt && !saltOk
    ].filter(v => v).length;

    const overallStatus = issuesCount === 0 ? 'Optimal' : issuesCount === 1 ? 'Achtung' : 'Eingriff nötig';
    const overallColor = issuesCount === 0 ? 'var(--vpc-success, #34C759)' : issuesCount === 1 ? 'var(--vpc-warning, #FF9F0A)' : 'var(--vpc-danger, #FF3B30)';
    const overallIcon = issuesCount === 0 ? 'mdi:water-check' : issuesCount === 1 ? 'mdi:alert' : 'mdi:alert-circle';

    const tempPct = poolTemp !== undefined ? this._getValuePercent(poolTemp, 18, 35) : undefined;

    return html`
      <ha-card class="${this._getCardClasses(issuesCount === 0, config)}" style="--card-accent: ${accentColor}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon" style="--icon-accent: ${accentColor}">
              <ha-icon icon="${config.icon || (chemistryType === 'salt' ? 'mdi:shaker' : 'mdi:water-check')}"></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="color: ${overallColor}">${overallStatus}</span>
            </div>
            <div class="chem-overall-badge" style="background: color-mix(in srgb, ${overallColor} 12%, transparent); color: ${overallColor}; border: 1px solid color-mix(in srgb, ${overallColor} 25%, transparent);">
              <ha-icon icon="${overallIcon}" style="--mdc-icon-size: 14px"></ha-icon>
              <span>${overallStatus}</span>
            </div>
          </div>

          ${poolTemp !== undefined ? html`
            <div class="chem-section tooltip-wrap">
              <div class="chem-section-header">
                <ha-icon icon="mdi:thermometer-water" style="--mdc-icon-size: 15px; color: ${tempColor?.color || 'var(--vpc-text-secondary)'}"></ha-icon>
                <span>Wassertemperatur</span>
                <span class="chem-section-status" style="color: ${tempColor?.color}">${getTempStatus(poolTemp)}</span>
              </div>
              <div class="chem-big-value" style="color: ${tempColor?.color || 'var(--vpc-text)'}">
                <span class="chem-big-num">${poolTemp.toFixed(1)}</span>
                <span class="chem-big-unit">°C</span>
              </div>
              ${tempPct !== undefined ? html`
                <div class="chem-gauge-bar">
                  <div class="chem-gauge-track">
                    <div class="chem-gauge-fill" style="width: ${tempPct}%; background: ${tempColor?.color || accentColor}"></div>
                    <div class="chem-gauge-zone" style="left: ${this._getValuePercent(24, 18, 35)}%; width: ${this._getValuePercent(30, 18, 35) - this._getValuePercent(24, 18, 35)}%"></div>
                  </div>
                  <div class="chem-gauge-labels">
                    <span>18°C</span>
                    <span class="chem-zone-label">Komfortzone 24–30°C</span>
                    <span>35°C</span>
                  </div>
                </div>
              ` : ''}
              <div class="t-tip">
                <div class="t-tip-title"><ha-icon icon="mdi:thermometer-water"></ha-icon>Wassertemperatur</div>
                <div class="t-tip-desc">Aktuelle Pooltemperatur. Die grüne Zone zeigt den idealen Badekomfort-Bereich.</div>
                <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>24°C – 30°C Komfort</div>
              </div>
            </div>
          ` : ''}

          ${isInletActive !== undefined ? html`
            <div class="info-row tooltip-wrap" style="margin-top: 12px;">
              <ha-icon icon="mdi:arrow-right-bold" style="--mdc-icon-size:17px;color:${isInletActive ? '#00BCD4' : 'var(--vpc-text-secondary)'}"></ha-icon>
              <span class="info-label">Anströmung</span>
              <span class="info-value" style="color:${isInletActive ? '#00BCD4' : 'var(--vpc-text-secondary)'}">${isInletActive ? 'Aktiv' : 'Inaktiv'}</span>
              <div class="t-tip">
                <div class="t-tip-title"><ha-icon icon="mdi:arrow-right-bold"></ha-icon>Anströmung</div>
                <div class="t-tip-desc">Wassereinlass in den Pool. Die Anströmung sorgt für Wasserbewegung und Durchmischung des Poolwassers, was für eine effektive Wasserbehandlung wichtig ist.</div>
                ${isInletActive ? html`<div class="t-tip-ideal"><ha-icon icon="mdi:check-circle"></ha-icon>Wasserzirkulation aktiv</div>` : ''}
              </div>
            </div>
          ` : ''}

          <div class="chem-dual-grid">
            ${phValue !== undefined ? html`
              <div class="chem-metric-card tooltip-wrap" style="--chem-color: ${phColor?.color || '#4CAF50'}" @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(phSensorId!); }}">
                <div class="chem-metric-header">
                  <ha-icon icon="mdi:ph"></ha-icon>
                  <span>pH-Wert</span>
                </div>
                <div style="height: 80px; padding: 8px 0; display: flex; align-items: center; justify-content: center;">
                  ${gaugeNeedleSVG(phValue, 6.5, 8.0, phColor?.color || '#4CAF50')}
                </div>
                <div class="chem-metric-status">${getPhStatus(phValue)}</div>
                <div class="t-tip">
                  <div class="t-tip-title"><ha-icon icon="mdi:ph"></ha-icon>pH-Wert</div>
                  <div class="t-tip-desc">Säuregehalt des Wassers. Zu niedrig reizt Haut und Augen. Zu hoch reduziert die Chlorwirksamkeit. Ziel: ${targetPh.toFixed(1)}</div>
                  <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>7.0 – 7.4 Optimal</div>
                  ${!phOk ? html`<div class="t-tip-warn"><ha-icon icon="mdi:flask"></ha-icon>${phValue < 7.0 ? 'pH+ zugeben' : 'pH- zugeben'}</div>` : ''}
                </div>
              </div>
            ` : ''}

            ${orpValue !== undefined ? html`
              <div class="chem-metric-card tooltip-wrap" style="--chem-color: ${orpColor?.color || '#4CAF50'}" @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(orpSensorId!); }}">
                <div class="chem-metric-header">
                  <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                  <span>Redoxwert</span>
                </div>
                <div style="height: 80px; padding: 8px 0; display: flex; align-items: center; justify-content: center;">
                  ${gaugeNeedleSVG(orpValue, 500, 900, orpColor?.color || '#4CAF50')}
                </div>
                <div class="chem-metric-status">${getOrpStatus(orpValue)}</div>
                <div class="t-tip">
                  <div class="t-tip-title"><ha-icon icon="mdi:lightning-bolt"></ha-icon>Redoxwert (ORP)</div>
                  <div class="t-tip-desc">Redoxpotential misst, wie wirksam das Chlor Keime abtötet. Niedriger ORP = unzureichende Desinfektion. Ziel: ${targetOrp?.toFixed(0) || '700'} mV</div>
                  <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>650 – 750 mV Optimal</div>
                  ${!orpOk ? html`<div class="t-tip-warn"><ha-icon icon="mdi:flask-outline"></ha-icon>${orpValue < 650 ? 'Chlor erhöhen' : 'Chlor reduzieren'}</div>` : ''}
                </div>
              </div>
            ` : ''}
          </div>

          ${chlorineValue !== undefined ? html`
            <div class="chem-section tooltip-wrap" style="margin-top: 12px;">
              <div class="chem-section-header">
                <ha-icon icon="mdi:flask" style="--mdc-icon-size: 15px; color: ${chlorineOk ? '#4CAF50' : 'var(--vpc-warning)'}"></ha-icon>
                <span>Chlorgehalt</span>
                <span class="chem-section-status" style="color: ${chlorineOk ? '#4CAF50' : 'var(--vpc-warning)'}">${getChlorineStatus(chlorineValue)}</span>
              </div>
              <div class="chem-big-value" style="color: ${chlorineOk ? 'var(--vpc-text)' : 'var(--vpc-warning)'}">
                <span class="chem-big-num">${chlorineValue.toFixed(2)}</span>
                <span class="chem-big-unit">mg/l</span>
              </div>
              <div class="t-tip">
                <div class="t-tip-title"><ha-icon icon="mdi:flask"></ha-icon>Chlorgehalt</div>
                <div class="t-tip-desc">Freies Chlor zur Desinfektion. Zu wenig Chlor ermöglicht Bakterienwachstum. Zu viel reizt Haut und Augen.</div>
                <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>0.5 – 1.5 mg/l Optimal</div>
                ${!chlorineOk ? html`<div class="t-tip-warn"><ha-icon icon="mdi:alert"></ha-icon>${chlorineValue < 0.5 ? 'Chlor zu niedrig - Nachdosieren erforderlich' : 'Chlor zu hoch - Abwarten oder verdünnen'}</div>` : ''}
              </div>
            </div>
          ` : ''}

          ${saltValue !== undefined ? html`
            <div class="chem-section tooltip-wrap" style="margin-top: 12px;">
              <div class="chem-section-header">
                <ha-icon icon="mdi:shaker" style="--mdc-icon-size: 15px; color: ${saltOk ? '#4CAF50' : 'var(--vpc-warning)'}"></ha-icon>
                <span>Salzgehalt</span>
                <span class="chem-section-status" style="color: ${saltOk ? '#4CAF50' : 'var(--vpc-warning)'}">${getSaltStatus(saltValue)}</span>
              </div>
              <div class="chem-big-value" style="color: ${saltOk ? 'var(--vpc-text)' : 'var(--vpc-warning)'}">
                <span class="chem-big-num">${saltValue.toFixed(0)}</span>
                <span class="chem-big-unit">ppm</span>
              </div>
              <div class="t-tip">
                <div class="t-tip-title"><ha-icon icon="mdi:shaker"></ha-icon>Salzgehalt</div>
                <div class="t-tip-desc">Salzgehalt für Salzwasserdesinfektion. Der Salzelektrolyse benötigt einen optimalen Salzgehalt für effiziente Chlorproduktion.</div>
                <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>3000 – 4000 ppm Optimal</div>
                ${!saltOk ? html`<div class="t-tip-warn"><ha-icon icon="mdi:alert"></ha-icon>${saltValue < 3000 ? 'Salz zu niedrig - Salz nachfüllen' : 'Salz zu hoch - Wasser verdünnen'}</div>` : ''}
              </div>
            </div>
          ` : ''}

          ${issuesCount > 0 ? html`
            <div style="margin-top: 16px; padding: 12px; background: color-mix(in srgb, var(--vpc-danger, #FF3B30) 10%, transparent); border: 1px solid color-mix(in srgb, var(--vpc-danger, #FF3B30) 20%, transparent); border-radius: 12px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <ha-icon icon="mdi:alert-circle" style="color: var(--vpc-danger, #FF3B30); --mdc-icon-size: 18px"></ha-icon>
                <span style="font-weight: 600; color: var(--vpc-danger, #FF3B30);">Alarme</span>
              </div>
              ${phValue !== undefined && !phOk ? html`
                <div style="padding: 6px 0; font-size: 13px; color: var(--vpc-text);">
                  <ha-icon icon="mdi:ph" style="--mdc-icon-size: 14px; color: ${phColor?.color || 'var(--vpc-warning)'}"></ha-icon>
                  <span>pH-Wert außerhalb des optimalen Bereichs (${phValue.toFixed(1)})</span>
                </div>
              ` : ''}
              ${orpValue !== undefined && !orpOk ? html`
                <div style="padding: 6px 0; font-size: 13px; color: var(--vpc-text);">
                  <ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size: 14px; color: ${orpColor?.color || 'var(--vpc-warning)'}"></ha-icon>
                  <span>Redoxwert außerhalb des optimalen Bereichs (${orpValue.toFixed(0)} mV)</span>
                </div>
              ` : ''}
              ${chlorineValue !== undefined && !chlorineOk ? html`
                <div style="padding: 6px 0; font-size: 13px; color: var(--vpc-text);">
                  <ha-icon icon="mdi:flask" style="--mdc-icon-size: 14px; color: var(--vpc-warning)"></ha-icon>
                  <span>Chlorgehalt außerhalb des optimalen Bereichs (${chlorineValue.toFixed(2)} mg/l)</span>
                </div>
              ` : ''}
              ${saltValue !== undefined && !saltOk ? html`
                <div style="padding: 6px 0; font-size: 13px; color: var(--vpc-text);">
                  <ha-icon icon="mdi:shaker" style="--mdc-icon-size: 14px; color: var(--vpc-warning)"></ha-icon>
                  <span>Salzgehalt außerhalb des optimalen Bereichs (${saltValue.toFixed(0)} ppm)</span>
                </div>
              ` : ''}
            </div>
          ` : ''}

          ${issuesCount > 0 ? html`
            <div class="chem-recommendations">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <ha-icon icon="mdi:lightbulb" style="color: var(--vpc-warning, #FF9F0A); --mdc-icon-size: 16px"></ha-icon>
                <span style="font-weight: 600; color: var(--vpc-text); font-size: 13px;">Empfehlungen</span>
              </div>
              ${phValue !== undefined && !phOk ? html`
                <div class="chem-rec-row" style="--rec-color: ${phColor?.color || 'var(--vpc-warning)'}">
                  <ha-icon icon="mdi:ph"></ha-icon>
                  <span>${phValue < 7.0 ? 'pH zu sauer: pH+ Mittel zugeben' : 'pH zu basisch: pH- Mittel zugeben'}</span>
                </div>
              ` : ''}
              ${orpValue !== undefined && !orpOk ? html`
                <div class="chem-rec-row" style="--rec-color: ${orpColor?.color || 'var(--vpc-warning)'}">
                  <ha-icon icon="mdi:flask-outline"></ha-icon>
                  <span>${orpValue < 650 ? 'Redoxwert zu niedrig: Chlordosierung erhöhen' : 'Redoxwert zu hoch: Chlordosierung reduzieren'}</span>
                </div>
              ` : ''}
              ${chlorineValue !== undefined && !chlorineOk ? html`
                <div class="chem-rec-row" style="--rec-color: var(--vpc-warning)">
                  <ha-icon icon="mdi:flask"></ha-icon>
                  <span>${chlorineValue < 0.5 ? 'Chlor zu niedrig: Chlordosierung erhöhen' : 'Chlor zu hoch: Abwarten oder verdünnen'}</span>
                </div>
              ` : ''}
              ${saltValue !== undefined && !saltOk ? html`
                <div class="chem-rec-row" style="--rec-color: var(--vpc-warning)">
                  <ha-icon icon="mdi:shaker"></ha-icon>
                  <span>${saltValue < 3000 ? 'Salz zu niedrig: Salz nachfüllen' : 'Salz zu hoch: Wasser verdünnen oder teilweise ablassen'}</span>
                </div>
              ` : ''}
            </div>
          ` : html`
            <div class="all-ok-display">
              <ha-icon icon="mdi:water-check" style="--mdc-icon-size: 18px"></ha-icon>
              <span>Wasserqualität optimal</span>
            </div>
          `}
        </div>
      </ha-card>
    `;
  }

  private renderSensorCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entity = this.hass.states[config.entity!];
    const state = entity.state;
    const name = config.name || (entity.attributes.friendly_name as string) || 'Sensor';
    const unit = (entity.attributes.unit_of_measurement as string) || '';
    const accentColor = config.accent_color || this._getAccentColor('overview', config);

    const numValue = parseFloat(state);
    const isNumeric = !isNaN(numValue);
    const deviceClass = entity.attributes.device_class as string | undefined;

    const tooltipMap: Record<string, { title: string; desc: string; ideal?: string }> = {
      temperature: { title: 'Temperatur', desc: 'Aktuelle Temperaturmessung des Sensors.', ideal: '24°C – 30°C (Pool)' },
      ph: { title: 'pH-Wert', desc: 'Säuregehalt des Poolwassers.', ideal: '7.0 – 7.4' },
      voltage: { title: 'ORP / Spannung', desc: 'Redoxpotential – Desinfektionskraft des Wassers.', ideal: '650 – 750 mV' },
      humidity: { title: 'Luftfeuchtigkeit', desc: 'Relative Luftfeuchtigkeit in Prozent.' },
      pressure: { title: 'Druck', desc: 'Aktueller Druckwert.' },
    };
    const tooltip = (deviceClass && tooltipMap[deviceClass]) || { title: name, desc: 'Sensorwert aus dem Violet Pool System.' };

    const displayValue = isNumeric
      ? (numValue % 1 === 0 ? numValue.toFixed(0) : numValue.toFixed(1))
      : state;

    return html`
      <ha-card class="${this._getCardClasses(false, config)}" style="--card-accent: ${accentColor}" @click="${() => this._showMoreInfo(config.entity!)}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon" style="--icon-accent: ${accentColor}">
              <ha-icon icon="${config.icon || (deviceClass === 'temperature' ? 'mdi:thermometer' : deviceClass === 'ph' ? 'mdi:ph' : 'mdi:gauge')}"></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">${deviceClass ? deviceClass.charAt(0).toUpperCase() + deviceClass.slice(1) : 'Sensor'}</span>
            </div>
          </div>
          ${isNumeric ? html`
            <div style="padding: 12px 0; min-height: 100px; display: flex; flex-direction: column; align-items: center;">
              <div style="height: 70px; width: 100%; display: flex; align-items: center;">
                ${chartSVG([numValue * 0.8, numValue, numValue * 1.1, numValue * 0.9, numValue, numValue * 1.05], accentColor)}
              </div>
              <div class="sensor-big-value" style="margin-top: 8px;">
                <span class="sensor-num">${displayValue}</span>
                ${unit ? html`<span class="sensor-unit">${unit}</span>` : ''}
              </div>
            </div>
          ` : html`
            <div class="sensor-value-display">
              <div class="sensor-big-value">
                <span class="sensor-state-text">${state}</span>
              </div>
            </div>
          `}

          <div class="tooltip-wrap" style="width: 100%; position: relative;">
            <div class="t-tip" style="position: static; opacity: 0.7; background: var(--vpc-surface); transform: none; width: 100%; max-width: 100%; margin-top: 8px; padding: 8px; border: none; box-shadow: none; border-radius: 8px;">
              <div class="t-tip-title"><ha-icon icon="mdi:information-outline"></ha-icon>${tooltip.title}</div>
              <div class="t-tip-desc">${tooltip.desc}</div>
              ${tooltip.ideal ? html`<div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>${tooltip.ideal}</div>` : ''}
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  private renderCoverCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entityId = config.cover_entity || config.entity || this._buildEntityId('cover', 'cover');
    const entity = this.hass.states[entityId];
    if (!entity) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Cover nicht gefunden</span><span class="error-entity">${entityId}</span></div></div></ha-card>`;
    }

    const state = entity.state;
    const name = config.name || entity.attributes.friendly_name || 'Pool Abdeckung';
    const isOpen = state === 'open' || state === 'opening';
    const isMoving = state === 'opening' || state === 'closing';
    const accentColor = this._getAccentColor('cover', config);

    const stateLabels: Record<string, string> = {
      open: 'Geöffnet', closed: 'Geschlossen',
      opening: 'Öffnet…', closing: 'Schließt…', stopped: 'Gestoppt',
    };
    const coverStatusColor = state === 'open' ? 'var(--vpc-success,#34C759)'
      : state === 'closed' ? accentColor
      : isMoving ? 'var(--vpc-warning,#FF9F0A)'
      : 'var(--vpc-text-secondary)';

    const badgeState = state === 'open' ? 'on' : state === 'closed' ? 'off' : 'auto';

    return html`
      <ha-card class="${this._getCardClasses(state === 'open' || isMoving, config)}"
               style="--card-accent: ${accentColor}"
               @click="${() => this._showMoreInfo(entityId)}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${state !== 'closed' ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">
              ${config.icon
                ? html`<ha-icon icon="${config.icon}"></ha-icon>`
                : html`<ha-icon icon="${state === 'open' ? 'mdi:window-shutter-open' : isMoving ? 'mdi:window-shutter' : 'mdi:window-shutter'}"></ha-icon>`}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="color:${coverStatusColor}">${stateLabels[state] || state}</span>
            </div>
            ${config.show_state !== false ? html`<vpc-status-badge .state="${badgeState}" .pulse="${isMoving}"></vpc-status-badge>` : ''}
          </div>

          <!-- Animated pool visualization -->
          <div class="cover-visual">
            ${coverSVG(isOpen ? 100 : 0, isMoving, accentColor)}
          </div>

          ${isMoving ? html`
            <!-- Moving indicator -->
            <div class="info-row" style="margin-top: 8px;">
              <ha-icon icon="mdi:rotate-3d-variant" style="--mdc-icon-size:17px"></ha-icon>
              <span class="info-label">Status</span>
              <span class="cover-moving-pill">${state === 'opening' ? '▲ Öffnet' : '▼ Schließt'}</span>
            </div>
          ` : ''}

          <!-- Open / Close buttons only -->
          ${config.show_controls !== false ? html`
            <div class="cover-controls" style="margin-top: ${isMoving ? '8px' : '12px'};">
              <button class="cover-btn ${state === 'open' ? 'cvr-active' : ''}"
                      style="--cvr-btn-color: ${state === 'open' ? 'var(--vpc-success,#34C759)' : accentColor}"
                      @click="${(e: Event) => { e.stopPropagation(); this.hass.callService('cover', 'open_cover', { entity_id: entityId }); }}">
                <ha-icon icon="mdi:arrow-up" style="--mdc-icon-size:17px"></ha-icon>
                <span>Öffnen</span>
              </button>
              <button class="cover-btn ${state === 'closed' ? 'cvr-active' : ''}"
                      style="--cvr-btn-color: ${state === 'closed' ? accentColor : 'var(--vpc-text-secondary)'}"
                      @click="${(e: Event) => { e.stopPropagation(); this.hass.callService('cover', 'close_cover', { entity_id: entityId }); }}">
                <ha-icon icon="mdi:arrow-down" style="--mdc-icon-size:17px"></ha-icon>
                <span>Schließen</span>
              </button>
            </div>
          ` : ''}
        </div>
      </ha-card>`;
  }

  private renderLightCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entityId = config.light_entity || config.entity || this._buildEntityId('light', 'light');
    const entity = this.hass.states[entityId];
    if (!entity) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Licht nicht gefunden</span><span class="error-entity">${entityId}</span></div></div></ha-card>`;
    }

    const state = entity.state;
    const isOn = state === 'on';
    const name = config.name || entity.attributes.friendly_name || 'Pool Licht';
    const brightness: number = Number(entity.attributes.brightness ?? 128);
    const brightnessPercent = Math.round((brightness / 255) * 100);
    const rgb: [number, number, number] | null = (entity.attributes.rgb_color as [number, number, number]) ?? null;
    const rgbStr = rgb ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : null;
    const accentColor = rgbStr || config.accent_color || this._getAccentColor('light', config);
    const colorTemp = entity.attributes.color_temp;
    const effect = entity.attributes.effect;

    return html`
      <ha-card class="${this._getCardClasses(isOn, config)}"
               style="--card-accent: ${accentColor}"
               @click="${() => this._showMoreInfo(entityId)}">
        <div class="accent-bar" style="${isOn && rgb ? `background:${rgbStr};opacity:1` : ''}"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isOn ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">
              ${config.icon
                ? html`<ha-icon icon="${config.icon}"></ha-icon>`
                : lightSVG(isOn, rgb, brightness, accentColor)}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="${isOn ? `color:${accentColor}` : ''}">
                ${isOn ? (effect ? effect : brightnessPercent + '%') : 'Aus'}
              </span>
            </div>
            ${config.show_state !== false ? html`<vpc-status-badge .state="${state}" .pulse="${isOn}"></vpc-status-badge>` : ''}
          </div>

          ${isOn ? html`
            <!-- Current Color Display -->
            <div style="margin-bottom: 12px; padding: 10px; background: var(--vpc-surface); border-radius: 10px; text-align: center;">
              <div style="font-size: 11px; font-weight: 600; color: var(--vpc-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                Aktuelle Farbe
              </div>
              <div style="font-size: 14px; font-weight: 600; color: var(--vpc-text); display: flex; align-items: center; justify-content: center; gap: 8px;">
                ${rgb ? html`<div style="width: 24px; height: 24px; border-radius: 50%; background: rgb(${rgb[0]},${rgb[1]},${rgb[2]}); border: 2px solid var(--vpc-text-secondary);"></div>` : ''}
                <span>${this._getRgbColorName(rgb)}</span>
              </div>
            </div>

            <!-- Color Circle Picker -->
            <div style="margin-bottom: 12px;">
              <div style="font-size: 11px; font-weight: 600; color: var(--vpc-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                Farbe wählen
              </div>
              <div style="position: relative; width: 100%; padding-bottom: 100%; border-radius: 50%; overflow: hidden; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
                   @click="${(e: MouseEvent) => {
                     e.stopPropagation();
                     const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                     const x = e.clientX - rect.left;
                     const y = e.clientY - rect.top;
                     const centerX = rect.width / 2;
                     const centerY = rect.height / 2;
                     const dx = x - centerX;
                     const dy = y - centerY;
                     const distance = Math.sqrt(dx * dx + dy * dy);
                     const maxDistance = rect.width / 2;

                     if (distance <= maxDistance) {
                       let angle = Math.atan2(dy, dx) * (180 / Math.PI);
                       angle = (angle + 360) % 360;
                       const rgb = this._hsvToRgb(angle / 360, 1, 1);
                       this.hass.callService('light', 'turn_on', { entity_id: entityId, rgb_color: rgb });
                     }
                   }}">
                <svg viewBox="0 0 200 200" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="hue-gradient-${entityId}" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color:rgb(255,0,0)"/>
                      <stop offset="17%" style="stop-color:rgb(255,255,0)"/>
                      <stop offset="33%" style="stop-color:rgb(0,255,0)"/>
                      <stop offset="50%" style="stop-color:rgb(0,255,255)"/>
                      <stop offset="67%" style="stop-color:rgb(0,0,255)"/>
                      <stop offset="83%" style="stop-color:rgb(255,0,255)"/>
                      <stop offset="100%" style="stop-color:rgb(255,0,0)"/>
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="98" fill="url(#hue-gradient-${entityId})"/>
                  <circle cx="100" cy="100" r="60" fill="white" fill-opacity="0.95"/>
                  ${rgb ? html`
                    <circle cx="100" cy="100" r="40" fill="rgb(${rgb[0]},${rgb[1]},${rgb[2]})" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));"/>
                  ` : html`
                    <circle cx="100" cy="100" r="40" fill="#ccc" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));"/>
                  `}
                  ${!rgb ? html`
                    <text x="100" y="105" text-anchor="middle" font-size="12" fill="rgba(0,0,0,0.4)" font-weight="600">Klicken</text>
                  ` : ''}
                </svg>
              </div>
            </div>

            <!-- Quick color presets -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 12px;">
              ${[
                { label: 'Rot', rgb: [255, 0, 0], icon: '🔴' },
                { label: 'Grün', rgb: [0, 255, 0], icon: '🟢' },
                { label: 'Blau', rgb: [0, 0, 255], icon: '🔵' },
                { label: 'Gelb', rgb: [255, 255, 0], icon: '🟡' },
                { label: 'Cyan', rgb: [0, 255, 255], icon: '🔷' },
                { label: 'Magenta', rgb: [255, 0, 255], icon: '🟣' },
                { label: 'Orange', rgb: [255, 165, 0], icon: '🟠' },
                { label: 'Weiß', rgb: [255, 255, 255], icon: '⚪' },
              ].map(preset => html`
                <button style="padding: 6px; border: 2px solid ${rgb && rgb[0] === preset.rgb[0] && rgb[1] === preset.rgb[1] && rgb[2] === preset.rgb[2] ? accentColor : 'transparent'}; border-radius: 8px; background: rgb(${preset.rgb[0]}, ${preset.rgb[1]}, ${preset.rgb[2]}); color: white; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 10px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);"
                        @click="${(e: Event) => { e.stopPropagation(); this.hass.callService('light', 'turn_on', { entity_id: entityId, rgb_color: preset.rgb }); }}"
                        @mouseover="${(e: Event) => (e.target as HTMLElement).style.transform = 'scale(1.05)'}"
                        @mouseout="${(e: Event) => (e.target as HTMLElement).style.transform = 'scale(1)'}">
                  ${preset.icon}
                </button>
              `)}
            </div>

            <!-- Color temperature slider (if supported) -->
            ${colorTemp ? html`
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
                <div style="padding: 10px; background: var(--vpc-surface); border-radius: 10px;">
                  <div style="font-size: 11px; font-weight: 600; color: var(--vpc-text); margin-bottom: 6px;">Farbtemperatur</div>
                  <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                    <div style="width: 25px; text-align: center; font-size: 10px; color: var(--vpc-text-secondary);">🔵<br/>6500K</div>
                    <input type="range" min="154" max="500" value="${colorTemp || 250}" style="flex: 1; height: 6px; cursor: pointer;"
                           @change="${(e: Event) => {
                             const mirek = parseInt((e.target as HTMLInputElement).value);
                             this.hass.callService('light', 'turn_on', { entity_id: entityId, color_temp: mirek });
                           }}"/>
                    <div style="width: 25px; text-align: center; font-size: 10px; color: var(--vpc-text-secondary);">🟠<br/>2000K</div>
                  </div>
                  <div style="margin-top: 6px; padding: 6px; background: linear-gradient(90deg, #FFA500 0%, #FFD700 50%, #87CEEB 100%); border-radius: 4px; height: 16px;"></div>
                </div>
              </div>
            ` : ''}

            <!-- Brightness -->
            <div class="info-row">
              <ha-icon icon="mdi:brightness-6" style="--mdc-icon-size:17px"></ha-icon>
              <span class="info-label">Helligkeit</span>
              <span class="info-value">${brightnessPercent}%</span>
            </div>
            <div class="cover-pos-bar">
              <div class="cover-pos-fill" style="width:${brightnessPercent}%;background:${accentColor}"></div>
            </div>

            ${config.show_controls !== false ? html`
              <div class="light-brightness-row">
                <vpc-slider-control
                  label="Helligkeit"
                  min="1" max="100" step="5"
                  .value="${brightnessPercent}" unit="%"
                  @value-changed="${(e: CustomEvent) => {
                    e.stopPropagation();
                    this.hass.callService('light', 'turn_on', { entity_id: entityId, brightness_pct: e.detail.value });
                  }}"
                ></vpc-slider-control>
              </div>

              <!-- DMX Scene Control -->
              <div style="margin-top: 12px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
                <button style="padding: 8px; border: none; border-radius: 8px; background: var(--vpc-surface); color: var(--vpc-text); font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
                        @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).controlDmxScenes('all_on'); }}">
                  <ha-icon icon="mdi:lightbulb-on" style="--mdc-icon-size:14px"></ha-icon> All ON
                </button>
                <button style="padding: 8px; border: none; border-radius: 8px; background: var(--vpc-surface); color: var(--vpc-text); font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
                        @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).controlDmxScenes('all_off'); }}">
                  <ha-icon icon="mdi:lightbulb-off" style="--mdc-icon-size:14px"></ha-icon> All OFF
                </button>
                <button style="padding: 8px; border: none; border-radius: 8px; background: var(--vpc-surface); color: var(--vpc-text); font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
                        @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).controlDmxScenes('sequence', 2); }}">
                  <ha-icon icon="mdi:play-speed" style="--mdc-icon-size:14px"></ha-icon> Sequence
                </button>
                <button style="padding: 8px; border: none; border-radius: 8px; background: #FF6B9D; color: white; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
                        @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).controlDmxScenes('party_mode'); }}">
                  <ha-icon icon="mdi:party-popper" style="--mdc-icon-size:14px"></ha-icon> Party! 🎉
                </button>
              </div>
            ` : ''}
          ` : ''}

          ${config.show_controls !== false ? html`
            <div class="cover-controls">
              <button class="cover-btn cover-btn-open ${isOn ? 'cvr-active' : ''}"
                      style="--cvr-btn-color:${accentColor}"
                      @click="${(e: Event) => { e.stopPropagation(); this.hass.callService('light', 'turn_on', { entity_id: entityId }); }}">
                <ha-icon icon="mdi:lightbulb-on" style="--mdc-icon-size:17px"></ha-icon>
                <span>An</span>
              </button>
              <button class="cover-btn cover-btn-close ${!isOn ? 'cvr-active' : ''}"
                      @click="${(e: Event) => { e.stopPropagation(); this.hass.callService('light', 'turn_off', { entity_id: entityId }); }}">
                <ha-icon icon="mdi:lightbulb-off" style="--mdc-icon-size:17px"></ha-icon>
                <span>Aus</span>
              </button>
            </div>
          ` : ''}
        </div>
      </ha-card>`;
  }

  private renderFilterCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const pressureEntityId = (config as any).filter_pressure_entity || config.entity || this._buildEntityId('sensor', 'filter_pressure');
    const backwashEntityId = (config as any).backwash_entity;

    const pressureEntity = this.hass.states[pressureEntityId];
    if (!pressureEntity) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Filter nicht gefunden</span><span class="error-entity">${pressureEntityId}</span></div></div></ha-card>`;
    }

    const pressure: number = parseFloat(pressureEntity.state) || 0;
    const name = config.name || pressureEntity.attributes.friendly_name || 'Filterdruck';
    const accentColor = this._getAccentColor('filter', config);

    const backwashEntity = backwashEntityId ? this.hass.states[backwashEntityId] : undefined;
    const isBackwashing = backwashEntity ? backwashEntity.state === 'on' : false;

    // Pressure zones: 0-0.5 low, 0.5-1.2 normal, 1.2-1.6 elevated, >1.6 critical
    const pressureColor = pressure < 0.5 ? 'var(--vpc-text-secondary)'
      : pressure < 1.2 ? 'var(--vpc-success,#34C759)'
      : pressure < 1.6 ? 'var(--vpc-warning,#FF9F0A)'
      : 'var(--vpc-danger,#FF3B30)';
    const pressureLabel = pressure < 0.5 ? 'Niedrig'
      : pressure < 1.2 ? 'Normal'
      : pressure < 1.6 ? 'Erhöht – bald rückspülen'
      : 'Kritisch – sofort rückspülen!';


    return html`
      <ha-card class="${this._getCardClasses(false, config)}"
               style="--card-accent: ${accentColor}"
               @click="${() => this._showMoreInfo(pressureEntityId)}">
        <div class="accent-bar"></div>
        <div class="card-content" style="padding: 12px;">
          <div class="header" style="margin-bottom: 8px;">
            <div class="header-icon" style="--icon-accent: ${accentColor}">
              ${config.icon
                ? html`<ha-icon icon="${config.icon}"></ha-icon>`
                : html`<ha-icon icon="${isBackwashing ? 'mdi:rotate-right' : 'mdi:gauge'}" class="${isBackwashing ? 'pump-running' : ''}"></ha-icon>`}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="${isBackwashing ? 'color:var(--vpc-warning,#FF9F0A)' : ''}">
                ${isBackwashing ? 'Rückspülung läuft…' : pressureLabel}
              </span>
            </div>
          </div>

          <!-- Pressure gauge with animated needle -->
          <div class="filter-gauge-wrap" style="padding: 4px 0;">
            ${filterGaugeSVG(pressure, 3)}
          </div>

          <!-- Detailed status row -->
          <div class="info-row ${pressure >= 1.6 ? 'info-row-warning' : ''}" style="margin-top: 8px;">
            <ha-icon icon="mdi:gauge" style="--mdc-icon-size:16px;color:${pressureColor}"></ha-icon>
            <span class="info-label" style="font-size: 12px;">Status</span>
            <span class="info-value" style="color:${pressureColor};font-size: 13px;">${pressureLabel}</span>
          </div>

          ${config.show_controls !== false && backwashEntity ? html`
            <div class="cover-controls" style="margin-top: 8px;">
              <button class="cover-btn ${isBackwashing ? 'cover-btn-close cvr-active' : 'cover-btn-open'}"
                      style="--cvr-btn-color:${accentColor}"
                      @click="${(e: Event) => { e.stopPropagation(); this.hass.callService('switch', isBackwashing ? 'turn_off' : 'turn_on', { entity_id: backwashEntityId }); }}">
                <ha-icon icon="${isBackwashing ? 'mdi:stop' : 'mdi:rotate-right'}" style="--mdc-icon-size:16px"></ha-icon>
                <span style="font-size: 12px;">${isBackwashing ? 'Stoppen' : 'Rückspülen'}</span>
              </button>
            </div>
          ` : ''}
        </div>
      </ha-card>`;
  }

  /**
   * Render Backwash Card - shows backwash status and controls
   */
  private renderBackwashCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entityId = (config as any).backwash_entity || config.entity || this._buildEntityId('switch', 'backwash');
    const entity = this.hass.states[entityId];
    if (!entity) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Rückspülung nicht gefunden</span><span class="error-entity">${entityId}</span></div></div></ha-card>`;
    }

    const state = entity.state;
    const isRunning = state === 'on';
    const name = config.name || entity.attributes.friendly_name || 'Rückspülung';
    const accentColor = this._getAccentColor('backwash', config);

    // Get optional duration info
    const duration = Number(entity.attributes?.duration || 0); // in minutes
    const remaining = Number(entity.attributes?.remaining || 0); // in minutes

    return html`
      <ha-card class="${this._getCardClasses(isRunning, config)}"
               style="--card-accent: ${accentColor}"
               @click="${() => this._showMoreInfo(entityId)}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isRunning ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">
              ${config.icon
                ? html`<ha-icon icon="${config.icon}" class="${isRunning ? 'pump-running' : ''}"></ha-icon>`
                : backwashSVG(isRunning, accentColor)}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="${isRunning ? 'color:var(--vpc-warning,#FF9F0A)' : ''}">
                ${isRunning ? 'Rückspülung läuft…' : 'Bereit'}
              </span>
            </div>
            ${config.show_state !== false ? html`<vpc-status-badge .state="${isRunning ? 'on' : 'off'}" .pulse="${isRunning}"></vpc-status-badge>` : ''}
          </div>

          ${isRunning ? html`
            <!-- Progress indicator -->
            <div style="margin: 12px 0; padding: 12px; background: var(--vpc-surface); border-radius: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 600; color: var(--vpc-text);">Fortschritt</span>
                <span style="font-size: 12px; color: var(--vpc-text-secondary);">
                  ${remaining > 0 ? `${remaining} min verbleibend` : 'Läuft…'}
                </span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--vpc-bg); border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; background: ${accentColor}; width: ${duration > 0 ? ((duration - remaining) / duration * 100) : 0}%; transition: width 1s linear;"></div>
              </div>
            </div>
          ` : ''}

          <!-- Backwash info -->
          <div class="info-row tooltip-wrap" style="margin-top: 8px;">
            <ha-icon icon="mdi:information-outline" style="--mdc-icon-size:17px"></ha-icon>
            <span class="info-label">Status</span>
            <span class="info-value">${isRunning ? 'Aktiv' : 'Inaktiv'}</span>
            <div class="t-tip">
              <div class="t-tip-title">Rückspülung</div>
              <div class="t-tip-desc">Automatische Rückspülung reinigt den Filter durch umgekehrten Wasserfluss. Dauer: ${duration} min.</div>
            </div>
          </div>

          ${config.show_controls !== false ? html`
            <div class="cover-controls" style="margin-top: 12px;">
              <button class="cover-btn ${isRunning ? 'cover-btn-close cvr-active' : 'cover-btn-open'}"
                      style="--cvr-btn-color: ${isRunning ? '#FF3B30' : accentColor}"
                      @click="${(e: Event) => {
                        e.stopPropagation();
                        this.hass.callService('switch', isRunning ? 'turn_off' : 'turn_on', { entity_id: entityId });
                      }}">
                <ha-icon icon="${isRunning ? 'mdi:stop' : 'mdi:play'}" style="--mdc-icon-size:17px"></ha-icon>
                <span>${isRunning ? 'Stoppen' : 'Starten'}</span>
              </button>
            </div>
          ` : ''}
        </div>
      </ha-card>`;
  }

  /**
   * Render Refill Card - shows water level and refill status
   */
  private renderRefillCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const levelSensorId = (config as any).water_level_entity || config.entity || this._buildEntityId('sensor', 'water_level');
    const valveEntityId = (config as any).refill_valve_entity;

    const levelSensor = this.hass.states[levelSensorId];
    if (!levelSensor) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Wassersensor nicht gefunden</span><span class="error-entity">${levelSensorId}</span></div></div></ha-card>`;
    }

    const level = parseFloat(levelSensor.state) || 0;
    const maxLevel = (config as any).max_level || 100;
    const name = config.name || levelSensor.attributes.friendly_name || 'Wasserstand';
    const accentColor = this._getAccentColor('refill', config);

    const valveEntity = valveEntityId ? this.hass.states[valveEntityId] : undefined;
    const isRefilling = valveEntity ? valveEntity.state === 'on' : false;
    const isLow = level < (maxLevel * 0.3);

    const percent = Math.min((level / maxLevel) * 100, 100);
    const levelColor = isLow ? 'var(--vpc-danger,#FF3B30)' : level < maxLevel * 0.7 ? 'var(--vpc-warning,#FF9F0A)' : 'var(--vpc-success,#34C759)';
    const levelLabel = isLow ? 'Niedrig' : level < maxLevel * 0.7 ? 'Normal' : 'Voll';

    return html`
      <ha-card class="${this._getCardClasses(!isLow, config)}"
               style="--card-accent: ${isLow ? '#FF3B30' : accentColor}"
               @click="${() => this._showMoreInfo(levelSensorId)}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon" style="--icon-accent: ${isLow ? '#FF3B30' : accentColor}">
              ${config.icon
                ? html`<ha-icon icon="${config.icon}" class="${isRefilling ? 'pump-running' : ''}"></ha-icon>`
                : refillSVG(level, maxLevel, isLow ? '#FF3B30' : accentColor)}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="color:${levelColor}">
                ${isRefilling ? 'Wird nachgefüllt…' : levelLabel}
              </span>
            </div>
            ${config.show_state !== false ? html`
              <div style="text-align: right;">
                <span style="font-size: 18px; font-weight: bold; color: ${levelColor};">${percent.toFixed(0)}%</span>
              </div>
            ` : ''}
          </div>

          <!-- Level visualization -->
          <div style="margin: 12px 0; padding: 12px; background: var(--vpc-surface); border-radius: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 12px; font-weight: 600; color: var(--vpc-text);">Füllstand</span>
              <span style="font-size: 12px; color: var(--vpc-text-secondary);">${level.toFixed(1)} / ${maxLevel}</span>
            </div>
            <div style="width: 100%; height: 24px; background: var(--vpc-bg); border-radius: 12px; overflow: hidden; position: relative;">
              <div style="height: 100%; background: linear-gradient(90deg, ${levelColor} 0%, ${levelColor}dd 100%); width: ${percent}%; transition: width 0.5s ease; position: relative;">
                ${isRefilling ? html`
                  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px); animation: shimmer 2s linear infinite;"></div>
                ` : ''}
              </div>
              <!-- Percentage text on bar -->
              <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 11px; font-weight: bold; color: ${percent > 50 ? 'white' : 'var(--vpc-text)'}; text-shadow: 0 0 2px rgba(0,0,0,0.3);">${percent.toFixed(0)}%</span>
            </div>
          </div>

          <!-- Info rows -->
          <div class="info-row tooltip-wrap" style="margin-top: 8px;">
            <ha-icon icon="mdi:water" style="--mdc-icon-size:17px;color:${levelColor}"></ha-icon>
            <span class="info-label">Pegel</span>
            <span class="info-value" style="color:${levelColor}">${levelLabel}</span>
            <div class="t-tip">
              <div class="t-tip-title">Wasserstand</div>
              <div class="t-tip-desc">Aktueller Füllstand des Pools. Unter 30% sollte nachgefüllt werden.</div>
              <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>${(maxLevel * 0.7).toFixed(0)} - ${maxLevel} Optimal</div>
            </div>
          </div>

          ${valveEntity && config.show_controls !== false ? html`
            <div class="cover-controls" style="margin-top: 12px;">
              <button class="cover-btn ${isRefilling ? 'cover-btn-close cvr-active' : 'cover-btn-open'}"
                      style="--cvr-btn-color: ${isRefilling ? '#34C759' : accentColor}"
                      @click="${(e: Event) => {
                        e.stopPropagation();
                        this.hass.callService('switch', isRefilling ? 'turn_off' : 'turn_on', { entity_id: valveEntityId });
                      }}">
                <ha-icon icon="${isRefilling ? 'mdi:stop' : 'mdi:water-plus'}" style="--mdc-icon-size:17px"></ha-icon>
                <span>${isRefilling ? 'Stoppen' : 'Nachfüllen'}</span>
              </button>
            </div>
          ` : ''}
        </div>
      </ha-card>`;
  }

  /**
   * Render PV Surplus Card - shows solar energy surplus and export status
   */
  private renderSolarSurplusCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const powerSensorId = (config as any).solar_power_entity || config.entity || this._buildEntityId('sensor', 'solar_power');
    const exportEntityId = (config as any).export_entity;

    const powerSensor = this.hass.states[powerSensorId];
    if (!powerSensor) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">PV-Sensor nicht gefunden</span><span class="error-entity">${powerSensorId}</span></div></div></ha-card>`;
    }

    const power = parseFloat(powerSensor.state) || 0;
    const threshold = (config as any).surplus_threshold || 0;
    const name = config.name || powerSensor.attributes.friendly_name || 'PV Überschuss';
    const accentColor = this._getAccentColor('solar', config);

    const exportEntity = exportEntityId ? this.hass.states[exportEntityId] : undefined;
    const isExporting = exportEntity ? exportEntity.state === 'on' : false;

    const hasSurplus = power > threshold;
    const surplusColor = isExporting ? '#4CAF50' : hasSurplus ? '#FF9F0A' : 'var(--vpc-text-secondary)';

    return html`
      <ha-card class="${this._getCardClasses(hasSurplus || isExporting, config)}"
               style="--card-accent: ${isExporting ? '#4CAF50' : hasSurplus ? accentColor : 'var(--vpc-text-secondary)'}"
               @click="${() => this._showMoreInfo(powerSensorId)}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${hasSurplus || isExporting ? 'icon-active' : ''}" style="--icon-accent: ${surplusColor}">
              ${config.icon
                ? html`<ha-icon icon="${config.icon}" class="${hasSurplus || isExporting ? 'pump-running' : ''}"></ha-icon>`
                : solarSurplusSVG(hasSurplus, isExporting, surplusColor)}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="color:${surplusColor}">
                ${isExporting ? 'Einspeisung' : hasSurplus ? 'Überschuss' : 'Kein Überschuss'}
              </span>
            </div>
            ${config.show_state !== false ? html`
              <div style="text-align: right;">
                <span style="font-size: 18px; font-weight: bold; color: ${surplusColor};">${power.toFixed(0)} W</span>
              </div>
            ` : ''}
          </div>

          <!-- Power visualization -->
          <div style="margin: 12px 0; padding: 12px; background: var(--vpc-surface); border-radius: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 12px; font-weight: 600; color: var(--vpc-text);">Leistung</span>
              <span style="font-size: 12px; color: var(--vpc-text-secondary);">Schwellwert: ${threshold} W</span>
            </div>
            <div style="width: 100%; height: 24px; background: var(--vpc-bg); border-radius: 12px; overflow: hidden; position: relative;">
              <div style="height: 100%; background: linear-gradient(90deg, var(--vpc-text-secondary) 0%, ${surplusColor} 100%); width: ${Math.min(power / (threshold * 2) * 100, 100)}%; transition: width 0.5s ease;"></div>
              <!-- Threshold marker -->
              <div style="position: absolute; top: 0; bottom: 0; left: ${threshold > 0 ? Math.min(threshold / (threshold * 2) * 100, 100) : 0}%; width: 2px; background: rgba(0,0,0,0.5);"></div>
            </div>
            ${power > threshold ? html`
              <div style="margin-top: 6px; font-size: 11px; color: ${surplusColor}; font-weight: 600;">
                <ha-icon icon="mdi:sun-wireless" style="--mdc-icon-size:12px"></ha-icon>
                Überschuss: ${(power - threshold).toFixed(0)} W
              </div>
            ` : ''}
          </div>

          <!-- Info rows -->
          <div class="info-row tooltip-wrap" style="margin-top: 8px;">
            <ha-icon icon="mdi:solar-power" style="--mdc-icon-size:17px;color:${surplusColor}"></ha-icon>
            <span class="info-label">Status</span>
            <span class="info-value" style="color:${surplusColor}">${isExporting ? 'Einspeisung aktiv' : hasSurplus ? 'Überschuss verfügbar' : 'Netzbezug'}</span>
            <div class="t-tip">
              <div class="t-tip-title">PV Überschuss</div>
              <div class="t-tip-desc">Solarerzeugung über dem Schwellwert. Überschüssige Energie kann in das Netz eingespeist oder für Poolheizung genutzt werden.</div>
              ${isExporting ? html`<div class="t-tip-ideal"><ha-icon icon="mdi:export"></ha-icon>Einspeisung ins Netz aktiv</div>` : ''}
            </div>
          </div>

          ${config.show_controls !== false && exportEntity ? html`
            <div class="cover-controls" style="margin-top: 12px;">
              <button class="cover-btn ${isExporting ? 'cvr-active' : ''}"
                      style="--cvr-btn-color: ${isExporting ? '#4CAF50' : accentColor}"
                      @click="${(e: Event) => {
                        e.stopPropagation();
                        this.hass.callService('switch', isExporting ? 'turn_off' : 'turn_on', { entity_id: exportEntityId });
                      }}">
                <ha-icon icon="${isExporting ? 'mdi:export' : 'mdi:import'}" style="--mdc-icon-size:17px"></ha-icon>
                <span>${isExporting ? 'Stoppen' : 'Einspeisen'}</span>
              </button>
            </div>
          ` : ''}
        </div>
      </ha-card>`;
  }

  /**
   * Render Flow Rate Card - displays water flow rate with animation
   */
  private renderFlowRateCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entityId = config.entity || this._buildEntityId('sensor', 'flow_rate');
    const entity = this.hass.states[entityId];
    if (!entity) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Durchfluss-Sensor nicht gefunden</span><span class="error-entity">${entityId}</span></div></div></ha-card>`;
    }

    const flow = parseFloat(entity.state) || 0;
    const maxFlow = (config as any).max_flow || 10;
    const name = config.name || entity.attributes.friendly_name || 'Durchfluss';
    const accentColor = this._getAccentColor('flow_rate', config);

    const flowPercent = Math.min((flow / maxFlow) * 100, 100);
    const isFlowing = flow > 0;
    const flowColor = isFlowing ? accentColor : 'var(--vpc-text-secondary)';

    return html`
      <ha-card class="${this._getCardClasses(isFlowing, config)}"
               style="--card-accent: ${flowColor}"
               @click="${() => this._showMoreInfo(entityId)}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isFlowing ? 'icon-active' : ''}" style="--icon-accent: ${flowColor}">
              ${config.icon
                ? html`<ha-icon icon="${config.icon}" class="${isFlowing ? 'pump-running' : ''}"></ha-icon>`
                : flowRateSVG(flow, maxFlow, flowColor)}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="color:${flowColor}">
                ${isFlowing ? 'Fließt' : 'Kein Durchfluss'}
              </span>
            </div>
            ${config.show_state !== false ? html`
              <div style="text-align: right;">
                <span style="font-size: 18px; font-weight: bold; color: ${flowColor};">${flow.toFixed(1)} m³/h</span>
              </div>
            ` : ''}
          </div>

          <!-- Flow rate visualization -->
          <div style="margin: 12px 0; padding: 12px; background: var(--vpc-surface); border-radius: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 12px; font-weight: 600; color: var(--vpc-text);">Durchfluss</span>
              <span style="font-size: 12px; color: var(--vpc-text-secondary);">Max: ${maxFlow} m³/h</span>
            </div>
            <div style="width: 100%; height: 24px; background: var(--vpc-bg); border-radius: 12px; overflow: hidden; position: relative;">
              <div style="height: 100%; background: linear-gradient(90deg, var(--vpc-text-secondary) 0%, ${flowColor} 100%); width: ${flowPercent}%; transition: width 0.5s ease;"></div>
            </div>
            <div style="margin-top: 6px; font-size: 11px; color: ${flowColor}; font-weight: 600;">
              <ha-icon icon="mdi:water" style="--mdc-icon-size:12px"></ha-icon>
              ${flowPercent.toFixed(0)}% von Maximaldurchfluss
            </div>
          </div>

          <!-- Info rows -->
          <div class="info-row tooltip-wrap" style="margin-top: 8px;">
            <ha-icon icon="mdi:speedometer" style="--mdc-icon-size:17px;color:${flowColor}"></ha-icon>
            <span class="info-label">Status</span>
            <span class="info-value" style="color:${flowColor}">${isFlowing ? 'Aktiv' : 'Inaktiv'}</span>
            <div class="t-tip">
              <div class="t-tip-title">Durchflussrate</div>
              <div class="t-tip-desc">Aktuelle Wasserdurchflussmenge pro Stunde. Ein ausreichender Durchfluss ist wichtig für die Filtration und den Betrieb der Zusatzgeräte.</div>
              ${flow < maxFlow * 0.3 ? html`<div class="t-tip-warn"><ha-icon icon="mdi:alert"></ha-icon>Niedriger Durchfluss</div>` : ''}
            </div>
          </div>
        </div>
      </ha-card>`;
  }

  /**
   * Render Inlet Card - displays pool inlet/jet status with animation
   */
  private renderInletCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entityId = config.entity || this._buildEntityId('switch', 'inlet');
    const entity = this.hass.states[entityId];
    if (!entity) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Anströmung nicht gefunden</span><span class="error-entity">${entityId}</span></div></div></ha-card>`;
    }

    const state = entity.state;
    const isInflowing = state === 'on' || state === 'active';
    const name = config.name || entity.attributes.friendly_name || 'Anströmung';
    const accentColor = this._getAccentColor('inlet', config);

    const inflowColor = isInflowing ? accentColor : 'var(--vpc-text-secondary)';

    // Check for flow rate sensor
    const flowSensorId = (config as any).flow_rate_entity || this._buildEntityId('sensor', 'inlet_flow');
    const flowSensor = this.hass.states[flowSensorId];
    const flow = flowSensor ? parseFloat(flowSensor.state) || 0 : undefined;

    return html`
      <ha-card class="${this._getCardClasses(isInflowing, config)}"
               style="--card-accent: ${inflowColor}"
               @click="${() => this._showMoreInfo(entityId)}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isInflowing ? 'icon-active' : ''}" style="--icon-accent: ${inflowColor}">
              ${config.icon
                ? html`<ha-icon icon="${config.icon}" class="${isInflowing ? 'pump-running' : ''}"></ha-icon>`
                : inletSVG(isInflowing, inflowColor)}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="color:${inflowColor}">
                ${isInflowing ? 'Aktiv' : 'Inaktiv'}
              </span>
            </div>
            ${config.show_state !== false ? html`
              <div style="text-align: right;">
                ${flow !== undefined ? html`<span style="font-size: 18px; font-weight: bold; color: ${inflowColor};">${flow.toFixed(1)} m³/h</span>` : ''}
              </div>
            ` : ''}
          </div>

          <!-- Info rows -->
          <div class="info-row tooltip-wrap" style="margin-top: 8px;">
            <ha-icon icon="mdi:arrow-right-bold" style="--mdc-icon-size:17px;color:${inflowColor}"></ha-icon>
            <span class="info-label">Status</span>
            <span class="info-value" style="color:${inflowColor}">${isInflowing ? 'Einströmung aktiv' : 'Ausgeschaltet'}</span>
            <div class="t-tip">
              <div class="t-tip-title">Anströmung</div>
              <div class="t-tip-desc">Wassereinlass in den Pool. Die Anströmung sorgt für Wasserbewegung und Durchmischung des Poolwassers.</div>
              ${isInflowing ? html`<div class="t-tip-ideal"><ha-icon icon="mdi:check-circle"></ha-icon>Wasserzirkulation aktiv</div>` : ''}
            </div>
          </div>

          ${flow !== undefined ? html`
            <div class="info-row tooltip-wrap" style="margin-top: 8px;">
              <ha-icon icon="mdi:speedometer" style="--mdc-icon-size:17px"></ha-icon>
              <span class="info-label">Durchfluss</span>
              <span class="info-value">${flow.toFixed(1)} m³/h</span>
              <div class="t-tip">
                <div class="t-tip-title">Einström-Durchfluss</div>
                <div class="t-tip-desc">Aktuelle Durchflussrate der Anströmung.</div>
              </div>
            </div>
          ` : ''}

          ${config.show_controls !== false ? html`
            <div class="cover-controls" style="margin-top: 12px;">
              <button class="cover-btn ${isInflowing ? 'cvr-active' : ''}"
                      style="--cvr-btn-color: ${isInflowing ? inflowColor : accentColor}"
                      @click="${(e: Event) => {
                        e.stopPropagation();
                        this.hass.callService('switch', isInflowing ? 'turn_off' : 'turn_on', { entity_id: entityId });
                      }}">
                <ha-icon icon="${isInflowing ? 'mdi:stop' : 'mdi:play'}" style="--mdc-icon-size:17px"></ha-icon>
                <span>${isInflowing ? 'Stoppen' : 'Starten'}</span>
              </button>
            </div>
          ` : ''}
        </div>
      </ha-card>`;
  }

  /**
   * Render Counter Current Card - displays counter current system with animation
   */
  private renderCounterCurrentCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entityId = config.entity || this._buildEntityId('switch', 'counter_current');
    const entity = this.hass.states[entityId];
    if (!entity) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Gegenstromanlage nicht gefunden</span><span class="error-entity">${entityId}</span></div></div></ha-card>`;
    }

    const state = entity.state;
    const isActive = state === 'on' || state === 'active';
    const name = config.name || entity.attributes.friendly_name || 'Gegenstromanlage';
    const accentColor = this._getAccentColor('counter_current', config);

    const activeColor = isActive ? accentColor : 'var(--vpc-text-secondary)';

    // Check for speed/power level
    const speedLevel = entity.attributes?.speed_level as number | undefined || entity.attributes?.power_level as number | undefined;
    const speedPercent = speedLevel !== undefined ? (speedLevel / 10) * 100 : undefined;

    return html`
      <ha-card class="${this._getCardClasses(isActive, config)}"
               style="--card-accent: ${activeColor}"
               @click="${() => this._showMoreInfo(entityId)}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isActive ? 'icon-active' : ''}" style="--icon-accent: ${activeColor}">
              ${config.icon
                ? html`<ha-icon icon="${config.icon}" class="${isActive ? 'pump-running' : ''}"></ha-icon>`
                : counterCurrentSVG(isActive, activeColor)}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="color:${activeColor}">
                ${isActive ? 'Aktiv' : 'Inaktiv'}
              </span>
            </div>
            ${config.show_state !== false && speedPercent !== undefined ? html`
              <div style="text-align: right;">
                <span style="font-size: 18px; font-weight: bold; color: ${activeColor};">Stufe ${speedLevel}</span>
              </div>
            ` : ''}
          </div>

          ${speedPercent !== undefined ? html`
            <!-- Power level visualization -->
            <div style="margin: 12px 0; padding: 12px; background: var(--vpc-surface); border-radius: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 600; color: var(--vpc-text);">Leistungsstufe</span>
                <span style="font-size: 12px; color: var(--vpc-text-secondary);">Stufe ${speedLevel}/10</span>
              </div>
              <div style="width: 100%; height: 24px; background: var(--vpc-bg); border-radius: 12px; overflow: hidden; position: relative;">
                <div style="height: 100%; background: linear-gradient(90deg, var(--vpc-text-secondary) 0%, ${activeColor} 100%); width: ${speedPercent}%; transition: width 0.5s ease;"></div>
              </div>
            </div>
          ` : ''}

          <!-- Info rows -->
          <div class="info-row tooltip-wrap" style="margin-top: 8px;">
            <ha-icon icon="mdi:swap-horizontal" style="--mdc-icon-size:17px;color:${activeColor}"></ha-icon>
            <span class="info-label">Status</span>
            <span class="info-value" style="color:${activeColor}">${isActive ? 'Gegenstrom aktiv' : 'Ausgeschaltet'}</span>
            <div class="t-tip">
              <div class="t-tip-title">Gegenstromanlage</div>
              <div class="t-tip-desc">Die Gegenstromanlage erzeugt einen künstlichen Wasserstrom im Pool, der zum Schwimmen gegen die Strömung genutzt werden kann. Ideal für Fitnesstraining im eigenen Pool.</div>
              ${isActive ? html`<div class="t-tip-ideal"><ha-icon icon="mdi:swim"></ha-icon>Perfekt zum Training</div>` : ''}
            </div>
          </div>

          ${speedLevel !== undefined ? html`
            <div class="info-row tooltip-wrap" style="margin-top: 8px;">
              <ha-icon icon="mdi:speedometer" style="--mdc-icon-size:17px"></ha-icon>
              <span class="info-label">Leistung</span>
              <span class="info-value">Stufe ${speedLevel}/10</span>
              <div class="t-tip">
                <div class="t-tip-title">Leistungsstufe</div>
                <div class="t-tip-desc">Aktuelle Leistungsstufe der Gegenstromanlage. Höhere Stufen erzeugen einen stärkeren Wasserstrom.</div>
              </div>
            </div>
          ` : ''}

          ${config.show_controls !== false ? html`
            <div class="cover-controls" style="margin-top: 12px;">
              <button class="cover-btn ${isActive ? 'cvr-active' : ''}"
                      style="--cvr-btn-color: ${isActive ? activeColor : accentColor}"
                      @click="${(e: Event) => {
                        e.stopPropagation();
                        this.hass.callService('switch', isActive ? 'turn_off' : 'turn_on', { entity_id: entityId });
                      }}">
                <ha-icon icon="${isActive ? 'mdi:stop' : 'mdi:play'}" style="--mdc-icon-size:17px"></ha-icon>
                <span>${isActive ? 'Stoppen' : 'Starten'}</span>
              </button>
            </div>
          ` : ''}
        </div>
      </ha-card>`;
  }

  /**
   * Render Chlorine Canister Card - displays chlorine canister with fill level
   */
  private renderChlorineCanisterCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    return this._renderCanisterCard(
      config,
      'chlorine_canister',
      'chlorine',
      'Chlor',
      'Chlorkanister',
      'mdi:flask',
      chlorineCanisterSVG
    );
  }

  /**
   * Render pH Plus Canister Card - displays pH plus canister with fill level
   */
  private renderPhPlusCanisterCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    return this._renderCanisterCard(
      config,
      'ph_plus_canister',
      'ph_plus',
      'pH Plus',
      'pH Plus Kanister',
      'mdi:flask-plus',
      phPlusCanisterSVG
    );
  }

  /**
   * Render pH Minus Canister Card - displays pH minus canister with fill level
   */
  private renderPhMinusCanisterCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    return this._renderCanisterCard(
      config,
      'ph_minus_canister',
      'ph_minus',
      'pH Minus',
      'pH Minus Kanister',
      'mdi:flask-minus',
      phMinusCanisterSVG
    );
  }

  /**
   * Render Flocculant Canister Card - displays flocculant canister with fill level
   */
  private renderFlocculantCanisterCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    return this._renderCanisterCard(
      config,
      'flocculant_canister',
      'flocculant',
      'Flockung',
      'Flockungsmittel Kanister',
      'mdi:water-opacity',
      flocculantCanisterSVG
    );
  }

  /**
   * Generic canister card renderer
   */
  private _renderCanisterCard(
    config: VioletPoolCardConfig,
    cardType: string,
    entitySuffix: string,
    shortLabel: string,
    defaultName: string,
    defaultIcon: string,
    svgFunction: (fillLevel: number, maxLevel: number, color: string) => TemplateResult
  ): TemplateResult {
    const sensorEntityId = (config as any).level_entity || config.entity || this._buildEntityId('sensor', `${entitySuffix}_level`);
    const sensorEntity = this.hass.states[sensorEntityId];

    if (!sensorEntity) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">${defaultName} Sensor nicht gefunden</span><span class="error-entity">${sensorEntityId}</span></div></div></ha-card>`;
    }

    const currentLevel = parseFloat(sensorEntity.state) || 0;
    const maxLevel = (config as any).max_level || 5000; // Default 5000ml
    const name = config.name || sensorEntity.attributes.friendly_name || defaultName;
    const accentColor = this._getAccentColor(cardType, config);

    const fillPercent = Math.min((currentLevel / maxLevel) * 100, 100);
    const isLow = fillPercent < 20;
    const isEmpty = fillPercent < 5;
    const statusColor = isEmpty ? 'var(--vpc-danger, #FF3B30)' : isLow ? 'var(--vpc-warning, #FF9F0A)' : accentColor;
    const statusText = isEmpty ? 'Leer' : isLow ? 'Niedrig' : 'OK';

    return html`
      <ha-card class="${this._getCardClasses(!isEmpty, config)}"
               style="--card-accent: ${statusColor}"
               @click="${() => this._showMoreInfo(sensorEntityId)}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isLow ? 'icon-active' : ''}" style="--icon-accent: ${statusColor}">
              ${config.icon
                ? html`<ha-icon icon="${config.icon}" class="${isLow ? 'pump-running' : ''}"></ha-icon>`
                : svgFunction(currentLevel, maxLevel, statusColor)}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="color:${statusColor}">
                ${statusText}
              </span>
            </div>
            ${config.show_state !== false ? html`
              <div style="text-align: right;">
                <span style="font-size: 18px; font-weight: bold; color: ${statusColor};">${currentLevel.toFixed(0)} ml</span>
              </div>
            ` : ''}
          </div>

          <!-- Fill level visualization -->
          <div style="margin: 12px 0; padding: 12px; background: var(--vpc-surface); border-radius: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 12px; font-weight: 600; color: var(--vpc-text);">Füllstand</span>
              <span style="font-size: 12px; color: var(--vpc-text-secondary);">Max: ${maxLevel} ml</span>
            </div>
            <div style="width: 100%; height: 24px; background: var(--vpc-bg); border-radius: 12px; overflow: hidden; position: relative;">
              <div style="height: 100%; background: linear-gradient(90deg, ${statusColor} 0%, ${isEmpty ? '#FF3B30' : isLow ? '#FF9F0A' : accentColor} 100%); width: ${fillPercent}%; transition: width 0.5s ease;"></div>
            </div>
            <div style="margin-top: 6px; font-size: 11px; color: ${statusColor}; font-weight: 600;">
              <ha-icon icon="mdi:cup" style="--mdc-icon-size:12px"></ha-icon>
              ${fillPercent.toFixed(0)}% gefüllt
            </div>
          </div>

          <!-- Info rows -->
          <div class="info-row tooltip-wrap" style="margin-top: 8px;">
            <ha-icon icon="${defaultIcon}" style="--mdc-icon-size:17px;color:${statusColor}"></ha-icon>
            <span class="info-label">Status</span>
            <span class="info-value" style="color:${statusColor}">${isEmpty ? 'Kanister leer - bitte nachfüllen' : isLow ? 'Füllstand niedrig' : 'Füllstand ausreichend'}</span>
            <div class="t-tip">
              <div class="t-tip-title"><ha-icon icon="${defaultIcon}"></ha-icon>${shortLabel} Kanister</div>
              <div class="t-tip-desc">Aktueller Füllstand des ${shortLabel}-Kanisters in Milliliter. Bei unter 20% sollte nachbestellt werden.</div>
              ${isEmpty ? html`<div class="t-tip-warn"><ha-icon icon="mdi:alert"></ha-icon>Kanister ist leer!</div>` : isLow ? html`<div class="t-tip-warn"><ha-icon icon="mdi:alert"></ha-icon>Bitte bald nachfüllen</div>` : html`<div class="t-tip-ideal"><ha-icon icon="mdi:check-circle"></ha-icon>Füllstand im grünen Bereich</div>`}
            </div>
          </div>

          ${isLow ? html`
            <div style="margin-top: 12px; padding: 10px; background: color-mix(in srgb, ${statusColor} 10%, transparent); border: 1px solid color-mix(in srgb, ${statusColor} 20%, transparent); border-radius: 8px; font-size: 12px; color: ${statusColor};">
              <ha-icon icon="mdi:information" style="--mdc-icon-size:14px;vertical-align:middle;margin-right:4px;"></ha-icon>
              <span style="vertical-align:middle;">Noch ${currentLevel.toFixed(0)} ml verfügbar. Empfehlung: Neuen Kanister bereithalten.</span>
            </div>
          ` : ''}
        </div>
      </ha-card>`;
  }



  static get styles(): CSSResultGroup {
    return css`:host{--vpc-font:-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;--vpc-spacing:18px;--vpc-radius:20px;--vpc-inner-radius:12px;--vpc-bg:var(--ha-card-background, var(--card-background-color, #ffffff));--vpc-surface:rgba(120,120,128,0.06);--vpc-border:none;--vpc-shadow:0 2px 20px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04);--vpc-backdrop:none;--vpc-primary:var(--primary-color, #007AFF);--vpc-success:#34C759;--vpc-warning:#FF9F0A;--vpc-danger:#FF3B30;--vpc-purple:#AF52DE;--vpc-teal:#5AC8FA;--vpc-orange:#FF9500;--vpc-indigo:#5856D6;--vpc-text:var(--primary-text-color, #1C1C1E);--vpc-text-secondary:var(--secondary-text-color, #6D6D72);--vpc-text-tertiary:rgba(60,60,67,0.45);--vpc-icon-size:22px;--vpc-transition:all 0.28s cubic-bezier(0.34, 1.4, 0.64, 1);--vpc-transition-fast:all 0.18s ease;--card-accent:var(--primary-color, #007AFF);--icon-accent:var(--card-accent);display:block;font-family:var(--vpc-font);}ha-card.theme-classic{--vpc-bg:#ffffff;--vpc-shadow:0 2px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04);--vpc-radius:22px;--vpc-inner-radius:13px;--vpc-surface:rgba(120,120,128,0.06);--vpc-primary:#007AFF;}ha-card.theme-midnight{--vpc-bg:#1C1C1E;--vpc-surface:rgba(255,255,255,0.06);--vpc-border:1px solid rgba(255,255,255,0.08);--vpc-shadow:0 4px 30px rgba(0,0,0,0.4);--vpc-radius:22px;--vpc-text:#FFFFFF;--vpc-text-secondary:#8E8E93;--vpc-text-tertiary:rgba(255,255,255,0.25);--vpc-primary:#0A84FF;--vpc-success:#30D158;--vpc-warning:#FFD60A;--vpc-danger:#FF453A;}ha-card.theme-elegance, ha-card.theme-frost{--vpc-bg:rgba(255,255,255,0.72);--vpc-backdrop:blur(24px) saturate(180%);--vpc-radius:26px;--vpc-border:1px solid rgba(255,255,255,0.4);--vpc-shadow:0 8px 40px rgba(31,38,135,0.12), 0 2px 8px rgba(0,0,0,0.06);}ha-card.theme-vibrant{--vpc-radius:18px;--vpc-spacing:20px;--vpc-shadow:0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04);}ha-card.theme-pure{--vpc-radius:14px;--vpc-shadow:none;--vpc-border:1px solid rgba(0,0,0,0.07);--vpc-surface:transparent;}ha-card.theme-glow{--vpc-bg:#0D0D14;--vpc-border:1px solid rgba(0,212,255,0.2);--vpc-shadow:0 0 30px rgba(0,212,255,0.07);--vpc-radius:14px;--vpc-primary:#00D4FF;--vpc-text:#E8E8F0;--vpc-text-secondary:#6E6E80;--vpc-surface:rgba(0,212,255,0.04);--vpc-success:#00E676;--vpc-warning:#FFEA00;--vpc-danger:#FF1744;}ha-card.theme-metallic{--vpc-bg:linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(248,248,255,0.96) 100%);--vpc-radius:24px;--vpc-shadow:0 12px 50px -8px rgba(80,80,160,0.15), 0 0 0 1px rgba(255,255,255,0.9);--vpc-border:1px solid rgba(255,255,255,0.7);}ha-card.theme-ocean{--vpc-bg:#0077BE;--vpc-primary:#00A8E8;--vpc-surface:rgba(0,168,232,0.12);--vpc-text:#FFFFFF;--vpc-text-secondary:rgba(255,255,255,0.75);--vpc-shadow:0 6px 28px rgba(0,119,190,0.3);--vpc-radius:20px;}ha-card.theme-sunset{--vpc-bg:linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);--vpc-primary:#FFF8DC;--vpc-surface:rgba(255,248,220,0.18);--vpc-text:#FFFFFF;--vpc-text-secondary:rgba(255,255,255,0.8);--vpc-shadow:0 8px 32px rgba(255,107,53,0.35);--vpc-radius:22px;}ha-card.theme-forest{--vpc-bg:#228B22;--vpc-primary:#90EE90;--vpc-surface:rgba(144,238,144,0.15);--vpc-text:#FFFFFF;--vpc-text-secondary:rgba(255,255,255,0.75);--vpc-shadow:0 6px 28px rgba(34,139,34,0.35);--vpc-radius:20px;}ha-card.theme-aurora{--vpc-bg:linear-gradient(135deg, #00C9FF 0%, #92FE9D 50%, #5EE7DF 100%);--vpc-primary:#FFFFFF;--vpc-surface:rgba(255,255,255,0.16);--vpc-text:#FFFFFF;--vpc-text-secondary:rgba(255,255,255,0.8);--vpc-shadow:0 10px 40px rgba(0,201,255,0.25);--vpc-radius:24px;}@media (prefers-color-scheme:dark){ha-card.theme-classic{--vpc-bg:#1C1C1E;--vpc-surface:rgba(255,255,255,0.06);--vpc-border:1px solid rgba(255,255,255,0.08);--vpc-text:#FFFFFF;--vpc-text-secondary:#8E8E93;--vpc-primary:#0A84FF;--vpc-success:#30D158;--vpc-warning:#FFD60A;--vpc-danger:#FF453A;}ha-card.theme-elegance, ha-card.theme-frost{--vpc-bg:rgba(18,18,30,0.80);--vpc-border:1px solid rgba(255,255,255,0.09);--vpc-shadow:0 8px 40px rgba(0,0,0,0.45);}ha-card.theme-metallic{--vpc-bg:linear-gradient(145deg, rgba(28,28,38,0.97) 0%, rgba(20,20,32,0.97) 100%);--vpc-border:1px solid rgba(255,255,255,0.07);}ha-card.theme-pure{--vpc-border:1px solid rgba(255,255,255,0.07);}ha-card.theme-vibrant{--vpc-shadow:0 1px 3px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.04);}ha-card.theme-ocean{--vpc-bg:#005A8F;--vpc-primary:#6DD5FA;--vpc-surface:rgba(109,213,250,0.10);--vpc-shadow:0 8px 32px rgba(0,90,143,0.5);}ha-card.theme-sunset{--vpc-bg:linear-gradient(135deg, #D4502D 0%, #C7761A 100%);--vpc-primary:#FFE4B5;--vpc-surface:rgba(255,228,181,0.12);--vpc-shadow:0 8px 32px rgba(212,80,45,0.5);}ha-card.theme-forest{--vpc-bg:#1A5C1A;--vpc-primary:#98FB98;--vpc-surface:rgba(152,251,152,0.10);--vpc-shadow:0 8px 32px rgba(26,92,26,0.5);}}ha-card{font-family:var(--vpc-font);padding:var(--vpc-spacing);background:var(--vpc-bg);border-radius:var(--vpc-radius);box-shadow:var(--vpc-shadow);border:var(--vpc-border);backdrop-filter:var(--vpc-backdrop);-webkit-backdrop-filter:var(--vpc-backdrop);transition:transform 0.22s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.22s ease;overflow:visible;position:relative;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;}ha-card:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.11), 0 2px 6px rgba(0,0,0,0.05);}ha-card:active{transform:scale(0.985);box-shadow:0 2px 8px rgba(0,0,0,0.07);transition:transform 0.1s ease, box-shadow 0.1s ease;}ha-card.theme-midnight:hover{box-shadow:0 8px 30px rgba(0,0,0,0.5);}ha-card.theme-glow:hover{box-shadow:0 0 40px rgba(0,212,255,0.12), 0 4px 20px rgba(0,0,0,0.3);}ha-card.theme-glow.is-active{box-shadow:0 0 50px rgba(0,212,255,0.2), inset 0 0 20px rgba(0,212,255,0.04);border-color:rgba(0,212,255,0.35);}.accent-bar{position:absolute;top:0;left:0;right:0;height:3px;background:var(--card-accent);opacity:0.65;transition:opacity 0.3s ease, height 0.3s ease;}ha-card.is-active .accent-bar{height:4px;opacity:1;}ha-card.theme-glow .accent-bar{background:linear-gradient(90deg, #00D4FF, #7C4DFF, #00D4FF);box-shadow:0 0 12px rgba(0,212,255,0.5);height:2px;animation:neon-flow 3s linear infinite;}ha-card.theme-pure .accent-bar{height:2px;opacity:0.45;}@keyframes neon-flow{0%{background-position:0% 50%;}100%{background-position:200% 50%;}}.card-content{display:flex;flex-direction:column;gap:14px;}.card-content.compact{flex-direction:row;align-items:center;gap:14px;}.header{display:flex;align-items:center;gap:14px;}.header-icon{width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 12%, transparent);transition:background 0.25s ease, box-shadow 0.25s ease;flex-shrink:0;}.header-icon.icon-active{background:color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 18%, transparent);box-shadow:0 0 0 5px color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 8%, transparent);}ha-card.theme-glow .header-icon{background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.18);}ha-card.theme-glow .header-icon.icon-active{box-shadow:0 0 16px rgba(0,212,255,0.25);}.header-icon ha-icon{--mdc-icon-size:24px;color:var(--icon-accent, var(--vpc-primary));}.header-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}.name{font-family:var(--vpc-font);font-size:16px;font-weight:600;letter-spacing:-0.3px;color:var(--vpc-text);line-height:1.25;}.header-subtitle{font-family:var(--vpc-font);font-size:13px;font-weight:400;color:var(--vpc-text-secondary);line-height:1.2;}ha-icon{--mdc-icon-size:var(--vpc-icon-size);color:var(--vpc-primary);transition:color 0.2s ease;}@keyframes rotate{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}@keyframes pulse-glow{0%, 100%{opacity:1;transform:scale(1);}50%{opacity:0.65;transform:scale(0.95);}}@keyframes breathe{0%, 100%{transform:scale(1);opacity:1;}50%{transform:scale(1.08);opacity:0.85;}}@keyframes spin-slow{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}.pump-running{animation:rotate 1.8s linear infinite;}.heater-active{animation:breathe 2.5s ease-in-out infinite;color:var(--vpc-danger, #FF3B30);}.solar-active{animation:breathe 3s ease-in-out infinite;color:var(--vpc-warning, #FF9F0A);}.dosing-active{animation:pulse-glow 2s ease-in-out infinite;color:var(--vpc-success, #34C759);}.speed-segments-container{display:flex;align-items:center;gap:8px;}.speed-segments{display:flex;flex:1;gap:6px;}.speed-segment{flex:1;display:flex;align-items:center;justify-content:center;gap:4px;padding:9px 6px;border-radius:var(--vpc-inner-radius, 12px);border:none;background:var(--vpc-surface, rgba(120,120,128,0.06));color:var(--vpc-text-secondary);font-family:var(--vpc-font);font-size:12px;font-weight:500;cursor:pointer;transition:all 0.18s ease;-webkit-tap-highlight-color:transparent;letter-spacing:-0.2px;position:relative;overflow:visible;}.speed-segment:hover{background:color-mix(in srgb, var(--seg-color) 10%, transparent);color:var(--seg-color);}.speed-segment.seg-active{background:color-mix(in srgb, var(--seg-color) 15%, transparent);color:var(--seg-color);font-weight:600;box-shadow:inset 0 0 0 1.5px color-mix(in srgb, var(--seg-color) 40%, transparent);}.speed-segment.seg-past{background:color-mix(in srgb, var(--seg-color) 08%, transparent);color:color-mix(in srgb, var(--seg-color) 70%, var(--vpc-text-secondary));}.speed-off-btn{width:38px;height:38px;border-radius:12px;border:none;background:var(--vpc-surface);color:var(--vpc-text-secondary);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.18s ease;flex-shrink:0;-webkit-tap-highlight-color:transparent;}.speed-off-btn:hover{background:rgba(255,59,48,0.1);color:var(--vpc-danger, #FF3B30);}.speed-off-btn.seg-active{background:rgba(255,59,48,0.12);color:var(--vpc-danger, #FF3B30);box-shadow:inset 0 0 0 1.5px rgba(255,59,48,0.3);}ha-card.theme-glow .speed-segment{border:1px solid rgba(0,212,255,0.1);}ha-card.theme-glow .speed-segment.seg-active{box-shadow:0 0 12px color-mix(in srgb, var(--seg-color) 50%, transparent);}.temp-hero{display:flex;align-items:center;gap:12px;padding:6px 0 4px;}.temp-hero-main{display:flex;align-items:baseline;gap:4px;}.temp-hero-value{font-family:var(--vpc-font);font-size:44px;font-weight:700;line-height:1;letter-spacing:-2px;color:var(--temp-color, var(--vpc-text));}.temp-hero-unit{font-size:22px;font-weight:400;color:var(--temp-color, var(--vpc-text));opacity:0.65;letter-spacing:-0.5px;}.temp-hero-target-pill{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:100px;background:var(--vpc-surface);font-size:13px;font-weight:500;color:var(--vpc-text-secondary);white-space:nowrap;}.temp-range-bar, .chem-range-bar{display:flex;flex-direction:column;gap:5px;}.temp-range-track, .chem-range-track{height:6px;background:var(--vpc-surface);border-radius:100px;position:relative;overflow:visible;}.temp-range-fill, .chem-range-fill{height:100%;border-radius:100px;transition:width 0.5s cubic-bezier(0.34,1.4,0.64,1);}.temp-range-target{position:absolute;top:50%;transform:translate(-50%, -50%);width:3px;height:14px;background:var(--vpc-text-secondary);border-radius:2px;opacity:0.7;}.temp-range-labels, .chem-range-labels{display:flex;justify-content:space-between;font-size:11px;font-weight:400;color:var(--vpc-text-tertiary, rgba(60,60,67,0.45));letter-spacing:0px;}.dosing-value-block{display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:var(--vpc-inner-radius, 12px);background:var(--vpc-surface);}ha-card.theme-glow .dosing-value-block{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);}.dosing-value-row{display:flex;align-items:center;justify-content:space-between;gap:10px;}.dosing-value-main{display:flex;align-items:baseline;gap:6px;}.dosing-label-tag{font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:var(--vpc-text-secondary);}.dosing-current-value{font-family:var(--vpc-font);font-size:32px;font-weight:700;line-height:1;letter-spacing:-1px;}.dosing-current-unit{font-size:15px;font-weight:400;opacity:0.65;}.dosing-status-pill{padding:4px 10px;border-radius:100px;font-size:12px;font-weight:600;white-space:nowrap;}.chem-range-target{position:absolute;top:50%;transform:translate(-50%, -50%);display:flex;flex-direction:column;align-items:center;gap:2px;}.chem-target-line{width:2px;height:14px;background:var(--vpc-text);border-radius:2px;opacity:0.5;}.chem-target-label{position:absolute;top:16px;font-size:9px;font-weight:600;color:var(--vpc-text-secondary);white-space:nowrap;transform:translateX(-50%);}.chem-mini-bar{width:100%;height:4px;background:var(--vpc-surface, rgba(120,120,128,0.1));border-radius:100px;overflow:hidden;position:relative;margin-top:4px;}.chem-mini-fill{height:100%;border-radius:100px;transition:width 0.5s cubic-bezier(0.34,1.4,0.64,1);}.chem-mini-ideal{position:absolute;top:0;height:100%;background:rgba(52,199,89,0.18);border-radius:2px;}.solar-temp-comparison{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px;background:var(--vpc-surface);border-radius:var(--vpc-inner-radius, 12px);}ha-card.theme-glow .solar-temp-comparison{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);}.solar-temp-tile{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;}.solar-temp-tile ha-icon{--mdc-icon-size:18px;color:var(--vpc-text-secondary);}.solar-temp-tile-val{font-size:20px;font-weight:700;letter-spacing:-0.5px;color:var(--vpc-text);line-height:1;}.solar-temp-tile-label{font-size:11px;font-weight:500;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.3px;}.solar-delta-badge{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 12px;border-radius:100px;font-size:12px;font-weight:700;}.delta-great{background:rgba(52,199,89,0.12);color:var(--vpc-success, #34C759);}.delta-ok{background:rgba(255,159,10,0.12);color:var(--vpc-warning, #FF9F0A);}.delta-low{background:rgba(255,59,48,0.10);color:var(--vpc-danger, #FF3B30);}.delta-hint-text{font-size:12px;font-weight:400;color:var(--vpc-text-secondary);padding:2px 0;}.chemistry-grid{display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;}.chemistry-card{display:flex;flex-direction:column;align-items:center;gap:2px;padding:14px 8px 12px;border-radius:var(--vpc-inner-radius, 12px);background:var(--vpc-surface);cursor:pointer;transition:transform 0.18s ease, background 0.18s ease;position:relative;overflow:visible;}.chemistry-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--chem-color, var(--vpc-primary));opacity:0.6;border-radius:100px;}.chemistry-card:hover{transform:scale(1.02);background:color-mix(in srgb, var(--chem-color) 8%, var(--vpc-surface));}ha-card.theme-glow .chemistry-card{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);}.chem-icon-wrap{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--chem-color, var(--vpc-primary)) 12%, transparent);margin-bottom:4px;}.chem-icon-wrap ha-icon{--mdc-icon-size:16px;color:var(--chem-color, var(--vpc-primary));}.chemistry-val{font-family:var(--vpc-font);font-size:18px;font-weight:700;letter-spacing:-0.5px;color:var(--chem-color, var(--vpc-text));line-height:1;}.chemistry-unit{font-size:11px;font-weight:500;color:var(--vpc-text-secondary);letter-spacing:0.2px;}.chemistry-label{font-size:10px;font-weight:500;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.4px;}.overview-warning-badge{width:22px;height:22px;border-radius:50%;background:var(--vpc-danger, #FF3B30);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}.overview-active-dot{width:10px;height:10px;border-radius:50%;background:var(--vpc-success, #34C759);box-shadow:0 0 8px rgba(52,199,89,0.5);flex-shrink:0;animation:pulse-glow 2s ease-in-out infinite;}.overview-section{display:flex;flex-direction:column;gap:6px;}.section-title{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.6px;padding:0 2px;}.section-count{margin-left:auto;font-size:11px;font-weight:500;color:var(--vpc-text-tertiary);}.warning-title ha-icon{color:var(--vpc-warning, #FF9F0A);}.warning-title{color:var(--vpc-warning, #FF9F0A);}.temp-hero{display:flex;align-items:baseline;gap:4px;padding:8px 0;}.temp-hero-value{font-size:42px;font-weight:800;line-height:1;color:var(--temp-color, var(--vpc-text));letter-spacing:-1px;}.temp-hero-unit{font-size:22px;font-weight:500;color:var(--temp-color, var(--vpc-text));opacity:0.7;}.temp-hero-target{font-size:16px;font-weight:500;color:var(--vpc-text-secondary);margin-left:12px;}.info-row{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--vpc-inner-radius, 12px);background:var(--vpc-surface);font-size:14px;color:var(--vpc-text);font-family:var(--vpc-font);}ha-card.theme-glow .info-row{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);}.info-row ha-icon{--mdc-icon-size:17px;color:var(--vpc-text-secondary);flex-shrink:0;}.info-label{flex:1;font-weight:400;color:var(--vpc-text-secondary);}.info-value{font-weight:600;color:var(--vpc-text);letter-spacing:-0.2px;}.info-badge{padding:3px 9px;border-radius:100px;font-size:11px;font-weight:600;}.info-badge.warning{background:color-mix(in srgb, var(--vpc-warning, #FF9F0A) 12%, transparent);color:var(--vpc-warning, #FF9F0A);}.info-row-warning{background:color-mix(in srgb, var(--vpc-warning, #FF9F0A) 06%, transparent);border:1px solid color-mix(in srgb, var(--vpc-warning, #FF9F0A) 18%, transparent);}.solar-temps{display:flex;flex-direction:column;gap:8px;}.chemistry-grid{display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;}.chemistry-card{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:14px;background:rgba(var(--rgb-primary-text-color, 0,0,0), 0.03);cursor:pointer;transition:var(--vpc-transition);border:1px solid transparent;}.chemistry-card:hover{background:rgba(var(--rgb-primary-text-color, 0,0,0), 0.06);transform:translateY(-1px);}ha-card.theme-glow .chemistry-card{background:rgba(0, 255, 255, 0.04);border:1px solid rgba(0, 255, 255, 0.08);}.chemistry-card ha-icon{--mdc-icon-size:20px;color:var(--chem-color, var(--vpc-primary));}.chemistry-val{font-size:16px;font-weight:700;color:var(--chem-color, var(--vpc-text));line-height:1;}.chemistry-label{font-size:11px;font-weight:500;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.3px;}.overview-section{display:flex;flex-direction:column;gap:8px;}.section-title{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.5px;padding:0 2px;}.section-title ha-icon{--mdc-icon-size:16px;color:var(--vpc-text-secondary);}.warning-title ha-icon{color:#ef6c00;}.warning-title{color:#ef6c00;}.device-list{display:flex;flex-direction:column;gap:3px;}.device-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:var(--vpc-inner-radius, 12px);background:var(--vpc-surface);cursor:pointer;transition:background 0.18s ease, transform 0.15s ease;}.device-row:hover{background:color-mix(in srgb, var(--vpc-primary) 6%, var(--vpc-surface));transform:scale(1.005);}ha-card.theme-glow .device-row{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.06);}.device-icon-wrap{width:32px;height:32px;border-radius:9px;background:var(--vpc-surface);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.2s ease;}.device-icon-wrap ha-icon{--mdc-icon-size:18px;color:var(--vpc-text-secondary);}.device-icon-active{background:color-mix(in srgb, var(--vpc-primary) 12%, transparent);}.device-icon-active ha-icon{color:var(--vpc-primary) !important;}.device-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;}.device-name{font-weight:500;font-size:14px;letter-spacing:-0.1px;color:var(--vpc-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.device-status{color:var(--vpc-text-secondary);font-size:12px;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.device-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}.dot-active{background:var(--vpc-success, #34C759);box-shadow:0 0 6px rgba(52,199,89,0.5);}.dot-inactive{background:var(--vpc-text-secondary);opacity:0.25;}.warning-list{display:flex;flex-direction:column;gap:5px;}.warning-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--vpc-inner-radius, 12px);background:color-mix(in srgb, var(--vpc-warning, #FF9F0A) 8%, transparent);border:1px solid color-mix(in srgb, var(--vpc-warning, #FF9F0A) 20%, transparent);font-size:13px;font-weight:500;color:var(--vpc-warning, #FF9F0A);}.warning-row ha-icon{color:var(--vpc-warning, #FF9F0A);flex-shrink:0;}.all-ok-display{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border-radius:var(--vpc-inner-radius, 12px);background:color-mix(in srgb, var(--vpc-success, #34C759) 8%, transparent);border:1px solid color-mix(in srgb, var(--vpc-success, #34C759) 18%, transparent);color:var(--vpc-success, #34C759);font-weight:500;font-size:14px;}.all-ok-display ha-icon{color:var(--vpc-success, #34C759);}ha-card.compact-card{padding:12px 14px;}.compact-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--vpc-surface);flex-shrink:0;transition:background 0.2s ease;}.compact-icon-active{background:color-mix(in srgb, var(--vpc-primary) 12%, transparent);}.compact-icon ha-icon{--mdc-icon-size:20px;}.compact-icon ha-icon.active{color:var(--vpc-primary);}.compact-icon ha-icon.inactive{color:var(--vpc-text-secondary);opacity:0.45;}.compact-info{flex:1;min-width:0;}.compact-details{display:flex;gap:8px;font-size:12px;margin-top:2px;align-items:center;}.compact-value{font-weight:600;color:var(--vpc-text);letter-spacing:-0.2px;}.compact-detail{color:var(--vpc-text-secondary);font-size:11px;}.system-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:20px;}.error-state{display:flex;align-items:center;gap:14px;padding:20px;}.error-icon{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(244, 67, 54, 0.1);}.error-icon ha-icon{--mdc-icon-size:24px;color:#d32f2f;}.error-info{display:flex;flex-direction:column;gap:2px;}.error-title{font-size:14px;font-weight:600;color:#d32f2f;}.error-entity{font-size:12px;color:var(--vpc-text-secondary);font-family:monospace;}ha-card.size-small{--vpc-spacing:12px;--vpc-icon-size:20px;--vpc-radius:16px;}ha-card.size-small .header-icon{width:38px;height:38px;border-radius:11px;}ha-card.size-small .name{font-size:14px;}ha-card.size-small .temp-hero-value{font-size:34px;letter-spacing:-1.5px;}ha-card.size-large{--vpc-spacing:22px;--vpc-icon-size:28px;--vpc-radius:26px;}ha-card.size-large .header-icon{width:54px;height:54px;border-radius:17px;}ha-card.size-large .name{font-size:18px;}ha-card.size-large .temp-hero-value{font-size:56px;letter-spacing:-3px;}ha-card.size-fullscreen{--vpc-spacing:28px;--vpc-icon-size:32px;--vpc-radius:28px;height:100%;min-height:80vh;}ha-card.size-fullscreen .header-icon{width:60px;height:60px;border-radius:19px;}ha-card.size-fullscreen .name{font-size:20px;}ha-card.size-fullscreen .temp-hero-value{font-size:68px;letter-spacing:-4px;}ha-card.animation-none{transition:none !important;}ha-card.animation-none:hover, ha-card.animation-none:active{transform:none !important;}ha-card.animation-subtle{transition:transform 0.15s ease, box-shadow 0.15s ease;}ha-card.animation-subtle:hover{transform:translateY(-1px);}ha-card.animation-smooth{transition:transform 0.25s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.25s ease;}ha-card.animation-energetic{transition:transform 0.2s cubic-bezier(0.34,1.6,0.64,1), box-shadow 0.2s ease;}ha-card.animation-energetic:hover{transform:translateY(-4px) scale(1.008);}@keyframes flow-gradient{0%{background-position:0% 50%;}100%{background-position:200% 50%;}}ha-card.flow-active .accent-bar{background:linear-gradient(90deg, var(--card-accent), color-mix(in srgb, var(--card-accent) 60%, white), var(--card-accent));background-size:200% 100%;animation:flow-gradient 2.5s linear infinite;}.error-state{display:flex;align-items:center;gap:14px;padding:20px;}.error-icon{width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--vpc-danger, #FF3B30) 10%, transparent);flex-shrink:0;}.error-icon ha-icon{--mdc-icon-size:24px;color:var(--vpc-danger, #FF3B30);}.error-info{display:flex;flex-direction:column;gap:3px;}.error-title{font-size:15px;font-weight:600;color:var(--vpc-danger, #FF3B30);letter-spacing:-0.2px;}.error-entity{font-size:12px;color:var(--vpc-text-secondary);font-family:'SF Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace;opacity:0.7;}.system-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:16px;}@media (max-width:600px){.chemistry-grid{grid-template-columns:repeat(3, 1fr);gap:6px;}.chemistry-card{padding:11px 6px 10px;}.chemistry-val{font-size:16px;}.system-grid{grid-template-columns:1fr;}.temp-hero-value{font-size:38px;letter-spacing:-1.5px;}.dosing-current-value{font-size:28px;}.speed-segment{font-size:11px;padding:8px 4px;}}@media (pointer:coarse){.speed-segment, .speed-off-btn, .device-row, .chemistry-card{min-height:44px;}}.speed-segment{min-width:0;}.speed-segment span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
/* === TOOLTIP SYSTEM === */
.tooltip-wrap{position:relative;}
.t-tip{position:absolute;top:calc(100% + 7px);left:50%;transform:translateX(-50%) translateY(-4px) scale(0.94);transform-origin:top center;z-index:9999;min-width:148px;max-width:250px;padding:9px 12px;background:rgba(18,18,26,0.94);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border:1px solid rgba(255,255,255,0.11);border-radius:11px;box-shadow:0 8px 28px rgba(0,0,0,0.4),0 2px 6px rgba(0,0,0,0.25);opacity:0;pointer-events:none;transition:opacity 0.13s ease,transform 0.17s cubic-bezier(0.34,1.4,0.64,1),transition-delay 0s;white-space:normal;text-align:left;}
.tooltip-wrap:hover .t-tip{opacity:1;transform:translateX(-50%) translateY(0) scale(1);transition-delay:0.38s;}
.t-tip.t-up{top:auto;bottom:calc(100% + 7px);transform-origin:bottom center;transform:translateX(-50%) translateY(4px) scale(0.94);}
.tooltip-wrap:hover .t-tip.t-up{transform:translateX(-50%) translateY(0) scale(1);}
.t-tip-title{font-size:11.5px;font-weight:600;color:rgba(255,255,255,0.94);margin-bottom:4px;display:flex;align-items:center;gap:5px;}
.t-tip-title ha-icon{--mdc-icon-size:13px;color:rgba(255,255,255,0.55);flex-shrink:0;}
.t-tip-desc{font-size:11px;color:rgba(255,255,255,0.67);line-height:1.55;}
.t-tip-ideal{display:flex;align-items:center;gap:5px;margin-top:6px;padding:3px 8px;background:rgba(52,199,89,0.18);border-radius:6px;font-size:10.5px;font-weight:600;color:#34C759;}
.t-tip-ideal ha-icon{--mdc-icon-size:11px;flex-shrink:0;}
.t-tip-warn{display:flex;align-items:center;gap:5px;margin-top:5px;padding:3px 8px;background:rgba(255,159,10,0.16);border-radius:6px;font-size:10.5px;font-weight:600;color:#FF9F0A;}
/* === CHEMICAL CARD === */
.chem-overall-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:100px;font-size:11.5px;font-weight:600;flex-shrink:0;}
.chem-overall-badge ha-icon{--mdc-icon-size:14px;}
.chem-section{background:var(--vpc-surface);border-radius:var(--vpc-inner-radius,12px);padding:13px 15px;display:flex;flex-direction:column;gap:9px;position:relative;overflow:visible;}
.chem-section-header{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:500;color:var(--vpc-text-secondary);}
.chem-section-status{margin-left:auto;font-weight:600;font-size:12px;}
.chem-big-value{display:flex;align-items:baseline;gap:5px;}
.chem-big-num{font-size:42px;font-weight:700;letter-spacing:-2px;line-height:1;}
.chem-big-unit{font-size:20px;font-weight:400;opacity:0.6;letter-spacing:-0.5px;}
.chem-gauge-bar{display:flex;flex-direction:column;gap:5px;}
.chem-gauge-track{height:7px;background:rgba(0,0,0,0.07);border-radius:100px;position:relative;overflow:visible;}
ha-card.theme-midnight .chem-gauge-track,ha-card.theme-glow .chem-gauge-track{background:rgba(255,255,255,0.08);}
.chem-gauge-fill{height:100%;border-radius:100px;transition:width 0.55s cubic-bezier(0.34,1.4,0.64,1);}
.chem-gauge-zone{position:absolute;top:0;height:100%;background:rgba(52,199,89,0.22);border-radius:2px;}
.chem-gauge-labels{display:flex;justify-content:space-between;font-size:10.5px;color:var(--vpc-text-tertiary);}
.chem-zone-label{font-size:10.5px;color:var(--vpc-success,#34C759);font-weight:500;}
.chem-dual-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.chem-metric-card{background:var(--vpc-surface);border-radius:var(--vpc-inner-radius,12px);padding:13px 12px;display:flex;flex-direction:column;gap:6px;cursor:pointer;transition:transform 0.15s ease,border-color 0.15s ease;border:1px solid transparent;position:relative;overflow:visible;}
.chem-metric-card:hover{transform:scale(1.025);border-color:color-mix(in srgb,var(--chem-color,var(--vpc-primary)) 22%,transparent);}
.chem-metric-header{display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:var(--vpc-text-secondary);}
.chem-metric-header ha-icon{color:var(--chem-color,var(--vpc-primary));--mdc-icon-size:15px;}
.chem-metric-value{font-size:34px;font-weight:700;letter-spacing:-1.5px;line-height:1;color:var(--chem-color,var(--vpc-text));}
.chem-metric-unit{font-size:12px;font-weight:500;color:var(--vpc-text-secondary);margin-top:-3px;}
.chem-metric-status{font-size:11px;font-weight:600;color:var(--chem-color,var(--vpc-text-secondary));}
.chem-metric-bar{display:flex;flex-direction:column;gap:4px;}
.chem-metric-track{height:5px;background:rgba(0,0,0,0.07);border-radius:100px;position:relative;overflow:visible;}
ha-card.theme-midnight .chem-metric-track{background:rgba(255,255,255,0.08);}
.chem-metric-ideal{position:absolute;top:0;height:100%;background:rgba(52,199,89,0.2);border-radius:2px;}
.chem-metric-fill{height:100%;border-radius:100px;background:var(--chem-color,var(--vpc-primary));transition:width 0.5s ease;}
.chem-metric-target{position:absolute;top:50%;transform:translate(-50%,-50%);width:2px;height:13px;background:var(--vpc-text);border-radius:1px;opacity:0.45;}
.chem-metric-labels{display:flex;justify-content:space-between;font-size:10px;color:var(--vpc-text-tertiary);}
.chem-recommendations{display:flex;flex-direction:column;gap:6px;}
.chem-rec-row{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:var(--vpc-inner-radius,12px);background:color-mix(in srgb,var(--rec-color,var(--vpc-warning)) 9%,transparent);border:1px solid color-mix(in srgb,var(--rec-color,var(--vpc-warning)) 22%,transparent);font-size:12.5px;font-weight:500;color:var(--rec-color,var(--vpc-warning));}
.chem-rec-row ha-icon{--mdc-icon-size:15px;flex-shrink:0;}
/* === SENSOR CARD === */
.sensor-value-display{background:var(--vpc-surface);border-radius:var(--vpc-inner-radius,12px);padding:18px 16px;display:flex;align-items:center;justify-content:center;position:relative;overflow:visible;}
.sensor-big-value{display:flex;align-items:baseline;gap:6px;}
.sensor-num{font-size:40px;font-weight:700;letter-spacing:-2.5px;line-height:1;color:var(--card-accent,var(--vpc-primary));}
.sensor-unit{font-size:18px;font-weight:400;opacity:0.6;letter-spacing:-0.5px;color:var(--card-accent,var(--vpc-text));}
.sensor-state-text{font-size:28px;font-weight:600;color:var(--vpc-text);}
/* === DETAIL CARD TOOLTIP FIX === */
.device-row{overflow:visible;}
/* === ANIMATED SVG ICONS === */
@keyframes flicker{0%,100%{transform:scaleX(1) skewX(0deg);opacity:1;}25%{transform:scaleX(1.06) skewX(-2deg);opacity:0.88;}50%{transform:scaleX(0.96) skewX(1.5deg);opacity:0.82;}75%{transform:scaleX(1.04) skewX(-1deg);opacity:0.94;}}
@keyframes light-glow{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.65;transform:scale(1.07);}}
@keyframes flow-dot{0%,100%{opacity:0.7;transform:scale(1);}50%{opacity:0.3;transform:scale(0.6);}}
.header-icon svg{display:block;width:100%;height:100%;}
/* === COVER CARD === */
.cover-visual{padding:2px 0;}
.cover-pos-bar{height:5px;background:var(--vpc-surface);border-radius:100px;overflow:hidden;margin-top:-4px;}
.cover-pos-fill{height:100%;border-radius:100px;transition:width 0.55s cubic-bezier(0.34,1.4,0.64,1);}
.cover-moving-pill{padding:2px 8px;border-radius:100px;font-size:11px;font-weight:600;background:rgba(255,159,10,0.14);color:var(--vpc-warning,#FF9F0A);white-space:nowrap;}
.cover-controls{display:flex;gap:7px;}
.cover-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 6px;border:none;border-radius:var(--vpc-inner-radius,12px);background:var(--vpc-surface);color:var(--vpc-text-secondary);font-family:var(--vpc-font);font-size:11.5px;font-weight:500;cursor:pointer;transition:all 0.18s ease;-webkit-tap-highlight-color:transparent;}
.cover-btn:hover{background:color-mix(in srgb,var(--card-accent) 12%,transparent);color:var(--card-accent);}
.cover-btn-open.cvr-active{background:rgba(52,199,89,0.13);color:var(--vpc-success,#34C759);box-shadow:inset 0 0 0 1.5px rgba(52,199,89,0.32);}
.cover-btn-stop.cvr-active{background:rgba(255,159,10,0.13);color:var(--vpc-warning,#FF9F0A);box-shadow:inset 0 0 0 1.5px rgba(255,159,10,0.32);}
.cover-btn-close.cvr-active{background:rgba(255,59,48,0.12);color:var(--vpc-danger,#FF3B30);box-shadow:inset 0 0 0 1.5px rgba(255,59,48,0.3);}
/* === LIGHT CARD === */
.light-color-swatch{height:54px;border-radius:var(--vpc-inner-radius,12px);display:flex;align-items:center;justify-content:center;transition:background 0.4s ease,box-shadow 0.4s ease;}
.light-color-label{font-size:11.5px;font-weight:600;color:white;text-shadow:0 1px 4px rgba(0,0,0,0.45);letter-spacing:0.1px;}
.light-brightness-row{margin-top:-4px;}
.light-color-swatch{position:relative;overflow:hidden;}
.light-color-swatch input[type=color]{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:none;padding:0;}
.light-color-hint{position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:10.5px;font-weight:600;color:rgba(255,255,255,0.65);pointer-events:none;}
/* === FILTER CARD === */
.filter-gauge-wrap{display:flex;justify-content:center;padding:4px 0 0;}
`;

  }

  public getCardSize(): number {
    switch (this.config?.card_type) {
      case 'compact':
        return 1;
      case 'overview':
        return 5;
      case 'details':
        return Math.ceil((this.config.entities?.length || 1) / 2) + 1;
      case 'chemical':
        return 6;
      case 'sensor':
        return 2;
      case 'cover':
        return 4;
      case 'light':
        return 3;
      default:
        return 3;
    }
  }

  private renderDigitalRulesCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const accentColor = this._getAccentColor('digital_rules', config);

    const rules = [
      { id: 'DIRULE_1', label: 'Rule 1', icon: 'mdi:toggle-switch' },
      { id: 'DIRULE_2', label: 'Rule 2', icon: 'mdi:toggle-switch' },
      { id: 'DIRULE_3', label: 'Rule 3', icon: 'mdi:toggle-switch' },
      { id: 'DIRULE_4', label: 'Rule 4', icon: 'mdi:toggle-switch' },
      { id: 'DIRULE_5', label: 'Rule 5', icon: 'mdi:toggle-switch' },
      { id: 'DIRULE_6', label: 'Rule 6', icon: 'mdi:toggle-switch' },
      { id: 'DIRULE_7', label: 'Rule 7', icon: 'mdi:toggle-switch' },
    ];

    return html`
      <ha-card class="${this._getCardClasses(true, config)}" style="--card-accent: ${accentColor}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon" style="--icon-accent: ${accentColor}">
              <ha-icon icon="mdi:auto-fix"></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${config.name || 'Digital Rules'}</span>
              <span class="header-subtitle">7 Automation Rules</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 16px;">
            ${rules.map(rule => html`
              <div style="background: var(--vpc-surface); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 6px;">
                <div style="font-size: 12px; font-weight: 600; color: var(--vpc-text-secondary);">${rule.label}</div>
                <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                  <button style="flex: 1; padding: 6px; border: none; border-radius: 6px; background: ${accentColor}; color: white; font-size: 10px; font-weight: 600; cursor: pointer;"
                          @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).manageDigitalRules(rule.id as any, 'trigger'); }}">
                    Trigger
                  </button>
                  <button style="flex: 1; padding: 6px; border: none; border-radius: 6px; background: #FF9F0A; color: white; font-size: 10px; font-weight: 600; cursor: pointer;"
                          @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).manageDigitalRules(rule.id as any, 'lock'); }}">
                    Lock
                  </button>
                  <button style="flex: 1; padding: 6px; border: none; border-radius: 6px; background: #34C759; color: white; font-size: 10px; font-weight: 600; cursor: pointer;"
                          @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).manageDigitalRules(rule.id as any, 'unlock'); }}">
                    Unlock
                  </button>
                </div>
              </div>
            `)}
          </div>
        </div>
      </ha-card>
    `;
  }

  private renderDiagnosticsCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const accentColor = this._getAccentColor('diagnostics', config);
    const deviceId = config.entity || 'violet_pool_controller';

    return html`
      <ha-card class="${this._getCardClasses(true, config)}" style="--card-accent: ${accentColor}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon" style="--icon-accent: ${accentColor}">
              <ha-icon icon="mdi:hospital-box"></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${config.name || 'Diagnostics'}</span>
              <span class="header-subtitle">System Health & Logs</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 16px;">
            <!-- Connection Status -->
            <button style="padding: 12px 16px; border: none; border-radius: 10px; background: var(--vpc-surface); color: var(--vpc-text); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px;"
                    @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).testConnection(deviceId); }}">
              <ha-icon icon="mdi:wifi-check" style="--mdc-icon-size: 20px; color: #34C759;"></ha-icon>
              <span>Test Connection</span>
            </button>

            <!-- Error Summary -->
            <button style="padding: 12px 16px; border: none; border-radius: 10px; background: var(--vpc-surface); color: var(--vpc-text); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px;"
                    @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).getErrorSummary(deviceId, true); }}">
              <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size: 20px; color: #FF9F0A;"></ha-icon>
              <span>Error Summary</span>
            </button>

            <!-- Export Logs -->
            <button style="padding: 12px 16px; border: none; border-radius: 10px; background: var(--vpc-surface); color: var(--vpc-text); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px;"
                    @click="${(e: Event) => { e.stopPropagation(); new ServiceCaller(this.hass).exportDiagnosticLogs(deviceId, 500); }}">
              <ha-icon icon="mdi:file-document-outline" style="--mdc-icon-size: 20px; color: #2196F3;"></ha-icon>
              <span>Export Logs (500 lines)</span>
            </button>

            <!-- Clear Error History -->
            <button style="padding: 12px 16px; border: none; border-radius: 10px; background: #FF3B30; color: white; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px;"
                    @click="${(e: Event) => { e.stopPropagation(); if (confirm('Clear error history?')) new ServiceCaller(this.hass).clearErrorHistory(deviceId); }}">
              <ha-icon icon="mdi:trash-can-outline" style="--mdc-icon-size: 20px;"></ha-icon>
              <span>Clear Error History</span>
            </button>
          </div>
        </div>
      </ha-card>
    `;
  }

  public static getStubConfig(): VioletPoolCardConfig {
    return {
      type: 'custom:violet-pool-card',
      entity_prefix: 'violet_pool',
      entity: 'switch.violet_pool_pump',
      card_type: 'pump',
    };
  }

  public static async getConfigElement() {
    await import('./editor/violet-pool-card-editor');
    return document.createElement('violet-pool-card-editor');
  }
}

if (!customElements.get('violet-pool-card')) {
  // Inject modal styles globally
  const modalStyles = `
    .confirmation-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease;
      backdrop-filter: blur(4px);
      padding: 16px;
    }
    .confirmation-dialog {
      background: var(--card-background-color, #fff);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 90%;
      width: 400px;
      animation: slideUp 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
    }
    .confirmation-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .confirmation-message {
      font-size: 14px;
      color: var(--primary-text-color);
      margin: 0;
      line-height: 1.5;
    }
    .confirmation-buttons {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    .confirmation-buttons button {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 44px;
      min-width: 44px;
    }
    .btn-cancel {
      background: var(--divider-color, rgba(0, 0, 0, 0.12));
      color: var(--primary-text-color);
    }
    .btn-cancel:hover {
      background: var(--divider-color, rgba(0, 0, 0, 0.2));
    }
    .btn-confirm {
      background: var(--primary-color, #007aff);
      color: white;
    }
    .btn-confirm:hover {
      opacity: 0.9;
      box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @media (max-width: 600px) {
      .confirmation-dialog { width: 90%; }
      .confirmation-buttons { flex-direction: column-reverse; }
      .confirmation-buttons button { width: 100%; }
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.textContent = modalStyles;
  document.head.appendChild(styleElement);

  customElements.define('violet-pool-card', VioletPoolCard);
}

// Register card for card picker
declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'violet-pool-card',
  name: 'Violet Pool Card',
  description: 'Premium card for Violet Pool Controller with glassmorphism design',
  preview: true,
  // Add icon for Card Picker if missing. This is ignored by HACS list but useful for HA Add Card UI.
});

