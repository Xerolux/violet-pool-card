// HomeAssistant interface
interface HomeAssistant {
  states: { [entity_id: string]: any };
  callService: (domain: string, service: string, serviceData?: any) => Promise<any>;
}

export interface ActionConfig {
  action: 'none' | 'toggle' | 'more-info' | 'navigate' | 'url' | 'call-service';
  navigation_path?: string;
  url_path?: string;
  service?: string;
  service_data?: any;
}

export class ActionHandler {
  private holdTimer?: number;
  private holdDelay = 500; // ms

  constructor(
    private hass: HomeAssistant,
    private entity: string,
    private tapAction?: ActionConfig,
    private holdAction?: ActionConfig,
    private doubleTapAction?: ActionConfig
  ) {}

  public handleTap(event: Event): void {
    event.stopPropagation();
    this._executeAction(this.tapAction || { action: 'more-info' });
  }

  public handleHoldStart(event: Event): void {
    event.preventDefault();

    this.holdTimer = window.setTimeout(() => {
      this._executeAction(this.holdAction || { action: 'more-info' });
      // Vibrate on mobile for feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, this.holdDelay);
  }

  public handleHoldEnd(): void {
    if (this.holdTimer) {
      clearTimeout(this.holdTimer);
      this.holdTimer = undefined;
    }
  }

  public handleDoubleTap(event: Event): void {
    event.stopPropagation();
    this._executeAction(this.doubleTapAction || { action: 'more-info' });
  }

  private _executeAction(action: ActionConfig): void {
    switch (action.action) {
      case 'more-info':
        this._showMoreInfo();
        break;
      case 'toggle':
        this._toggleEntity();
        break;
      case 'navigate':
        if (action.navigation_path) {
          history.pushState(null, '', action.navigation_path);
          window.dispatchEvent(new CustomEvent('location-changed'));
        }
        break;
      case 'url':
        if (action.url_path) {
          window.open(action.url_path);
        }
        break;
      case 'call-service':
        if (action.service) {
          const [domain, service] = action.service.split('.');
          this.hass.callService(domain, service, action.service_data || {});
        }
        break;
      case 'none':
      default:
        break;
    }
  }

  private _showMoreInfo(): void {
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId: this.entity },
      bubbles: true,
      composed: true,
    });
    window.dispatchEvent(event);
  }

  private _toggleEntity(): void {
    const domain = this.entity.split('.')[0];
    this.hass.callService(domain, 'toggle', {
      entity_id: this.entity,
    });
  }
}
