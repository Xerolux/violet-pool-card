/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Utility: Memoize – Caching von aufwendigen Berechnungen zur Performance-Optimierung
 * Erstellt von Xerolux | MIT License
 */

const MAX_CACHE_SIZE = 100;

/**
 * Safely serialize cache arguments. Falls back to a unique sentinel
 * when JSON.stringify fails (e.g. circular references or BigInt values).
 */
function serializeArgs(args: unknown[]): string {
  try {
    return JSON.stringify(args);
  } catch {
    // Non-serializable arguments — use identity-based key via WeakMap is
    // not possible for primitives, so we fall back to a unique symbol per
    // call, effectively disabling caching for that call (correct behaviour).
    return `__non_serializable_${Date.now()}_${Math.random()}`;
  }
}

export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, unknown>();

  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : serializeArgs(args as unknown[]);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    // FIFO eviction: keep cache bounded to MAX_CACHE_SIZE
    if (cache.size > MAX_CACHE_SIZE) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey as string);
      }
    }

    return result;
  }) as T;
}

/**
 * Creates a memoized value that only recalculates when dependencies change.
 * Dependencies are compared by reference (Object.is).
 */
export function createMemo<T>(
  fn: () => T,
  deps: unknown[] = []
): { value: T; isDirty: boolean; update: () => void } {
  let cachedValue: T | undefined;
  let cachedDeps: unknown[] = [];
  let isDirty = true;

  return {
    get value(): T {
      if (isDirty || !areDepsEqual(cachedDeps, deps)) {
        cachedValue = fn();
        cachedDeps = [...deps];
        isDirty = false;
      }
      return cachedValue as T;
    },
    get isDirty(): boolean {
      return isDirty || !areDepsEqual(cachedDeps, deps);
    },
    update: () => {
      isDirty = true;
    },
  };
}

function areDepsEqual(prevDeps: unknown[], nextDeps: unknown[]): boolean {
  if (prevDeps.length !== nextDeps.length) return false;
  for (let i = 0; i < prevDeps.length; i++) {
    if (!Object.is(prevDeps[i], nextDeps[i])) {
      return false;
    }
  }
  return true;
}
