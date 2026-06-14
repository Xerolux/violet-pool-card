/**
 * Violet Pool Card – Heater Control Component
 * © 2026 Xerolux
 *
 * Advanced heater control with target temperature, postrun, boiler monitoring
 */

import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import type { ServiceCaller } from '../utils/service-caller';
import { heaterSVG } from '../utils/animated-icons';

export class HeaterControl extends LitElement {
  @property({ type: String }) heaterEntity: string = '';
  @property({ type: Number }) currentTemp: number = 0;
  @property({ type: Number }) targetTemp: number = 28;
  @property({ type: Number }) postrunDelay: number = 300; // seconds
  @property({ type: Boolean }) boilerActive: boolean = false;
  @property({ type: Number }) boilerTemp: number = 0;
  @property({ type: Boolean }) hxOvertemp: boolean = false;
  @property({ type: Object }) hass: any;

  private serviceCaller: ServiceCaller | null = null;
  private isUpdating = false;

  connectedCallback() {
    super.connectedCallback();
    if (this.hass?.callService) {
      this.serviceCaller = new (require('../utils/service-caller').ServiceCaller)(this.hass);
    }
  }

  private async setTargetTemp(temp: number) {
    if (!this.serviceCaller || this.isUpdating) return;
    this.isUpdating = true;
    try {
      await this.serviceCaller.setTemperature(this.heaterEntity, temp);
      this.targetTemp = temp;
    } finally {
      this.isUpdating = false;
    }
  }

  private async setPostrunDelay(seconds: number) {
    if (!this.serviceCaller || this.isUpdating) return;
    this.isUpdating = true;
    try {
      await this.serviceCaller.callService('violet_pool_controller', 'control_heater_http', {
        entity_id: this.heaterEntity,
        action: 'set_postrun',
        postrun_delay: seconds,
      });
      this.postrunDelay = seconds;
    } finally {
      this.isUpdating = false;
    }
  }

  protected render(): TemplateResult {
    const color = '#FF6B35';
    const isHeating = this.currentTemp < this.targetTemp;
    const tempDiff = this.targetTemp - this.currentTemp;

    return html`
      <div class="heater-control">
        <!-- Icon & Status -->
        <div class="status-section">
          <div class="icon-wrapper">
            ${heaterSVG(isHeating, color)}
          </div>
          <div class="status-info">
            <div class="heater-name">Heater</div>
            <div class="temp-display">
              <span class="current">${this.currentTemp.toFixed(1)}°C</span>
              <span class="target">→ ${this.targetTemp}°C</span>
            </div>
            ${tempDiff > 0 ? html`
              <div class="heating-status">
                ↑ +${tempDiff.toFixed(1)}°C to target
              </div>
            ` : html`
              <div class="heating-status ready">
                ✓ Target reached
              </div>
            `}
          </div>
        </div>

        <!-- Temperature Slider -->
        <div class="control-section">
          <div class="label">Target Temperature</div>
          <div class="temp-slider-wrapper">
            <input
              type="range"
              min="16"
              max="40"
              step="0.5"
              .value="${this.targetTemp}"
              @input="${(e: Event) => this.setTargetTemp(parseFloat((e.target as HTMLInputElement).value))}"
              class="temp-slider"
            />
            <div class="temp-labels">
              <span>16°</span>
              <span>28°</span>
              <span>40°</span>
            </div>
          </div>
        </div>

        <!-- Postrun Configuration -->
        <div class="control-section">
          <div class="label">Postrun Delay</div>
          <div class="postrun-grid">
            <button
              class="preset-btn ${this.postrunDelay === 0 ? 'active' : ''}"
              @click="${() => this.setPostrunDelay(0)}"
            >
              Off
            </button>
            <button
              class="preset-btn ${this.postrunDelay === 300 ? 'active' : ''}"
              @click="${() => this.setPostrunDelay(300)}"
            >
              5 min
            </button>
            <button
              class="preset-btn ${this.postrunDelay === 600 ? 'active' : ''}"
              @click="${() => this.setPostrunDelay(600)}"
            >
              10 min
            </button>
            <button
              class="preset-btn ${this.postrunDelay === 900 ? 'active' : ''}"
              @click="${() => this.setPostrunDelay(900)}"
            >
              15 min
            </button>
          </div>
          <div class="current-value">
            Current: ${Math.round(this.postrunDelay / 60)} min
          </div>
        </div>

        <!-- Boiler & Safety Status -->
        <div class="status-grid">
          <div class="status-card ${this.boilerActive ? 'active' : 'inactive'}">
            <div class="status-icon">🔥</div>
            <div class="status-text">
              <div class="status-label">Boiler</div>
              <div class="status-value">
                ${this.boilerActive ? `${this.boilerTemp}°C` : 'Standby'}
              </div>
            </div>
          </div>

          <div class="status-card ${this.hxOvertemp ? 'warning' : 'normal'}">
            <div class="status-icon">🌡️</div>
            <div class="status-text">
              <div class="status-label">HX Temp</div>
              <div class="status-value">
                ${this.hxOvertemp ? '⚠️ OVERTEMP' : 'Normal'}
              </div>
            </div>
          </div>
        </div>

        <!-- Alerts -->
        ${this.hxOvertemp ? html`
          <div class="alert warning">
            ⚠️ Heat Exchanger Overtemperature – Check water flow
          </div>
        ` : ''}
      </div>
    `;
  }

