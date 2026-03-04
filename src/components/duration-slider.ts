import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class DurationSlider extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 86400;
  @property({ type: Number }) step = 1;
  @property({ type: String }) label = 'Duration';
  @property({ type: String }) unit = 's';
  @property({ type: Boolean }) showPresets = true;

  static register() {
    customElements.define('vpc-duration-slider', DurationSlider);
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
      gap: 12px;
      padding: 8px 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .label {
      font-size: 12px;
      font-weight: 600;
      color: var(--vpc-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .value-display {
      font-size: 14px;
      font-weight: 600;
      color: var(--vpc-primary);
    }

    .slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: var(--vpc-surface);
      outline: none;
      -webkit-appearance: none;
      appearance: none;
      cursor: pointer;
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--vpc-primary);
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
    }

    .slider::-webkit-slider-thumb:active {
      transform: scale(1.2);
    }

    .slider::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--vpc-primary);
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
    }

    .slider::-moz-range-thumb:active {
      transform: scale(1.2);
    }

    .presets {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
      gap: 6px;
    }

    .preset-btn {
      padding: 8px 10px;
      border: 1px solid var(--vpc-surface);
      border-radius: 8px;
      background: var(--vpc-surface);
      color: var(--vpc-text-secondary);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.18s ease;
      border-color: transparent;
    }

    .preset-btn:hover {
      background: color-mix(in srgb, var(--vpc-primary) 8%, var(--vpc-surface));
      color: var(--vpc-primary);
    }

    .preset-btn.active {
      background: color-mix(in srgb, var(--vpc-primary) 12%, transparent);
      color: var(--vpc-primary);
      border-color: color-mix(in srgb, var(--vpc-primary) 30%, transparent);
      font-weight: 600;
    }
  `;

  private presets = [
    { label: '5s', value: 5 },
    { label: '30s', value: 30 },
    { label: '60s', value: 60 },
    { label: '5m', value: 300 },
    { label: '30m', value: 1800 },
    { label: '1h', value: 3600 },
  ];

  private formatValue(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  }

  private handleSliderChange(e: Event) {
    const value = parseInt((e.target as HTMLInputElement).value, 10);
    this.value = value;
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value } }));
  }

  private handlePresetClick(presetValue: number) {
    this.value = presetValue;
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: presetValue } }));
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <span class="label">${this.label}</span>
          <span class="value-display">${this.formatValue(this.value)}</span>
        </div>

        <input
          type="range"
          class="slider"
          .min="${this.min}"
          .max="${this.max}"
          .step="${this.step}"
          .value="${this.value}"
          @input="${this.handleSliderChange}"
        />

        ${this.showPresets
          ? html`
              <div class="presets">
                ${this.presets.map(
                  preset => html`
                    <button
                      class="preset-btn ${this.value === preset.value ? 'active' : ''}"
                      @click="${() => this.handlePresetClick(preset.value)}"
                    >
                      ${preset.label}
                    </button>
                  `
                )}
              </div>
            `
          : ''}
      </div>
    `;
  }
}

DurationSlider.register();
