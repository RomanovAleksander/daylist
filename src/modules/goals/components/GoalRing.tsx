import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

import type { Goal, GoalStep } from '@/db';
import { ProgressRing } from '@/ui/ProgressRing';
import type { DateKey } from '@/utils/date';

import { formatAmount, goalProgress, timeRatio } from '../utils/progress';

interface Props {
  goal: Goal;
  steps: GoalStep[];
  today: DateKey;
  size: number;
  /** На экране цели в центре сумма, в списке — проценты: там мало места. */
  detailed?: boolean;
}

/** Кольцо цели: прогресс, а без меры прогресса — прошедшее время до дедлайна. */
export const GoalRing: FC<Props> = ({ goal, steps, today, size, detailed }) => {
  const { t } = useTranslation();

  // Цель «кроками» без единого шага ещё нечем мерить: показываем время, а не «0/0».
  const raw = goalProgress(goal, steps);
  const progress = raw?.kind === 'steps' && raw.total === 0 ? null : raw;
  const time =
    goal.kind === 'dated' && goal.deadline ? timeRatio(goal.startDate, goal.deadline, today) : null;
  const ratio = goal.achievedAt ? 1 : (progress?.ratio ?? time ?? 0);

  const big = {
    fontWeight: 700,
    fontSize: detailed ? 24 : 14,
    fontVariantNumeric: 'tabular-nums',
  } as const;

  const center = () => {
    if (goal.achievedAt) return <Typography sx={big}>✓</Typography>;
    if (progress?.kind === 'steps') {
      return (
        <Typography sx={big}>
          {t('goals.ringSteps', { done: progress.done, total: progress.total })}
        </Typography>
      );
    }
    if (progress?.kind === 'number' && detailed) {
      return (
        <>
          <Typography sx={big}>{formatAmount(progress.current, goal.unit)}</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            {formatAmount(progress.target, goal.unit)}
          </Typography>
        </>
      );
    }
    if (progress || time !== null) {
      return (
        <Typography sx={big}>
          {t('goals.ringPercent', { percent: Math.round(ratio * 100) })}
        </Typography>
      );
    }
    return (
      <Typography sx={{ ...big, color: 'primary.main' }}>
        {goal.kind === 'dream' ? '✦' : '→'}
      </Typography>
    );
  };

  return (
    <ProgressRing
      ratio={ratio}
      size={size}
      thickness={detailed ? 3.5 : 4.5}
      label={t('goals.ringLabel', { title: goal.title })}
    >
      {center()}
    </ProgressRing>
  );
};
