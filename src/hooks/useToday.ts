import { useEffect, useState } from 'react';

import { useUIStore } from '@/store/ui.store';
import { msUntilNextDay, todayKey, type DateKey } from '@/utils/date';

/** Текущая дата с учётом начала дня; переключается сама — по таймеру и при возврате в приложение. */
export const useToday = (): DateKey => {
  const dayStartHour = useUIStore((s) => s.dayStartHour);

  const [today, setToday] = useState(() => todayKey(new Date(), dayStartHour));

  useEffect(() => {
    const refresh = () => setToday(todayKey(new Date(), dayStartHour));
    refresh();

    // Таймер в фоне засыпает вместе с вкладкой, поэтому дату перепроверяем и при возврате.
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(
        () => {
          refresh();
          schedule();
        },
        msUntilNextDay(new Date(), dayStartHour) + 1000
      );
    };
    schedule();

    const onVisible = () => document.visibilityState === 'visible' && refresh();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
    };
  }, [dayStartHour]);

  return today;
};
