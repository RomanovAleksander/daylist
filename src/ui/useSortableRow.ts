import { createContext, useContext, type MouseEvent, type RefObject } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/** Когда закончилось последнее перетаскивание списка: отпускание пальца не должно стать тапом. */
export const DragEndedAt = createContext<RefObject<number> | null>(null);

const CLICK_GUARD_MS = 300;

/** Поднятая строка: тень и непрозрачный фон, чтобы не просвечивали соседи. */
export const draggingSx = { borderRadius: 3, boxShadow: 8, bgcolor: 'background.paper' } as const;

/**
 * Строка сортируемого списка: `setNodeRef` и `style` — на корень строки, `dragProps` — на то, за что тянут
 * (вся строка или только заголовок, если внутри есть свой сортируемый список).
 */
export const useSortableRow = (id: string, disabled = false) => {
  const endedAt = useContext(DragEndedAt);
  const { setNodeRef, listeners, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  return {
    isDragging,
    setNodeRef,
    style: {
      transform: CSS.Translate.toString(transform),
      transition,
      position: 'relative' as const,
      zIndex: isDragging ? 2 : undefined,
    },
    dragProps: {
      ...listeners,
      onClickCapture: (event: MouseEvent) => {
        if (endedAt && Date.now() - endedAt.current < CLICK_GUARD_MS) {
          event.stopPropagation();
          event.preventDefault();
        }
      },
      // Долгое нажатие на Android иначе выделяет текст и открывает системное меню.
      style: { WebkitTouchCallout: 'none', userSelect: 'none' } as const,
    },
  };
};
