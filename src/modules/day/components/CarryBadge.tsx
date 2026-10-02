import { useState, type FC, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonBase, Menu, MenuItem, Typography } from '@mui/material';

import type { Task } from '@/db';
import { promoteTaskToTemplate } from '@/modules/settings/template';

import { isStale } from '../utils/stale';

interface Props {
  task: Task;
  onDelete: (task: Task) => void;
}

const badgeSx = { fontSize: 12, whiteSpace: 'nowrap', py: 1.5, pl: 1 } as const;

export const CarryBadge: FC<Props> = ({ task, onDelete }) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const { t } = useTranslation();

  const label = t('day.carryDays', { count: task.carryCount });

  if (!isStale(task) || task.done) {
    return (
      <Typography component="span" sx={{ ...badgeSx, color: 'primary.main' }}>
        {label}
      </Typography>
    );
  }

  const act = (action: () => void) => {
    setAnchor(null);
    action();
  };

  return (
    <>
      <ButtonBase
        onClick={(event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}
        aria-label={t('day.staleActions', { count: task.carryCount })}
        aria-haspopup="menu"
        sx={{ ...badgeSx, color: 'warning.main' }}
      >
        {label}
      </ButtonBase>
      <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => act(() => void promoteTaskToTemplate(task))}>
          {t('day.toTemplate')}
        </MenuItem>
        <MenuItem onClick={() => act(() => onDelete(task))}>{t('common.delete')}</MenuItem>
        <MenuItem onClick={() => setAnchor(null)}>{t('day.keep')}</MenuItem>
      </Menu>
    </>
  );
};
