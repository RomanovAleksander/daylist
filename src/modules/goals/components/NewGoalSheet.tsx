import { useRef, type FC, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Button, InputBase, TextField, Typography } from '@mui/material';

import { goalPath } from '@/config/pages.config';
import type { GoalMeasure } from '@/db';
import { closeOverlaysThen } from '@/hooks/useBackToClose';
import { useToday } from '@/hooks/useToday';
import { BottomSheet } from '@/ui/BottomSheet';

import { ChoiceChips } from './ChoiceChips';
import { addGoal } from '../api/goals.api';
import { useGoalDraft, type DateChoice } from '../hooks/useGoalDraft';

interface Props {
  onClose: () => void;
}

const labelSx = { color: 'text.secondary', fontSize: 13, mt: 2, mb: 1 } as const;

/** Новая цель за один экран: название, срок и как мерить; шаги и сумма — уже на экране цели. */
export const NewGoalSheet: FC<Props> = ({ onClose }) => {
  const titleRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const today = useToday();
  const { draft, update, deadline, target, ready } = useGoalDraft(today);

  const dream = draft.dateChoice === 'dream';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!ready) return;
    const title = draft.title.trim();
    const id = dream
      ? await addGoal('dream', title, today)
      : await addGoal(deadline ? 'dated' : 'global', title, today, {
          deadline,
          measure: draft.measure,
          ...(draft.measure === 'number' && {
            target,
            current: 0,
            unit: draft.unit.trim() || undefined,
          }),
        });
    closeOverlaysThen(() => navigate(goalPath(id)));
  };

  return (
    <BottomSheet open onClose={onClose} title={t('goals.create.title')} initialFocusRef={titleRef}>
      <Box component="form" onSubmit={(event) => void handleSubmit(event)}>
        <InputBase
          fullWidth
          value={draft.title}
          placeholder={t('goals.create.namePlaceholder')}
          inputRef={titleRef}
          inputProps={{ 'aria-label': t('goals.newGoal'), enterKeyHint: 'done' }}
          onChange={(event) => update({ title: event.target.value })}
          sx={{
            bgcolor: 'background.default',
            borderRadius: 3.5,
            px: 2,
            height: 52,
            fontSize: 17,
          }}
        />

        <Typography sx={labelSx}>{t('goals.create.when')}</Typography>
        <ChoiceChips<DateChoice>
          label={t('goals.create.when')}
          value={draft.dateChoice}
          onChange={(dateChoice) => update({ dateChoice })}
          options={[
            { value: 'month', label: t('goals.create.endOfMonth') },
            { value: 'year', label: t('goals.create.endOfYear') },
            { value: 'custom', label: t('goals.create.customDate') },
            { value: 'none', label: t('goals.create.noDate') },
            { value: 'dream', label: t('goals.create.dream') },
          ]}
        />
        {draft.dateChoice === 'custom' && (
          <TextField
            type="date"
            fullWidth
            label={t('goals.card.deadline')}
            value={draft.customDate}
            onChange={(event) => update({ customDate: event.target.value })}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: today } }}
            sx={{ mt: 1.5 }}
          />
        )}

        {!dream && (
          <>
            <Typography sx={labelSx}>{t('goals.create.measure')}</Typography>
            <ChoiceChips<GoalMeasure>
              label={t('goals.create.measure')}
              value={draft.measure}
              onChange={(measure) => update({ measure })}
              options={[
                {
                  value: 'none',
                  label: t(
                    deadline ? 'goals.create.measureNone' : 'goals.create.measureNoneGlobal'
                  ),
                },
                { value: 'steps', label: t('goals.create.measureSteps') },
                { value: 'number', label: t('goals.create.measureNumber') },
              ]}
            />
          </>
        )}
        {!dream && draft.measure === 'number' && (
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 1, mt: 1.5 }}>
            <TextField
              label={t('goals.card.target')}
              value={draft.target}
              onChange={(event) => update({ target: event.target.value })}
              slotProps={{ htmlInput: { inputMode: 'decimal' } }}
            />
            <TextField
              label={t('goals.card.unit')}
              placeholder={t('goals.card.unitHint')}
              value={draft.unit}
              onChange={(event) => update({ unit: event.target.value })}
            />
          </Box>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disableElevation
          size="large"
          disabled={!ready}
          sx={{ mt: 3 }}
        >
          {t('goals.create.submit')}
        </Button>
      </Box>
    </BottomSheet>
  );
};
