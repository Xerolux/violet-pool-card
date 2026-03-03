/**
 * Simple Performance Monitoring Utility
 * Tracks render times, memory usage, and animation FPS
 */

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  animationFPS: number;
  lastUpdate: Date;
}

export class PerformanceMonitor {
  private static metrics: Map<string, PerformanceMetrics> = new Map();
  private static enabled = false;

  /**
   * Enable performance monitoring
   */
  static enable(): void {
    this.enabled = true;
    console.log('✓ Performance monitoring enabled');
  }

  /**
   * Disable performance monitoring
   */
  static disable(): void {
    this.enabled = false;
    console.log('✓ Performance monitoring disabled');
  }

  /**
   * Mark the start of a measurement
   */
  static markStart(label: string): void {
    if (this.enabled && typeof performance !== 'undefined') {
      performance.mark(`${label}-start`);
    }
  }

  /**
   * Mark the end of a measurement and record time
   */
  static markEnd(label: string): number {
    if (this.enabled && typeof performance !== 'undefined') {
      performance.mark(`${label}-end`);
      try {
        performance.measure(label, `${label}-start`, `${label}-end`);
        const measure = performance.getEntriesByName(label)[0];
        if (measure) {
          return measure.duration;
        }
      } catch (e) {
        // Measurement failed, return 0
      }
    }
    return 0;
  }

  /**
   * Get memory usage (if available)
   */
  static getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize / 1048576; // Convert to MB
    }
    return 0;
  }

  /**
   * Log metrics for a card
   */
  static logCardMetrics(cardId: string, renderTime: number): void {
    if (this.enabled) {
      const memory = this.getMemoryUsage();
      const metrics: PerformanceMetrics = {
        renderTime,
        memoryUsage: memory,
        animationFPS: 60, // Assumed
        lastUpdate: new Date(),
      };
      this.metrics.set(cardId, metrics);

      if (renderTime > 16) { // Warn if slower than 60 FPS
        console.warn(`⚠️ Card ${cardId} render time: ${renderTime.toFixed(2)}ms (target: <16ms)`);
      }
    }
  }

  /**
   * Get all metrics
   */
  static getMetrics(): Map<string, PerformanceMetrics> {
    return this.metrics;
  }

  /**
   * Clear all metrics
   */
  static clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Print performance report
   */
  static printReport(): void {
    if (!this.enabled) {
      console.log('Performance monitoring is disabled');
      return;
    }

    console.group('📊 Performance Report');
    let totalRenderTime = 0;
    let totalMemory = 0;
    let count = 0;

    this.metrics.forEach((metrics, cardId) => {
      console.log(`${cardId}: ${metrics.renderTime.toFixed(2)}ms, ${metrics.memoryUsage.toFixed(2)}MB`);
      totalRenderTime += metrics.renderTime;
      totalMemory += metrics.memoryUsage;
      count++;
    });

    if (count > 0) {
      console.log(`\nAverage render time: ${(totalRenderTime / count).toFixed(2)}ms`);
      console.log(`Total memory usage: ${totalMemory.toFixed(2)}MB`);
    }

    console.groupEnd();
  }
}

/**
 * Decorator for measuring function performance
 */
export function measurePerformance(_target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    PerformanceMonitor.markStart(propertyKey);
    const result = originalMethod.apply(this, args);
    const time = PerformanceMonitor.markEnd(propertyKey);
    if (time > 0) {
      console.debug(`⏱️ ${propertyKey}: ${time.toFixed(2)}ms`);
    }
    return result;
  };

  return descriptor;
}
