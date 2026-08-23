/**
 * Violet Pool Card – Error Dashboard Component
 * © 2026 Xerolux
 *
 * Comprehensive error display with severity levels, error codes, and recovery suggestions
 */

import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { ServiceCaller } from '../utils/service-caller';
import { VIOLET_PLATFORM, type RegistryDisplayEntry } from '../utils/entity-registry';

export interface PoolError {
  code: number;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  type: 'message' | 'alert' | 'error';
  timestamp: Date;
  device: string;
  suggestion?: string;
  context?: Record<string, unknown>;
}

// Complete Error Code Mapping from Firmware Analysis
const ERROR_CODE_MAP: Record<number, { message: string; severity: 'info' | 'warning' | 'critical'; suggestion: string }> = {
  // Pump Errors (1000-1099)
  1001: { message: 'Pump Runtime Exceeded', severity: 'warning', suggestion: 'Check pump runtime settings or reset' },
  1002: { message: 'Pump Anti-Freeze Activated', severity: 'info', suggestion: 'System protecting against frost – normal in winter' },
  1003: { message: 'Pump Flow Sensor Fault', severity: 'critical', suggestion: 'Check pump flow sensor connection' },
  1004: { message: 'Pump Blockage Detected', severity: 'critical', suggestion: 'Clear pump intake or check filter pressure' },

  // Heater Errors (2000-2099)
  2001: { message: 'Heater Target Temperature Unreachable', severity: 'warning', suggestion: 'Lower target temp or check heater power' },
  2002: { message: 'Heat Exchanger Overtemperature', severity: 'critical', suggestion: 'Reduce water flow or check HX scaling' },
  2003: { message: 'Boiler Overpressure', severity: 'critical', suggestion: 'Check pressure relief valve' },
  2004: { message: 'Heater Timeout', severity: 'warning', suggestion: 'Increase heater timeout or check fuel supply' },

  // Solar Errors (3000-3099)
  3001: { message: 'Solar Collector Temperature Sensor Fault', severity: 'warning', suggestion: 'Check solar collector sensor' },
  3002: { message: 'Solar Pump Failure', severity: 'critical', suggestion: 'Check solar pump power and connections' },
  3003: { message: 'Solar Fluid Pressure Low', severity: 'warning', suggestion: 'Refill solar fluid or check for leaks' },
  3004: { message: 'Solar Anti-Freeze Triggered', severity: 'info', suggestion: 'Normal protection in cold weather' },

  // Dosing Errors (4000-4099)
  4001: { message: 'pH- Pump Fault', severity: 'critical', suggestion: 'Check pH- pump power and tubing' },
  4002: { message: 'pH+ Pump Fault', severity: 'critical', suggestion: 'Check pH+ pump power and tubing' },
  4003: { message: 'Chlorine Pump Fault', severity: 'critical', suggestion: 'Check chlorine pump power and tubing' },
  4004: { message: 'Dosing Target Unreachable', severity: 'warning', suggestion: 'Check chemical availability or pump settings' },
  4005: { message: 'Flocculant Pump Fault', severity: 'critical', suggestion: 'Check flocculant pump power and tubing' },

  // Sensor Errors (5000-5099)
  5001: { message: 'pH Sensor Fault', severity: 'warning', suggestion: 'Recalibrate pH sensor or check electrode' },
  5002: { message: 'ORP Sensor Fault', severity: 'warning', suggestion: 'Recalibrate ORP sensor or check electrode' },
  5003: { message: 'Temperature Sensor Fault', severity: 'warning', suggestion: 'Check temperature sensor connection' },
  5004: { message: 'Conductivity Sensor Fault', severity: 'warning', suggestion: 'Check conductivity sensor or recalibrate' },
  5005: { message: 'Flow Meter Fault', severity: 'warning', suggestion: 'Check flow meter sensor' },

  // Refill Errors (6000-6099)
  6001: { message: 'Refill Water Level Too Low', severity: 'critical', suggestion: 'Add water to pool immediately' },
  6002: { message: 'Refill Pump Fault', severity: 'critical', suggestion: 'Check refill pump and water supply' },
  6003: { message: 'Refill Timeout', severity: 'warning', suggestion: 'Check water pressure or refill configuration' },
  6004: { message: 'Water Level Sensor Fault', severity: 'critical', suggestion: 'Check water level sensor' },

  // Overflow Errors (7000-7099)
  7001: { message: 'Water Level Critically High', severity: 'critical', suggestion: 'Drain pool immediately – overflow risk' },
  7002: { message: 'Overflow Pump Running', severity: 'info', suggestion: 'Overflow protection active – normal operation' },
  7003: { message: 'Dry-Run Protection Triggered', severity: 'info', suggestion: 'Water level very low – add water' },
  7004: { message: 'Bathing Detected', severity: 'info', suggestion: 'High water level change detected – normal during use' },

  // Network/Communication Errors (8000-8099)
  8001: { message: 'Connection Timeout', severity: 'warning', suggestion: 'Check network connection to controller' },
  8002: { message: 'Invalid Response', severity: 'warning', suggestion: 'Controller returned invalid data – retry' },
  8003: { message: 'Rate Limit Exceeded', severity: 'warning', suggestion: 'Too many requests – wait before retrying' },
  8004: { message: 'SSL/TLS Certificate Error', severity: 'warning', suggestion: 'Check certificate or disable verification' },

  // System Errors (9000-9099)
  9001: { message: 'Configuration Invalid', severity: 'critical', suggestion: 'Check controller configuration in web UI' },
  9002: { message: 'Firmware Mismatch', severity: 'warning', suggestion: 'Update controller firmware' },
  9003: { message: 'Storage Full', severity: 'critical', suggestion: 'Clear error logs or check SD card' },
  9004: { message: 'Internal Error', severity: 'critical', suggestion: 'Restart controller or contact support' },
};

