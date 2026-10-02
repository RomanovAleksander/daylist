import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ButtonBase, IconButton } from '@mui/material';

import { PagesConfig } from '@/config/pages.config';
import { useToday } from '@/hooks/useToday';
import { EmptyState } from '@/ui/EmptyState';
import { InlineInput } from '@/ui/InlineInput';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { SettingsSection } from '@/ui/SettingsSection';

import { updateGoal } from './api/goals.api';
import { AmountSheet } from './components/AmountSheet';
import { BlurTextField } from './components/BlurTextField';
import { GoalOptionsSheet } from './components/GoalOptionsSheet';
import { GoalPrimary } from './components/GoalPrimary';
import { StepsList } from './components/StepsList';
import { useGoal } from './hooks/useGoals';

type Sheet = 'options' | 'amount' | null;

export const GoalScreen: FC = () => {
  const [renaming, setRenaming] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);

  const { t } = useTranslation();
  const { id = '' } = useParams();

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

  return (
    <>
      <ScreenHeader
        back={back}
        heading={!renaming}
        action={
          <IconButton aria-label={t('goals.card.options')} onClick={() => setSheet('options')}>
            <MoreHorizIcon />
          </IconButton>
        }
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
      <GoalPrimary
        goal={goal}
        steps={steps}
        today={today}
        onAddAmount={() => setSheet('amount')}
        onNewDate={() => setSheet('options')}
      />
      {goal.measure === 'steps' && <StepsList goalId={goal.id} steps={steps} />}
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
          sx={{
            '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: 5 },
            '& .MuiOutlinedInput-root:not(.Mui-focused) fieldset': { borderColor: 'transparent' },
          }}
        />
      </SettingsSection>
      {sheet === 'options' && <GoalOptionsSheet goal={goal} onClose={() => setSheet(null)} />}
      {sheet === 'amount' && <AmountSheet goal={goal} onClose={() => setSheet(null)} />}
    </>
  );
};
