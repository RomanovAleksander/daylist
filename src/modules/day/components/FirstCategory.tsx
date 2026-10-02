import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import { addCategory } from '@/modules/settings/categories';
import { InlineInput } from '@/ui/InlineInput';

export const FirstCategory: FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography sx={{ color: 'text.secondary' }}>{t('day.firstCategory')}</Typography>
      <InlineInput
        placeholder={t('day.categoryName')}
        ariaLabel={t('day.categoryName')}
        onSubmit={(name) => void addCategory(name)}
        onBlurSubmit={(name) => name && void addCategory(name)}
        onClose={() => undefined}
      />
    </Box>
  );
};
