export type AgeUnit = 'now' | 'days' | 'weeks' | 'months';

const DAY = 24 * 60 * 60 * 1000;

/** Сколько задача лежит во вхідних: грубо, чтобы взгляд цеплялся только за старое. */
export const ageOf = (createdAt: number, now: number): { unit: AgeUnit; count: number } => {
  const days = Math.floor((now - createdAt) / DAY);
  if (days < 1) return { unit: 'now', count: 0 };
  if (days < 14) return { unit: 'days', count: days };
  if (days < 60) return { unit: 'weeks', count: Math.floor(days / 7) };
  return { unit: 'months', count: Math.floor(days / 30) };
};

export const DONE_VISIBLE_DAYS = 30;

export const isRecentlyDone = (doneAt: number | undefined, now: number) =>
  doneAt !== undefined && now - doneAt <= DONE_VISIBLE_DAYS * DAY;
