import { db, type Goal, type GoalKind } from '@/db';
import type { DateKey } from '@/utils/date';
import { createId } from '@/utils/id';
import { reorderKeys } from '@/utils/order';

export type GoalChanges = Partial<Omit<Goal, 'id' | 'updatedAt'>>;

/** Транзакция: см. addCategory — иначе две быстро добавленные цели получат один order. */
export const addGoal = (kind: GoalKind, title: string, today: DateKey, extra: GoalChanges = {}) =>
  db.transaction('rw', db.goals, async () => {
    const all = await db.goals.toArray();
    const goal: Goal = {
      id: createId(),
      kind,
      title,
      description: '',
      startDate: today,
      measure: 'none',
      order: Math.max(0, ...all.map((g) => g.order)) + 1,
      updatedAt: Date.now(),
      ...extra,
    };
    await db.goals.add(goal);
    return goal.id;
  });

export const updateGoal = (id: string, changes: GoalChanges) =>
  db.goals.update(id, { ...changes, updatedAt: Date.now() });

export const setGoalAchieved = (id: string, achieved: boolean) =>
  updateGoal(id, { achievedAt: achieved ? Date.now() : undefined });

/** Цель без даты: дедлайн убираем, чтобы она не висела просроченной. */
export const moveGoalToGlobal = (id: string) =>
  updateGoal(id, { kind: 'global', deadline: undefined });

export const addToGoalCurrent = async (id: string, delta: number) => {
  const goal = await db.goals.get(id);
  if (goal) await updateGoal(id, { current: (goal.current ?? 0) + delta });
};

export const deleteGoal = (id: string) =>
  db.transaction('rw', db.goals, db.goalSteps, async () => {
    const tombstone = { deleted: true as const, updatedAt: Date.now() };
    await db.goals.update(id, tombstone);
    await db.goalSteps.where('goalId').equals(id).modify(tombstone);
  });

export const addGoalStep = (goalId: string, text: string) =>
  db.transaction('rw', db.goalSteps, async () => {
    const steps = await db.goalSteps.where('goalId').equals(goalId).toArray();
    await db.goalSteps.add({
      id: createId(),
      goalId,
      text,
      done: false,
      order: Math.max(0, ...steps.map((s) => s.order)) + 1,
      updatedAt: Date.now(),
    });
  });

export const setGoalStepDone = (id: string, done: boolean) =>
  db.goalSteps.update(id, { done, updatedAt: Date.now() });

export const updateGoalStepText = (id: string, text: string) =>
  db.goalSteps.update(id, { text, updatedAt: Date.now() });

/** Активные цели и мечты — отдельные списки: каждый переставляет только свои ключи. */
export const reorderGoals = (goals: Goal[], ids: string[]) => {
  const keys = reorderKeys(ids, new Map(goals.map((goal) => [goal.id, goal.order])));
  const updatedAt = Date.now();
  return db.goals.bulkUpdate(
    [...keys].map(([id, order]) => ({ key: id, changes: { order, updatedAt } }))
  );
};

export const reorderGoalSteps = (ids: string[]) => {
  const updatedAt = Date.now();
  return db.goalSteps.bulkUpdate(
    ids.map((id, index) => ({ key: id, changes: { order: index + 1, updatedAt } }))
  );
};

export const deleteGoalStep = (id: string) =>
  db.goalSteps.update(id, { deleted: true, updatedAt: Date.now() });
