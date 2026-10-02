import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import type { Goal, GoalStep } from '@/db';
import type { DateKey } from '@/utils/date';

import { Meter } from './Meter';
import { ProgressMeta } from './ProgressMeta';
import { formatDeadline } from '../utils/format';
import { daysLeft, goalProgress, isOverdue, timeRatio } from '../utils/progress';

interface Props {
  goal: Goal;
  steps: GoalStep[];
  today: DateKey;
}

const metaSx = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 1,
  color: 'text.secondary',
  fontSize: 13,
} as const;

/** Шапка карточки: сколько дней осталось, сколько прошло времени и где прогресс. */
export const GoalSummary: FC<Props> = ({ goal, steps, today }) => {
  const { t } = useTranslation();

  const progress = goalProgress(goal, steps);
  const overdue = isOverdue(goal, today);
  const left = goal.kind === 'dated' && goal.deadline ? daysLeft(goal.deadline, today) : null;
  const time =
    left !== null && goal.deadline ? timeRatio(goal.startDate, goal.deadline, today) : null;
  const percent = Math.round((time ?? 0) * 100);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {left !== null && goal.deadline && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography sx={{ color: overdue ? 'warning.main' : 'text.secondary' }}>
              {t(overdue ? 'goals.deadlinePassed' : 'goals.until', {
                date: formatDeadline(goal.deadline),
              })}
            </Typography>
            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color: overdue ? 'warning.main' : 'text.primary',
              }}
            >
              {overdue ? t('goals.overdue', { count: -left }) : left}
              {!overdue && (
                <Typography
                  component="span"
                  sx={{ fontSize: 13, color: 'text.secondary', ml: 0.75 }}
                >
                  {t('goals.daysLeft', { count: left })}
                </Typography>
              )}
            </Typography>
          </Box>
          <Meter ratio={time ?? 1} tone="time" label={t('goals.timeElapsed', { percent })} />
          <Box sx={metaSx}>
            <span>{t('goals.card.created', { date: formatDeadline(goal.startDate) })}</span>
            <span>{t('goals.timeElapsed', { percent })}</span>
          </Box>
        </>
      )}
      {progress && (
        <>
          <Meter ratio={progress.ratio} label={goal.title} />
          <Box sx={metaSx}>
            <ProgressMeta goal={goal} progress={progress} />
          </Box>
        </>
      )}
    </Box>
  );
};
