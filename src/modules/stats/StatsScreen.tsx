import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PagesConfig } from '@/config/pages.config';
import { useToday } from '@/hooks/useToday';
import { isStale } from '@/modules/day';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { SettingsSection } from '@/ui/SettingsSection';

import { CategoryClosureList } from './components/CategoryClosureList';
import { StaleList } from './components/StaleList';
import { TodaySummary } from './components/TodaySummary';
import { WeekChart } from './components/WeekChart';
import { useStatsData } from './hooks/useStatsData';
import { completion, streak, weekDates } from './utils/stats';

export const StatsScreen: FC = () => {
  const { t } = useTranslation();

  const today = useToday();
  const data = useStatsData();

  const summary = useMemo(() => {
    if (!data) return null;
    const todayTasks = data.byDate.get(today) ?? [];
    return {
      today: completion(todayTasks),
      streak: streak(data.byDate, data.builtDates, today),
      stale: todayTasks.filter((task) => !task.done && isStale(task)),
    };
  }, [data, today]);

  if (!data || !summary) return null;

  return (
    <>
      <ScreenHeader
        title={t('nav.stats')}
        back={{ to: PagesConfig.MORE, label: t('common.back') }}
      />
      <TodaySummary today={summary.today} streak={summary.streak} />
      <SettingsSection title={t('stats.week')}>
        <WeekChart dates={weekDates(today)} byDate={data.byDate} />
      </SettingsSection>
      <CategoryClosureList today={today} byDate={data.byDate} categories={data.categories} />
      <StaleList tasks={summary.stale} />
    </>
  );
};
