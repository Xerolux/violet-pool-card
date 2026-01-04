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

export interface VioletPoolCardConfig extends LovelaceCardConfig {}

@customElement('violet-pool-card')
export class VioletPoolCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: VioletPoolCardConfig;

  public setConfig(config: VioletPoolCardConfig): void {
    if (!config.card_type) {
      throw new Error('You need to define a card_type');
    }

    // For overview card, entities are optional
    // For other cards, entity is required
    if (config.card_type !== 'overview' && !config.entity) {
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

      ...config,
    };
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
    // Default entities if not specified
    const pumpEntity = 'switch.violet_pool_pump';
    const heaterEntity = 'climate.violet_pool_heater';
    const solarEntity = 'climate.violet_pool_solar';
    const dosingEntity = 'switch.violet_pool_dos_1_cl';

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
      // ORP sensor
      const orpSensor = this.hass.states['sensor.violet_pool_orp_value'];
      currentValue = orpSensor ? parseFloat(orpSensor.state) : undefined;
      const targetEntity = this.hass.states['number.violet_pool_target_orp'];
      targetValue = targetEntity ? parseFloat(targetEntity.state) : undefined;
      minValue = targetEntity?.attributes?.min || 600;
      maxValue = targetEntity?.attributes?.max || 800;
      unit = 'mV';
      valueIcon = 'mdi:flash';
    } else if (dosingType === 'ph_minus' || dosingType === 'ph_plus') {
      // pH sensor
      const phSensor = this.hass.states['sensor.violet_pool_ph_value'];
      currentValue = phSensor ? parseFloat(phSensor.state) : undefined;
      const targetEntity = this.hass.states['number.violet_pool_target_ph'];
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

    // Get all pool entities
    const pumpEntity = this.hass.states['switch.violet_pool_pump'];
    const heaterEntity = this.hass.states['climate.violet_pool_heater'];
    const solarEntity = this.hass.states['climate.violet_pool_solar'];
    const chlorineEntity = this.hass.states['switch.violet_pool_dos_1_cl'];
    const phEntity = this.hass.states['switch.violet_pool_dos_2_phm'];

    // Get sensor values
    const poolTempSensor = this.hass.states['sensor.violet_pool_temperature'];
    const phSensor = this.hass.states['sensor.violet_pool_ph_value'];
    const orpSensor = this.hass.states['sensor.violet_pool_orp_value'];

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

      // Get current dosing value
      const dosingType = this._detectDosingType(config.entity!);
      if (dosingType === 'chlorine') {
        const orpSensor = this.hass.states['sensor.violet_pool_orp_value'];
        if (orpSensor) {
          currentValue = `${parseFloat(orpSensor.state).toFixed(0)}mV`;
        }
      } else if (dosingType === 'ph_minus' || dosingType === 'ph_plus') {
        const phSensor = this.hass.states['sensor.violet_pool_ph_value'];
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
        display: block;
      }

      ha-card {
        padding: 16px;
        background: var(--card-background-color);
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: var(--ha-card-box-shadow, none);
      }

      .card-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .card-content.compact {
        flex-direction: row;
        align-items: center;
        gap: 8px;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      ha-icon {
        --mdc-icon-size: 24px;
        color: var(--primary-color);
      }

      .name {
        flex: 1;
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .state {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .state.on,
      .state.heat,
      .state.heating {
        background: #4caf50;
        color: white;
      }

      .state.off {
        background: #757575;
        color: white;
      }

      .state.auto {
        background: #2196f3;
        color: white;
      }

      .state.manual {
        background: #ff9800;
        color: white;
      }

      .state.idle {
        background: #9e9e9e;
        color: white;
      }

      .info {
        color: var(--secondary-text-color);
        font-size: 14px;
      }

      .info p {
        margin: 4px 0;
      }

      .detail {
        font-size: 12px;
        color: var(--disabled-text-color);
      }

      .detail-compact {
        font-size: 11px;
        color: var(--secondary-text-color);
        opacity: 0.8;
      }

      .error {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px;
        color: var(--error-color);
        background: var(--error-color-alpha, rgba(244, 67, 54, 0.1));
        border-radius: 8px;
      }

      .error ha-icon {
        color: var(--error-color);
      }

      /* Component spacing */
      status-badge,
      value-display,
      detail-status,
      warning-chips {
        display: block;
      }

      detail-status {
        margin: 8px 0;
      }

      warning-chips {
        margin: 8px 0;
      }

      /* Pump Card Styles */
      .pump-running {
        animation: rotate 2s linear infinite;
        color: var(--primary-color);
      }

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .badge-secondary {
        padding: 2px 8px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 500;
        background: var(--secondary-background-color);
        color: var(--secondary-text-color);
      }

      .rpm-display,
      .runtime-display {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: var(--secondary-background-color);
        border-radius: 8px;
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .rpm-display ha-icon,
      .runtime-display ha-icon {
        --mdc-icon-size: 18px;
        color: var(--primary-color);
      }

      /* Heater Card Styles */
      .heater-active {
        animation: pulse-glow 2s ease-in-out infinite;
        color: #FF5722;
      }

      @keyframes pulse-glow {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.6;
        }
      }

      .outside-temp-display {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: var(--secondary-background-color);
        border-radius: 8px;
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .outside-temp-display.blocked {
        background: rgba(255, 152, 0, 0.1);
        border: 1px solid #ff9800;
      }

      .outside-temp-display ha-icon {
        --mdc-icon-size: 18px;
        color: var(--primary-color);
      }

      .warning-text {
        color: #ff9800;
        font-size: 12px;
        margin-left: 4px;
      }

      /* Solar Card Styles */
      .solar-active {
        color: #ff9800;
      }

      .solar-temps {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;
        background: var(--secondary-background-color);
        border-radius: 8px;
      }

      .temp-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
      }

      .temp-item ha-icon {
        --mdc-icon-size: 18px;
        color: var(--primary-color);
      }

      .temp-label {
        color: var(--secondary-text-color);
        min-width: 70px;
      }

      .temp-value {
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .temp-delta {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        margin-top: 4px;
        border-radius: 8px;
        font-weight: 500;
      }

      .temp-delta.positive {
        background: rgba(76, 175, 80, 0.1);
        border: 1px solid #4caf50;
        color: #4caf50;
      }

      .temp-delta.negative {
        background: rgba(244, 67, 54, 0.1);
        border: 1px solid #f44336;
        color: #f44336;
      }

      .temp-delta ha-icon {
        --mdc-icon-size: 18px;
      }

      .delta-hint {
        font-size: 11px;
        opacity: 0.8;
        margin-left: 4px;
      }

      /* Dosing Card Styles */
      .dosing-active {
        animation: pulse-glow 2s ease-in-out infinite;
        color: #4caf50;
      }

      .dosing-values {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        background: var(--secondary-background-color);
        border-radius: 8px;
      }

      .value-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        font-size: 18px;
      }

      .value-row ha-icon {
        --mdc-icon-size: 20px;
        color: var(--primary-color);
      }

      .current-value {
        font-weight: 700;
        font-size: 20px;
        color: var(--primary-text-color);
      }

      .arrow-icon {
        --mdc-icon-size: 16px;
        color: var(--secondary-text-color);
      }

      .target-value {
        font-weight: 600;
        font-size: 18px;
        color: var(--secondary-text-color);
      }

      .threshold-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .threshold-label {
        font-weight: 500;
      }

      .threshold-value {
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .separator {
        opacity: 0.5;
        margin: 0 4px;
      }

      .dosing-history {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: var(--secondary-background-color);
        border-radius: 8px;
        font-size: 13px;
        color: var(--primary-text-color);
      }

      .dosing-history ha-icon {
        --mdc-icon-size: 16px;
        color: var(--primary-color);
      }

      /* Overview Card Styles */
      .overview-content {
        gap: 16px;
      }

      .water-chemistry {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 12px;
      }

      .chemistry-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: var(--secondary-background-color);
        border-radius: 8px;
      }

      .chemistry-item ha-icon {
        --mdc-icon-size: 24px;
        color: var(--primary-color);
      }

      .chemistry-value {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .chemistry-value .value {
        font-size: 16px;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .status-indicator {
        padding: 2px 8px;
        border-radius: 8px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .status-indicator.ok {
        background: rgba(76, 175, 80, 0.2);
        color: #4caf50;
      }

      .status-indicator.warning {
        background: rgba(255, 152, 0, 0.2);
        color: #ff9800;
      }

      .status-indicator.high {
        background: rgba(244, 67, 54, 0.2);
        color: #f44336;
      }

      .status-indicator.unknown {
        background: var(--secondary-background-color);
        color: var(--secondary-text-color);
      }

      .overview-section {
        margin-top: 8px;
      }

      .section-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin-bottom: 8px;
      }

      .device-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .device-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px;
        background: var(--secondary-background-color);
        border-radius: 8px;
      }

      .device-item ha-icon {
        --mdc-icon-size: 20px;
      }

      .device-item ha-icon.active {
        color: var(--primary-color);
      }

      .device-item ha-icon.inactive {
        color: var(--disabled-text-color);
      }

      .device-name {
        font-weight: 500;
        color: var(--primary-text-color);
        min-width: 80px;
      }

      .device-status {
        color: var(--secondary-text-color);
        font-size: 13px;
      }

      .warnings-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .warning-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: rgba(255, 152, 0, 0.1);
        border: 1px solid #ff9800;
        border-radius: 8px;
        color: #ff9800;
        font-size: 13px;
      }

      .warning-item ha-icon {
        --mdc-icon-size: 18px;
      }

      .all-ok {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 16px;
        background: rgba(76, 175, 80, 0.1);
        border: 1px solid #4caf50;
        border-radius: 8px;
        color: #4caf50;
        font-weight: 500;
      }

      .all-ok ha-icon {
        --mdc-icon-size: 24px;
      }

      /* Compact Card Styles */
      .compact-card {
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .compact-card:hover {
        background: var(--secondary-background-color);
      }

      .card-content.compact {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
      }

      .card-content.compact ha-icon {
        --mdc-icon-size: 24px;
        flex-shrink: 0;
      }

      .card-content.compact ha-icon.active {
        color: var(--primary-color);
      }

      .card-content.compact ha-icon.inactive {
        color: var(--disabled-text-color);
      }

      .compact-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .compact-info .name {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .compact-details {
        display: flex;
        gap: 8px;
        align-items: center;
        font-size: 11px;
      }

      .current-value-compact {
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .detail-compact {
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .water-chemistry {
          grid-template-columns: 1fr;
        }

        .card-content {
          padding: 12px;
        }

        .header {
          flex-wrap: wrap;
        }
      }

      /* Modern Style */
      ha-card.modern {
        border-radius: 16px;
        border: 1px solid var(--divider-color, #e0e0e0);
        box-shadow: none;
      }

      ha-card.modern .header {
        margin-bottom: 8px;
      }

      ha-card.modern .badge-secondary {
        border-radius: 6px;
      }

      /* Luxury Style */
      ha-card.luxury {
        background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7));
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.5);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        border-radius: 20px;
      }

      ha-card.luxury .card-content {
        gap: 16px;
      }

      ha-card.luxury .rpm-display,
      ha-card.luxury .runtime-display,
      ha-card.luxury .outside-temp-display,
      ha-card.luxury .dosing-values,
      ha-card.luxury .dosing-history,
      ha-card.luxury .chemistry-item,
      ha-card.luxury .device-item,
      ha-card.luxury .badge-secondary {
        background: rgba(255, 255, 255, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow: 0 2px 8px rgba(0,0,0,0.02);
      }

      /* Flow Animation */
      @keyframes flow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      ha-card.flow-animation {
        position: relative;
        overflow: hidden;
      }

      ha-card.flow-animation::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        padding: 2px;
        background: linear-gradient(270deg, var(--primary-color), transparent, var(--primary-color));
        background-size: 200% 200%;
        animation: flow 3s ease infinite;
        -webkit-mask:
           linear-gradient(#fff 0 0) content-box,
           linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        opacity: 0.5;
      }

      /* Dark mode adjustments for Luxury */
      @media (prefers-color-scheme: dark) {
        ha-card.luxury {
          background: linear-gradient(135deg, rgba(30,30,30,0.9), rgba(30,30,30,0.7));
          border: 1px solid rgba(255,255,255,0.1);
        }

        ha-card.luxury .rpm-display,
        ha-card.luxury .runtime-display,
        ha-card.luxury .outside-temp-display,
        ha-card.luxury .dosing-values,
        ha-card.luxury .dosing-history,
        ha-card.luxury .chemistry-item,
        ha-card.luxury .device-item,
        ha-card.luxury .badge-secondary {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      }

      /* System Card Grid */
      .system-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 16px;
      }

      /* ========================================
         PREMIUM DESIGN SYSTEM
         ======================================== */

      /* ===== CARD SIZES ===== */
      ha-card.size-small {
        padding: 12px;
        font-size: 13px;
      }

      ha-card.size-small .header ha-icon {
        --mdc-icon-size: 20px;
      }

      ha-card.size-small .name {
        font-size: 14px;
      }

      ha-card.size-medium {
        padding: 16px;
      }

      ha-card.size-large {
        padding: 24px;
        font-size: 16px;
      }

      ha-card.size-large .header {
        margin-bottom: 16px;
      }

      ha-card.size-large .header ha-icon {
        --mdc-icon-size: 32px;
      }

      ha-card.size-large .name {
        font-size: 20px;
      }

      ha-card.size-large .card-content {
        gap: 20px;
      }

      ha-card.size-fullscreen {
        padding: 32px;
        font-size: 18px;
        min-height: calc(100vh - 100px);
      }

      ha-card.size-fullscreen .header {
        margin-bottom: 24px;
      }

      ha-card.size-fullscreen .header ha-icon {
        --mdc-icon-size: 48px;
      }

      ha-card.size-fullscreen .name {
        font-size: 28px;
        font-weight: 600;
      }

      ha-card.size-fullscreen .card-content {
        gap: 28px;
      }

      /* ===== PREMIUM THEMES ===== */

      /* Theme: Luxury (Enhanced Glassmorphism) */
      ha-card.theme-luxury {
        background: linear-gradient(135deg,
          rgba(255, 255, 255, 0.95) 0%,
          rgba(255, 255, 255, 0.85) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 2px solid rgba(255, 255, 255, 0.6);
        box-shadow:
          0 8px 32px 0 rgba(31, 38, 135, 0.2),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.8);
        border-radius: 24px;
        position: relative;
        overflow: hidden;
      }

      ha-card.theme-luxury::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        background: linear-gradient(
          135deg,
          rgba(var(--rgb-primary-color, 33, 150, 243), 0.1) 0%,
          transparent 50%,
          rgba(var(--rgb-primary-color, 33, 150, 243), 0.05) 100%
        );
        pointer-events: none;
      }

      /* Theme: Modern (Clean & Minimal) */
      ha-card.theme-modern {
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 20px;
        box-shadow:
          0 2px 8px rgba(0, 0, 0, 0.08),
          0 1px 3px rgba(0, 0, 0, 0.06);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      ha-card.theme-modern:hover {
        box-shadow:
          0 4px 16px rgba(0, 0, 0, 0.12),
          0 2px 6px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
      }

      /* Theme: Minimalist (Ultra Clean) */
      ha-card.theme-minimalist {
        background: var(--card-background-color);
        border: none;
        border-radius: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }

      ha-card.theme-minimalist .header {
        border-bottom: 1px solid var(--divider-color);
        padding-bottom: 12px;
        margin-bottom: 16px;
      }

      /* Theme: Glass (Pure Glassmorphism) */
      ha-card.theme-glass {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(30px) saturate(180%);
        -webkit-backdrop-filter: blur(30px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 28px;
        box-shadow:
          0 8px 32px 0 rgba(0, 0, 0, 0.1),
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.3);
      }

      ha-card.theme-glass .card-content > * {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      /* Theme: Neon (Vibrant & Energetic) */
      ha-card.theme-neon {
        background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
        border: 2px solid transparent;
        border-radius: 24px;
        box-shadow:
          0 0 30px rgba(var(--rgb-primary-color, 33, 150, 243), 0.4),
          inset 0 1px 1px rgba(255, 255, 255, 0.1);
        position: relative;
      }

      ha-card.theme-neon::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(
          45deg,
          var(--primary-color, #2196f3),
          #00bcd4,
          #4caf50,
          var(--primary-color, #2196f3)
        );
        border-radius: 24px;
        z-index: -1;
        background-size: 300% 300%;
        animation: neonGlow 6s ease infinite;
      }

      @keyframes neonGlow {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      ha-card.theme-neon .name,
      ha-card.theme-neon .value,
      ha-card.theme-neon * {
        color: #ffffff !important;
      }

      /* Theme: Premium (High-End Look) */
      ha-card.theme-premium {
        background: linear-gradient(
          135deg,
          #667eea 0%,
          #764ba2 100%
        );
        border: none;
        border-radius: 24px;
        box-shadow:
          0 20px 60px rgba(102, 126, 234, 0.4),
          inset 0 1px 2px rgba(255, 255, 255, 0.3);
        color: white;
        position: relative;
        overflow: hidden;
      }

      ha-card.theme-premium::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
          circle,
          rgba(255, 255, 255, 0.2) 0%,
          transparent 70%
        );
        animation: premiumShine 8s linear infinite;
      }

      @keyframes premiumShine {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      ha-card.theme-premium .name,
      ha-card.theme-premium .value,
      ha-card.theme-premium *:not(ha-icon) {
        color: #ffffff !important;
      }

      /* ===== ANIMATION STYLES ===== */

      /* Animation: Subtle */
      ha-card.animation-subtle {
        transition: all 0.3s ease;
      }

      ha-card.animation-subtle.is-active {
        box-shadow: 0 0 20px rgba(var(--rgb-primary-color, 33, 150, 243), 0.2);
      }

      /* Animation: Smooth */
      ha-card.animation-smooth {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      ha-card.animation-smooth.is-active {
        transform: scale(1.02);
        box-shadow: 0 8px 24px rgba(var(--rgb-primary-color, 33, 150, 243), 0.3);
      }

      /* Animation: Energetic */
      ha-card.animation-energetic {
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      ha-card.animation-energetic.is-active {
        animation: energeticPulse 2s ease-in-out infinite;
      }

      @keyframes energeticPulse {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 20px rgba(var(--rgb-primary-color, 33, 150, 243), 0.3);
        }
        50% {
          transform: scale(1.05);
          box-shadow: 0 0 40px rgba(var(--rgb-primary-color, 33, 150, 243), 0.5);
        }
      }

      /* Flow Active State (Enhanced) */
      ha-card.flow-active::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        padding: 3px;
        background: linear-gradient(
          90deg,
          transparent,
          var(--primary-color),
          transparent
        );
        background-size: 200% 100%;
        animation: flowSweep 3s linear infinite;
        -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        opacity: 0.6;
      }

      @keyframes flowSweep {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      /* ===== DARK MODE ADJUSTMENTS ===== */
      @media (prefers-color-scheme: dark) {
        ha-card.theme-luxury {
          background: linear-gradient(135deg,
            rgba(30, 30, 30, 0.95) 0%,
            rgba(20, 20, 20, 0.90) 100%);
          border: 2px solid rgba(255, 255, 255, 0.15);
        }

        ha-card.theme-glass {
          background: rgba(30, 30, 30, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        ha-card.theme-minimalist {
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      }

      /* ===== RESPONSIVE FULLSCREEN ===== */
      @media (max-width: 768px) {
        ha-card.size-fullscreen {
          padding: 20px;
          font-size: 16px;
        }

        ha-card.size-fullscreen .header ha-icon {
          --mdc-icon-size: 36px;
        }

        ha-card.size-fullscreen .name {
          font-size: 22px;
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
      entity: 'switch.violet_pool_pump',
      card_type: 'pump',
    };
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
