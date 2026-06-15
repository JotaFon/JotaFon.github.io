const categoryIconAssets = {
  frontend: "assets/Front-end.svg",
  backend: "assets/Back-end.svg",
  mobile: "assets/Mobile.svg",
  database: "assets/Database.svg",
  tools: "assets/Config.svg",
};

function initIcons() {
  document.querySelectorAll("[data-icon]").forEach((element) => {
    const iconName = element.getAttribute("data-icon");
    const assetPath = categoryIconAssets[iconName];

    if (assetPath) {
      element.innerHTML = `<img src="${assetPath}" alt="" class="category-svg" />`;

      return;
    }

    if (typeof Icons !== "undefined" && Icons[iconName]) {
      element.innerHTML = Icons[iconName];
    }
  });
}

const isDynamicLoading =
  typeof SectionsLoader !== "undefined" && window.location.protocol !== "file:";

if (!isDynamicLoading) {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 720,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }

  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");

    if (navbar) {
      navbar.classList.toggle("scrolled", window.pageYOffset > 50);
    }
  });

  if (
    document.getElementById("particles-js") &&
    typeof particlesJS !== "undefined" &&
    typeof particlesConfig !== "undefined"
  ) {
    particlesJS("particles-js", particlesConfig);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initIcons();
    if (typeof initLanguage === "function") initLanguage();
    if (typeof initSmoothScroll === "function") initSmoothScroll();
    if (typeof initParallax === "function") initParallax();
    if (typeof initRipple === "function") initRipple();
    if (typeof initCardRevealAnimation === "function")
      initCardRevealAnimation();
    if (typeof initSkillsAnimation === "function") initSkillsAnimation();
    if (typeof initTimelineAnimation === "function") initTimelineAnimation();
    if (typeof initBackgroundScroll === "function") initBackgroundScroll();
    if (typeof initKonamiCode === "function") initKonamiCode();
    if (typeof initInteractiveCards === "function") initInteractiveCards();
    if (typeof initProjectsCarousel === "function") initProjectsCarousel();
    if (typeof initThemeToggle === "function") initThemeToggle();
    if (typeof initMobileSidebar === "function") initMobileSidebar();
  });
}

if (typeof PerformanceObserver !== "undefined") {
  const performanceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach(({ entryType, name, duration }) => {
      if (entryType === "measure") {
        console.log(`${name}: ${duration}ms`);
      }
    });
  });

  performanceObserver.observe({ entryTypes: ["measure"] });

  window.addEventListener("load", () => {
    performance.mark("page-load-complete");
    performance.measure(
      "page-load-time",
      "navigationStart",
      "page-load-complete",
    );
  });
}
