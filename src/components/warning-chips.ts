import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export type ChipType = 'info' | 'warning' | 'error' | 'success';

interface ChipConfig {
  color: string;
  backgroundColor: string;
  icon: string;
}

const CHIP_CONFIG: Record<ChipType, ChipConfig> = {
  info: {
    color: '#2196F3',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    icon: 'mdi:information',
  },
  warning: {
    color: '#FF9800',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    icon: 'mdi:alert',
  },
  error: {
    color: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    icon: 'mdi:alert-circle',
  },
  success: {
    color: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    icon: 'mdi:check-circle',
  },
};

export interface Warning {
  text: string;
  type?: ChipType;
  icon?: string;
  dismissable?: boolean;
}

@customElement('warning-chips')
export class WarningChips extends LitElement {
  @property({ type: Array }) public warnings: Warning[] | string[] = [];
  @property() public defaultType: ChipType = 'warning';
  @property({ type: Boolean }) public dismissable = false;
  @state() private dismissedWarnings: Set<string> = new Set();

  private normalizeWarnings(): Warning[] {
    return this.warnings.map((warning) => {
      if (typeof warning === 'string') {
        return {
          text: this.formatWarningText(warning),
          type: this.getWarningType(warning),
          dismissable: this.dismissable,
        };
      }
      return {
        ...warning,
        text: this.formatWarningText(warning.text),
        type: warning.type || this.defaultType,
        dismissable: warning.dismissable !== undefined ? warning.dismissable : this.dismissable,
      };
    });
  }

  private formatWarningText(text: string): string {
    if (!text) return '';

    return text
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private getWarningType(text: string): ChipType {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('error') || lowerText.includes('critical') || lowerText.includes('failed')) {
      return 'error';
    }
    if (lowerText.includes('blocked') || lowerText.includes('threshold') || lowerText.includes('limit')) {
      return 'warning';
    }
    if (lowerText.includes('ok') || lowerText.includes('success') || lowerText.includes('complete')) {
      return 'success';
    }

    return 'info';
  }

  private handleDismiss(warning: Warning) {
    this.dismissedWarnings.add(warning.text);
    this.requestUpdate();

    // Dispatch event for parent component
    this.dispatchEvent(
      new CustomEvent('warning-dismissed', {
        detail: { warning },
        bubbles: true,
        composed: true,
      })
    );
  }

  private isDismissed(warning: Warning): boolean {
    return this.dismissedWarnings.has(warning.text);
  }

  protected render(): TemplateResult {
    const normalizedWarnings = this.normalizeWarnings().filter((w) => !this.isDismissed(w));

    if (normalizedWarnings.length === 0) {
      return html``;
    }

    return html` <div class="warning-chips"> ${normalizedWarnings.map((warning) => this.renderChip(warning))} </div> `;
  }

  private renderChip(warning: Warning): TemplateResult {
    const type = warning.type || this.defaultType;
    const config = CHIP_CONFIG[type];
    const icon = warning.icon || config.icon;

    return html` <div class="chip ${type}" style=" --chip-color: ${config.color}; --chip-bg: ${config.backgroundColor}; " ><ha-icon icon="${icon}"></ha-icon><span class="chip-text">${warning.text}</span> ${warning.dismissable ? html`
              <button
                class="dismiss-button"
                @click="${() => this.handleDismiss(warning)}"
                title="Dismiss"
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            `
          : ''}
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`:host{display:block}.warning-chips{display:flex;flex-wrap:wrap;gap:8px}.chip{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:16px;background:var(--chip-bg);color:var(--chip-color);font-size:13px;font-weight:500;line-height:1.2;border:1px solid var(--chip-color);transition:all 0.2s ease}.chip:hover{transform:translateY(-1px);box-shadow:0 2px 4px rgba(0,0,0,0.1)}.chip ha-icon{--mdc-icon-size:16px;flex-shrink:0}.chip-text{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dismiss-button{display:flex;align-items:center;justify-content:center;padding:0;margin:0;border:none;background:none;color:var(--chip-color);cursor:pointer;opacity:0.7;transition:opacity 0.2s ease}.dismiss-button:hover{opacity:1}.dismiss-button ha-icon{--mdc-icon-size:14px}.chip.error{animation:pulse-error 2s ease-in-out infinite}@keyframes pulse-error{0%,100%{opacity:1}50%{opacity:0.85}}@media(max-width:600px){.warning-chips{flex-direction:column}.chip{width:100%;box-sizing:border-box}.chip-text{white-space:normal;overflow:visible}}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'warning-chips': WarningChips;
  }
}
