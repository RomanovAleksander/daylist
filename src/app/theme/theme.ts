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
  shape: { borderRadius: 10 },
});
