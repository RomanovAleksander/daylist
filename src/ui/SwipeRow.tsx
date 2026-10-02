import { useRef, useState, type FC, type PointerEvent, type ReactNode } from 'react';

import { Box } from '@mui/material';

interface SwipeAction {
  label: string;
  onSwipe: () => void;
}

interface Props {
  children: ReactNode;
  /** Свайп влево — обычно удаление. */
  actionLabel: string;
  onSwipe: () => void;
  /** Свайп вправо — необязательное второе действие. */
  right?: SwipeAction;
}

const THRESHOLD = 80;

/** Свайп на тач-экране; мышь и перо игнорируются — на десктопе у тех же действий есть кнопки. */
export const SwipeRow: FC<Props> = ({ children, actionLabel, onSwipe, right }) => {
  const start = useRef<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const reset = () => {
    start.current = null;
    setDragging(false);
    setOffset(0);
  };

  const handleDown = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') return;
    start.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
  };

  const handleMove = (event: PointerEvent) => {
    if (!start.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    // Вертикальное движение — это прокрутка списка, свайп не начинаем.
    if (offset === 0 && Math.abs(dy) > Math.abs(dx)) {
      reset();
      return;
    }
    setOffset(right ? dx : Math.min(0, dx));
  };

  const handleUp = () => {
    if (offset <= -THRESHOLD) onSwipe();
    else if (right && offset >= THRESHOLD) right.onSwipe();
    reset();
  };

  const showing =
    offset < 0 ? { label: actionLabel, left: false } : { label: right?.label, left: true };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {offset !== 0 && (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: showing.left ? 'flex-start' : 'flex-end',
            px: 2,
            bgcolor: showing.left ? 'primary.dark' : 'error.dark',
            color: showing.left ? 'primary.contrastText' : 'error.contrastText',
            fontSize: 14,
          }}
        >
          {showing.label}
        </Box>
      )}
      <Box
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={reset}
        sx={{
          position: 'relative',
          bgcolor: 'background.default',
          touchAction: 'pan-y',
          transform: `translateX(${offset}px)`,
          transition: dragging ? 'none' : 'transform 150ms ease-out',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
