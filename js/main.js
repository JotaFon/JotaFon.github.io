/* ========================================
   Main Entry Point
   ======================================== */

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
});

// Loading Screen
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loading").classList.add("fade-out");
  }, 4000);
});

// Navbar Scroll Effect
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  navbar.classList.toggle("scrolled", window.pageYOffset > 50);
});

// Initialize Particles
particlesJS("particles-js", particlesConfig);

// Initialize all modules
document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  initSmoothScroll();
  initParallax();
  initRipple();
  initSkillsAnimation();
  initTimelineAnimation();
  initBackgroundScroll();
  initKonamiCode();
  initContactCards();
});

// Performance Observer
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
