import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class SafetyToggle extends LitElement {
  @property({ type: Boolean }) checked = false;
  @property({ type: String }) label = 'Safety Override';
  @property({ type: String }) description = '';

  static register() {
    customElements.define('vpc-safety-toggle', SafetyToggle);
  }

  static styles = css`
    :host {
      --vpc-primary: var(--primary-color, #007AFF);
      --vpc-danger: #FF3B30;
      --vpc-surface: rgba(120, 120, 128, 0.06);
      --vpc-text: var(--primary-text-color, #1C1C1E);
      --vpc-text-secondary: var(--secondary-text-color, #6D6D72);
    }

    .container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 10px;
      background: var(--vpc-surface);
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .container:hover {
      background: color-mix(in srgb, var(--vpc-primary) 8%, var(--vpc-surface));
    }

    .toggle-switch {
      display: flex;
      align-items: center;
      width: 44px;
      height: 24px;
      border-radius: 12px;
      background: #ccc;
      position: relative;
      flex-shrink: 0;
      transition: background 0.3s ease;
      cursor: pointer;
    }

    .toggle-switch.checked {
      background: var(--vpc-danger);
    }

    .toggle-thumb {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      top: 2px;
      left: 2px;
      transition: left 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .toggle-switch.checked .toggle-thumb {
      left: 22px;
    }

    .text-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .label {
      font-size: 13px;
      font-weight: 500;
      color: var(--vpc-text);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .warning-icon {
      --mdc-icon-size: 16px;
      color: var(--vpc-danger);
    }

    .description {
      font-size: 12px;
      color: var(--vpc-text-secondary);
      line-height: 1.3;
    }

    .alert {
      padding: 6px 8px;
      border-radius: 6px;
      background: color-mix(in srgb, var(--vpc-danger) 10%, transparent);
      border-left: 3px solid var(--vpc-danger);
      margin-top: 8px;
    }

    .alert-text {
      font-size: 11px;
      font-weight: 500;
      color: var(--vpc-danger);
    }
  `;

  private handleToggle(e: Event) {
    e.stopPropagation();
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('toggle-changed', { detail: { checked: this.checked } }));
  }

  render() {
    return html`
      <div class="container" @click="${this.handleToggle}">
        <div class="toggle-switch ${this.checked ? 'checked' : ''}">
          <div class="toggle-thumb"></div>
        </div>

        <div class="text-content">
          <div class="label">
            ${this.checked ? html`<ha-icon class="warning-icon" icon="mdi:alert"></ha-icon>` : ''}
            ${this.label}
          </div>
          ${this.description ? html`<div class="description">${this.description}</div>` : ''}
        </div>

        ${this.checked
          ? html`
              <div class="alert">
                <div class="alert-text">⚠️ Safety interval override active</div>
              </div>
            `
          : ''}
      </div>
    `;
  }
}

SafetyToggle.register();
