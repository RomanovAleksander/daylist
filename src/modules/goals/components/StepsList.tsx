import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, ButtonBase, Checkbox, IconButton, Typography } from '@mui/material';

import type { GoalStep } from '@/db';
import { AddInlineRow } from '@/ui/AddInlineRow';
import { Card } from '@/ui/Card';
import { InlineInput } from '@/ui/InlineInput';
import { SettingsSection } from '@/ui/SettingsSection';

import { addGoalStep, deleteGoalStep, setGoalStepDone, updateGoalStepText } from '../api/goals.api';

const StepRow: FC<{ step: GoalStep }> = ({ step }) => {
  const [editing, setEditing] = useState(false);

  const { t } = useTranslation();

  const save = (text: string) => {
    setEditing(false);
    if (!text) void deleteGoalStep(step.id);
    else if (text !== step.text) void updateGoalStepText(step.id, text);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
      <Checkbox
        checked={step.done}
        onChange={(_, done) => void setGoalStepDone(step.id, done)}
        slotProps={{ input: { 'aria-label': t('goals.card.toggleStep', { text: step.text }) } }}
        sx={{ p: 1.25, ml: -1.25 }}
      />
      {editing ? (
        <>
          <Box sx={{ flex: 1, py: 0.75 }}>
            <InlineInput
              initialValue={step.text}
              ariaLabel={t('goals.card.editStep')}
              onSubmit={save}
              onBlurSubmit={save}
              onClose={() => setEditing(false)}
            />
          </Box>
          <IconButton
            aria-label={t('goals.card.deleteStep')}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => void deleteGoalStep(step.id)}
          >
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </>
      ) : (
        <ButtonBase
          onClick={() => setEditing(true)}
          aria-label={t('goals.card.editStep')}
          sx={{ flex: 1, minWidth: 0, justifyContent: 'flex-start', textAlign: 'left', py: 1.25 }}
        >
          <Typography
            component="span"
            sx={{
              overflowWrap: 'anywhere',
              color: step.done ? 'text.disabled' : 'text.primary',
              textDecoration: step.done ? 'line-through' : 'none',
            }}
          >
            {step.text}
          </Typography>
        </ButtonBase>
      )}
    </Box>
  );
};

interface Props {
  goalId: string;
  steps: GoalStep[];
}

export const StepsList: FC<Props> = ({ goalId, steps }) => {
  const { t } = useTranslation();

  const done = steps.filter((step) => step.done).length;

  return (
    <SettingsSection
      title={
        steps.length
          ? t('goals.card.stepsTitle', { done, total: steps.length })
          : t('goals.card.stepsEmpty')
      }
    >
      <Card>
        {steps.map((step) => (
          <StepRow key={step.id} step={step} />
        ))}
        <AddInlineRow
          label={t('goals.card.addStep')}
          placeholder={t('goals.card.newStep')}
          onAdd={(text) => void addGoalStep(goalId, text)}
        />
      </Card>
    </SettingsSection>
  );
};
