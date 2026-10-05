import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';

import type { Goal } from '@/db';

import { AutosaveTextField } from './AutosaveTextField';
import { updateGoal } from '../api/goals.api';
import { parseAmount } from '../utils/progress';

interface Props {
  goal: Goal;
}

export const GoalNumberFields: FC<Props> = ({ goal }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr', gap: 1, mt: 2 }}>
      <AutosaveTextField
        label={t('goals.card.current')}
        value={goal.current?.toString() ?? ''}
        onCommit={(value) => void updateGoal(goal.id, { current: parseAmount(value) })}
        size="small"
        slotProps={{ htmlInput: { inputMode: 'decimal' } }}
      />
      <AutosaveTextField
        label={t('goals.card.target')}
        value={goal.target?.toString() ?? ''}
        onCommit={(value) => void updateGoal(goal.id, { target: parseAmount(value) })}
        size="small"
        slotProps={{ htmlInput: { inputMode: 'decimal' } }}
      />
      <AutosaveTextField
        label={t('goals.card.unit')}
        placeholder={t('goals.card.unitHint')}
        value={goal.unit ?? ''}
        onCommit={(unit) => void updateGoal(goal.id, { unit: unit.trim() || undefined })}
        size="small"
      />
    </Box>
  );
};
