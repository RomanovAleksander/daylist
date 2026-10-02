import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { SettingsSection } from '@/ui/SettingsSection';

import { disconnect, isConnected, isDropboxConfigured, startLogin } from '../api/dropbox.auth';
import { syncNow } from '../api/syncNow';
import { useSyncStore } from '../sync.store';

export const DropboxSection: FC = () => {
  const [connected, setConnected] = useState(isConnected);

  const { t } = useTranslation();

  const status = useSyncStore((s) => s.status);
  const lastSyncedAt = useSyncStore((s) => s.lastSyncedAt);
  const setStatus = useSyncStore((s) => s.setStatus);

  const handleDisconnect = async () => {
    await disconnect();
    setConnected(false);
    setStatus('disconnected');
  };

  if (!isDropboxConfigured()) {
    return (
      <SettingsSection title={t('sync.title')}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('sync.notConfigured')}
        </Typography>
      </SettingsSection>
    );
  }

  return (
    <SettingsSection title={t('sync.title')}>
      {connected ? (
        <>
          <Typography>{t(`sync.status.${status}`)}</Typography>
          {lastSyncedAt && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('sync.lastSynced', { time: dayjs(lastSyncedAt).format('D.MM, HH:mm') })}
            </Typography>
          )}
          {status === 'error' && (
            <Typography variant="body2" sx={{ color: 'warning.main', mt: 0.5 }}>
              {t('sync.errorHint')}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => void syncNow()}
              disabled={status === 'syncing'}
            >
              {t('sync.syncNow')}
            </Button>
            <Button color="inherit" onClick={() => void handleDisconnect()}>
              {t('sync.disconnect')}
            </Button>
          </Box>
        </>
      ) : (
        <Button variant="outlined" onClick={() => void startLogin()} sx={{ mt: 0.5 }}>
          {t('sync.connect')}
        </Button>
      )}
    </SettingsSection>
  );
};
