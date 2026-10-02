import { useState, type FC } from 'react';

import { Box, ButtonBase } from '@mui/material';

import { InlineInput } from './InlineInput';

interface Props {
  label: string;
  placeholder: string;
  onAdd: (text: string) => void;
  indent?: number;
}

/** Строка «+ …», которая превращается в поле: Enter добавляет и оставляет поле для следующей. */
export const AddInlineRow: FC<Props> = ({ label, placeholder, onAdd, indent = 0 }) => {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <ButtonBase
        onClick={() => setOpen(true)}
        sx={{
          width: '100%',
          justifyContent: 'flex-start',
          color: 'text.secondary',
          py: 1.25,
          pl: indent,
          fontSize: 15,
        }}
      >
        {label}
      </ButtonBase>
    );
  }

  return (
    <Box sx={{ pl: indent, py: 0.75 }}>
      <InlineInput
        placeholder={placeholder}
        ariaLabel={placeholder}
        onSubmit={(text) => {
          onAdd(text);
          return true;
        }}
        onBlurSubmit={(text) => {
          // Тап мимо поля на телефоне не должен терять набранный текст.
          if (text) onAdd(text);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
};
