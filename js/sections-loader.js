const SectionsLoader = {
  sections: [
    "navbar",
    "hero",
    "about",
    "skills",
    "projects",
    "experience",
    "languages",
    "contact",
  ],

  cache: {},

  async loadSection(name) {
    if (this.cache[name]) {

      return this.cache[name];
    }

    try {
      const response = await fetch(`sections/${name}.html`, {
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`Failed to load section: ${name}`);
      }

      const html = await response.text();

      this.cache[name] = html;

      return html;
    } catch (error) {
      console.error(`Error loading section ${name}:`, error);

      return "";
    }
  },

  async loadAll(containerId = "app") {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`Container #${containerId} not found`);

      return;
    }

    const sectionsHtml = await Promise.all(
      this.sections.map((name) => this.loadSection(name)),
    );

    container.innerHTML = sectionsHtml.join("\n");

    document.dispatchEvent(new CustomEvent("sectionsLoaded"));
  },

  init(containerId = "app") {
    if (window.location.protocol === "file:") {
      console.warn(
        "Sections loader requires a web server. Using static HTML instead.",
      );

      return;
    }

    this.loadAll(containerId);
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = SectionsLoader;
}
