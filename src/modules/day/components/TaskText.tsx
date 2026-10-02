import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonBase, Typography } from '@mui/material';

import type { Task } from '@/db';

interface Props {
  task: Task;
  onEdit: () => void;
}

export const TaskText: FC<Props> = ({ task, onEdit }) => {
  const { t } = useTranslation();

  return (
    <ButtonBase
      onClick={onEdit}
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
  );
};