  static styles: CSSResultGroup = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .heater-control {
      background: linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(255, 140, 0, 0.04) 100%);
      border: 1px solid rgba(255, 107, 53, 0.2);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .status-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .icon-wrapper {
      width: 60px;
      height: 60px;
      flex-shrink: 0;
    }

    .status-info {
      flex: 1;
    }

    .heater-name {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
    }

    .temp-display {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 4px;
      display: flex;
      gap: 8px;
    }

    .current {
      font-weight: 600;
      color: #FFD700;
    }

    .target {
      color: rgba(255, 255, 255, 0.6);
    }

    .heating-status {
      font-size: 12px;
      color: rgba(255, 150, 0, 0.8);
      margin-top: 4px;
      font-weight: 500;
    }

    .heating-status.ready {
      color: rgba(100, 255, 100, 0.8);
    }

    .control-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .label {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .temp-slider-wrapper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .temp-slider {
      width: 100%;
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(90deg, #0099ff, #ffaa00, #ff6b35);
      outline: none;
      -webkit-appearance: none;
      appearance: none;
      cursor: pointer;
    }

    .temp-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .temp-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .temp-labels {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
    }

    .postrun-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .preset-btn {
      padding: 10px 12px;
      background: rgba(255, 107, 53, 0.1);
      border: 1px solid rgba(255, 107, 53, 0.3);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .preset-btn:hover {
      background: rgba(255, 107, 53, 0.2);
      border-color: rgba(255, 107, 53, 0.5);
      color: #fff;
    }

    .preset-btn.active {
      background: rgba(255, 107, 53, 0.4);
      border-color: rgba(255, 107, 53, 0.8);
      color: #fff;
      box-shadow: 0 0 12px rgba(255, 107, 53, 0.3);
    }

    .current-value {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 4px;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .status-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .status-card.active {
      background: rgba(255, 107, 53, 0.15);
      border-color: rgba(255, 107, 53, 0.4);
    }

    .status-card.warning {
      background: rgba(255, 150, 0, 0.15);
      border-color: rgba(255, 150, 0, 0.4);
    }

    .status-icon {
      font-size: 24px;
    }

    .status-text {
      flex: 1;
    }

    .status-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-value {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      margin-top: 2px;
    }

    .alert {
      padding: 12px;
      background: rgba(255, 150, 0, 0.15);
      border-left: 3px solid rgba(255, 150, 0, 0.6);
      border-radius: 6px;
      font-size: 12px;
      color: rgba(255, 200, 100, 0.9);
      margin-top: 8px;
    }

    @media (max-width: 600px) {
      .heater-control {
        padding: 16px;
      }

      .postrun-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;
}

customElements.define('heater-control', HeaterControl);
