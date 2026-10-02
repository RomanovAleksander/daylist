import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import type { Goal } from '@/db';

import { formatAmount, type Progress } from '../utils/progress';

interface Props {
  goal: Goal;
  progress: Progress;
}

/** Подпись под полосой прогресса: «2 з 4 кроків» или «$4 315 з $12 000 · 36%». */
export const ProgressMeta: FC<Props> = ({ goal, progress }) => {
  const { t } = useTranslation();

  return progress.kind === 'steps'
    ? t('goals.steps', { done: progress.done, total: progress.total })
    : t('goals.number', {
        current: formatAmount(progress.current, goal.unit),
        target: formatAmount(progress.target, goal.unit),
        percent: Math.round(progress.ratio * 100),
      });
};
