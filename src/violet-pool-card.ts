import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';

// Import components
import './components/status-badge';
import './components/value-display';
import './components/detail-status';
import './components/warning-chips';
import './components/slider-control';
import './components/quick-actions';
import type { QuickAction } from './components/quick-actions';

// Import utilities
import { ServiceCaller } from './utils/service-caller';
import { EntityHelper } from './utils/entity-helper';
import { StateColorHelper } from './utils/state-color';
import { pumpSVG, heaterSVG, solarSVG, coverSVG, lightSVG, dosingDropletSVG, gaugeNeedleSVG, filterGaugeSVG, chartSVG } from './utils/animated-icons';

// Import animation styles


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
}

interface LovelaceCardConfig {
  type: string;
  entity?: string;
  entities?: string[];
  card_type: 'pump' | 'heater' | 'solar' | 'dosing' | 'overview' | 'compact' | 'system' | 'details' | 'chemical' | 'sensor' | 'cover' | 'light' | 'filter' | 'statistics' | 'weather' | 'maintenance' | 'alerts' | 'comparison';
  name?: string;
  icon?: string;

  // PREMIUM DESIGN SYSTEM
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  theme?: 'apple' | 'dark' | 'luxury' | 'modern' | 'minimalist' | 'glass' | 'neon' | 'premium';
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
  @property({ attribute: false }) public hass!: HomeAssistant;
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
      theme: 'apple',
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
      case 'statistics':
        return this.renderStatisticsCard();
      case 'weather':
        return this.renderWeatherCard();
      case 'maintenance':
        return this.renderMaintenanceCard();
      case 'alerts':
        return this.renderAlertsCard();
      case 'comparison':
        return this.renderComparisonCard();
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

