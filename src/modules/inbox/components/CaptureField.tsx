import { useState, type FC, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { InputBase } from '@mui/material';

import { addInboxItem } from '../api/inbox.api';

/** Всегда открытое поле: Enter сохраняет мысль и оставляет фокус для следующей. */
export const CaptureField: FC = () => {
  const [value, setValue] = useState('');

  const { t } = useTranslation();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    void addInboxItem(text);
    setValue('');
  };

  return (
    <InputBase
      fullWidth
      value={value}
      placeholder={t('inbox.capture')}
      inputProps={{ 'aria-label': t('inbox.capture'), enterKeyHint: 'done' }}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={handleKeyDown}
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        px: 1.5,
        py: 1,
        my: 1,
        '&.Mui-focused': { borderColor: 'primary.main' },
      }}
    />
  );
};
