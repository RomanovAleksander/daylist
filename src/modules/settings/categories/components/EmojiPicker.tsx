import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, ButtonBase } from '@mui/material';

// Без флагов: на Ubuntu они рисуются буквами вместо картинки.
const EMOJI = [
  '💼',
  '🔎',
  '🗣️',
  '🤖',
  '🏠',
  '🏃',
  '📚',
  '💰',
  '🎓',
  '🛒',
  '🧘',
  '❤️',
  '🎯',
  '✍️',
  '🧠',
  '🎵',
];

interface Props {
  value: string | undefined;
  onChange: (emoji: string | undefined) => void;
}

export const EmojiPicker: FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Box
      role="radiogroup"
      aria-label={t('settings.emoji')}
      sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}
    >
      <ButtonBase
        role="radio"
        aria-checked={!value}
        aria-label={t('settings.noEmoji')}
        onClick={() => onChange(undefined)}
        sx={{
          ...cellSx,
          bgcolor: !value ? 'primary.main' : 'action.hover',
          color: !value ? 'primary.contrastText' : 'text.secondary',
        }}
      >
        Aa
      </ButtonBase>
      {EMOJI.map((emoji) => (
        <ButtonBase
          key={emoji}
          role="radio"
          aria-checked={value === emoji}
          aria-label={emoji}
          onClick={() => onChange(emoji)}
          sx={{ ...cellSx, bgcolor: value === emoji ? 'primary.main' : 'action.hover' }}
        >
          {emoji}
        </ButtonBase>
      ))}
    </Box>
  );
};

const cellSx = { width: 40, height: 40, borderRadius: 2.5, fontSize: 18 } as const;
