import { useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';

import { useToday } from '@/hooks/useToday';
import { ScreenHeader } from '@/ui/ScreenHeader';

import { AchievedSection } from './components/AchievedSection';
import { JarCard } from './components/JarCard';
import { NewGoalSheet } from './components/NewGoalSheet';
import { useGoals } from './hooks/useGoals';
import { compareGoals } from './utils/progress';

export const GoalsScreen: FC = () => {
  const [creating, setCreating] = useState(false);

  const { t } = useTranslation();

  const today = useToday();
  const data = useGoals();

  const { active, achieved } = useMemo(() => {
    const goals = data?.goals ?? [];
    return {
      active: goals.filter((goal) => !goal.achievedAt).sort(compareGoals),
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
      {active.map((goal) => (
        <JarCard
          key={goal.id}
          goal={goal}
          steps={data.stepsByGoal.get(goal.id) ?? []}
          today={today}
        />
      ))}
      <AchievedSection goals={achieved} />
      {creating && <NewGoalSheet onClose={() => setCreating(false)} />}
    </>
  );
};
