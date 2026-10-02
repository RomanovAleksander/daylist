import type { FC, ReactNode } from 'react';

import { Box, Drawer, Typography } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Шторка снизу для действий над элементом: вместо мелких иконок — подписанные пункты. */
export const BottomSheet: FC<Props> = ({ open, onClose, title, children }) => (
  <Drawer
    anchor="bottom"
    open={open}
    onClose={onClose}
    slotProps={{
      paper: {
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
