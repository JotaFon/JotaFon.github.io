import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { pt } from './locales/pt';
import { en } from './locales/en';

const i18n = i18next.createInstance();

void i18n.use(initReactI18next).init({
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  resources: { 'pt-BR': { portfolio: pt }, en: { portfolio: en } },
  supportedLngs: ['pt-BR', 'en'],
  defaultNS: 'portfolio',
  interpolation: { escapeValue: false },
  initImmediate: false,
});

export default i18n;
