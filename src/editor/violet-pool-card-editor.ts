/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Visual Editor – Lovelace Card Konfigurationseditor
 * Lets the card be configured visually, without YAML.
 * Created by Xerolux | MIT License
 */

import { i18n, type TranslationKey } from '../utils/i18n';
import { CARD_TYPES_REQUIRING_ENTITY, CARD_TYPE_MAIN_ENTITY } from '../utils/entity-registry';
import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { VioletPoolCardConfig, CardSize, Theme, Animation } from '../violet-pool-card';
import { DEFAULT_THRESHOLDS, type MetricKey } from '../utils/thresholds';
import {
  ACCESSIBILITY_OPTIONS,
  ALARM_STYLE_OPTIONS,
  alertLevelOptions,
  CARD_TYPE_OPTIONS,
  CHEMISTRY_TYPE_OPTIONS,
  DASHBOARD_MODE_OPTIONS,
  DOSING_TYPE_OPTIONS,
  LAYOUT_VARIANT_OPTIONS,
  poolFlowModeOptions,
  SHADOW_INTENSITY_OPTIONS,
  selectedValue,
  type SelectOption,
} from './select-options';

/** Card types that read water values and therefore expose the threshold editor. */
const THRESHOLD_CARD_TYPES = ['chemical', 'overview', 'system', 'heater', 'dosing'];

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

/** Minimal interface for HA custom elements (ha-select, ha-checkbox, etc.) */
interface HaElement extends EventTarget {
  value?: string;
  checked?: boolean;
}