interface ErrorStateEntity {
  state: string;
  last_updated?: string;
  attributes?: Record<string, unknown>;
}

const NO_ERROR_STATES = new Set([
  '', '0', 'none', 'no error', 'no errors', 'ok', 'unknown', 'unavailable',
  'keine fehler', 'kein fehler', '[]',
]);

export function discoverVioletErrors(
  states: Record<string, ErrorStateEntity>,
  registry?: Record<string, RegistryDisplayEntry>,
  includeLastError = false
): PoolError[] {
  const discovered: PoolError[] = [];

  for (const [entityId, entity] of Object.entries(states)) {
    if (!entityId.startsWith('sensor.')) continue;

    const registryEntry = registry?.[entityId];
    if (registryEntry?.platform) {
      if (registryEntry.platform !== VIOLET_PLATFORM) continue;
    } else if (!entityId.toLowerCase().includes('violet_pool')) {
      continue;
    }

    const lower = entityId.toLowerCase();
    const activeErrorSensor = lower.includes('active_errors') || lower.includes('active_error');
    const currentGermanErrorSensor = lower.includes('fehler') && !lower.includes('last');
    const historicalErrorSensor = includeLastError && lower.includes('last_error');
    if (!activeErrorSensor && !currentGermanErrorSensor && !historicalErrorSensor) continue;

    const attributes = entity.attributes || {};
    const reportedCount = Number(attributes.error_count);
    const reportedErrors = attributes.errors;
    if (reportedCount === 0 || (Array.isArray(reportedErrors) && reportedErrors.length === 0)) {
      continue;
    }

    const stateStr = String(entity.state || '').trim();
    if (NO_ERROR_STATES.has(stateStr.toLowerCase())) continue;

    const numCode = Number.parseInt(stateStr, 10);
    const code = Number.isFinite(numCode) && numCode > 0 ? numCode : 0;
    const mapped = code > 0 ? ERROR_CODE_MAP[code] : undefined;
    discovered.push({
      code,
      message: mapped?.message || stateStr,
      severity: mapped?.severity || 'warning',
      type: 'error',
      timestamp: new Date(entity.last_updated || Date.now()),
      device: String(attributes.friendly_name || 'Violet Pool Controller'),
      suggestion: mapped?.suggestion || 'Check controller web interface or reset blockings',
      context: attributes,
    });
  }

  return discovered;
}

