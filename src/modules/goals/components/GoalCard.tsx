import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { Box, Button, ButtonBase, Paper, Typography } from '@mui/material';

import { goalPath } from '@/config/pages.config';
import type { Goal, GoalStep } from '@/db';
import type { DateKey } from '@/utils/date';

import { Meter } from './Meter';
import { ProgressMeta } from './ProgressMeta';
import { moveGoalToGlobal, setGoalAchieved } from '../api/goals.api';
import { formatDeadline } from '../utils/format';
import { daysLeft, goalProgress, isOverdue, timeRatio } from '../utils/progress';

interface Props {
  goal: Goal;
  steps: GoalStep[];
  today: DateKey;
}

const metaSx = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 1,
  color: 'text.secondary',
  fontSize: 12,
} as const;

export const GoalCard: FC<Props> = ({ goal, steps, today }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const progress = goalProgress(goal, steps);
  const overdue = isOverdue(goal, today);
  const left = goal.deadline ? daysLeft(goal.deadline, today) : null;
  const time = goal.deadline ? timeRatio(goal.startDate, goal.deadline, today) : null;

  return (
    <Paper elevation={0} sx={{ borderRadius: 3.5, mt: 1.25, overflow: 'hidden' }}>
      <ButtonBase
        component={RouterLink}
        to={goalPath(goal.id)}
        aria-label={t('goals.open', { title: goal.title })}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 1,
          p: 1.5,
          textAlign: 'left',
        }}
      >
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}
        >
          <Typography component="h3" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
            {goal.title}
          </Typography>
          {left !== null && (
            <Typography
              component="span"
              sx={{
                fontSize: 22,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums',
                color: overdue ? 'warning.main' : 'text.primary',
              }}
            >
              {overdue ? t('goals.overdue', { count: -left }) : left}
              {!overdue && (
                <Typography
                  component="span"
                  sx={{ fontSize: 12, color: 'text.secondary', ml: 0.5 }}
                >
                  {t('goals.daysLeft', { count: left })}
                </Typography>
              )}
            </Typography>
          )}
        </Box>
        {progress && <Meter ratio={progress.ratio} label={goal.title} />}
        <Box sx={metaSx}>
          <span>{progress && <ProgressMeta goal={goal} progress={progress} />}</span>
          {goal.deadline ? (
            <Box component="span" sx={{ color: overdue ? 'warning.main' : undefined }}>
              {t(overdue ? 'goals.deadlinePassed' : 'goals.until', {
                date: formatDeadline(goal.deadline),
              })}
            </Box>
          ) : (
            <Box component="span" sx={{ color: 'primary.main' }}>
              {t('goals.setDate')}
            </Box>
          )}
        </Box>
        {time !== null && !overdue && (
          <>
            <Meter
              ratio={time}
              tone="time"
              label={t('goals.timeElapsed', { percent: Math.round(time * 100) })}
            />
            <Box sx={metaSx}>{t('goals.timeElapsed', { percent: Math.round(time * 100) })}</Box>
          </>
        )}
      </ButtonBase>
      {overdue && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', px: 1.5, pb: 1.5 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => void setGoalAchieved(goal.id, true)}
          >
            {t('goals.achieve')}
          </Button>
          <Button size="small" color="inherit" onClick={() => navigate(goalPath(goal.id))}>
            {t('goals.newDate')}
          </Button>
          <Button size="small" color="inherit" onClick={() => void moveGoalToGlobal(goal.id)}>
            {t('goals.toGlobal')}
          </Button>
        </Box>
      )}
    </Paper>
  );
};
