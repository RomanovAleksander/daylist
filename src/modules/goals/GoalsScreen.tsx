import { useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

import type { Goal } from '@/db';
import { useToday } from '@/hooks/useToday';
import { AddInlineRow } from '@/ui/AddInlineRow';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { SettingsSection } from '@/ui/SettingsSection';
import { UndoSnackbar } from '@/ui/UndoSnackbar';

import { addGoal, setGoalAchieved } from './api/goals.api';
import { AchievedSection } from './components/AchievedSection';
import { GoalCard } from './components/GoalCard';
import { GoalRow } from './components/GoalRow';
import { useGoals } from './hooks/useGoals';
import { compareDated } from './utils/progress';

export const GoalsScreen: FC = () => {
  const [cameTrue, setCameTrue] = useState<Goal | null>(null);

  const { t } = useTranslation();

  const today = useToday();
  const data = useGoals();

  const sections = useMemo(() => {
    const active = data?.goals.filter((goal) => !goal.achievedAt) ?? [];
    return {
      dated: active.filter((goal) => goal.kind === 'dated').sort(compareDated),
      global: active.filter((goal) => goal.kind === 'global'),
      dreams: active.filter((goal) => goal.kind === 'dream'),
      achieved: (data?.goals ?? [])
        .filter((goal) => goal.achievedAt)
        .sort((a, b) => (b.achievedAt ?? 0) - (a.achievedAt ?? 0)),
    };
  }, [data]);

  const handleDream = (goal: Goal) => {
    void setGoalAchieved(goal.id, true);
    setCameTrue(goal);
  };

  if (!data) return null;

  const stepsOf = (goal: Goal) => data.stepsByGoal.get(goal.id) ?? [];

  return (
    <>
      <ScreenHeader title={t('nav.goals')} />
      {data.goals.length === 0 && (
        <Typography sx={{ color: 'text.secondary', mb: 1 }}>{t('goals.empty')}</Typography>
      )}
      <SettingsSection title={t('goals.dated')}>
        {sections.dated.map((goal) => (
          <GoalCard key={goal.id} goal={goal} steps={stepsOf(goal)} today={today} />
        ))}
        <AddInlineRow
          label={t('goals.addDated')}
          placeholder={t('goals.newGoal')}
          onAdd={(title) => void addGoal('dated', title, today)}
        />
      </SettingsSection>
      <SettingsSection title={t('goals.global')}>
        {sections.global.map((goal) => (
          <GoalRow key={goal.id} goal={goal} steps={stepsOf(goal)} />
        ))}
        <AddInlineRow
          label={t('goals.addGlobal')}
          placeholder={t('goals.newGoal')}
          onAdd={(title) => void addGoal('global', title, today)}
        />
      </SettingsSection>
      <SettingsSection title={t('goals.dreams')}>
        {sections.dreams.map((goal) => (
          <GoalRow key={goal.id} goal={goal} steps={stepsOf(goal)} onToggleDream={handleDream} />
        ))}
        <AddInlineRow
          label={t('goals.addDream')}
          placeholder={t('goals.newDream')}
          onAdd={(title) => void addGoal('dream', title, today)}
        />
      </SettingsSection>
      <AchievedSection goals={sections.achieved} />
      <UndoSnackbar
        open={cameTrue !== null}
        message={t('goals.dreamCame', { title: cameTrue?.title ?? '' })}
        actionLabel={t('day.undo')}
        onUndo={() => {
          if (cameTrue) void setGoalAchieved(cameTrue.id, false);
          setCameTrue(null);
        }}
        onClose={() => setCameTrue(null)}
      />
    </>
  );
};
