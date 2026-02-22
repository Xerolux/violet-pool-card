import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

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

// HomeAssistant types
interface HomeAssistant {
  states: { [entity_id: string]: any };
  callService: (domain: string, service: string, serviceData?: any) => Promise<any>;
}

interface LovelaceCardConfig {
  type: string;
  entity?: string;
  entities?: string[];
  card_type: 'pump' | 'heater' | 'solar' | 'dosing' | 'overview' | 'compact' | 'system';
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
  tap_action?: any;
  hold_action?: any;
  double_tap_action?: any;
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
}

@customElement('violet-pool-card')
export class VioletPoolCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: VioletPoolCardConfig;

  public setConfig(config: VioletPoolCardConfig): void {
    if (!config.card_type) {
      throw new Error('You need to define a card_type');
    }

    if (config.card_type !== 'overview' && config.card_type !== 'system' && !config.entity) {
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
        return html`
          <ha-card>
            <div class="error-state">
              <div class="error-icon">
                <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
              </div>
              <div class="error-info">
                <span class="error-title">Entity Not Found</span>
                <span class="error-entity">${this.config.entity}</span>
              </div>
            </div>
          </ha-card>
        `;
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
      default:
        return html`
          <ha-card>
            <div class="error-state">
              <div class="error-icon">
                <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
              </div>
              <div class="error-info">
                <span class="error-title">Unknown Card Type</span>
                <span class="error-entity">${this.config.card_type}</span>
              </div>
            </div>
          </ha-card>
        `;
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

    const overviewConfig = createSubConfig('overview', '', { name: 'Pool Overview' });
    const pumpConfig = createSubConfig('pump', pumpEntity, { show_runtime: true });
    const heaterConfig = createSubConfig('heater', heaterEntity);
    const solarConfig = createSubConfig('solar', solarEntity);
    const dosingConfig = createSubConfig('dosing', dosingEntity, { dosing_type: 'chlorine' });

    return html`
      <div class="system-grid">
        ${overviewConfig ? this.renderOverviewCard(overviewConfig) : ''}
        ${pumpConfig ? this.renderPumpCard(pumpConfig) : ''}
        ${heaterConfig ? this.renderHeaterCard(heaterConfig) : ''}
        ${solarConfig ? this.renderSolarCard(solarConfig) : ''}
        ${dosingConfig ? this.renderDosingCard(dosingConfig) : ''}
      </div>
    `;
  }

  private renderPumpCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entity = this.hass.states[config.entity!];
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

    return html`
      <ha-card
        class="${this._getCardClasses(isRunning, config)}"
        style="--card-accent: ${accentColor}"
        @click="${() => this._showMoreInfo(config.entity!)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isRunning ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">
              <ha-icon
                icon="${config.icon || 'mdi:pump'}"
                class="${isRunning ? 'pump-running' : ''}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="${isRunning ? `color: ${speedColor.color}` : ''}">
                ${isRunning
                  ? `${speedLabels[currentSpeed]}${currentRPM > 0 ? ` \u00B7 ${currentRPM} RPM` : ''}`
                  : this._getFriendlyState(state, 'pump')}
              </span>
            </div>
            ${config.show_state
              ? html`<status-badge .state="${state}" .pulse="${isRunning}"></status-badge>`
              : ''}
          </div>

          <!-- Speed Segments Visual Indicator -->
          <div class="speed-segments-container">
            <div class="speed-segments">
              ${[1, 2, 3].map(level => html`
                <button
                  class="speed-segment ${currentSpeed === level ? 'seg-active' : currentSpeed > level ? 'seg-past' : ''}"
                  style="--seg-color: ${speedColors[level]}"
                  @click="${(e: Event) => { e.stopPropagation(); const sc = new ServiceCaller(this.hass); sc.setPumpSpeed(config.entity!, level); }}"
                  title="${speedLabels[level]}"
                >
                  <ha-icon icon="${speedIcons[level]}" style="--mdc-icon-size: 14px"></ha-icon>
                  <span>${speedLabels[level]}</span>
                </button>
              `)}
            </div>
            <button
              class="speed-off-btn ${currentSpeed === 0 ? 'seg-active' : ''}"
              style="--seg-color: ${speedColors[0]}"
              @click="${(e: Event) => { e.stopPropagation(); const sc = new ServiceCaller(this.hass); sc.turnOff(config.entity!); }}"
              title="OFF"
            >
              <ha-icon icon="mdi:power" style="--mdc-icon-size: 16px"></ha-icon>
            </button>
          </div>

          ${config.show_detail_status && pumpState
            ? html`<detail-status .raw="${pumpState}"></detail-status>`
            : ''}

          ${config.show_controls
            ? html`
                <slider-control
                  label="Speed Level"
                  min="0"
                  max="3"
                  step="1"
                  .value="${currentSpeed}"
                  .labels="${['OFF', 'ECO', 'Normal', 'Boost']}"
                  @value-changed="${(e: CustomEvent) => this._handlePumpSpeedChange(e, config.entity!)}"
                ></slider-control>
              `
            : ''}

          ${config.show_runtime && runtimeSeconds > 0
            ? html`
                <div class="info-row">
                  <ha-icon icon="mdi:timer-outline"></ha-icon>
                  <span class="info-label">Runtime</span>
                  <span class="info-value">${runtimeDisplay}</span>
                </div>
              `
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

    return html`
      <ha-card
        class="${this._getCardClasses(isHeating, config)}"
        style="--card-accent: ${accentColor}"
        @click="${() => this._showMoreInfo(config.entity!)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isHeating ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">
              <ha-icon
                icon="${config.icon || 'mdi:radiator'}"
                class="${isHeating ? 'heater-active' : ''}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">${this._getFriendlyState(state)}</span>
            </div>
            ${config.show_state
              ? html`<status-badge .state="${state}"></status-badge>`
              : ''}
          </div>

          ${currentTemp !== undefined
            ? html`
                <div class="temp-hero" style="--temp-color: ${tempColor?.color || 'var(--vpc-primary)'}">
                  <div class="temp-hero-main">
                    <span class="temp-hero-value">${currentTemp.toFixed(1)}</span>
                    <span class="temp-hero-unit">°C</span>
                  </div>
                  ${targetTemp !== undefined
                    ? html`
                        <div class="temp-hero-target-pill">
                          <ha-icon icon="mdi:target" style="--mdc-icon-size: 13px"></ha-icon>
                          <span>${targetTemp.toFixed(1)}°C</span>
                        </div>
                      `
                    : ''}
                </div>
                ${tempPct !== undefined
                  ? html`
                      <div class="temp-range-bar">
                        <div class="temp-range-track">
                          <div class="temp-range-fill" style="width: ${tempPct}%; background: ${tempColor?.color || accentColor}"></div>
                          ${targetPct !== undefined
                            ? html`<div class="temp-range-target" style="left: ${targetPct}%"></div>`
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
            ? html`<detail-status .raw="${heaterState}"></detail-status>`
            : ''}

          ${outsideTemp !== undefined
            ? html`
                <div class="info-row ${isBlockedByOutsideTemp ? 'info-row-warning' : ''}">
                  <ha-icon icon="mdi:thermometer"></ha-icon>
                  <span class="info-label">Outside</span>
                  <span class="info-value">${outsideTemp.toFixed(1)}°C</span>
                  ${isBlockedByOutsideTemp
                    ? html`<span class="info-badge warning">Min ${minOutsideTemp}°C</span>`
                    : ''}
                </div>
              `
            : ''}

          ${config.show_controls
            ? html`
                ${targetTemp !== undefined
                  ? html`
                      <slider-control
                        label="Target Temperature"
                        .min="${minTemp}"
                        .max="${maxTemp}"
                        step="0.5"
                        .value="${targetTemp}"
                        unit="°C"
                        showMinMax
                        @value-changed="${(e: CustomEvent) => this._handleTemperatureChange(e, config.entity!)}"
                      ></slider-control>
                    `
                  : ''}
                <quick-actions .actions="${quickActions}"></quick-actions>
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

    return html`
      <ha-card
        class="${this._getCardClasses(isSolarActive, config)}"
        style="--card-accent: ${accentColor}"
        @click="${() => this._showMoreInfo(config.entity!)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isSolarActive ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">
              <ha-icon
                icon="${config.icon || 'mdi:solar-power'}"
                class="${isSolarActive ? 'solar-active' : ''}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">${this._getFriendlyState(state)}</span>
            </div>
            ${config.show_state
              ? html`<status-badge .state="${state}"></status-badge>`
              : ''}
          </div>

          ${config.show_detail_status && solarState
            ? html`<detail-status .raw="${solarState}"></detail-status>`
            : ''}

          <div class="solar-temps">
            <!-- Solar temperature comparison: pool vs absorber -->
            <div class="solar-temp-comparison">
              ${poolTemp !== undefined
                ? html`
                    <div class="solar-temp-tile">
                      <ha-icon icon="mdi:pool" style="--mdc-icon-size: 18px"></ha-icon>
                      <div class="solar-temp-tile-val">${poolTemp.toFixed(1)}°C</div>
                      <div class="solar-temp-tile-label">Pool</div>
                    </div>
                  `
                : ''}
              ${tempDelta !== undefined
                ? html`
                    <div class="solar-delta-badge ${tempDelta >= 3 ? 'delta-great' : tempDelta > 0 ? 'delta-ok' : 'delta-low'}">
                      <ha-icon icon="${tempDelta >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'}" style="--mdc-icon-size: 16px"></ha-icon>
                      <span>${tempDelta > 0 ? '+' : ''}${tempDelta.toFixed(1)}°C</span>
                    </div>
                  `
                : ''}
              ${absorberTemp !== undefined
                ? html`
                    <div class="solar-temp-tile">
                      <ha-icon icon="mdi:solar-panel" style="--mdc-icon-size: 18px"></ha-icon>
                      <div class="solar-temp-tile-val">${absorberTemp.toFixed(1)}°C</div>
                      <div class="solar-temp-tile-label">Absorber</div>
                    </div>
                  `
                : ''}
            </div>
            ${poolTempPct !== undefined
              ? html`
                  <div class="temp-range-bar">
                    <div class="temp-range-track">
                      <div class="temp-range-fill" style="width: ${poolTempPct}%; background: ${accentColor}"></div>
                      ${targetTempPct !== undefined
                        ? html`<div class="temp-range-target" style="left: ${targetTempPct}%"></div>`
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
              ? html`
                  <div class="delta-hint-text">
                    ${tempDelta < 0
                      ? '❄ Too cold for solar heating'
                      : tempDelta < 3
                      ? '⚡ Solar heating possible'
                      : '☀ Ideal conditions for solar heating'}
                  </div>
                `
              : ''}
          </div>

          ${config.show_controls
            ? html`
                ${targetTemp !== undefined
                  ? html`
                      <slider-control
                        label="Target Temperature"
                        .min="${minTemp}"
                        .max="${maxTemp}"
                        step="0.5"
                        .value="${targetTemp}"
                        unit="°C"
                        showMinMax
                        @value-changed="${(e: CustomEvent) => this._handleTemperatureChange(e, config.entity!)}"
                      ></slider-control>
                    `
                  : ''}
                <quick-actions .actions="${quickActions}"></quick-actions>
              `
            : ''}
        </div>
      </ha-card>
    `;
  }

  private renderDosingCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const entity = this.hass.states[config.entity!];
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

    return html`
      <ha-card
        class="${this._getCardClasses(isDosing, config)}"
        style="--card-accent: ${accentColor}"
        @click="${() => this._showMoreInfo(config.entity!)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isDosing ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">
              <ha-icon
                icon="${config.icon || this._getDosingIcon(dosingType)}"
                class="${isDosing ? 'dosing-active' : ''}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">${this._getFriendlyState(state)}</span>
            </div>
            ${config.show_state
              ? html`<status-badge .state="${state}" .pulse="${isDosing}"></status-badge>`
              : ''}
          </div>

          ${currentValue !== undefined
            ? html`
                <!-- Dosing value hero with progress bar -->
                <div class="dosing-value-block">
                  <div class="dosing-value-row">
                    <div class="dosing-value-main" style="color: ${valueColor?.color || 'var(--vpc-text)'}">
                      <span class="dosing-label-tag">${dosingLabel}</span>
                      <span class="dosing-current-value">${currentValue.toFixed(decimals)}</span>
                      <span class="dosing-current-unit">${unit}</span>
                    </div>
                    <div class="dosing-status-pill" style="background: ${valueColor?.color ? valueColor.color + '18' : 'rgba(0,0,0,0.05)'}; color: ${valueColor?.color || 'var(--vpc-text-secondary)'}">
                      ${valueStatusLabel}
                    </div>
                  </div>
                  ${valuePct !== undefined
                    ? html`
                        <div class="chem-range-bar">
                          <div class="chem-range-track">
                            <div class="chem-range-fill" style="width: ${valuePct}%; background: ${valueColor?.color || accentColor}"></div>
                            ${targetPct !== undefined
                              ? html`
                                  <div class="chem-range-target" style="left: ${targetPct}%">
                                    <div class="chem-target-line"></div>
                                    <div class="chem-target-label">${targetValue!.toFixed(decimals)}${unit}</div>
                                  </div>
                                `
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
            ? html`<warning-chips .warnings="${dosingState}" defaultType="warning"></warning-chips>`
            : ''}

          ${config.show_controls
            ? html`<quick-actions .actions="${quickActions}"></quick-actions>`
            : ''}

          ${config.show_history && dosingVolume24h !== undefined
            ? html`
                <div class="info-row">
                  <ha-icon icon="mdi:chart-line"></ha-icon>
                  <span class="info-label">Last 24h</span>
                  <span class="info-value">${dosingVolume24h}ml</span>
                </div>
              `
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

    const warnings: string[] = [];
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

    return html`
      <ha-card
        class="${this._getCardClasses(anyActive, config)}"
        style="--card-accent: ${accentColor}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <!-- Header -->
          <div class="header">
            <div class="header-icon ${anyActive ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">
              <ha-icon icon="mdi:pool"></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">
                ${anyActive ? `${activeCount} device${activeCount !== 1 ? 's' : ''} active` : 'All systems idle'}
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
              ? html`
                  <div class="chemistry-card" style="--chem-color: ${tempColor?.color || '#4CAF50'}"
                    @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(poolTempSensorId); }}">
                    <div class="chem-icon-wrap">
                      <ha-icon icon="mdi:thermometer-water"></ha-icon>
                    </div>
                    <span class="chemistry-val">${poolTemp.toFixed(1)}°</span>
                    <span class="chemistry-unit">°C</span>
                    <span class="chemistry-label">Temp</span>
                    ${tempPct !== undefined
                      ? html`<div class="chem-mini-bar"><div class="chem-mini-fill" style="width: ${tempPct}%; background: ${tempColor?.color || '#4CAF50'}"></div></div>`
                      : ''}
                  </div>
                `
              : ''}
            ${phValue !== undefined
              ? html`
                  <div class="chemistry-card" style="--chem-color: ${phColor?.color || '#4CAF50'}"
                    @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(phSensorId); }}">
                    <div class="chem-icon-wrap">
                      <ha-icon icon="mdi:ph"></ha-icon>
                    </div>
                    <span class="chemistry-val">${phValue.toFixed(1)}</span>
                    <span class="chemistry-unit">pH</span>
                    <span class="chemistry-label">${phStatus === 'ok' ? 'Optimal' : 'Attention'}</span>
                    ${phPct !== undefined
                      ? html`
                          <div class="chem-mini-bar">
                            <div class="chem-mini-ideal" style="left: ${phIdealStartPct}%; width: ${phIdealEndPct - phIdealStartPct}%"></div>
                            <div class="chem-mini-fill" style="width: ${phPct}%; background: ${phColor?.color || '#4CAF50'}"></div>
                          </div>
                        `
                      : ''}
                  </div>
                `
              : ''}
            ${orpValue !== undefined
              ? html`
                  <div class="chemistry-card" style="--chem-color: ${orpColor?.color || '#4CAF50'}"
                    @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(orpSensorId); }}">
                    <div class="chem-icon-wrap">
                      <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                    </div>
                    <span class="chemistry-val">${orpValue.toFixed(0)}</span>
                    <span class="chemistry-unit">mV</span>
                    <span class="chemistry-label">${orpStatus === 'ok' ? 'Optimal' : orpStatus === 'warning' ? 'Low' : 'High'}</span>
                    ${orpPct !== undefined
                      ? html`
                          <div class="chem-mini-bar">
                            <div class="chem-mini-ideal" style="left: ${orpIdealStartPct}%; width: ${orpIdealEndPct - orpIdealStartPct}%"></div>
                            <div class="chem-mini-fill" style="width: ${orpPct}%; background: ${orpColor?.color || '#4CAF50'}"></div>
                          </div>
                        `
                      : ''}
                  </div>
                `
              : ''}
          </div>

          <!-- Device List - clean rows -->
          ${activeDevices.length > 0
            ? html`
                <div class="overview-section">
                  <div class="section-title">
                    <span>Devices</span>
                    <span class="section-count">${activeDevices.length}</span>
                  </div>
                  <div class="device-list">
                    ${activeDevices.map(
                      (device) => html`
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
            ? html`
                <div class="overview-section">
                  <div class="section-title warning-title">
                    <ha-icon icon="mdi:alert-outline" style="--mdc-icon-size: 14px"></ha-icon>
                    <span>Alerts</span>
                  </div>
                  <div class="warning-list">
                    ${warnings.map(
                      (warning) => html`
                        <div class="warning-row">
                          <ha-icon icon="${warning.includes('Frost') ? 'mdi:snowflake-alert' : 'mdi:alert-circle'}" style="--mdc-icon-size: 16px"></ha-icon>
                          <span>${warning}</span>
                        </div>
                      `
                    )}
                  </div>
                </div>
              `
            : html`
                <div class="all-ok-display">
                  <ha-icon icon="mdi:check-circle" style="--mdc-icon-size: 18px"></ha-icon>
                  <span>All systems normal</span>
                </div>
              `}
        </div>
      </ha-card>
    `;
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
    }

    const isActive = state === 'on' || state === 'auto' || state === 'heat' || state === 'heating';

    return html`
      <ha-card
        class="compact-card ${this._getCardClasses(isActive, config)}"
        @click="${() => this._showMoreInfo(config.entity!)}"
      >
        <div class="card-content compact">
          <div class="compact-icon ${isActive ? 'compact-icon-active' : ''}">
            <ha-icon
              icon="${icon}"
              class="${isActive ? 'active' : 'inactive'}"
            ></ha-icon>
          </div>
          <div class="compact-info">
            <span class="name">${name}</span>
            <div class="compact-details">
              ${currentValue ? html`<span class="compact-value">${currentValue}</span>` : ''}
              ${detailStatus ? html`<span class="compact-detail">${detailStatus}</span>` : ''}
            </div>
          </div>
          <status-badge .state="${state}"></status-badge>
        </div>
      </ha-card>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      /* ============================================
         BASE VARIABLES — Apple / Samsung design system
         ============================================ */
      :host {
        /* Typography — SF Pro on Apple, Roboto on Android, system-ui everywhere */
        --vpc-font: -apple-system, 'SF Pro Display', 'SF Pro Text', system-ui,
                    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

        /* Spacing */
        --vpc-spacing: 18px;
        --vpc-radius: 20px;
        --vpc-inner-radius: 12px;

        /* Color tokens */
        --vpc-bg: var(--ha-card-background, var(--card-background-color, #ffffff));
        --vpc-surface: rgba(120,120,128,0.06);
        --vpc-border: none;
        --vpc-shadow: 0 2px 20px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04);
        --vpc-backdrop: none;

        /* Semantic colors — Apple system palette */
        --vpc-primary: var(--primary-color, #007AFF);
        --vpc-success: #34C759;
        --vpc-warning: #FF9F0A;
        --vpc-danger: #FF3B30;
        --vpc-purple: #AF52DE;
        --vpc-teal: #5AC8FA;
        --vpc-orange: #FF9500;
        --vpc-indigo: #5856D6;

        /* Text */
        --vpc-text: var(--primary-text-color, #1C1C1E);
        --vpc-text-secondary: var(--secondary-text-color, #6D6D72);
        --vpc-text-tertiary: rgba(60,60,67,0.45);

        /* Icon */
        --vpc-icon-size: 22px;

        /* Motion — Apple spring curve */
        --vpc-transition: all 0.28s cubic-bezier(0.34, 1.4, 0.64, 1);
        --vpc-transition-fast: all 0.18s ease;

        /* Card accent (per-card) */
        --card-accent: var(--primary-color, #007AFF);
        --icon-accent: var(--card-accent);

        display: block;
        font-family: var(--vpc-font);
      }

      /* ============================================
         THEME OVERRIDES — applied on ha-card
         ============================================ */

      /* ---- Apple (default) ---- */
      ha-card.theme-apple {
        --vpc-bg: #ffffff;
        --vpc-shadow: 0 2px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04);
        --vpc-radius: 22px;
        --vpc-inner-radius: 13px;
        --vpc-surface: rgba(120,120,128,0.06);
        --vpc-primary: #007AFF;
      }

      /* ---- Dark ---- */
      ha-card.theme-dark {
        --vpc-bg: #1C1C1E;
        --vpc-surface: rgba(255,255,255,0.06);
        --vpc-border: 1px solid rgba(255,255,255,0.08);
        --vpc-shadow: 0 4px 30px rgba(0,0,0,0.4);
        --vpc-radius: 22px;
        --vpc-text: #FFFFFF;
        --vpc-text-secondary: #8E8E93;
        --vpc-text-tertiary: rgba(255,255,255,0.25);
        --vpc-primary: #0A84FF;
        --vpc-success: #30D158;
        --vpc-warning: #FFD60A;
        --vpc-danger: #FF453A;
      }

      /* ---- Luxury / Glass ---- */
      ha-card.theme-luxury,
      ha-card.theme-glass {
        --vpc-bg: rgba(255,255,255,0.72);
        --vpc-backdrop: blur(24px) saturate(180%);
        --vpc-radius: 26px;
        --vpc-border: 1px solid rgba(255,255,255,0.4);
        --vpc-shadow: 0 8px 40px rgba(31,38,135,0.12), 0 2px 8px rgba(0,0,0,0.06);
      }

      /* ---- Modern ---- */
      ha-card.theme-modern {
        --vpc-radius: 18px;
        --vpc-spacing: 20px;
        --vpc-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04);
      }

      /* ---- Minimalist ---- */
      ha-card.theme-minimalist {
        --vpc-radius: 14px;
        --vpc-shadow: none;
        --vpc-border: 1px solid rgba(0,0,0,0.07);
        --vpc-surface: transparent;
      }

      /* ---- Neon (legacy) — remapped to a cleaner dark neon ---- */
      ha-card.theme-neon {
        --vpc-bg: #0D0D14;
        --vpc-border: 1px solid rgba(0,212,255,0.2);
        --vpc-shadow: 0 0 30px rgba(0,212,255,0.07);
        --vpc-radius: 14px;
        --vpc-primary: #00D4FF;
        --vpc-text: #E8E8F0;
        --vpc-text-secondary: #6E6E80;
        --vpc-surface: rgba(0,212,255,0.04);
        --vpc-success: #00E676;
        --vpc-warning: #FFEA00;
        --vpc-danger: #FF1744;
      }

      /* ---- Premium (legacy) — refined frosted gradient ---- */
      ha-card.theme-premium {
        --vpc-bg: linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(248,248,255,0.96) 100%);
        --vpc-radius: 24px;
        --vpc-shadow: 0 12px 50px -8px rgba(80,80,160,0.15), 0 0 0 1px rgba(255,255,255,0.9);
        --vpc-border: 1px solid rgba(255,255,255,0.7);
      }

      /* ---- Auto dark mode ---- */
      @media (prefers-color-scheme: dark) {
        ha-card.theme-apple {
          --vpc-bg: #1C1C1E;
          --vpc-surface: rgba(255,255,255,0.06);
          --vpc-border: 1px solid rgba(255,255,255,0.08);
          --vpc-text: #FFFFFF;
          --vpc-text-secondary: #8E8E93;
          --vpc-primary: #0A84FF;
          --vpc-success: #30D158;
          --vpc-warning: #FFD60A;
          --vpc-danger: #FF453A;
        }
        ha-card.theme-luxury,
        ha-card.theme-glass {
          --vpc-bg: rgba(18,18,30,0.80);
          --vpc-border: 1px solid rgba(255,255,255,0.09);
          --vpc-shadow: 0 8px 40px rgba(0,0,0,0.45);
        }
        ha-card.theme-premium {
          --vpc-bg: linear-gradient(145deg, rgba(28,28,38,0.97) 0%, rgba(20,20,32,0.97) 100%);
          --vpc-border: 1px solid rgba(255,255,255,0.07);
        }
        ha-card.theme-minimalist {
          --vpc-border: 1px solid rgba(255,255,255,0.07);
        }
        ha-card.theme-modern {
          --vpc-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.04);
        }
      }

      /* ============================================
         HA-CARD BASE
         ============================================ */
      ha-card {
        font-family: var(--vpc-font);
        padding: var(--vpc-spacing);
        background: var(--vpc-bg);
        border-radius: var(--vpc-radius);
        box-shadow: var(--vpc-shadow);
        border: var(--vpc-border);
        backdrop-filter: var(--vpc-backdrop);
        -webkit-backdrop-filter: var(--vpc-backdrop);
        transition: transform 0.22s cubic-bezier(0.34,1.4,0.64,1),
                    box-shadow 0.22s ease;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }

      ha-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.11), 0 2px 6px rgba(0,0,0,0.05);
      }

      ha-card:active {
        transform: scale(0.985);
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        transition: transform 0.1s ease, box-shadow 0.1s ease;
      }

      ha-card.theme-dark:hover {
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      }

      ha-card.theme-neon:hover {
        box-shadow: 0 0 40px rgba(0,212,255,0.12), 0 4px 20px rgba(0,0,0,0.3);
      }

      ha-card.theme-neon.is-active {
        box-shadow: 0 0 50px rgba(0,212,255,0.2), inset 0 0 20px rgba(0,212,255,0.04);
        border-color: rgba(0,212,255,0.35);
      }

      /* ============================================
         ACCENT BAR (top gradient line)
         ============================================ */
      .accent-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--card-accent);
        opacity: 0.65;
        transition: opacity 0.3s ease, height 0.3s ease;
      }

      ha-card.is-active .accent-bar {
        height: 4px;
        opacity: 1;
      }

      ha-card.theme-neon .accent-bar {
        background: linear-gradient(90deg, #00D4FF, #7C4DFF, #00D4FF);
        box-shadow: 0 0 12px rgba(0,212,255,0.5);
        height: 2px;
        animation: neon-flow 3s linear infinite;
      }

      ha-card.theme-minimalist .accent-bar {
        height: 2px;
        opacity: 0.45;
      }

      @keyframes neon-flow {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }

      /* ============================================
         CARD CONTENT
         ============================================ */
      .card-content {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .card-content.compact {
        flex-direction: row;
        align-items: center;
        gap: 14px;
      }

      /* ============================================
         HEADER
         ============================================ */
      .header {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .header-icon {
        width: 46px;
        height: 46px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        /* Use the per-card accent as tinted background */
        background: color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 12%, transparent);
        transition: background 0.25s ease, box-shadow 0.25s ease;
        flex-shrink: 0;
      }

      .header-icon.icon-active {
        background: color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 18%, transparent);
        box-shadow: 0 0 0 5px color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 8%, transparent);
      }

      ha-card.theme-neon .header-icon {
        background: rgba(0,212,255,0.08);
        border: 1px solid rgba(0,212,255,0.18);
      }

      ha-card.theme-neon .header-icon.icon-active {
        box-shadow: 0 0 16px rgba(0,212,255,0.25);
      }

      .header-icon ha-icon {
        --mdc-icon-size: 24px;
        color: var(--icon-accent, var(--vpc-primary));
      }

      .header-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .name {
        font-family: var(--vpc-font);
        font-size: 16px;
        font-weight: 600;
        letter-spacing: -0.3px;
        color: var(--vpc-text);
        line-height: 1.25;
      }

      .header-subtitle {
        font-family: var(--vpc-font);
        font-size: 13px;
        font-weight: 400;
        color: var(--vpc-text-secondary);
        line-height: 1.2;
      }

      /* ============================================
         ICONS & ANIMATIONS
         ============================================ */
      ha-icon {
        --mdc-icon-size: var(--vpc-icon-size);
        color: var(--vpc-primary);
        transition: color 0.2s ease;
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes pulse-glow {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%  { opacity: 0.65; transform: scale(0.95); }
      }
      @keyframes breathe {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.08); opacity: 0.85; }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      .pump-running { animation: rotate 1.8s linear infinite; }
      .heater-active { animation: breathe 2.5s ease-in-out infinite; color: var(--vpc-danger, #FF3B30); }
      .solar-active  { animation: breathe 3s ease-in-out infinite; color: var(--vpc-warning, #FF9F0A); }
      .dosing-active { animation: pulse-glow 2s ease-in-out infinite; color: var(--vpc-success, #34C759); }

      /* ============================================
         PUMP — SPEED SEGMENTS
         ============================================ */
      .speed-segments-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .speed-segments {
        display: flex;
        flex: 1;
        gap: 6px;
      }

      .speed-segment {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 9px 6px;
        border-radius: var(--vpc-inner-radius, 12px);
        border: none;
        background: var(--vpc-surface, rgba(120,120,128,0.06));
        color: var(--vpc-text-secondary);
        font-family: var(--vpc-font);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.18s ease;
        -webkit-tap-highlight-color: transparent;
        letter-spacing: -0.2px;
      }

      .speed-segment:hover {
        background: color-mix(in srgb, var(--seg-color) 10%, transparent);
        color: var(--seg-color);
      }

      .speed-segment.seg-active {
        background: color-mix(in srgb, var(--seg-color) 15%, transparent);
        color: var(--seg-color);
        font-weight: 600;
        box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--seg-color) 40%, transparent);
      }

      .speed-segment.seg-past {
        background: color-mix(in srgb, var(--seg-color) 08%, transparent);
        color: color-mix(in srgb, var(--seg-color) 70%, var(--vpc-text-secondary));
      }

      .speed-off-btn {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        border: none;
        background: var(--vpc-surface);
        color: var(--vpc-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.18s ease;
        flex-shrink: 0;
        -webkit-tap-highlight-color: transparent;
      }

      .speed-off-btn:hover {
        background: rgba(255,59,48,0.1);
        color: var(--vpc-danger, #FF3B30);
      }

      .speed-off-btn.seg-active {
        background: rgba(255,59,48,0.12);
        color: var(--vpc-danger, #FF3B30);
        box-shadow: inset 0 0 0 1.5px rgba(255,59,48,0.3);
      }

      ha-card.theme-neon .speed-segment {
        border: 1px solid rgba(0,212,255,0.1);
      }
      ha-card.theme-neon .speed-segment.seg-active {
        box-shadow: 0 0 12px color-mix(in srgb, var(--seg-color) 50%, transparent);
      }

      /* ============================================
         TEMPERATURE HERO
         ============================================ */
      .temp-hero {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 6px 0 4px;
      }

      .temp-hero-main {
        display: flex;
        align-items: baseline;
        gap: 4px;
      }

      .temp-hero-value {
        font-family: var(--vpc-font);
        font-size: 44px;
        font-weight: 700;
        line-height: 1;
        letter-spacing: -2px;
        color: var(--temp-color, var(--vpc-text));
      }

      .temp-hero-unit {
        font-size: 22px;
        font-weight: 400;
        color: var(--temp-color, var(--vpc-text));
        opacity: 0.65;
        letter-spacing: -0.5px;
      }

      .temp-hero-target-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border-radius: 100px;
        background: var(--vpc-surface);
        font-size: 13px;
        font-weight: 500;
        color: var(--vpc-text-secondary);
        white-space: nowrap;
      }

      /* ============================================
         TEMPERATURE / VALUE RANGE BAR
         ============================================ */
      .temp-range-bar,
      .chem-range-bar {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .temp-range-track,
      .chem-range-track {
        height: 6px;
        background: var(--vpc-surface);
        border-radius: 100px;
        position: relative;
        overflow: visible;
      }

      .temp-range-fill,
      .chem-range-fill {
        height: 100%;
        border-radius: 100px;
        transition: width 0.5s cubic-bezier(0.34,1.4,0.64,1);
      }

      .temp-range-target {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 3px;
        height: 14px;
        background: var(--vpc-text-secondary);
        border-radius: 2px;
        opacity: 0.7;
      }

      .temp-range-labels,
      .chem-range-labels {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        font-weight: 400;
        color: var(--vpc-text-tertiary, rgba(60,60,67,0.45));
        letter-spacing: 0px;
      }

      /* ============================================
         CHEMICAL RANGE BAR (dosing card)
         ============================================ */
      .dosing-value-block {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 14px;
        border-radius: var(--vpc-inner-radius, 12px);
        background: var(--vpc-surface);
      }

      ha-card.theme-neon .dosing-value-block {
        background: rgba(0,212,255,0.04);
        border: 1px solid rgba(0,212,255,0.08);
      }

      .dosing-value-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .dosing-value-main {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }

      .dosing-label-tag {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: var(--vpc-text-secondary);
      }

      .dosing-current-value {
        font-family: var(--vpc-font);
        font-size: 32px;
        font-weight: 700;
        line-height: 1;
        letter-spacing: -1px;
      }

      .dosing-current-unit {
        font-size: 15px;
        font-weight: 400;
        opacity: 0.65;
      }

      .dosing-status-pill {
        padding: 4px 10px;
        border-radius: 100px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
      }

      .chem-range-target {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }

      .chem-target-line {
        width: 2px;
        height: 14px;
        background: var(--vpc-text);
        border-radius: 2px;
        opacity: 0.5;
      }

      .chem-target-label {
        position: absolute;
        top: 16px;
        font-size: 9px;
        font-weight: 600;
        color: var(--vpc-text-secondary);
        white-space: nowrap;
        transform: translateX(-50%);
      }

      .chem-mini-bar {
        width: 100%;
        height: 4px;
        background: var(--vpc-surface, rgba(120,120,128,0.1));
        border-radius: 100px;
        overflow: hidden;
        position: relative;
        margin-top: 4px;
      }

      .chem-mini-fill {
        height: 100%;
        border-radius: 100px;
        transition: width 0.5s cubic-bezier(0.34,1.4,0.64,1);
      }

      .chem-mini-ideal {
        position: absolute;
        top: 0;
        height: 100%;
        background: rgba(52,199,89,0.18);
        border-radius: 2px;
      }

      /* ============================================
         SOLAR — TEMPERATURE COMPARISON
         ============================================ */
      .solar-temp-comparison {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 12px;
        background: var(--vpc-surface);
        border-radius: var(--vpc-inner-radius, 12px);
      }

      ha-card.theme-neon .solar-temp-comparison {
        background: rgba(0,212,255,0.04);
        border: 1px solid rgba(0,212,255,0.08);
      }

      .solar-temp-tile {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        flex: 1;
      }

      .solar-temp-tile ha-icon {
        --mdc-icon-size: 18px;
        color: var(--vpc-text-secondary);
      }

      .solar-temp-tile-val {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.5px;
        color: var(--vpc-text);
        line-height: 1;
      }

      .solar-temp-tile-label {
        font-size: 11px;
        font-weight: 500;
        color: var(--vpc-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .solar-delta-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 8px 12px;
        border-radius: 100px;
        font-size: 12px;
        font-weight: 700;
      }

      .delta-great {
        background: rgba(52,199,89,0.12);
        color: var(--vpc-success, #34C759);
      }
      .delta-ok {
        background: rgba(255,159,10,0.12);
        color: var(--vpc-warning, #FF9F0A);
      }
      .delta-low {
        background: rgba(255,59,48,0.10);
        color: var(--vpc-danger, #FF3B30);
      }

      .delta-hint-text {
        font-size: 12px;
        font-weight: 400;
        color: var(--vpc-text-secondary);
        padding: 2px 0;
      }

      /* ============================================
         OVERVIEW — CHEMISTRY GRID
         ============================================ */
      .chemistry-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .chemistry-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 14px 8px 12px;
        border-radius: var(--vpc-inner-radius, 12px);
        background: var(--vpc-surface);
        cursor: pointer;
        transition: transform 0.18s ease, background 0.18s ease;
        position: relative;
        overflow: hidden;
      }

      .chemistry-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--chem-color, var(--vpc-primary));
        opacity: 0.6;
        border-radius: 100px;
      }

      .chemistry-card:hover {
        transform: scale(1.02);
        background: color-mix(in srgb, var(--chem-color) 8%, var(--vpc-surface));
      }

      ha-card.theme-neon .chemistry-card {
        background: rgba(0,212,255,0.04);
        border: 1px solid rgba(0,212,255,0.08);
      }

      .chem-icon-wrap {
        width: 30px;
        height: 30px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: color-mix(in srgb, var(--chem-color, var(--vpc-primary)) 12%, transparent);
        margin-bottom: 4px;
      }

      .chem-icon-wrap ha-icon {
        --mdc-icon-size: 16px;
        color: var(--chem-color, var(--vpc-primary));
      }

      .chemistry-val {
        font-family: var(--vpc-font);
        font-size: 18px;
        font-weight: 700;
        letter-spacing: -0.5px;
        color: var(--chem-color, var(--vpc-text));
        line-height: 1;
      }

      .chemistry-unit {
        font-size: 11px;
        font-weight: 500;
        color: var(--vpc-text-secondary);
        letter-spacing: 0.2px;
      }

      .chemistry-label {
        font-size: 10px;
        font-weight: 500;
        color: var(--vpc-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }

      /* ============================================
         OVERVIEW — HEADER EXTRAS
         ============================================ */
      .overview-warning-badge {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--vpc-danger, #FF3B30);
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .overview-active-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--vpc-success, #34C759);
        box-shadow: 0 0 8px rgba(52,199,89,0.5);
        flex-shrink: 0;
        animation: pulse-glow 2s ease-in-out infinite;
      }

      /* ============================================
         OVERVIEW — SECTIONS
         ============================================ */
      .overview-section {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 600;
        color: var(--vpc-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.6px;
        padding: 0 2px;
      }

      .section-count {
        margin-left: auto;
        font-size: 11px;
        font-weight: 500;
        color: var(--vpc-text-tertiary);
      }

      .warning-title ha-icon { color: var(--vpc-warning, #FF9F0A); }
      .warning-title { color: var(--vpc-warning, #FF9F0A); }

      /* ============================================
         TEMPERATURE HERO DISPLAY
         ============================================ */
      .temp-hero {
        display: flex;
        align-items: baseline;
        gap: 4px;
        padding: 8px 0;
      }

      .temp-hero-value {
        font-size: 42px;
        font-weight: 800;
        line-height: 1;
        color: var(--temp-color, var(--vpc-text));
        letter-spacing: -1px;
      }

      .temp-hero-unit {
        font-size: 22px;
        font-weight: 500;
        color: var(--temp-color, var(--vpc-text));
        opacity: 0.7;
      }

      .temp-hero-target {
        font-size: 16px;
        font-weight: 500;
        color: var(--vpc-text-secondary);
        margin-left: 12px;
      }

      /* ============================================
         INFO ROWS — runtime, outside temp, etc.
         ============================================ */
      .info-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: var(--vpc-inner-radius, 12px);
        background: var(--vpc-surface);
        font-size: 14px;
        color: var(--vpc-text);
        font-family: var(--vpc-font);
      }

      ha-card.theme-neon .info-row {
        background: rgba(0,212,255,0.04);
        border: 1px solid rgba(0,212,255,0.08);
      }

      .info-row ha-icon {
        --mdc-icon-size: 17px;
        color: var(--vpc-text-secondary);
        flex-shrink: 0;
      }

      .info-label {
        flex: 1;
        font-weight: 400;
        color: var(--vpc-text-secondary);
      }

      .info-value {
        font-weight: 600;
        color: var(--vpc-text);
        letter-spacing: -0.2px;
      }

      .info-badge {
        padding: 3px 9px;
        border-radius: 100px;
        font-size: 11px;
        font-weight: 600;
      }

      .info-badge.warning {
        background: color-mix(in srgb, var(--vpc-warning, #FF9F0A) 12%, transparent);
        color: var(--vpc-warning, #FF9F0A);
      }

      .info-row-warning {
        background: color-mix(in srgb, var(--vpc-warning, #FF9F0A) 06%, transparent);
        border: 1px solid color-mix(in srgb, var(--vpc-warning, #FF9F0A) 18%, transparent);
      }

      /* ============================================
         SOLAR TEMPERATURE SECTION
         ============================================ */
      .solar-temps {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      /* ============================================
         OVERVIEW: CHEMISTRY GRID
         ============================================ */
      .chemistry-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }

      .chemistry-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 14px 8px;
        border-radius: 14px;
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.03);
        cursor: pointer;
        transition: var(--vpc-transition);
        border: 1px solid transparent;
      }

      .chemistry-card:hover {
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.06);
        transform: translateY(-1px);
      }

      ha-card.theme-neon .chemistry-card {
        background: rgba(0, 255, 255, 0.04);
        border: 1px solid rgba(0, 255, 255, 0.08);
      }

      .chemistry-card ha-icon {
        --mdc-icon-size: 20px;
        color: var(--chem-color, var(--vpc-primary));
      }

      .chemistry-val {
        font-size: 16px;
        font-weight: 700;
        color: var(--chem-color, var(--vpc-text));
        line-height: 1;
      }

      .chemistry-label {
        font-size: 11px;
        font-weight: 500;
        color: var(--vpc-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      /* ============================================
         OVERVIEW: SECTIONS
         ============================================ */
      .overview-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        color: var(--vpc-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 0 2px;
      }

      .section-title ha-icon {
        --mdc-icon-size: 16px;
        color: var(--vpc-text-secondary);
      }

      .warning-title ha-icon {
        color: #ef6c00;
      }

      .warning-title {
        color: #ef6c00;
      }

      /* ============================================
         OVERVIEW — DEVICE LIST
         ============================================ */
      .device-list {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .device-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: var(--vpc-inner-radius, 12px);
        background: var(--vpc-surface);
        cursor: pointer;
        transition: background 0.18s ease, transform 0.15s ease;
      }

      .device-row:hover {
        background: color-mix(in srgb, var(--vpc-primary) 6%, var(--vpc-surface));
        transform: scale(1.005);
      }

      ha-card.theme-neon .device-row {
        background: rgba(0,212,255,0.04);
        border: 1px solid rgba(0,212,255,0.06);
      }

      .device-icon-wrap {
        width: 32px;
        height: 32px;
        border-radius: 9px;
        background: var(--vpc-surface);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: background 0.2s ease;
      }

      .device-icon-wrap ha-icon {
        --mdc-icon-size: 18px;
        color: var(--vpc-text-secondary);
      }

      .device-icon-active {
        background: color-mix(in srgb, var(--vpc-primary) 12%, transparent);
      }

      .device-icon-active ha-icon {
        color: var(--vpc-primary) !important;
      }

      .device-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .device-name {
        font-weight: 500;
        font-size: 14px;
        letter-spacing: -0.1px;
        color: var(--vpc-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .device-status {
        color: var(--vpc-text-secondary);
        font-size: 12px;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .device-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .dot-active {
        background: var(--vpc-success, #34C759);
        box-shadow: 0 0 6px rgba(52,199,89,0.5);
      }

      .dot-inactive {
        background: var(--vpc-text-secondary);
        opacity: 0.25;
      }

      /* ============================================
         OVERVIEW — WARNINGS & ALL-OK
         ============================================ */
      .warning-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .warning-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: var(--vpc-inner-radius, 12px);
        background: color-mix(in srgb, var(--vpc-warning, #FF9F0A) 8%, transparent);
        border: 1px solid color-mix(in srgb, var(--vpc-warning, #FF9F0A) 20%, transparent);
        font-size: 13px;
        font-weight: 500;
        color: var(--vpc-warning, #FF9F0A);
      }

      .warning-row ha-icon {
        color: var(--vpc-warning, #FF9F0A);
        flex-shrink: 0;
      }

      .all-ok-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 14px;
        border-radius: var(--vpc-inner-radius, 12px);
        background: color-mix(in srgb, var(--vpc-success, #34C759) 8%, transparent);
        border: 1px solid color-mix(in srgb, var(--vpc-success, #34C759) 18%, transparent);
        color: var(--vpc-success, #34C759);
        font-weight: 500;
        font-size: 14px;
      }

      .all-ok-display ha-icon {
        color: var(--vpc-success, #34C759);
      }

      /* ============================================
         COMPACT CARD
         ============================================ */
      ha-card.compact-card {
        padding: 12px 14px;
      }

      .compact-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--vpc-surface);
        flex-shrink: 0;
        transition: background 0.2s ease;
      }

      .compact-icon-active {
        background: color-mix(in srgb, var(--vpc-primary) 12%, transparent);
      }

      .compact-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      .compact-icon ha-icon.active {
        color: var(--vpc-primary);
      }

      .compact-icon ha-icon.inactive {
        color: var(--vpc-text-secondary);
        opacity: 0.45;
      }

      .compact-info {
        flex: 1;
        min-width: 0;
      }

      .compact-details {
        display: flex;
        gap: 8px;
        font-size: 12px;
        margin-top: 2px;
        align-items: center;
      }

      .compact-value {
        font-weight: 600;
        color: var(--vpc-text);
        letter-spacing: -0.2px;
      }

      .compact-detail {
        color: var(--vpc-text-secondary);
        font-size: 11px;
      }

      /* ============================================
         SYSTEM GRID
         ============================================ */
      .system-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 20px;
      }

      /* ============================================
         ERROR STATE
         ============================================ */
      .error-state {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 20px;
      }

      .error-icon {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(244, 67, 54, 0.1);
      }

      .error-icon ha-icon {
        --mdc-icon-size: 24px;
        color: #d32f2f;
      }

      .error-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .error-title {
        font-size: 14px;
        font-weight: 600;
        color: #d32f2f;
      }

      .error-entity {
        font-size: 12px;
        color: var(--vpc-text-secondary);
        font-family: monospace;
      }

      /* ============================================
         SIZE VARIANTS
         ============================================ */
      ha-card.size-small {
        --vpc-spacing: 12px;
        --vpc-icon-size: 20px;
        --vpc-radius: 16px;
      }

      ha-card.size-small .header-icon {
        width: 38px;
        height: 38px;
        border-radius: 11px;
      }

      ha-card.size-small .name { font-size: 14px; }
      ha-card.size-small .temp-hero-value { font-size: 34px; letter-spacing: -1.5px; }

      ha-card.size-large {
        --vpc-spacing: 22px;
        --vpc-icon-size: 28px;
        --vpc-radius: 26px;
      }

      ha-card.size-large .header-icon {
        width: 54px;
        height: 54px;
        border-radius: 17px;
      }

      ha-card.size-large .name { font-size: 18px; }
      ha-card.size-large .temp-hero-value { font-size: 56px; letter-spacing: -3px; }

      ha-card.size-fullscreen {
        --vpc-spacing: 28px;
        --vpc-icon-size: 32px;
        --vpc-radius: 28px;
        height: 100%;
        min-height: 80vh;
      }

      ha-card.size-fullscreen .header-icon {
        width: 60px;
        height: 60px;
        border-radius: 19px;
      }

      ha-card.size-fullscreen .name { font-size: 20px; }
      ha-card.size-fullscreen .temp-hero-value { font-size: 68px; letter-spacing: -4px; }

      /* ============================================
         ANIMATION VARIANTS
         ============================================ */
      ha-card.animation-none {
        transition: none !important;
      }
      ha-card.animation-none:hover,
      ha-card.animation-none:active {
        transform: none !important;
      }

      ha-card.animation-subtle {
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      ha-card.animation-subtle:hover {
        transform: translateY(-1px);
      }

      ha-card.animation-smooth {
        transition: transform 0.25s cubic-bezier(0.34,1.4,0.64,1),
                    box-shadow 0.25s ease;
      }

      ha-card.animation-energetic {
        transition: transform 0.2s cubic-bezier(0.34,1.6,0.64,1),
                    box-shadow 0.2s ease;
      }
      ha-card.animation-energetic:hover {
        transform: translateY(-4px) scale(1.008);
      }

      /* Flow animation for active cards */
      @keyframes flow-gradient {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }

      ha-card.flow-active .accent-bar {
        background: linear-gradient(90deg, var(--card-accent), color-mix(in srgb, var(--card-accent) 60%, white), var(--card-accent));
        background-size: 200% 100%;
        animation: flow-gradient 2.5s linear infinite;
      }

      /* ============================================
         ERROR STATE
         ============================================ */
      .error-state {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 20px;
      }

      .error-icon {
        width: 46px;
        height: 46px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: color-mix(in srgb, var(--vpc-danger, #FF3B30) 10%, transparent);
        flex-shrink: 0;
      }

      .error-icon ha-icon {
        --mdc-icon-size: 24px;
        color: var(--vpc-danger, #FF3B30);
      }

      .error-info {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .error-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--vpc-danger, #FF3B30);
        letter-spacing: -0.2px;
      }

      .error-entity {
        font-size: 12px;
        color: var(--vpc-text-secondary);
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace;
        opacity: 0.7;
      }

      /* ============================================
         SYSTEM GRID
         ============================================ */
      .system-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 16px;
      }

      /* ============================================
         RESPONSIVE
         ============================================ */
      @media (max-width: 600px) {
        .chemistry-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .chemistry-card {
          padding: 11px 6px 10px;
        }

        .chemistry-val {
          font-size: 16px;
        }

        .system-grid {
          grid-template-columns: 1fr;
        }

        .temp-hero-value {
          font-size: 38px;
          letter-spacing: -1.5px;
        }

        .dosing-current-value {
          font-size: 28px;
        }

        .speed-segment {
          font-size: 11px;
          padding: 8px 4px;
        }
      }

      /* ============================================
         TOUCH DEVICES
         ============================================ */
      @media (pointer: coarse) {
        .speed-segment,
        .speed-off-btn,
        .device-row,
        .chemistry-card {
          min-height: 44px;
        }
      }
    `;
  }

  public getCardSize(): number {
    switch (this.config?.card_type) {
      case 'compact':
        return 1;
      case 'overview':
        return 5;
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
});

console.info(
  '%c VIOLET-POOL-CARD %c 0.3.0 ',
  'color: white; background: #007AFF; font-weight: 700; font-family: -apple-system, system-ui, sans-serif; padding: 3px 8px; border-radius: 6px 0 0 6px;',
  'color: #007AFF; background: #F2F2F7; font-weight: 700; font-family: -apple-system, system-ui, sans-serif; padding: 3px 8px; border-radius: 0 6px 6px 0;'
);
