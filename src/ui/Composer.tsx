import { useState, type FC, type KeyboardEvent, type ReactNode, type Ref } from 'react';

import { Box, InputBase } from '@mui/material';

import { useKeyboardOpen } from '@/hooks/useKeyboardOpen';

interface Props {
  placeholder: string;
  onSubmit: (text: string) => void;
  /** Слева от поля: например, выбор категории. */
  start?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
}

// Высота нижней навигации MUI; поле стоит прямо над ней.
const NAV_HEIGHT = 56;
const COMPOSER_HEIGHT = 64;

/**
 * Поле ввода внизу экрана, как в мессенджере. Enter добавляет и оставляет фокус для следующей
 * записи. Рисует распорку в потоке, чтобы последний элемент списка не прятался под полем.
 */
export const Composer: FC<Props> = ({ placeholder, onSubmit, start, inputRef }) => {
  const [value, setValue] = useState('');

  const keyboardOpen = useKeyboardOpen();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    onSubmit(text);
    setValue('');
  };

  return (
    <>
      <Box aria-hidden sx={{ height: COMPOSER_HEIGHT }} />
      <Box
        sx={{
          position: 'fixed',
          insetInline: 0,
          // С открытой клавиатурой навигация скрыта, и поле садится прямо на клавиатуру.
          bottom: keyboardOpen ? 0 : `calc(env(safe-area-inset-bottom, 0px) + ${NAV_HEIGHT}px)`,
          bgcolor: 'background.default',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: 600,
            mx: 'auto',
            px: 2,
            py: 1,
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          {start}
          <InputBase
            fullWidth
            value={value}
            placeholder={placeholder}
            inputRef={inputRef}
            inputProps={{ 'aria-label': placeholder, enterKeyHint: 'send' }}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 3.5,
              px: 1.75,
              py: 1,
              border: 1,
              borderColor: 'divider',
              '&.Mui-focused': { borderColor: 'primary.main' },
            }}
          />
        </Box>
      </Box>
    </>
  );
};
