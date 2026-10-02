import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

import type { Task } from '@/db';

import { isStale } from '../utils/stale';

interface Props {
  task: Task;
}

/** Только метка: действия с «висяком» — в шторке задачи по тапу. */
export const CarryBadge: FC<Props> = ({ task }) => {
  const { t } = useTranslation();

  return (
    <Typography
      component="span"
      sx={{
        fontSize: 12,
        whiteSpace: 'nowrap',
        py: 1.5,
        pl: 1,
        color: isStale(task) && !task.done ? 'warning.main' : 'primary.main',
      }}
    >
      {t('day.carryDays', { count: task.carryCount })}
    </Typography>
  );
};
