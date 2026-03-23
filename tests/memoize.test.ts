import { describe, it, expect, vi } from 'vitest';
import { memoize, createMemo } from '../src/utils/memoize';

describe('memoize', () => {
  it('caches the result of a pure function', () => {
    const fn = vi.fn((x: unknown, y: unknown) => (x as number) + (y as number));
    const memoized = memoize(fn);

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1); // computed only once
  });

  it('recomputes for different arguments', () => {
    const fn = vi.fn((x: unknown) => (x as number) * 2);
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(10)).toBe(20);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('uses a custom resolver when provided', () => {
    const fn = vi.fn((obj: unknown) => (obj as { value: number }).value);
    const memoized = memoize(fn, (obj) => String((obj as { value: number }).value));

    const a = { value: 42 };
    const b = { value: 42 };
    expect(memoized(a)).toBe(42);
    expect(memoized(b)).toBe(42); // same key → cached
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not throw on non-serializable arguments', () => {
    const fn = vi.fn(() => 'ok');
    const memoized = memoize(fn);

    const circular: Record<string, unknown> = {};
    circular.self = circular;

    // Should not throw — falls back to unique key so result is not cached
    expect(() => memoized(circular)).not.toThrow();
    expect(() => memoized(circular)).not.toThrow();
    expect(fn).toHaveBeenCalledTimes(2); // not cached due to non-serializable fallback
  });

  it('evicts oldest entry when cache exceeds 100 entries', () => {
    const fn = vi.fn((x: unknown) => x);
    const memoized = memoize(fn);

    // Fill cache with 101 unique keys (0..100).
    // When key 100 is added the cache reaches size 101 → key 0 is evicted.
    for (let i = 0; i <= 100; i++) {
      memoized(i);
    }
    expect(fn).toHaveBeenCalledTimes(101);

    // Key 0 was evicted — calling it again triggers a recompute
    memoized(0);
    expect(fn).toHaveBeenCalledTimes(102);

    // Re-inserting key 0 evicted key 1 — key 2 should still be cached
    memoized(2);
    expect(fn).toHaveBeenCalledTimes(102);
  });
});

describe('createMemo', () => {
  it('returns a cached value until update() is called', () => {
    let counter = 0;
    const memo = createMemo(() => ++counter);

    expect(memo.value).toBe(1);
    expect(memo.value).toBe(1); // cached

    memo.update();
    expect(memo.isDirty).toBe(true);
    expect(memo.value).toBe(2); // recomputed
  });
});
