import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('detail-status')
export class DetailStatus extends LitElement {
  @property() public raw?: string | string[];
  @property() public icon?: string;
  @property({ type: Boolean }) public compact = false;

  private parsePipeSeparated(raw: string): { level?: number; status: string } {
    if (!raw || typeof raw !== 'string') {
      return { status: '' };
    }

    const parts = raw.split('|');
    if (parts.length === 2) {
      const level = parseInt(parts[0], 10);
      const status = this.formatStatusText(parts[1]);
      return { level: isNaN(level) ? undefined : level, status };
    }

    return { status: this.formatStatusText(raw) };
  }

  private formatStatusText(text: string): string {
    if (!text) return '';

    return text
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private parseArray(raw: string[]): string[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((item) => this.formatStatusText(item)).filter((item) => item);
  }

  private getIconForStatus(status: string): string {
    const lowerStatus = status.toLowerCase();

    if (lowerStatus.includes('freeze') || lowerStatus.includes('frost')) {
      return 'mdi:snowflake-alert';
    }
    if (lowerStatus.includes('blocked') || lowerStatus.includes('block')) {
      return 'mdi:block-helper';
    }
    if (lowerStatus.includes('threshold') || lowerStatus.includes('limit')) {
      return 'mdi:speedometer';
    }
    if (lowerStatus.includes('temp')) {
      return 'mdi:thermometer-alert';
    }
    if (lowerStatus.includes('error')) {
      return 'mdi:alert-circle';
    }
    if (lowerStatus.includes('ok') || lowerStatus.includes('normal')) {
      return 'mdi:check-circle';
    }

    return 'mdi:information';
  }

  private getColorForStatus(status: string): string {
    const lowerStatus = status.toLowerCase();

    if (lowerStatus.includes('error') || lowerStatus.includes('critical')) {
      return 'var(--error-color, #F44336)';
    }
    if (lowerStatus.includes('blocked') || lowerStatus.includes('freeze')) {
      return 'var(--warning-color, #FF9800)';
    }
    if (lowerStatus.includes('ok') || lowerStatus.includes('normal')) {
      return 'var(--success-color, #4CAF50)';
    }

    return 'var(--info-color, #2196F3)';
  }

  protected render(): TemplateResult {
    if (!this.raw) {
      return html``;
    }

    // Handle array input
    if (Array.isArray(this.raw)) {
      const statuses = this.parseArray(this.raw);
      if (statuses.length === 0) return html``;

      return html` <div class="detail-status-list ${this.compact ? 'compact' : ''}"> ${statuses.map( (status) => html`
              <div class="status-item" style="color: ${this.getColorForStatus(status)}">
                <ha-icon icon="${this.icon || this.getIconForStatus(status)}"></ha-icon>
                <span class="status-text">${status}</span>
              </div>
            `
          )}
        </div>
      `;
    }

    // Handle pipe-separated string
    const parsed = this.parsePipeSeparated(this.raw);
    if (!parsed.status) return html``;

    const statusColor = this.getColorForStatus(parsed.status);
    const statusIcon = this.icon || this.getIconForStatus(parsed.status);

    return html` <div class="detail-status ${this.compact ? 'compact' : ''}" style="color: ${statusColor}"><ha-icon icon="${statusIcon}"></ha-icon><div class="status-content"> ${parsed.level !== undefined ? html`<span class="level">Level ${parsed.level}:</span>`
            : ''}
          <span class="status-text">${parsed.status}</span>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`:host{display:block}.detail-status{display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--card-background-color);border-radius:8px;border-left:3px solid currentColor;font-size:14px;line-height:1.4}.detail-status.compact{padding:4px 8px;font-size:12px}.detail-status ha-icon{--mdc-icon-size:20px;flex-shrink:0}.detail-status.compact ha-icon{--mdc-icon-size:16px}.status-content{display:flex;flex-wrap:wrap;align-items:center;gap:4px;flex:1}.level{font-weight:600;opacity:0.9}.status-text{font-weight:500}.detail-status-list{display:flex;flex-direction:column;gap:6px}.detail-status-list.compact{gap:4px}.status-item{display:flex;align-items:center;gap:6px;padding:6px 10px;background:var(--card-background-color);border-radius:6px;border-left:2px solid currentColor;font-size:13px}.detail-status-list.compact .status-item{padding:4px 8px;font-size:11px}.status-item ha-icon{--mdc-icon-size:16px;flex-shrink:0}.detail-status-list.compact .status-item ha-icon{--mdc-icon-size:14px}.status-item .status-text{font-weight:500}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'detail-status': DetailStatus;
  }
}
