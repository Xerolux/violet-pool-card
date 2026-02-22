import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type BadgeState = 'off' | 'on' | 'auto' | 'manual' | 'blocked' | 'error' | 'idle' | 'heat' | 'heating' | 'cool' | 'cooling';

interface StateConfig {
  color: string;
  icon: string;
  label: string;
}

const STATE_CONFIG: Record<BadgeState, StateConfig> = {
  off: { color: '#757575', icon: 'mdi:power-off', label: 'OFF' },
  on: { color: '#4CAF50', icon: 'mdi:power-on', label: 'ON' },
  auto: { color: '#2196F3', icon: 'mdi:autorenew', label: 'AUTO' },
  manual: { color: '#FF9800', icon: 'mdi:hand-back-right', label: 'MANUAL' },
  blocked: { color: '#FFC107', icon: 'mdi:block-helper', label: 'BLOCKED' },
  error: { color: '#F44336', icon: 'mdi:alert-circle', label: 'ERROR' },
  idle: { color: '#9E9E9E', icon: 'mdi:sleep', label: 'IDLE' },
  heat: { color: '#FF5722', icon: 'mdi:fire', label: 'HEAT' },
  heating: { color: '#FF5722', icon: 'mdi:fire', label: 'HEATING' },
  cool: { color: '#00BCD4', icon: 'mdi:snowflake', label: 'COOL' },
  cooling: { color: '#00BCD4', icon: 'mdi:snowflake', label: 'COOLING' },
};

@customElement('status-badge')
export class StatusBadge extends LitElement {
  @property() public state!: BadgeState;
  @property() public label?: string;
  @property() public icon?: string;
  @property({ type: Boolean }) public pulse = false;
  @property({ type: Boolean }) public showIcon = true;

  protected render(): TemplateResult {
    const config = STATE_CONFIG[this.state] || STATE_CONFIG.off;
    const displayLabel = this.label || config.label;
    const displayIcon = this.icon || config.icon;

    return html` <div class="badge ${this.state} ${this.pulse ? 'pulse' : ''}" style="--badge-color: ${config.color}" > ${this.showIcon ? html`<ha-icon icon="${displayIcon}"></ha-icon>` : ''}
        <span class="label">${displayLabel}</span>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`:host{display:inline-block}.badge{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:6px 14px;border-radius:16px;background:var(--badge-color);color:white;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.1);transition:all 0.2s ease}.badge:hover{transform:translateY(-1px);box-shadow:0 3px 6px rgba(0,0,0,0.15)}.badge ha-icon{--mdc-icon-size:16px;display:flex;align-items:center}.label{line-height:1}.badge.pulse{animation:pulse 2s ease-in-out infinite}@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.85;transform:scale(1.02)}}.badge.auto ha-icon{animation:rotate 3s linear infinite}@keyframes rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.badge.heating,.badge.cooling{animation:breathe 2s ease-in-out infinite}@keyframes breathe{0%,100%{opacity:1}50%{opacity:0.7}}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'status-badge': StatusBadge;
  }
}
