import { Box, ButtonBase } from '@mui/material';

interface Props<T extends string> {
  label: string;
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

/** Крупные варианты-плитки вместо выпадающих списков: один тап — один выбор. */
export const ChoiceChips = <T extends string>({ label, value, options, onChange }: Props<T>) => (
  <Box role="radiogroup" aria-label={label} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
    {options.map((option) => {
      const selected = option.value === value;
      return (
        <ButtonBase
          key={option.value}
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(option.value)}
          sx={{
            px: 2,
            minHeight: 44,
            borderRadius: 3,
            fontSize: 15,
            fontWeight: selected ? 700 : 500,
            bgcolor: selected ? 'primary.main' : 'background.default',
            color: selected ? 'primary.contrastText' : 'text.primary',
          }}
        >
          {option.label}
        </ButtonBase>
      );
    })}
  </Box>
);
