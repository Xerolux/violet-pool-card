import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { VioletPoolCardConfig } from '../violet-pool-card';

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

interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: VioletPoolCardConfig): void;
}

export class VioletPoolCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: VioletPoolCardConfig;

  public setConfig(config: VioletPoolCardConfig): void {
    this._config = config;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    const needsEntity = !['overview','system','details','chemical','cover','light'].includes(this._config.card_type);
    const coverOrLight = this._config.card_type === 'cover' || this._config.card_type === 'light';
    const domainFilter: Record<string, string[]> = {
      pump: ['switch'], heater: ['climate'], solar: ['climate'],
      dosing: ['switch'], compact: [], sensor: ['sensor'],
      cover: ['cover'], light: ['light'],
    };
    const includeDomains = domainFilter[this._config.card_type] || [];

    return html` <div class="card-config"><!-- Card Type Selection --><div class="config-section"><div class="section-header"><ha-icon icon="mdi:card-outline"></ha-icon><span>Card Type</span></div><ha-select label="Card Type" .value="${this._config.card_type}" @selected="${this._cardTypeChanged}" @closed="${(e: Event) => e.stopPropagation()}" ><mwc-list-item value="pump">🔵 Pump</mwc-list-item><mwc-list-item value="heater">🔥 Heater</mwc-list-item><mwc-list-item value="solar">☀️ Solar</mwc-list-item><mwc-list-item value="dosing">💧 Dosing</mwc-list-item><mwc-list-item value="cover">🪟 Cover</mwc-list-item><mwc-list-item value="light">💡 Light</mwc-list-item><mwc-list-item value="filter">⏰ Filter</mwc-list-item><mwc-list-item value="backwash">🔄 Backwash</mwc-list-item><mwc-list-item value="refill">💧 Refill</mwc-list-item><mwc-list-item value="solar_surplus">☀️ PV Surplus</mwc-list-item><mwc-list-item value="flow_rate">💨 Flow Rate</mwc-list-item><mwc-list-item value="inlet">➡️ Inlet</mwc-list-item><mwc-list-item value="counter_current">🏊 Counter Current</mwc-list-item><mwc-list-item value="chlorine_canister">🧪 Chlorine Canister</mwc-list-item><mwc-list-item value="ph_plus_canister">➕ pH Plus Canister</mwc-list-item><mwc-list-item value="ph_minus_canister">➖ pH Minus Canister</mwc-list-item><mwc-list-item value="flocculant_canister">✨ Flocculant Canister</mwc-list-item><mwc-list-item value="overview">📊 Overview</mwc-list-item><mwc-list-item value="compact">📋 Compact</mwc-list-item><mwc-list-item value="system">🖥️ System Dashboard</mwc-list-item><mwc-list-item value="details">📝 Details</mwc-list-item><mwc-list-item value="chemical">🧪 Chemistry</mwc-list-item><mwc-list-item value="sensor">📡 Sensor</mwc-list-item></ha-select></div><!-- Controller Configuration --><div class="config-section"><div class="section-header"><ha-icon icon="mdi:chip"></ha-icon><span>Controller Configuration</span></div><ha-textfield label="Entity Prefix" .value="${this._config.entity_prefix || 'violet_pool'}" @input="${this._entityPrefixChanged}" helper="Name of your pool controller (e.g., 'violet_pool', 'pool_1', 'garden_pool')" ></ha-textfield><div class="prefix-info"><ha-icon icon="mdi:information-outline"></ha-icon><span> The entity prefix should match your Violet Pool Controller name in Home Assistant. All entities will be automatically discovered based on this prefix. </span></div></div><!-- Entity Selection -->
        ${needsEntity || coverOrLight ? html`
          <div class="config-section">
            <div class="section-header">
              <ha-icon icon="mdi:lightning-bolt"></ha-icon>
              <span>Entity</span>
            </div>
            <ha-entity-picker
              label="${coverOrLight ? (this._config.card_type === 'cover' ? 'Cover Entity' : 'Licht Entity') : 'Entity'}"
              .hass="${this.hass}"
              .value="${this._config.entity}"
              .includeDomains="${includeDomains.length ? includeDomains : undefined}"
              @value-changed="${this._entityChanged}"
              allow-custom-entity
            ></ha-entity-picker>
          </div>
        ` : ''}

        <!-- Premium Design Options -->
        <div class="config-section premium-section">
          <div class="section-header premium-header">
            <ha-icon icon="mdi:palette"></ha-icon>
            <span>✨ Premium Design</span>
          </div>

          <!-- Size Picker -->
          <div class="picker-container">
            <label>Card Size</label>
            <div class="size-picker">
              ${['small', 'medium', 'large', 'fullscreen'].map(
                (size) => html` <button class="size-button ${this._config.size === size ? 'active' : ''}" @click="${() => this._sizeChanged(size)}" ><div class="size-preview size-${size}"></div><span>${this._formatSizeName(size)}</span></button> `
              )}
            </div>
          </div>

          <!-- Theme Picker -->
          <div class="picker-container">
            <label>Theme Style</label>
            <div class="theme-picker">
              ${[
                { value: 'classic', icon: '', label: 'Classic', desc: 'Clean & Timeless', preview: '#fff' },
                { value: 'midnight', icon: '', label: 'Midnight', desc: 'Deep Dark', preview: '#1C1C1E' },
                { value: 'elegance', icon: '', label: 'Elegance', desc: 'Luxury Gold', preview: '#FFD700' },
                { value: 'vibrant', icon: '', label: 'Vibrant', desc: 'Bold Colors', preview: '#FF6B6B' },
                { value: 'pure', icon: '', label: 'Pure', desc: 'Ultra Minimal', preview: '#fff' },
                { value: 'frost', icon: '', label: 'Frost', desc: 'Frosted Glass', preview: 'rgba(255,255,255,0.7)' },
                { value: 'glow', icon: '', label: 'Glow', desc: 'Neon Nights', preview: '#0D0D14' },
                { value: 'metallic', icon: '', label: 'Metallic', desc: 'Chrome Shine', preview: '#C0C0C0' },
                { value: 'ocean', icon: '', label: 'Ocean', desc: 'Sea Blue', preview: '#0077BE' },
                { value: 'sunset', icon: '', label: 'Sunset', desc: 'Warm Orange', preview: '#FF6B35' },
                { value: 'forest', icon: '', label: 'Forest', desc: 'Natural Green', preview: '#228B22' },
                { value: 'aurora', icon: '', label: 'Aurora', desc: 'Northern Lights', preview: 'linear-gradient(45deg, #00C9FF 0%, #92FE9D 100%)' },
              ].map(
                (theme) => html` <button class="theme-button ${this._config.theme === theme.value || (!this._config.theme && theme.value === 'classic') ? 'active' : ''}" @click="${() => this._themeChanged(theme.value)}" ><div class="theme-preview theme-${theme.value}"><div class="theme-dot" style="background:${(theme as any).preview}"></div></div><div class="theme-info"><span class="theme-label">${theme.label}</span><span class="theme-desc">${theme.desc}</span></div></button> `
              )}
            </div>
          </div>

          <!-- Advanced Customization -->
          <div class="config-section">
            <div class="section-header">
              <ha-icon icon="mdi:tune"></ha-icon>
              <span>Advanced Customization</span>
            </div>

            <ha-textfield
              label="Custom Width (px)"
              type="number"
              .value="${this._config.custom_width || ''}"
              placeholder="Auto"
              @input="${this._customWidthChanged}"
            ></ha-textfield>

            <ha-textfield
              label="Custom Height (px)"
              type="number"
              .value="${this._config.custom_height || ''}"
              placeholder="Auto"
              @input="${this._customHeightChanged}"
            ></ha-textfield>

            <ha-textfield
              label="Custom Padding (px)"
              type="number"
              .value="${this._config.custom_padding || ''}"
              placeholder="Auto"
              @input="${this._customPaddingChanged}"
            ></ha-textfield>

            <ha-textfield
              label="Border Radius (px)"
              type="number"
              .value="${this._config.border_radius || ''}"
              placeholder="Auto"
              @input="${this._borderRadiusChanged}"
            ></ha-textfield>

            <ha-select
              label="Shadow Intensity"
              .value="${this._config.shadow_intensity || ''}"
              @selected="${this._shadowIntensityChanged}"
              @closed="${(e: Event) => e.stopPropagation()}"
            >
              <mwc-list-item value="">Default</mwc-list-item>
              <mwc-list-item value="none">None</mwc-list-item>
              <mwc-list-item value="low">Low</mwc-list-item>
              <mwc-list-item value="medium">Medium</mwc-list-item>
              <mwc-list-item value="high">High</mwc-list-item>
            </ha-select>
          </div>

          <!-- Animation Picker -->
          <div class="picker-container">
            <label>Animation Level</label>
            <div class="animation-picker">
              ${[
                { value: 'none', icon: '⏸️', label: 'None', desc: 'Static' },
                { value: 'subtle', icon: '🌙', label: 'Subtle', desc: 'Professional' },
                { value: 'smooth', icon: '✨', label: 'Smooth', desc: 'Balanced' },
                { value: 'energetic', icon: '🚀', label: 'Energetic', desc: 'Dynamic' },
              ].map(
                (anim) => html` <button class="animation-button ${this._config.animation === anim.value ? 'active' : ''}" @click="${() => this._animationChanged(anim.value)}" ><span class="anim-icon">${anim.icon}</span><div class="anim-info"><span class="anim-label">${anim.label}</span><span class="anim-desc">${anim.desc}</span></div></button> `
              )}
            </div>
          </div>
        </div>

        <!-- Basic Options -->
        <div class="config-section">
          <div class="section-header">
            <ha-icon icon="mdi:cog"></ha-icon>
            <span>Basic Options</span>
          </div>

          <ha-textfield
            label="Custom Name (optional)"
            .value="${this._config.name || ''}"
            @input="${this._nameChanged}"
          ></ha-textfield>

          <ha-icon-picker
            label="Custom Icon (optional)"
            .hass="${this.hass}"
            .value="${this._config.icon || ''}"
            @value-changed="${this._iconChanged}"
          ></ha-icon-picker>
        </div>

        <!-- Display Options -->
        <div class="config-section">
          <div class="section-header">
            <ha-icon icon="mdi:eye"></ha-icon>
            <span>Display Options</span>
          </div>

          <ha-formfield label="Show state badge">
            <ha-switch
              .checked="${this._config.show_state !== false}"
              @change="${this._showStateChanged}"
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Show detail status">
            <ha-switch
              .checked="${this._config.show_detail_status !== false}"
              @change="${this._showDetailStatusChanged}"
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Show controls">
            <ha-switch
              .checked="${this._config.show_controls !== false}"
              @change="${this._showControlsChanged}"
            ></ha-switch>
          </ha-formfield>

          ${this._config.card_type === 'pump'
            ? html` <ha-formfield label="Show runtime counter"><ha-switch .checked="${this._config.show_runtime === true}" @change="${this._showRuntimeChanged}" ></ha-switch></ha-formfield> `
            : ''}

          ${this._config.card_type === 'dosing'
            ? html` <ha-formfield label="Show dosing history"><ha-switch .checked="${this._config.show_history === true}" @change="${this._showHistoryChanged}" ></ha-switch></ha-formfield> `
            : ''}
        </div>

        <!-- Dosing Type (for dosing cards) -->
        ${this._config.card_type === 'dosing'
          ? html` <div class="config-section"><div class="section-header"><ha-icon icon="mdi:flask"></ha-icon><span>Dosing Type</span></div><ha-select label="Dosing Type" .value="${this._config.dosing_type || 'chlorine'}" @selected="${this._dosingTypeChanged}" @closed="${(e: Event) => e.stopPropagation()}" ><mwc-list-item value="chlorine">💧 Chlorine (ORP)</mwc-list-item><mwc-list-item value="ph_minus">➖ pH Minus</mwc-list-item><mwc-list-item value="ph_plus">➕ pH Plus</mwc-list-item><mwc-list-item value="flocculant">🌊 Flocculant</mwc-list-item></ha-select></div> `
          : ''}

        <!-- Chemistry Card Configuration -->
        ${this._config.card_type === 'chemical'
          ? html`
            <div class="config-section">
              <div class="section-header">
                <ha-icon icon="mdi:flask"></ha-icon>
                <span>Chemistry Type</span>
              </div>
              <ha-select
                label="Pool Treatment Type"
                .value="${this._config.chemistry_type || 'chlorine'}"
                @selected="${this._chemistryTypeChanged}"
                @closed="${(e: Event) => e.stopPropagation()}"
              >
                <mwc-list-item value="chlorine">🧪 Chlorine Pool</mwc-list-item>
                <mwc-list-item value="salt">🧂 Salt Water Pool</mwc-list-item>
                <mwc-list-item value="bromine">🔄 Bromine Pool</mwc-list-item>
                <mwc-list-item value="ozone">🌊 Ozone Pool</mwc-list-item>
              </ha-select>
            </div>

            <div class="config-section">
              <div class="section-header">
                <ha-icon icon="mdi:eye"></ha-icon>
                <span>Display Options</span>
              </div>

              <ha-formfield label="Show Temperature">
                <ha-switch
                  .checked="${this._config.show_temperature !== false}"
                  @change="${this._showTemperatureChanged}"
                ></ha-switch>
              </ha-formfield>

              <ha-formfield label="Show pH Value">
                <ha-switch
                  .checked="${this._config.show_ph !== false}"
                  @change="${this._showPhChanged}"
                ></ha-switch>
              </ha-formfield>

              ${this._config.chemistry_type === 'chlorine' ? html`
                <ha-formfield label="Show ORP (Redox)">
                  <ha-switch
                    .checked="${this._config.show_orp !== false}"
                    @change="${this._showOrpChanged}"
                  ></ha-switch>
                </ha-formfield>

                <ha-formfield label="Show Chlorine Level">
                  <ha-switch
                    .checked="${this._config.show_chlorine !== false}"
                    @change="${this._showChlorineChanged}"
                  ></ha-switch>
                </ha-formfield>
              ` : ''}

              ${this._config.chemistry_type === 'salt' ? html`
                <ha-formfield label="Show Salt Level">
                  <ha-switch
                    .checked="${this._config.show_salt === true}"
                    @change="${this._showSaltChanged}"
                  ></ha-switch>
                </ha-formfield>
              ` : ''}

              <ha-formfield label="Show Inlet Status">
                <ha-switch
                  .checked="${this._config.show_inlet === true}"
                  @change="${this._showInletChanged}"
                ></ha-switch>
              </ha-formfield>
            </div>
          `
          : ''}


        <!-- Entity Overrides (card-type specific) -->
        ${['pump','heater','solar','dosing','overview','system','chemical'].includes(this._config.card_type) ? html`
          <details class="advanced-section">
            <summary>
              <ha-icon icon="mdi:swap-horizontal"></ha-icon>
              <span>Entityen überschreiben</span>
            </summary>
            <div class="advanced-content">
              ${this._config.card_type === 'pump' || this._config.card_type === 'overview' || this._config.card_type === 'system' ? html`
                <ha-entity-picker label="Pumpe (override)" .hass="${this.hass}" .value="${(this._config as any).pump_entity || ''}" .includeDomains="${['switch']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('pump_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
              ${this._config.card_type === 'heater' || this._config.card_type === 'overview' || this._config.card_type === 'system' ? html`
                <ha-entity-picker label="Heater (override)" .hass="${this.hass}" .value="${(this._config as any).heater_entity || ''}" .includeDomains="${['climate']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('heater_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
              ${this._config.card_type === 'solar' || this._config.card_type === 'overview' || this._config.card_type === 'system' ? html`
                <ha-entity-picker label="Solar (override)" .hass="${this.hass}" .value="${(this._config as any).solar_entity || ''}" .includeDomains="${['climate']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('solar_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
              ${this._config.card_type === 'dosing' || this._config.card_type === 'overview' || this._config.card_type === 'system' ? html`
                <ha-entity-picker label="Chlorine Dosing (override)" .hass="${this.hass}" .value="${(this._config as any).chlorine_entity || ''}" .includeDomains="${['switch']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('chlorine_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
              ${['dosing','overview','system','chemical'].includes(this._config.card_type) ? html`
                <ha-entity-picker label="pH-Sensor (override)" .hass="${this.hass}" .value="${(this._config as any).ph_value_entity || ''}" .includeDomains="${['sensor']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('ph_value_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker label="ORP-Sensor (override)" .hass="${this.hass}" .value="${(this._config as any).orp_value_entity || ''}" .includeDomains="${['sensor']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('orp_value_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
              ${['heater','solar','overview','system','chemical'].includes(this._config.card_type) ? html`
                <ha-entity-picker label="Pool-Temperatur (override)" .hass="${this.hass}" .value="${(this._config as any).pool_temp_entity || ''}" .includeDomains="${['sensor']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('pool_temp_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
            </div>
          </details>
        ` : ''}

        <!-- Advanced Customization -->
        <details class="advanced-section">
          <summary>
            <ha-icon icon="mdi:tune"></ha-icon>
            <span>Advanced Customization</span>
          </summary>

          <div class="advanced-content">
            <ha-textfield
              label="Accent Color (hex)"
              .value="${this._config.accent_color || ''}"
              placeholder="#2196F3"
              @input="${this._accentColorChanged}"
            ></ha-textfield>

            <ha-textfield
              label="Icon Color (hex)"
              .value="${this._config.icon_color || ''}"
              placeholder="#2196F3"
              @input="${this._iconColorChanged}"
            ></ha-textfield>

            <ha-textfield
              type="number"
              label="Blur Intensity (0-30)"
              .value="${this._config.blur_intensity || 10}"
              min="0"
              max="30"
              @input="${this._blurIntensityChanged}"
            ></ha-textfield>
          </div>
        </details>
      </div>
    `;
  }

  private _formatSizeName(size: string): string {
    const names: { [key: string]: string } = {
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      fullscreen: 'Fullscreen',
    };
    return names[size] || size;
  }

  private _cardTypeChanged(ev: Event): void {
    const target = ev.target as any;
    if (this._config.card_type === target.value) return;

    this._config = {
      ...this._config,
      card_type: target.value,
    };
    this._fireConfigChanged();
  }

  private _entityPrefixChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const value = target.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (this._config.entity_prefix === value) return;

    this._config = {
      ...this._config,
      entity_prefix: value || 'violet_pool',
    };
    this._fireConfigChanged();
  }

  private _entityChanged(ev: CustomEvent): void {
    const target = ev.detail;
    if (this._config.entity === target.value) return;

    this._config = {
      ...this._config,
      entity: target.value,
    };
    this._fireConfigChanged();
  }

  private _sizeChanged(size: string): void {
    this._config = {
      ...this._config,
      size: size as any,
    };
    this._fireConfigChanged();
  }

  private _themeChanged(theme: string): void {
    this._config = {
      ...this._config,
      theme: theme as any,
    };
    this._fireConfigChanged();
  }

  private _animationChanged(animation: string): void {
    this._config = {
      ...this._config,
      animation: animation as any,
    };
    this._fireConfigChanged();
  }

  private _nameChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    this._config = {
      ...this._config,
      name: target.value || undefined,
    };
    this._fireConfigChanged();
  }

  private _iconChanged(ev: CustomEvent): void {
    this._config = {
      ...this._config,
      icon: ev.detail.value || undefined,
    };
    this._fireConfigChanged();
  }

  private _showStateChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      show_state: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showDetailStatusChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      show_detail_status: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showControlsChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      show_controls: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showRuntimeChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      show_runtime: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showHistoryChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      show_history: target.checked,
    };
    this._fireConfigChanged();
  }

  private _dosingTypeChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      dosing_type: target.value,
    };
    this._fireConfigChanged();
  }

  private _chemistryTypeChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      chemistry_type: target.value,
    };
    this._fireConfigChanged();
  }

  private _showTemperatureChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      show_temperature: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showPhChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      show_ph: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showOrpChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      show_orp: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showChlorineChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      show_chlorine: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showSaltChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      show_salt: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showInletChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      show_inlet: target.checked,
    };
    this._fireConfigChanged();
  }

  private _accentColorChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    this._config = {
      ...this._config,
      accent_color: target.value || undefined,
    };
    this._fireConfigChanged();
  }

  private _iconColorChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    this._config = {
      ...this._config,
      icon_color: target.value || undefined,
    };
    this._fireConfigChanged();
  }

  private _blurIntensityChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    this._config = {
      ...this._config,
      blur_intensity: parseInt(target.value) || 10,
    };
    this._fireConfigChanged();
  }

  private _customWidthChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const value = target.value ? parseInt(target.value) : undefined;
    this._config = {
      ...this._config,
      custom_width: value,
    };
    this._fireConfigChanged();
  }

  private _customHeightChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const value = target.value ? parseInt(target.value) : undefined;
    this._config = {
      ...this._config,
      custom_height: value,
    };
    this._fireConfigChanged();
  }

  private _customPaddingChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const value = target.value ? parseInt(target.value) : undefined;
    this._config = {
      ...this._config,
      custom_padding: value,
    };
    this._fireConfigChanged();
  }

  private _borderRadiusChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const value = target.value ? parseInt(target.value) : undefined;
    this._config = {
      ...this._config,
      border_radius: value,
    };
    this._fireConfigChanged();
  }

  private _shadowIntensityChanged(ev: Event): void {
    const target = ev.target as any;
    this._config = {
      ...this._config,
      shadow_intensity: target.value || undefined,
    };
    this._fireConfigChanged();
  }

  private _overrideChanged(key: string, value: string): void {
    this._config = {
      ...this._config,
      [key]: value || undefined,
    };
    this._fireConfigChanged();
  }

  private _fireConfigChanged(): void {
    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  static get styles(): CSSResultGroup {
    return css`:host{font-family:-apple-system, system-ui, 'Segoe UI', sans-serif;}.card-config{display:flex;flex-direction:column;gap:14px;padding:16px;}.config-section{background:var(--card-background-color, #fff);border:1px solid var(--divider-color, rgba(0,0,0,0.08));border-radius:14px;padding:16px;}.section-header{display:flex;align-items:center;gap:8px;margin-bottom:14px;font-weight:600;font-size:14px;letter-spacing:-0.2px;color:var(--primary-text-color);}.section-header ha-icon{--mdc-icon-size:18px;color:var(--primary-color);}.prefix-info{display:flex;align-items:flex-start;gap:8px;padding:10px 12px;margin-top:10px;background:rgba(0,122,255,0.07);border-radius:10px;font-size:12px;color:var(--secondary-text-color);line-height:1.4;}.prefix-info ha-icon{--mdc-icon-size:16px;color:#007AFF;flex-shrink:0;margin-top:2px;}.premium-section{background:var(--card-background-color, #fff);border:2px solid rgba(0,122,255,0.15);}.premium-header{color:#007AFF;}.picker-container{margin-bottom:20px;}.picker-container:last-child{margin-bottom:0;}.picker-container > label{display:block;font-weight:500;font-size:13px;margin-bottom:10px;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:0.5px;}.size-picker{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}.theme-picker{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}.animation-picker{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;}.size-button, .theme-button, .animation-button{display:flex;align-items:center;gap:10px;padding:10px;background:var(--secondary-background-color, rgba(120,120,128,0.06));border:1.5px solid transparent;border-radius:10px;cursor:pointer;transition:all 0.16s ease;font-family:inherit;}.size-button{flex-direction:column;gap:6px;align-items:center;}.theme-button{flex-direction:column;gap:6px;align-items:center;padding:10px 8px;}.size-button:hover, .theme-button:hover, .animation-button:hover{border-color:rgba(0,122,255,0.3);background:rgba(0,122,255,0.05);}.size-button.active, .animation-button.active{border-color:#007AFF;background:rgba(0,122,255,0.1);color:#007AFF;}.theme-button.active{border-color:#007AFF;background:rgba(0,122,255,0.08);box-shadow:0 0 0 3px rgba(0,122,255,0.15);}.size-preview{width:36px;height:26px;border-radius:6px;border:2px solid currentColor;opacity:0.3;}.size-preview.size-small{width:22px;height:18px;}.size-preview.size-medium{width:30px;height:22px;}.size-preview.size-large{width:40px;height:28px;}.size-preview.size-fullscreen{width:46px;height:34px;}.size-button.active .size-preview{opacity:1;}.size-button span{font-size:11px;font-weight:500;}.theme-preview{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid rgba(0,0,0,0.08);}.theme-preview.theme-classic{background:#F2F2F7;}.theme-preview.theme-midnight{background:#0D1117;}.theme-preview.theme-elegance{background:linear-gradient(135deg,#FFD700 0%,#F0E6FA 50%,#DDA0DD 100%);}.theme-preview.theme-vibrant{background:linear-gradient(135deg,#FF6B6B 0%,#4ECDC4 100%);}.theme-preview.theme-pure{background:#fff;border:2px solid #e5e5e5;}.theme-preview.theme-frost{background:rgba(200,220,255,0.4);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.3);}.theme-preview.theme-glow{background:#0D0D14;border:2px solid #00D4FF;box-shadow:0 0 8px rgba(0,212,255,0.5);}.theme-preview.theme-metallic{background:linear-gradient(135deg,#C0C0C0 0%,#E8E8E8 50%,#A8A8A8 100%);border:2px solid #999;}.theme-preview.theme-ocean{background:#0077BE;}.theme-preview.theme-sunset{background:#FF6B35;}.theme-preview.theme-forest{background:#228B22;}.theme-preview.theme-aurora{background:linear-gradient(45deg, #00C9FF 0%, #92FE9D 100%);}.theme-dot{width:20px;height:20px;border-radius:50%;border:2px solid rgba(0,0,0,0.1);}.theme-info, .anim-info{display:flex;flex-direction:column;gap:1px;}.theme-label, .anim-label{font-weight:600;color:var(--primary-text-color);font-size:12px;}.theme-desc, .anim-desc{color:var(--secondary-text-color);font-size:10px;}.anim-icon{font-size:18px;}.advanced-section{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:14px;padding:14px;}.advanced-section summary{display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;font-size:14px;color:var(--primary-text-color);list-style:none;}.advanced-section summary::-webkit-details-marker{display:none;}.advanced-section summary ha-icon{--mdc-icon-size:18px;color:var(--primary-color);}.advanced-content{display:flex;flex-direction:column;gap:12px;margin-top:14px;}ha-select, ha-textfield, ha-entity-picker, ha-icon-picker{width:100%;}ha-formfield{display:flex;align-items:center;margin-bottom:10px;}`;
  }
}

if (!customElements.get('violet-pool-card-editor')) {
  customElements.define('violet-pool-card-editor', VioletPoolCardEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    'violet-pool-card-editor': VioletPoolCardEditor;
  }
}
