import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { Box, ButtonBase, LinearProgress, Typography } from '@mui/material';

import { goalPath } from '@/config/pages.config';
import type { Goal, GoalStep } from '@/db';
import type { DateKey } from '@/utils/date';

import { formatDeadline } from '../utils/format';
import {
  daysLeft,
  formatAmount,
  goalProgress,
  isOverdue,
  nextStep,
  timeRatio,
} from '../utils/progress';

interface Props {
  goal: Goal;
  steps: GoalStep[];
  today: DateKey;
}

/** Строка цели: название и дни до дедлайна, под ними что дальше и тонкая полоса прогресса. */
export const GoalRow: FC<Props> = ({ goal, steps, today }) => {
  const { t } = useTranslation();

  const progress = goalProgress(goal, steps);
  const left = goal.kind === 'dated' && goal.deadline ? daysLeft(goal.deadline, today) : null;
  const overdue = isOverdue(goal, today);
  const next = nextStep(steps);

  // Без меры прогресса полоса показывает прошедшее время — серым, чтобы не путать с прогрессом.
  const time =
    goal.kind === 'dated' && goal.deadline ? timeRatio(goal.startDate, goal.deadline, today) : null;
  const measured = progress !== null && (progress.kind !== 'steps' || progress.total > 0);
  const bar = measured ? progress.ratio : time;

  const subtitle = () => {
    if (progress?.kind === 'number') {
      return t('goals.amount', {
        current: formatAmount(progress.current, goal.unit),
        target: formatAmount(progress.target, goal.unit),
      });
    }
    if (progress?.kind === 'steps') {
      if (progress.total === 0) return t('goals.noSteps');
      const done = t('goals.stepsDone', { done: progress.done, total: progress.total });
      return next ? `${done} · ${t('goals.next', { text: next.text })}` : done;
    }
    if (goal.deadline)
      return t(overdue ? 'goals.deadlinePassed' : 'goals.until', {
        date: formatDeadline(goal.deadline),
      });
    return goal.kind === 'dated' ? t('goals.setDate') : t('goals.noDate');
  };

  return (
    <ButtonBase
      component={RouterLink}
      to={goalPath(goal.id)}
      aria-label={t('goals.open', { title: goal.title })}
      sx={{ display: 'block', width: '100%', py: 1.5, textAlign: 'left' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
        <Typography component="h3" sx={{ flex: 1, fontWeight: 600, overflowWrap: 'anywhere' }}>
          {goal.title}
        </Typography>
        {left !== null && (
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              fontVariantNumeric: 'tabular-nums',
              color: overdue ? 'warning.main' : 'text.secondary',
            }}
          >
            {overdue
              ? t('goals.overdue', { count: -left })
              : `${left} ${t('goals.daysWord', { count: left })}`}
          </Typography>
        )}
      </Box>
      <Typography
        sx={{
          mt: 0.25,
          fontSize: 13,
          color: overdue ? 'warning.main' : 'text.secondary',
          overflowWrap: 'anywhere',
        }}
      >
        {subtitle()}
      </Typography>
      {bar !== null && (
        <LinearProgress
          variant="determinate"
          value={Math.round(bar * 100)}
          aria-label={t('goals.ringLabel', { title: goal.title })}
          sx={{
            mt: 1,
            height: 6,
            borderRadius: 3,
            bgcolor: 'divider',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              bgcolor: measured ? 'primary.main' : 'text.disabled',
            },
          }}
        />
      )}
    </ButtonBase>
  );
};
