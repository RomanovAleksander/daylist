import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import type { Goal, GoalKind, GoalMeasure } from '@/db';

import { BlurTextField } from './BlurTextField';
import { updateGoal } from '../api/goals.api';

interface Props {
  goal: Goal;
}

const labelSx = { color: 'text.secondary', fontSize: 13, mt: 2, mb: 0.75 } as const;

export const GoalSettings: FC<Props> = ({ goal }) => {
  const { t } = useTranslation();

  const setKind = (kind: GoalKind) =>
    // Мечта прогресса не меряет, а у цели без даты дедлайна нет.
    void updateGoal(goal.id, {
      kind,
      ...(kind !== 'dated' && { deadline: undefined }),
      ...(kind === 'dream' && { measure: 'none' as const }),
    });

  return (
    <Box>
      <Typography sx={labelSx}>{t('goals.card.type')}</Typography>
      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        value={goal.kind}
        aria-label={t('goals.card.type')}
        onChange={(_, kind: GoalKind | null) => kind && setKind(kind)}
      >
        <ToggleButton value="dated">{t('goals.card.typeDated')}</ToggleButton>
        <ToggleButton value="global">{t('goals.card.typeGlobal')}</ToggleButton>
        <ToggleButton value="dream">{t('goals.card.typeDream')}</ToggleButton>
      </ToggleButtonGroup>

      {goal.kind === 'dated' && (
        <BlurTextField
          key={`deadline-${goal.deadline}`}
          type="date"
          label={t('goals.card.deadline')}
          value={goal.deadline ?? ''}
          onCommit={(deadline) => void updateGoal(goal.id, { deadline: deadline || undefined })}
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ mt: 2 }}
        />
      )}

      {goal.kind !== 'dream' && (
        <>
          <Typography sx={labelSx}>{t('goals.card.measure')}</Typography>
          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={goal.measure}
            aria-label={t('goals.card.measure')}
            onChange={(_, measure: GoalMeasure | null) =>
              measure && void updateGoal(goal.id, { measure })
            }
          >
            <ToggleButton value="steps">{t('goals.card.measureSteps')}</ToggleButton>
            <ToggleButton value="number">{t('goals.card.measureNumber')}</ToggleButton>
            <ToggleButton value="none">{t('goals.card.measureNone')}</ToggleButton>
          </ToggleButtonGroup>
        </>
      )}
    </Box>
  );
};
