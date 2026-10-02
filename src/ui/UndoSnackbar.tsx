import type { FC } from 'react';

import { Button, Snackbar } from '@mui/material';

interface Props {
  open: boolean;
  message: string;
  actionLabel: string;
  onUndo: () => void;
  onClose: () => void;
}

export const UndoSnackbar: FC<Props> = ({ open, message, actionLabel, onUndo, onClose }) => (
  <Snackbar
    open={open}
    message={message}
    autoHideDuration={5000}
    onClose={(_, reason) => reason !== 'clickaway' && onClose()}
    // Над нижней навигацией, а не поверх неё.
    sx={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px) !important' }}
    action={
      <Button size="small" onClick={onUndo} sx={{ color: 'primary.light', fontWeight: 600 }}>
        {actionLabel}
      </Button>
    }
  />
);
