import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { pt } from './locales/pt';

const i18n = i18next.createInstance();

void i18n.use(initReactI18next).init({
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  resources: { 'pt-BR': { portfolio: pt } },
  defaultNS: 'portfolio',
  interpolation: { escapeValue: false },
  initImmediate: false,
});

export default i18n;