export class ErrorDashboard extends LitElement {
  @property({ type: Array }) errors: PoolError[] = [];
  @property({ type: String }) view: 'current' | 'history' | 'stats' = 'current';
  @property({ type: Boolean }) showResolved: boolean = false;
  @property({ type: Object }) hass: any;

  private serviceCaller: any = null;

  connectedCallback() {
    super.connectedCallback();
    if (this.hass?.callService) {
      this.serviceCaller = new ServiceCaller(this.hass);
    }
  }

  private async clearAllErrors() {
    if (!this.serviceCaller) return;
    const confirmed = confirm('Clear all errors? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await this.serviceCaller.callService('violet_pool_controller', 'clear_error_history', {});
      this.errors = [];
      this.dispatchEvent(new CustomEvent('errors-cleared'));
    } catch (err) {
      console.error('Failed to clear errors:', err);
    }
  }

  private dismissError(errorIndex: number) {
    const error = this.errors[errorIndex];
    if (error) {
      this.errors = this.errors.filter((_, i) => i !== errorIndex);
      this.requestUpdate();
      this.dispatchEvent(new CustomEvent('error-dismissed', { detail: error }));
    }
  }

  private _getEffectiveErrors(): PoolError[] {
    if (this.errors.length > 0) {
      return this.errors;
    }

    if (!this.hass?.states) return [];
    return discoverVioletErrors(this.hass.states, this.hass.entities, this.showResolved);
  }

  private renderCurrentErrors(): TemplateResult {
    const effectiveErrors = this._getEffectiveErrors();

    if (effectiveErrors.length === 0) {
      return html`
        <div class="empty-state">
          <div class="empty-icon">✓</div>
          <div class="empty-text">No Errors</div>
          <div class="empty-subtext">System is running normally</div>
        </div>
      `;
    }

    const sorted = [...effectiveErrors].sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

    return html`
      <div class="errors-list">
        ${sorted.map((error, idx) => this.renderErrorCard(error, idx, this.errors.length > 0))}
      </div>
    `;
  }

