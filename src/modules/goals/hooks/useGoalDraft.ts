import { useState } from 'react';

import type { GoalMeasure } from '@/db';
import { endOfMonth, endOfYear, type DateKey } from '@/utils/date';

export type DateChoice = 'month' | 'year' | 'custom' | 'none' | 'dream';

export interface GoalDraft {
  title: string;
  dateChoice: DateChoice | null;
  customDate: DateKey;
  measure: GoalMeasure;
  target: string;
  unit: string;
}

/** Черновик новой цели: выбранные варианты и производные от них дедлайн и готовность. */
export const useGoalDraft = (today: DateKey) => {
  const [draft, setDraft] = useState<GoalDraft>({
    title: '',
    dateChoice: null,
    customDate: '',
    measure: 'none',
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
    dream: undefined,
  }[draft.dateChoice ?? 'none'];

  const target = Number(draft.target.replace(',', '.'));

  const ready =
    draft.title.trim() !== '' &&
    draft.dateChoice !== null &&
    (draft.dateChoice !== 'custom' || !!draft.customDate) &&
    (draft.dateChoice === 'dream' || draft.measure !== 'number' || target > 0);

  return { draft, update, deadline, target, ready };
};
