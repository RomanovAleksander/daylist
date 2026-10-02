import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, ButtonBase, Checkbox, Typography } from '@mui/material';

import type { Task } from '@/db';
import { SwipeRow } from '@/ui/SwipeRow';

import { CarryBadge } from './CarryBadge';
import { setTaskDone } from '../api/tasks.api';

interface Props {
  task: Task;
  onOpen: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskRow: FC<Props> = ({ task, onOpen, onDelete }) => {
  const { t } = useTranslation();

  return (
    <SwipeRow actionLabel={t('day.swipeDelete')} onSwipe={() => onDelete(task)}>
      <Box
        sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, bgcolor: 'background.paper' }}
      >
        <Checkbox
          checked={task.done}
          onChange={(_, done) => void setTaskDone(task.id, done)}
          slotProps={{ input: { 'aria-label': t('day.toggleTask', { text: task.text }) } }}
          sx={{ p: 1.25, ml: -1.25 }}
        />
        <ButtonBase
          onClick={() => onOpen(task)}
          aria-label={t('day.editTask')}
          sx={{ flex: 1, minWidth: 0, justifyContent: 'flex-start', textAlign: 'left', py: 1.25 }}
        >
          <Typography
            component="span"
            sx={{
              overflowWrap: 'anywhere',
              color: task.done ? 'text.disabled' : 'text.primary',
              textDecoration: task.done ? 'line-through' : 'none',
              transition: 'color 200ms',
            }}
          >
            {task.text}
          </Typography>
        </ButtonBase>
        {task.carryCount > 0 && <CarryBadge task={task} />}
      </Box>
    </SwipeRow>
  );
};
