import { useLiveQuery } from 'dexie-react-hooks';

import { db, type Goal, type GoalStep } from '@/db';

export interface GoalsData {
  goals: Goal[];
  stepsByGoal: Map<string, GoalStep[]>;
}

export const useGoals = (): GoalsData | undefined =>
  useLiveQuery(async () => {
    const [goals, steps] = await Promise.all([db.goals.toArray(), db.goalSteps.toArray()]);
    const stepsByGoal = new Map<string, GoalStep[]>();
    for (const step of steps.filter((s) => !s.deleted).sort((a, b) => a.order - b.order)) {
      stepsByGoal.set(step.goalId, [...(stepsByGoal.get(step.goalId) ?? []), step]);
    }
    return {
      goals: goals.filter((g) => !g.deleted).sort((a, b) => a.order - b.order),
      stepsByGoal,
    };
  }, []);

/** `null` — цели нет (удалена или чужая ссылка), `undefined` — ещё читаем базу. */
export const useGoal = (id: string): { goal: Goal; steps: GoalStep[] } | null | undefined =>
  useLiveQuery(async () => {
    const goal = await db.goals.get(id);
    if (!goal || goal.deleted) return null;
    const steps = await db.goalSteps.where('goalId').equals(id).toArray();
    return { goal, steps: steps.filter((s) => !s.deleted).sort((a, b) => a.order - b.order) };
  }, [id]);
