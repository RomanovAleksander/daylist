// Тёмная схема — основная: акцент приглушённый, чтобы не слепить на OLED вечером.
export const darkPalette = {
  primary: { main: '#E8A34A', contrastText: '#121419' },
  warning: { main: '#E47A4A' },
  background: { default: '#121419', paper: '#1B1E25' },
  text: { primary: '#E8EAF0', secondary: '#8A91A3', disabled: '#5F6676' },
  divider: '#2A2E38',
};

// В светлой схеме акцент темнее: #E8A34A на белом не проходит по контрасту для мелких меток.
export const lightPalette = {
  primary: { main: '#B26B12', contrastText: '#FFFFFF' },
  warning: { main: '#C2531F' },
  background: { default: '#F7F7F8', paper: '#FFFFFF' },
  text: { primary: '#1B1E25', secondary: '#5D6475', disabled: '#9AA0AD' },
  divider: '#E3E5EA',
};
