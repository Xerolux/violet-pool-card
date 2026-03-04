import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class SpeedSlider extends LitElement {
  @property({ type: Number }) value = 1;
  @property({ type: String }) label = 'Speed';
  @property({ type: Boolean }) showLabels = true;

  static register() {
    customElements.define('vpc-speed-slider', SpeedSlider);
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
      padding: 8px 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    .slider-track {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      height: 40px;
    }

    .slider-segment {
      flex: 1;
      background: var(--vpc-surface);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 12px;
      border: 1px solid transparent;
    }

    .slider-segment:hover {
      background: color-mix(in srgb, var(--vpc-primary) 10%, var(--vpc-surface));
    }

    .slider-segment.active {
      background: var(--vpc-primary);
      border-color: var(--vpc-primary);
    }

    .slider-segment.past {
      background: color-mix(in srgb, var(--vpc-primary) 6%, var(--vpc-surface));
    }

    .speed-1 {
      height: 20%;
    }

    .speed-2 {
      height: 50%;
    }

    .speed-3 {
      height: 100%;
    }

    .labels {
      display: flex;
      justify-content: space-around;
      gap: 8px;
      margin-top: 6px;
    }

    .speed-label {
      flex: 1;
      text-align: center;
      font-size: 11px;
      font-weight: 500;
      color: var(--vpc-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .speed-label.active {
      color: var(--vpc-primary);
      font-weight: 600;
    }
  `;

  private speedLabels = ['Eco', 'Normal', 'Boost'];
  private speedDescriptions = [
    'Eco - Energy efficient',
    'Normal - Standard operation',
    'Boost - Maximum power',
  ];

  private handleSegmentClick(speed: number) {
    this.value = speed;
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: speed } }));
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <span class="label">${this.label}</span>
          <span class="value-display">${this.speedLabels[this.value - 1]}</span>
        </div>

        <div class="slider-track">
          ${[1, 2, 3].map(
            speed => html`
              <div
                class="slider-segment speed-${speed} ${this.value === speed ? 'active' : this.value > speed ? 'past' : ''}"
                @click="${() => this.handleSegmentClick(speed)}"
                title="${this.speedDescriptions[speed - 1]}"
              ></div>
            `
          )}
        </div>

        ${this.showLabels
          ? html`
              <div class="labels">
                ${[1, 2, 3].map(
                  speed => html`
                    <div class="speed-label ${this.value === speed ? 'active' : ''}">
                      ${this.speedLabels[speed - 1]}
                    </div>
                  `
                )}
              </div>
            `
          : ''}
      </div>
    `;
  }
}

SpeedSlider.register();
