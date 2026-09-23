'use client';

import { useEffect } from 'react';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation('portfolio');
  const { resolvedLanguage } = i18n;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('portfolio-language');

      if (saved === 'pt-BR' || saved === 'en') {
        void i18n.changeLanguage(saved);
      }
    } catch {
      // Language switching remains available when storage is blocked.
    }
  }, [i18n]);

  useEffect(() => {
    document.documentElement.lang = resolvedLanguage === 'en' ? 'en' : 'pt-BR';
    document.title = t('meta.title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  }, [resolvedLanguage, t]);

  function changeLanguage(language: 'pt-BR' | 'en') {
    void i18n.changeLanguage(language);

    try {
      window.localStorage.setItem('portfolio-language', language);
    } catch {
      // The active language does not depend on persistence.
    }
  }

  return (
    <div className="language-switcher" role="group" aria-label={t('nav.language')}>
      <Languages size={18} aria-hidden="true" />
      <button type="button" lang="pt-BR" aria-label={t('nav.portuguese')} aria-pressed={resolvedLanguage !== 'en'} onClick={() => changeLanguage('pt-BR')}>{t('nav.pt')}</button>
      <button type="button" lang="en" aria-label={t('nav.english')} aria-pressed={resolvedLanguage === 'en'} onClick={() => changeLanguage('en')}>{t('nav.en')}</button>
    </div>
  );
}
