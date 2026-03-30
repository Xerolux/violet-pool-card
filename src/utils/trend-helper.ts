interface TrendPointObject {
  value?: number | string;
  state?: number | string;
  y?: number | string;
}

export class TrendHelper {
  static extractNumericSeries(source: unknown): number[] {
    if (!Array.isArray(source)) return [];

    return source
      .map((entry) => {
        if (typeof entry === 'number') return entry;
        if (typeof entry === 'string') return parseFloat(entry);
        if (entry && typeof entry === 'object') {
          const point = entry as TrendPointObject;
          const candidate = point.value ?? point.state ?? point.y;
          return typeof candidate === 'number' ? candidate : parseFloat(String(candidate));
        }
        return NaN;
      })
      .filter((value) => Number.isFinite(value));
  }

  static getEntityTrend(entity: { attributes?: Record<string, unknown> } | undefined): number[] {
    if (!entity?.attributes) return [];

    const candidates = [
      entity.attributes.history,
      entity.attributes.values,
      entity.attributes.recent_values,
      entity.attributes.trend,
      entity.attributes.samples,
      entity.attributes.sparkline,
    ];

    for (const candidate of candidates) {
      const values = this.extractNumericSeries(candidate);
      if (values.length >= 2) return values.slice(-12);
    }

    return [];
  }

  static getTrendDelta(values: number[]): number | undefined {
    if (values.length < 2) return undefined;
    return values[values.length - 1] - values[0];
  }
}
