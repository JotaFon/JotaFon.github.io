const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));

      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
};

const initParallax = () => {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");

    if (hero) {
      hero.style.backgroundPositionY = `${scrolled * 0.3}px`;
    }
  }, { passive: true });
};

const initRipple = () => {
  const createRipple = (e, element) => {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    element.appendChild(ripple);

    ripple.style.left = `${e.clientX - e.target.offsetLeft}px`;
    ripple.style.top = `${e.clientY - e.target.offsetTop}px`;

    setTimeout(() => ripple.remove(), 300);
  };

  document.querySelectorAll(".btn, .contact-card").forEach((button) => {
    button.addEventListener("click", (e) => createRipple(e, button));
  });

  const rippleStyles = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.3s linear;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
  addStyles(rippleStyles);
};

const prefersReducedMotion = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealElements = ({
  selector,
  revealClass = "reveal-soft",
  delayStep = 80,
  maxDelay = 420,
  rootMargin = "0px 0px -8% 0px",
  threshold = 0.14,
  groupByParent = true,
}) => {
  const elements = [...document.querySelectorAll(selector)].filter(
    (element) => !element.dataset.revealBound,
  );

  if (!elements.length) return;

  const showReveal = (element) => {
    window.clearTimeout(element.revealTimer);
    element.style.transitionDelay = element.dataset.revealDelay || "0ms";
    element.classList.add("is-visible");

    const delay = Number.parseInt(element.dataset.revealDelay, 10) || 0;
    element.revealTimer = window.setTimeout(() => {
      element.style.transitionDelay = "";
      element.classList.add("has-entered");
    }, 1100 + delay);
  };

  const hideReveal = (element) => {
    window.clearTimeout(element.revealTimer);
    element.style.transitionDelay = "0ms";
    element.classList.remove("is-visible", "has-entered");
  };

  elements.forEach((element, index) => {
    element.dataset.revealBound = "true";
    element.classList.add(revealClass);
    element.removeAttribute("data-aos");
    element.removeAttribute("data-aos-delay");

    const siblings = groupByParent && element.parentElement
      ? [...element.parentElement.querySelectorAll(selector)]
      : elements;
    const staggerIndex = Math.max(0, siblings.indexOf(element));
    const delay = Math.min(staggerIndex * delayStep, maxDelay);

    element.dataset.revealDelay = `${delay}ms`;
    element.style.transitionDelay = `${delay}ms`;
  });

  if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
    elements.forEach(showReveal);

    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showReveal(entry.target);

          return;
        }

        hideReveal(entry.target);
      });
    },
    { rootMargin, threshold },
  );

  elements.forEach((element) => observer.observe(element));
};

const clearAosAttributes = () => {
  document.querySelectorAll("[data-aos]").forEach((element) => {
    element.removeAttribute("data-aos");
    element.removeAttribute("data-aos-delay");
    element.removeAttribute("data-aos-duration");
  });
};

const initSkillsAnimation = () => {
  revealElements({
    selector: ".skill-item",
    revealClass: "reveal-soft",
    delayStep: 55,
    maxDelay: 385,
    threshold: 0.16,
  });
};

const initTimelineAnimation = () => {
  revealElements({
    selector: ".timeline-item",
    revealClass: "reveal-slide",
    delayStep: 120,
    maxDelay: 480,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.12,
  });

  revealElements({
    selector: ".map-node",
    revealClass: "reveal-map",
    delayStep: 130,
    maxDelay: 390,
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.16,
  });

  revealElements({
    selector: ".map-arrow",
    revealClass: "reveal-fade",
    delayStep: 160,
    maxDelay: 320,
    rootMargin: "0px 0px -16% 0px",
    threshold: 0.12,
  });
};

const initCardRevealAnimation = () => {
  clearAosAttributes();

  revealElements({
    selector: ".section-header",
    revealClass: "reveal-soft",
    delayStep: 0,
    maxDelay: 0,
    groupByParent: false,
  });

  revealElements({
    selector: ".about-image",
    revealClass: "reveal-left",
    delayStep: 0,
    maxDelay: 0,
    groupByParent: false,
  });

  revealElements({
    selector: ".about-text p",
    revealClass: "reveal-soft",
    delayStep: 80,
    maxDelay: 320,
  });

  revealElements({
    selector: ".skill-category, .project-card, .language-card, .contact-card",
    revealClass: "reveal-card",
    delayStep: 95,
    maxDelay: 475,
  });

  revealElements({
    selector: ".job-tech .tech-tag",
    revealClass: "reveal-soft",
    delayStep: 55,
    maxDelay: 330,
    rootMargin: "0px 0px -6% 0px",
    threshold: 0.12,
  });
};

