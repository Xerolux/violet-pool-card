
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

  public async callService(
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

  // ============================================================================
  // ADVANCED POOL CONTROL - Additional API Services
  // ============================================================================
  
  // Cover Control with position
  async setCoverPosition(entity: string, position: number): Promise<ServiceCallResult> {
    const result = await this.callService('cover', 'set_cover_position', {
      entity_id: entity,
      position: Math.max(0, Math.min(100, position)),
    });

    if (result.success) {
      this.showToast(`Cover position set to ${position}%`);
    }

    return result;
  }

  async openCover(entity: string): Promise<ServiceCallResult> {
    return this.callService('cover', 'open_cover', { entity_id: entity });
  }

  async closeCover(entity: string): Promise<ServiceCallResult> {
    return this.callService('cover', 'close_cover', { entity_id: entity });
  }

  async stopCover(entity: string): Promise<ServiceCallResult> {
    return this.callService('cover', 'stop_cover', { entity_id: entity });
  }

  // Light Control with brightness and color
  async setLightBrightness(entity: string, brightness: number): Promise<ServiceCallResult> {
    const result = await this.callService('light', 'turn_on', {
      entity_id: entity,
      brightness: Math.max(0, Math.min(255, Math.round(brightness * 2.55))),
    });

    if (result.success) {
      this.showToast(`Light brightness set to ${brightness}%`);
    }

    return result;
  }

  async setLightColor(entity: string, rgb: [number, number, number]): Promise<ServiceCallResult> {
    const [r, g, b] = rgb;
    const result = await this.callService('light', 'turn_on', {
      entity_id: entity,
      rgb_color: [r, g, b],
    });

    if (result.success) {
      this.showToast(`Light color set to RGB(${r}, ${g}, ${b})`);
    }

    return result;
  }

  async setLightColorTemperature(entity: string, kelvin: number): Promise<ServiceCallResult> {
    const result = await this.callService('light', 'turn_on', {
      entity_id: entity,
      color_temp_kelvin: Math.max(2000, Math.min(6500, kelvin)),
    });

    if (result.success) {
      this.showToast(`Light temperature set to ${kelvin}K`);
    }

    return result;
  }

  // Filter Control
  async startFilterBackwash(entity: string, duration = 300): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'start_filter_backwash', {
      entity_id: entity,
      duration: Math.max(60, Math.min(1800, duration)),
    });

    if (result.success) {
      this.showToast(`Filter backwash started (${duration}s)`);
    }

    return result;
  }

  async startFilterRinse(entity: string, duration = 120): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'start_filter_rinse', {
      entity_id: entity,
      duration: Math.max(30, Math.min(600, duration)),
    });

    if (result.success) {
      this.showToast(`Filter rinse started (${duration}s)`);
    }

    return result;
  }

  async resetFilterPressure(entity: string): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'reset_filter_pressure', {
      entity_id: entity,
    });

    if (result.success) {
      this.showToast('Filter pressure reset');
    }

    return result;
  }

  // Water Level Management
  async startRefill(entity: string, targetLevel: number, maxDuration = 3600): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'start_refill', {
      entity_id: entity,
      target_level: Math.max(0, Math.min(100, targetLevel)),
      max_duration: Math.max(300, Math.min(7200, maxDuration)),
    });

    if (result.success) {
      this.showToast(`Refill started to ${targetLevel}%`);
    }

    return result;
  }

  async stopRefill(entity: string): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'stop_refill', {
      entity_id: entity,
    });

    if (result.success) {
      this.showToast('Refill stopped');
    }

    return result;
  }

  // Advanced Chemistry Control
  async calibrateSensor(sensorType: 'ph' | 'orp' | 'temperature' | 'flow', calibrationValue: number): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'calibrate_sensor', {
      sensor_type: sensorType,
      calibration_value: calibrationValue,
    });

    if (result.success) {
      this.showToast(`${sensorType.toUpperCase()} sensor calibrated to ${calibrationValue}`);
    }

    return result;
  }

  async startChemicalCycle(cycleType: 'shock' | 'maintenance' | 'winter', duration: number): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'start_chemical_cycle', {
      cycle_type: cycleType,
      duration: Math.max(300, Math.min(14400, duration)),
    });

    if (result.success) {
      this.showToast(`${cycleType} cycle started (${Math.round(duration/60)}min)`);
    }

    return result;
  }

  // Schedule Management
  async createSchedule(
    name: string,
    entityType: 'pump' | 'heater' | 'solar' | 'dosing',
    schedule: { time: string; days: number[]; action: string; parameters?: Record<string, unknown> }[]
  ): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'create_schedule', {
      name,
      entity_type: entityType,
      schedule,
    });

    if (result.success) {
      this.showToast(`Schedule "${name}" created`);
    }

    return result;
  }

  async deleteSchedule(scheduleId: string): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'delete_schedule', {
      schedule_id: scheduleId,
    });

    if (result.success) {
      this.showToast(`Schedule deleted`);
    }

    return result;
  }

  // Weather Integration
  async updateWeatherSettings(settings: {
    enableFrostProtection?: boolean;
    enableSolarOptimization?: boolean;
    minOutsideTemp?: number;
    maxWindSpeed?: number;
  }): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'update_weather_settings', settings);

    if (result.success) {
      this.showToast('Weather settings updated');
    }

    return result;
  }

  // Energy Management
  async setEnergyProfile(profile: 'eco' | 'balanced' | 'performance'): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'set_energy_profile', {
      profile,
    });

    if (result.success) {
      this.showToast(`Energy profile set to ${profile}`);
    }

    return result;
  }

  async getEnergyReport(timeframe: 'day' | 'week' | 'month'): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'get_energy_report', {
      timeframe,
    });

    if (result.success) {
      this.showToast(`Energy report for ${timeframe} generated`);
    }

    return result;
  }
}
