import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { Box, ButtonBase } from '@mui/material';

import { PagesConfig } from '@/config/pages.config';

import { useSyncStore, type SyncStatus } from '../sync.store';

const colors: Record<Exclude<SyncStatus, 'disconnected'>, string> = {
  ok: 'success.main',
  syncing: 'primary.main',
  offline: 'text.disabled',
  error: 'warning.main',
};

/** Маленькая точка рядом с датой; по ней можно перейти в настройки синка. */
export const SyncIndicator: FC = () => {
  const { t } = useTranslation();

  const status = useSyncStore((s) => s.status);

  if (status === 'disconnected') return null;

  return (
    <ButtonBase
      component={RouterLink}
      to={PagesConfig.SETTINGS}
      aria-label={t('sync.indicator', { status: t(`sync.status.${status}`) })}
      sx={{ p: 1, m: -1, borderRadius: '50%' }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: colors[status],
          transition: 'background-color 300ms',
        }}
      />
    </ButtonBase>
  );
};
