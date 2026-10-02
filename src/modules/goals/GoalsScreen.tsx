import { useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';

import { useToday } from '@/hooks/useToday';
import { Card } from '@/ui/Card';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { SortableItem, SortableList } from '@/ui/SortableList';

import { reorderGoals } from './api/goals.api';
import { AchievedSection } from './components/AchievedSection';
import { DreamsSection } from './components/DreamsSection';
import { GoalRow } from './components/GoalRow';
import { NewGoalSheet } from './components/NewGoalSheet';
import { useGoals } from './hooks/useGoals';

export const GoalsScreen: FC = () => {
  const [creating, setCreating] = useState(false);

  const { t } = useTranslation();

  const today = useToday();
  const data = useGoals();

  const { active, dreams, achieved } = useMemo(() => {
    const goals = data?.goals ?? [];
    const open = goals.filter((goal) => !goal.achievedAt).sort((a, b) => a.order - b.order);
    return {
      active: open.filter((goal) => goal.kind !== 'dream'),
      dreams: open.filter((goal) => goal.kind === 'dream'),
      achieved: goals
        .filter((goal) => goal.achievedAt)
        .sort((a, b) => (b.achievedAt ?? 0) - (a.achievedAt ?? 0)),
    };
  }, [data]);

  if (!data) return null;

  return (
    <>
      <ScreenHeader
        title={t('nav.goals')}
        action={
          <Button
            onClick={() => setCreating(true)}
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            aria-label={t('goals.addAria')}
            sx={{ fontWeight: 700 }}
          >
            {t('goals.add')}
          </Button>
        }
      />
      {data.goals.length === 0 && (
        <Typography sx={{ color: 'text.secondary', my: 2 }}>{t('goals.empty')}</Typography>
      )}
      {active.length > 0 && (
        <Card>
          <SortableList
            ids={active.map((goal) => goal.id)}
            onReorder={(ids) => void reorderGoals(active, ids)}
          >
            {active.map((goal) => (
              <SortableItem key={goal.id} id={goal.id}>
                <GoalRow goal={goal} steps={data.stepsByGoal.get(goal.id) ?? []} today={today} />
              </SortableItem>
            ))}
          </SortableList>
        </Card>
      )}
      <DreamsSection dreams={dreams} />
      <AchievedSection goals={achieved} />
      {creating && <NewGoalSheet onClose={() => setCreating(false)} />}
    </>
  );
};
