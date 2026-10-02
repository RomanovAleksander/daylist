import { useState } from 'react';

import type { GoalMeasure } from '@/db';
import { endOfMonth, endOfYear, type DateKey } from '@/utils/date';

export type DateChoice = 'month' | 'year' | 'custom' | 'none';
export type KindChoice = 'goal' | 'dream';

export interface GoalDraft {
  title: string;
  kind: KindChoice;
  dateChoice: DateChoice | null;
  customDate: DateKey;
  measure: GoalMeasure | null;
  target: string;
  unit: string;
}

/** Черновик цели для мастера: ответы на шаги и производные дедлайн и тип. */
export const useGoalDraft = (today: DateKey) => {
  const [draft, setDraft] = useState<GoalDraft>({
    title: '',
    kind: 'goal',
    dateChoice: null,
    customDate: '',
    measure: null,
    target: '',
    unit: '',
  });

  const update = (changes: Partial<GoalDraft>) =>
    setDraft((current) => ({ ...current, ...changes }));

  const deadline: DateKey | undefined = {
    month: endOfMonth(today),
    year: endOfYear(today),
    custom: draft.customDate || undefined,
    none: undefined,
  }[draft.dateChoice ?? 'none'];

  return { draft, update, deadline };
};
