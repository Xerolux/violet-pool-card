/**
 * Violet Pool Card – Calibration Status Component
 * © 2026 Xerolux
 *
 * Display sensor calibration status with expiration warnings
 */

import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { VIOLET_PLATFORM } from '../utils/entity-registry';

export interface CalibrationInfo {
  sensor_type: string;
  last_calibration: string | null;
  days_since: number | null;
  status: 'OK' | 'Warning' | 'Expired' | 'Unknown';
  is_expired: boolean;
  is_warning: boolean;
  next_calibration: string | null;
}

/**
 * Turns an optional calibration timestamp into an honest status record.
 * Missing or invalid timestamps stay unknown; the card must never invent a
 * recent calibration date just to make the component look populated.
 */
export function calibrationInfo(
  sensorType: string,
  lastCalibration: unknown,
  nextCalibration: unknown = null,
  now: number = Date.now()
): CalibrationInfo {
  const validTimestamp = (value: unknown): value is string =>
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}(?:[T ][0-9:.+-]+Z?)?$/.test(value) &&
    Number.isFinite(Date.parse(value));
  const last = validTimestamp(lastCalibration) ? lastCalibration : null;
  const next = validTimestamp(nextCalibration) ? nextCalibration : null;
  const daysSince = last
    ? Math.max(0, Math.floor((now - Date.parse(last)) / 86_400_000))
    : null;
  const isExpired = daysSince !== null && daysSince > 90;
  const isWarning = daysSince !== null && daysSince > 60 && daysSince <= 90;

  return {
    sensor_type: sensorType,
    last_calibration: last,
    days_since: daysSince,
    status: isExpired ? 'Expired' : isWarning ? 'Warning' : daysSince !== null ? 'OK' : 'Unknown',
    is_expired: isExpired,
    is_warning: isWarning,
    next_calibration: next,
  };
}

export class CalibrationStatus extends LitElement {
  @property({ type: Object }) calibrations: Record<string, CalibrationInfo> = {};
  @property({ type: String }) deviceName: string = '';
  @property({ type: Object }) hass: any;

  /** Keep this specialised card from collecting unrelated pH sensors. */
  private _isVioletEntity(entityId: string): boolean {
    const platform = this.hass?.entities?.[entityId]?.platform;
    if (platform) return platform === VIOLET_PLATFORM;
    return entityId.toLowerCase().includes('violet');
  }

  private _getEffectiveCalibrations(): Record<string, CalibrationInfo> {
    if (Object.keys(this.calibrations).length > 0) {
      return this.calibrations;
    }

    const result: Record<string, CalibrationInfo> = {};
    if (!this.hass?.states) {
      return result;
    }

    const states = this.hass.states as Record<string, any>;

    // Scan for calibration sensors or attributes
    for (const [entityId, entity] of Object.entries(states)) {
      if (!entityId.startsWith('sensor.')) continue;
      if (!this._isVioletEntity(entityId)) continue;
      const lower = entityId.toLowerCase();
      const friendlyName = (entity.attributes?.friendly_name as string) || entityId;

      if (lower.includes('calibration') || lower.includes('kalibrierung')) {
        let sensorType = 'Sensor';
        if (lower.includes('ph')) sensorType = 'pH Electrode';
        else if (lower.includes('orp') || lower.includes('redox')) sensorType = 'Redox / ORP Electrode';
        else if (lower.includes('temp')) sensorType = 'Temperature Probe';
        else if (lower.includes('conduct') || lower.includes('leit')) sensorType = 'Conductivity Sensor';

        const lastCal = entity.attributes?.last_calibration ??
          (entity.state !== 'unknown' && entity.state !== 'unavailable' ? entity.state : null);
        result[friendlyName] = calibrationInfo(
          sensorType,
          lastCal,
          entity.attributes?.next_calibration
        );
      }
    }

    // If still empty, check main pH and ORP entities for calibration attributes
    if (Object.keys(result).length === 0) {
      for (const [entityId, entity] of Object.entries(states)) {
        if (!entityId.startsWith('sensor.')) continue;
        if (!this._isVioletEntity(entityId)) continue;
        const lower = entityId.toLowerCase();

        if ((lower.includes('ph_wert') || lower.includes('ph_value') || lower.endsWith('_ph')) && !lower.includes('target') && !lower.includes('soll')) {
          const lastCal = entity.attributes?.last_calibration ?? entity.attributes?.last_cal;
          result['pH Sonde'] = calibrationInfo('pH Electrode', lastCal);
        }

        if ((lower.includes('redox') || lower.includes('orp')) && !lower.includes('target') && !lower.includes('soll')) {
          const lastCal = entity.attributes?.last_calibration ?? entity.attributes?.last_cal;
          result['Redox / ORP Sonde'] = calibrationInfo('ORP Electrode', lastCal);
        }
      }
    }

    return result;
  }

