import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Checkbox, Typography } from '@mui/material';

import type { Task } from '@/db';

import { setPastTaskDone } from '../api/history.api';

interface Props {
  task: Task;
}

// Невыполненная разовая задача прошлого дня всегда уходила дальше при сборке следующего.
const wasCarried = (task: Task) => !task.done && !task.recurring;

export const PastTaskRow: FC<Props> = ({ task }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
      <Checkbox
        checked={task.done}
        onChange={(_, done) => void setPastTaskDone(task, done)}
        slotProps={{ input: { 'aria-label': t('day.toggleTask', { text: task.text }) } }}
        sx={{ p: 1.25, ml: -1.25 }}
      />
      <Typography
        sx={{
          flex: 1,
          py: 1.25,
          overflowWrap: 'anywhere',
          color: task.done ? 'text.disabled' : 'text.primary',
          textDecoration: task.done ? 'line-through' : 'none',
        }}
      >
        {task.text}
        {wasCarried(task) && (
          <Typography component="span" sx={{ color: 'text.secondary', fontSize: 12, ml: 1 }}>
            {t('history.carried')}
          </Typography>
        )}
      </Typography>
    </Box>
  );
};
