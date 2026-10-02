import { useMemo, useRef, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import type { Category, Task } from '@/db';
import { useToday } from '@/hooks/useToday';
import { CategorySheet, useCategories } from '@/modules/settings/categories';
import { useUIStore } from '@/store/ui.store';
import { Composer } from '@/ui/Composer';
import { UndoSnackbar } from '@/ui/UndoSnackbar';

import { addTask, deleteTask, restoreTask } from './api/tasks.api';
import { CategoryCard } from './components/CategoryCard';
import { CategoryChip } from './components/CategoryChip';
import { CategoryList } from './components/CategoryList';
import { DayHeader } from './components/DayHeader';
import { DayHero } from './components/DayHero';
import { FirstCategory } from './components/FirstCategory';
import { TaskSheet } from './components/TaskSheet';
import { useDayTasks } from './hooks/useDayTasks';
import { useEnsureDay } from './hooks/useEnsureDay';
import { groupTasks } from './utils/groupTasks';

type CategorySheetState = { category?: Category } | null;

export const TodayScreen: FC = () => {
  const composerInput = useRef<HTMLInputElement>(null);
  const [deleted, setDeleted] = useState<Task | null>(null);
  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [categorySheet, setCategorySheet] = useState<CategorySheetState>(null);

  const { t } = useTranslation();

  const composerCategoryId = useUIStore((s) => s.composerCategoryId);
  const setComposerCategoryId = useUIStore((s) => s.setComposerCategoryId);
  const layout = useUIStore((s) => s.todayLayout);

  const today = useToday();
  const carried = useEnsureDay(today);
  const categories = useCategories();
  const tasks = useDayTasks(today);

  const groups = useMemo(() => groupTasks(categories ?? [], tasks ?? []), [categories, tasks]);
  const total = groups.reduce((sum, g) => sum + g.tasks.length, 0);
  const done = groups.reduce((sum, g) => sum + g.doneCount, 0);
  const CategoryGroupView = layout === 'list' ? CategoryList : CategoryCard;
  const selected = categories?.find((c) => c.id === composerCategoryId) ?? categories?.[0];

  const handleDelete = (task: Task) => {
    void deleteTask(task.id);
    setDeleted(task);
  };

  const addHere = (category: Category) => {
    setComposerCategoryId(category.id);
    setCategorySheet(null);
    composerInput.current?.focus();
  };

  // До первого ответа IndexedDB ничего не рисуем: иначе мелькнёт пустое состояние.
  if (!categories || !tasks) return null;

  return (
    <>
      {layout === 'list' ? (
        <DayHeader date={today} done={done} total={total} carried={carried} />
      ) : (
        <DayHero date={today} done={done} total={total} carried={carried} />
      )}
      {categories.length === 0 && <FirstCategory />}
      {groups.map((group) => (
        <CategoryGroupView
          key={group.category.id}
          group={group}
          onOpenCategory={(category) => setCategorySheet({ category })}
          onOpenTask={setOpenTask}
          onDelete={handleDelete}
        />
      ))}
      {selected && (
        <Composer
          placeholder={t('day.newTaskIn')}
          submitLabel={t('common.add')}
          inputRef={composerInput}
          onSubmit={(text) => void addTask(today, selected.id, text)}
          start={
            <CategoryChip
              categories={categories}
              selected={selected}
              onSelect={(category) => setComposerCategoryId(category.id)}
              onCreate={() => setCategorySheet({})}
            />
          }
        />
      )}
      {openTask && (
        <TaskSheet
          key={openTask.id}
          task={openTask}
          categories={categories}
          onClose={() => setOpenTask(null)}
          onDelete={handleDelete}
        />
      )}
      {categorySheet && (
        <CategorySheet
          key={categorySheet.category?.id ?? 'new'}
          open
          category={categorySheet.category}
          onClose={() => setCategorySheet(null)}
          onCreated={setComposerCategoryId}
          onAddTaskHere={addHere}
        />
      )}
      <UndoSnackbar
        open={deleted !== null}
        message={t('day.deleted')}
        actionLabel={t('day.undo')}
        onUndo={() => {
          if (deleted) void restoreTask(deleted.id);
          setDeleted(null);
        }}
        onClose={() => setDeleted(null)}
      />
    </>
  );
};