  protected render(): TemplateResult {
    const activeCalibrations = this._getEffectiveCalibrations();

    if (Object.keys(activeCalibrations).length === 0) {
      return html`
        <div class="empty-state">
          <div class="empty-icon">🔄</div>
          <div class="empty-text">No Calibration Data</div>
        </div>
      `;
    }

    return html`
      <div class="calibration-status">
        <div class="status-header">
          <div class="header-title">🔬 Sensor Calibration</div>
          <div class="header-device">${this.deviceName || 'Violet Pool Controller'}</div>
        </div>

        <div class="calibrations-grid">
          ${Object.entries(activeCalibrations).map(([name, info]) =>
            this.renderCalibrationCard(name, info)
          )}
        </div>
      </div>
    `;
  }

  private renderCalibrationCard(name: string, info: CalibrationInfo): TemplateResult {
    const statusEmoji = {
      'OK': '✅',
      'Warning': '⚠️',
      'Expired': '🔴',
      'Unknown': '❓'
    };

    const statusColor = {
      'OK': 'ok',
      'Warning': 'warning',
      'Expired': 'expired',
      'Unknown': 'unknown'
    };

    return html`
      <div class="calibration-card ${statusColor[info.status]}">
        <div class="card-header">
          <div class="sensor-name">
            ${statusEmoji[info.status]} ${name}
          </div>
          <div class="status-badge ${info.status.toLowerCase()}">
            ${info.status}
          </div>
        </div>

        <div class="card-content">
          ${info.last_calibration
            ? html`
              <div class="calibration-date">
                <span class="label">Last Calibration:</span>
                <span class="value">${new Date(info.last_calibration).toLocaleDateString()}</span>
              </div>
              <div class="days-since">
                <span class="label">Days Since:</span>
                <span class="value">${info.days_since} days</span>
              </div>
            `
            : html`
              <div class="no-data">No calibration data recorded</div>
            `
          }

          ${info.next_calibration
            ? html`
              <div class="next-calibration">
                <span class="label">Next Due:</span>
                <span class="value">${new Date(info.next_calibration).toLocaleDateString()}</span>
              </div>
            `
            : ''
          }
        </div>

        ${info.is_expired || info.is_warning
          ? html`
            <div class="warning-banner">
              ${info.is_expired
                ? html`🔴 EXPIRED - Recalibrate immediately`
                : html`⚠️ WARNING - Calibration due soon`
              }
            </div>
          `
          : ''
        }
      </div>
    `;
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
      color: var(--secondary-text-color, #6b7280);
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .empty-text {
      font-size: 14px;
    }

    .calibration-status {
      background: var(--secondary-background-color, rgba(100, 150, 255, 0.06));
      border: 1px solid var(--divider-color, rgba(100, 150, 255, 0.2));
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
      color: var(--primary-text-color, #1f2937);
    }

    .header-device {
      font-size: 12px;
      color: var(--secondary-text-color, #6b7280);
    }

    .calibrations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 12px;
    }

    .calibration-card {
      background: var(--card-background-color, rgba(255, 255, 255, 0.72));
      border: 1px solid rgba(100, 150, 255, 0.2);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.2s ease;
    }

    .calibration-card.ok {
      border-color: rgba(100, 255, 100, 0.3);
      background: rgba(100, 255, 100, 0.05);
    }

    .calibration-card.warning {
      border-color: rgba(255, 200, 0, 0.3);
      background: rgba(255, 200, 0, 0.05);
    }

    .calibration-card.expired {
      border-color: rgba(255, 100, 100, 0.3);
      background: rgba(255, 100, 100, 0.08);
    }

    .calibration-card.unknown {
      border-color: rgba(150, 150, 150, 0.3);
      background: rgba(150, 150, 150, 0.05);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .sensor-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #1f2937);
    }

    .status-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      min-width: 60px;
      text-align: center;
    }

    .status-badge.ok {
      background: rgba(100, 255, 100, 0.3);
      color: #64FF64;
    }

    .status-badge.warning {
      background: rgba(255, 200, 0, 0.3);
      color: #FFD700;
    }

    .status-badge.expired {
      background: rgba(255, 100, 100, 0.3);
      color: #FF6464;
    }

    .status-badge.unknown {
      background: rgba(150, 150, 150, 0.3);
      color: var(--secondary-text-color, #6b7280);
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 12px;
    }

    .calibration-date,
    .days-since,
    .next-calibration {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .label {
      color: var(--secondary-text-color, #6b7280);
      font-weight: 500;
    }

    .value {
      color: var(--primary-text-color, #1f2937);
      font-weight: 600;
    }

    .no-data {
      color: var(--secondary-text-color, #6b7280);
      font-size: 11px;
      font-style: italic;
    }

    .warning-banner {
      padding: 8px;
      background: rgba(255, 100, 0, 0.15);
      border-left: 3px solid rgba(255, 100, 0, 0.6);
      border-radius: 4px;
      font-size: 11px;
      color: rgba(255, 150, 100, 0.9);
      font-weight: 600;
      text-align: center;
      margin-top: 4px;
    }

    @media (max-width: 600px) {
      .calibrations-grid {
        grid-template-columns: 1fr;
      }

      .calibration-status {
        padding: 16px;
      }
    }
  `;
}

if (typeof customElements !== 'undefined' && !customElements.get('calibration-status')) {
  customElements.define('calibration-status', CalibrationStatus);
}
