/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Component: Quick Actions – Schnellzugriff auf häufige Pool-Steuerbefehle
 * Erstellt von Xerolux | MIT License
 */

import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import { i18n } from '../utils/i18n';
import { injectModalStyles } from '../styles/modal-styles';

export interface QuickAction {
  icon: string;
  label: string;
  action: () => Promise<void> | void;
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  color?: string;
  confirmMessage?: string;
}

export class QuickActions extends LitElement {
  @property({ type: Array }) public actions: QuickAction[] = [];
  @property({ type: Boolean }) public vertical = false;
  @property({ type: Boolean }) public compact = false;
  @state() private loadingStates: Map<number, boolean> = new Map();

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    // Clear any pending loading states when removed from DOM
    this.loadingStates.clear();
  }

  private async handleActionClick(action: QuickAction, index: number) {
    if (action.disabled || this.loadingStates.get(index)) {
      return;
    }

    // Show confirmation if needed
    if (action.confirmMessage) {
      const confirmed = await this.showConfirmation(action.confirmMessage);
      if (!confirmed) {
        return;
      }
    }

    // Set loading state
    this.loadingStates.set(index, true);
    this.requestUpdate();

    try {
      // Execute action
      await action.action();

      // Dispatch event
      this.dispatchEvent(
        new CustomEvent('action-executed', {
          detail: { action, index },
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      console.error('Quick action failed:', error);

      // Dispatch error event
      this.dispatchEvent(
        new CustomEvent('action-error', {
          detail: { action, index, error },
          bubbles: true,
          composed: true,
        })
      );
    } finally {
      // Clear loading state (skip the update if we were removed mid-flight)
      this.loadingStates.set(index, false);
      if (this.isConnected) {
        this.requestUpdate();
      }
    }
  }

  private async showConfirmation(message: string): Promise<boolean> {
    // The dialog lives in the light DOM (document.body), so its styles must
    // be available globally — inject them once.
    injectModalStyles();

    return new Promise<boolean>((resolve) => {
      const previousFocus = document.activeElement as HTMLElement | null;

      const overlay = document.createElement('div');
      overlay.className = 'vpc-confirmation-overlay';

      const dialog = document.createElement('div');
      dialog.className = 'vpc-confirmation-dialog';
      dialog.setAttribute('role', 'alertdialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('aria-label', message);

      // Build DOM safely — no innerHTML to prevent XSS
      const content = document.createElement('div');
      content.className = 'vpc-confirmation-content';

      const msgEl = document.createElement('p');
      msgEl.className = 'vpc-confirmation-message';
      msgEl.textContent = message; // safe: textContent, not innerHTML

      const buttons = document.createElement('div');
      buttons.className = 'vpc-confirmation-buttons';

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'vpc-btn-cancel';
      cancelBtn.textContent = i18n.t('cancel');

      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'vpc-btn-confirm';
      confirmBtn.textContent = i18n.t('confirm');

      buttons.appendChild(cancelBtn);
      buttons.appendChild(confirmBtn);
      content.appendChild(msgEl);
      content.appendChild(buttons);
      dialog.appendChild(content);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      const cleanup = () => {
        document.removeEventListener('keydown', handleKeydown);
        overlay.remove();
        previousFocus?.focus?.();
      };

      const handleResolve = (value: boolean) => {
        cleanup();
        resolve(value);
      };

      cancelBtn.addEventListener('click', () => handleResolve(false));
      confirmBtn.addEventListener('click', () => handleResolve(true));

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          handleResolve(false);
        }
      });

      // Keyboard support incl. simple focus trap between the two buttons.
      // Enter is intentionally not handled here: the browser already
      // "clicks" the focused button, so Enter on Cancel must cancel.
      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleResolve(false);
        } else if (e.key === 'Tab') {
          e.preventDefault();
          const next = document.activeElement === confirmBtn ? cancelBtn : confirmBtn;
          next.focus();
        }
      };

      document.addEventListener('keydown', handleKeydown);

      // Focus cancel button by default — safer for destructive actions
      cancelBtn.focus();
    });
  }

  private renderAction(action: QuickAction, index: number): TemplateResult {
    const isLoading = this.loadingStates.get(index) || action.loading;
    const isDisabled = action.disabled || isLoading;

    return html` <button class="quick-action ${action.active ? 'active' : ''} ${isDisabled ? 'disabled' : ''} ${isLoading ? 'loading' : ''}" @click="${() => this.handleActionClick(action, index)}" ?disabled="${isDisabled}" style="${action.color ? `--action-color: ${action.color}` : ''}"
        title="${action.label}"
        aria-label="${action.label}"
        aria-busy="${isLoading ? 'true' : 'false'}"
        aria-disabled="${isDisabled ? 'true' : 'false'}"
      >
        <div class="action-content">
          ${isLoading
            ? html`<ha-icon icon="mdi:loading" class="spin"></ha-icon>`
            : html`<ha-icon icon="${action.icon}"></ha-icon>`}
          ${!this.compact ? html`<span class="action-label">${action.label}</span>` : ''}
        </div>
      </button>
    `;
  }

  protected render(): TemplateResult {
    if (this.actions.length === 0) {
      return html``;
    }

    return html` <div class="quick-actions ${this.vertical ? 'vertical' : ''} ${this.compact ? 'compact' : ''}"> ${this.actions.map((action, index) => this.renderAction(action, index))} </div> `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      .quick-actions {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .quick-actions.vertical {
        flex-direction: column;
      }

      .quick-actions.compact {
        gap: 4px;
      }

      .quick-action {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 10px;
        border: 2px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 8px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }

      .quick-actions.compact .quick-action {
        padding: 8px;
        min-width: 48px;
        min-height: 48px;
      }

      .quick-action:hover:not(.disabled) {
        background: var(--divider-color, rgba(0, 0, 0, 0.05));
        border-color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .quick-action:active:not(.disabled) {
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      }

      .quick-action.active {
        background: var(--action-color, var(--primary-color));
        border-color: var(--action-color, var(--primary-color));
        color: white;
      }

      .quick-action.active:hover:not(.disabled) {
        background: var(--action-color, var(--primary-color));
        opacity: 0.9;
      }

      .quick-action.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .quick-action.loading {
        pointer-events: none;
      }

      .action-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        width: 100%;
      }

      .quick-actions.compact .action-content {
        gap: 0;
      }

      .quick-action ha-icon {
        --mdc-icon-size: 20px;
        flex-shrink: 0;
      }

      .quick-actions.compact .quick-action ha-icon {
        --mdc-icon-size: 24px;
      }

      .action-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .spin {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .quick-action::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }

      .quick-action:active:not(.disabled)::before {
        width: 200%;
        height: 200%;
      }

      @media (pointer: coarse) {
        .quick-action {
          min-height: 44px;
        }
      }

      @media (max-width: 600px) {
        .quick-actions:not(.vertical) {
          flex-direction: column;
        }
        .quick-action {
          width: 100%;
        }
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vpc-quick-actions': QuickActions;
  }
}


if (!customElements.get('vpc-quick-actions')) {
  customElements.define('vpc-quick-actions', QuickActions);
}
