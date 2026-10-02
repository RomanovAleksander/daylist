import { describe, expect, it } from 'vitest';

import { ageOf, isRecentlyDone } from './age';

const DAY = 86_400_000;
const NOW = 100 * DAY;

describe('ageOf', () => {
  it('rounds age down to the coarsest useful unit', () => {
    expect(ageOf(NOW - 5 * 60_000, NOW)).toEqual({ unit: 'now', count: 0 });
    expect(ageOf(NOW - 3 * DAY, NOW)).toEqual({ unit: 'days', count: 3 });
    expect(ageOf(NOW - 15 * DAY, NOW)).toEqual({ unit: 'weeks', count: 2 });
    expect(ageOf(NOW - 95 * DAY, NOW)).toEqual({ unit: 'months', count: 3 });
  });
});

describe('isRecentlyDone', () => {
  it('keeps done items for 30 days', () => {
    expect(isRecentlyDone(NOW - 30 * DAY, NOW)).toBe(true);
    expect(isRecentlyDone(NOW - 31 * DAY, NOW)).toBe(false);
    expect(isRecentlyDone(undefined, NOW)).toBe(false);
  });
});
