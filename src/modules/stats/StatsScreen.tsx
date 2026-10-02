import { useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { PagesConfig } from '@/config/pages.config';
import { useToday } from '@/hooks/useToday';
import { isStale } from '@/modules/day';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { SettingsSection } from '@/ui/SettingsSection';

import { CategoryClosureList } from './components/CategoryClosureList';
import { Heatmap } from './components/Heatmap';
import { PeriodChart } from './components/PeriodChart';
import { PeriodSummaryCard } from './components/PeriodSummaryCard';
import { StaleList } from './components/StaleList';
import { StatTiles } from './components/StatTiles';
import { useStatsData } from './hooks/useStatsData';
import {
  chartBuckets,
  periodDates,
  periodSummary,
  previousPeriodDates,
  type Period,
} from './utils/period';
import { completion, streak } from './utils/stats';

const PERIODS: Period[] = ['week', 'month', 'year'];

export const StatsScreen: FC = () => {
  const [period, setPeriod] = useState<Period>('week');

  const { t } = useTranslation();

  const today = useToday();
  const data = useStatsData();

  const stats = useMemo(() => {
    if (!data) return null;
    const todayTasks = data.byDate.get(today) ?? [];
    const dates = periodDates(today, period);
    return {
      dates,
      current: periodSummary(data.byDate, dates),
      previous: periodSummary(data.byDate, previousPeriodDates(today, period)),
      buckets: chartBuckets(data.byDate, today, period),
      today: completion(todayTasks),
      streak: streak(data.byDate, data.builtDates, today),
      stale: todayTasks.filter((task) => !task.done && isStale(task)),
    };
  }, [data, today, period]);

  if (!data || !stats) return null;

  return (
    <>
      <ScreenHeader
        title={t('nav.stats')}
        back={{ to: PagesConfig.MORE, label: t('common.back') }}
      />
      <StatTiles today={stats.today} streak={stats.streak} />
      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        aria-label={t('stats.period')}
        value={period}
        onChange={(_, value: Period | null) => value && setPeriod(value)}
        sx={{ mb: 1.5 }}
      >
        {PERIODS.map((value) => (
          <ToggleButton key={value} value={value}>
            {t(`stats.periods.${value}`)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <PeriodSummaryCard current={stats.current} previous={stats.previous} />
      <PeriodChart buckets={stats.buckets} period={period} />
      <SettingsSection title={t('stats.categories')}>
        <CategoryClosureList
          dates={stats.dates}
          byDate={data.byDate}
          categories={data.categories}
        />
      </SettingsSection>
      <SettingsSection title={t('stats.heatmap')}>
        <Heatmap today={today} byDate={data.byDate} />
      </SettingsSection>
      <SettingsSection title={t('stats.stale')}>
        <StaleList tasks={stats.stale} />
      </SettingsSection>
    </>
  );
};
