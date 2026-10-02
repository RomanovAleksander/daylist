import { useRef, type FC, type ReactNode } from 'react';

import {
  closestCenter,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box } from '@mui/material';

import { DragEndedAt, draggingSx, useSortableRow } from './useSortableRow';

interface ListProps {
  ids: string[];
  onReorder: (ids: string[]) => void;
  children: ReactNode;
}

/**
 * Порядок меняется перетаскиванием: на телефоне — после долгого нажатия (короткий тап и свайп
 * остаются за строкой), мышью — после небольшого сдвига.
 */
export const SortableList: FC<ListProps> = ({ ids, onReorder, children }) => {
  const endedAt = useRef(0);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 300, tolerance: 6 } })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    endedAt.current = Date.now();
    if (!over || active.id === over.id) return;
    onReorder(arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragCancel={() => (endedAt.current = Date.now())}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <DragEndedAt.Provider value={endedAt}>{children}</DragEndedAt.Provider>
      </SortableContext>
    </DndContext>
  );
};

interface ItemProps {
  id: string;
  disabled?: boolean;
  children: ReactNode;
}

/** Строка, которую тянут целиком. */
export const SortableItem: FC<ItemProps> = ({ id, disabled, children }) => {
  const { setNodeRef, style, dragProps, isDragging } = useSortableRow(id, disabled);

  return (
    <Box
      ref={setNodeRef}
      {...dragProps}
      style={{ ...style, ...dragProps.style }}
      sx={isDragging ? draggingSx : undefined}
    >
      {children}
    </Box>
  );
};
