import type { FC, ReactNode } from 'react';

import { Box, ButtonBase } from '@mui/material';

interface Props {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export const SheetAction: FC<Props> = ({ icon, label, onClick, danger }) => (
  <ButtonBase
    onClick={onClick}
    sx={{
      width: '100%',
      justifyContent: 'flex-start',
      gap: 1.5,
      py: 1.25,
      fontSize: 15,
      color: danger ? 'error.main' : 'text.primary',
      borderBottom: 1,
      borderColor: 'divider',
    }}
  >
    <Box
      component="span"
      sx={{
        width: 34,
        height: 34,
        borderRadius: 2.5,
        bgcolor: 'action.hover',
        display: 'grid',
        placeItems: 'center',
        flex: 'none',
      }}
    >
      {icon}
    </Box>
    {label}
  </ButtonBase>
);
