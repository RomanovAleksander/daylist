import { useRef, useState, type ChangeEvent, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Typography } from '@mui/material';

import { SettingsSection } from '@/ui/SettingsSection';

import { exportBackup, importBackup } from '../api/backup.api';

type Result = { ok: true; count: number } | { ok: false };

export const BackupSection: FC = () => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<Result | null>(null);

  const { t } = useTranslation();

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      setResult({ ok: true, count: await importBackup(file) });
    } catch {
      setResult({ ok: false });
    }
  };

  return (
    <SettingsSection title={t('settings.data')}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
        <Button variant="outlined" onClick={() => void exportBackup()}>
          {t('settings.export')}
        </Button>
        <Button variant="outlined" onClick={() => fileInput.current?.click()}>
          {t('settings.import')}
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          hidden
          aria-label={t('settings.import')}
          onChange={(event) => void handleFile(event)}
        />
      </Box>
      {result && (
        <Typography
          variant="body2"
          role="status"
          sx={{ mt: 1, color: result.ok ? 'text.secondary' : 'warning.main' }}
        >
          {result.ok ? t('settings.imported', { count: result.count }) : t('settings.importFailed')}
        </Typography>
      )}
    </SettingsSection>
  );
};
