'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function usePortfolioMotion({ rootRef }: { rootRef: RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const root = rootRef.current;
    const media = gsap.matchMedia();
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    if (!root) {

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
        gsap.from('.hero h1 span', { yPercent: 105, rotation: 4, opacity: 0, duration: 1.3, stagger: .13, ease: 'power4.out', clearProps: 'all' });
        gsap.from('.hero-summary, .hero-top', { opacity: 0, y: 18, delay: .5, duration: 1, clearProps: 'all' });
        gsap.to('.reading-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: .2 } });
        gsap.to('.hero-copy', { y: desktop ? -95 : -25, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
        gsap.to('.hero-glow', { yPercent: 30, scale: 1.25, opacity: .1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
        gsap.fromTo('.work', { '--seam': '0%' }, { '--seam': '100%', ease: 'none', scrollTrigger: { trigger: '.work', start: 'top 95%', end: 'top 25%', scrub: .5 } });

        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
          gsap.from(element, { y: 44, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true }, clearProps: 'all' });
        });
        gsap.utils.toArray<HTMLElement>('[data-heading]').forEach((element) => {
          gsap.from(element, { clipPath: 'inset(0 0 100% 0)', y: 35, duration: 1.15, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%', once: true }, clearProps: 'all' });
        });
        gsap.utils.toArray<HTMLElement>('.experience').forEach((element) => {
          const content = element.querySelector('.experience-content');

          gsap.from(element.querySelectorAll('.experience-index, .experience-company, .experience-date, .experience-plus'), { y: 25, opacity: 0, stagger: .07, duration: .7, scrollTrigger: { trigger: element, start: 'top 91%', once: true }, clearProps: 'all' });

          if (content) {
            const observer = new ResizeObserver(() => {
              clearTimeout(refreshTimer);
              refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
            });

            observer.observe(content);
            removeListeners.push(() => observer.disconnect());
          }
        });
        gsap.fromTo('.reading-word', { color: '#69746f' }, { color: '#f1f2ed', stagger: .08, ease: 'none', scrollTrigger: { trigger: '.reading-statement', start: 'top 83%', end: 'bottom 48%', scrub: .45 } });
        gsap.fromTo('.art-code > span:first-child', { xPercent: -12 }, { xPercent: 5, ease: 'none', scrollTrigger: { trigger: '.about-grid', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.fromTo('.art-code > span:last-child', { xPercent: 10 }, { xPercent: -4, ease: 'none', scrollTrigger: { trigger: '.about-grid', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.to('.art-x', { rotation: 180, ease: 'none', scrollTrigger: { trigger: '.about-grid', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.from('.skill-group', { y: 30, opacity: 0, stagger: .13, duration: .8, scrollTrigger: { trigger: '.skills', start: 'top 88%', once: true }, clearProps: 'all' });
        gsap.fromTo('.contact', { '--curtain': '12%' }, { '--curtain': '0%', ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top 100%', end: 'top 55%', scrub: .6 } });
        gsap.from('.contact-title-line', { yPercent: 105, rotation: 3, stagger: .13, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.contact h2', start: 'top 90%', once: true }, clearProps: 'all' });
        gsap.from('.email-row', { y: 35, opacity: 0, duration: .9, scrollTrigger: { trigger: '.email-row', start: 'top 94%', once: true }, clearProps: 'all' });

        if (pointer) {
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
  }, [rootRef]);
}
