import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import { SettingsSection } from '@/ui/SettingsSection';
import type { DateKey } from '@/utils/date';

import { categoryClosure, lastDates, weekDates, type StatsInput } from '../utils/stats';

type Period = 'week' | 'month';

interface Props extends StatsInput {
  today: DateKey;
}

export const CategoryClosureList: FC<Props> = ({ today, byDate, categories }) => {
  const [period, setPeriod] = useState<Period>('week');

  const { t } = useTranslation();

  const dates = period === 'week' ? weekDates(today) : lastDates(today, 30);
  const rows = categoryClosure(categories, byDate, dates);

  return (
    <SettingsSection title={t('stats.categories')}>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={period}
        onChange={(_, value: Period | null) => value && setPeriod(value)}
        sx={{ my: 1 }}
      >
        <ToggleButton value="week">{t('stats.week')}</ToggleButton>
        <ToggleButton value="month">{t('stats.month')}</ToggleButton>
      </ToggleButtonGroup>
      {rows.map(({ category, closed, withTasks }) => (
        <Box
          key={category.id}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography>{category.name}</Typography>
          <Typography sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
            {withTasks === 0 ? '—' : t('stats.closure', { closed, total: withTasks })}
          </Typography>
        </Box>
      ))}
    </SettingsSection>
  );
};
