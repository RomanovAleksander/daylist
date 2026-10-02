import { useEffect, useRef, useState, type FC, type KeyboardEvent } from 'react';

import { InputBase } from '@mui/material';

interface Props {
  initialValue?: string;
  placeholder?: string;
  ariaLabel: string;
  /** Enter с текстом. Возвращает `true`, если поле нужно очистить и оставить открытым. */
  onSubmit: (value: string) => boolean | void;
  /** Esc, пустой Enter или потеря фокуса. */
  onClose: () => void;
  /** Потеря фокуса с изменённым текстом; без него blur просто закрывает поле. */
  onBlurSubmit?: (value: string) => void;
}

export const InlineInput: FC<Props> = ({
  initialValue = '',
  placeholder,
  ariaLabel,
  onSubmit,
  onClose,
  onBlurSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialValue);

  // Поле появляется только в ответ на тап пользователя, поэтому фокус в нём ожидаем.
  useEffect(() => inputRef.current?.focus(), []);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }
    // Во время IME-набора Enter подтверждает слово, а не задачу.
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
    event.preventDefault();
    const text = value.trim();
    if (!text) {
      onClose();
      return;
    }
    if (onSubmit(text)) setValue('');
  };

  const handleBlur = () => {
    const text = value.trim();
    if (onBlurSubmit && text !== initialValue) onBlurSubmit(text);
    else onClose();
  };

  return (
    <InputBase
      inputRef={inputRef}
      fullWidth
      value={value}
      placeholder={placeholder}
      inputProps={{ 'aria-label': ariaLabel, enterKeyHint: 'done' }}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      sx={{ py: 0.5, fontSize: 'inherit' }}
    />
  );
};
