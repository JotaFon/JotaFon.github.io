'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

type PageLoaderProps = {
  sceneSettled: boolean;
  contentRef: RefObject<HTMLDivElement | null>;
  onComplete: () => void;
};

function BlinkingCharacter({ onReady }: { onReady: () => void }) {
  const [isClosed, setIsClosed] = useState(false);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;

    const handleAssetReady = () => {
      loadedCount++;

      if (loadedCount === 2 && isMounted) {
        onReadyRef.current();
      }
    };

    const img1 = new Image();
    const img2 = new Image();

    img1.onload = handleAssetReady;
    img1.onerror = handleAssetReady;
    img2.onload = handleAssetReady;
    img2.onerror = handleAssetReady;

    img1.src = '/icon1.png';
    img2.src = '/icon2.png';

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pattern = [
      { closed: false, duration: 1000 },
      { closed: true,  duration: 200 },
      { closed: false, duration: 500 },
      { closed: true,  duration: 100 },
      { closed: false, duration: 2500 },
      { closed: true,  duration: 150 },
    ];
    let step = 0;
    let timeoutId: NodeJS.Timeout;
    const runPattern = () => {
      if (!isMounted || reduced.matches) {

        return;
      }

      const current = pattern[step];

      setIsClosed(current.closed);
      step = (step + 1) % pattern.length;
      timeoutId = setTimeout(runPattern, current.duration);
    };
    const onPreferenceChange = () => {
      clearTimeout(timeoutId);
      setIsClosed(false);
      runPattern();
    };

    runPattern();
    reduced.addEventListener('change', onPreferenceChange);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      reduced.removeEventListener('change', onPreferenceChange);
    };
  }, []);

  return (
    <div className="character-icon-container">
      <img
        src={isClosed ? '/icon2.png' : '/icon1.png'}
        alt=""
        className="character-icon"
      />
    </div>
  );
}

export function PageLoader({ sceneSettled, contentRef, onComplete }: PageLoaderProps) {
  const { t } = useTranslation('portfolio');
  const overlayRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [solidReady, setSolidReady] = useState(false);
  const onSolidReady = useCallback(() => setSolidReady(true), []);
  const progressRef = useRef({ value: 0 });
  const [documentReady, setDocumentReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const skippedRef = useRef(false);
  const complete = (minimumElapsed && documentReady && fontsReady && sceneSettled) || timedOut;
  const target = complete ? 100 : 10 + (documentReady ? 20 : 0) + (fontsReady ? 25 : 0) + (sceneSettled ? 35 : 0);

  useEffect(() => {
    const content = contentRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousInert = content?.inert ?? false;
    const onLoad = () => setDocumentReady(true);
    const deadlineTimer = setTimeout(() => setTimedOut(true), 10000);
    const skipTimer = setTimeout(() => setCanSkip(true), 1500);
    let cancelled = false;

    document.body.style.overflow = 'hidden';

    if (content) {
      content.inert = true;
    }

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }

    void document.fonts.ready.then(() => {
      if (!cancelled) {
        setFontsReady(true);
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(deadlineTimer);
      clearTimeout(skipTimer);
      window.removeEventListener('load', onLoad);
      document.body.style.overflow = previousOverflow;

      if (content) {
        content.inert = previousInert;
      }

      if (skippedRef.current) {
        content?.querySelector<HTMLElement>('#main')?.focus({ preventScroll: true });
      }
    };
  }, [contentRef]);

  useEffect(() => {
    if (!solidReady) {

      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minimumTimer = setTimeout(() => setMinimumElapsed(true), reduced ? 0 : 900);

    return () => clearTimeout(minimumTimer);
  }, [solidReady]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const progress = progressRef.current;
    const sequence = gsap.timeline();

    sequence.to(progress, {
      value: target,
      duration: reduced ? .05 : .45,
      ease: 'power2.out',
      onUpdate: () => {
        const currentVal = Math.round(progress.value);

        if (fillRef.current) {
          gsap.set(fillRef.current, { scaleX: progress.value / 100 });
        }

        if (trackRef.current) {
          trackRef.current.setAttribute('aria-valuenow', currentVal.toString());
          trackRef.current.setAttribute('aria-valuetext', t('loader.progress', { count: currentVal }));
        }
      },
    });

    if (complete) {
      sequence.to('.loader-center', { opacity: 0, y: reduced ? 0 : -12, duration: reduced ? .05 : .3 }, '+=.12');
      sequence.to(overlayRef.current, { opacity: 0, duration: reduced ? .05 : .55, ease: 'power2.inOut', onComplete });
    }

    return () => { sequence.kill(); };
  }, [target, complete, onComplete, t]);

  function skipLoading() {
    skippedRef.current = true;
    onComplete();
  }

  return (
    <div className="page-loader" ref={overlayRef}>
      <div className="loader-center">
        <BlinkingCharacter onReady={onSolidReady} />
        <div
          className="loader-track"
          ref={trackRef}
          role="progressbar"
          aria-label={t('loader.label')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          aria-valuetext={t('loader.progress', { count: 0 })}
        >
          <div className="loader-fill" ref={fillRef}/>
        </div>
        {canSkip && !complete && <button type="button" className="loader-skip" onClick={skipLoading}>{t('loader.skip')}</button>}
      </div>
    </div>
  );
}
