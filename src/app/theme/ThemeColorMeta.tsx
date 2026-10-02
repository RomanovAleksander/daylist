import { useEffect, type FC } from 'react';

import { useColorScheme } from '@mui/material';

import { darkPalette, lightPalette } from './palette';

/** Красит статус-бар Android и заголовок окна PWA в цвет фона текущей темы. */
export const ThemeColorMeta: FC = () => {
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const palette = colorScheme === 'light' ? lightPalette : darkPalette;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', palette.background.default);
  }, [colorScheme]);

  return null;
};
