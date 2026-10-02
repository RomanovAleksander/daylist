import { useState, type FC, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, TextField, Typography } from '@mui/material';

import type { Goal } from '@/db';
import type { DateKey } from '@/utils/date';

import { BlurTextField } from './BlurTextField';
import { addToGoalCurrent, updateGoal } from '../api/goals.api';
import { formatAmount, neededPerMonth } from '../utils/progress';

interface Props {
  goal: Goal;
  today: DateKey;
}

const toNumber = (value: string) => {
  const number = Number(value.replace(',', '.').replace(/\s/g, ''));
  return value.trim() === '' || Number.isNaN(number) ? undefined : number;
};

export const NumberProgress: FC<Props> = ({ goal, today }) => {
  const [amount, setAmount] = useState('');

  const { t } = useTranslation();

  const perMonth = neededPerMonth(goal, today);
  const rest = (goal.target ?? 0) - (goal.current ?? 0);

  const handleAdd = (event: FormEvent) => {
    event.preventDefault();
    const delta = toNumber(amount);
    if (!delta) return;
    void addToGoalCurrent(goal.id, delta);
    setAmount('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr', gap: 1 }}>
        <BlurTextField
          key={`current-${goal.current}`}
          label={t('goals.card.current')}
          value={goal.current?.toString() ?? ''}
          onCommit={(value) => void updateGoal(goal.id, { current: toNumber(value) })}
          size="small"
          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
        />
        <BlurTextField
          key={`target-${goal.target}`}
          label={t('goals.card.target')}
          value={goal.target?.toString() ?? ''}
          onCommit={(value) => void updateGoal(goal.id, { target: toNumber(value) })}
          size="small"
          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
        />
        <BlurTextField
          key={`unit-${goal.unit}`}
          label={t('goals.card.unit')}
          placeholder={t('goals.card.unitHint')}
          value={goal.unit ?? ''}
          onCommit={(unit) => void updateGoal(goal.id, { unit: unit.trim() || undefined })}
          size="small"
        />
      </Box>
      <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          label={t('goals.card.addAmount')}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
        />
        <Button type="submit" variant="outlined">
          {t('goals.card.add')}
        </Button>
      </Box>
      {goal.target !== undefined && (
        <Typography variant="body2" sx={{ color: rest <= 0 ? 'primary.main' : 'text.secondary' }}>
          {rest <= 0
            ? t('goals.card.reached')
            : perMonth !== null &&
              t('goals.card.perMonth', {
                rest: formatAmount(rest, goal.unit),
                perMonth: formatAmount(Math.ceil(perMonth), goal.unit),
              })}
        </Typography>
      )}
    </Box>
  );
};
