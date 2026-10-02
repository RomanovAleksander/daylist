import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import type { Goal } from '@/db';
import { Card } from '@/ui/Card';
import type { DateKey } from '@/utils/date';

import { GoalBar } from './GoalBar';
import { formatAmount, neededPerMonth, timeRatio, type Progress } from '../utils/progress';

interface Props {
  goal: Goal;
  progress: Progress;
  deadline: DateKey;
  today: DateKey;
}

/** Прогресс рядом со временем: риска на полосе — где был бы прогресс при ровном темпе. */
export const GoalProgressCard: FC<Props> = ({ goal, progress, deadline, today }) => {
  const { t } = useTranslation();

  const perMonth = neededPerMonth(goal, today);

  const value =
    progress.kind === 'number'
      ? `${formatAmount(progress.current, goal.unit)} `
      : t('goals.stepsDone', { done: progress.done, total: progress.total });

  return (
    <Card>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {value}
            {progress.kind === 'number' && (
              <Typography component="span" sx={{ color: 'text.secondary', fontSize: 14 }}>
                {t('goals.card.ofTarget', { target: formatAmount(progress.target, goal.unit) })}
              </Typography>
            )}
          </Typography>
          <Typography sx={{ ml: 'auto', color: 'text.secondary', fontWeight: 600, fontSize: 14 }}>
            {t('goals.ringPercent', { percent: Math.round(progress.ratio * 100) })}
          </Typography>
        </Box>
        <GoalBar
          ratio={progress.ratio}
          tone="progress"
          marker={timeRatio(goal.startDate, deadline, today)}
          label={t('goals.ringLabel', { title: goal.title })}
        />
        {progress.kind === 'number' && progress.current < progress.target && (
          <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
            {perMonth === null
              ? t('goals.card.left', {
                  rest: formatAmount(progress.target - progress.current, goal.unit),
                })
              : t('goals.card.leftPerMonth', {
                  rest: formatAmount(progress.target - progress.current, goal.unit),
                  perMonth: formatAmount(Math.ceil(perMonth), goal.unit),
                })}
          </Typography>
        )}
      </Box>
    </Card>
  );
};
