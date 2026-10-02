import { useState, type FC } from 'react';

import { TextField, type TextFieldProps } from '@mui/material';

type Props = Omit<TextFieldProps, 'value' | 'onChange' | 'onBlur'> & {
  value: string;
  onCommit: (value: string) => void;
};

/** Поле, которое пишет в базу на blur: ввод по буквам не плодит записи и синки. */
export const BlurTextField: FC<Props> = ({ value, onCommit, ...props }) => {
  const [draft, setDraft] = useState(value);

  return (
    <TextField
      {...props}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => draft !== value && onCommit(draft)}
    />
  );
};
