/**
 * Violet Pool Card – Pump Control Component
 * © 2026 Xerolux
 *
 * Advanced pump control with speed slider, eco/boost modes, anti-freeze
 */

import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import type { ServiceCaller } from '../utils/service-caller';
import { pumpSVG } from '../utils/animated-icons';

export class PumpControl extends LitElement {
  @property({ type: String }) pumpEntity: string = '';
  @property({ type: Number }) currentSpeed: number = 0;
  @property({ type: String }) currentMode: string = 'auto';
  @property({ type: Boolean }) antiFreeze: boolean = false;
  @property({ type: Object }) hass: any;

  private serviceCaller: ServiceCaller | null = null;
  private isUpdating = false;

  connectedCallback() {
    super.connectedCallback();
    if (this.hass?.callService) {
      this.serviceCaller = new (require('../utils/service-caller').ServiceCaller)(this.hass);
    }
  }

  private async setPumpSpeed(speed: number) {
    if (!this.serviceCaller || this.isUpdating) return;
    this.isUpdating = true;
    try {
      await this.serviceCaller.setPumpSpeed(this.pumpEntity, speed);
      this.currentSpeed = speed;
    } finally {
      this.isUpdating = false;
    }
  }

  private async setPumpMode(mode: 'auto' | 'eco' | 'boost') {
    if (!this.serviceCaller || this.isUpdating) return;
    this.isUpdating = true;
    try {
      if (mode === 'eco') {
        await this.serviceCaller.setPumpEcoMode(this.pumpEntity);
      } else if (mode === 'boost') {
        await this.serviceCaller.setPumpBoostMode(this.pumpEntity);
      } else {
        await this.serviceCaller.setPumpAuto(this.pumpEntity);
      }
      this.currentMode = mode;
    } finally {
      this.isUpdating = false;
    }
  }

  private async toggleAntiFreeze() {
    if (!this.serviceCaller || this.isUpdating) return;
    this.isUpdating = true;
    try {
      // Anti-freeze configuration via setConfig service
      const newState = !this.antiFreeze ? 1 : 0;
      await this.serviceCaller.callService('violet_pool_controller', 'control_pump_http', {
        entity_id: this.pumpEntity,
        action: 'anti_freeze',
        enabled: newState,
      });
      this.antiFreeze = !this.antiFreeze;
    } finally {
      this.isUpdating = false;
    }
  }

  protected render(): TemplateResult {
    const color = '#0099FF';
    return html`
      <div class="pump-control">
        <!-- Icon & Status -->
        <div class="status-section">
          <div class="icon-wrapper">
            ${pumpSVG(this.currentSpeed, color)}
          </div>
          <div class="status-info">
            <div class="pump-name">Pump</div>
            <div class="pump-state">
              ${this.currentSpeed === 0 ? 'Off' : `Speed ${this.currentSpeed}/3`}
            </div>
          </div>
        </div>

        <!-- Speed Slider -->
        <div class="control-section">
          <div class="label">Speed Control</div>
          <div class="speed-slider-wrapper">
            <input
              type="range"
              min="0"
              max="3"
              .value="${this.currentSpeed}"
              @input="${(e: Event) => this.setPumpSpeed(parseInt((e.target as HTMLInputElement).value))}"
              class="speed-slider"
            />
            <div class="speed-labels">
              <span class="off">OFF</span>
              <span class="eco">ECO</span>
              <span class="normal">NORMAL</span>
              <span class="boost">BOOST</span>
            </div>
          </div>
        </div>

        <!-- Quick Mode Buttons -->
        <div class="button-grid">
          <button
            class="mode-btn ${this.currentMode === 'eco' ? 'active' : ''}"
            @click="${() => this.setPumpMode('eco')}"
            title="Eco Mode - Slow, Energy Efficient"
          >
            🌿 ECO
          </button>
          <button
            class="mode-btn ${this.currentMode === 'auto' ? 'active' : ''}"
            @click="${() => this.setPumpMode('auto')}"
            title="Auto Mode - Controlled"
          >
            ⚙️ AUTO
          </button>
          <button
            class="mode-btn ${this.currentMode === 'boost' ? 'active' : ''}"
            @click="${() => this.setPumpMode('boost')}"
            title="Boost Mode - Maximum Speed"
          >
            ⚡ BOOST
          </button>
          <button
            class="mode-btn toggle ${this.antiFreeze ? 'active' : ''}"
            @click="${() => this.toggleAntiFreeze()}"
            title="Anti-Freeze Protection"
          >
            ❄️ FREEZE
          </button>
        </div>

        <!-- Advanced Options -->
        <details class="advanced">
          <summary>⚙️ Advanced Options</summary>
          <div class="advanced-content">
            <div class="option">
              <label>Runtime Limit (hours)</label>
              <input type="number" min="0" max="24" value="8" />
            </div>
            <div class="option">
              <label>Min Runtime (minutes)</label>
              <input type="number" min="0" max="120" value="5" />
            </div>
          </div>
        </details>
      </div>
    `;
  }

  static styles: CSSResultGroup = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .pump-control {
      background: linear-gradient(135deg, rgba(0, 153, 255, 0.08) 0%, rgba(0, 102, 204, 0.04) 100%);
      border: 1px solid rgba(0, 153, 255, 0.2);
      border-radius: 12px;
      padding: 20px;
      gap: 16px;
      display: flex;
      flex-direction: column;
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

    .pump-name {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
    }

    .pump-state {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 4px;
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

    .speed-slider-wrapper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .speed-slider {
      width: 100%;
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(90deg, #ff4444, #ffaa00, #44ff44, #0099ff);
      outline: none;
      -webkit-appearance: none;
      appearance: none;
      cursor: pointer;
    }

    .speed-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .speed-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .speed-labels {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
    }

    .button-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .mode-btn {
      padding: 10px 12px;
      background: rgba(0, 153, 255, 0.1);
      border: 1px solid rgba(0, 153, 255, 0.3);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .mode-btn:hover {
      background: rgba(0, 153, 255, 0.2);
      border-color: rgba(0, 153, 255, 0.5);
      color: #fff;
    }

    .mode-btn.active {
      background: rgba(0, 153, 255, 0.4);
      border-color: rgba(0, 153, 255, 0.8);
      color: #fff;
      box-shadow: 0 0 12px rgba(0, 153, 255, 0.3);
    }

    .mode-btn.toggle.active {
      background: rgba(0, 200, 255, 0.5);
      border-color: rgba(0, 200, 255, 0.8);
      color: #fff;
    }

    .advanced {
      margin-top: 8px;
      border-top: 1px solid rgba(0, 153, 255, 0.2);
      padding-top: 12px;
    }

    .advanced summary {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      user-select: none;
    }

    .advanced-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }

    .option {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .option label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    }

    .option input {
      padding: 6px 8px;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(0, 153, 255, 0.3);
      border-radius: 6px;
      color: #fff;
      font-size: 12px;
    }

    @media (max-width: 600px) {
      .button-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .pump-control {
        padding: 16px;
      }
    }
  `;
}

customElements.define('pump-control', PumpControl);
