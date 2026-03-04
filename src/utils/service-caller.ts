
interface HomeAssistant {
  callService: (domain: string, service: string, serviceData?: Record<string, unknown>) => Promise<unknown>;
}

export interface ServiceCallResult {
  success: boolean;
  error?: string;
}

export class ServiceCaller {
  constructor(private hass: HomeAssistant) {}

  private showToast(message: string, duration = 3000) {
    const event = new CustomEvent('hass-notification', {
      detail: { message, duration },
      bubbles: true,
      composed: true,
    });
    window.dispatchEvent(event);
  }

  private async callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>
  ): Promise<ServiceCallResult> {
    try {
      await this.hass.callService(domain, service, serviceData);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Service call failed: ${domain}.${service}`, error);
      this.showToast(`Error: ${errorMessage}`, 5000);
      return { success: false, error: errorMessage };
    }
  }

  // ============================================================================
  // PUMP CONTROL - Full API Support
  // ============================================================================
  async controlPump(
    entity: string,
    action: 'speed_control' | 'force_off' | 'eco_mode' | 'boost_mode' | 'auto',
    speed?: number,
    duration?: number
  ): Promise<ServiceCallResult> {
    const serviceData: Record<string, unknown> = {
      entity_id: entity,
      action,
    };

    if (speed !== undefined && speed >= 1 && speed <= 3) {
      serviceData.speed = speed;
    }

    if (duration !== undefined && duration >= 0 && duration <= 86400) {
      serviceData.duration = duration;
    }

    const result = await this.callService('violet_pool_controller', 'control_pump', serviceData);

    if (result.success) {
      const actionLabels: Record<string, string> = {
        speed_control: 'Speed control',
        force_off: 'Force OFF',
        eco_mode: 'ECO Mode',
        boost_mode: 'BOOST Mode',
        auto: 'Auto Mode',
      };
      const speedLabel = speed !== undefined ? ` (Speed ${speed})` : '';
      const durationLabel = duration !== undefined ? ` für ${duration}s` : '';
      this.showToast(`${actionLabels[action]}${speedLabel}${durationLabel}`);
    }

    return result;
  }

  async setPumpSpeed(entity: string, speed: number): Promise<ServiceCallResult> {
    if (speed < 0 || speed > 3) {
      return { success: false, error: 'Speed must be between 0 and 3' };
    }
    return this.controlPump(entity, 'speed_control', speed);
  }

  async setPumpEcoMode(entity: string, duration?: number): Promise<ServiceCallResult> {
    return this.controlPump(entity, 'eco_mode', undefined, duration);
  }

  async setPumpBoostMode(entity: string, duration?: number): Promise<ServiceCallResult> {
    return this.controlPump(entity, 'boost_mode', undefined, duration);
  }

  async forcePumpOff(entity: string): Promise<ServiceCallResult> {
    return this.controlPump(entity, 'force_off');
  }

  async setPumpAuto(entity: string): Promise<ServiceCallResult> {
    return this.controlPump(entity, 'auto');
  }

  // ============================================================================
  // SMART DOSING - Full API Support
  // ============================================================================
  async smartDosing(
    dosingType: 'pH-' | 'pH+' | 'Chlor' | 'Flockmittel',
    action: 'manual_dose' | 'auto' | 'stop',
    duration?: number,
    safetyOverride?: boolean
  ): Promise<ServiceCallResult> {
    const serviceData: Record<string, unknown> = {
      dosing_type: dosingType,
      action,
    };

    if (duration !== undefined && duration >= 5 && duration <= 300) {
      serviceData.duration = duration;
    }

    if (safetyOverride !== undefined) {
      serviceData.safety_override = safetyOverride;
    }

    const result = await this.callService('violet_pool_controller', 'smart_dosing', serviceData);

    if (result.success) {
      const actionLabels: Record<string, string> = {
        manual_dose: 'Manual dosing',
        auto: 'Auto dosing',
        stop: 'Stop dosing',
      };
      const durationLabel = duration !== undefined ? ` für ${duration}s` : '';
      this.showToast(`${dosingType} - ${actionLabels[action]}${durationLabel}`);
    }

    return result;
  }

  async manualDose(dosingType: 'pH-' | 'pH+' | 'Chlor' | 'Flockmittel', duration = 30, safetyOverride = false): Promise<ServiceCallResult> {
    return this.smartDosing(dosingType, 'manual_dose', duration, safetyOverride);
  }

  // Legacy support: extract dosing type from entity name
  async manualDosing(entity: string, duration = 30): Promise<ServiceCallResult> {
    const dosingTypeMatch = entity.match(/dos_\d+_(cl|phm|php|floc)/);
    if (!dosingTypeMatch) {
      return { success: false, error: 'Could not determine dosing type from entity' };
    }

    const dosingTypeMap: Record<string, 'pH-' | 'pH+' | 'Chlor' | 'Flockmittel'> = {
      cl: 'Chlor',
      phm: 'pH-',
      php: 'pH+',
      floc: 'Flockmittel',
    };

    const dosingType = dosingTypeMap[dosingTypeMatch[1]];
    if (!dosingType) {
      return { success: false, error: `Unknown dosing type: ${dosingTypeMatch[1]}` };
    }

    return this.manualDose(dosingType, duration);
  }

  async autoDose(dosingType: 'pH-' | 'pH+' | 'Chlor' | 'Flockmittel'): Promise<ServiceCallResult> {
    return this.smartDosing(dosingType, 'auto');
  }

  async stopDosing(dosingType: 'pH-' | 'pH+' | 'Chlor' | 'Flockmittel'): Promise<ServiceCallResult> {
    return this.smartDosing(dosingType, 'stop');
  }

  // ============================================================================
  // PV SURPLUS MANAGEMENT - New Service
  // ============================================================================
  async managePvSurplus(mode: 'activate' | 'deactivate' | 'auto', pumpSpeed?: number): Promise<ServiceCallResult> {
    const serviceData: Record<string, unknown> = { mode };

    if (pumpSpeed !== undefined && pumpSpeed >= 1 && pumpSpeed <= 3) {
      serviceData.pump_speed = pumpSpeed;
    }

    const result = await this.callService('violet_pool_controller', 'manage_pv_surplus', serviceData);

    if (result.success) {
      const modeLabels: Record<string, string> = {
        activate: 'PV Surplus ACTIVATED',
        deactivate: 'PV Surplus DEACTIVATED',
        auto: 'PV Surplus AUTO mode',
      };
      const speedLabel = pumpSpeed !== undefined ? ` (Speed ${pumpSpeed})` : '';
      this.showToast(`${modeLabels[mode]}${speedLabel}`);
    }

    return result;
  }

  // ============================================================================
  // DMX SCENE CONTROL - New Service
  // ============================================================================
  async controlDmxScenes(
    action: 'all_on' | 'all_off' | 'all_auto' | 'sequence' | 'party_mode',
    sequenceDelay?: number
  ): Promise<ServiceCallResult> {
    const serviceData: Record<string, unknown> = { action };

    if (sequenceDelay !== undefined && sequenceDelay >= 1 && sequenceDelay <= 60 && action === 'sequence') {
      serviceData.sequence_delay = sequenceDelay;
    }

    const result = await this.callService('violet_pool_controller', 'control_dmx_scenes', serviceData);

    if (result.success) {
      const actionLabels: Record<string, string> = {
        all_on: 'All Lights ON',
        all_off: 'All Lights OFF',
        all_auto: 'All Lights AUTO',
        sequence: 'Sequence mode',
        party_mode: 'Party Mode 🎉',
      };
      const delayLabel = sequenceDelay !== undefined ? ` (Delay: ${sequenceDelay}s)` : '';
      this.showToast(`${actionLabels[action]}${delayLabel}`);
    }

    return result;
  }

  // ============================================================================
  // LIGHT COLOR PULSE - New Service
  // ============================================================================
  async setLightColorPulse(pulseCount?: number, pulseInterval?: number): Promise<ServiceCallResult> {
    const serviceData: Record<string, unknown> = {};

    if (pulseCount !== undefined && pulseCount >= 1 && pulseCount <= 10) {
      serviceData.pulse_count = pulseCount;
    }

    if (pulseInterval !== undefined && pulseInterval >= 100 && pulseInterval <= 2000) {
      serviceData.pulse_interval = pulseInterval;
    }

    const result = await this.callService('violet_pool_controller', 'set_light_color_pulse', serviceData);

    if (result.success) {
      const countLabel = pulseCount !== undefined ? `${pulseCount}x` : '1x';
      const intervalLabel = pulseInterval !== undefined ? ` ${pulseInterval}ms` : '';
      this.showToast(`Light pulse: ${countLabel}${intervalLabel}`);
    }

    return result;
  }

  // ============================================================================
  // DIGITAL RULES MANAGEMENT - New Service
  // ============================================================================
  async manageDigitalRules(
    ruleKey: 'DIRULE_1' | 'DIRULE_2' | 'DIRULE_3' | 'DIRULE_4' | 'DIRULE_5' | 'DIRULE_6' | 'DIRULE_7',
    action: 'trigger' | 'lock' | 'unlock'
  ): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'manage_digital_rules', {
      rule_key: ruleKey,
      action,
    });

    if (result.success) {
      const actionLabels: Record<string, string> = {
        trigger: 'triggered',
        lock: 'locked',
        unlock: 'unlocked',
      };
      this.showToast(`${ruleKey} ${actionLabels[action]}`);
    }

    return result;
  }

  // ============================================================================
  // DIAGNOSTIC SERVICES - New Services
  // ============================================================================
  async testConnection(deviceId: string): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'test_connection', {
      device_id: deviceId,
    });

    if (result.success) {
      this.showToast('Connection test started');
    }

    return result;
  }

  async getConnectionStatus(deviceId: string): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'get_connection_status', {
      device_id: deviceId,
    });

    if (result.success) {
      this.showToast('Connection status retrieved');
    }

    return result;
  }

  async getErrorSummary(deviceId: string, includeHistory = false): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'get_error_summary', {
      device_id: deviceId,
      include_history: includeHistory,
    });

    if (result.success) {
      this.showToast('Error summary retrieved');
    }

    return result;
  }

  async exportDiagnosticLogs(
    deviceId: string,
    lines = 100,
    includeTimestamps = true,
    saveToFile = false
  ): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'export_diagnostic_logs', {
      device_id: deviceId,
      lines,
      include_timestamps: includeTimestamps,
      save_to_file: saveToFile,
    });

    if (result.success) {
      this.showToast(`Diagnostic logs exported (${lines} lines)`);
    }

    return result;
  }

  async clearErrorHistory(deviceId: string): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'clear_error_history', {
      device_id: deviceId,
    });

    if (result.success) {
      this.showToast('Error history cleared');
    }

    return result;
  }

  // ============================================================================
  // STANDARD HOME ASSISTANT SERVICES
  // ============================================================================
  async setTemperature(entity: string, temperature: number): Promise<ServiceCallResult> {
    const result = await this.callService('climate', 'set_temperature', {
      entity_id: entity,
      temperature,
    });

    if (result.success) {
      this.showToast(`Temperature set to ${temperature}°C`);
    }

    return result;
  }

  async setHvacMode(entity: string, mode: 'off' | 'heat' | 'cool' | 'auto'): Promise<ServiceCallResult> {
    const result = await this.callService('climate', 'set_hvac_mode', {
      entity_id: entity,
      hvac_mode: mode,
    });

    if (result.success) {
      this.showToast(`HVAC mode set to ${mode.toUpperCase()}`);
    }

    return result;
  }

  async setNumberValue(entity: string, value: number): Promise<ServiceCallResult> {
    const result = await this.callService('number', 'set_value', {
      entity_id: entity,
      value,
    });

    if (result.success) {
      this.showToast(`Value set to ${value}`);
    }

    return result;
  }

  async turnOn(entity: string): Promise<ServiceCallResult> {
    const domain = entity.split('.')[0];
    const result = await this.callService(domain, 'turn_on', {
      entity_id: entity,
    });

    if (result.success) {
      this.showToast(`${entity.split('.')[1]} turned ON`);
    }

    return result;
  }

  async turnOff(entity: string): Promise<ServiceCallResult> {
    const domain = entity.split('.')[0];
    const result = await this.callService(domain, 'turn_off', {
      entity_id: entity,
    });

    if (result.success) {
      this.showToast(`${entity.split('.')[1]} turned OFF`);
    }

    return result;
  }

  async toggle(entity: string): Promise<ServiceCallResult> {
    const domain = entity.split('.')[0];
    const result = await this.callService(domain, 'toggle', {
      entity_id: entity,
    });

    if (result.success) {
      this.showToast(`${entity.split('.')[1]} toggled`);
    }

    return result;
  }

  async setControllerMode(entity: string, mode: 'auto' | 'manual' | 'off'): Promise<ServiceCallResult> {
    if (mode === 'off') {
      return this.turnOff(entity);
    }

    const action = mode === 'manual' ? 'speed_control' : 'auto';
    return this.controlPump(entity, action);
  }
}
