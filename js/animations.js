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
    revealClass: "reveal-right",
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
    selector:
      ".project-points li, .project-tags .tech-tag, .job-tech .tech-tag",
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

    document.body.style.background = `rgb(${currentColor.join(",")})`;
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
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const cards = document.querySelectorAll(
    ".skill-category, .skill-item, .project-card, .language-card, .contact-card, .hero-highlight",
  );

  cards.forEach((card) => {
    card.classList.add("interactive-surface");

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -4;
      const rotateY = ((x / rect.width) - 0.5) * 4;

      card.style.setProperty("--spotlight-x", `${x}px`);
      card.style.setProperty("--spotlight-y", `${y}px`);

      if (
        card.classList.contains("project-card") ||
        card.classList.contains("skill-category") ||
        card.classList.contains("language-card")
      ) {
        card.style.setProperty(
          "--tilt",
          `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        );
      }
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt");
    });
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

const addStyles = (styles) => {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
};
