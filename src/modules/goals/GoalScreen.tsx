import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { PagesConfig } from '@/config/pages.config';
import { useToday } from '@/hooks/useToday';
import { EmptyState } from '@/ui/EmptyState';
import { InlineInput } from '@/ui/InlineInput';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { SettingsSection } from '@/ui/SettingsSection';

import { deleteGoal, setGoalAchieved, updateGoal } from './api/goals.api';
import { BlurTextField } from './components/BlurTextField';
import { GoalSettings } from './components/GoalSettings';
import { GoalSummary } from './components/GoalSummary';
import { NumberProgress } from './components/NumberProgress';
import { StepsList } from './components/StepsList';
import { useGoal } from './hooks/useGoals';

export const GoalScreen: FC = () => {
  const [renaming, setRenaming] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { t } = useTranslation();
  const { id = '' } = useParams();
  const navigate = useNavigate();

  const today = useToday();
  const data = useGoal(id);

  const back = { to: PagesConfig.GOALS, label: t('common.back') };

  if (data === undefined) return null;
  if (data === null) {
    return (
      <>
        <ScreenHeader title={t('nav.goals')} back={back} />
        <EmptyState title={t('goals.notFound')} />
      </>
    );
  }

  const { goal, steps } = data;

  const rename = (title: string) => {
    setRenaming(false);
    if (title && title !== goal.title) void updateGoal(goal.id, { title });
  };

  const handleDelete = () => {
    setConfirmDelete(false);
    void deleteGoal(goal.id);
    navigate(PagesConfig.GOALS, { replace: true });
  };

  return (
    <>
      <ScreenHeader
        back={back}
        heading={!renaming}
        title={
          renaming ? (
            <InlineInput
              initialValue={goal.title}
              ariaLabel={t('goals.card.rename')}
              onSubmit={rename}
              onBlurSubmit={rename}
              onClose={() => setRenaming(false)}
            />
          ) : (
            <ButtonBase
              onClick={() => setRenaming(true)}
              aria-label={t('goals.card.rename')}
              sx={{ font: 'inherit', textAlign: 'left', overflowWrap: 'anywhere' }}
            >
              {goal.title}
            </ButtonBase>
          )
        }
      />
      <GoalSummary goal={goal} steps={steps} today={today} />
      <GoalSettings goal={goal} />
      {goal.measure === 'number' && <NumberProgress goal={goal} today={today} />}
      <SettingsSection title={t('goals.card.description')}>
        <BlurTextField
          key={`description-${goal.description}`}
          multiline
          minRows={2}
          fullWidth
          placeholder={t('goals.card.descriptionHint')}
          value={goal.description}
          onCommit={(description) => void updateGoal(goal.id, { description: description.trim() })}
          slotProps={{ htmlInput: { 'aria-label': t('goals.card.description') } }}
        />
      </SettingsSection>
      {goal.measure === 'steps' && <StepsList goalId={goal.id} steps={steps} />}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 4 }}>
        <Button variant="outlined" onClick={() => void setGoalAchieved(goal.id, !goal.achievedAt)}>
          {goal.achievedAt ? t('goals.card.reopen') : t('goals.card.markAchieved')}
        </Button>
        <Button color="error" onClick={() => setConfirmDelete(true)}>
          {t('goals.card.delete')}
        </Button>
      </Box>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>{t('goals.card.deleteTitle', { title: goal.title })}</DialogTitle>
        <DialogContent sx={{ color: 'text.secondary' }}>{t('goals.card.deleteText')}</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>{t('common.cancel')}</Button>
          <Button color="error" onClick={handleDelete}>
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
