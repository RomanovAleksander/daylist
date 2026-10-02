import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Button, InputBase, TextField, Typography } from '@mui/material';

import { goalPath, PagesConfig } from '@/config/pages.config';
import type { GoalMeasure } from '@/db';
import { useToday } from '@/hooks/useToday';
import { ScreenHeader } from '@/ui/ScreenHeader';

import { addGoal } from './api/goals.api';
import { ChoiceChips } from './components/ChoiceChips';
import { useGoalDraft, type DateChoice, type KindChoice } from './hooks/useGoalDraft';

const TOTAL_STEPS = 3;

const questionSx = { fontSize: 22, fontWeight: 700, mt: 3, mb: 2 } as const;
const fieldSx = {
  bgcolor: 'background.paper',
  borderRadius: 3,
  px: 1.75,
  py: 1.25,
  fontSize: 17,
} as const;

/** Майстер: на каждом экране один вопрос; мечта создаётся сразу после названия. */
export const NewGoalScreen: FC = () => {
  const [step, setStep] = useState(1);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const today = useToday();
  const { draft, update, deadline } = useGoalDraft(today);

  const target = Number(draft.target.replace(',', '.'));
  const canGoOn =
    (step === 1 && draft.title.trim() !== '') ||
    (step === 2 &&
      draft.dateChoice !== null &&
      (draft.dateChoice !== 'custom' || !!draft.customDate)) ||
    (step === 3 && draft.measure !== null && (draft.measure !== 'number' || target > 0));

  const create = async () => {
    const title = draft.title.trim();
    const id =
      draft.kind === 'dream'
        ? await addGoal('dream', title, today)
        : await addGoal(deadline ? 'dated' : 'global', title, today, {
            deadline,
            measure: draft.measure ?? 'none',
            ...(draft.measure === 'number' && {
              target,
              current: 0,
              unit: draft.unit.trim() || undefined,
            }),
          });
    navigate(goalPath(id), { replace: true });
  };

  const next = () => {
    if (!canGoOn) return;
    if (step === TOTAL_STEPS || (step === 1 && draft.kind === 'dream')) void create();
    else setStep(step + 1);
  };

  const isLast = step === TOTAL_STEPS || (step === 1 && draft.kind === 'dream');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100dvh - 140px)' }}>
      <ScreenHeader
        title={t('goals.wizard.title')}
        back={{ to: PagesConfig.GOALS, label: t('common.back') }}
      />
      <Box
        role="progressbar"
        aria-label={t('goals.wizard.step', { step, total: TOTAL_STEPS })}
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        sx={{ display: 'flex', gap: 0.75 }}
      >
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <Box
            key={i}
            sx={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              bgcolor: i < step ? 'primary.main' : 'divider',
            }}
          />
        ))}
      </Box>

      {step === 1 && (
        <>
          <Typography component="h2" sx={questionSx}>
            {t('goals.wizard.nameQuestion')}
          </Typography>
          <InputBase
            fullWidth
            value={draft.title}
            placeholder={t('goals.newGoal')}
            inputProps={{ 'aria-label': t('goals.newGoal'), enterKeyHint: 'next' }}
            onChange={(event) => update({ title: event.target.value })}
            onKeyDown={(event) => event.key === 'Enter' && next()}
            sx={{ ...fieldSx, mb: 2 }}
          />
          <ChoiceChips<KindChoice>
            label={t('goals.card.type')}
            value={draft.kind}
            onChange={(kind) => update({ kind })}
            options={[
              { value: 'goal', label: t('goals.wizard.kindGoal') },
              { value: 'dream', label: t('goals.wizard.kindDream') },
            ]}
          />
        </>
      )}

      {step === 2 && (
        <>
          <Typography component="h2" sx={questionSx}>
            {t('goals.wizard.dateQuestion')}
          </Typography>
          <ChoiceChips<DateChoice>
            label={t('goals.wizard.dateQuestion')}
            value={draft.dateChoice}
            onChange={(dateChoice) => update({ dateChoice })}
            options={[
              { value: 'month', label: t('goals.wizard.endOfMonth') },
              { value: 'year', label: t('goals.wizard.endOfYear') },
              { value: 'custom', label: t('goals.wizard.customDate') },
              { value: 'none', label: t('goals.wizard.noDate') },
            ]}
          />
          {draft.dateChoice === 'custom' && (
            <TextField
              type="date"
              label={t('goals.card.deadline')}
              value={draft.customDate}
              onChange={(event) => update({ customDate: event.target.value })}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: today } }}
              sx={{ mt: 2 }}
            />
          )}
        </>
      )}

      {step === 3 && (
        <>
          <Typography component="h2" sx={questionSx}>
            {t('goals.wizard.measureQuestion')}
          </Typography>
          <ChoiceChips<GoalMeasure>
            label={t('goals.wizard.measureQuestion')}
            value={draft.measure}
            onChange={(measure) => update({ measure })}
            options={[
              { value: 'steps', label: t('goals.wizard.measureSteps') },
              { value: 'number', label: t('goals.wizard.measureNumber') },
              {
                value: 'none',
                label: t(deadline ? 'goals.wizard.measureNone' : 'goals.wizard.measureNoneGlobal'),
              },
            ]}
          />
          {draft.measure === 'number' && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 1, mt: 2 }}>
              <TextField
                label={t('goals.wizard.target')}
                value={draft.target}
                onChange={(event) => update({ target: event.target.value })}
                slotProps={{ htmlInput: { inputMode: 'decimal' } }}
              />
              <TextField
                label={t('goals.wizard.unit')}
                placeholder={t('goals.card.unitHint')}
                value={draft.unit}
                onChange={(event) => update({ unit: event.target.value })}
              />
            </Box>
          )}
        </>
      )}

      <Box sx={{ mt: 'auto', pt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          variant="contained"
          disableElevation
          size="large"
          disabled={!canGoOn}
          onClick={next}
          sx={{ borderRadius: 3.5, fontWeight: 700, py: 1.5 }}
        >
          {isLast ? t('goals.wizard.create') : t('goals.wizard.next')}
        </Button>
        {step > 1 && (
          <Button
            size="large"
            color="inherit"
            onClick={() => setStep(step - 1)}
            sx={{ borderRadius: 3.5 }}
          >
            {t('goals.wizard.back')}
          </Button>
        )}
      </Box>
    </Box>
  );
};
