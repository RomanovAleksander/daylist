import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useColorScheme,
} from '@mui/material';

import { useUIStore, type TodayLayout } from '@/store/ui.store';
import { SettingsSection } from '@/ui/SettingsSection';

type Mode = 'dark' | 'light' | 'system';

const DAY_START_HOURS = [0, 1, 2, 3, 4, 5, 6];

export const AppearanceSection: FC = () => {
  const { t } = useTranslation();

  const { mode, setMode } = useColorScheme();

  const dayStartHour = useUIStore((s) => s.dayStartHour);
  const setDayStartHour = useUIStore((s) => s.setDayStartHour);
  const todayLayout = useUIStore((s) => s.todayLayout);
  const setTodayLayout = useUIStore((s) => s.setTodayLayout);

  return (
    <SettingsSection title={t('settings.appearance')}>
      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        aria-label={t('settings.theme')}
        value={mode ?? 'dark'}
        onChange={(_, value: Mode | null) => value && setMode(value)}
        sx={{ my: 1 }}
      >
        <ToggleButton value="dark">{t('settings.themeDark')}</ToggleButton>
        <ToggleButton value="light">{t('settings.themeLight')}</ToggleButton>
        <ToggleButton value="system">{t('settings.themeSystem')}</ToggleButton>
      </ToggleButtonGroup>
      <Typography id="today-layout-label" sx={{ mt: 1.5 }}>
        {t('settings.todayLayout')}
      </Typography>
      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        aria-labelledby="today-layout-label"
        value={todayLayout}
        onChange={(_, value: TodayLayout | null) => value && setTodayLayout(value)}
        sx={{ my: 1 }}
      >
        <ToggleButton value="cards">{t('settings.layoutCards')}</ToggleButton>
        <ToggleButton value="list">{t('settings.layoutList')}</ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
        <Typography id="day-start-label">{t('settings.dayStart')}</Typography>
        <Select
          size="small"
          value={dayStartHour}
          onChange={(event) => setDayStartHour(Number(event.target.value))}
          slotProps={{ input: { 'aria-labelledby': 'day-start-label' } }}
        >
          {DAY_START_HOURS.map((hour) => (
            <MenuItem key={hour} value={hour}>
              {String(hour).padStart(2, '0')}:00
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
        {t('settings.dayStartHint')}
      </Typography>
    </SettingsSection>
  );
};
