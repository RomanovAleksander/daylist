import { useState, type FC, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, InputBase } from '@mui/material';

import type { Goal } from '@/db';
import { BottomSheet } from '@/ui/BottomSheet';

import { addToGoalCurrent } from '../api/goals.api';
import { parseAmount } from '../utils/progress';

interface Props {
  goal: Goal;
  onClose: () => void;
}

export const AmountSheet: FC<Props> = ({ goal, onClose }) => {
  const [amount, setAmount] = useState('');

  const { t } = useTranslation();

  const value = parseAmount(amount);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!value) return;
    void addToGoalCurrent(goal.id, value);
    onClose();
  };

  return (
    <BottomSheet open onClose={onClose} title={t('goals.card.amountTitle', { title: goal.title })}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
      >
        <InputBase
          fullWidth
          value={amount}
          placeholder={goal.unit ? `0 ${goal.unit}` : '0'}
          inputProps={{
            'aria-label': t('goals.card.addAmount'),
            inputMode: 'decimal',
            enterKeyHint: 'done',
          }}
          onChange={(event) => setAmount(event.target.value)}
          sx={{
            bgcolor: 'background.default',
            borderRadius: 3,
            px: 1.75,
            py: 1.25,
            fontSize: 22,
            fontWeight: 700,
          }}
        />
        <Button type="submit" variant="contained" disableElevation size="large" disabled={!value}>
          {t('goals.card.add')}
        </Button>
      </Box>
    </BottomSheet>
  );
};
