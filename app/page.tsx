'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Copy, Check, Download } from 'lucide-react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { usePortfolioMotion } from '@/components/portfolio/use-portfolio-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LanguageSwitcher } from '@/components/portfolio/language-switcher';
import { contactLinks } from '@/lib/contact';
import { SocialIcon } from '@/components/portfolio/social-icon';
import { PageLoader } from '@/components/portfolio/page-loader';
import { Sculpture } from '@/components/portfolio/sculpture';
import i18n from '@/lib/i18n';

type WorkItem = { company: string; type: string; role: string; date: string; title: string; description: string; details: string; stack: string[] };
type SkillGroup = { title: string; items: string };

function Portfolio() {
  const { t, i18n: { resolvedLanguage } } = useTranslation('portfolio');
  const rootRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [sceneSettled, setSceneSettled] = useState(false);
  const onSceneSettled = useCallback(() => setSceneSettled(true), []);
  const onLoadingComplete = useCallback(() => setLoading(false), []);
  const items = t('work.items', { returnObjects: true }) as WorkItem[];
  const groups = t('about.groups', { returnObjects: true }) as SkillGroup[];

  usePortfolioMotion({ rootRef, enabled: !loading, language: resolvedLanguage });

  useEffect(() => {

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(t('contact.email'));
      setCopyStatus('copied');
    } catch {
      setCopyStatus('copyError');
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => setCopyStatus(''), 3000);
  }

  return (
    <>
      {loading && <PageLoader sceneSettled={sceneSettled} contentRef={rootRef} onComplete={onLoadingComplete} />}
      <div ref={rootRef} className="portfolio-root" aria-busy={loading}>
      <div className="reading-progress" aria-hidden="true" />
      <a className="skip-link" href="#main">{t('nav.skip')}</a>
<header className="site-header">
  <a href="#home" className="brand" aria-label={t('nav.home')}>
    <span className="monogram">
      <img
        src={t('brand.initials')}
        alt={t('brand.name')}
        className="w-18 h-18 object-contain"
      />
    </span>
    <span className="brand-name">
      {t('brand.shortName')}
      <br />
      {t('brand.surname')}
    </span>
  </a>

  <div className="header-actions">
    <nav aria-label={t('nav.label')}>
      <a href="#work">{t('nav.work')}</a>
      <a href="#about">{t('nav.about')}</a>
      <a className="nav-contact" href="#contact">
        {t('nav.contact')}
        <ArrowUpRight size={16} />
      </a>
    </nav>
    <LanguageSwitcher />
  </div>
</header>
      <main id="main">
        <section className="hero" id="home">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-top mono"><span><i className="status-dot" />{t('hero.availability')}</span><span>{t('hero.location')}</span></div>
          <div className="hero-main"><Sculpture onSettled={onSceneSettled}/><div className="hero-copy"><p className="eyebrow">{t('hero.eyebrow')}</p><h1><span>{t('hero.line1')}</span><span>{t('hero.line2')}</span><span className="accent">{t('hero.line3')}</span></h1></div><div className="hero-summary"><p>{t('hero.intro')}</p><a className="round-link" href="#work">{t('hero.cta')}<span data-magnetic><ArrowDown size={20} /></span></a></div></div>
          <div className="hero-bottom mono"><span>{t('hero.edition')}</span><span>{t('hero.scroll')}<ArrowDown size={14}/></span></div>
        </section>
        <section id="work" className="section work">
          <div className="section-heading"><div><h2 data-heading>{t('work.title')}</h2><p className="section-intro">{t('work.intro')}</p></div><ArrowDown className="heading-arrow" size={42} strokeWidth={1}/></div>
          <Accordion type="single" collapsible className="experience-list">
            {items.map(({ company, type, role, date, title, description, details, stack }, index) => (
              <AccordionItem key={`${company}-${index}`} value={`work-${index}`} className="experience">
                <AccordionTrigger className="experience-trigger">
                  <span className="experience-company"><span className="company-name">{company}</span><span className="experience-role">{role}</span></span>
                  <span className="experience-date mono">{date}</span>
                  <span className="experience-plus" aria-hidden="true">+</span>
                </AccordionTrigger>
                <AccordionContent className="experience-content"><div className="experience-details"><p className="eyebrow">{type}</p><h3>{title}</h3><p>{description}</p><p>{details}</p><div className="tag-list" aria-label={t('work.stack')}>{stack.map((name) => <span key={name}>{name}</span>)}</div></div></AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <a className="text-link work-github" href="https://github.com/JotaFon" target="_blank" rel="noreferrer"><SocialIcon name="github"/>{t('contact.github')}<ArrowUpRight size={18}/></a>
        </section>
        <section id="about" className="section about">
          <div className="about-heading"><h2 data-heading>{t('about.title1')}<br /><span className="accent">{t('about.title2')}</span></h2></div>
          <div className="about-grid"><div className="about-art" data-reveal><div className="art-code" aria-hidden="true"><span>{t('about.art')}</span><span className="art-x">×</span><span>{t('about.code')}</span></div><p className="mono">{t('about.connection')}</p><div className="stat-row"><div><span>{t('about.years')}</span><p className="mono">{t('about.yearsLabel')}</p></div><div><span aria-hidden="true">_</span><p className="mono">{t('about.areasLabel')}</p></div></div></div>
          <div className="about-copy"><h3 className="reading-statement" aria-label={t('about.lead')}><span aria-hidden="true">{t('about.lead').split(' ').map((word, index) => <span className="reading-word" key={`${word}-${index}`}>{word}{' '}</span>)}</span></h3><p>{t('about.paragraph1')}</p><p>{t('about.paragraph2')}</p><div className="about-facts"><div><p className="eyebrow">{t('about.education')}</p><p>{t('about.degree')}</p><span>{t('about.school')}</span></div><div><p className="eyebrow">{t('about.languages')}</p><p>{t('about.languageList')}</p></div></div><a className="text-link" href="/joao-victor-fonseca-portfolio.pdf" download>{t('about.pdf')}<Download size={17}/></a></div></div>
          <div className="skills"><p className="eyebrow">{t('about.stack')}</p>{groups.map(({ title, items: technologies }) => <div className="skill-group" key={title}><h3>{title}</h3><p>{technologies}</p></div>)}</div>
        </section>
        <section id="contact" className="section contact contact-hub" aria-labelledby="contact-heading">
          <div className="contact-hub-heading"><h2 id="contact-heading" data-heading>{t('contact.title')}</h2><span className="availability mono"><i className="status-dot" />{t('hero.availability')}</span></div>
          <div className="contact-cards" aria-label={t('contact.channels')}>
            {(['github', 'gmail', 'whatsapp', 'linkedin'] as const).map((channel) => (
              <a className={'contact-card contact-card-' + channel} key={channel} href={contactLinks[channel]} target={channel === 'gmail' ? undefined : '_blank'} rel={channel === 'gmail' ? undefined : 'noreferrer'}>
                <span className="contact-card-icon"><SocialIcon name={channel} /></span>
                <span className="contact-card-name">{t('contact.' + channel)}</span>
                <span className="contact-card-detail">{t('contact.' + channel + 'Detail')}</span>
                <ArrowUpRight className="contact-card-arrow" size={24} aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="contact-hub-bottom"><button className="copy-email" onClick={copyEmail}>{copyStatus === 'copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{t(copyStatus === 'copied' ? 'contact.copied' : 'contact.copy')}</button><span className="mono">{t('contact.remote')}</span></div>
          <p className="copy-status sr-only" role="status">{copyStatus ? t('contact.' + copyStatus) : ''}</p>
        </section>

      </main>
      <footer className="footer mono"><span>{t('contact.copyright', { year: 2026 })}</span><a href="#home" aria-label={t('contact.top')}><ArrowUp size={18}/></a></footer>
      </div>
    </>
  );
}

export default function Home() {

  return <I18nextProvider i18n={i18n}><Portfolio /></I18nextProvider>;
}
