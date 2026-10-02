import { useEffect, useRef, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';

import { PagesConfig } from '@/config/pages.config';
import { useToday } from '@/hooks/useToday';
import { EmptyState } from '@/ui/EmptyState';
import { ScreenHeader } from '@/ui/ScreenHeader';

import { HistoryDay } from './components/HistoryDay';
import { useAllCategories } from './hooks/useAllCategories';
import { usePastDays } from './hooks/usePastDays';

const PAGE = 14;

export const HistoryScreen: FC = () => {
  const sentinel = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(PAGE);

  const { t } = useTranslation();

  const today = useToday();
  const categories = useAllCategories();
  const days = usePastDays(today, limit);

  const hasMore = days?.length === limit;

  // Подгружаем старые дни, когда низ списка показался на экране. Наблюдатель пересоздаём после
  // каждой страницы: если низ всё ещё виден, новый наблюдатель сразу сработает снова.
  useEffect(() => {
    const node = sentinel.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setLimit((value) => value + PAGE);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, limit]);

  if (!days || !categories) return null;

  return (
    <>
      <ScreenHeader
        title={t('nav.history')}
        back={{ to: PagesConfig.MORE, label: t('common.back') }}
      />
      {days.length === 0 && <EmptyState title={t('history.empty')} />}
      {days.map((day) => (
        <HistoryDay key={day.date} day={day} categories={categories} />
      ))}
      {hasMore && <Box ref={sentinel} sx={{ height: 1 }} />}
    </>
  );
};
