import { useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import type { Task } from '@/db';
import { useToday } from '@/hooks/useToday';
import { useCategories } from '@/modules/settings/categories';
import { UndoSnackbar } from '@/ui/UndoSnackbar';

import { addTask, deleteTask, restoreTask } from './api/tasks.api';
import { CategoryBlock } from './components/CategoryBlock';
import { DayHeader } from './components/DayHeader';
import { FirstCategory } from './components/FirstCategory';
import { useDayTasks } from './hooks/useDayTasks';
import { groupTasks } from './utils/groupTasks';

export const TodayScreen: FC = () => {
  const [deleted, setDeleted] = useState<Task | null>(null);

  const { t } = useTranslation();

  const today = useToday();
  const categories = useCategories();
  const tasks = useDayTasks(today);

  const groups = useMemo(() => groupTasks(categories ?? [], tasks ?? []), [categories, tasks]);
  const total = groups.reduce((sum, g) => sum + g.tasks.length, 0);
  const done = groups.reduce((sum, g) => sum + g.doneCount, 0);

  const handleDelete = (task: Task) => {
    void deleteTask(task.id);
    setDeleted(task);
  };

  const handleUndo = () => {
    if (deleted) void restoreTask(deleted.id);
    setDeleted(null);
  };

  // До первого ответа IndexedDB ничего не рисуем: иначе мелькнёт пустое состояние.
  if (!categories || !tasks) return null;

  return (
    <>
      <DayHeader date={today} done={done} total={total} />
      {categories.length === 0 && <FirstCategory />}
      {groups.map((group) => (
        <CategoryBlock
          key={group.category.id}
          group={group}
          onAdd={(categoryId, text) => void addTask(today, categoryId, text)}
          onDelete={handleDelete}
        />
      ))}
      <UndoSnackbar
        open={deleted !== null}
        message={t('day.deleted')}
        actionLabel={t('day.undo')}
        onUndo={handleUndo}
        onClose={() => setDeleted(null)}
      />
    </>
  );
};
