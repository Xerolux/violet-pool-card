import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export interface ActionOption {
  value: string;
  label: string;
  icon: string;
  color?: string;
  description?: string;
}

export class ActionSelector extends LitElement {
  @property({ type: String }) value: string = '';
  @property({ type: Array }) options: ActionOption[] = [];
  @property({ type: String }) label = 'Action';
  @property({ type: String }) mode: 'buttons' | 'dropdown' = 'buttons';

  static register() {
    customElements.define('vpc-action-selector', ActionSelector);
  }

  static styles = css`
    :host {
      --vpc-primary: var(--primary-color, #007AFF);
      --vpc-surface: rgba(120, 120, 128, 0.06);
      --vpc-text: var(--primary-text-color, #1C1C1E);
      --vpc-text-secondary: var(--secondary-text-color, #6D6D72);
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .label {
      font-size: 12px;
      font-weight: 600;
      color: var(--vpc-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.4px;
      padding: 0 2px;
    }

    .button-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
      gap: 6px;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 10px 8px;
      border: 1.5px solid transparent;
      border-radius: 10px;
      background: var(--vpc-surface);
      color: var(--vpc-text-secondary);
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }

    .action-btn:hover {
      background: color-mix(in srgb, var(--vpc-primary) 10%, var(--vpc-surface));
      border-color: color-mix(in srgb, var(--vpc-primary) 20%, transparent);
    }

    .action-btn.active {
      background: color-mix(in srgb, var(--vpc-primary) 15%, transparent);
      color: var(--vpc-primary);
      border-color: color-mix(in srgb, var(--vpc-primary) 40%, transparent);
      font-weight: 600;
    }

    .action-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    .dropdown {
      padding: 10px 12px;
      border: 1px solid var(--vpc-surface);
      border-radius: 8px;
      background: var(--vpc-surface);
      color: var(--vpc-text);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .dropdown:hover {
      border-color: color-mix(in srgb, var(--vpc-primary) 30%, transparent);
    }

    .dropdown:focus {
      outline: none;
      border-color: var(--vpc-primary);
      background: color-mix(in srgb, var(--vpc-primary) 8%, var(--vpc-surface));
    }

    .dropdown option {
      background: var(--vpc-text);
      color: var(--vpc-surface);
    }
  `;

  private handleButtonClick(value: string) {
    this.value = value;
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value } }));
  }

  private handleDropdownChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this.value = value;
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value } }));
  }

  render() {
    return html`
      <div class="container">
        ${this.label ? html`<span class="label">${this.label}</span>` : ''}

        ${this.mode === 'buttons'
          ? html`
              <div class="button-group">
                ${this.options.map(
                  option => html`
                    <button
                      class="action-btn ${this.value === option.value ? 'active' : ''}"
                      @click="${() => this.handleButtonClick(option.value)}"
                      title="${option.description || option.label}"
                      aria-label="${option.label}"
                      aria-pressed="${this.value === option.value ? 'true' : 'false'}"
                    >
                      <ha-icon icon="${option.icon}"></ha-icon>
                      <span>${option.label}</span>
                    </button>
                  `
                )}
              </div>
            `
          : html`
              <select class="dropdown" .value="${this.value}" @change="${this.handleDropdownChange}" aria-label="${this.label || 'Action'}">
                <option value="">-- Select --</option>
                ${this.options.map(
                  option => html`<option value="${option.value}">${option.label}</option>`
                )}
              </select>
            `}
      </div>
    `;
  }
}

ActionSelector.register();
