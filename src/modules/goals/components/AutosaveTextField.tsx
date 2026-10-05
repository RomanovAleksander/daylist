import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FC } from 'react';

import { TextField, type TextFieldProps } from '@mui/material';

type Props = Omit<TextFieldProps, 'value' | 'onChange' | 'onBlur' | 'onFocus'> & {
  value: string;
  onCommit: (value: string) => void;
};

const SAVE_DELAY_MS = 600;

/**
 * Поле, которое пишет в базу на паузе в наборе, на blur, при уходе с экрана и сворачивании
 * приложения. Только blur терял текст: «назад» на Android и закрытие PWA его не вызывают.
 */
export const AutosaveTextField: FC<Props> = ({ value, onCommit, ...props }) => {
  const [draft, setDraft] = useState(value);
  const [focused, setFocused] = useState(false);
  const [seen, setSeen] = useState(value);

  const onCommitRef = useRef(onCommit);
  const draftRef = useRef(value);
  const savedRef = useRef(value);
  const timer = useRef(0);

  // Новое значение из базы (синк, другое поле) подхватываем, только пока человек не печатает.
  if (value !== seen && !focused) {
    setSeen(value);
    setDraft(value);
  }

  useEffect(() => {
    onCommitRef.current = onCommit;
    if (!focused) {
      draftRef.current = value;
      savedRef.current = value;
    }
  });

  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    if (draftRef.current === savedRef.current) return;
    savedRef.current = draftRef.current;
    onCommitRef.current(draftRef.current);
  }, []);

  useEffect(() => {
    const onHide = () => document.visibilityState === 'hidden' && flush();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [flush]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDraft(event.target.value);
    draftRef.current = event.target.value;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(flush, SAVE_DELAY_MS);
  };

  return (
    <TextField
      {...props}
      value={draft}
      onChange={handleChange}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        flush();
      }}
    />
  );
};
