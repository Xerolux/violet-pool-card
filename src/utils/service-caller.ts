
interface HomeAssistant {
  callService: (domain: string, service: string, serviceData?: any) => Promise<any>;
  // Add more as needed
}

export interface ServiceCallResult {
  success: boolean;
  error?: string;
}

export class ServiceCaller {
  constructor(private hass: HomeAssistant) {}

  private showToast(message: string, duration = 3000) {
    // Dispatch event for toast notification
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
    serviceData?: any
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

  async controlPump(
    entity: string,
    action: 'on' | 'off' | 'auto',
    speed?: number,
    duration?: number
  ): Promise<ServiceCallResult> {
    const serviceData: any = {
      entity_id: entity,
      action,
    };

    if (speed !== undefined) {
      serviceData.speed = speed;
    }

    if (duration !== undefined) {
      serviceData.duration = duration;
    }

    const result = await this.callService('violet_pool_controller', 'control_pump', serviceData);

    if (result.success) {
      const speedLabel = speed !== undefined ? ` (Speed ${speed})` : '';
      this.showToast(`Pump ${action.toUpperCase()}${speedLabel}`);
    }

    return result;
  }

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

  async setHvacMode(
    entity: string,
    mode: 'off' | 'heat' | 'cool' | 'auto'
  ): Promise<ServiceCallResult> {
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

  async smartDosing(
    dosingType: 'cl' | 'phm' | 'php' | 'floc',
    duration: number,
    action: 'on' | 'off' | 'auto' = 'on'
  ): Promise<ServiceCallResult> {
    const result = await this.callService('violet_pool_controller', 'smart_dosing', {
      dosing_type: dosingType,
      duration,
      action,
    });

    if (result.success) {
      const typeLabels = {
        cl: 'Chlorine',
        phm: 'pH-',
        php: 'pH+',
        floc: 'Flocculant',
      };
      this.showToast(`${typeLabels[dosingType]} dosing for ${duration}s`);
    }

    return result;
  }

  async manualDosing(entity: string, duration = 30): Promise<ServiceCallResult> {
    // Extract dosing type from entity name
    const dosingTypeMatch = entity.match(/dos_\d+_(\w+)/);
    if (!dosingTypeMatch) {
      return {
        success: false,
        error: 'Could not determine dosing type from entity',
      };
    }

    const dosingTypeMap: Record<string, 'cl' | 'phm' | 'php' | 'floc'> = {
      cl: 'cl',
      phm: 'phm',
      php: 'php',
      floc: 'floc',
    };

    const dosingType = dosingTypeMap[dosingTypeMatch[1]];
    if (!dosingType) {
      return {
        success: false,
        error: `Unknown dosing type: ${dosingTypeMatch[1]}`,
      };
    }

    return this.smartDosing(dosingType, duration);
  }

  async setPumpSpeed(entity: string, speed: number): Promise<ServiceCallResult> {
    if (speed < 0 || speed > 3) {
      return {
        success: false,
        error: 'Speed must be between 0 and 3',
      };
    }

    return this.controlPump(entity, 'on', speed);
  }

  async setControllerMode(
    entity: string,
    mode: 'auto' | 'manual' | 'off'
  ): Promise<ServiceCallResult> {
    if (mode === 'off') {
      return this.turnOff(entity);
    }

    // For manual mode, use 'on' action
    const action = mode === 'manual' ? 'on' : 'auto';
    return this.controlPump(entity, action);
  }
}