  /**
   * Render loading skeleton for entity while data loads
   */
  private _renderLoadingSkeleton(config: VioletPoolCardConfig): TemplateResult {
    return html`
      <ha-card class="${this._getCardClasses(false, config)}">
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
   * Get minutes since last entity update
   */
  private _getMinutesSinceUpdate(entity: HassEntity | undefined): number {
    if (!entity?.last_updated) return 0;
    const lastUpdate = new Date(entity.last_updated);
    const now = new Date();
    return Math.floor((now.getTime() - lastUpdate.getTime()) / 60000);
  }

  /**
   * Render timeout indicator if data is stale
   */
  private _renderTimeoutIndicator(entity: HassEntity | undefined): TemplateResult {
    const minutesStale = this._getMinutesSinceUpdate(entity);
    if (minutesStale < 1) return html``;

    const isError = minutesStale > 30;
    const bgColor = isError ? 'rgba(255,59,48,0.08)' : 'rgba(255,159,10,0.08)';
    const borderColor = isError ? 'rgba(255,59,48,0.2)' : 'rgba(255,159,10,0.2)';
    const textColor = isError ? '#FF3B30' : '#FF9F0A';

    return html`
      <div style="padding: 8px 12px; border-radius: 8px; background: ${bgColor}; border: 1px solid ${borderColor}; font-size: 12px; color: ${textColor}; margin-top: 8px; display: flex; align-items: center; justify-content: space-between;">
        <span>⚠️ Daten ${minutesStale} Minute${minutesStale > 1 ? 'n' : ''} alt</span>
        <button style="margin-left: 8px; padding: 4px 8px; background: ${textColor}; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;"
                @click="${() => this.requestUpdate()}">
          ↻
        </button>
      </div>
    `;
  }

  /**
   * Render Quick-Settings Panel with common pool actions
   */
  private _renderQuickSettingsPanel(): TemplateResult {
    const pumpEntityId = this._getEntityId('pump_entity', 'switch', 'pump', 0);
    const heaterEntityId = this._getEntityId('heater_entity', 'climate', 'heater', 1);


    return html`
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; padding: 12px; background: var(--vpc-surface); border-radius: 12px; margin-top: 12px;">
        <!-- Pump Presets -->
        ${[
          { label: '⚡ Boost', speed: 3, icon: 'mdi:rocket' },
          { label: '⚙️ Normal', speed: 2, icon: 'mdi:speedometer' },
          { label: '🔋 Eco', speed: 1, icon: 'mdi:leaf' },
          { label: '❌ Off', speed: 0, icon: 'mdi:power-off' },
        ].map(preset => html`
          <button style="padding: 10px; border: 1px solid var(--vpc-text-secondary); border-radius: 8px; background: transparent; color: var(--vpc-text); font-weight: 600; cursor: pointer; font-size: 12px; transition: all 0.2s;"
                  @click="${(e: Event) => {
                    e.stopPropagation();
                    if (preset.speed === 0) {
                      this.hass.callService('switch', 'turn_off', { entity_id: pumpEntityId });
                    } else {
                      this.hass.callService('switch', 'turn_on', { entity_id: pumpEntityId, service_data: { speed: preset.speed } });
                    }
                  }}"
                  @mouseover="${(e: Event) => { (e.target as HTMLElement).style.background = 'var(--vpc-primary)'; (e.target as HTMLElement).style.color = 'white'; }}"
                  @mouseout="${(e: Event) => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = 'var(--vpc-text)'; }}">
            ${preset.label}
          </button>
        `)}

        <!-- Heater Controls -->
        <button style="padding: 10px; border: 1px solid var(--vpc-warning); border-radius: 8px; background: transparent; color: var(--vpc-warning); font-weight: 600; cursor: pointer; font-size: 12px; grid-column: span 2;"
                @click="${(e: Event) => { e.stopPropagation(); this.hass.callService('climate', 'set_temperature', { entity_id: heaterEntityId, temperature: 26 }); }}">
          🔥 Heater +2°
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
      case 'statistics': return '#3F51B5';
      case 'weather': return '#00BCD4';
      case 'maintenance': return '#FF5252';
      case 'alerts': return '#FF6F00';
      case 'comparison': return '#9C27B0';
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
    const pumpState = entity.attributes?.PUMPSTATE || '';
    const accentColor = this._getAccentColor('pump', config);

    const parsedState = EntityHelper.parsePumpState(pumpState);
    const currentSpeed = parsedState.level !== undefined ? parsedState.level : 0;

    const rpmLevel0 = entity.attributes?.PUMP_RPM_0 || 0;
    const rpmLevel1 = entity.attributes?.PUMP_RPM_1 || 0;
    const rpmLevel2 = entity.attributes?.PUMP_RPM_2 || 0;
    const rpmLevel3 = entity.attributes?.PUMP_RPM_3 || 0;
    const rpmValues = [rpmLevel0, rpmLevel1, rpmLevel2, rpmLevel3];
    const currentRPM = rpmValues[currentSpeed] || 0;

    const runtimeSeconds = entity.attributes?.runtime || 0;
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

          ${config.show_detail_status && pumpState
            ? html`<vpc-detail-status .raw="${pumpState}"></vpc-detail-status>`
            : ''}

          ${config.show_controls
            ? html` <vpc-slider-control label="Speed Level" min="0" max="3" step="1" .value="${currentSpeed}" .labels="${['OFF', 'ECO', 'Normal', 'Boost']}" @value-changed="${(e: CustomEvent) => this._handlePumpSpeedChange(e, config.entity!)}" ></vpc-slider-control> `
            : ''}

          ${config.show_runtime && runtimeSeconds > 0
            ? html` <div class="info-row"><ha-icon icon="mdi:timer-outline"></ha-icon><span class="info-label">Runtime</span><span class="info-value">${runtimeDisplay}</span></div> `
            : ''}
        </div>
      </ha-card>
    `;
  }

  private async _handlePumpSpeedChange(e: CustomEvent, entityId: string) {
    const speed = e.detail.value;
    const serviceCaller = new ServiceCaller(this.hass);
    await serviceCaller.setPumpSpeed(entityId, speed);
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

    const heaterState = entity.attributes?.HEATERSTATE || '';

    const outsideTemp = entity.attributes?.outside_temperature;
    const minOutsideTemp = entity.attributes?.min_outside_temperature || 14.5;

    const isBlockedByOutsideTemp =
      heaterState.includes('BLOCKED_BY_OUTSIDE_TEMP') ||
      (outsideTemp !== undefined && outsideTemp < minOutsideTemp);

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

          ${outsideTemp !== undefined
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

    const absorberTemp = entity.attributes?.absorber_temperature;

    const tempDelta = absorberTemp !== undefined && poolTemp !== undefined
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
        label: 'ON',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.setHvacMode(config.entity!, 'heat');
        },
        active: state === 'heat' || state === 'heating',
        color: '#FF9800',
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
              ${absorberTemp !== undefined
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
      minValue = targetEntity?.attributes?.min || 600;
      maxValue = targetEntity?.attributes?.max || 800;
      unit = 'mV';
    } else if (dosingType === 'ph_minus' || dosingType === 'ph_plus') {
      const phSensorId = this._getEntityId('ph_value_entity', 'sensor', 'ph_value');
      const phSensor = this.hass.states[phSensorId];
      currentValue = phSensor ? parseFloat(phSensor.state) : undefined;
      const targetPhId = this._getEntityId('target_ph_entity', 'number', 'target_ph');
      const targetEntity = this.hass.states[targetPhId];
      targetValue = targetEntity ? parseFloat(targetEntity.state) : undefined;
      minValue = targetEntity?.attributes?.min || 6.8;
      maxValue = targetEntity?.attributes?.max || 7.8;
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
            ? html`<vpc-quick-actions .actions="${quickActions}"></vpc-quick-actions>`
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
      const pumpState = pumpEntity.attributes?.PUMPSTATE || '';
      const parsedPumpState = EntityHelper.parsePumpState(pumpState);
      activeDevices.push({
        icon: 'mdi:pump',
        name: 'Pump',
        status: parsedPumpState.status || pumpEntity.state,
        state: pumpEntity.state,
        entityId: pumpEntityId,
      });
    }

    if (heaterEntity) {
      const heaterState = heaterEntity.attributes?.HEATERSTATE || '';
      const parsedHeaterState = EntityHelper.parseHeaterState(heaterState);
      activeDevices.push({
        icon: 'mdi:radiator',
        name: 'Heater',
        status: parsedHeaterState.status || heaterEntity.state,
        state: heaterEntity.state,
        entityId: heaterEntityId,
      });
    }

    if (solarEntity) {
      const solarState = solarEntity.attributes?.SOLARSTATE || '';
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
        name: 'Chlorine',
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
        name: 'pH-',
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
        name: coverEntity.attributes.friendly_name || 'Abdeckung',
        status: pos !== undefined ? `${Math.round(pos)}%${isMoving ? (coverEntity.state === 'opening' ? ' ↑' : ' ↓') : ''}` : (coverEntity.state === 'open' ? 'Offen' : 'Zu'),
        state: coverEntity.state === 'open' ? 'on' : coverEntity.state === 'closed' ? 'off' : 'auto',
        entityId: coverEntityId,
      });
    }

    // Light entity
    const lightEntityId = this._getEntityId('light_entity', 'light', 'light');
    const lightEntity = this.hass.states[lightEntityId];
    if (lightEntity) {
      const br = lightEntity.attributes?.brightness;
      const brText = br !== undefined ? ` · ${Math.round(br / 255 * 100)}%` : '';
      activeDevices.push({
        icon: lightEntity.state === 'on' ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off-outline',
        name: lightEntity.attributes.friendly_name || 'Beleuchtung',
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
        name: filterEntity.attributes.friendly_name || 'Filter',
        status: !isNaN(pressureVal) ? `${pressureVal.toFixed(2)} bar` : filterEntity.state,
        state: !isNaN(pressureVal) && pressureVal > 1.2 ? 'auto' : 'on',
        entityId: filterEntityId,
      });
    }

    if (orpStatus === 'warning') warnings.push('ORP too low - Check chlorine dosing');
    if (orpStatus === 'high') warnings.push('ORP too high - Stop chlorine dosing');
    if (phStatus === 'warning') warnings.push('pH out of range - Check dosing');

    if (pumpEntity?.attributes?.PUMPSTATE?.includes('ANTI_FREEZE')) {
      const outsideTemp = heaterEntity?.attributes?.outside_temperature;
      warnings.push(`Frost protection active${outsideTemp ? ` (${outsideTemp.toFixed(1)}°C)` : ''}`);
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

    return html` <ha-card class="${this._getCardClasses(anyActive, config)}" style="--card-accent: ${accentColor}" ><div class="accent-bar"></div><div class="card-content"><!-- Header --><div class="header"><div class="header-icon ${anyActive ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}"><ha-icon icon="mdi:pool"></ha-icon></div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle"> ${anyActive ? `${activeCount} device${activeCount !== 1 ? 's' : ''} active` : 'All systems idle'}
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
            ? html` <div class="overview-section"><div class="section-title"><span>Devices</span><span class="section-count">${activeDevices.length}</span></div><div class="device-list"> ${activeDevices.map( (device) => html`
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
            ? html` <div class="overview-section"><div class="section-title warning-title"><ha-icon icon="mdi:alert-outline" style="--mdc-icon-size: 14px"></ha-icon><span>Alerts</span></div><div class="warning-list"> ${warnings.map( (warning) => html`
                        <div class="warning-row">
                          <ha-icon icon="${warning.includes('Frost') ? 'mdi:snowflake-alert' : 'mdi:alert-circle'}" style="--mdc-icon-size: 16px"></ha-icon>
                          <span>${warning}</span>
                        </div>
                      `
                    )}
                  </div>
                </div>
              `
            : html` <div class="all-ok-display"><ha-icon icon="mdi:check-circle" style="--mdc-icon-size: 18px"></ha-icon><span>All systems normal</span></div> `}
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
        <ha-card class="theme-${config.theme || 'luxury'} size-${config.size || 'medium'}">
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
      <ha-card class="theme-${config.theme || 'luxury'} size-${config.size || 'medium'}">
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
      const parsedState = EntityHelper.parsePumpState(entity.attributes.PUMPSTATE);
      detailStatus = parsedState.status;
      if (parsedState.level !== undefined && parsedState.level > 0) {
        currentValue = `Level ${parsedState.level}`;
      }
    } else if (entity.attributes?.HEATERSTATE) {
      const parsedState = EntityHelper.parseHeaterState(entity.attributes.HEATERSTATE);
      detailStatus = parsedState.status;
      const temp = EntityHelper.getCurrentTemperature(entity);
      if (temp !== undefined) {
        currentValue = `${temp.toFixed(1)}°C`;
      }
    } else if (entity.attributes?.SOLARSTATE) {
      const parsedState = EntityHelper.parseSolarState(entity.attributes.SOLARSTATE);
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
      const pos = entity.attributes?.current_position;
      if (pos !== undefined) currentValue = `${Math.round(pos)}%`;
      detailStatus = entity.state === 'open' ? 'Geöffnet' : entity.state === 'closed' ? 'Geschlossen' : entity.state === 'opening' ? 'Öffnet…' : entity.state === 'closing' ? 'Schließt…' : entity.state;
    } else if (domain === 'light') {
      const br = entity.attributes?.brightness;
      if (br !== undefined) currentValue = `${Math.round(br / 255 * 100)}%`;
      detailStatus = entity.state === 'on' ? 'An' : 'Aus';
    } else if (domain === 'sensor') {
      const unit = entity.attributes?.unit_of_measurement || '';
      const num = parseFloat(entity.state);
      if (!isNaN(num)) currentValue = `${num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)}${unit}`;
      detailStatus = entity.attributes.device_class || '';
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

    const poolTempSensorId = this._getEntityId('pool_temp_entity', 'sensor', 'temperature', 5);
    const phSensorId = this._getEntityId('ph_value_entity', 'sensor', 'ph_value', 6);
    const orpSensorId = this._getEntityId('orp_value_entity', 'sensor', 'orp_value', 7);
    const targetPhId = this._getEntityId('target_ph_entity', 'number', 'target_ph');
    const targetOrpId = this._getEntityId('target_orp_entity', 'number', 'target_orp');

    const poolTempSensor = this.hass.states[poolTempSensorId];
    const phSensor = this.hass.states[phSensorId];
    const orpSensor = this.hass.states[orpSensorId];
    const targetPhEntity = this.hass.states[targetPhId];
    const targetOrpEntity = this.hass.states[targetOrpId];

    const poolTemp = poolTempSensor ? parseFloat(poolTempSensor.state) : undefined;
    const phValue = phSensor ? parseFloat(phSensor.state) : undefined;
    const orpValue = orpSensor ? parseFloat(orpSensor.state) : undefined;
    const targetPh = targetPhEntity ? parseFloat(targetPhEntity.state) : 7.2;
    const targetOrp = targetOrpEntity ? parseFloat(targetOrpEntity.state) : 700;

    const tempColor = poolTemp !== undefined ? StateColorHelper.getTemperatureColor(poolTemp) : undefined;
    const phColor = phValue !== undefined ? StateColorHelper.getPhColor(phValue, targetPh) : undefined;
    const orpColor = orpValue !== undefined ? StateColorHelper.getOrpColor(orpValue, targetOrp) : undefined;

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

    const phOk = phValue !== undefined && phValue >= 7.0 && phValue <= 7.4;
    const orpOk = orpValue !== undefined && orpValue >= 650 && orpValue <= 750;
    const issuesCount = [!phOk, !orpOk].filter(v => phValue !== undefined && orpValue !== undefined && v).length;
    const overallStatus = issuesCount === 0 ? 'Optimal' : issuesCount === 1 ? 'Achtung' : 'Eingriff nötig';
    const overallColor = issuesCount === 0 ? 'var(--vpc-success, #34C759)' : issuesCount === 1 ? 'var(--vpc-warning, #FF9F0A)' : 'var(--vpc-danger, #FF3B30)';
    const overallIcon = issuesCount === 0 ? 'mdi:water-check' : issuesCount === 1 ? 'mdi:alert' : 'mdi:alert-circle';

    const tempPct = poolTemp !== undefined ? this._getValuePercent(poolTemp, 18, 35) : undefined;

    return html`
      <ha-card class="${this._getCardClasses(issuesCount === 0 && (phValue !== undefined || orpValue !== undefined), config)}" style="--card-accent: ${accentColor}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon" style="--icon-accent: ${accentColor}">
              <ha-icon icon="${config.icon || 'mdi:water-check'}"></ha-icon>
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

          <div class="chem-dual-grid">
            ${phValue !== undefined ? html`
              <div class="chem-metric-card tooltip-wrap" style="--chem-color: ${phColor?.color || '#4CAF50'}" @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(phSensorId); }}">
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
              <div class="chem-metric-card tooltip-wrap" style="--chem-color: ${orpColor?.color || '#4CAF50'}" @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(orpSensorId); }}">
                <div class="chem-metric-header">
                  <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                  <span>ORP</span>
                </div>
                <div style="height: 80px; padding: 8px 0; display: flex; align-items: center; justify-content: center;">
                  ${gaugeNeedleSVG(orpValue, 500, 900, orpColor?.color || '#4CAF50')}
                </div>
                <div class="chem-metric-status">${getOrpStatus(orpValue)}</div>
                <div class="t-tip">
                  <div class="t-tip-title"><ha-icon icon="mdi:lightning-bolt"></ha-icon>ORP – Desinfektionskraft</div>
                  <div class="t-tip-desc">Redoxpotential misst, wie wirksam das Chlor Keime abtötet. Niedriger ORP = unzureichende Desinfektion. Ziel: ${targetOrp.toFixed(0)} mV</div>
                  <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>650 – 750 mV Optimal</div>
                  ${!orpOk ? html`<div class="t-tip-warn"><ha-icon icon="mdi:flask-outline"></ha-icon>${orpValue < 650 ? 'Chlor erhöhen' : 'Chlor reduzieren'}</div>` : ''}
                </div>
              </div>
            ` : ''}
          </div>

          ${issuesCount > 0 ? html`
            <div class="chem-recommendations">
              ${phValue !== undefined && !phOk ? html`
                <div class="chem-rec-row" style="--rec-color: ${phColor?.color || 'var(--vpc-warning)'}">
                  <ha-icon icon="mdi:ph"></ha-icon>
                  <span>${phValue < 7.0 ? 'pH zu sauer: pH+ Mittel zugeben' : 'pH zu basisch: pH- Mittel zugeben'}</span>
                </div>
              ` : ''}
              ${orpValue !== undefined && !orpOk ? html`
                <div class="chem-rec-row" style="--rec-color: ${orpColor?.color || 'var(--vpc-warning)'}">
                  <ha-icon icon="mdi:flask-outline"></ha-icon>
                  <span>${orpValue < 650 ? 'ORP zu niedrig: Chlordosierung erhöhen' : 'ORP zu hoch: Chlordosierung reduzieren'}</span>
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
    const name = config.name || entity.attributes.friendly_name || 'Sensor';
    const unit = entity.attributes.unit_of_measurement || '';
    const accentColor = config.accent_color || this._getAccentColor('overview', config);

    const numValue = parseFloat(state);
    const isNumeric = !isNaN(numValue);
    const deviceClass = entity.attributes.device_class;

    const tooltipMap: Record<string, { title: string; desc: string; ideal?: string }> = {
      temperature: { title: 'Temperatur', desc: 'Aktuelle Temperaturmessung des Sensors.', ideal: '24°C – 30°C (Pool)' },
      ph: { title: 'pH-Wert', desc: 'Säuregehalt des Poolwassers.', ideal: '7.0 – 7.4' },
      voltage: { title: 'ORP / Spannung', desc: 'Redoxpotential – Desinfektionskraft des Wassers.', ideal: '650 – 750 mV' },
      humidity: { title: 'Luftfeuchtigkeit', desc: 'Relative Luftfeuchtigkeit in Prozent.' },
      pressure: { title: 'Druck', desc: 'Aktueller Druckwert.' },
    };
    const tooltip = tooltipMap[deviceClass] || { title: name, desc: 'Sensorwert aus dem Violet Pool System.' };

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
    const position: number = entity.attributes.current_position ?? (state === 'open' ? 100 : 0);
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
            ${coverSVG(position, isMoving, accentColor)}
          </div>

          <!-- Position row -->
          <div class="info-row">
            <ha-icon icon="${isMoving ? 'mdi:rotate-3d-variant' : 'mdi:percent'}" style="--mdc-icon-size:17px"></ha-icon>
            <span class="info-label">Position</span>
            <span class="info-value" style="color:${coverStatusColor}">${Math.round(position)}%</span>
            ${isMoving ? html`<span class="cover-moving-pill">${state === 'opening' ? '▲ Öffnet' : '▼ Schließt'}</span>` : ''}
          </div>

          <!-- Position bar -->
          <div class="cover-pos-bar">
            <div class="cover-pos-fill" style="width:${position}%;background:${accentColor}"></div>
          </div>

          <!-- Position slider -->
          ${config.show_controls !== false ? html`
            <vpc-slider-control
              label="Position"
              min="0" max="100" step="5"
              .value="${Math.round(position)}" unit="%"
              @value-changed="${(e: CustomEvent) => { e.stopPropagation(); this.hass.callService('cover', 'set_cover_position', { entity_id: entityId, position: e.detail.value }); }}"
            ></vpc-slider-control>
          ` : ''}

          <!-- Open / Stop / Close buttons -->
          ${config.show_controls !== false ? html`
            <div class="cover-controls">
              <button class="cover-btn cover-btn-open ${state === 'open' ? 'cvr-active' : ''}"
                      @click="${(e: Event) => { e.stopPropagation(); this.hass.callService('cover', 'open_cover', { entity_id: entityId }); }}">
                <ha-icon icon="mdi:arrow-up" style="--mdc-icon-size:17px"></ha-icon>
                <span>Öffnen</span>
              </button>
              <button class="cover-btn cover-btn-stop ${state === 'stopped' ? 'cvr-active' : ''}"
                      @click="${(e: Event) => { e.stopPropagation(); this.hass.callService('cover', 'stop_cover', { entity_id: entityId }); }}">
                <ha-icon icon="mdi:stop" style="--mdc-icon-size:17px"></ha-icon>
                <span>Stop</span>
              </button>
              <button class="cover-btn cover-btn-close ${state === 'closed' ? 'cvr-active' : ''}"
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
    const brightness: number = entity.attributes.brightness ?? 128;
    const brightnessPercent = Math.round((brightness / 255) * 100);
    const rgb: [number, number, number] | null = entity.attributes.rgb_color ?? null;
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
            <!-- Color presets -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px;">
              ${[
                { label: '🔴 Rot', rgb: [255, 0, 0] },
                { label: '🟢 Grün', rgb: [0, 255, 0] },
                { label: '🔵 Blau', rgb: [0, 0, 255] },
                { label: '🟡 Gelb', rgb: [255, 255, 0] },
              ].map(preset => html`
                <button style="padding: 8px; border: none; border-radius: 8px; background: rgb(${preset.rgb[0]}, ${preset.rgb[1]}, ${preset.rgb[2]}); color: white; font-weight: 600; cursor: pointer; transition: transform 0.2s; font-size: 11px;"
                        @click="${(e: Event) => { e.stopPropagation(); this.hass.callService('light', 'turn_on', { entity_id: entityId, rgb_color: preset.rgb }); }}"
                        @mouseover="${(e: Event) => (e.target as HTMLElement).style.transform = 'scale(1.05)'}"
                        @mouseout="${(e: Event) => (e.target as HTMLElement).style.transform = 'scale(1)'}">
                  ${preset.label}
                </button>
              `)}
            </div>

            <!-- Color swatch with interactive color picker -->
            ${rgb ? html`
              <div class="light-color-swatch" style="background:${rgbStr};box-shadow:0 6px 24px ${rgbStr}50">
                <span class="light-color-label">RGB ${rgb[0]}, ${rgb[1]}, ${rgb[2]}</span>
                <span class="light-color-hint">Farbe wählen</span>
                <input type="color"
                       .value="${'#' + rgb.map((v: number) => v.toString(16).padStart(2, '0')).join('')}"
                       @click="${(e: Event) => e.stopPropagation()}"
                       @change="${(e: Event) => {
                         e.stopPropagation();
                         const hex = (e.target as HTMLInputElement).value;
                         const r = parseInt(hex.slice(1, 3), 16);
                         const g = parseInt(hex.slice(3, 5), 16);
                         const b = parseInt(hex.slice(5, 7), 16);
                         this.hass.callService('light', 'turn_on', { entity_id: entityId, rgb_color: [r, g, b] });
                       }}"/>
              </div>
            ` : colorTemp ? html`
              <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px;">
                <!-- Kelvin Slider for Color Temperature -->
                <div style="padding: 12px; background: var(--vpc-surface); border-radius: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: var(--vpc-text); margin-bottom: 8px;">Farbtemperatur</div>
                  <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                    <div style="width: 30px; text-align: center; font-size: 11px; color: var(--vpc-text-secondary);">🔵<br/>6500K</div>
                    <input type="range" min="154" max="500" value="${colorTemp || 250}" style="flex: 1; height: 6px; cursor: pointer;"
                           @change="${(e: Event) => {
                             const mirek = parseInt((e.target as HTMLInputElement).value);
                             this.hass.callService('light', 'turn_on', { entity_id: entityId, color_temp: mirek });
                           }}"/>
                    <div style="width: 30px; text-align: center; font-size: 11px; color: var(--vpc-text-secondary);">🟠<br/>2000K</div>
                  </div>
                  <div style="margin-top: 8px; padding: 8px; background: linear-gradient(90deg, #FFA500 0%, #FFD700 50%, #87CEEB 100%); border-radius: 4px; height: 20px;"></div>
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
    const filterEntityId = (config as any).filter_entity;
    const backwashEntityId = (config as any).backwash_entity;

    const pressureEntity = this.hass.states[pressureEntityId];
    if (!pressureEntity) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Filter nicht gefunden</span><span class="error-entity">${pressureEntityId}</span></div></div></ha-card>`;
    }

    const pressure: number = parseFloat(pressureEntity.state) || 0;

    const name = config.name || pressureEntity.attributes.friendly_name || 'Filter';
    const accentColor = this._getAccentColor('filter', config);

    const filterEntity = filterEntityId ? this.hass.states[filterEntityId] : undefined;
    const backwashEntity = backwashEntityId ? this.hass.states[backwashEntityId] : undefined;
    const isFilterOn = filterEntity ? filterEntity.state === 'on' : true;
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

    // Arc gauge: semicircle, 0-3 bar range

    return html`
      <ha-card class="${this._getCardClasses(isFilterOn, config)}"
               style="--card-accent: ${accentColor}"
               @click="${() => this._showMoreInfo(pressureEntityId)}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isFilterOn ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">
              ${config.icon
                ? html`<ha-icon icon="${config.icon}"></ha-icon>`
                : html`<ha-icon icon="${isBackwashing ? 'mdi:rotate-right' : 'mdi:filter'}" class="${isBackwashing ? 'pump-running' : ''}"></ha-icon>`}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="${isBackwashing ? 'color:var(--vpc-warning,#FF9F0A)' : ''}">
                ${isBackwashing ? 'Rückspülung läuft…' : isFilterOn ? 'Aktiv' : 'Aus'}
              </span>
            </div>
            ${config.show_state !== false ? html`<vpc-status-badge .state="${isFilterOn ? 'on' : 'off'}" .pulse="${isBackwashing}"></vpc-status-badge>` : ''}
          </div>

          <!-- Pressure gauge with animated needle -->
          <div class="filter-gauge-wrap" style="padding: 12px 0;">
            ${filterGaugeSVG(pressure, 3, accentColor)}
          </div>

          <!-- Status row -->
          <div class="info-row ${pressure >= 1.6 ? 'info-row-warning' : ''}">
            <ha-icon icon="mdi:gauge" style="--mdc-icon-size:17px;color:${pressureColor}"></ha-icon>
            <span class="info-label">Filterdruck</span>
            <span class="info-value" style="color:${pressureColor}">${pressureLabel}</span>
          </div>

          ${filterEntity ? html`
            <div class="info-row">
              <ha-icon icon="${isFilterOn ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}"
                       style="--mdc-icon-size:17px;color:${isFilterOn ? 'var(--vpc-success,#34C759)' : 'var(--vpc-text-secondary)'}"></ha-icon>
              <span class="info-label">Filterpumpe</span>
              <span class="info-value">${isFilterOn ? 'An' : 'Aus'}</span>
            </div>
          ` : ''}

          ${config.show_controls !== false && backwashEntity ? html`
            <div class="cover-controls">
              <button class="cover-btn ${isBackwashing ? 'cover-btn-close cvr-active' : 'cover-btn-open'}"
                      style="--cvr-btn-color:${accentColor}"
                      @click="${(e: Event) => { e.stopPropagation(); this.hass.callService('switch', isBackwashing ? 'turn_off' : 'turn_on', { entity_id: backwashEntityId }); }}">
                <ha-icon icon="${isBackwashing ? 'mdi:stop' : 'mdi:rotate-right'}" style="--mdc-icon-size:17px"></ha-icon>
                <span>${isBackwashing ? 'Rückspülung stoppen' : 'Rückspülen starten'}</span>
              </button>
            </div>
          ` : ''}
        </div>
      </ha-card>`;
  }

  /**
   * Render Statistics Card - displays trend data and graphs
   */
  private renderStatisticsCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entity = config.entity ? this.hass.states[config.entity] : undefined;
    const name = config.name || entity?.attributes.friendly_name || 'Statistics';
    const accentColor = this._getAccentColor('statistics', config);

    if (!entity) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Entity Not Found</span><span class="error-entity">${config.entity}</span></div></div></ha-card>`;
    }

    const currentValue = parseFloat(entity.state) || 0;
    // Mock historical data for demo
    const historicalValues = [2, 5, 8, 12, 15, 18, 16, 19, 22, 20, 25, 28];

    return html`
      <ha-card class="${this._getCardClasses(true, config)}" style="--card-accent: ${accentColor}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon icon-active" style="--icon-accent: ${accentColor}">
              <ha-icon icon="${config.icon || 'mdi:chart-line'}"></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">Trend Analysis</span>
            </div>
          </div>

          <div class="sensor-value-display" style="margin-top: 8px">
            <div class="sensor-big-value">
              <span class="sensor-num">${currentValue.toFixed(1)}</span>
              <span class="sensor-unit">${entity.attributes.unit_of_measurement || ''}</span>
            </div>
          </div>

          <div style="margin-top: 16px; padding: 12px; background: var(--vpc-surface); border-radius: 12px;">
            ${chartSVG(historicalValues, accentColor)}
          </div>

          <div class="info-row">
            <ha-icon icon="mdi:trending-up" style="--mdc-icon-size:17px;color:${accentColor}"></ha-icon>
            <span class="info-label">Last 12 readings</span>
            <span class="info-value">+${(Math.max(...historicalValues) - Math.min(...historicalValues)).toFixed(1)}</span>
          </div>
        </div>
      </ha-card>
    `;
  }

  /**
   * Render Weather Impact Card - shows how weather affects pool conditions
   */
  private renderWeatherCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entity = config.entity ? this.hass.states[config.entity] : undefined;
    const name = config.name || entity?.attributes.friendly_name || 'Weather';
    const accentColor = this._getAccentColor('weather', config);

    if (!entity) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Entity Not Found</span><span class="error-entity">${config.entity}</span></div></div></ha-card>`;
    }

    return html`
      <ha-card class="${this._getCardClasses(true, config)}" style="--card-accent: ${accentColor}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon icon-active" style="--icon-accent: ${accentColor}">
              <ha-icon icon="${config.icon || 'mdi:cloud'}"></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">Current Conditions</span>
            </div>
          </div>

          <div class="info-row">
            <ha-icon icon="mdi:temperature-celsius" style="--mdc-icon-size:17px;color:var(--vpc-warning, #FF9F0A)"></ha-icon>
            <span class="info-label">Air Temperature</span>
            <span class="info-value">${entity.attributes.temperature || 'N/A'}°</span>
          </div>

          <div class="info-row">
            <ha-icon icon="mdi:water-percent" style="--mdc-icon-size:17px;color:#0A84FF"></ha-icon>
            <span class="info-label">Humidity</span>
            <span class="info-value">${entity.attributes.humidity || 'N/A'}%</span>
          </div>

          <div class="info-row">
            <ha-icon icon="mdi:weather-cloudy" style="--mdc-icon-size:17px;color:#8E8E93"></ha-icon>
            <span class="info-label">Condition</span>
            <span class="info-value">${entity.state || 'Unknown'}</span>
          </div>

          <div style="margin-top: 12px; padding: 12px; background: var(--vpc-surface); border-radius: 12px; font-size: 12px; color: var(--vpc-text-secondary);">
            ⚠️ Rain forecasted - may affect water chemistry. Consider increasing filtration.
          </div>
        </div>
      </ha-card>
    `;
  }

  /**
   * Render Maintenance Card - shows schedules and recommendations
   */
  private renderMaintenanceCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const accentColor = this._getAccentColor('maintenance', config);
    const name = config.name || 'Maintenance';

    return html`
      <ha-card class="${this._getCardClasses(true, config)}" style="--card-accent: ${accentColor}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon icon-active" style="--icon-accent: ${accentColor}">
              <ha-icon icon="${config.icon || 'mdi:wrench'}"></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">Schedule & Tasks</span>
            </div>
          </div>

          <div class="info-row info-row-warning">
            <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size:17px;color:var(--vpc-warning, #FF9F0A)"></ha-icon>
            <span class="info-label">Filter Backwash</span>
            <span class="info-value">Due soon</span>
          </div>

          <div class="info-row">
            <ha-icon icon="mdi:test-tube" style="--mdc-icon-size:17px;color:var(--vpc-primary)"></ha-icon>
            <span class="info-label">Water Test</span>
            <span class="info-value">3 days ago</span>
          </div>

          <div class="info-row">
            <ha-icon icon="mdi:calendar-check" style="--mdc-icon-size:17px;color:var(--vpc-success, #34C759)"></ha-icon>
            <span class="info-label">Quarterly Service</span>
            <span class="info-value">In 45 days</span>
          </div>

          <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 8px;">
            <button style="padding: 10px 16px; border: none; border-radius: 10px; background: ${accentColor}; color: white; font-weight: 600; cursor: pointer; transition: all 0.2s;">
              📝 Log Task
            </button>
          </div>
        </div>
      </ha-card>
    `;
  }

  /**
   * Render Alerts Card - shows active alerts and notifications
   */
  private renderAlertsCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const accentColor = this._getAccentColor('alerts', config);
    const name = config.name || 'System Alerts';

    // Mock alerts
    const alerts = [
      { severity: 'warning' as const, message: 'pH slightly elevated', icon: 'mdi:water-alert' },
      { severity: 'info' as const, message: 'Backwash scheduled', icon: 'mdi:information' },
    ];

    return html`
      <ha-card class="${this._getCardClasses(true, config)}" style="--card-accent: ${accentColor}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon icon-active" style="--icon-accent: ${accentColor}">
              <ha-icon icon="${config.icon || 'mdi:bell-alert'}"></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">${alerts.length} active</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px;">
            ${alerts.map(alert => {
              const bgColor = alert.severity === 'error' ? 'rgba(255,59,48,0.1)' :
                             alert.severity === 'warning' ? 'rgba(255,159,10,0.1)' :
                             'rgba(0,122,255,0.08)';
              const textColor = alert.severity === 'error' ? '#FF3B30' :
                               alert.severity === 'warning' ? '#FF9F0A' :
                               '#0A84FF';
              return html`
                <div class="warning-row" style="background: ${bgColor}; border-color: ${textColor}33;">
                  <ha-icon icon="${alert.icon}" style="--mdc-icon-size:16px;color:${textColor}"></ha-icon>
                  <span style="flex:1;color:${textColor}">${alert.message}</span>
                </div>
              `;
            })}
          </div>
        </div>
      </ha-card>
    `;
  }

  /**
   * Render Comparison Card - shows current vs target values
   */
  private renderComparisonCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entity = config.entity ? this.hass.states[config.entity] : undefined;
    const targetEntity = (config as any).target_entity ? this.hass.states[(config as any).target_entity] : undefined;
    const name = config.name || entity?.attributes.friendly_name || 'Comparison';
    const accentColor = this._getAccentColor('comparison', config);

    if (!entity) {
      return html`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Entity Not Found</span><span class="error-entity">${config.entity}</span></div></div></ha-card>`;
    }

    const current = parseFloat(entity.state) || 0;
    const target = targetEntity ? parseFloat(targetEntity.state) : 25;
    const diff = current - target;
    const diffPercent = ((diff / target) * 100).toFixed(1);
    const isHigher = diff > 0;

    return html`
      <ha-card class="${this._getCardClasses(true, config)}" style="--card-accent: ${accentColor}">
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon icon-active" style="--icon-accent: ${accentColor}">
              <ha-icon icon="${config.icon || 'mdi:compare'}"></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">Current vs Target</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px;">
            <div style="padding: 14px; background: var(--vpc-surface); border-radius: 12px; text-align: center;">
              <div style="font-size: 11px; color: var(--vpc-text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Current</div>
              <div style="font-size: 32px; font-weight: 700; color: ${accentColor}; line-height: 1;">${current.toFixed(1)}</div>
              <div style="font-size: 13px; color: var(--vpc-text-secondary); margin-top: 3px;">${entity.attributes.unit_of_measurement || ''}</div>
            </div>
            <div style="padding: 14px; background: var(--vpc-surface); border-radius: 12px; text-align: center;">
              <div style="font-size: 11px; color: var(--vpc-text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Target</div>
              <div style="font-size: 32px; font-weight: 700; color: var(--vpc-success, #34C759); line-height: 1;">${target.toFixed(1)}</div>
              <div style="font-size: 13px; color: var(--vpc-text-secondary); margin-top: 3px;">${entity.attributes.unit_of_measurement || ''}</div>
            </div>
          </div>

          <div class="info-row" style="margin-top: 12px; background: ${isHigher ? 'rgba(255,59,48,0.08)' : 'rgba(52,199,89,0.08)'};">
            <ha-icon icon="${isHigher ? 'mdi:trending-up' : 'mdi:trending-down'}" style="--mdc-icon-size:17px;color:${isHigher ? '#FF3B30' : '#34C759'}"></ha-icon>
            <span class="info-label">Difference</span>
            <span class="info-value" style="color:${isHigher ? '#FF3B30' : '#34C759'}">${isHigher ? '+' : ''}${diff.toFixed(1)} (${diffPercent}%)</span>
          </div>
        </div>
      </ha-card>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`:host{--vpc-font:-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;--vpc-spacing:18px;--vpc-radius:20px;--vpc-inner-radius:12px;--vpc-bg:var(--ha-card-background, var(--card-background-color, #ffffff));--vpc-surface:rgba(120,120,128,0.06);--vpc-border:none;--vpc-shadow:0 2px 20px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04);--vpc-backdrop:none;--vpc-primary:var(--primary-color, #007AFF);--vpc-success:#34C759;--vpc-warning:#FF9F0A;--vpc-danger:#FF3B30;--vpc-purple:#AF52DE;--vpc-teal:#5AC8FA;--vpc-orange:#FF9500;--vpc-indigo:#5856D6;--vpc-text:var(--primary-text-color, #1C1C1E);--vpc-text-secondary:var(--secondary-text-color, #6D6D72);--vpc-text-tertiary:rgba(60,60,67,0.45);--vpc-icon-size:22px;--vpc-transition:all 0.28s cubic-bezier(0.34, 1.4, 0.64, 1);--vpc-transition-fast:all 0.18s ease;--card-accent:var(--primary-color, #007AFF);--icon-accent:var(--card-accent);display:block;font-family:var(--vpc-font);}ha-card.theme-apple{--vpc-bg:#ffffff;--vpc-shadow:0 2px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04);--vpc-radius:22px;--vpc-inner-radius:13px;--vpc-surface:rgba(120,120,128,0.06);--vpc-primary:#007AFF;}ha-card.theme-dark{--vpc-bg:#1C1C1E;--vpc-surface:rgba(255,255,255,0.06);--vpc-border:1px solid rgba(255,255,255,0.08);--vpc-shadow:0 4px 30px rgba(0,0,0,0.4);--vpc-radius:22px;--vpc-text:#FFFFFF;--vpc-text-secondary:#8E8E93;--vpc-text-tertiary:rgba(255,255,255,0.25);--vpc-primary:#0A84FF;--vpc-success:#30D158;--vpc-warning:#FFD60A;--vpc-danger:#FF453A;}ha-card.theme-luxury, ha-card.theme-glass{--vpc-bg:rgba(255,255,255,0.72);--vpc-backdrop:blur(24px) saturate(180%);--vpc-radius:26px;--vpc-border:1px solid rgba(255,255,255,0.4);--vpc-shadow:0 8px 40px rgba(31,38,135,0.12), 0 2px 8px rgba(0,0,0,0.06);}ha-card.theme-modern{--vpc-radius:18px;--vpc-spacing:20px;--vpc-shadow:0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04);}ha-card.theme-minimalist{--vpc-radius:14px;--vpc-shadow:none;--vpc-border:1px solid rgba(0,0,0,0.07);--vpc-surface:transparent;}ha-card.theme-neon{--vpc-bg:#0D0D14;--vpc-border:1px solid rgba(0,212,255,0.2);--vpc-shadow:0 0 30px rgba(0,212,255,0.07);--vpc-radius:14px;--vpc-primary:#00D4FF;--vpc-text:#E8E8F0;--vpc-text-secondary:#6E6E80;--vpc-surface:rgba(0,212,255,0.04);--vpc-success:#00E676;--vpc-warning:#FFEA00;--vpc-danger:#FF1744;}ha-card.theme-premium{--vpc-bg:linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(248,248,255,0.96) 100%);--vpc-radius:24px;--vpc-shadow:0 12px 50px -8px rgba(80,80,160,0.15), 0 0 0 1px rgba(255,255,255,0.9);--vpc-border:1px solid rgba(255,255,255,0.7);}@media (prefers-color-scheme:dark){ha-card.theme-apple{--vpc-bg:#1C1C1E;--vpc-surface:rgba(255,255,255,0.06);--vpc-border:1px solid rgba(255,255,255,0.08);--vpc-text:#FFFFFF;--vpc-text-secondary:#8E8E93;--vpc-primary:#0A84FF;--vpc-success:#30D158;--vpc-warning:#FFD60A;--vpc-danger:#FF453A;}ha-card.theme-luxury, ha-card.theme-glass{--vpc-bg:rgba(18,18,30,0.80);--vpc-border:1px solid rgba(255,255,255,0.09);--vpc-shadow:0 8px 40px rgba(0,0,0,0.45);}ha-card.theme-premium{--vpc-bg:linear-gradient(145deg, rgba(28,28,38,0.97) 0%, rgba(20,20,32,0.97) 100%);--vpc-border:1px solid rgba(255,255,255,0.07);}ha-card.theme-minimalist{--vpc-border:1px solid rgba(255,255,255,0.07);}ha-card.theme-modern{--vpc-shadow:0 1px 3px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.04);}}ha-card{font-family:var(--vpc-font);padding:var(--vpc-spacing);background:var(--vpc-bg);border-radius:var(--vpc-radius);box-shadow:var(--vpc-shadow);border:var(--vpc-border);backdrop-filter:var(--vpc-backdrop);-webkit-backdrop-filter:var(--vpc-backdrop);transition:transform 0.22s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.22s ease;overflow:visible;position:relative;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;}ha-card:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.11), 0 2px 6px rgba(0,0,0,0.05);}ha-card:active{transform:scale(0.985);box-shadow:0 2px 8px rgba(0,0,0,0.07);transition:transform 0.1s ease, box-shadow 0.1s ease;}ha-card.theme-dark:hover{box-shadow:0 8px 30px rgba(0,0,0,0.5);}ha-card.theme-neon:hover{box-shadow:0 0 40px rgba(0,212,255,0.12), 0 4px 20px rgba(0,0,0,0.3);}ha-card.theme-neon.is-active{box-shadow:0 0 50px rgba(0,212,255,0.2), inset 0 0 20px rgba(0,212,255,0.04);border-color:rgba(0,212,255,0.35);}.accent-bar{position:absolute;top:0;left:0;right:0;height:3px;background:var(--card-accent);opacity:0.65;transition:opacity 0.3s ease, height 0.3s ease;}ha-card.is-active .accent-bar{height:4px;opacity:1;}ha-card.theme-neon .accent-bar{background:linear-gradient(90deg, #00D4FF, #7C4DFF, #00D4FF);box-shadow:0 0 12px rgba(0,212,255,0.5);height:2px;animation:neon-flow 3s linear infinite;}ha-card.theme-minimalist .accent-bar{height:2px;opacity:0.45;}@keyframes neon-flow{0%{background-position:0% 50%;}100%{background-position:200% 50%;}}.card-content{display:flex;flex-direction:column;gap:14px;}.card-content.compact{flex-direction:row;align-items:center;gap:14px;}.header{display:flex;align-items:center;gap:14px;}.header-icon{width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 12%, transparent);transition:background 0.25s ease, box-shadow 0.25s ease;flex-shrink:0;}.header-icon.icon-active{background:color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 18%, transparent);box-shadow:0 0 0 5px color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 8%, transparent);}ha-card.theme-neon .header-icon{background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.18);}ha-card.theme-neon .header-icon.icon-active{box-shadow:0 0 16px rgba(0,212,255,0.25);}.header-icon ha-icon{--mdc-icon-size:24px;color:var(--icon-accent, var(--vpc-primary));}.header-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}.name{font-family:var(--vpc-font);font-size:16px;font-weight:600;letter-spacing:-0.3px;color:var(--vpc-text);line-height:1.25;}.header-subtitle{font-family:var(--vpc-font);font-size:13px;font-weight:400;color:var(--vpc-text-secondary);line-height:1.2;}ha-icon{--mdc-icon-size:var(--vpc-icon-size);color:var(--vpc-primary);transition:color 0.2s ease;}@keyframes rotate{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}@keyframes pulse-glow{0%, 100%{opacity:1;transform:scale(1);}50%{opacity:0.65;transform:scale(0.95);}}@keyframes breathe{0%, 100%{transform:scale(1);opacity:1;}50%{transform:scale(1.08);opacity:0.85;}}@keyframes spin-slow{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}.pump-running{animation:rotate 1.8s linear infinite;}.heater-active{animation:breathe 2.5s ease-in-out infinite;color:var(--vpc-danger, #FF3B30);}.solar-active{animation:breathe 3s ease-in-out infinite;color:var(--vpc-warning, #FF9F0A);}.dosing-active{animation:pulse-glow 2s ease-in-out infinite;color:var(--vpc-success, #34C759);}.speed-segments-container{display:flex;align-items:center;gap:8px;}.speed-segments{display:flex;flex:1;gap:6px;}.speed-segment{flex:1;display:flex;align-items:center;justify-content:center;gap:4px;padding:9px 6px;border-radius:var(--vpc-inner-radius, 12px);border:none;background:var(--vpc-surface, rgba(120,120,128,0.06));color:var(--vpc-text-secondary);font-family:var(--vpc-font);font-size:12px;font-weight:500;cursor:pointer;transition:all 0.18s ease;-webkit-tap-highlight-color:transparent;letter-spacing:-0.2px;position:relative;overflow:visible;}.speed-segment:hover{background:color-mix(in srgb, var(--seg-color) 10%, transparent);color:var(--seg-color);}.speed-segment.seg-active{background:color-mix(in srgb, var(--seg-color) 15%, transparent);color:var(--seg-color);font-weight:600;box-shadow:inset 0 0 0 1.5px color-mix(in srgb, var(--seg-color) 40%, transparent);}.speed-segment.seg-past{background:color-mix(in srgb, var(--seg-color) 08%, transparent);color:color-mix(in srgb, var(--seg-color) 70%, var(--vpc-text-secondary));}.speed-off-btn{width:38px;height:38px;border-radius:12px;border:none;background:var(--vpc-surface);color:var(--vpc-text-secondary);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.18s ease;flex-shrink:0;-webkit-tap-highlight-color:transparent;}.speed-off-btn:hover{background:rgba(255,59,48,0.1);color:var(--vpc-danger, #FF3B30);}.speed-off-btn.seg-active{background:rgba(255,59,48,0.12);color:var(--vpc-danger, #FF3B30);box-shadow:inset 0 0 0 1.5px rgba(255,59,48,0.3);}ha-card.theme-neon .speed-segment{border:1px solid rgba(0,212,255,0.1);}ha-card.theme-neon .speed-segment.seg-active{box-shadow:0 0 12px color-mix(in srgb, var(--seg-color) 50%, transparent);}.temp-hero{display:flex;align-items:center;gap:12px;padding:6px 0 4px;}.temp-hero-main{display:flex;align-items:baseline;gap:4px;}.temp-hero-value{font-family:var(--vpc-font);font-size:44px;font-weight:700;line-height:1;letter-spacing:-2px;color:var(--temp-color, var(--vpc-text));}.temp-hero-unit{font-size:22px;font-weight:400;color:var(--temp-color, var(--vpc-text));opacity:0.65;letter-spacing:-0.5px;}.temp-hero-target-pill{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:100px;background:var(--vpc-surface);font-size:13px;font-weight:500;color:var(--vpc-text-secondary);white-space:nowrap;}.temp-range-bar, .chem-range-bar{display:flex;flex-direction:column;gap:5px;}.temp-range-track, .chem-range-track{height:6px;background:var(--vpc-surface);border-radius:100px;position:relative;overflow:visible;}.temp-range-fill, .chem-range-fill{height:100%;border-radius:100px;transition:width 0.5s cubic-bezier(0.34,1.4,0.64,1);}.temp-range-target{position:absolute;top:50%;transform:translate(-50%, -50%);width:3px;height:14px;background:var(--vpc-text-secondary);border-radius:2px;opacity:0.7;}.temp-range-labels, .chem-range-labels{display:flex;justify-content:space-between;font-size:11px;font-weight:400;color:var(--vpc-text-tertiary, rgba(60,60,67,0.45));letter-spacing:0px;}.dosing-value-block{display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:var(--vpc-inner-radius, 12px);background:var(--vpc-surface);}ha-card.theme-neon .dosing-value-block{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);}.dosing-value-row{display:flex;align-items:center;justify-content:space-between;gap:10px;}.dosing-value-main{display:flex;align-items:baseline;gap:6px;}.dosing-label-tag{font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:var(--vpc-text-secondary);}.dosing-current-value{font-family:var(--vpc-font);font-size:32px;font-weight:700;line-height:1;letter-spacing:-1px;}.dosing-current-unit{font-size:15px;font-weight:400;opacity:0.65;}.dosing-status-pill{padding:4px 10px;border-radius:100px;font-size:12px;font-weight:600;white-space:nowrap;}.chem-range-target{position:absolute;top:50%;transform:translate(-50%, -50%);display:flex;flex-direction:column;align-items:center;gap:2px;}.chem-target-line{width:2px;height:14px;background:var(--vpc-text);border-radius:2px;opacity:0.5;}.chem-target-label{position:absolute;top:16px;font-size:9px;font-weight:600;color:var(--vpc-text-secondary);white-space:nowrap;transform:translateX(-50%);}.chem-mini-bar{width:100%;height:4px;background:var(--vpc-surface, rgba(120,120,128,0.1));border-radius:100px;overflow:hidden;position:relative;margin-top:4px;}.chem-mini-fill{height:100%;border-radius:100px;transition:width 0.5s cubic-bezier(0.34,1.4,0.64,1);}.chem-mini-ideal{position:absolute;top:0;height:100%;background:rgba(52,199,89,0.18);border-radius:2px;}.solar-temp-comparison{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px;background:var(--vpc-surface);border-radius:var(--vpc-inner-radius, 12px);}ha-card.theme-neon .solar-temp-comparison{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);}.solar-temp-tile{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;}.solar-temp-tile ha-icon{--mdc-icon-size:18px;color:var(--vpc-text-secondary);}.solar-temp-tile-val{font-size:20px;font-weight:700;letter-spacing:-0.5px;color:var(--vpc-text);line-height:1;}.solar-temp-tile-label{font-size:11px;font-weight:500;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.3px;}.solar-delta-badge{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 12px;border-radius:100px;font-size:12px;font-weight:700;}.delta-great{background:rgba(52,199,89,0.12);color:var(--vpc-success, #34C759);}.delta-ok{background:rgba(255,159,10,0.12);color:var(--vpc-warning, #FF9F0A);}.delta-low{background:rgba(255,59,48,0.10);color:var(--vpc-danger, #FF3B30);}.delta-hint-text{font-size:12px;font-weight:400;color:var(--vpc-text-secondary);padding:2px 0;}.chemistry-grid{display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;}.chemistry-card{display:flex;flex-direction:column;align-items:center;gap:2px;padding:14px 8px 12px;border-radius:var(--vpc-inner-radius, 12px);background:var(--vpc-surface);cursor:pointer;transition:transform 0.18s ease, background 0.18s ease;position:relative;overflow:visible;}.chemistry-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--chem-color, var(--vpc-primary));opacity:0.6;border-radius:100px;}.chemistry-card:hover{transform:scale(1.02);background:color-mix(in srgb, var(--chem-color) 8%, var(--vpc-surface));}ha-card.theme-neon .chemistry-card{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);}.chem-icon-wrap{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--chem-color, var(--vpc-primary)) 12%, transparent);margin-bottom:4px;}.chem-icon-wrap ha-icon{--mdc-icon-size:16px;color:var(--chem-color, var(--vpc-primary));}.chemistry-val{font-family:var(--vpc-font);font-size:18px;font-weight:700;letter-spacing:-0.5px;color:var(--chem-color, var(--vpc-text));line-height:1;}.chemistry-unit{font-size:11px;font-weight:500;color:var(--vpc-text-secondary);letter-spacing:0.2px;}.chemistry-label{font-size:10px;font-weight:500;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.4px;}.overview-warning-badge{width:22px;height:22px;border-radius:50%;background:var(--vpc-danger, #FF3B30);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}.overview-active-dot{width:10px;height:10px;border-radius:50%;background:var(--vpc-success, #34C759);box-shadow:0 0 8px rgba(52,199,89,0.5);flex-shrink:0;animation:pulse-glow 2s ease-in-out infinite;}.overview-section{display:flex;flex-direction:column;gap:6px;}.section-title{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.6px;padding:0 2px;}.section-count{margin-left:auto;font-size:11px;font-weight:500;color:var(--vpc-text-tertiary);}.warning-title ha-icon{color:var(--vpc-warning, #FF9F0A);}.warning-title{color:var(--vpc-warning, #FF9F0A);}.temp-hero{display:flex;align-items:baseline;gap:4px;padding:8px 0;}.temp-hero-value{font-size:42px;font-weight:800;line-height:1;color:var(--temp-color, var(--vpc-text));letter-spacing:-1px;}.temp-hero-unit{font-size:22px;font-weight:500;color:var(--temp-color, var(--vpc-text));opacity:0.7;}.temp-hero-target{font-size:16px;font-weight:500;color:var(--vpc-text-secondary);margin-left:12px;}.info-row{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--vpc-inner-radius, 12px);background:var(--vpc-surface);font-size:14px;color:var(--vpc-text);font-family:var(--vpc-font);}ha-card.theme-neon .info-row{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);}.info-row ha-icon{--mdc-icon-size:17px;color:var(--vpc-text-secondary);flex-shrink:0;}.info-label{flex:1;font-weight:400;color:var(--vpc-text-secondary);}.info-value{font-weight:600;color:var(--vpc-text);letter-spacing:-0.2px;}.info-badge{padding:3px 9px;border-radius:100px;font-size:11px;font-weight:600;}.info-badge.warning{background:color-mix(in srgb, var(--vpc-warning, #FF9F0A) 12%, transparent);color:var(--vpc-warning, #FF9F0A);}.info-row-warning{background:color-mix(in srgb, var(--vpc-warning, #FF9F0A) 06%, transparent);border:1px solid color-mix(in srgb, var(--vpc-warning, #FF9F0A) 18%, transparent);}.solar-temps{display:flex;flex-direction:column;gap:8px;}.chemistry-grid{display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;}.chemistry-card{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:14px;background:rgba(var(--rgb-primary-text-color, 0,0,0), 0.03);cursor:pointer;transition:var(--vpc-transition);border:1px solid transparent;}.chemistry-card:hover{background:rgba(var(--rgb-primary-text-color, 0,0,0), 0.06);transform:translateY(-1px);}ha-card.theme-neon .chemistry-card{background:rgba(0, 255, 255, 0.04);border:1px solid rgba(0, 255, 255, 0.08);}.chemistry-card ha-icon{--mdc-icon-size:20px;color:var(--chem-color, var(--vpc-primary));}.chemistry-val{font-size:16px;font-weight:700;color:var(--chem-color, var(--vpc-text));line-height:1;}.chemistry-label{font-size:11px;font-weight:500;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.3px;}.overview-section{display:flex;flex-direction:column;gap:8px;}.section-title{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.5px;padding:0 2px;}.section-title ha-icon{--mdc-icon-size:16px;color:var(--vpc-text-secondary);}.warning-title ha-icon{color:#ef6c00;}.warning-title{color:#ef6c00;}.device-list{display:flex;flex-direction:column;gap:3px;}.device-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:var(--vpc-inner-radius, 12px);background:var(--vpc-surface);cursor:pointer;transition:background 0.18s ease, transform 0.15s ease;}.device-row:hover{background:color-mix(in srgb, var(--vpc-primary) 6%, var(--vpc-surface));transform:scale(1.005);}ha-card.theme-neon .device-row{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.06);}.device-icon-wrap{width:32px;height:32px;border-radius:9px;background:var(--vpc-surface);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.2s ease;}.device-icon-wrap ha-icon{--mdc-icon-size:18px;color:var(--vpc-text-secondary);}.device-icon-active{background:color-mix(in srgb, var(--vpc-primary) 12%, transparent);}.device-icon-active ha-icon{color:var(--vpc-primary) !important;}.device-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;}.device-name{font-weight:500;font-size:14px;letter-spacing:-0.1px;color:var(--vpc-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.device-status{color:var(--vpc-text-secondary);font-size:12px;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.device-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}.dot-active{background:var(--vpc-success, #34C759);box-shadow:0 0 6px rgba(52,199,89,0.5);}.dot-inactive{background:var(--vpc-text-secondary);opacity:0.25;}.warning-list{display:flex;flex-direction:column;gap:5px;}.warning-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--vpc-inner-radius, 12px);background:color-mix(in srgb, var(--vpc-warning, #FF9F0A) 8%, transparent);border:1px solid color-mix(in srgb, var(--vpc-warning, #FF9F0A) 20%, transparent);font-size:13px;font-weight:500;color:var(--vpc-warning, #FF9F0A);}.warning-row ha-icon{color:var(--vpc-warning, #FF9F0A);flex-shrink:0;}.all-ok-display{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border-radius:var(--vpc-inner-radius, 12px);background:color-mix(in srgb, var(--vpc-success, #34C759) 8%, transparent);border:1px solid color-mix(in srgb, var(--vpc-success, #34C759) 18%, transparent);color:var(--vpc-success, #34C759);font-weight:500;font-size:14px;}.all-ok-display ha-icon{color:var(--vpc-success, #34C759);}ha-card.compact-card{padding:12px 14px;}.compact-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--vpc-surface);flex-shrink:0;transition:background 0.2s ease;}.compact-icon-active{background:color-mix(in srgb, var(--vpc-primary) 12%, transparent);}.compact-icon ha-icon{--mdc-icon-size:20px;}.compact-icon ha-icon.active{color:var(--vpc-primary);}.compact-icon ha-icon.inactive{color:var(--vpc-text-secondary);opacity:0.45;}.compact-info{flex:1;min-width:0;}.compact-details{display:flex;gap:8px;font-size:12px;margin-top:2px;align-items:center;}.compact-value{font-weight:600;color:var(--vpc-text);letter-spacing:-0.2px;}.compact-detail{color:var(--vpc-text-secondary);font-size:11px;}.system-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:20px;}.error-state{display:flex;align-items:center;gap:14px;padding:20px;}.error-icon{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(244, 67, 54, 0.1);}.error-icon ha-icon{--mdc-icon-size:24px;color:#d32f2f;}.error-info{display:flex;flex-direction:column;gap:2px;}.error-title{font-size:14px;font-weight:600;color:#d32f2f;}.error-entity{font-size:12px;color:var(--vpc-text-secondary);font-family:monospace;}ha-card.size-small{--vpc-spacing:12px;--vpc-icon-size:20px;--vpc-radius:16px;}ha-card.size-small .header-icon{width:38px;height:38px;border-radius:11px;}ha-card.size-small .name{font-size:14px;}ha-card.size-small .temp-hero-value{font-size:34px;letter-spacing:-1.5px;}ha-card.size-large{--vpc-spacing:22px;--vpc-icon-size:28px;--vpc-radius:26px;}ha-card.size-large .header-icon{width:54px;height:54px;border-radius:17px;}ha-card.size-large .name{font-size:18px;}ha-card.size-large .temp-hero-value{font-size:56px;letter-spacing:-3px;}ha-card.size-fullscreen{--vpc-spacing:28px;--vpc-icon-size:32px;--vpc-radius:28px;height:100%;min-height:80vh;}ha-card.size-fullscreen .header-icon{width:60px;height:60px;border-radius:19px;}ha-card.size-fullscreen .name{font-size:20px;}ha-card.size-fullscreen .temp-hero-value{font-size:68px;letter-spacing:-4px;}ha-card.animation-none{transition:none !important;}ha-card.animation-none:hover, ha-card.animation-none:active{transform:none !important;}ha-card.animation-subtle{transition:transform 0.15s ease, box-shadow 0.15s ease;}ha-card.animation-subtle:hover{transform:translateY(-1px);}ha-card.animation-smooth{transition:transform 0.25s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.25s ease;}ha-card.animation-energetic{transition:transform 0.2s cubic-bezier(0.34,1.6,0.64,1), box-shadow 0.2s ease;}ha-card.animation-energetic:hover{transform:translateY(-4px) scale(1.008);}@keyframes flow-gradient{0%{background-position:0% 50%;}100%{background-position:200% 50%;}}ha-card.flow-active .accent-bar{background:linear-gradient(90deg, var(--card-accent), color-mix(in srgb, var(--card-accent) 60%, white), var(--card-accent));background-size:200% 100%;animation:flow-gradient 2.5s linear infinite;}.error-state{display:flex;align-items:center;gap:14px;padding:20px;}.error-icon{width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--vpc-danger, #FF3B30) 10%, transparent);flex-shrink:0;}.error-icon ha-icon{--mdc-icon-size:24px;color:var(--vpc-danger, #FF3B30);}.error-info{display:flex;flex-direction:column;gap:3px;}.error-title{font-size:15px;font-weight:600;color:var(--vpc-danger, #FF3B30);letter-spacing:-0.2px;}.error-entity{font-size:12px;color:var(--vpc-text-secondary);font-family:'SF Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace;opacity:0.7;}.system-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:16px;}@media (max-width:600px){.chemistry-grid{grid-template-columns:repeat(3, 1fr);gap:6px;}.chemistry-card{padding:11px 6px 10px;}.chemistry-val{font-size:16px;}.system-grid{grid-template-columns:1fr;}.temp-hero-value{font-size:38px;letter-spacing:-1.5px;}.dosing-current-value{font-size:28px;}.speed-segment{font-size:11px;padding:8px 4px;}}@media (pointer:coarse){.speed-segment, .speed-off-btn, .device-row, .chemistry-card{min-height:44px;}}.speed-segment{min-width:0;}.speed-segment span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
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
ha-card.theme-dark .chem-gauge-track,ha-card.theme-neon .chem-gauge-track{background:rgba(255,255,255,0.08);}
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
ha-card.theme-dark .chem-metric-track{background:rgba(255,255,255,0.08);}
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
.sensor-num{font-size:56px;font-weight:700;letter-spacing:-2.5px;line-height:1;color:var(--card-accent,var(--vpc-primary));}
.sensor-unit{font-size:26px;font-weight:400;opacity:0.6;letter-spacing:-0.5px;color:var(--card-accent,var(--vpc-text));}
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

