import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import type { Task } from '@/db';
import { SettingsSection } from '@/ui/SettingsSection';

interface Props {
  tasks: Task[];
}

export const StaleList: FC<Props> = ({ tasks }) => {
  const { t } = useTranslation();

  return (
    <SettingsSection title={t('stats.stale')}>
      {tasks.length === 0 && (
        <Typography sx={{ color: 'text.secondary' }}>{t('stats.noStale')}</Typography>
      )}
      {tasks.map((task) => (
        <Box key={task.id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, py: 1 }}>
          <Typography sx={{ overflowWrap: 'anywhere' }}>{task.text}</Typography>
          <Typography sx={{ color: 'warning.main', whiteSpace: 'nowrap', fontSize: 14 }}>
            {t('day.carryDays', { count: task.carryCount })}
          </Typography>
        </Box>
      ))}
    </SettingsSection>
  );
};