const initBackgroundScroll = () => {
  const updateBackground = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
    const theme = document.documentElement.dataset.theme || "dark";
    const themeColors = colorConfig[theme] || colorConfig.dark;

    const { start, end } = themeColors;
    const currentColor = start.map((s, i) =>
      Math.round(s + (end[i] - s) * scrollPercent),
    );

    document.documentElement.style.setProperty(
      "--page-bg-current",
      currentColor.join(","),
    );
  };

  window.addEventListener("scroll", updateBackground, { passive: true });
  window.addEventListener("themechange", updateBackground);
  updateBackground();
};

const initKonamiCode = () => {
  let konamiCode = [];
  const targetCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

  window.addEventListener("keydown", (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > targetCode.length) konamiCode.shift();

    if (konamiCode.join(",") === targetCode.join(",")) {
      document.body.style.animation = "rainbow 2s ease-in-out";
      setTimeout(() => (document.body.style.animation = ""), 2000);
    }
  });

  const rainbowStyles = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            25% { filter: hue-rotate(90deg); }
            50% { filter: hue-rotate(180deg); }
            75% { filter: hue-rotate(270deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
  addStyles(rainbowStyles);
};

const initInteractiveCards = () => {
  if (!window.matchMedia("(pointer: fine)").matches) {

    return;
  }

  const cards = [
    ...document.querySelectorAll(
      ".skill-category, .skill-item, .project-card, .language-card, .contact-card, .hero-highlight",
    ),
  ].filter((card) => !card.dataset.interactiveBound);

  cards.forEach((card) => {
    card.dataset.interactiveBound = "true";
    card.classList.add("interactive-surface");

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -1.4;
      const rotateY = ((x / rect.width) - 0.5) * 1.4;

      card.style.setProperty("--spotlight-x", `${x}px`);
      card.style.setProperty("--spotlight-y", `${y}px`);

      if (card.classList.contains("language-card")) {
        const xProgress = x / rect.width - 0.5;
        const yProgress = y / rect.height - 0.5;
        const shineAngle = 118 + xProgress * 24 - yProgress * 12;
        const shineMoveX = `${xProgress * -34}%`;
        const shineMoveY = `${yProgress * -24}%`;

        card.style.setProperty("--mouse-rotate-x", `${rotateX}deg`);
        card.style.setProperty("--mouse-rotate-y", `${rotateY}deg`);
        card.style.setProperty("--shine-angle", `${shineAngle}deg`);
        card.style.setProperty("--shine-move-x", shineMoveX);
        card.style.setProperty("--shine-move-y", shineMoveY);

        return;
      }

      if (card.classList.contains("skill-category")) {
        card.style.setProperty(
          "--tilt",
          `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        );
      }
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt");
      card.style.removeProperty("--mouse-rotate-x");
      card.style.removeProperty("--mouse-rotate-y");
      card.style.removeProperty("--shine-angle");
      card.style.removeProperty("--shine-move-x");
      card.style.removeProperty("--shine-move-y");
    });
  });
};

const initProjectsCarousel = () => {
  document.querySelectorAll("[data-project-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".projects-grid");
    const originalSlides = [...carousel.querySelectorAll(".project-card")];
    const prevButton = carousel.querySelector("[data-project-prev]");
    const nextButton = carousel.querySelector("[data-project-next]");
    const viewport = carousel.querySelector(".projects-viewport");
    let positionX = 0;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerLastX = 0;
    let pointerLastTime = 0;
    let velocityX = 0;
    let momentumFrame = 0;
    let isDragging = false;
    let isButtonMoving = false;
    let suppressClick = false;

    if (!track || !originalSlides.length || !viewport) {

      return;
    }

    if (carousel.dataset.carouselBound) {

      return;
    }

    carousel.dataset.carouselBound = "true";

    originalSlides.forEach((slide, index) => {
      slide.dataset.projectIndex = String(index);
      slide.setAttribute("aria-hidden", "false");
    });

    const detailRevealElements = [
      ...carousel.querySelectorAll(".project-points li, .project-tags .tech-tag"),
    ];

    detailRevealElements.forEach((element) => {
      element.classList.remove("reveal-soft", "is-visible", "has-entered");
      element.removeAttribute("data-reveal-bound");
      element.removeAttribute("data-reveal-delay");
      element.style.transitionDelay = "";
    });

    const createClone = (slide, index) => {
      const clone = slide.cloneNode(true);

      clone.classList.add("is-clone");
      clone.classList.remove(
        "reveal-card",
        "is-active",
        "is-visible",
        "has-entered",
      );
      clone.removeAttribute("data-interactive-bound");
      clone
        .querySelectorAll(".project-points li, .project-tags .tech-tag")
        .forEach((element) => {
          element.classList.remove("reveal-soft", "is-visible", "has-entered");
          element.removeAttribute("data-reveal-bound");
          element.removeAttribute("data-reveal-delay");
          element.style.transitionDelay = "";
        });
      clone.dataset.projectIndex = String(index);
      clone.setAttribute("aria-hidden", "true");

      return clone;
    };

    const beforeFragment = document.createDocumentFragment();
    const afterFragment = document.createDocumentFragment();

    originalSlides.forEach((slide, index) => {
      beforeFragment.appendChild(createClone(slide, index));
      afterFragment.appendChild(createClone(slide, index));
    });

    track.insertBefore(beforeFragment, originalSlides[0]);
    track.appendChild(afterFragment);

    const slides = [...track.querySelectorAll(".project-card")];
    const middleStartIndex = originalSlides.length;

    const getLoopMetrics = () => {
      const middleStartSlide = slides[middleStartIndex];
      const nextSetStartSlide = slides[middleStartIndex + originalSlides.length];
      const middleOffset = middleStartSlide?.offsetLeft ?? 0;
      const loopWidth = nextSetStartSlide
        ? nextSetStartSlide.offsetLeft - middleOffset
        : track.scrollWidth / 3;

      return { middleOffset, loopWidth };
    };

    const setTrackPosition = (nextPositionX, { animate = false } = {}) => {
      positionX = nextPositionX;
      const renderedPositionX = Math.round(positionX);

      track.style.transition = animate
        ? "transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)"
        : "none";
      track.style.transform = `translateX(${renderedPositionX}px)`;
    };

    const normalizePosition = () => {
      const { middleOffset, loopWidth } = getLoopMetrics();

      if (!loopWidth) {

        return;
      }

      while (positionX <= -(middleOffset + loopWidth)) {
        positionX += loopWidth;
      }

      while (positionX > -middleOffset) {
        positionX -= loopWidth;
      }

      setTrackPosition(positionX);
    };

    const updateNearestSlide = () => {
      const viewportCenter = viewport.clientWidth / 2;
      let activeProjectIndex = originalSlides[0].dataset.projectIndex;
      let closestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide) => {
        const slideCenter = slide.offsetLeft + positionX + slide.offsetWidth / 2;
        const distance = Math.abs(viewportCenter - slideCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          activeProjectIndex = slide.dataset.projectIndex;
        }
      });

      slides.forEach((slide) => {
        slide.classList.toggle(
          "is-active",
          slide.dataset.projectIndex === activeProjectIndex,
        );
      });
    };

    const stopMomentum = () => {
      if (!momentumFrame) {

        return;
      }

      window.cancelAnimationFrame(momentumFrame);
      momentumFrame = 0;
    };

    const startMomentum = () => {
      stopMomentum();

      const runMomentum = () => {
        velocityX *= 0.94;

        if (Math.abs(velocityX) < 0.04) {
          momentumFrame = 0;

          return;
        }

        setTrackPosition(positionX + velocityX * 16);
        normalizePosition();
        updateNearestSlide();
        momentumFrame = window.requestAnimationFrame(runMomentum);
      };

      if (Math.abs(velocityX) < 0.04) {

        return;
      }

      momentumFrame = window.requestAnimationFrame(runMomentum);
    };

    const moveTrack = (direction) => {
      if (isButtonMoving) {

        return;
      }

      const { loopWidth } = getLoopMetrics();
      const step = loopWidth / originalSlides.length;

      if (!step) {

        return;
      }

      isButtonMoving = true;
      stopMomentum();
      setTrackPosition(positionX - direction * step, { animate: true });
    };

    prevButton?.addEventListener("click", () => {
      moveTrack(-1);
    });

    nextButton?.addEventListener("click", () => {
      moveTrack(1);
    });

    track.addEventListener("transitionend", (event) => {
      if (event.target !== track) {

        return;
      }

      if (event.propertyName !== "transform") {

        return;
      }

      normalizePosition();
      updateNearestSlide();
      isButtonMoving = false;
    });

    viewport.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) {

        return;
      }

      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      pointerLastX = event.clientX;
      pointerLastTime = event.timeStamp;
      velocityX = 0;
      isDragging = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add("is-dragging");
      stopMomentum();
    });

    viewport.addEventListener("pointermove", (event) => {
      if (!isDragging) {

        return;
      }

      const deltaX = event.clientX - pointerStartX;
      const deltaY = event.clientY - pointerStartY;
      const moveX = event.clientX - pointerLastX;
      const elapsed = event.timeStamp - pointerLastTime;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        event.preventDefault();
      }

      if (elapsed > 0) {
        velocityX = moveX / elapsed;
      }

      pointerLastX = event.clientX;
      pointerLastTime = event.timeStamp;
      setTrackPosition(positionX + moveX);
      normalizePosition();
      updateNearestSlide();
    });

    const stopDragging = (event) => {
      if (!isDragging) {

        return;
      }

      const deltaX = event.clientX - pointerStartX;

      isDragging = false;
      suppressClick = Math.abs(deltaX) > 6;
      viewport.classList.remove("is-dragging");

      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }

      if (suppressClick) {
        window.setTimeout(() => {
          suppressClick = false;
        });
      }

      startMomentum();
    };

    viewport.addEventListener("pointerup", stopDragging);
    viewport.addEventListener("pointercancel", (event) => {
      isDragging = false;
      viewport.classList.remove("is-dragging");

      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
    });

    track.addEventListener("click", (event) => {
      if (!suppressClick) {

        return;
      }

      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }, true);

    window.addEventListener("resize", () => {
      const { middleOffset } = getLoopMetrics();

      setTrackPosition(-middleOffset);
      updateNearestSlide();
    });

    const { middleOffset } = getLoopMetrics();

    setTrackPosition(-middleOffset);
    normalizePosition();
    updateNearestSlide();
    initInteractiveCards();
  });
};

const initThemeToggle = () => {
  const toggleButtons = document.querySelectorAll(".theme-toggle");
  if (!toggleButtons.length) return;

  const storedTheme = localStorage.getItem("theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const initialTheme = storedTheme || (prefersLight ? "light" : "dark");

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new CustomEvent("themechange"));

    toggleButtons.forEach((button) => {
      const isLight = theme === "light";
      const icon = button.querySelector(".theme-toggle-icon");

      button.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme",
      );

      if (icon) {
        icon.classList.toggle("fa-sun", isLight);
        icon.classList.toggle("fa-moon", !isLight);
      }
    });
  };

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const currentTheme = document.documentElement.dataset.theme || "dark";
      applyTheme(currentTheme === "light" ? "dark" : "light");
    });
  });

  applyTheme(initialTheme);
};

const initMobileSidebar = () => {
  const navbar = document.getElementById("navbar");
  const toggleButton = navbar?.querySelector(".mobile-menu-toggle");
  const backdrop = navbar?.querySelector(".mobile-nav-backdrop");
  const menuIcon = navbar?.querySelector(".mobile-menu-icon");
  const mobileQuery = window.matchMedia("(max-width: 768px)");
  const labels = {
    en: {
      close: "Close navigation menu",
      open: "Open navigation menu",
    },
    pt: {
      close: "Fechar menu de navegação",
      open: "Abrir menu de navegação",
    },
    de: {
      close: "Navigationsmenü schließen",
      open: "Navigationsmenü öffnen",
    },
  };

  if (!navbar || !toggleButton || !backdrop || !menuIcon) return;

  const getLabels = () => {
    const lang = localStorage.getItem("language") || "en";

    return labels[lang] || labels.en;
  };

  const setOpen = (isOpen) => {
    const { close, open } = getLabels();

    navbar.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("mobile-nav-open", isOpen);
    toggleButton.setAttribute("aria-expanded", String(isOpen));
    toggleButton.setAttribute("aria-label", isOpen ? close : open);
    menuIcon.classList.toggle("fa-bars", !isOpen);
    menuIcon.classList.toggle("fa-xmark", isOpen);
  };

  toggleButton.addEventListener("click", () => {
    setOpen(!navbar.classList.contains("is-open"));
  });

  backdrop.addEventListener("click", () => setOpen(false));

  navbar.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  navbar.querySelectorAll(".lang-btn").forEach((button) => {
    button.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  mobileQuery.addEventListener("change", ({ matches }) => {
    if (!matches) {
      setOpen(false);
    }
  });

  setOpen(false);
};

const addStyles = (styles) => {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
};
