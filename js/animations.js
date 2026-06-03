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
  });
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

const initSkillsAnimation = () => {
  const skillItems = document.querySelectorAll(".skill-item");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.transform = "translateY(0)";
          entry.target.style.opacity = "1";
        }, index * 50);
      }
    });
  });

  skillItems.forEach((item) => {
    Object.assign(item.style, {
      transform: "translateY(20px)",
      opacity: "0",
      transition: "all 0.6s ease",
    });
    observer.observe(item);
  });
};

const initTimelineAnimation = () => {
  const timelineItems = document.querySelectorAll(".timeline-item");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          Object.assign(entry.target.style, {
            opacity: "1",
            transform: "translateX(0)",
          });
        }, index * 200);
      }
    });
  });

  timelineItems.forEach((item) => {
    Object.assign(item.style, {
      opacity: "0",
      transform: "translateX(-50px)",
      transition: "all 0.8s ease",
    });
    observer.observe(item);
  });
};

const initBackgroundScroll = () => {
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    const { start, end } = colorConfig;
    const currentColor = start.map((s, i) =>
      Math.round(s + (end[i] - s) * scrollPercent),
    );

    document.body.style.background = `rgb(${currentColor.join(",")})`;
  });
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

const initContactCards = () => {
  document.querySelectorAll(".contact-card").forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
    card.classList.add("floating");
  });
};

const addStyles = (styles) => {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
};
