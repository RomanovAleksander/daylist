import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, ButtonBase } from '@mui/material';

import { InlineInput } from '@/ui/InlineInput';

interface Props {
  onAdd: (text: string) => void;
}

export const AddTaskInput: FC<Props> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  if (!open) {
    return (
      <ButtonBase
        onClick={() => setOpen(true)}
        sx={{ color: 'text.secondary', py: 1.25, pl: 4.25, fontSize: 15 }}
      >
        {t('day.addTask')}
      </ButtonBase>
    );
  }

  return (
    <Box sx={{ pl: 4.25, py: 0.75 }}>
      <InlineInput
        placeholder={t('day.newTask')}
        ariaLabel={t('day.newTask')}
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
