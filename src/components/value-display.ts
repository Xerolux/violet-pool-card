import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ValueStatus = 'normal' | 'low' | 'high' | 'critical' | 'ok' | 'warning' | 'error';

interface StatusConfig {
  color: string;
  icon: string;
}

const STATUS_CONFIG: Record<ValueStatus, StatusConfig> = {
  normal: { color: '#4CAF50', icon: 'mdi:check-circle' },
  ok: { color: '#4CAF50', icon: 'mdi:check-circle' },
  low: { color: '#2196F3', icon: 'mdi:arrow-down-circle' },
  high: { color: '#FF9800', icon: 'mdi:arrow-up-circle' },
  critical: { color: '#F44336', icon: 'mdi:alert-circle' },
  warning: { color: '#FF9800', icon: 'mdi:alert' },
  error: { color: '#F44336', icon: 'mdi:close-circle' },
};

@customElement('value-display')
export class ValueDisplay extends LitElement {
  @property({ type: Number }) public value?: number;
  @property() public unit = '';
  @property() public label = '';
  @property() public status: ValueStatus = 'normal';
  @property({ type: Number }) public min?: number;
  @property({ type: Number }) public max?: number;
  @property({ type: Number }) public target?: number;
  @property({ type: Number }) public decimals = 1;
  @property({ type: Boolean }) public showStatus = true;
  @property({ type: Boolean }) public showRange = false;
  @property({ type: Boolean }) public large = false;

  private formatValue(val?: number): string {
    if (val === undefined || val === null) return '--';
    return val.toFixed(this.decimals);
  }

  private getStatusFromValue(): ValueStatus {
    if (this.value === undefined || this.value === null) return 'normal';

    // If explicit status is set, use it
    if (this.status !== 'normal') return this.status;

    // Auto-calculate status based on min/max
    if (this.min !== undefined && this.value < this.min) {
      return this.value < this.min * 0.9 ? 'critical' : 'low';
    }
    if (this.max !== undefined && this.value > this.max) {
      return this.value > this.max * 1.1 ? 'critical' : 'high';
    }

    return 'normal';
  }

  protected render(): TemplateResult {
    const currentStatus = this.getStatusFromValue();
    const statusConfig = STATUS_CONFIG[currentStatus];

    return html`
      <div class="value-display ${this.large ? 'large' : ''}">
        ${this.label ? html`<div class="label">${this.label}</div>` : ''}

        <div class="value-container">
          <div class="value" style="color: ${statusConfig.color}">
            ${this.formatValue(this.value)}
            ${this.unit ? html`<span class="unit">${this.unit}</span>` : ''}
          </div>

          ${this.showStatus
            ? html`
                <ha-icon
                  icon="${statusConfig.icon}"
                  style="color: ${statusConfig.color}"
                ></ha-icon>
              `
            : ''}
        </div>

        ${this.target !== undefined
          ? html`
              <div class="target">
                → ${this.formatValue(this.target)}${this.unit}
              </div>
            `
          : ''}

        ${this.showRange && (this.min !== undefined || this.max !== undefined)
          ? html`
              <div class="range">
                ${this.min !== undefined
                  ? html`<span class="range-min">Min: ${this.formatValue(this.min)}${this.unit}</span>`
                  : ''}
                ${this.max !== undefined
                  ? html`<span class="range-max">Max: ${this.formatValue(this.max)}${this.unit}</span>`
                  : ''}
              </div>
            `
          : ''}
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host{display:block}
      .value-display{display:flex;flex-direction:column;gap:4px}
      .label{font-size:12px;font-weight:500;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:0.5px}
      .value-container{display:flex;align-items:center;gap:8px}
      .value{font-size:24px;font-weight:700;line-height:1;color:var(--primary-text-color);display:flex;align-items:baseline;gap:4px}
      .value-display.large .value{font-size:32px;font-weight:800}
      .unit{font-size:16px;font-weight:500;opacity:0.8}
      .value-display.large .unit{font-size:20px}
      ha-icon{--mdc-icon-size:20px;flex-shrink:0}
      .target{font-size:14px;color:var(--secondary-text-color);display:flex;align-items:center;gap:4px}
      .range{display:flex;gap:12px;font-size:11px;color:var(--disabled-text-color);margin-top:4px}
      .range-min::before{content:'\\25BC ';color:var(--info-color,#2196F3)}
      .range-max::before{content:'\\25B2 ';color:var(--warning-color,#FF9800)}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'value-display': ValueDisplay;
  }
}
