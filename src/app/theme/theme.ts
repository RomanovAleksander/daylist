import { createTheme } from '@mui/material';

import { darkPalette, lightPalette } from './palette';

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    dark: { palette: darkPalette },
    light: { palette: lightPalette },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, sans-serif',
  },
  // Базовая единица 4px: в sx `borderRadius: 5` — это 20px у карточек, 3.5 — 14px у полей.
  shape: { borderRadius: 4 },
  components: {
    // index.html красит html в тёмный до загрузки JS; дальше фон должен следовать теме.
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        html: { backgroundColor: theme.vars?.palette.background.default },
      }),
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 12 },
        sizeLarge: { borderRadius: 14, fontWeight: 700, minHeight: 52 },
      },
    },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiPopover: { styleOverrides: { paper: { borderRadius: 14 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 20 } } },
    MuiToggleButton: { styleOverrides: { root: { textTransform: 'none' } } },
    // Инвертированный снекбар MUI в тёмной схеме становится белым и слепит; держим его тёмным.
    MuiSnackbarContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: '#1B1E25',
          color: '#E8EAF0',
          ...theme.applyStyles('dark', { backgroundColor: '#2B2F3A' }),
        }),
      },
    },
  },
});
