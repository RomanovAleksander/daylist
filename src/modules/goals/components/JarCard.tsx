import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { Box, ButtonBase, Typography } from '@mui/material';

import { goalPath } from '@/config/pages.config';
import type { Goal, GoalStep } from '@/db';
import type { DateKey } from '@/utils/date';

import { GoalRing } from './GoalRing';
import { formatDeadline } from '../utils/format';
import { daysLeft, formatAmount, goalProgress, isOverdue, nextStep } from '../utils/progress';

interface Props {
  goal: Goal;
  steps: GoalStep[];
  today: DateKey;
}

/** Одна карточка — одна цель: кольцо, название, что дальше, сколько дней осталось. */
export const JarCard: FC<Props> = ({ goal, steps, today }) => {
  const { t } = useTranslation();

  const progress = goalProgress(goal, steps);
  const left = goal.kind === 'dated' && goal.deadline ? daysLeft(goal.deadline, today) : null;
  const overdue = isOverdue(goal, today);
  const next = nextStep(steps);

  const subtitle = () => {
    if (progress?.kind === 'number') {
      return t('goals.number', {
        current: formatAmount(progress.current, goal.unit),
        target: formatAmount(progress.target, goal.unit),
        percent: Math.round(progress.ratio * 100),
      });
    }
    if (progress?.kind === 'steps' && next) return t('goals.next', { text: next.text });
    if (goal.kind === 'dream') return t('goals.dream');
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
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: 5.5,
        p: 1.75,
        mb: 1.25,
        gap: 1.5,
        justifyContent: 'flex-start',
        textAlign: 'left',
      }}
    >
      <GoalRing goal={goal} steps={steps} today={today} size={60} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography component="h3" sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>
          {goal.title}
        </Typography>
        <Typography
          sx={{
            color: overdue ? 'warning.main' : 'text.secondary',
            fontSize: 13,
            overflowWrap: 'anywhere',
          }}
        >
          {subtitle()}
        </Typography>
      </Box>
      {left !== null && (
        <Box sx={{ textAlign: 'right', flex: 'none' }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 20,
              lineHeight: 1.1,
              color: overdue ? 'warning.main' : 'text.primary',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {overdue ? t('goals.overdue', { count: -left }) : left}
          </Typography>
          {!overdue && (
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
              {t('goals.daysWord', { count: left })}
            </Typography>
          )}
        </Box>
      )}
    </ButtonBase>
  );
};
