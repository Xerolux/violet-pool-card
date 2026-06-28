/**
 * Violet Pool Card – System Update Component
 * © 2026 Xerolux
 *
 * Display firmware update status and trigger installation
 */

import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { property } from 'lit/decorators.js';

export interface UpdateInfo {
  installed_version: string;
  available_version: string | null;
  update_available: boolean;
  release_notes: string | null;
  carrier_version: string | null;
  message: string | null;
}

export class SystemUpdate extends LitElement {
  @property({ type: Object }) updateInfo: UpdateInfo | null = null;
  @property({ type: String }) deviceName: string = '';
  @property({ type: Object }) hass: any;
  @property({ type: Boolean }) isInstalling: boolean = false;

  protected render(): TemplateResult {
    if (!this.updateInfo) {
      return html`
        <div class="empty-state">
          <div class="empty-icon">⏳</div>
          <div class="empty-text">Loading Update Status...</div>
        </div>
      `;
    }

    return html`
      <div class="system-update">
        <div class="status-header">
          <div class="header-title">⬆️ System Firmware</div>
          <div class="header-device">${this.deviceName}</div>
        </div>

        <div class="update-card ${this.updateInfo.update_available ? 'update-available' : 'up-to-date'}">
          <div class="card-header">
            <div class="version-info">
              <div class="installed-label">Installed Version</div>
              <div class="installed-version">${this.updateInfo.installed_version}</div>
            </div>
            ${this.updateInfo.update_available
              ? html`
                <div class="update-badge">🔄 Update Available</div>
              `
              : html`
                <div class="uptodate-badge">✅ Up to Date</div>
              `
            }
          </div>

          ${this.updateInfo.available_version
            ? html`
              <div class="available-section">
                <div class="available-label">Available Version</div>
                <div class="available-version">${this.updateInfo.available_version}</div>
              </div>
            `
            : ''
          }

          ${this.updateInfo.carrier_version
            ? html`
              <div class="carrier-info">
                <span class="label">Carrier Firmware:</span>
                <span class="value">${this.updateInfo.carrier_version}</span>
              </div>
            `
            : ''
          }

          ${this.updateInfo.message
            ? html`
              <div class="message-banner">
                <span class="message-text">${this.updateInfo.message}</span>
              </div>
            `
            : ''
          }

          ${this.updateInfo.release_notes
            ? html`
              <div class="release-notes">
                <div class="notes-title">📋 Release Notes</div>
                <div class="notes-content">${unsafeHTML(this.sanitizeHtml(this.updateInfo.release_notes))}</div>
              </div>
            `
            : ''
          }

          ${this.updateInfo.update_available
            ? html`
              <div class="action-buttons">
                <button
                  class="install-button"
                  @click="${this.handleInstall}"
                  ?disabled="${this.isInstalling}"
                >
                  ${this.isInstalling
                    ? html`<span class="spinner"></span> Installing...`
                    : html`⬇️ Install Update`
                  }
                </button>
                <div class="install-notice">
                  ⏱️ Installation takes ~30 seconds. Controller will restart automatically.
                </div>
              </div>
            `
            : ''
          }
        </div>
      </div>
    `;
  }

  private async handleInstall(): Promise<void> {
    if (!this.hass || !this.updateInfo) return;

    this.isInstalling = true;

    try {
      // Call the HA update service
      await this.hass.callService('update', 'install', {
        entity_id: `update.violet_pool_controller_system`,
      });

      // Show success notification
      this.hass.callService('persistent_notification', 'create', {
        title: 'Firmware Update Started',
        message: 'Your Violet Pool Controller is updating. This takes about 30 seconds.',
        notification_id: 'violet_update_start',
      });
    } catch (error) {
      console.error('Update installation failed:', error);

      // Show error notification
      this.hass.callService('persistent_notification', 'create', {
        title: 'Update Failed',
        message: `Failed to install update: ${error instanceof Error ? error.message : String(error)}`,
        notification_id: 'violet_update_error',
      });
    } finally {
      this.isInstalling = false;
    }
  }

  private sanitizeHtml(input: string): string {
    let sanitized = input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
    return sanitized;
  }

  static styles: CSSResultGroup = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .empty-text {
      font-size: 14px;
    }

    .system-update {
      background: linear-gradient(135deg, rgba(100, 200, 255, 0.08) 0%, rgba(100, 150, 255, 0.04) 100%);
      border: 1px solid rgba(100, 150, 255, 0.2);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-title {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
    }

    .header-device {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }

    .update-card {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(100, 150, 255, 0.2);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: all 0.2s ease;
    }

    .update-card.update-available {
      border-color: rgba(0, 180, 255, 0.4);
      background: rgba(0, 180, 255, 0.08);
    }

    .update-card.up-to-date {
      border-color: rgba(100, 255, 100, 0.3);
      background: rgba(100, 255, 100, 0.05);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .version-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .installed-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .installed-version {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      font-family: 'Monaco', 'Courier New', monospace;
    }

    .update-badge {
      padding: 8px 12px;
      background: rgba(0, 180, 255, 0.3);
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      color: #00B4FF;
      animation: pulse 2s ease-in-out infinite;
      white-space: nowrap;
    }

    .uptodate-badge {
      padding: 8px 12px;
      background: rgba(100, 255, 100, 0.3);
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      color: #64FF64;
      white-space: nowrap;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }

    .available-section {
      padding: 12px;
      background: rgba(0, 180, 255, 0.1);
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .available-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .available-version {
      font-size: 16px;
      font-weight: 700;
      color: #00B4FF;
      font-family: 'Monaco', 'Courier New', monospace;
    }

    .carrier-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      padding: 8px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .label {
      color: rgba(255, 255, 255, 0.6);
      font-weight: 500;
    }

    .value {
      color: rgba(255, 255, 255, 0.9);
      font-weight: 600;
      font-family: 'Monaco', 'Courier New', monospace;
    }

    .message-banner {
      padding: 12px;
      background: rgba(255, 180, 0, 0.1);
      border-left: 3px solid rgba(255, 180, 0, 0.6);
      border-radius: 4px;
      font-size: 12px;
      color: rgba(255, 200, 100, 0.9);
    }

    .message-text {
      display: block;
      font-weight: 600;
    }

    .release-notes {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: rgba(100, 150, 200, 0.08);
      border-radius: 6px;
      border: 1px solid rgba(100, 150, 200, 0.2);
    }

    .notes-title {
      font-size: 12px;
      font-weight: 700;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .notes-content {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.5;
      max-height: 200px;
      overflow-y: auto;
    }

    .notes-content strong {
      color: #fff;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 8px;
    }

    .install-button {
      padding: 12px 16px;
      background: linear-gradient(135deg, #00B4FF 0%, #0080CC 100%);
      border: none;
      border-radius: 6px;
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .install-button:hover:not(:disabled) {
      background: linear-gradient(135deg, #00D4FF 0%, #00A0FF 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 180, 255, 0.3);
    }

    .install-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .install-notice {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      font-style: italic;
    }

    @media (max-width: 600px) {
      .system-update {
        padding: 16px;
      }

      .card-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .installed-version {
        font-size: 16px;
      }

      .available-version {
        font-size: 14px;
      }
    }
  `;
}

customElements.define('system-update', SystemUpdate);
