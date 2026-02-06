import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface SliderLabel {
  value: number;
  label: string;
}

@customElement('slider-control')
export class SliderControl extends LitElement {
  @property({ type: Number }) public min = 0;
  @property({ type: Number }) public max = 100;
  @property({ type: Number }) public step = 1;
  @property({ type: Number }) public value = 0;
  @property() public unit = '';
  @property() public label = '';
  @property({ type: Array }) public labels?: SliderLabel[] | string[];
  @property({ type: Boolean }) public disabled = false;
  @property({ type: Boolean }) public vertical = false;
  @property({ type: Boolean }) public showValue = true;
  @property({ type: Boolean }) public showMinMax = false;

  @state() private isDragging = false;
  @state() private localValue = 0;

  // Debounce timer for value changes
  private debounceTimer?: number;
  private debounceDelay = 300; // ms

  connectedCallback() {
    super.connectedCallback();
    this.localValue = this.value;
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('value') && !this.isDragging) {
      this.localValue = this.value;
    }
  }

  /**
   * Handle slider input (during drag)
   */
  private handleInput(e: Event) {
    const value = Number((e.target as HTMLInputElement).value);
    this.localValue = value;
    this.isDragging = true;

    // Dispatch input event for live updates (no debounce)
    this.dispatchEvent(
      new CustomEvent('slider-input', {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle slider change (after drag or click)
   */
  private handleChange(e: Event) {
    const value = Number((e.target as HTMLInputElement).value);
    this.localValue = value;
    this.isDragging = false;

    // Clear existing debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Debounce the value-changed event
    this.debounceTimer = window.setTimeout(() => {
      this.dispatchEvent(
        new CustomEvent('value-changed', {
          detail: { value },
          bubbles: true,
          composed: true,
        })
      );
    }, this.debounceDelay);
  }

  /**
   * Handle mouse/touch start
   */
  private handleStart() {
    this.isDragging = true;
  }

  /**
   * Handle mouse/touch end
   */
  private handleEnd() {
    this.isDragging = false;
  }

  /**
   * Get label for a specific value
   */
  private getLabelForValue(value: number): string {
    if (!this.labels || this.labels.length === 0) {
      return '';
    }

    // If labels is array of strings, map to values
    if (typeof this.labels[0] === 'string') {
      const index = Math.round((value - this.min) / this.step);
      return (this.labels as string[])[index] || '';
    }

    // If labels is array of SliderLabel objects
    const sliderLabels = this.labels as SliderLabel[];
    const label = sliderLabels.find((l) => l.value === value);
    return label ? label.label : '';
  }

  /**
   * Get all labels for display
   */
  private getAllLabels(): Array<{ value: number; label: string; position: number }> {
    if (!this.labels || this.labels.length === 0) {
      return [];
    }

    const range = this.max - this.min;

    // If labels is array of strings
    if (typeof this.labels[0] === 'string') {
      return (this.labels as string[]).map((label, index) => {
        const value = this.min + index * this.step;
        const position = ((value - this.min) / range) * 100;
        return { value, label, position };
      });
    }

    // If labels is array of SliderLabel objects
    return (this.labels as SliderLabel[]).map((item) => {
      const position = ((item.value - this.min) / range) * 100;
      return { value: item.value, label: item.label, position };
    });
  }

  /**
   * Format value for display
   */
  private formatValue(value: number): string {
    // Check if we have a label for this value
    const label = this.getLabelForValue(value);
    if (label) {
      return label;
    }

    // Otherwise format as number
    const decimals = this.step < 1 ? 1 : 0;
    return `${value.toFixed(decimals)}${this.unit}`;
  }

  protected render(): TemplateResult {
    const percentage = ((this.localValue - this.min) / (this.max - this.min)) * 100;
    const allLabels = this.getAllLabels();

    return html`
      <div class="slider-container ${this.vertical ? 'vertical' : ''} ${this.disabled ? 'disabled' : ''}">
        ${this.label ? html`<div class="slider-label">${this.label}</div>` : ''}

        ${this.showValue
          ? html`
              <div class="value-display ${this.isDragging ? 'dragging' : ''}">
                ${this.formatValue(this.localValue)}
              </div>
            `
          : ''}

        <div class="slider-wrapper">
          ${this.showMinMax
            ? html`<span class="min-max-label">${this.formatValue(this.min)}</span>`
            : ''}

          <div class="slider-track-wrapper">
            <input
              type="range"
              class="slider"
              min="${this.min}"
              max="${this.max}"
              step="${this.step}"
              .value="${this.localValue.toString()}"
              ?disabled="${this.disabled}"
              @input="${this.handleInput}"
              @change="${this.handleChange}"
              @mousedown="${this.handleStart}"
              @mouseup="${this.handleEnd}"
              @touchstart="${this.handleStart}"
              @touchend="${this.handleEnd}"
              style="--percentage: ${percentage}%"
            />
          </div>

          ${this.showMinMax
            ? html`<span class="min-max-label">${this.formatValue(this.max)}</span>`
            : ''}
        </div>

        ${allLabels.length > 0
          ? html`
              <div class="labels">
                ${allLabels.map(
                  (item) => html`
                    <span
                      class="label-item ${this.localValue === item.value ? 'active' : ''}"
                      style="left: ${item.position}%"
                      @click="${() => !this.disabled && this.handleChange({ target: { value: item.value } } as any)}"
                    >
                      ${item.label}
                    </span>
                  `
                )}
              </div>
            `
          : ''}
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host{display:block}
      .slider-container{width:100%;user-select:none}
      .slider-container.disabled{opacity:0.5;pointer-events:none}
      .slider-label{font-size:12px;font-weight:500;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px}
      .value-display{text-align:center;font-size:28px;font-weight:700;margin-bottom:12px;color:var(--primary-text-color);transition:all 0.2s ease}
      .value-display.dragging{color:var(--primary-color);transform:scale(1.05)}
      .slider-wrapper{display:flex;align-items:center;gap:12px;padding:8px 0}
      .min-max-label{font-size:11px;color:var(--secondary-text-color);min-width:40px;text-align:center}
      .slider-track-wrapper{flex:1;position:relative}
      .slider{width:100%;height:8px;-webkit-appearance:none;appearance:none;background:linear-gradient(to right,var(--primary-color) 0%,var(--primary-color) var(--percentage),var(--disabled-color,#e0e0e0) var(--percentage),var(--disabled-color,#e0e0e0) 100%);border-radius:4px;outline:none;cursor:pointer;transition:opacity 0.2s}
      .slider:hover{opacity:0.9}
      .slider:disabled{cursor:not-allowed}
      .slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:24px;height:24px;border-radius:50%;background:var(--primary-color);cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.2);transition:all 0.2s ease;border:3px solid white}
      .slider::-webkit-slider-thumb:hover{transform:scale(1.1);box-shadow:0 3px 8px rgba(0,0,0,0.3)}
      .slider:active::-webkit-slider-thumb{transform:scale(1.15);box-shadow:0 4px 12px rgba(0,0,0,0.4)}
      .slider::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:var(--primary-color);cursor:pointer;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);transition:all 0.2s ease}
      .slider::-moz-range-thumb:hover{transform:scale(1.1);box-shadow:0 3px 8px rgba(0,0,0,0.3)}
      .slider:active::-moz-range-thumb{transform:scale(1.15);box-shadow:0 4px 12px rgba(0,0,0,0.4)}
      .slider::-moz-range-track{background:transparent;border:none}
      .labels{position:relative;display:flex;justify-content:space-between;margin-top:12px;font-size:11px;color:var(--secondary-text-color)}
      .label-item{position:absolute;transform:translateX(-50%);cursor:pointer;padding:4px 8px;border-radius:4px;transition:all 0.2s ease;white-space:nowrap}
      .label-item:hover{background:var(--divider-color,rgba(0,0,0,0.05));color:var(--primary-text-color)}
      .label-item.active{font-weight:600;color:var(--primary-color)}
      .slider-container.vertical .slider{transform:rotate(-90deg);transform-origin:left center}
      @media(pointer:coarse){.slider::-webkit-slider-thumb{width:28px;height:28px}.slider::-moz-range-thumb{width:28px;height:28px}}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'slider-control': SliderControl;
  }
}
