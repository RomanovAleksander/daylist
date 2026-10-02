import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import type { Goal, GoalStep } from '@/db';
import type { DateKey } from '@/utils/date';

import { GoalActions } from './GoalActions';
import { GoalProgressCard } from './GoalProgressCard';
import { GoalRing } from './GoalRing';
import { GoalTimeline } from './GoalTimeline';
import { formatAchievedAt } from '../utils/format';
import { goalProgress, isOverdue } from '../utils/progress';

interface Props {
  goal: Goal;
  steps: GoalStep[];
  today: DateKey;
  onAddAmount: () => void;
  onNewDate: () => void;
}

/**
 * Центр экрана цели. С дедлайном главное — время: дни крупно, шкала и прогресс с риской темпа.
 * Без дедлайна (глобальная, мечта, уже достигнутая) — кольцо и одна строка контекста.
 */
export const GoalPrimary: FC<Props> = ({ goal, steps, today, onAddAmount, onNewDate }) => {
  const { t } = useTranslation();

  const overdue = isOverdue(goal, today);
  const progress = goalProgress(goal, steps);
  const measured = progress !== null && (progress.kind !== 'steps' || progress.total > 0);
  const actions = (
    <GoalActions goal={goal} overdue={overdue} onAddAmount={onAddAmount} onNewDate={onNewDate} />
  );

  if (goal.kind === 'dated' && goal.deadline && !goal.achievedAt) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <GoalTimeline startDate={goal.startDate} deadline={goal.deadline} today={today} />
        {measured && (
          <GoalProgressCard
            goal={goal}
            progress={progress}
            deadline={goal.deadline}
            today={today}
          />
        )}
        {actions}
      </Box>
    );
  }

  const context = () => {
    if (goal.achievedAt)
      return t('goals.card.achievedOnDate', { date: formatAchievedAt(goal.achievedAt) });
    if (goal.kind === 'dream') return t('goals.dream');
    return goal.kind === 'dated' ? t('goals.setDate') : t('goals.noDate');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, mt: 1 }}>
      <GoalRing goal={goal} steps={steps} today={today} size={160} detailed />
      <Typography sx={{ color: 'text.secondary', fontSize: 14, textAlign: 'center' }}>
        {context()}
      </Typography>
      {actions}
    </Box>
  );
};
