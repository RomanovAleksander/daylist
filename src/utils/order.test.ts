import { describe, expect, it } from 'vitest';

import { reorderKeys } from './order';

describe('reorderKeys', () => {
  it('hands the same keys out in the new sequence', () => {
    const keys = new Map([
      ['a', 1],
      ['b', 5],
      ['c', 9],
    ]);
    expect([...reorderKeys(['c', 'a', 'b'], keys)]).toEqual([
      ['c', 1],
      ['a', 5],
      ['b', 9],
    ]);
  });
});