export class VioletPoolCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: VioletPoolCardConfig;

  /**
   * The one-click presets.
   *
   * A getter, not a field: a field is evaluated when the editor element is
   * constructed, which can be before `hass` has told the card which language
   * to use.
   */
  private get _presets() {
    return [
      { id: 'modern_glass', label: 'Modern Glass', description: i18n.t('preset_modern_glass_desc'), config: { theme: 'frost', layout_variant: 'glass', alarm_style: 'pulse', animation: 'smooth', shadow_intensity: 'medium' } },
      { id: 'alarm_focus', label: 'Alarm Focus', description: i18n.t('preset_alarm_focus_desc'), config: { theme: 'midnight', layout_variant: 'focus', alarm_style: 'outline', animation: 'subtle', shadow_intensity: 'high' } },
      { id: 'tech_room', label: i18n.t('preset_tech_room'), description: i18n.t('preset_tech_room_desc'), config: { theme: 'metallic', layout_variant: 'dashboard', alarm_style: 'soft', animation: 'subtle', shadow_intensity: 'low' } },
      { id: 'family_view', label: i18n.t('preset_family_view'), description: i18n.t('preset_family_view_desc'), config: { theme: 'ocean', layout_variant: 'glass', alarm_style: 'soft', animation: 'smooth', shadow_intensity: 'medium' } },
      { id: 'dark_lagoon', label: 'Dark Lagoon', description: i18n.t('preset_dark_lagoon_desc'), config: { theme: 'lagoon', layout_variant: 'glass', alarm_style: 'pulse', animation: 'smooth', shadow_intensity: 'high' } },
    ] as const;
  }

  public setConfig(config: VioletPoolCardConfig): void {
    this._config = config;
  }

  /**
   * Render a dropdown that works on every Home Assistant version.
   *
   * The current `<ha-select>` builds its menu from an `options` property and
   * only renders slotted children when that property is absent - so the
   * `<mwc-list-item>` elements the editor used to slot in were displayed but
   * could not be picked (reported on the forum: the card type list opened,
   * nothing could be selected). Passing `options` drives the current element,
   * the slotted items keep the older one working, and `selectedValue()`
   * accepts both event shapes.
   */
  private _renderSelect(
    label: string,
    value: string,
    options: SelectOption[],
    handler: (ev: Event) => void
  ): TemplateResult {
    return html`
      <ha-select
        label="${label}"
        .value="${value}"
        .options="${options}"
        @selected="${handler}"
        @closed="${(e: Event) => e.stopPropagation()}"
      >
        ${options.map(
          (option) => html`<mwc-list-item value="${option.value}">${option.label}</mwc-list-item>`
        )}
      </ha-select>
    `;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    // The editor used to keep its own list of card types that "need" an entity
    // and its own domain filter. Both drifted from the card: it asked for an
    // entity on every type but seven, which is why the automatic resolution
    // looked as if it only worked on the overview card. Both now come from the
    // same table the card reads.
    const defaultEntity = CARD_TYPE_MAIN_ENTITY[this._config.card_type];
    const entityRequired = CARD_TYPES_REQUIRING_ENTITY.has(this._config.card_type);
    const coverOrLight = this._config.card_type === 'cover' || this._config.card_type === 'light';
    // Anything with a default is optional: leaving it empty is the normal case.
    const showEntityPicker = entityRequired || coverOrLight || Boolean(defaultEntity);
    const extraDomains: Record<string, string[]> = { cover: ['cover'], light: ['light'] };
    const includeDomains =
      extraDomains[this._config.card_type] ?? (defaultEntity ? [defaultEntity.domain] : []);

    return html` <div class="card-config"><!-- Card Type Selection --><div class="config-section"><div class="section-header"><ha-icon icon="mdi:card-outline"></ha-icon><span>Card Type</span></div>${this._renderSelect('Card Type', this._config.card_type, CARD_TYPE_OPTIONS, this._cardTypeChanged)}</div><!-- Controller Configuration --><div class="config-section"><div class="section-header"><ha-icon icon="mdi:chip"></ha-icon><span>Controller Configuration</span></div><ha-textfield label="Entity Prefix" .value="${this._config.entity_prefix || 'violet_pool_controller'}" @input="${this._entityPrefixChanged}" helper="Name of your pool controller (e.g., 'violet_pool_controller', 'pool_1', 'garden_pool')" ></ha-textfield><div class="prefix-info"><ha-icon icon="mdi:information-outline"></ha-icon><span> The entity prefix should match your Violet Pool Controller name in Home Assistant. All entities will be automatically discovered based on this prefix. </span></div></div><!-- Entity Selection -->
        ${showEntityPicker ? html`
          <div class="config-section">
            <div class="section-header">
              <ha-icon icon="mdi:lightning-bolt"></ha-icon>
              <span>${i18n.t('editor_entity')}</span>
            </div>
            <ha-entity-picker
              label="${entityRequired ? i18n.t('editor_entity') : i18n.t('editor_entity_optional')}"
              .hass="${this.hass}"
              .value="${this._config.entity}"
              .includeDomains="${includeDomains.length ? includeDomains : undefined}"
              @value-changed="${this._entityChanged}"
              allow-custom-entity
            ></ha-entity-picker>
            ${entityRequired ? '' : html`
              <div class="prefix-info">
                <ha-icon icon="mdi:information-outline"></ha-icon>
                <span>${i18n.t('editor_entity_auto')}</span>
              </div>
            `}
          </div>
        ` : ''}
        <!-- Dosing Card Configuration -->
        ${this._config.card_type === 'dosing'
          ? html`
            <div class="config-section">
              <div class="section-header">
                <ha-icon icon="mdi:flask"></ha-icon>
                <span>Dosing Configuration</span>
              </div>
              ${this._renderSelect('Dosing Type', this._config.dosing_type || 'chlorine', DOSING_TYPE_OPTIONS, this._dosingTypeChanged)}
              ${this._config.dosing_type === 'free_chlorine' || this._config.dosing_type === 'electrolysis' ? html`
                <ha-entity-picker
                  label="${i18n.t('editor_chlorine_sensor_optional')}"
                  .hass="${this.hass}"
                  .value="${this._config.chlorine_value_entity || ''}"
                  .includeDomains="${['sensor']}"
                  @value-changed="${(e: CustomEvent) => this._overrideChanged('chlorine_value_entity', e.detail.value)}"
                  allow-custom-entity
                ></ha-entity-picker>
                <ha-entity-picker
                  label="${i18n.t('editor_chlorine_setpoint_optional')}"
                  .hass="${this.hass}"
                  .value="${this._config.target_chlorine_entity || ''}"
                  .includeDomains="${['number', 'input_number']}"
                  @value-changed="${(e: CustomEvent) => this._overrideChanged('target_chlorine_entity', e.detail.value)}"
                  allow-custom-entity
                ></ha-entity-picker>
              ` : ''}
              ${this._config.dosing_type === 'chlorine' || this._config.dosing_type === 'electrolysis' || !this._config.dosing_type ? html`
                <ha-entity-picker
                  label="ORP / Redox Sensor (optional mV)"
                  .hass="${this.hass}"
                  .value="${this._config.orp_value_entity || ''}"
                  .includeDomains="${['sensor']}"
                  @value-changed="${(e: CustomEvent) => this._overrideChanged('orp_value_entity', e.detail.value)}"
                  allow-custom-entity
                ></ha-entity-picker>
                <ha-entity-picker
                  label="${i18n.t('editor_orp_setpoint_optional')}"
                  .hass="${this.hass}"
                  .value="${this._config.target_orp_entity || ''}"
                  .includeDomains="${['number', 'input_number']}"
                  @value-changed="${(e: CustomEvent) => this._overrideChanged('target_orp_entity', e.detail.value)}"
                  allow-custom-entity
                ></ha-entity-picker>
              ` : ''}
              ${this._config.dosing_type === 'ph_minus' || this._config.dosing_type === 'ph_plus' ? html`
                <ha-entity-picker
                  label="pH-Sensor (optional)"
                  .hass="${this.hass}"
                  .value="${this._config.ph_value_entity || ''}"
                  .includeDomains="${['sensor']}"
                  @value-changed="${(e: CustomEvent) => this._overrideChanged('ph_value_entity', e.detail.value)}"
                  allow-custom-entity
                ></ha-entity-picker>
              ` : ''}
              <ha-formfield label="Show dosing history">
                <ha-switch
                  .checked="${this._config.show_history === true}"
                  @change="${this._showHistoryChanged}"
                ></ha-switch>
              </ha-formfield>
            </div>
          `
          : ''}

        ${this._config.card_type === 'comparison' ? html`
          <div class="config-section">
            <div class="section-header">
              <ha-icon icon="mdi:target"></ha-icon>
              <span>Comparison Target</span>
            </div>
            <ha-entity-picker
              label="Target entity"
              .hass="${this.hass}"
              .value="${this._config.target_entity || ''}"
              .includeDomains="${['number', 'input_number', 'sensor']}"
              @value-changed="${(e: CustomEvent) => this._overrideChanged('target_entity', e.detail.value)}"
              allow-custom-entity
            ></ha-entity-picker>
          </div>
        ` : ''}

        ${this._config.card_type === 'pool_flow' ? html`
          <div class="config-section">
            <div class="section-header">
              <ha-icon icon="mdi:pipe"></ha-icon>
              <span>${i18n.t('pool_flow_editor_title')}</span>
            </div>
            ${this._renderSelect(
              i18n.t('pool_flow_mode_label'),
              this._config.flow_mode || 'complete',
              poolFlowModeOptions(),
              this._poolFlowModeChanged
            )}
            ${this._config.flow_mode === 'complete' || !this._config.flow_mode ? html`
              ${this._renderFlowToggle('flow_show_heater', 'pool_flow_show_heater')}
              ${this._renderFlowToggle('flow_show_solar', 'pool_flow_show_solar')}
            ` : ''}
            ${this._config.flow_mode !== 'circulation'
              ? this._renderFlowToggle('flow_show_dosing', 'pool_flow_show_dosing')
              : ''}
            ${this._renderFlowToggle('flow_show_facts', 'pool_flow_show_facts')}
            ${this._config.flow_show_facts !== false ? html`
              ${this._renderFlowToggle('flow_show_chemistry', 'pool_flow_show_chemistry')}
              ${this._renderFlowToggle('flow_show_backwash', 'pool_flow_show_backwash')}
              ${this._renderFlowToggle('flow_show_refill', 'pool_flow_show_refill')}
            ` : ''}
          </div>
        ` : ''}

        <!-- Chemistry Card Configuration -->
        ${this._config.card_type === 'chemical'
          ? html`
            <div class="config-section">
              <div class="section-header">
                <ha-icon icon="mdi:flask"></ha-icon>
                <span>Chemistry Type</span>
              </div>
              ${this._renderSelect('Pool Treatment Type', this._config.chemistry_type || 'chlorine', CHEMISTRY_TYPE_OPTIONS, this._chemistryTypeChanged)}
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

              <ha-formfield label="${i18n.t('editor_show_saturation_index')}">
                <ha-switch
                  .checked="${this._config.show_saturation_index === true}"
                  @change="${this._showSaturationIndexChanged}"
                ></ha-switch>
              </ha-formfield>

              ${this._config.show_saturation_index
                ? html`
                    <div class="hint">${i18n.t('editor_saturation_hint')}</div>
                    ${this._renderWaterBalanceInput(
                      'calcium_hardness',
                      i18n.t('editor_calcium_hardness')
                    )}
                    ${this._renderWaterBalanceInput(
                      'total_alkalinity',
                      i18n.t('editor_total_alkalinity')
                    )}
                    ${this._renderWaterBalanceInput(
                      'cyanuric_acid',
                      i18n.t('editor_cyanuric_acid')
                    )}
                    ${this._renderWaterBalanceInput(
                      'total_dissolved_solids',
                      i18n.t('editor_tds')
                    )}
                  `
                : ''}
            </div>
          `
          : ''}

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
        </div>

        <!-- Water value thresholds -->
        ${THRESHOLD_CARD_TYPES.includes(this._config.card_type) ? html`
          <div class="config-section">
            <div class="section-header">
              <ha-icon icon="mdi:tune-variant"></ha-icon>
              <span>${i18n.t('editor_thresholds')}</span>
            </div>
            <div class="prefix-info">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              <span>
                ${i18n.t('thresholds_intro')}
              </span>
            </div>

            ${this._renderSelect(i18n.t('editor_show_alerts'), this._config.alerts || 'all', alertLevelOptions(), this._alertLevelChanged)}

            ${this._renderThresholdRow('ph', i18n.t('metric_ph'), 0.1)}
            ${this._renderThresholdRow('orp', 'Redox (mV)', 10)}
            ${this._renderThresholdRow('chlorine', i18n.t('metric_chlorine'), 0.1)}
            ${this._renderThresholdRow('salt', i18n.t('metric_salt'), 100)}
            ${this._renderThresholdRow('temperature', i18n.t('metric_water_temp'), 0.5)}

            <mwc-button class="threshold-reset" @click="${this._resetThresholds}">
              ${i18n.t('thresholds_reset')}
            </mwc-button>
          </div>
        ` : ''}

        <!-- Entity Overrides (card-type specific) -->
        ${['pump','heater','solar','dosing','overview','system','chemical','pool_flow'].includes(this._config.card_type) ? html`
          <details class="advanced-section">
            <summary>
              <ha-icon icon="mdi:swap-horizontal"></ha-icon>
              <span>${i18n.t('override_entities')}</span>
            </summary>
            <div class="advanced-content">
              ${['pump','overview','system','pool_flow'].includes(this._config.card_type) ? html`
                <ha-entity-picker label="${i18n.t('editor_override_pump')}" .hass="${this.hass}" .value="${this._config.pump_entity || ''}" .includeDomains="${['switch']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('pump_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
              ${['heater','overview','system','pool_flow'].includes(this._config.card_type) ? html`
                <ha-entity-picker label="Heater (override)" .hass="${this.hass}" .value="${this._config.heater_entity || ''}" .includeDomains="${['climate']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('heater_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
              ${['solar','overview','system','pool_flow'].includes(this._config.card_type) ? html`
                <ha-entity-picker label="Solar (override)" .hass="${this.hass}" .value="${this._config.solar_entity || ''}" .includeDomains="${['climate']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('solar_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
              ${['dosing','overview','system','pool_flow'].includes(this._config.card_type) ? html`
                <ha-entity-picker label="Chlorine Dosing (override)" .hass="${this.hass}" .value="${this._config.chlorine_entity || ''}" .includeDomains="${['switch']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('chlorine_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
              ${['dosing','overview','system','chemical','pool_flow'].includes(this._config.card_type) ? html`
                <ha-entity-picker label="${i18n.t('editor_override_chlorine_sensor')}" .hass="${this.hass}" .value="${this._config.chlorine_value_entity || ''}" .includeDomains="${['sensor']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('chlorine_value_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker label="${i18n.t('editor_override_ph')}" .hass="${this.hass}" .value="${this._config.ph_value_entity || ''}" .includeDomains="${['sensor']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('ph_value_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker label="ORP-Sensor (override)" .hass="${this.hass}" .value="${this._config.orp_value_entity || ''}" .includeDomains="${['sensor']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('orp_value_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
              ${['heater','solar','overview','system','chemical','pool_flow'].includes(this._config.card_type) ? html`
                <ha-entity-picker label="${i18n.t('editor_override_pool_temp')}" .hass="${this.hass}" .value="${this._config.pool_temp_entity || ''}" .includeDomains="${['sensor']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('pool_temp_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
              ${this._config.card_type === 'pool_flow' ? html`
                <ha-entity-picker label="${i18n.t('pool_flow_flow_rate')} (override)" .hass="${this.hass}" .value="${this._config.flow_rate_entity || ''}" .includeDomains="${['sensor']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('flow_rate_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker label="${i18n.t('pool_flow_filter_pressure')} (override)" .hass="${this.hass}" .value="${this._config.filter_pressure_entity || ''}" .includeDomains="${['sensor']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('filter_pressure_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker label="${i18n.t('pool_flow_water_level')} (override)" .hass="${this.hass}" .value="${this._config.pool_level_entity || ''}" .includeDomains="${['sensor']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('pool_level_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker label="${i18n.t('backwash_name')} (override)" .hass="${this.hass}" .value="${this._config.backwash_entity || ''}" .includeDomains="${['select','switch','binary_sensor']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('backwash_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker label="${i18n.t('pool_flow_refill')} (override)" .hass="${this.hass}" .value="${this._config.refill_entity || ''}" .includeDomains="${['select','switch','binary_sensor']}" @value-changed="${(e: CustomEvent) => this._overrideChanged('refill_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
            </div>
          </details>
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
                { value: 'lagoon', icon: '', label: 'Lagoon', desc: 'Dark · Violet Accent', preview: 'linear-gradient(160deg, #0d1b2a 0%, #9b6dff 100%)' },
              ].map(
                (theme) => html` <button class="theme-button ${this._config.theme === theme.value || (!this._config.theme && theme.value === 'classic') ? 'active' : ''}" @click="${() => this._themeChanged(theme.value)}" ><div class="theme-preview theme-${theme.value}"><div class="theme-dot" style="background:${theme.preview}"></div></div><div class="theme-info"><span class="theme-label">${theme.label}</span><span class="theme-desc">${theme.desc}</span></div></button> `
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
                (anim) => html` <button class="animation-button ${this._config.animation === anim.value ? 'active' : ''}" @click="${() => this._animationChanged(anim.value)}" ><span class="anim-icon">${anim.icon}</span><div class="anim-info"><span class="anim-label">${anim.label}</span><span class="anim-desc">${anim.desc}</span></div></button> `
              )}
            </div>
          </div>

          <div class="picker-container">
            <label>Quick Presets</label>
            <div class="preset-picker">
              ${this._presets.map((preset) => html`
                <button class="preset-button" @click="${() => this._applyPreset(preset.id)}">
                  <span class="preset-label">${preset.label}</span>
                  <span class="preset-desc">${preset.description}</span>
                </button>
              `)}
            </div>
          </div>

          <div class="config-section">
            <div class="section-header">
              <ha-icon icon="mdi:view-dashboard-variant"></ha-icon>
              <span>Dashboard Layout</span>
            </div>
            ${this._renderSelect('Layout Variant', this._config.layout_variant || 'glass', LAYOUT_VARIANT_OPTIONS, this._layoutVariantChanged)}

            ${this._renderSelect('Alarm Style', this._config.alarm_style || 'pulse', ALARM_STYLE_OPTIONS, this._alarmStyleChanged)}

            ${this._renderSelect('Accessibility', this._config.accessibility_mode || 'standard', ACCESSIBILITY_OPTIONS, this._accessibilityModeChanged)}

            ${this._renderSelect('Dashboard Mode', this._config.dashboard_mode || 'default', DASHBOARD_MODE_OPTIONS, this._dashboardModeChanged)}
          </div>
        </div>

        <!-- Advanced Customization -->
        <details class="advanced-section">
          <summary>
            <ha-icon icon="mdi:tune"></ha-icon>
            <span>Advanced Customization</span>
          </summary>

          <div class="advanced-content">
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

            ${this._renderSelect('Shadow Intensity', this._config.shadow_intensity || '', SHADOW_INTENSITY_OPTIONS, this._shadowIntensityChanged)}

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
    const value = selectedValue(ev);
    if (!value || this._config.card_type === value) return;

    this._config = {
      ...this._config,
      card_type: value as VioletPoolCardConfig['card_type'],
    };
    this._fireConfigChanged();
  }

  private _entityPrefixChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const value = target.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (this._config.entity_prefix === value) return;

    this._config = {
      ...this._config,
      entity_prefix: value || 'violet_pool_controller',
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
      size: size as CardSize,
    };
    this._fireConfigChanged();
  }

  private _themeChanged(theme: string): void {
    this._config = {
      ...this._config,
      theme: theme as Theme,
    };
    this._fireConfigChanged();
  }

  private _animationChanged(animation: string): void {
    this._config = {
      ...this._config,
      animation: animation as Animation,
    };
    this._fireConfigChanged();
  }

  private _layoutVariantChanged(ev: Event): void {
    const value = selectedValue(ev);
    if (!value) return;
    this._config = {
      ...this._config,
      layout_variant: value as VioletPoolCardConfig['layout_variant'],
    };
    this._fireConfigChanged();
  }

  private _alarmStyleChanged(ev: Event): void {
    const value = selectedValue(ev);
    if (!value) return;
    this._config = {
      ...this._config,
      alarm_style: value as VioletPoolCardConfig['alarm_style'],
    };
    this._fireConfigChanged();
  }

  private _accessibilityModeChanged(ev: Event): void {
    const value = selectedValue(ev);
    if (!value) return;
    this._config = {
      ...this._config,
      accessibility_mode: value as VioletPoolCardConfig['accessibility_mode'],
    };
    this._fireConfigChanged();
  }

  private _applyPreset(presetId: string): void {
    const preset = this._presets.find((entry) => entry.id === presetId);
    if (!preset) return;

    this._config = {
      ...this._config,
      ...preset.config,
    } as VioletPoolCardConfig;
    this._fireConfigChanged();
  }

  private _dashboardModeChanged(ev: Event): void {
    const value = selectedValue(ev);
    if (!value) return;
    this._config = {
      ...this._config,
      dashboard_mode: value as VioletPoolCardConfig['dashboard_mode'],
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
    const target = ev.target as HaElement;
    this._config = {
      ...this._config,
      show_state: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showDetailStatusChanged(ev: Event): void {
    const target = ev.target as HaElement;
    this._config = {
      ...this._config,
      show_detail_status: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showControlsChanged(ev: Event): void {
    const target = ev.target as HaElement;
    this._config = {
      ...this._config,
      show_controls: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showRuntimeChanged(ev: Event): void {
    const target = ev.target as HaElement;
    this._config = {
      ...this._config,
      show_runtime: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showHistoryChanged(ev: Event): void {
    const target = ev.target as HaElement;
    this._config = {
      ...this._config,
      show_history: target.checked,
    };
    this._fireConfigChanged();
  }

  private _dosingTypeChanged(ev: Event): void {
    const value = selectedValue(ev);
    if (!value) return;
    this._config = {
      ...this._config,
      dosing_type: value as VioletPoolCardConfig['dosing_type'],
    };
    this._fireConfigChanged();
  }

  private _chemistryTypeChanged(ev: Event): void {
    const value = selectedValue(ev);
    if (!value) return;
    this._config = {
      ...this._config,
      chemistry_type: value as VioletPoolCardConfig['chemistry_type'],
    };
    this._fireConfigChanged();
  }

  private _poolFlowModeChanged(ev: Event): void {
    const value = selectedValue(ev);
    if (!value) return;
    this._config = {
      ...this._config,
      flow_mode: value as VioletPoolCardConfig['flow_mode'],
    };
    this._fireConfigChanged();
  }

  private _renderFlowToggle(
    key:
      | 'flow_show_heater'
      | 'flow_show_solar'
      | 'flow_show_dosing'
      | 'flow_show_backwash'
      | 'flow_show_refill'
      | 'flow_show_chemistry'
      | 'flow_show_facts',
    label: TranslationKey
  ): TemplateResult {
    return html`
      <ha-formfield label="${i18n.t(label)}">
        <ha-switch
          .checked="${this._config[key] !== false}"
          @change="${(ev: Event) => this._poolFlowToggleChanged(key, ev)}"
        ></ha-switch>
      </ha-formfield>
    `;
  }

  private _poolFlowToggleChanged(
    key:
      | 'flow_show_heater'
      | 'flow_show_solar'
      | 'flow_show_dosing'
      | 'flow_show_backwash'
      | 'flow_show_refill'
      | 'flow_show_chemistry'
      | 'flow_show_facts',
    ev: Event
  ): void {
    this._config = {
      ...this._config,
      [key]: (ev.target as HaElement).checked,
    };
    this._fireConfigChanged();
  }

  private _showTemperatureChanged(ev: Event): void {
    const target = ev.target as HaElement;
    this._config = {
      ...this._config,
      show_temperature: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showPhChanged(ev: Event): void {
    const target = ev.target as HaElement;
    this._config = {
      ...this._config,
      show_ph: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showOrpChanged(ev: Event): void {
    const target = ev.target as HaElement;
    this._config = {
      ...this._config,
      show_orp: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showChlorineChanged(ev: Event): void {
    const target = ev.target as HaElement;
    this._config = {
      ...this._config,
      show_chlorine: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showSaltChanged(ev: Event): void {
    const target = ev.target as HaElement;
    this._config = {
      ...this._config,
      show_salt: target.checked,
    };
    this._fireConfigChanged();
  }

  private _showSaturationIndexChanged(ev: Event): void {
    const target = ev.target as HaElement;
    this._config = {
      ...this._config,
      show_saturation_index: target.checked,
    };
    this._fireConfigChanged();
  }

  /**
   * One water-balance input. The value is a number the owner reads off a test
   * kit, or the id of an entity holding it - an `input_number` that an
   * automation or the owner updates. Both are accepted in the same field, so
   * there is no mode to pick first.
   */
  private _renderWaterBalanceInput(
    key: 'calcium_hardness' | 'total_alkalinity' | 'cyanuric_acid' | 'total_dissolved_solids',
    label: string
  ): TemplateResult {
    const current = this._config[key];
    return html`
      <ha-textfield
        .label="${label}"
        .value="${current === undefined ? '' : String(current)}"
        @change="${(ev: Event) => this._waterBalanceChanged(key, ev)}"
      ></ha-textfield>
    `;
  }

  private _waterBalanceChanged(
    key: 'calcium_hardness' | 'total_alkalinity' | 'cyanuric_acid' | 'total_dissolved_solids',
    ev: Event
  ): void {
    const raw = (ev.target as HaElement).value?.trim() ?? '';
    const next = { ...this._config };
    if (raw === '') {
      delete next[key];
    } else {
      const asNumber = Number(raw);
      next[key] = Number.isFinite(asNumber) ? asNumber : raw;
    }
    this._config = next;
    this._fireConfigChanged();
  }

  private _showInletChanged(ev: Event): void {
    const target = ev.target as HaElement;
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
    this._config = {
      ...this._config,
      shadow_intensity:
        (selectedValue(ev) as VioletPoolCardConfig['shadow_intensity']) || undefined,
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

  /** One row of min/max inputs for a single water value. */
  private _renderThresholdRow(metric: MetricKey, label: string, step: number): TemplateResult {
    const band = this._config.thresholds?.[metric];
    const fallback = DEFAULT_THRESHOLDS[metric];

    return html`
      <div class="threshold-row">
        <span class="threshold-label">${label}</span>
        <ha-textfield
          type="number"
          label="Min"
          .step="${String(step)}"
          .value="${band?.min !== undefined ? String(band.min) : ''}"
          placeholder="${String(fallback.min)}"
          @change="${(e: Event) => this._thresholdChanged(metric, 'min', e)}"
        ></ha-textfield>
        <ha-textfield
          type="number"
          label="Max"
          .step="${String(step)}"
          .value="${band?.max !== undefined ? String(band.max) : ''}"
          placeholder="${String(fallback.max)}"
          @change="${(e: Event) => this._thresholdChanged(metric, 'max', e)}"
        ></ha-textfield>
        <ha-textfield
          type="number"
          label="${i18n.t('editor_tolerance')}"
          .step="${String(step)}"
          .value="${band?.warn !== undefined ? String(band.warn) : ''}"
          placeholder="${String(fallback.warn)}"
          helper="${i18n.t('editor_tolerance_hint')}"
          @change="${(e: Event) => this._thresholdChanged(metric, 'warn', e)}"
        ></ha-textfield>
      </div>
    `;
  }

  private _thresholdChanged(metric: MetricKey, key: 'min' | 'max' | 'warn', ev: Event): void {
    const raw = (ev.target as HTMLInputElement).value?.trim() ?? '';
    const thresholds: NonNullable<VioletPoolCardConfig['thresholds']> = { ...(this._config.thresholds || {}) };
    const band = { ...(thresholds[metric] || {}) };

    if (raw === '') {
      delete band[key];
    } else {
      const parsed = Number(raw);
      if (!Number.isFinite(parsed)) return;
      band[key] = parsed;
    }

    if (Object.keys(band).length === 0) {
      delete thresholds[metric];
    } else {
      thresholds[metric] = band;
    }

    const next = { ...this._config };
    if (Object.keys(thresholds).length === 0) {
      delete next.thresholds;
    } else {
      next.thresholds = thresholds;
    }

    this._config = next;
    this._fireConfigChanged();
  }

  private _alertLevelChanged(ev: Event): void {
    const value = selectedValue(ev) as VioletPoolCardConfig['alerts'];
    if (!value || this._config.alerts === value) return;

    const next = { ...this._config };
    if (value === 'all') {
      delete next.alerts;
    } else {
      next.alerts = value;
    }
    // The legacy switch would silently override the new setting.
    delete next.show_alerts;

    this._config = next;
    this._fireConfigChanged();
  }

  private _resetThresholds(): void {
    if (!this._config.thresholds && !this._config.alerts && this._config.show_alerts === undefined) return;

    const next = { ...this._config };
    delete next.thresholds;
    delete next.alerts;
    delete next.show_alerts;

    this._config = next;
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
    return css`:host{font-family:-apple-system, system-ui, 'Segoe UI', sans-serif;}.card-config{display:flex;flex-direction:column;gap:14px;padding:16px;}.config-section{background:var(--card-background-color, #fff);border:1px solid var(--divider-color, rgba(0,0,0,0.08));border-radius:14px;padding:16px;}.section-header{display:flex;align-items:center;gap:8px;margin-bottom:14px;font-weight:600;font-size:14px;letter-spacing:-0.2px;color:var(--primary-text-color);}.section-header ha-icon{--mdc-icon-size:18px;color:var(--primary-color);}.prefix-info{display:flex;align-items:flex-start;gap:8px;padding:10px 12px;margin-top:10px;background:rgba(0,122,255,0.07);border-radius:10px;font-size:12px;color:var(--secondary-text-color);line-height:1.4;}.prefix-info ha-icon{--mdc-icon-size:16px;color:#007AFF;flex-shrink:0;margin-top:2px;}.premium-section{background:var(--card-background-color, #fff);border:2px solid rgba(0,122,255,0.15);}.premium-header{color:#007AFF;}.picker-container{margin-bottom:20px;}.picker-container:last-child{margin-bottom:0;}.picker-container > label{display:block;font-weight:500;font-size:13px;margin-bottom:10px;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:0.5px;}.size-picker{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}.theme-picker{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}.animation-picker{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;}.preset-picker{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;}.size-button,.theme-button,.animation-button,.preset-button{display:flex;align-items:center;gap:10px;padding:10px;background:var(--secondary-background-color, rgba(120,120,128,0.06));border:1.5px solid transparent;border-radius:10px;cursor:pointer;transition:all 0.16s ease;font-family:inherit;}.size-button{flex-direction:column;gap:6px;align-items:center;}.theme-button{flex-direction:column;gap:6px;align-items:center;padding:10px 8px;}.preset-button{flex-direction:column;align-items:flex-start;text-align:left;gap:4px;min-height:84px;justify-content:flex-start;}.size-button:hover,.theme-button:hover,.animation-button:hover,.preset-button:hover{border-color:rgba(0,122,255,0.3);background:rgba(0,122,255,0.05);}.size-button.active,.animation-button.active{border-color:#007AFF;background:rgba(0,122,255,0.1);color:#007AFF;}.theme-button.active{border-color:#007AFF;background:rgba(0,122,255,0.08);box-shadow:0 0 0 3px rgba(0,122,255,0.15);}.preset-label{font-size:12px;font-weight:700;color:var(--primary-text-color);}.preset-desc{font-size:11px;line-height:1.35;color:var(--secondary-text-color);}.size-preview{width:36px;height:26px;border-radius:6px;border:2px solid currentColor;opacity:0.3;}.size-preview.size-small{width:22px;height:18px;}.size-preview.size-medium{width:30px;height:22px;}.size-preview.size-large{width:40px;height:28px;}.size-preview.size-fullscreen{width:46px;height:34px;}.size-button.active .size-preview{opacity:1;}.size-button span{font-size:11px;font-weight:500;}.theme-preview{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid rgba(0,0,0,0.08);}.theme-preview.theme-classic{background:#F2F2F7;}.theme-preview.theme-midnight{background:#0D1117;}.theme-preview.theme-elegance{background:linear-gradient(135deg,#FFD700 0%,#F0E6FA 50%,#DDA0DD 100%);}.theme-preview.theme-vibrant{background:linear-gradient(135deg,#FF6B6B 0%,#4ECDC4 100%);}.theme-preview.theme-pure{background:#fff;border:2px solid #e5e5e5;}.theme-preview.theme-frost{background:rgba(200,220,255,0.4);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.3);}.theme-preview.theme-glow{background:#0D0D14;border:2px solid #00D4FF;box-shadow:0 0 8px rgba(0,212,255,0.5);}.theme-preview.theme-metallic{background:linear-gradient(135deg,#C0C0C0 0%,#E8E8E8 50%,#A8A8A8 100%);border:2px solid #999;}.theme-preview.theme-ocean{background:#0077BE;}.theme-preview.theme-sunset{background:#FF6B35;}.theme-preview.theme-forest{background:#228B22;}.theme-preview.theme-aurora{background:linear-gradient(45deg, #00C9FF 0%, #92FE9D 100%);}.theme-dot{width:20px;height:20px;border-radius:50%;border:2px solid rgba(0,0,0,0.1);}.theme-info, .anim-info{display:flex;flex-direction:column;gap:1px;}.theme-label, .anim-label{font-weight:600;color:var(--primary-text-color);font-size:12px;}.theme-desc, .anim-desc{color:var(--secondary-text-color);font-size:10px;}.anim-icon{font-size:18px;}.advanced-section{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:14px;padding:14px;}.advanced-section summary{display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;font-size:14px;color:var(--primary-text-color);list-style:none;}.advanced-section summary::-webkit-details-marker{display:none;}.advanced-section summary ha-icon{--mdc-icon-size:18px;color:var(--primary-color);}.advanced-content{display:flex;flex-direction:column;gap:12px;margin-top:14px;}ha-select,ha-textfield,ha-entity-picker,ha-icon-picker{width:100%;}ha-formfield{display:flex;align-items:center;margin-bottom:10px;}.threshold-row{display:grid;grid-template-columns:minmax(96px,1fr) repeat(3,minmax(72px,1fr));align-items:start;gap:8px;margin-top:12px;}.threshold-label{font-size:12px;font-weight:600;color:var(--primary-text-color);padding-top:14px;}.threshold-reset{margin-top:14px;--mdc-theme-primary:var(--primary-color);}@media (max-width:600px){.threshold-row{grid-template-columns:repeat(3,1fr);}.threshold-label{grid-column:1/-1;padding-top:4px;}}@media (max-width:760px){.theme-picker,.preset-picker{grid-template-columns:repeat(2,1fr);}.size-picker{grid-template-columns:repeat(2,1fr);}}`;
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
