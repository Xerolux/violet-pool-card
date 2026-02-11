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
  theme?: 'luxury' | 'modern' | 'minimalist' | 'glass' | 'neon' | 'premium';
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
      theme: 'luxury',
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
          await serviceCaller.controlPump(config.entity!, 'auto');
        },
        active: state === 'auto',
        color: '#2196F3',
      },
      {
        icon: 'mdi:speedometer-slow',
        label: 'ECO',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.setPumpSpeed(config.entity!, 1);
        },
        active: currentSpeed === 1,
        color: '#4CAF50',
      },
      {
        icon: 'mdi:speedometer-medium',
        label: 'Normal',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.setPumpSpeed(config.entity!, 2);
        },
        active: currentSpeed === 2,
        color: '#FF9800',
      },
      {
        icon: 'mdi:speedometer',
        label: 'Boost',
        action: async () => {
          const serviceCaller = new ServiceCaller(this.hass);
          await serviceCaller.setPumpSpeed(config.entity!, 3);
        },
        active: currentSpeed === 3,
        color: '#F44336',
      },
    ];

    const isRunning = state === 'on' || currentSpeed > 0;

    return html`
      <ha-card
        class="${this._getCardClasses(isRunning, config)}"
        style="--card-accent: ${accentColor}"
        @click="${() => this._showMoreInfo(config.entity!)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isRunning ? 'icon-active' : ''}">
              <ha-icon
                icon="${config.icon || 'mdi:pump'}"
                class="${isRunning ? 'pump-running' : ''}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              ${currentSpeed > 0
                ? html`<span class="header-subtitle" style="color: ${speedColor.color}">Level ${currentSpeed} ${currentRPM > 0 ? `\u00B7 ${currentRPM} RPM` : ''}</span>`
                : html`<span class="header-subtitle">${state}</span>`}
            </div>
            ${config.show_state
              ? html`<status-badge .state="${state}" .pulse="${isRunning}"></status-badge>`
              : ''}
          </div>

          ${config.show_detail_status && pumpState
            ? html`<detail-status .raw="${pumpState}"></detail-status>`
            : ''}

          ${config.show_controls
            ? html`
                <slider-control
                  label="Pump Speed"
                  min="0"
                  max="3"
                  step="1"
                  .value="${currentSpeed}"
                  .labels="${['OFF', 'ECO', 'Normal', 'Boost']}"
                  @value-changed="${(e: CustomEvent) => this._handlePumpSpeedChange(e, config.entity!)}"
                ></slider-control>

                <quick-actions .actions="${quickActions}"></quick-actions>
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

    return html`
      <ha-card
        class="${this._getCardClasses(isHeating, config)}"
        style="--card-accent: ${accentColor}"
        @click="${() => this._showMoreInfo(config.entity!)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isHeating ? 'icon-active' : ''}">
              <ha-icon
                icon="${config.icon || 'mdi:radiator'}"
                class="${isHeating ? 'heater-active' : ''}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">${state}</span>
            </div>
            ${config.show_state
              ? html`<status-badge .state="${state}"></status-badge>`
              : ''}
          </div>

          ${currentTemp !== undefined
            ? html`
                <div class="temp-hero" style="--temp-color: ${tempColor?.color || 'var(--vpc-primary)'}">
                  <span class="temp-hero-value">${currentTemp.toFixed(1)}</span>
                  <span class="temp-hero-unit">°C</span>
                  ${targetTemp !== undefined
                    ? html`<span class="temp-hero-target">→ ${targetTemp.toFixed(1)}°C</span>`
                    : ''}
                </div>
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

    return html`
      <ha-card
        class="${this._getCardClasses(isSolarActive, config)}"
        style="--card-accent: ${accentColor}"
        @click="${() => this._showMoreInfo(config.entity!)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isSolarActive ? 'icon-active' : ''}">
              <ha-icon
                icon="${config.icon || 'mdi:solar-power'}"
                class="${isSolarActive ? 'solar-active' : ''}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">${state}</span>
            </div>
            ${config.show_state
              ? html`<status-badge .state="${state}"></status-badge>`
              : ''}
          </div>

          ${config.show_detail_status && solarState
            ? html`<detail-status .raw="${solarState}"></detail-status>`
            : ''}

          <div class="solar-temps">
            ${poolTemp !== undefined
              ? html`
                  <div class="info-row">
                    <ha-icon icon="mdi:pool"></ha-icon>
                    <span class="info-label">Pool</span>
                    <span class="info-value">${poolTemp.toFixed(1)}°C</span>
                  </div>
                `
              : ''}
            ${absorberTemp !== undefined
              ? html`
                  <div class="info-row">
                    <ha-icon icon="mdi:solar-panel"></ha-icon>
                    <span class="info-label">Absorber</span>
                    <span class="info-value">${absorberTemp.toFixed(1)}°C</span>
                  </div>
                `
              : ''}
            ${tempDelta !== undefined
              ? html`
                  <div class="delta-display ${tempDelta > 0 ? 'delta-positive' : 'delta-negative'}">
                    <ha-icon icon="${tempDelta > 0 ? 'mdi:arrow-up' : 'mdi:arrow-down'}"></ha-icon>
                    <span class="delta-value">\u0394 ${tempDelta > 0 ? '+' : ''}${tempDelta.toFixed(1)}°C</span>
                    <span class="delta-hint">${tempDelta < 0
                      ? 'Too cold for heating'
                      : tempDelta < 3
                      ? 'Heating possible'
                      : 'Ideal for heating'}</span>
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
    let valueIcon = 'mdi:test-tube';

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
      valueIcon = 'mdi:flash';
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
      valueIcon = 'mdi:ph';
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

    // BUG FIX: Safely check dosingState is an array before calling .some()
    const isDosing = state === 'on' && Array.isArray(dosingState) && dosingState.some((s: string) => s.includes('ACTIVE'));

    // Get color for current value
    const valueColor = currentValue !== undefined
      ? dosingType === 'chlorine'
        ? StateColorHelper.getOrpColor(currentValue, targetValue)
        : StateColorHelper.getPhColor(currentValue, targetValue)
      : undefined;

    return html`
      <ha-card
        class="${this._getCardClasses(isDosing, config)}"
        style="--card-accent: ${accentColor}"
        @click="${() => this._showMoreInfo(config.entity!)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isDosing ? 'icon-active' : ''}">
              <ha-icon
                icon="${config.icon || this._getDosingIcon(dosingType)}"
                class="${isDosing ? 'dosing-active' : ''}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">${state}</span>
            </div>
            ${config.show_state
              ? html`<status-badge .state="${state}" .pulse="${isDosing}"></status-badge>`
              : ''}
          </div>

          ${currentValue !== undefined
            ? html`
                <div class="dosing-hero">
                  <div class="dosing-current" style="color: ${valueColor?.color || 'var(--vpc-text)'}">
                    <ha-icon icon="${valueIcon}"></ha-icon>
                    <span class="dosing-current-value">${currentValue.toFixed(dosingType === 'chlorine' ? 0 : 1)}</span>
                    <span class="dosing-current-unit">${unit}</span>
                  </div>
                  ${targetValue !== undefined
                    ? html`
                        <div class="dosing-target">
                          <ha-icon icon="mdi:arrow-right-thin"></ha-icon>
                          <span>${targetValue.toFixed(dosingType === 'chlorine' ? 0 : 1)}${unit}</span>
                        </div>
                      `
                    : ''}
                  ${minValue !== undefined && maxValue !== undefined
                    ? html`
                        <div class="dosing-range">
                          <span>Min ${minValue.toFixed(dosingType === 'chlorine' ? 0 : 1)}${unit}</span>
                          <span class="dosing-range-sep">\u2022</span>
                          <span>Max ${maxValue.toFixed(dosingType === 'chlorine' ? 0 : 1)}${unit}</span>
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

    return html`
      <ha-card
        class="${this._getCardClasses(anyActive, config)}"
        style="--card-accent: ${accentColor}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${anyActive ? 'icon-active' : ''}">
              <ha-icon icon="mdi:pool"></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle">${anyActive ? 'Active' : 'Idle'}</span>
            </div>
          </div>

          <!-- Water Chemistry Grid -->
          <div class="chemistry-grid">
            ${poolTemp !== undefined
              ? html`
                  <div class="chemistry-card" style="--chem-color: ${tempColor?.color || '#4CAF50'}"
                    @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(poolTempSensorId); }}">
                    <ha-icon icon="mdi:thermometer-water"></ha-icon>
                    <span class="chemistry-val">${poolTemp.toFixed(1)}°C</span>
                    <span class="chemistry-label">Temperature</span>
                  </div>
                `
              : ''}
            ${phValue !== undefined
              ? html`
                  <div class="chemistry-card" style="--chem-color: ${phColor?.color || '#4CAF50'}"
                    @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(phSensorId); }}">
                    <ha-icon icon="mdi:ph"></ha-icon>
                    <span class="chemistry-val">pH ${phValue.toFixed(1)}</span>
                    <span class="chemistry-label">${phStatus === 'ok' ? 'Optimal' : 'Attention'}</span>
                  </div>
                `
              : ''}
            ${orpValue !== undefined
              ? html`
                  <div class="chemistry-card" style="--chem-color: ${orpColor?.color || '#4CAF50'}"
                    @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(orpSensorId); }}">
                    <ha-icon icon="mdi:flash"></ha-icon>
                    <span class="chemistry-val">${orpValue.toFixed(0)}mV</span>
                    <span class="chemistry-label">${orpStatus === 'ok' ? 'Optimal' : orpStatus === 'warning' ? 'Low' : 'High'}</span>
                  </div>
                `
              : ''}
          </div>

          <!-- Active Devices -->
          ${activeDevices.length > 0
            ? html`
                <div class="overview-section">
                  <div class="section-title">
                    <ha-icon icon="mdi:devices"></ha-icon>
                    <span>Devices</span>
                  </div>
                  <div class="device-list">
                    ${activeDevices.map(
                      (device) => html`
                        <div class="device-row"
                          @click="${(e: Event) => { e.stopPropagation(); this._showMoreInfo(device.entityId); }}">
                          <ha-icon
                            icon="${device.icon}"
                            class="${['on', 'auto', 'heat', 'heating'].includes(device.state) ? 'device-active' : 'device-inactive'}"
                          ></ha-icon>
                          <span class="device-name">${device.name}</span>
                          <span class="device-status">${device.status}</span>
                          <div class="device-dot ${['on', 'auto', 'heat', 'heating'].includes(device.state) ? 'dot-active' : 'dot-inactive'}"></div>
                        </div>
                      `
                    )}
                  </div>
                </div>
              `
            : ''}

          <!-- Warnings -->
          ${warnings.length > 0
            ? html`
                <div class="overview-section">
                  <div class="section-title warning-title">
                    <ha-icon icon="mdi:alert-outline"></ha-icon>
                    <span>Warnings</span>
                  </div>
                  <div class="warning-list">
                    ${warnings.map(
                      (warning) => html`
                        <div class="warning-row">
                          <ha-icon icon="${warning.includes('Frost') ? 'mdi:snowflake-alert' : 'mdi:alert-circle'}"></ha-icon>
                          <span>${warning}</span>
                        </div>
                      `
                    )}
                  </div>
                </div>
              `
            : html`
                <div class="all-ok-display">
                  <ha-icon icon="mdi:check-circle"></ha-icon>
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
         BASE VARIABLES
         ============================================ */
      :host {
        --vpc-spacing: 16px;
        --vpc-radius: 16px;
        --vpc-bg: var(--ha-card-background, var(--card-background-color, #fff));
        --vpc-border: none;
        --vpc-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.08));
        --vpc-backdrop: none;
        --vpc-primary: var(--primary-color, #2196F3);
        --vpc-text: var(--primary-text-color, #212121);
        --vpc-text-secondary: var(--secondary-text-color, #757575);
        --vpc-icon-size: 24px;
        --vpc-transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        --card-accent: var(--primary-color, #2196F3);

        display: block;
      }

      /* ============================================
         THEME OVERRIDES (fixed: on ha-card, not :host)
         ============================================ */
      ha-card.theme-luxury,
      ha-card.theme-glass {
        --vpc-bg: rgba(255, 255, 255, 0.65);
        --vpc-backdrop: blur(20px) saturate(180%);
        --vpc-radius: 24px;
        --vpc-border: 1px solid rgba(255, 255, 255, 0.3);
        --vpc-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
      }

      ha-card.theme-modern {
        --vpc-radius: 20px;
        --vpc-spacing: 20px;
        --vpc-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
      }

      ha-card.theme-minimalist {
        --vpc-radius: 12px;
        --vpc-shadow: none;
        --vpc-border: 1px solid rgba(0,0,0,0.06);
      }

      ha-card.theme-neon {
        --vpc-bg: linear-gradient(145deg, #1a1a2e, #0a0a1a);
        --vpc-border: 1px solid rgba(0, 255, 255, 0.15);
        --vpc-shadow: 0 0 20px rgba(0, 255, 255, 0.08);
        --vpc-radius: 8px;
        --vpc-primary: #00ffff;
        --vpc-text: #e0e0e0;
        --vpc-text-secondary: #808080;
      }

      ha-card.theme-premium {
        --vpc-bg: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,245,255,0.95) 100%);
        --vpc-radius: 20px;
        --vpc-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255,255,255,0.8);
        --vpc-border: 1px solid rgba(255,255,255,0.6);
      }

      /* Dark mode support via HA's dark-mode variables */
      @media (prefers-color-scheme: dark) {
        ha-card.theme-luxury,
        ha-card.theme-glass {
          --vpc-bg: rgba(20, 20, 30, 0.7);
          --vpc-border: 1px solid rgba(255, 255, 255, 0.08);
          --vpc-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        ha-card.theme-premium {
          --vpc-bg: linear-gradient(135deg, rgba(30,30,45,0.95) 0%, rgba(20,20,35,0.95) 100%);
          --vpc-border: 1px solid rgba(255,255,255,0.06);
        }
        ha-card.theme-minimalist {
          --vpc-border: 1px solid rgba(255,255,255,0.06);
        }
      }

      /* ============================================
         HA-CARD BASE
         ============================================ */
      ha-card {
        padding: var(--vpc-spacing);
        background: var(--vpc-bg);
        border-radius: var(--vpc-radius);
        box-shadow: var(--vpc-shadow);
        border: var(--vpc-border);
        backdrop-filter: var(--vpc-backdrop);
        -webkit-backdrop-filter: var(--vpc-backdrop);
        transition: var(--vpc-transition);
        overflow: hidden;
        position: relative;
        cursor: pointer;
      }

      ha-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      }

      ha-card.theme-neon:hover {
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.15);
      }

      ha-card.theme-neon.is-active {
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.25), inset 0 0 15px rgba(0, 255, 255, 0.05);
        border-color: rgba(0, 255, 255, 0.4);
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
        opacity: 0.7;
        transition: opacity 0.3s ease, height 0.3s ease;
      }

      ha-card.is-active .accent-bar {
        height: 4px;
        opacity: 1;
        background: linear-gradient(90deg, var(--card-accent), color-mix(in srgb, var(--card-accent) 70%, white));
      }

      ha-card.theme-neon .accent-bar {
        background: linear-gradient(90deg, #00ffff, #7c4dff, #00ffff);
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
      }

      ha-card.theme-minimalist .accent-bar {
        height: 2px;
        opacity: 0.5;
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
        width: 44px;
        height: 44px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(var(--rgb-primary-color, 33,150,243), 0.08);
        transition: var(--vpc-transition);
        flex-shrink: 0;
      }

      .header-icon.icon-active {
        background: rgba(var(--rgb-primary-color, 33,150,243), 0.15);
        box-shadow: 0 0 0 4px rgba(var(--rgb-primary-color, 33,150,243), 0.06);
      }

      ha-card.theme-neon .header-icon {
        background: rgba(0, 255, 255, 0.08);
        border: 1px solid rgba(0, 255, 255, 0.15);
      }

      ha-card.theme-neon .header-icon.icon-active {
        background: rgba(0, 255, 255, 0.12);
        box-shadow: 0 0 12px rgba(0, 255, 255, 0.15);
      }

      .header-icon ha-icon {
        --mdc-icon-size: 24px;
        color: var(--vpc-primary);
      }

      .header-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .name {
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.2px;
        color: var(--vpc-text);
        line-height: 1.3;
      }

      .header-subtitle {
        font-size: 13px;
        color: var(--vpc-text-secondary);
        text-transform: capitalize;
        line-height: 1.2;
      }

      /* ============================================
         ICONS & ANIMATIONS
         ============================================ */
      ha-icon {
        --mdc-icon-size: var(--vpc-icon-size);
        color: var(--vpc-primary);
        transition: var(--vpc-transition);
      }

      @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes pulse-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }

      .pump-running { animation: rotate 2s linear infinite; }
      .heater-active { animation: breathe 2s ease-in-out infinite; color: #FF5722; }
      .solar-active { animation: breathe 3s ease-in-out infinite; color: #FF9800; }
      .dosing-active { animation: pulse-glow 2s ease-in-out infinite; color: #4CAF50; }

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
         DOSING HERO DISPLAY
         ============================================ */
      .dosing-hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 12px;
        border-radius: 16px;
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.03);
      }

      ha-card.theme-neon .dosing-hero {
        background: rgba(0, 255, 255, 0.04);
        border: 1px solid rgba(0, 255, 255, 0.08);
      }

      .dosing-current {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .dosing-current ha-icon {
        --mdc-icon-size: 20px;
      }

      .dosing-current-value {
        font-size: 32px;
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.5px;
      }

      .dosing-current-unit {
        font-size: 16px;
        font-weight: 500;
        opacity: 0.7;
      }

      .dosing-target {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--vpc-text-secondary);
        font-size: 14px;
        font-weight: 500;
      }

      .dosing-target ha-icon {
        --mdc-icon-size: 18px;
        opacity: 0.6;
      }

      .dosing-range {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--vpc-text-secondary);
        opacity: 0.8;
      }

      .dosing-range-sep {
        opacity: 0.4;
      }

      /* ============================================
         INFO ROWS (unified: rpm, runtime, outside temp, etc.)
         ============================================ */
      .info-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: 12px;
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.03);
        font-size: 14px;
        color: var(--vpc-text);
      }

      ha-card.theme-neon .info-row {
        background: rgba(0, 255, 255, 0.04);
        border: 1px solid rgba(0, 255, 255, 0.08);
      }

      .info-row ha-icon {
        --mdc-icon-size: 18px;
        color: var(--vpc-text-secondary);
        flex-shrink: 0;
      }

      .info-label {
        flex: 1;
        font-weight: 500;
        color: var(--vpc-text-secondary);
      }

      .info-value {
        font-weight: 600;
        color: var(--vpc-text);
      }

      .info-badge {
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
      }

      .info-badge.warning {
        background: rgba(255, 152, 0, 0.15);
        color: #ef6c00;
      }

      .info-row-warning {
        background: rgba(255, 152, 0, 0.08);
        border: 1px solid rgba(255, 152, 0, 0.2);
      }

      /* ============================================
         SOLAR TEMPERATURE SECTION
         ============================================ */
      .solar-temps {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .delta-display {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
      }

      .delta-positive {
        background: rgba(76, 175, 80, 0.08);
        color: #2e7d32;
      }

      .delta-negative {
        background: rgba(244, 67, 54, 0.08);
        color: #c62828;
      }

      .delta-display ha-icon {
        --mdc-icon-size: 18px;
      }

      .delta-value {
        font-weight: 700;
      }

      .delta-hint {
        font-size: 12px;
        font-weight: 400;
        opacity: 0.7;
        margin-left: auto;
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
         OVERVIEW: DEVICE LIST
         ============================================ */
      .device-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .device-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border-radius: 12px;
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.03);
        cursor: pointer;
        transition: var(--vpc-transition);
      }

      .device-row:hover {
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.06);
      }

      ha-card.theme-neon .device-row {
        background: rgba(0, 255, 255, 0.04);
        border: 1px solid rgba(0, 255, 255, 0.06);
      }

      .device-row ha-icon {
        --mdc-icon-size: 20px;
        flex-shrink: 0;
      }

      .device-active {
        color: var(--vpc-primary) !important;
      }

      .device-inactive {
        color: var(--vpc-text-secondary) !important;
        opacity: 0.5;
      }

      .device-name {
        font-weight: 500;
        flex: 1;
        font-size: 14px;
        color: var(--vpc-text);
      }

      .device-status {
        color: var(--vpc-text-secondary);
        font-size: 13px;
      }

      .device-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .dot-active {
        background: #4CAF50;
        box-shadow: 0 0 6px rgba(76, 175, 80, 0.4);
      }

      .dot-inactive {
        background: var(--vpc-text-secondary);
        opacity: 0.3;
      }

      /* ============================================
         OVERVIEW: WARNINGS
         ============================================ */
      .warning-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .warning-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: 12px;
        background: rgba(255, 152, 0, 0.08);
        border: 1px solid rgba(255, 152, 0, 0.15);
        font-size: 13px;
        font-weight: 500;
        color: #ef6c00;
      }

      .warning-row ha-icon {
        --mdc-icon-size: 18px;
        color: #ef6c00;
        flex-shrink: 0;
      }

      .all-ok-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 14px;
        border-radius: 12px;
        background: rgba(76, 175, 80, 0.08);
        border: 1px solid rgba(76, 175, 80, 0.15);
        color: #2e7d32;
        font-weight: 500;
        font-size: 14px;
      }

      .all-ok-display ha-icon {
        --mdc-icon-size: 20px;
        color: #2e7d32;
      }

      /* ============================================
         COMPACT CARD
         ============================================ */
      ha-card.compact-card {
        padding: 12px 16px;
      }

      .compact-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.04);
        flex-shrink: 0;
        transition: var(--vpc-transition);
      }

      .compact-icon-active {
        background: rgba(var(--rgb-primary-color, 33,150,243), 0.1);
      }

      .compact-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .compact-icon ha-icon.active {
        color: var(--vpc-primary);
      }

      .compact-icon ha-icon.inactive {
        color: var(--vpc-text-secondary);
        opacity: 0.5;
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
      }

      .compact-value {
        font-weight: 600;
        color: var(--vpc-text);
      }

      .compact-detail {
        color: var(--vpc-text-secondary);
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
      }

      ha-card.size-small .header-icon {
        width: 36px;
        height: 36px;
        border-radius: 10px;
      }

      ha-card.size-small .name {
        font-size: 14px;
      }

      ha-card.size-small .temp-hero-value {
        font-size: 32px;
      }

      ha-card.size-large {
        --vpc-spacing: 24px;
        --vpc-icon-size: 28px;
      }

      ha-card.size-large .header-icon {
        width: 52px;
        height: 52px;
        border-radius: 16px;
      }

      ha-card.size-large .name {
        font-size: 18px;
      }

      ha-card.size-large .temp-hero-value {
        font-size: 52px;
      }

      ha-card.size-fullscreen {
        --vpc-spacing: 32px;
        --vpc-icon-size: 32px;
        height: 100%;
        min-height: 80vh;
      }

      ha-card.size-fullscreen .header-icon {
        width: 56px;
        height: 56px;
        border-radius: 18px;
      }

      ha-card.size-fullscreen .name {
        font-size: 20px;
      }

      ha-card.size-fullscreen .temp-hero-value {
        font-size: 64px;
      }

      /* ============================================
         ANIMATION VARIANTS
         ============================================ */
      ha-card.animation-subtle {
        transition: all 0.2s ease;
      }

      ha-card.animation-subtle:hover {
        transform: translateY(-1px);
      }

      ha-card.animation-smooth {
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      }

      ha-card.animation-energetic {
        transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      ha-card.animation-energetic:hover {
        transform: translateY(-3px) scale(1.005);
      }

      /* Flow animation for active state */
      @keyframes flow-gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      ha-card.flow-active .accent-bar {
        background: linear-gradient(90deg,
          var(--card-accent),
          color-mix(in srgb, var(--card-accent) 60%, white),
          var(--card-accent)
        );
        background-size: 200% 100%;
        animation: flow-gradient 3s ease-in-out infinite;
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
          padding: 10px 6px;
        }

        .chemistry-val {
          font-size: 14px;
        }

        .system-grid {
          grid-template-columns: 1fr;
        }

        .temp-hero-value {
          font-size: 36px;
        }

        .dosing-current-value {
          font-size: 28px;
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
  '%c VIOLET-POOL-CARD %c 0.2.0 ',
  'color: white; background: linear-gradient(135deg, #667eea, #764ba2); font-weight: 700; padding: 2px 6px; border-radius: 4px 0 0 4px;',
  'color: #667eea; background: white; font-weight: 700; padding: 2px 6px; border-radius: 0 4px 4px 0;'
);
