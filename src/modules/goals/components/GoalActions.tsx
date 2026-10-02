import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button } from '@mui/material';

import type { Goal } from '@/db';

import { moveGoalToGlobal, setGoalAchieved } from '../api/goals.api';

interface Props {
  goal: Goal;
  overdue: boolean;
  onAddAmount: () => void;
  onNewDate: () => void;
}

/** Одна главная кнопка; у просроченной цели — три выхода. У целей «кроками» действие — сами шаги. */
export const GoalActions: FC<Props> = ({ goal, overdue, onAddAmount, onNewDate }) => {
  const { t } = useTranslation();

  if (overdue) {
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          disableElevation
          onClick={() => void setGoalAchieved(goal.id, true)}
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
    );
  }
  if (goal.achievedAt || goal.measure === 'steps') return null;
  if (goal.measure === 'number') {
    return (
      <Button fullWidth variant="contained" disableElevation size="large" onClick={onAddAmount}>
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
    >
      {goal.kind === 'dream' ? t('goals.card.dreamCame') : t('goals.card.markAchieved')}
    </Button>
  );
};
