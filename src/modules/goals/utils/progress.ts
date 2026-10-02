import type { Goal, GoalStep } from '@/db';
import { diffDays, type DateKey } from '@/utils/date';

export type Progress =
  | { kind: 'steps'; done: number; total: number; ratio: number }
  | { kind: 'number'; current: number; target: number; ratio: number };

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const daysLeft = (deadline: DateKey, today: DateKey) => diffDays(deadline, today);

/** Доля прошедшего времени от создания цели до дедлайна. */
export const timeRatio = (startDate: DateKey, deadline: DateKey, today: DateKey) => {
  const total = diffDays(deadline, startDate);
  return total <= 0 ? 1 : clamp01(diffDays(today, startDate) / total);
};

export const goalProgress = (goal: Goal, steps: GoalStep[]): Progress | null => {
  if (goal.measure === 'steps') {
    const live = steps.filter((step) => !step.deleted);
    const done = live.filter((step) => step.done).length;
    return { kind: 'steps', done, total: live.length, ratio: live.length ? done / live.length : 0 };
  }
  if (goal.measure === 'number' && goal.target) {
    const current = goal.current ?? 0;
    return { kind: 'number', current, target: goal.target, ratio: clamp01(current / goal.target) };
  }
  return null;
};

export const isOverdue = (goal: Goal, today: DateKey) =>
  goal.kind === 'dated' &&
  !goal.achievedAt &&
  !!goal.deadline &&
  daysLeft(goal.deadline, today) < 0;

const DAYS_IN_MONTH = 30.4;

/** Сколько нужно добирать в месяц, чтобы успеть к дедлайну; `null`, если считать нечего. */
export const neededPerMonth = (goal: Goal, today: DateKey): number | null => {
  if (goal.measure !== 'number' || !goal.target || !goal.deadline) return null;
  const rest = goal.target - (goal.current ?? 0);
  const left = daysLeft(goal.deadline, today);
  if (rest <= 0 || left <= 0) return null;
  return rest / Math.max(1, left / DAYS_IN_MONTH);
};

const PREFIX_UNITS = new Set(['$', '€', '£']);
const numberFormat = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

export const formatAmount = (value: number, unit = '') => {
  const number = numberFormat.format(value);
  if (!unit) return number;
  return PREFIX_UNITS.has(unit) ? `${unit}${number}` : `${number} ${unit}`;
};

export const nextStep = (steps: GoalStep[]) => steps.find((step) => !step.deleted && !step.done);

/** «4 315», «4315,5», «12 000» → число; пустое или мусор — `undefined`. */
export const parseAmount = (value: string): number | undefined => {
  const number = Number(value.replace(',', '.').replace(/\s/g, ''));
  return value.trim() === '' || Number.isNaN(number) ? undefined : number;
};