  private renderErrorCard(error: PoolError, idx: number, canDismiss: boolean): TemplateResult {
    const mapped = error.code > 0 ? ERROR_CODE_MAP[error.code] : undefined;
    const message = mapped?.message || error.message;
    const suggestion = error.suggestion || mapped?.suggestion || 'Contact pool controller support';
    const severityEmoji = { critical: '🔴', warning: '🟡', info: '🔵' };

    return html`
      <div class="error-card ${error.severity}">
        <div class="error-header">
          <div class="severity-badge ${error.severity}">
            ${severityEmoji[error.severity]} ${error.severity.toUpperCase()}
          </div>
          <div class="error-time">
            ${error.timestamp.toLocaleString()}
          </div>
          ${canDismiss ? html`<button class="dismiss-btn" @click="${() => this.dismissError(idx)}" title="Dismiss error">✕</button>` : ''}
        </div>

        <div class="error-content">
          ${error.code > 0 ? html`<div class="error-code">#${error.code.toString().padStart(4, '0')}</div>` : ''}
          <div class="error-message">${message}</div>
          <div class="error-device">Device: ${error.device}</div>
        </div>

        <div class="error-details">
          <div class="suggestion">
            <div class="suggestion-title">💡 Suggestion:</div>
            <div class="suggestion-text">${suggestion}</div>
          </div>
          ${error.context ? html`
            <details class="context">
              <summary>Additional Context</summary>
              <pre>${JSON.stringify(error.context, null, 2)}</pre>
            </details>
          ` : ''}
        </div>
      </div>
    `;
  }

  private renderStats(): TemplateResult {
    const effectiveErrors = this._getEffectiveErrors();
    const bySeverity = {
      critical: effectiveErrors.filter(e => e.severity === 'critical').length,
      warning: effectiveErrors.filter(e => e.severity === 'warning').length,
      info: effectiveErrors.filter(e => e.severity === 'info').length,
    };

    const byType = {
      error: effectiveErrors.filter(e => e.type === 'error').length,
      alert: effectiveErrors.filter(e => e.type === 'alert').length,
      message: effectiveErrors.filter(e => e.type === 'message').length,
    };

    return html`
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Errors</div>
          <div class="stat-value">${effectiveErrors.length}</div>
        </div>
        <div class="stat-card critical">
          <div class="stat-label">🔴 Critical</div>
          <div class="stat-value">${bySeverity.critical}</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-label">🟡 Warnings</div>
          <div class="stat-value">${bySeverity.warning}</div>
        </div>
        <div class="stat-card info">
          <div class="stat-label">🔵 Info</div>
          <div class="stat-value">${bySeverity.info}</div>
        </div>
      </div>

      <div class="type-stats">
        <div class="type-stat">
          <div class="type-label">Errors</div>
          <div class="type-bar" style="width: ${(byType.error / effectiveErrors.length * 100) || 0}%"></div>
          <div class="type-count">${byType.error}</div>
        </div>
        <div class="type-stat">
          <div class="type-label">Alerts</div>
          <div class="type-bar" style="width: ${(byType.alert / effectiveErrors.length * 100) || 0}%"></div>
          <div class="type-count">${byType.alert}</div>
        </div>
        <div class="type-stat">
          <div class="type-label">Messages</div>
          <div class="type-bar" style="width: ${(byType.message / effectiveErrors.length * 100) || 0}%"></div>
          <div class="type-count">${byType.message}</div>
        </div>
      </div>
    `;
  }

  protected render(): TemplateResult {
    const effectiveErrors = this._getEffectiveErrors();
    return html`
      <div class="error-dashboard">
        <!-- Header -->
        <div class="dashboard-header">
          <div class="header-title">
            Error Dashboard
            ${effectiveErrors.length > 0 ? html`
              <span class="error-badge">${effectiveErrors.length}</span>
            ` : ''}
          </div>
          <div class="header-controls">
            <div class="view-tabs">
              <button
                class="tab ${this.view === 'current' ? 'active' : ''}"
                @click="${() => this.view = 'current'}"
              >
                Current
              </button>
              <button
                class="tab ${this.view === 'history' ? 'active' : ''}"
                @click="${() => this.view = 'history'}"
              >
                History
              </button>
              <button
                class="tab ${this.view === 'stats' ? 'active' : ''}"
                @click="${() => this.view = 'stats'}"
              >
                Statistics
              </button>
            </div>
            ${this.errors.length > 0 ? html`
              <button class="clear-btn" @click="${() => this.clearAllErrors()}" title="Clear all errors">
                🗑️ Clear All
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Content -->
        <div class="dashboard-content">
          ${this.view === 'current' ? this.renderCurrentErrors() : ''}
          ${this.view === 'stats' ? this.renderStats() : ''}
          ${this.view === 'history' ? html`
            <div class="history-placeholder">
              History view coming soon
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  static styles: CSSResultGroup = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .error-dashboard {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .header-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--primary-text-color, #212121);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .error-badge {
      background: #FF4444;
      color: white;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      min-width: 28px;
      text-align: center;
    }

    .header-controls {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .view-tabs {
      display: flex;
      gap: 4px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
      padding: 4px;
      border-radius: 8px;
    }

    .tab {
      padding: 6px 12px;
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .tab:hover {
      color: var(--primary-text-color, #212121);
    }

    .tab.active {
      background: rgba(255, 69, 0, 0.3);
      color: var(--primary-text-color, #212121);
    }

    .clear-btn {
      padding: 6px 12px;
      background: rgba(255, 69, 0, 0.2);
      border: 1px solid rgba(255, 69, 0, 0.4);
      color: var(--primary-text-color, #212121);
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .clear-btn:hover {
      background: rgba(255, 69, 0, 0.3);
      border-color: rgba(255, 69, 0, 0.6);
    }

    .dashboard-content {
      min-height: 200px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .empty-text {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 8px;
    }

    .empty-subtext {
      font-size: 13px;
      color: var(--secondary-text-color, #727272);
    }

    .errors-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .error-card {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
      border-left: 4px solid;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .error-card.critical {
      border-left-color: #FF4444;
      background: rgba(255, 68, 68, 0.08);
    }

    .error-card.warning {
      border-left-color: #FFD700;
      background: rgba(255, 215, 0, 0.08);
    }

    .error-card.info {
      border-left-color: #0099FF;
      background: rgba(0, 153, 255, 0.08);
    }

    .error-card:hover {
      background: rgba(127, 127, 127, 0.08);
    }

    .error-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      gap: 12px;
    }

    .severity-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 6px;
      min-width: 100px;
    }

    .severity-badge.critical {
      background: rgba(255, 68, 68, 0.3);
      color: #FF8888;
    }

    .severity-badge.warning {
      background: rgba(255, 215, 0, 0.2);
      color: #FFD700;
    }

    .severity-badge.info {
      background: rgba(0, 153, 255, 0.2);
      color: #00CCFF;
    }

    .error-time {
      font-size: 11px;
      color: var(--secondary-text-color, #727272);
      flex: 1;
    }

    .dismiss-btn {
      background: none;
      border: none;
      color: var(--secondary-text-color, #727272);
      cursor: pointer;
      font-size: 18px;
      padding: 0;
      line-height: 1;
      transition: color 0.2s ease;
    }

    .dismiss-btn:hover {
      color: var(--primary-text-color, #212121);
    }

    .error-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .error-code {
      font-size: 11px;
      color: var(--secondary-text-color, #727272);
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }

    .error-message {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #212121);
    }

    .error-device {
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
    }

    .error-details {
      padding: 12px 16px;
      background: rgba(127, 127, 127, 0.06);
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    }

    .suggestion {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .suggestion-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color, #727272);
    }

    .suggestion-text {
      font-size: 13px;
      color: var(--primary-text-color, #212121);
      line-height: 1.4;
    }

    .context {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    }

    .context summary {
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
      cursor: pointer;
      user-select: none;
    }

    .context pre {
      margin-top: 8px;
      padding: 8px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
      border-radius: 4px;
      font-size: 10px;
      color: var(--secondary-text-color, #727272);
      overflow-x: auto;
    }

    /* Statistics View */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .stat-card {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }

    .stat-card.critical {
      border-color: rgba(255, 68, 68, 0.3);
      background: rgba(255, 68, 68, 0.08);
    }

    .stat-card.warning {
      border-color: rgba(255, 215, 0, 0.2);
      background: rgba(255, 215, 0, 0.08);
    }

    .stat-card.info {
      border-color: rgba(0, 153, 255, 0.2);
      background: rgba(0, 153, 255, 0.08);
    }

    .stat-label {
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: var(--primary-text-color, #212121);
    }

    .type-stats {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .type-stat {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .type-label {
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
      min-width: 60px;
    }

    .type-bar {
      height: 24px;
      background: linear-gradient(90deg, #0099FF, #00CCFF);
      border-radius: 4px;
      min-width: 4px;
      flex: 1;
    }

    .type-count {
      font-size: 12px;
      font-weight: 600;
      color: var(--primary-text-color, #212121);
      min-width: 30px;
      text-align: right;
    }

    .history-placeholder {
      padding: 40px;
      text-align: center;
      color: var(--secondary-text-color, #727272);
    }

    @media (max-width: 600px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-controls {
        width: 100%;
        flex-direction: column;
      }

      .view-tabs {
        width: 100%;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;
}

if (typeof customElements !== 'undefined' && !customElements.get('error-dashboard')) {
  customElements.define('error-dashboard', ErrorDashboard);
}
