import { useCallback, type FC, type ReactNode, type RefObject } from 'react';

import { Box, Drawer, Typography } from '@mui/material';

import { useBackToClose } from '@/hooks/useBackToClose';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Поле, в которое сразу ставится фокус: чтобы на телефоне открылась клавиатура. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
}

/** Шторка снизу для действий над элементом: вместо мелких иконок — подписанные пункты. */
export const BottomSheet: FC<Props> = ({ open, onClose, title, initialFocusRef, children }) => {
  // Содержимое Drawer рендерится в портале позже эффектов родителя, поэтому фокус ставим, когда
  // к DOM подключилась сама шторка; стабильный колбэк — чтобы не возвращать фокус на каждом рендере.
  const focusInitial = useCallback(
    (paper: HTMLDivElement | null) => {
      if (paper) initialFocusRef?.current?.focus();
    },
    [initialFocusRef]
  );

  useBackToClose(open, onClose);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      disableAutoFocus={!!initialFocusRef}
      slotProps={{
        paper: {
          ref: focusInitial,
          sx: {
            maxWidth: 600,
            mx: 'auto',
            borderRadius: '24px 24px 0 0',
            px: 2,
            pt: 1,
            pb: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
            backgroundImage: 'none',
          },
        },
      }}
    >
      <Box
        aria-hidden
        sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider', mx: 'auto', mb: 1.5 }}
      />
      {title && (
        <Typography component="h2" sx={{ fontWeight: 600, fontSize: 17, mb: 1 }}>
          {title}
        </Typography>
      )}
      {children}
    </Drawer>
  );
};
