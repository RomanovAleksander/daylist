import { useState, type FC, type KeyboardEvent, type ReactNode, type Ref } from 'react';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, IconButton, InputBase } from '@mui/material';

import { useKeyboardOpen } from '@/hooks/useKeyboardOpen';

interface Props {
  placeholder: string;
  submitLabel: string;
  onSubmit: (text: string) => void;
  /** Слева от поля: например, выбор категории. */
  start?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
}

// Высота нижней навигации MUI; поле стоит прямо над ней.
const NAV_HEIGHT = 56;
const CONTROL_HEIGHT = 48;
const COMPOSER_HEIGHT = CONTROL_HEIGHT + 16;

/**
 * Поле ввода внизу экрана, как в мессенджере. Enter или кнопка добавляют и оставляют фокус для
 * следующей записи. Рисует распорку в потоке, чтобы последний элемент списка не прятался под полем.
 */
export const Composer: FC<Props> = ({ placeholder, submitLabel, onSubmit, start, inputRef }) => {
  const [value, setValue] = useState('');

  const keyboardOpen = useKeyboardOpen();

  const text = value.trim();

  const submit = () => {
    if (!text) return;
    onSubmit(text);
    setValue('');
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
    event.preventDefault();
    submit();
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
            height: COMPOSER_HEIGHT,
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
            endAdornment={
              text && (
                <IconButton
                  aria-label={submitLabel}
                  // Не забираем фокус у поля, иначе клавиатура закроется после каждой записи.
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={submit}
                  sx={{
                    width: 36,
                    height: 36,
                    mr: -0.75,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': { bgcolor: 'primary.main' },
                  }}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
              )
            }
            sx={{
              height: CONTROL_HEIGHT,
              bgcolor: 'background.paper',
              borderRadius: 3.5,
              pl: 2,
              pr: 1,
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
