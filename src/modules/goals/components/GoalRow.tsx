import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Box, ButtonBase, Checkbox, Typography } from '@mui/material';

import { goalPath } from '@/config/pages.config';
import type { Goal, GoalStep } from '@/db';

import { goalProgress } from '../utils/progress';

interface Props {
  goal: Goal;
  steps: GoalStep[];
  /** Для мечты — круглая галочка «збулось» вместо стрелки. */
  onToggleDream?: (goal: Goal) => void;
}

export const GoalRow: FC<Props> = ({ goal, steps, onToggleDream }) => {
  const { t } = useTranslation();

  const progress = goalProgress(goal, steps);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {onToggleDream ? (
        <Checkbox
          checked={!!goal.achievedAt}
          onChange={() => onToggleDream(goal)}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          slotProps={{ input: { 'aria-label': t('goals.dreamCame', { title: goal.title }) } }}
          sx={{ p: 1.25, ml: -1.25 }}
        />
      ) : (
        <Box component="span" aria-hidden sx={{ color: 'primary.main', width: 24, flex: 'none' }}>
          →
        </Box>
      )}
      <ButtonBase
        component={RouterLink}
        to={goalPath(goal.id)}
        sx={{
          flex: 1,
          minWidth: 0,
          justifyContent: 'space-between',
          gap: 1,
          py: 1.25,
          textAlign: 'left',
        }}
      >
        <Typography component="span" sx={{ overflowWrap: 'anywhere' }}>
          {goal.title}
        </Typography>
        {progress && (
          <Typography
            component="span"
            sx={{ color: 'text.secondary', fontSize: 13, whiteSpace: 'nowrap' }}
          >
            {Math.round(progress.ratio * 100)}%
          </Typography>
        )}
      </ButtonBase>
    </Box>
  );
};
