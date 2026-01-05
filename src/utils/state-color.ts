/**
 * State-based Auto-Coloring Utility
 * Automatically determines colors based on entity state and values
 */

export interface ColorConfig {
  color: string;
  intensity: 'low' | 'medium' | 'high';
}

export class StateColorHelper {
  /**
   * Get color for temperature
   */
  public static getTemperatureColor(temp: number): ColorConfig {
    if (temp < 15) {
      return { color: '#2196F3', intensity: 'high' }; // Cold - Blue
    } else if (temp < 20) {
      return { color: '#00BCD4', intensity: 'medium' }; // Cool - Cyan
    } else if (temp < 26) {
      return { color: '#4CAF50', intensity: 'low' }; // Ideal - Green
    } else if (temp < 30) {
      return { color: '#FF9800', intensity: 'medium' }; // Warm - Orange
    } else {
      return { color: '#F44336', intensity: 'high' }; // Hot - Red
    }
  }

  /**
   * Get color for pH value
   */
  public static getPhColor(ph: number, targetPh: number = 7.2): ColorConfig {
    const diff = Math.abs(ph - targetPh);

    if (diff < 0.1) {
      return { color: '#4CAF50', intensity: 'low' }; // Perfect - Green
    } else if (diff < 0.3) {
      return { color: '#8BC34A', intensity: 'low' }; // Good - Light Green
    } else if (diff < 0.5) {
      return { color: '#FF9800', intensity: 'medium' }; // Attention - Orange
    } else {
      return { color: '#F44336', intensity: 'high' }; // Critical - Red
    }
  }

  /**
   * Get color for ORP (chlorine) value
   */
  public static getOrpColor(orp: number, targetOrp: number = 700): ColorConfig {
    if (orp < targetOrp - 100) {
      return { color: '#F44336', intensity: 'high' }; // Too low - Red
    } else if (orp < targetOrp - 50) {
      return { color: '#FF9800', intensity: 'medium' }; // Low - Orange
    } else if (orp > targetOrp + 100) {
      return { color: '#F44336', intensity: 'high' }; // Too high - Red
    } else if (orp > targetOrp + 50) {
      return { color: '#FF9800', intensity: 'medium' }; // High - Orange
    } else {
      return { color: '#4CAF50', intensity: 'low' }; // Good - Green
    }
  }

  /**
   * Get color for pump speed
   */
  public static getPumpSpeedColor(speed: number): ColorConfig {
    switch (speed) {
      case 0:
        return { color: '#757575', intensity: 'low' }; // OFF - Gray
      case 1:
        return { color: '#2196F3', intensity: 'low' }; // ECO - Blue
      case 2:
        return { color: '#4CAF50', intensity: 'medium' }; // Normal - Green
      case 3:
        return { color: '#FF9800', intensity: 'high' }; // Boost - Orange
      default:
        return { color: '#757575', intensity: 'low' }; // Unknown - Gray
    }
  }

  /**
   * Get color for entity state
   */
  public static getEntityStateColor(state: string): ColorConfig {
    const stateLower = state.toLowerCase();

    if (stateLower === 'on' || stateLower === 'heat' || stateLower === 'active') {
      return { color: '#4CAF50', intensity: 'medium' }; // Active - Green
    } else if (stateLower === 'off' || stateLower === 'idle') {
      return { color: '#757575', intensity: 'low' }; // Inactive - Gray
    } else if (stateLower === 'auto') {
      return { color: '#2196F3', intensity: 'medium' }; // Auto - Blue
    } else if (stateLower === 'manual') {
      return { color: '#FF9800', intensity: 'medium' }; // Manual - Orange
    } else if (stateLower.includes('blocked') || stateLower.includes('error')) {
      return { color: '#F44336', intensity: 'high' }; // Error/Blocked - Red
    } else if (stateLower.includes('warning')) {
      return { color: '#FFC107', intensity: 'medium' }; // Warning - Amber
    } else {
      return { color: '#9E9E9E', intensity: 'low' }; // Unknown - Gray
    }
  }

  /**
   * Get color for percentage value
   */
  public static getPercentageColor(percentage: number, ideal: number = 100): ColorConfig {
    const diff = Math.abs(percentage - ideal);

    if (diff < 10) {
      return { color: '#4CAF50', intensity: 'low' }; // Perfect - Green
    } else if (diff < 25) {
      return { color: '#8BC34A', intensity: 'low' }; // Good - Light Green
    } else if (diff < 50) {
      return { color: '#FF9800', intensity: 'medium' }; // Attention - Orange
    } else {
      return { color: '#F44336', intensity: 'high' }; // Critical - Red
    }
  }

  /**
   * Get intensity opacity
   */
  public static getIntensityOpacity(intensity: ColorConfig['intensity']): number {
    switch (intensity) {
      case 'low':
        return 0.15;
      case 'medium':
        return 0.25;
      case 'high':
        return 0.35;
      default:
        return 0.2;
    }
  }

  /**
   * Apply color to element with auto-calculated background
   */
  public static applyColorToElement(
    element: HTMLElement,
    colorConfig: ColorConfig,
    useBackground: boolean = true
  ): void {
    element.style.setProperty('--state-color', colorConfig.color);

    if (useBackground) {
      const opacity = this.getIntensityOpacity(colorConfig.intensity);
      const rgb = this.hexToRgb(colorConfig.color);
      if (rgb) {
        element.style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
      }
    }
  }

  /**
   * Convert hex color to RGB
   */
  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }
}
