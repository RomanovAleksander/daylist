import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Typography } from '@mui/material';

import type { Goal, GoalStep } from '@/db';
import type { DateKey } from '@/utils/date';

import { GoalRing } from './GoalRing';
import { moveGoalToGlobal, setGoalAchieved } from '../api/goals.api';
import { formatAchievedAt, formatDeadline } from '../utils/format';
import { daysLeft, formatAmount, isOverdue, neededPerMonth } from '../utils/progress';

interface Props {
  goal: Goal;
  steps: GoalStep[];
  today: DateKey;
  onAddAmount: () => void;
  onNewDate: () => void;
}

const bigButtonSx = { borderRadius: 3.5, fontWeight: 700, py: 1.5 } as const;

/** Центр экрана цели: кольцо, одна строка контекста и одна главная кнопка. */
export const GoalPrimary: FC<Props> = ({ goal, steps, today, onAddAmount, onNewDate }) => {
  const { t } = useTranslation();

  const overdue = isOverdue(goal, today);
  const left = goal.kind === 'dated' && goal.deadline ? daysLeft(goal.deadline, today) : null;
  const perMonth = neededPerMonth(goal, today);

  const context = () => {
    if (goal.achievedAt)
      return t('goals.card.achievedOnDate', { date: formatAchievedAt(goal.achievedAt) });
    if (left === null || !goal.deadline)
      return goal.kind === 'dream' ? t('goals.dream') : t('goals.noDate');
    if (overdue) return t('goals.deadlinePassed', { date: formatDeadline(goal.deadline) });
    const days = `${left} ${t('goals.daysWord', { count: left })}`;
    return perMonth === null
      ? `${days} · ${t('goals.until', { date: formatDeadline(goal.deadline) })}`
      : t('goals.card.daysAndPerMonth', {
          days,
          perMonth: formatAmount(Math.ceil(perMonth), goal.unit),
        });
  };

  const primary = () => {
    if (goal.achievedAt || goal.measure === 'steps') return null;
    if (goal.measure === 'number') {
      return (
        <Button
          fullWidth
          variant="contained"
          disableElevation
          size="large"
          onClick={onAddAmount}
          sx={bigButtonSx}
        >
          {t('goals.card.addAmountButton')}
        </Button>
      );
    }
    return (
      <Button
        fullWidth
        variant="contained"
        disableElevation
        size="large"
        onClick={() => void setGoalAchieved(goal.id, true)}
        sx={bigButtonSx}
      >
        {goal.kind === 'dream' ? t('goals.card.dreamCame') : t('goals.card.markAchieved')}
      </Button>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, mt: 1 }}>
      <GoalRing goal={goal} steps={steps} today={today} size={160} detailed />
      <Typography
        sx={{
          color: overdue ? 'warning.main' : 'text.secondary',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        {context()}
      </Typography>
      {overdue ? (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            disableElevation
            onClick={() => void setGoalAchieved(goal.id, true)}
            sx={{ borderRadius: 3 }}
          >
            {t('goals.achieve')}
          </Button>
          <Button color="inherit" onClick={onNewDate}>
            {t('goals.newDate')}
          </Button>
          <Button color="inherit" onClick={() => void moveGoalToGlobal(goal.id)}>
            {t('goals.toGlobal')}
          </Button>
        </Box>
      ) : (
        primary()
      )}
    </Box>
  );
};
