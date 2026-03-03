/**
 * Simple memoization utility for expensive calculations
 * Caches function results based on arguments
 */

export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, unknown>();

  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value as string;
      cache.delete(firstKey);
    }

    return result;
  }) as T;
}

/**
 * Creates a memoized version of a function that only recalculates
 * when dependencies change
 */
export function createMemo<T>(
  fn: () => T,
  deps: unknown[] = []
): { value: T; isDirty: boolean; update: () => void } {
  let cachedValue: T;
  let cachedDeps: unknown[] = [];
  let isDirty = true;

  return {
    get value(): T {
      if (isDirty || !areDepsEqual(cachedDeps, deps)) {
        cachedValue = fn();
        cachedDeps = [...deps];
        isDirty = false;
      }
      return cachedValue;
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
