import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';

import uk from '@/locales/uk.json';

void i18n.use(initReactI18next).init({
  lng: 'uk',
  resources: { uk: { translation: uk } },
  interpolation: { escapeValue: false },
});
