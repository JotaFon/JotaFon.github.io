'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function usePortfolioMotion({ rootRef, enabled, language }: { rootRef: RefObject<HTMLDivElement | null>; enabled: boolean; language?: string }) {
  useEffect(() => {
    const root = rootRef.current;
    const media = gsap.matchMedia();
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    if (!root || !enabled) {

      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 761px)', pointer: '(hover: hover) and (pointer: fine)' }, ({ conditions }) => {
      const { motion, desktop, pointer } = conditions ?? {};
      const removeListeners: (() => void)[] = [];

      if (!motion) {

        return;
      }

      const context = gsap.context(() => {
        gsap.fromTo('.hero h1 span', { yPercent: 50, scaleX: 1.12, scaleY: .72, rotation: -4, opacity: 0 }, {
          keyframes: [
            { yPercent: -9, scaleX: .96, scaleY: 1.08, rotation: 2, opacity: 1, duration: .42, ease: 'power3.out' },
            { yPercent: 2, scaleX: 1.025, scaleY: .975, rotation: -.7, duration: .2, ease: 'power2.inOut' },
            { yPercent: 0, scaleX: 1, scaleY: 1, rotation: 0, duration: .4, ease: 'elastic.out(1, .5)' },
          ],
          stagger: .12,
          clearProps: 'all',
        });
        gsap.from('.hero-summary, .hero-top', { opacity: 0, y: 18, delay: .5, duration: 1, clearProps: 'all' });
        gsap.to('.reading-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: .2 } });
        gsap.to('.hero-copy', { y: desktop ? -95 : -25, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
        gsap.to('.hero-glow', { yPercent: 30, scale: 1.25, opacity: .1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
        gsap.fromTo('.work', { '--seam': '0%' }, { '--seam': '100%', ease: 'none', scrollTrigger: { trigger: '.work', start: 'top 95%', end: 'top 25%', scrub: .5 } });

        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
          gsap.from(element, { y: 44, scaleX: 1.035, scaleY: .96, rotation: -2, opacity: 0, duration: .95, ease: 'back.out(1.5)', scrollTrigger: { trigger: element, start: 'top 92%', once: true }, clearProps: 'all' });
        });
        gsap.utils.toArray<HTMLElement>('[data-heading]').forEach((element) => {
          gsap.from(element, { y: 35, scaleX: 1.04, scaleY: .85, rotation: -2, opacity: 0, transformOrigin: 'left bottom', duration: 1, ease: 'elastic.out(1, .65)', scrollTrigger: { trigger: element, start: 'top 90%', once: true }, clearProps: 'all' });
        });
        gsap.utils.toArray<HTMLElement>('.experience').forEach((element) => {
          const content = element.querySelector('.experience-content');

          gsap.from(element.querySelectorAll('.experience-company, .experience-date, .experience-plus'), { y: 25, opacity: 0, stagger: .07, duration: .7, ease: 'back.out(1.3)', scrollTrigger: { trigger: element, start: 'top 91%', once: true }, clearProps: 'all' });

          if (content) {
            const observer = new ResizeObserver(() => {
              clearTimeout(refreshTimer);
              refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
            });

            observer.observe(content);
            removeListeners.push(() => observer.disconnect());
          }
        });
        gsap.fromTo('.reading-word', { color: '#a0a0a0' }, { color: '#202020', stagger: .08, ease: 'none', scrollTrigger: { trigger: '.reading-statement', start: 'top 83%', end: 'bottom 48%', scrub: .45 } });
        gsap.fromTo('.art-code > span:first-child', { xPercent: -12 }, { xPercent: 5, ease: 'none', scrollTrigger: { trigger: '.about-grid', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.fromTo('.art-code > span:last-child', { xPercent: 10 }, { xPercent: -4, ease: 'none', scrollTrigger: { trigger: '.about-grid', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.to('.art-x', { rotation: 180, ease: 'none', scrollTrigger: { trigger: '.about-grid', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.from('.skill-group', { y: 30, opacity: 0, stagger: .13, duration: .8, scrollTrigger: { trigger: '.skills', start: 'top 88%', once: true }, clearProps: 'all' });
        gsap.fromTo('.contact', { '--curtain': '12%' }, { '--curtain': '0%', ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top 100%', end: 'top 55%', scrub: .6 } });
        gsap.from('.contact-card', { y: 65, rotation: -5, scaleX: 1.06, scaleY: .88, opacity: 0, stagger: .1, duration: 1, ease: 'elastic.out(1, .65)', scrollTrigger: { trigger: '.contact-cards', start: 'top 92%', once: true }, clearProps: 'all' });

        if (pointer) {
          root.querySelectorAll<HTMLElement>('.contact-card').forEach((element) => {
            const icon = element.querySelector('.contact-card-icon');
            const bounce = gsap.timeline({ paused: true })
              .to(icon, { scaleX: 1.15, scaleY: .86, y: 3, duration: .12, ease: 'power2.in' })
              .to(icon, { scaleX: .94, scaleY: 1.07, y: -12, rotation: -8, duration: .22, ease: 'power2.out' })
              .to(icon, { scaleX: 1, scaleY: 1, y: 0, rotation: 0, duration: .65, ease: 'elastic.out(1, .4)' });
            const onEnter = () => { bounce.restart(); };
            const onLeave = () => { bounce.progress(1).pause(); };

            element.addEventListener('pointerenter', onEnter);
            element.addEventListener('pointerleave', onLeave);
            element.addEventListener('focus', onEnter);
            element.addEventListener('blur', onLeave);
            removeListeners.push(() => {
              element.removeEventListener('pointerenter', onEnter);
              element.removeEventListener('pointerleave', onLeave);
              element.removeEventListener('focus', onEnter);
              element.removeEventListener('blur', onLeave);
            });
          });
          root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((element) => {
            const moveX = gsap.quickTo(element, 'x', { duration: .45, ease: 'power3.out' });
            const moveY = gsap.quickTo(element, 'y', { duration: .45, ease: 'power3.out' });
            const onMove = ({ clientX, clientY }: PointerEvent) => {
              const { left, top, width, height } = element.getBoundingClientRect();

              moveX((clientX - left - width / 2) * .18);
              moveY((clientY - top - height / 2) * .18);
            };
            const onLeave = () => { moveX(0); moveY(0); };

            element.addEventListener('pointermove', onMove);
            element.addEventListener('pointerleave', onLeave);
            removeListeners.push(() => {
              element.removeEventListener('pointermove', onMove);
              element.removeEventListener('pointerleave', onLeave);
            });
          });
        }
      }, root);

      return () => { removeListeners.forEach((remove) => remove()); context.revert(); };
    });

    void document.fonts.ready.then(() => {
      if (!disposed) {
        ScrollTrigger.refresh();
      }
    });

    return () => {
      disposed = true;
      clearTimeout(refreshTimer);
      media.revert();
    };
  }, [rootRef, enabled, language]);
}
