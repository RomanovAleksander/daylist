import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import type { Category } from '@/db';
import { useToday } from '@/hooks/useToday';
import { AddInlineRow } from '@/ui/AddInlineRow';
import { SettingsSection } from '@/ui/SettingsSection';

import { CategoryRow } from './CategoryRow';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';
import { addCategory, deleteCategory, reorderCategories } from '../api/categories.api';
import { useCategories } from '../hooks/useCategories';

export const CategoriesSection: FC = () => {
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const { t } = useTranslation();

  const today = useToday();
  const categories = useCategories();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!categories || !over || active.id === over.id) return;
    const ids = categories.map((c) => c.id);
    void reorderCategories(
      arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)))
    );
  };

  const handleConfirmDelete = (category: Category) => {
    setToDelete(null);
    void deleteCategory(category.id, today);
  };

  return (
    <SettingsSection title={t('settings.categories')}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={categories ?? []} strategy={verticalListSortingStrategy}>
          {categories?.map((category) => (
            <CategoryRow key={category.id} category={category} onDelete={setToDelete} />
          ))}
        </SortableContext>
      </DndContext>
      <AddInlineRow
        label={t('settings.addCategory')}
        placeholder={t('settings.categoryName')}
        onAdd={(name) => void addCategory(name)}
      />
      <DeleteCategoryDialog
        category={toDelete}
        onConfirm={handleConfirmDelete}
        onClose={() => setToDelete(null)}
      />
    </SettingsSection>
  );
};
