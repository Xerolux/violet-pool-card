import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { VioletPoolCardConfig } from '../violet-pool-card';

// HomeAssistant types
interface HomeAssistant {
  states: { [entity_id: string]: any };
  callService: (domain: string, service: string, serviceData?: any) => Promise<any>;
}

interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: VioletPoolCardConfig): void;
}

@customElement('violet-pool-card-editor')
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

    return html`
      <div class="card-config">
        <!-- Card Type Selection -->
        <div class="config-section">
          <div class="section-header">
            <ha-icon icon="mdi:card-outline"></ha-icon>
            <span>Card Type</span>
          </div>

          <ha-select
            label="Card Type"
            .value="${this._config.card_type}"
            @selected="${this._cardTypeChanged}"
            @closed="${(e: Event) => e.stopPropagation()}"
          >
            <mwc-list-item value="pump">🔵 Pump</mwc-list-item>
            <mwc-list-item value="heater">🔥 Heater</mwc-list-item>
            <mwc-list-item value="solar">☀️ Solar</mwc-list-item>
            <mwc-list-item value="dosing">💧 Dosing</mwc-list-item>
            <mwc-list-item value="overview">📊 Overview</mwc-list-item>
            <mwc-list-item value="compact">📋 Compact</mwc-list-item>
            <mwc-list-item value="system">🖥️ System Dashboard</mwc-list-item>
          </ha-select>
        </div>

        <!-- Controller Configuration -->
        <div class="config-section">
          <div class="section-header">
            <ha-icon icon="mdi:chip"></ha-icon>
            <span>Controller Configuration</span>
          </div>

          <ha-textfield
            label="Entity Prefix"
            .value="${this._config.entity_prefix || 'violet_pool'}"
            @input="${this._entityPrefixChanged}"
            helper="Name of your pool controller (e.g., 'violet_pool', 'pool_1', 'garden_pool')"
          ></ha-textfield>

          <div class="prefix-info">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span>
              The entity prefix should match your Violet Pool Controller name in Home Assistant.
              All entities will be automatically discovered based on this prefix.
            </span>
          </div>
        </div>

        <!-- Entity Selection (not for overview/system) -->
        ${this._config.card_type !== 'overview' && this._config.card_type !== 'system'
          ? html`
              <div class="config-section">
                <div class="section-header">
                  <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                  <span>Entity</span>
                </div>

                <ha-entity-picker
                  label="Entity"
                  .hass="${this.hass}"
                  .value="${this._config.entity}"
                  @value-changed="${this._entityChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              </div>
            `
          : ''}

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
                (size) => html`
                  <button
                    class="size-button ${this._config.size === size ? 'active' : ''}"
                    @click="${() => this._sizeChanged(size)}"
                  >
                    <div class="size-preview size-${size}"></div>
                    <span>${this._formatSizeName(size)}</span>
                  </button>
                `
              )}
            </div>
          </div>

          <!-- Theme Picker -->
          <div class="picker-container">
            <label>Theme Style</label>
            <div class="theme-picker">
              ${[
                { value: 'luxury', icon: '🌟', label: 'Luxury', desc: 'Glassmorphism' },
                { value: 'modern', icon: '🎯', label: 'Modern', desc: 'Clean & Minimal' },
                { value: 'minimalist', icon: '⚪', label: 'Minimalist', desc: 'Ultra Clean' },
                { value: 'glass', icon: '💎', label: 'Glass', desc: 'Pure Glass' },
                { value: 'neon', icon: '⚡', label: 'Neon', desc: 'RGB Glow' },
                { value: 'premium', icon: '👑', label: 'Premium', desc: 'Gradient Shine' },
              ].map(
                (theme) => html`
                  <button
                    class="theme-button ${this._config.theme === theme.value ? 'active' : ''}"
                    @click="${() => this._themeChanged(theme.value)}"
                  >
                    <div class="theme-preview theme-${theme.value}">
                      <span class="theme-icon">${theme.icon}</span>
                    </div>
                    <div class="theme-info">
                      <span class="theme-label">${theme.label}</span>
                      <span class="theme-desc">${theme.desc}</span>
                    </div>
                  </button>
                `
              )}
            </div>
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
                (anim) => html`
                  <button
                    class="animation-button ${this._config.animation === anim.value ? 'active' : ''}"
                    @click="${() => this._animationChanged(anim.value)}"
                  >
                    <span class="anim-icon">${anim.icon}</span>
                    <div class="anim-info">
                      <span class="anim-label">${anim.label}</span>
                      <span class="anim-desc">${anim.desc}</span>
                    </div>
                  </button>
                `
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
            ? html`
                <ha-formfield label="Show runtime counter">
                  <ha-switch
                    .checked="${this._config.show_runtime === true}"
                    @change="${this._showRuntimeChanged}"
                  ></ha-switch>
                </ha-formfield>
              `
            : ''}

          ${this._config.card_type === 'dosing'
            ? html`
                <ha-formfield label="Show dosing history">
                  <ha-switch
                    .checked="${this._config.show_history === true}"
                    @change="${this._showHistoryChanged}"
                  ></ha-switch>
                </ha-formfield>
              `
            : ''}
        </div>

        <!-- Dosing Type (for dosing cards) -->
        ${this._config.card_type === 'dosing'
          ? html`
              <div class="config-section">
                <div class="section-header">
                  <ha-icon icon="mdi:flask"></ha-icon>
                  <span>Dosing Type</span>
                </div>

                <ha-select
                  label="Dosing Type"
                  .value="${this._config.dosing_type || 'chlorine'}"
                  @selected="${this._dosingTypeChanged}"
                  @closed="${(e: Event) => e.stopPropagation()}"
                >
                  <mwc-list-item value="chlorine">💧 Chlorine (ORP)</mwc-list-item>
                  <mwc-list-item value="ph_minus">➖ pH Minus</mwc-list-item>
                  <mwc-list-item value="ph_plus">➕ pH Plus</mwc-list-item>
                  <mwc-list-item value="flocculant">🌊 Flocculant</mwc-list-item>
                </ha-select>
              </div>
            `
          : ''}

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

  private _fireConfigChanged(): void {
    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  static get styles(): CSSResultGroup {
    return css`
      .card-config{display:flex;flex-direction:column;gap:16px;padding:16px}
      .config-section{background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#e0e0e0);border-radius:12px;padding:16px}
      .section-header{display:flex;align-items:center;gap:8px;margin-bottom:16px;font-weight:600;font-size:14px;color:var(--primary-text-color)}
      .section-header ha-icon{--mdc-icon-size:20px;color:var(--primary-color)}
      .prefix-info{display:flex;align-items:flex-start;gap:8px;padding:12px;margin-top:12px;background:rgba(var(--rgb-primary-color,33,150,243),0.1);border-radius:8px;font-size:12px;color:var(--secondary-text-color);line-height:1.4}
      .prefix-info ha-icon{--mdc-icon-size:18px;color:var(--primary-color);flex-shrink:0;margin-top:2px}
      .premium-section{background:linear-gradient(135deg,rgba(102,126,234,0.05) 0%,rgba(118,75,162,0.05) 100%);border:2px solid rgba(102,126,234,0.2)}
      .premium-header{color:#667eea}
      .picker-container{margin-bottom:24px}
      .picker-container>label{display:block;font-weight:500;margin-bottom:12px;color:var(--primary-text-color)}
      .size-picker,.animation-picker{display:grid;gap:8px}
      .size-picker{grid-template-columns:repeat(4,1fr)}
      .theme-picker,.animation-picker{grid-template-columns:repeat(2,1fr)}
      .theme-picker{gap:12px}
      .size-button,.theme-button,.animation-button{display:flex;align-items:center;gap:12px;padding:12px;background:var(--secondary-background-color);border:2px solid var(--divider-color);border-radius:8px;cursor:pointer;transition:all 0.2s}
      .size-button{flex-direction:column;gap:8px}
      .theme-button{border-radius:12px;text-align:left}
      .size-button:hover,.theme-button:hover,.animation-button:hover{border-color:var(--primary-color)}
      .theme-button:hover{transform:translateY(-2px);box-shadow:0 4px 8px rgba(0,0,0,0.1)}
      .size-button.active,.theme-button.active,.animation-button.active{border-color:var(--primary-color);background:rgba(var(--rgb-primary-color,33,150,243),0.1)}
      .size-button.active{background:var(--primary-color);color:white}
      .theme-button.active{box-shadow:0 0 0 3px rgba(var(--rgb-primary-color,33,150,243),0.2)}
      .size-preview{width:40px;height:30px;background:currentColor;border-radius:4px;opacity:0.3}
      .size-preview.size-small{width:25px;height:20px}
      .size-preview.size-medium{width:35px;height:25px}
      .size-preview.size-large{width:45px;height:32px}
      .size-preview.size-fullscreen{width:50px;height:38px}
      .size-button.active .size-preview{opacity:1}
      .size-button span{font-size:11px;font-weight:500}
      .theme-preview{width:48px;height:48px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px}
      .theme-preview.theme-luxury{background:linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.85));border:1px solid rgba(255,255,255,0.6)}
      .theme-preview.theme-modern{background:var(--card-background-color);border:1px solid var(--divider-color)}
      .theme-preview.theme-minimalist{background:var(--card-background-color);box-shadow:0 1px 3px rgba(0,0,0,0.1)}
      .theme-preview.theme-glass{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2)}
      .theme-preview.theme-neon{background:linear-gradient(135deg,#0f0c29,#302b63);border:2px solid #2196f3;box-shadow:0 0 20px rgba(33,150,243,0.4)}
      .theme-preview.theme-premium{background:linear-gradient(135deg,#667eea,#764ba2)}
      .theme-info,.anim-info{display:flex;flex-direction:column;gap:2px}
      .theme-label,.anim-label{font-weight:600;color:var(--primary-text-color)}
      .theme-label{font-size:13px}
      .anim-label{font-size:12px}
      .theme-desc,.anim-desc{color:var(--secondary-text-color)}
      .theme-desc{font-size:11px}
      .anim-desc{font-size:10px}
      .anim-icon{font-size:20px}
      .advanced-section{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;padding:12px}
      .advanced-section summary{display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;font-size:14px;color:var(--primary-text-color);list-style:none}
      .advanced-section summary::-webkit-details-marker{display:none}
      .advanced-section summary ha-icon{--mdc-icon-size:20px;color:var(--primary-color)}
      .advanced-content{display:flex;flex-direction:column;gap:12px;margin-top:16px}
      ha-select,ha-textfield,ha-entity-picker,ha-icon-picker{width:100%}
      ha-formfield{display:flex;align-items:center;margin-bottom:12px}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'violet-pool-card-editor': VioletPoolCardEditor;
  }
}
