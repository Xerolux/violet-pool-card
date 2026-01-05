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

// HomeAssistant types
interface HomeAssistant {
  states: { [entity_id: string]: any };
  callService: (domain: string, service: string, serviceData?: any) => Promise<any>;
  // Add more as needed
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
  entity_prefix?: string; // e.g., 'violet_pool', 'pool_1', 'garden_pool'

  // Individual entity overrides (optional - auto-generated from prefix if not set)
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

    // For overview and system cards, single entity is optional
    // For other cards, entity is required
    if (config.card_type !== 'overview' && config.card_type !== 'system' && !config.entity) {
      throw new Error('You need to define an entity');
    }

    this.config = {
      // Display defaults
      show_state: true,
      show_detail_status: true,
      show_controls: true,
      show_runtime: false,
      show_history: false,

      // PREMIUM DESIGN DEFAULTS
      size: 'medium',
      theme: 'luxury',
      animation: 'smooth',
      blur_intensity: 10,

      // Legacy support
      style: 'standard',
      show_flow_animation: false,

      // Default entity prefix (matches violet-hass integration default)
      entity_prefix: 'violet_pool',

      ...config,
    };
  }

  /**
   * Build entity ID from prefix and suffix
   * Supports dynamic entity naming for multiple controllers
   *
   * @example
   * _buildEntityId('switch', 'pump') => 'switch.violet_pool_pump'
   * With entity_prefix: 'pool_1' => 'switch.pool_1_pump'
   */
  private _buildEntityId(domain: string, suffix: string): string {
    const prefix = this.config.entity_prefix || 'violet_pool';
    return `${domain}.${prefix}_${suffix}`;
  }

  /**
   * Get entity ID with fallback to config override or auto-generated from prefix
   */
  private _getEntityId(
    configKey: keyof VioletPoolCardConfig,
    domain: string,
    suffix: string,
    entitiesIndex?: number
  ): string {
    // First: Check explicit config override
    const configValue = this.config[configKey] as string | undefined;
    if (configValue) {
      return configValue;
    }

    // Second: Check entities array
    if (entitiesIndex !== undefined && this.config.entities && this.config.entities[entitiesIndex]) {
      return this.config.entities[entitiesIndex];
    }

    // Third: Build from prefix
    return this._buildEntityId(domain, suffix);
  }

  protected render(): TemplateResult {
    if (!this.config || !this.hass) {
      return html``;
    }

    // Check if entity exists (for non-overview cards)
    if (this.config.entity) {
      const entity = this.hass.states[this.config.entity];
      if (!entity) {
        return html`
          <ha-card>
            <div class="error">
              <ha-icon icon="mdi:alert-circle"></ha-icon>
              <span>Entity ${this.config.entity} not found</span>
            </div>
          </ha-card>
        `;
      }
    }

    // Render based on card type
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
            <div class="error">
              <ha-icon icon="mdi:alert-circle"></ha-icon>
              <span>Unknown card_type: ${this.config.card_type}</span>
            </div>
          </ha-card>
        `;
    }
  }

  private _getCardClasses(isActive: boolean, config: VioletPoolCardConfig): string {
    const classes = [];

    // Size class
    classes.push(`size-${config.size || 'medium'}`);

    // Theme class (new premium system or legacy)
    if (config.theme) {
      classes.push(`theme-${config.theme}`);
    } else {
      classes.push(config.style || 'standard');
    }

    // Animation class
    if (config.animation && config.animation !== 'none') {
      classes.push(`animation-${config.animation}`);
    }

    // Flow animation (legacy or active)
    if ((config.show_flow_animation || config.animation === 'energetic') && isActive) {
      classes.push('flow-active');
    }

    // Active state
    if (isActive) {
      classes.push('is-active');
    }

    return classes.join(' ');
  }

  private renderSystemCard(): TemplateResult {
    // Determine entities from config or prefix-based defaults
    const pumpEntity = this._getEntityId('pump_entity', 'switch', 'pump', 0);
    const heaterEntity = this._getEntityId('heater_entity', 'climate', 'heater', 1);
    const solarEntity = this._getEntityId('solar_entity', 'climate', 'solar', 2);
    const dosingEntity = this._getEntityId('chlorine_entity', 'switch', 'dos_1_cl', 3);

    // Helper to create config for sub-cards
    const createSubConfig = (type: string, entity: string, extra: any = {}): VioletPoolCardConfig | null => {
      // For overview, entity check is not strict
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

    // Get current pump speed from PUMPSTATE
    const parsedState = EntityHelper.parsePumpState(pumpState);
    const currentSpeed = parsedState.level !== undefined ? parsedState.level : 0;

    // Get RPM values for each speed level
    const rpmLevel0 = entity.attributes?.PUMP_RPM_0 || 0;
    const rpmLevel1 = entity.attributes?.PUMP_RPM_1 || 0;
    const rpmLevel2 = entity.attributes?.PUMP_RPM_2 || 0;
    const rpmLevel3 = entity.attributes?.PUMP_RPM_3 || 0;
    const rpmValues = [rpmLevel0, rpmLevel1, rpmLevel2, rpmLevel3];
    const currentRPM = rpmValues[currentSpeed] || 0;

    // Get runtime (in seconds, convert to readable format)
    const runtimeSeconds = entity.attributes?.runtime || 0;
    const runtimeHours = Math.floor(runtimeSeconds / 3600);
    const runtimeMinutes = Math.floor((runtimeSeconds % 3600) / 60);
    const runtimeDisplay = runtimeHours > 0
      ? `${runtimeHours}h ${runtimeMinutes}min`
      : `${runtimeMinutes}min`;

    // Define quick actions for pump
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
      <ha-card class="${this._getCardClasses(isRunning, config)}">
        <div class="card-content">
          <div class="header">
            <ha-icon
              icon="${config.icon || 'mdi:pump'}"
              class="${isRunning ? 'pump-running' : ''}"
            ></ha-icon>
            <span class="name">${name}</span>
            ${config.show_state
              ? html`<status-badge .state="${state}" .pulse="${isRunning}"></status-badge>`
              : ''}
            ${currentSpeed > 0
              ? html`<span class="badge-secondary">Level ${currentSpeed}</span>`
              : ''}
          </div>

          ${config.show_detail_status && pumpState
            ? html`<detail-status .raw="${pumpState}"></detail-status>`
            : ''}

          ${currentRPM > 0
            ? html`
                <div class="rpm-display">
                  <ha-icon icon="mdi:rotate-right"></ha-icon>
                  <span>${currentRPM} RPM</span>
                </div>
              `
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
                <div class="runtime-display">
                  <ha-icon icon="mdi:timer-outline"></ha-icon>
                  <span>Runtime: ${runtimeDisplay}</span>
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

    // Get temperature values
    const currentTemp = EntityHelper.getCurrentTemperature(entity);
    const targetTemp = EntityHelper.getTargetTemperature(entity);
    const minTemp = EntityHelper.getMinTemperature(entity) || 18;
    const maxTemp = EntityHelper.getMaxTemperature(entity) || 35;

    // Get heater state and blockage info
    const heaterState = entity.attributes?.HEATERSTATE || '';

    // Get outside temperature (if available)
    const outsideTemp = entity.attributes?.outside_temperature;
    const minOutsideTemp = entity.attributes?.min_outside_temperature || 14.5;

    // Check if blocked by outside temperature
    const isBlockedByOutsideTemp =
      heaterState.includes('BLOCKED_BY_OUTSIDE_TEMP') ||
      (outsideTemp !== undefined && outsideTemp < minOutsideTemp);

    // Define quick actions for heater
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
      <ha-card class="${this._getCardClasses(isHeating, config)}">
        <div class="card-content">
          <div class="header">
            <ha-icon
              icon="${config.icon || 'mdi:radiator'}"
              class="${isHeating ? 'heater-active' : ''}"
            ></ha-icon>
            <span class="name">${name}</span>
            ${config.show_state
              ? html`<status-badge .state="${state}"></status-badge>`
              : ''}
          </div>

          ${currentTemp !== undefined
            ? html`
                <value-display
                  .value="${currentTemp}"
                  unit="°C"
                  label="Current Temperature"
                  .target="${targetTemp}"
                  large
                ></value-display>
              `
            : ''}

          ${config.show_detail_status && heaterState
            ? html`<detail-status .raw="${heaterState}"></detail-status>`
            : ''}

          ${outsideTemp !== undefined
            ? html`
                <div class="outside-temp-display ${isBlockedByOutsideTemp ? 'blocked' : ''}">
                  <ha-icon icon="mdi:thermometer"></ha-icon>
                  <span>Outside: ${outsideTemp.toFixed(1)}°C</span>
                  ${isBlockedByOutsideTemp
                    ? html`<span class="warning-text">(Min: ${minOutsideTemp}°C)</span>`
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

    // Get temperature values
    const poolTemp = EntityHelper.getCurrentTemperature(entity);
    const targetTemp = EntityHelper.getTargetTemperature(entity);
    const minTemp = EntityHelper.getMinTemperature(entity) || 18;
    const maxTemp = EntityHelper.getMaxTemperature(entity) || 32;

    // Get absorber temperature (from onewire3_value sensor or attribute)
    const absorberTemp = entity.attributes?.absorber_temperature;

    // Calculate delta
    const tempDelta = absorberTemp !== undefined && poolTemp !== undefined
      ? absorberTemp - poolTemp
      : undefined;

    // Get solar state
    const solarState = entity.attributes?.SOLARSTATE || '';

    // Define quick actions for solar
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
      <ha-card class="${this._getCardClasses(isSolarActive, config)}">
        <div class="card-content">
          <div class="header">
            <ha-icon
              icon="${config.icon || 'mdi:solar-power'}"
              class="${isSolarActive ? 'solar-active' : ''}"
            ></ha-icon>
            <span class="name">${name}</span>
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
                  <div class="temp-item">
                    <ha-icon icon="mdi:pool"></ha-icon>
                    <span class="temp-label">Pool:</span>
                    <span class="temp-value">${poolTemp.toFixed(1)}°C</span>
                  </div>
                `
              : ''}
            ${absorberTemp !== undefined
              ? html`
                  <div class="temp-item">
                    <ha-icon icon="mdi:solar-panel"></ha-icon>
                    <span class="temp-label">Absorber:</span>
                    <span class="temp-value">${absorberTemp.toFixed(1)}°C</span>
                  </div>
                `
              : ''}
            ${tempDelta !== undefined
              ? html`
                  <div class="temp-delta ${tempDelta > 0 ? 'positive' : 'negative'}">
                    <ha-icon icon="${tempDelta > 0 ? 'mdi:arrow-up' : 'mdi:arrow-down'}"></ha-icon>
                    <span>Δ ${tempDelta > 0 ? '+' : ''}${tempDelta.toFixed(1)}°C</span>
                    ${tempDelta < 0
                      ? html`<span class="delta-hint">(too cold for heating)</span>`
                      : tempDelta < 3
                      ? html`<span class="delta-hint">(heating possible)</span>`
                      : html`<span class="delta-hint">(ideal for heating)</span>`}
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

    // Determine dosing type from entity ID or config
    const dosingType = config.dosing_type || this._detectDosingType(config.entity!);

    // Get dosing state array (e.g., DOS_1_CL_STATE)
    const dosingStateKey = Object.keys(entity.attributes || {}).find(
      (key) => key.includes('DOS_') && key.includes('_STATE')
    );
    const dosingState = dosingStateKey ? entity.attributes[dosingStateKey] : [];

    // Get current value and target based on dosing type
    let currentValue: number | undefined;
    let targetValue: number | undefined;
    let minValue: number | undefined;
    let maxValue: number | undefined;
    let unit = '';
    let valueIcon = 'mdi:test-tube';

    if (dosingType === 'chlorine') {
      // ORP sensor - use dynamic entity IDs
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
      // pH sensor - use dynamic entity IDs
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

    // Get dosing history (if available)
    const dosingVolume24h = entity.attributes?.dosing_volume_24h;

    // Define quick actions for dosing
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

    const isDosing = state === 'on' && dosingState.some((s: string) => s.includes('ACTIVE'));

    return html`
      <ha-card class="${this._getCardClasses(isDosing, config)}">
        <div class="card-content">
          <div class="header">
            <ha-icon
              icon="${config.icon || this._getDosingIcon(dosingType)}"
              class="${isDosing ? 'dosing-active' : ''}"
            ></ha-icon>
            <span class="name">${name}</span>
            ${config.show_state
              ? html`<status-badge .state="${state}" .pulse="${isDosing}"></status-badge>`
              : ''}
          </div>

          ${currentValue !== undefined && targetValue !== undefined
            ? html`
                <div class="dosing-values">
                  <div class="value-row">
                    <ha-icon icon="${valueIcon}"></ha-icon>
                    <span class="current-value">${currentValue.toFixed(dosingType === 'chlorine' ? 0 : 1)}${unit}</span>
                    <ha-icon icon="mdi:arrow-right" class="arrow-icon"></ha-icon>
                    <span class="target-value">${targetValue.toFixed(dosingType === 'chlorine' ? 0 : 1)}${unit}</span>
                  </div>
                  ${minValue !== undefined && maxValue !== undefined
                    ? html`
                        <div class="threshold-row">
                          <span class="threshold-label">Min:</span>
                          <span class="threshold-value">${minValue.toFixed(dosingType === 'chlorine' ? 0 : 1)}${unit}</span>
                          <span class="separator">|</span>
                          <span class="threshold-label">Max:</span>
                          <span class="threshold-value">${maxValue.toFixed(dosingType === 'chlorine' ? 0 : 1)}${unit}</span>
                        </div>
                      `
                    : ''}
                </div>
              `
            : ''}

          ${config.show_detail_status && dosingState && Array.isArray(dosingState) && dosingState.length > 0
            ? html`<warning-chips .warnings="${dosingState}" defaultType="warning"></warning-chips>`
            : ''}

          ${config.show_controls
            ? html`<quick-actions .actions="${quickActions}"></quick-actions>`
            : ''}

          ${config.show_history && dosingVolume24h !== undefined
            ? html`
                <div class="dosing-history">
                  <ha-icon icon="mdi:chart-line"></ha-icon>
                  <span>Last 24h: ${dosingVolume24h}ml</span>
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
      case 'chlorine':
        return 'mdi:flask-outline';
      case 'ph_minus':
        return 'mdi:flask-minus';
      case 'ph_plus':
        return 'mdi:flask-plus';
      case 'flocculant':
        return 'mdi:flask';
      default:
        return 'mdi:flask-outline';
    }
  }

  private renderOverviewCard(config: VioletPoolCardConfig = this.config): TemplateResult {
    const name = config.name || 'Pool Status';

    // Get all pool entities - using dynamic entity IDs based on prefix
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

    // Get sensor values - using dynamic entity IDs based on prefix
    const poolTempSensorId = this._getEntityId('pool_temp_entity', 'sensor', 'temperature', 5);
    const phSensorId = this._getEntityId('ph_value_entity', 'sensor', 'ph_value', 6);
    const orpSensorId = this._getEntityId('orp_value_entity', 'sensor', 'orp_value', 7);

    const poolTempSensor = this.hass.states[poolTempSensorId];
    const phSensor = this.hass.states[phSensorId];
    const orpSensor = this.hass.states[orpSensorId];

    const poolTemp = poolTempSensor ? parseFloat(poolTempSensor.state) : undefined;
    const phValue = phSensor ? parseFloat(phSensor.state) : undefined;
    const orpValue = orpSensor ? parseFloat(orpSensor.state) : undefined;

    // Determine water chemistry status
    const getPhStatus = (ph?: number) => {
      if (!ph) return 'unknown';
      if (ph < 7.0 || ph > 7.4) return 'warning';
      return 'ok';
    };

    const getOrpStatus = (orp?: number) => {
      if (!orp) return 'unknown';
      if (orp < 650) return 'warning';
      if (orp > 750) return 'high';
      return 'ok';
    };

    const phStatus = getPhStatus(phValue);
    const orpStatus = getOrpStatus(orpValue);

    // Collect active devices
    const activeDevices: Array<{icon: string; name: string; status: string; state: string}> = [];

    if (pumpEntity) {
      const pumpState = pumpEntity.attributes?.PUMPSTATE || '';
      const parsedPumpState = EntityHelper.parsePumpState(pumpState);
      activeDevices.push({
        icon: 'mdi:pump',
        name: 'Pump',
        status: parsedPumpState.status || pumpEntity.state,
        state: pumpEntity.state,
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
      });
    }

    // Collect warnings
    const warnings: string[] = [];
    if (orpStatus === 'warning') warnings.push('ORP too low - Check chlorine dosing');
    if (orpStatus === 'high') warnings.push('ORP too high - Stop chlorine dosing');
    if (phStatus === 'warning') warnings.push('pH out of range - Check dosing');

    // Check for frost protection
    if (pumpEntity?.attributes?.PUMPSTATE?.includes('ANTI_FREEZE')) {
      const outsideTemp = heaterEntity?.attributes?.outside_temperature;
      warnings.push(`Frost protection active${outsideTemp ? ` (${outsideTemp.toFixed(1)}°C)` : ''}`);
    }

    const anyActive = activeDevices.some(d => ['on', 'auto', 'heat', 'heating'].includes(d.state));

    return html`
      <ha-card class="${this._getCardClasses(anyActive, config)}">
        <div class="card-content overview-content">
          <div class="header">
            <ha-icon icon="mdi:pool"></ha-icon>
            <span class="name">${name}</span>
          </div>

          <!-- Water Chemistry -->
          <div class="water-chemistry">
            ${poolTemp !== undefined
              ? html`
                  <div class="chemistry-item">
                    <ha-icon icon="mdi:thermometer"></ha-icon>
                    <div class="chemistry-value">
                      <span class="value">${poolTemp.toFixed(1)}°C</span>
                      <span class="status-indicator ok">OK</span>
                    </div>
                  </div>
                `
              : ''}
            ${phValue !== undefined
              ? html`
                  <div class="chemistry-item">
                    <ha-icon icon="mdi:ph"></ha-icon>
                    <div class="chemistry-value">
                      <span class="value">pH ${phValue.toFixed(1)}</span>
                      <span class="status-indicator ${phStatus}">${phStatus.toUpperCase()}</span>
                    </div>
                  </div>
                `
              : ''}
            ${orpValue !== undefined
              ? html`
                  <div class="chemistry-item">
                    <ha-icon icon="mdi:flash"></ha-icon>
                    <div class="chemistry-value">
                      <span class="value">${orpValue.toFixed(0)}mV</span>
                      <span class="status-indicator ${orpStatus}">${orpStatus === 'warning' ? 'LOW' : orpStatus === 'high' ? 'HIGH' : 'OK'}</span>
                    </div>
                  </div>
                `
              : ''}
          </div>

          <!-- Active Devices -->
          ${activeDevices.length > 0
            ? html`
                <div class="overview-section">
                  <div class="section-title">Active Devices:</div>
                  <div class="device-list">
                    ${activeDevices.map(
                      (device) => html`
                        <div class="device-item">
                          <ha-icon
                            icon="${device.icon}"
                            class="${device.state === 'on' || device.state === 'auto' || device.state === 'heat' || device.state === 'heating' ? 'active' : 'inactive'}"
                          ></ha-icon>
                          <span class="device-name">${device.name}</span>
                          <span class="device-status">(${device.status})</span>
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
                  <div class="section-title">Warnings:</div>
                  <div class="warnings-list">
                    ${warnings.map(
                      (warning) => html`
                        <div class="warning-item">
                          <ha-icon icon="${warning.includes('Frost') ? 'mdi:snowflake-alert' : 'mdi:alert-circle'}"></ha-icon>
                          <span>${warning}</span>
                        </div>
                      `
                    )}
                  </div>
                </div>
              `
            : html`
                <div class="overview-section">
                  <div class="all-ok">
                    <ha-icon icon="mdi:check-circle"></ha-icon>
                    <span>All systems normal</span>
                  </div>
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

    // Determine icon based on domain and entity
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

    // Get detail status and value based on entity type
    let detailStatus = '';
    let currentValue = '';

    // Pump
    if (entity.attributes?.PUMPSTATE) {
      const parsedState = EntityHelper.parsePumpState(entity.attributes.PUMPSTATE);
      detailStatus = parsedState.status;
      if (parsedState.level !== undefined && parsedState.level > 0) {
        currentValue = `Level ${parsedState.level}`;
      }
    }
    // Heater
    else if (entity.attributes?.HEATERSTATE) {
      const parsedState = EntityHelper.parseHeaterState(entity.attributes.HEATERSTATE);
      detailStatus = parsedState.status;
      const temp = EntityHelper.getCurrentTemperature(entity);
      if (temp !== undefined) {
        currentValue = `${temp.toFixed(1)}°C`;
      }
    }
    // Solar
    else if (entity.attributes?.SOLARSTATE) {
      const parsedState = EntityHelper.parseSolarState(entity.attributes.SOLARSTATE);
      detailStatus = parsedState.status;
      const temp = EntityHelper.getCurrentTemperature(entity);
      if (temp !== undefined) {
        currentValue = `${temp.toFixed(1)}°C`;
      }
    }
    // Dosing
    else if (Object.keys(entity.attributes || {}).some(key => key.includes('DOS_') && key.includes('_STATE'))) {
      const dosingStateKey = Object.keys(entity.attributes || {}).find(
        key => key.includes('DOS_') && key.includes('_STATE')
      );
      const dosingState = dosingStateKey ? entity.attributes[dosingStateKey] : [];
      if (Array.isArray(dosingState) && dosingState.length > 0) {
        detailStatus = EntityHelper.formatSnakeCase(dosingState[0]);
      }

      // Get current dosing value - using dynamic entity IDs
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
      <ha-card class="compact-card ${this._getCardClasses(isActive, config)}">
        <div class="card-content compact">
          <ha-icon
            icon="${icon}"
            class="${isActive ? 'active' : 'inactive'}"
          ></ha-icon>
          <div class="compact-info">
            <span class="name">${name}</span>
            <div class="compact-details">
              ${currentValue ? html`<span class="current-value-compact">${currentValue}</span>` : ''}
              ${detailStatus ? html`<span class="detail-compact">${detailStatus}</span>` : ''}
            </div>
          </div>
          <status-badge .state="${state}"></status-badge>
        </div>
      </ha-card>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --vpc-spacing: 16px;
        --vpc-radius: 16px;
        --vpc-bg: var(--ha-card-background, var(--card-background-color, #fff));
        --vpc-border: none;
        --vpc-shadow: var(--ha-card-box-shadow, none);
        --vpc-backdrop: none;
        --vpc-primary: var(--primary-color);
        --vpc-text: var(--primary-text-color);
        --vpc-text-secondary: var(--secondary-text-color);
        --vpc-icon-size: 24px;
        --vpc-transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

        display: block;
      }

      :host(.theme-luxury), :host(.theme-glass) {
        --vpc-bg: rgba(255, 255, 255, 0.65);
        --vpc-backdrop: blur(20px) saturate(180%);
        --vpc-radius: 24px;
        --vpc-border: 1px solid rgba(255, 255, 255, 0.3);
        --vpc-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
      }
      .dark :host(.theme-luxury), .dark :host(.theme-glass) {
        --vpc-bg: rgba(20, 20, 20, 0.65);
        --vpc-border: 1px solid rgba(255, 255, 255, 0.1);
      }

      :host(.theme-modern) {
        --vpc-radius: 26px;
        --vpc-spacing: 20px;
        --vpc-bg: var(--card-background-color, #fff);
        --vpc-shadow: 0 4px 12px rgba(0,0,0,0.05);
      }

      :host(.theme-neon) {
        --vpc-bg: linear-gradient(145deg, #1a1a1a, #0a0a0a);
        --vpc-border: 1px solid rgba(0, 255, 255, 0.2);
        --vpc-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
        --vpc-radius: 4px;
        --vpc-primary: #00ffff;
        --vpc-text: #ffffff;
        --vpc-text-secondary: #b0b0b0;
      }

      :host(.theme-premium) {
        --vpc-bg: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,255,0.9) 100%);
        --vpc-radius: 20px;
        --vpc-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
        --vpc-border: 1px solid rgba(255,255,255,0.8);
      }
      .dark :host(.theme-premium) {
        --vpc-bg: linear-gradient(135deg, rgba(30,30,40,0.95) 0%, rgba(20,20,30,0.95) 100%);
        --vpc-border: 1px solid rgba(255,255,255,0.05);
      }

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
      }

      :host(.theme-neon) ha-card.is-active {
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.1);
        border-color: rgba(0, 255, 255, 0.6);
      }

      .card-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .card-content.compact {
        flex-direction: row;
        align-items: center;
        gap: 12px;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 4px;
      }

      ha-icon {
        --mdc-icon-size: var(--vpc-icon-size);
        color: var(--vpc-primary);
        transition: var(--vpc-transition);
      }

      .name {
        flex: 1;
        font-size: 17px;
        font-weight: 600;
        letter-spacing: 0.3px;
        color: var(--vpc-text);
      }

      .rpm-display, .runtime-display, .outside-temp-display,
      .solar-temps, .dosing-history, .error, .chemistry-item,
      .device-item, .warning-item {
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.04);
        border-radius: 12px;
        padding: 10px;
      }

      .theme-neon .rpm-display, .theme-neon .runtime-display,
      .theme-neon .outside-temp-display, .theme-neon .solar-temps {
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid rgba(0, 255, 255, 0.1);
      }

      .rpm-display, .runtime-display, .outside-temp-display {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 500;
        color: var(--vpc-text);
      }

      .outside-temp-display.blocked {
        background: rgba(255, 152, 0, 0.1);
        border: 1px solid #ff9800;
      }

      .warning-text {
        color: #ff9800;
        font-size: 12px;
        margin-left: 4px;
      }

      .badge-secondary {
        padding: 2px 8px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 500;
        background: var(--secondary-background-color);
        color: var(--secondary-text-color);
      }

      @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes pulse-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

      .pump-running { animation: rotate 2s linear infinite; }
      .heater-active { animation: pulse-glow 2s ease-in-out infinite; color: #FF5722; }
      .solar-active { color: #ff9800; }
      .dosing-active { animation: pulse-glow 2s ease-in-out infinite; color: #4caf50; }

      .solar-temps { display: flex; flex-direction: column; gap: 8px; }
      .temp-item { display: flex; align-items: center; gap: 8px; font-size: 14px; }
      .temp-label { color: var(--vpc-text-secondary); width: 80px; }
      .temp-value { font-weight: 600; color: var(--vpc-text); }
      .temp-delta { display: flex; align-items: center; gap: 8px; margin-top: 4px; font-weight: 600; }
      .temp-delta.positive { color: #4caf50; }
      .temp-delta.negative { color: #f44336; }

      .dosing-values { display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 12px; background: rgba(var(--rgb-primary-text-color), 0.03); }
      .value-row { display: flex; align-items: center; justify-content: center; gap: 16px; font-size: 20px; }
      .current-value { font-weight: 700; }
      .target-value { color: var(--vpc-text-secondary); font-weight: 500; }
      .threshold-row { display: flex; justify-content: center; gap: 8px; font-size: 12px; color: var(--vpc-text-secondary); }

      .water-chemistry { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
      .chemistry-item { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
      .chemistry-value .value { font-size: 15px; font-weight: 700; }

      .status-indicator { padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
      .status-indicator.ok { background: rgba(76, 175, 80, 0.2); color: #2e7d32; }
      .status-indicator.warning { background: rgba(255, 152, 0, 0.2); color: #ef6c00; }
      .status-indicator.high { background: rgba(244, 67, 54, 0.2); color: #c62828; }

      .device-list, .warnings-list { display: flex; flex-direction: column; gap: 8px; }
      .device-item, .warning-item { display: flex; align-items: center; gap: 12px; }
      .device-name { font-weight: 500; flex: 1; }
      .device-status { color: var(--vpc-text-secondary); font-size: 13px; }
      .device-item ha-icon.active { color: var(--vpc-primary); }
      .device-item ha-icon.inactive { color: var(--vpc-text-secondary); opacity: 0.5; }

      .system-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }

      .compact-info { flex: 1; }
      .compact-details { display: flex; gap: 10px; font-size: 12px; margin-top: 2px; }
      .current-value-compact { font-weight: 600; color: var(--vpc-text); }
      .detail-compact { color: var(--vpc-text-secondary); }

      .error { background: rgba(244, 67, 54, 0.1); color: #d32f2f; display: flex; align-items: center; gap: 8px; }

      .size-small { --vpc-spacing: 12px; --vpc-icon-size: 20px; }
      .size-large { --vpc-spacing: 24px; --vpc-icon-size: 28px; }
      .size-fullscreen { --vpc-spacing: 32px; --vpc-icon-size: 32px; height: 100%; min-height: 80vh; }
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
  description: 'Custom card for Violet Pool Controller',
  preview: true,
});

// Inform Home Assistant about the card
console.info(
  '%c VIOLET-POOL-CARD %c 1.0.0 ',
  'color: white; background: #2196F3; font-weight: 700;',
  'color: #2196F3; background: white; font-weight: 700;'
);
