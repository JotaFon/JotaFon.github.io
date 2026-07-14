const translations = {
  pt: {
    "nav.home": "Início",
    "nav.about": "Sobre",
    "nav.skills": "Skills",
    "nav.projects": "Projetos",
    "nav.experience": "Experiência",
    "nav.contact": "Contato",
    "hero.badge": "Disponível para oportunidades",
    "hero.location": "Londrina - PR, Brasil",
    "hero.role":
      "Desenvolvedor Web",
    "hero.highlight1.value": "2+ anos",
    "hero.highlight1.label": "de experiência profissional",
    "hero.highlight2.value": "Full Stack",
    "hero.highlight2.label": "TypeScript, AdonisJS, Flutter",
    "hero.highlight3.value": "Londrina, BR",
    "hero.highlight3.label": "aberto a vagas remotas",
    "hero.cta": "Entrar em contato",
    "hero.github": "Ver GitHub",
    "about.title": "Sobre Mim",
    "about.text1":
      'Sou <span class="highlight">Desenvolvedor Full Stack</span> e atuo em front-end, back-end e mobile, transformando necessidades operacionais em produtos digitais claros e fáceis de manter.',
    "about.text2":
      "Minha stack atual inclui <strong>TypeScript, AdonisJS, PostgreSQL, React, Redux, Vite, React Native e Flutter</strong>.",
    "about.text3":
      "Antes da programação, trabalhei com pintura digital, uma base criativa que ainda influencia como penso em clareza de interface e detalhes visuais.",
    "about.text4":
      "Meus primeiros passos no desenvolvimento foram na X-Brain, onde atuei como estagiário e depois como desenvolvedor front-end junior no sistema de vendas da Claro. Hoje construo recursos web e mobile para uma aplicação de gerenciamento de frotas.",
    "about.text5":
      "Sou formado em <strong>Análise e Desenvolvimento de Sistemas</strong> pela Universidade Positivo em Londrina - PR, Brasil, com base em lógica, desenvolvimento web, bancos de dados e projetos de software.",
    "skills.title": "Competências Técnicas",
    "skills.frontend": "Front-end",
    "skills.backend": "Back-end",
    "skills.mobile": "Mobile",
    "projects.title": "Projetos",
    "projects.description": "Alguns dos projetos que desenvolvi recentemente",
    "projects.viewSite": "Ver Site",
    "projects.viewBlocked": "Site Interno",
    "projects.viewDemo": "Ver Demo",
    "projects.viewCase": "Estudo de Caso",
    "projects.viewDocs": "Documentação",
    "projects.netsphere.type": "Plataforma de Observabilidade",
    "projects.netsphere.description":
      "Plataforma B2B de observabilidade para telemetria de APIs e rede, em formato de produção: ingestão assíncrona, workers com fila e agregados no TimescaleDB por trás de um dashboard ao vivo e multi-tenant.",
    "projects.netsphere.point1":
      "O caminho quente de ingestão nunca toca o banco — a API valida e enfileira; os workers deduplicam e persistem em lote.",
    "projects.netsphere.point2":
      "Os dashboards leem apenas agregados contínuos, com percentis estatisticamente corretos via rollup de sketches do TimescaleDB.",
    "projects.helpus.type": "Aplicação Web",
    "projects.helpus.description":
      "Aplicação web para gerenciamento de ajuda comunitária, com fluxos colaborativos e interface acessível.",
    "projects.helpus.point1":
      "Estrutura reutilizável para iniciativas comunitárias e fluxos de equipes internas.",
    "projects.helpus.point2":
      "Interface pensada para equipes internas e clareza operacional.",
    "projects.cargadocs.type": "Biblioteca Interna de Docs",
    "projects.cargadocs.description":
      "Site interno para uma biblioteca de documentação do sistema, criado para manter referências técnicas fáceis de navegar e manter.",
    "projects.cargadocs.point1":
      "Experiência centralizada de documentação para times de produto e desenvolvimento.",
    "projects.cargadocs.point2":
      "Suporte desktop local-first com uma API leve e armazenamento embarcado.",
    "projects.previsios.type": "Landing Page",
    "projects.previsios.description":
      "Landing page responsiva para um produto de previsão do tempo, criada para apresentar o app com clareza e manter a experiência rápida no mobile.",
    "projects.previsios.point1":
      "Construída com Next.js e Tailwind para entrega responsiva.",
    "projects.previsios.point2":
      "Movimento e layout usados para apoiar a narrativa do produto.",
    "projects.carousel.previous": "Projeto anterior",
    "projects.carousel.next": "Próximo projeto",
    "languages.text": "Escolha um idioma",
    "languages.title": "Idiomas",
    "languages.portuguese": "Português",
    "languages.english": "Inglês",
    "languages.german": "Alemão",
    "languages.native": "Nativo",
    "languages.intermediate": "B2",
    "languages.learning": "Nível A2",
    "experience.title": "Jornada Profissional",
    "experience.job1.title": "Desenvolvedor Full Stack",
    "experience.job1.location": "Londrina - PR, Brasil",
    "experience.job1.duration": "Março 2026 - Presente",
    "experience.job1.point1":
      "Desenvolvimento front-end, back-end e mobile de uma aplicação para gerenciamento de frotas, caminhões e caminhoneiros.",
    "experience.job1.point2":
      "Atuação com TypeScript, AdonisJS, PostgreSQL, React, Redux, Vite e React Native em fluxos web e mobile.",
    "experience.xbrain.title": "Desenvolvedor Front-end",
    "experience.xbrain.duration": "Agosto 2024 - Fevereiro 2026",
    "experience.job2.title": "Desenvolvedor Front-end Junior",
    "experience.job2.location": "Londrina - PR, Brasil",
    "experience.job2.duration": "Abril 2025 - Fevereiro 2026",
    "experience.job2.point1":
      "Primeiro cargo profissional na área de desenvolvimento, atuando no front-end do sistema de vendas da Claro com React, JavaScript e Redux.",
    "experience.job2.point2":
      "Colaboração com o time para transformar regras de negócio e requisitos em interfaces responsivas e consistentes.",
    "experience.job3.title": "Estagiário de Desenvolvimento Web",
    "experience.job3.location": "Londrina - PR, Brasil",
    "experience.job3.duration": "Agosto 2024 - Março 2025",
    "experience.job3.point1":
      "Início na área de desenvolvimento como estagiário, apoiando o front-end do sistema de vendas da Claro com React, JavaScript e Redux.",
    "experience.job3.point2":
      "Participação em rotinas reais de projeto, revisão de código e entregas iterativas com o time de desenvolvimento.",
    "experience.job4.title": "An&aacute;lise e Desenvolvimento de Sistemas",
    "experience.job4.location": "Londrina - PR, Brasil",
    "experience.job4.duration": "Junho 2022 - Dezembro 2025",
    "experience.job4.point1":
      "Foi onde comecei meus primeiros passos na tecnologia, construindo a base de lógica de programação, desenvolvimento web, bancos de dados e projetos de software.",
    "experience.job4.point2":
      "O curso me ajudou a conectar aprendizado técnico com resolução prática de problemas e confirmou o caminho que eu queria seguir na área de desenvolvimento.",
    "contact.title": "Vamos Conversar?",
    "contact.linkedin": "Vamos nos conectar!",
    "contact.github": "Confira meus projetos",
    "contact.phone": "Telefone",
    "contact.downloadPt": "PDF em português",
    "contact.downloadEn": "PDF em inglês",
  },
  de: {
    "nav.home": "Start",
    "nav.about": "Über mich",
    "nav.skills": "Fähigkeiten",
    "nav.projects": "Projekte",
    "nav.experience": "Erfahrung",
    "nav.contact": "Kontakt",
    "hero.badge": "Offen für neue Möglichkeiten",
    "hero.location": "Londrina - PR, Brasilien",
    "hero.role":
      "Webentwickler",
    "hero.highlight1.value": "2+ Jahre",
    "hero.highlight1.label": "Berufserfahrung",
    "hero.highlight2.value": "Full Stack",
    "hero.highlight2.label": "TypeScript, AdonisJS, Flutter",
    "hero.highlight3.value": "Londrina, BR",
    "hero.highlight3.label": "offen für Remote-Rollen",
    "hero.cta": "Kontakt aufnehmen",
    "hero.github": "GitHub ansehen",
    "about.title": "Über mich",
    "about.text1":
      'Ich bin <span class="highlight">Full Stack Entwickler</span> und arbeite in Front-end, Back-end und Mobile, um operative Anforderungen in klare und wartbare digitale Produkte umzusetzen.',
    "about.text2":
      "Mein aktueller Stack umfasst <strong>TypeScript, AdonisJS, PostgreSQL, React, Redux, Vite, React Native und Flutter</strong>.",
    "about.text3":
      "Vor der Programmierung habe ich mit digitaler Malerei gearbeitet, ein kreativer Hintergrund, der weiterhin beeinflusst, wie ich über Interface-Klarheit und visuelle Details denke.",
    "about.text4":
      "Meine ersten Schritte in der Entwicklung waren bei X-Brain, wo ich als Praktikant und später als Junior Front-end Entwickler am Vertriebssystem von Claro gearbeitet habe. Heute entwickle ich Web- und Mobile-Funktionen für eine Anwendung zur Flottenverwaltung.",
    "about.text5":
      "Ich habe einen Abschluss in <strong>Systemanalyse und -entwicklung</strong> an der Positivo Universität in Londrina - PR, Brasilien, mit Grundlagen in Logik, Webentwicklung, Datenbanken und Softwareprojekten.",
    "skills.title": "Technische Fähigkeiten",
    "skills.frontend": "Front-end",
    "skills.backend": "Back-end",
    "skills.mobile": "Mobile",
    "projects.title": "Projekte",
    "projects.description":
      "Einige der Projekte, die ich kürzlich entwickelt habe",
    "projects.viewSite": "Seite ansehen",
    "projects.viewBlocked": "Interne Seite",
    "projects.viewDemo": "Live-Demo",
    "projects.viewCase": "Fallstudie",
    "projects.viewDocs": "Dokumentation",
    "projects.netsphere.type": "Observability-Plattform",
    "projects.netsphere.description":
      "Eine produktionsnahe B2B-Observability-Plattform für API- und Netzwerk-Telemetrie: asynchrone Ingestion, warteschlangenbasierte Worker und TimescaleDB-Aggregate hinter einem Live-Dashboard mit Mandantenfähigkeit.",
    "projects.netsphere.point1":
      "Der heiße Ingestion-Pfad berührt nie die Datenbank — die API validiert und reiht ein; Worker deduplizieren und persistieren im Batch.",
    "projects.netsphere.point2":
      "Dashboards lesen nur kontinuierliche Aggregate, mit statistisch korrekten Perzentilen durch TimescaleDB-Sketch-Rollups.",
    "projects.helpus.type": "Webanwendung",
    "projects.helpus.description":
      "Webanwendung für gemeinschaftliches Hilfsmanagement mit kollaborativen Abläufen und zugänglicher Oberfläche.",
    "projects.helpus.point1":
      "Wiederverwendbare Struktur für Gemeinschaftsinitiativen und interne Teamabläufe.",
    "projects.helpus.point2":
      "Oberfläche für interne Teams und operative Klarheit geplant.",
    "projects.cargadocs.type": "Interne Docs-Bibliothek",
    "projects.cargadocs.description":
      "Interne Website für eine Systemdokumentationsbibliothek, entwickelt, um technische Referenzen leicht durchsuchbar und wartbar zu halten.",
    "projects.cargadocs.point1":
      "Zentralisierte Dokumentationserfahrung für Produkt- und Entwicklungsteams.",
    "projects.cargadocs.point2":
      "Local-first Desktop-Unterstützung mit leichter API und eingebettetem Speicher.",
    "projects.previsios.type": "Landing Page",
    "projects.previsios.description":
      "Responsive Landing Page für ein Wettervorhersageprodukt, entwickelt, um die App klar zu präsentieren und mobil schnell zu bleiben.",
    "projects.previsios.point1":
      "Mit Next.js und Tailwind für responsive Auslieferung umgesetzt.",
    "projects.previsios.point2":
      "Bewegung und Layout unterstützen die Produktgeschichte.",
    "projects.carousel.previous": "Vorheriges Projekt",
    "projects.carousel.next": "Nächstes Projekt",
    "languages.text": "Sprache wählen",
    "languages.title": "Sprachen",
    "languages.portuguese": "Portugiesisch",
    "languages.english": "Englisch",
    "languages.german": "Deutsch",
    "languages.native": "Muttersprache",
    "languages.intermediate": "B2",
    "languages.learning": "Niveau A2",
    "experience.title": "Beruflicher Werdegang",
    "experience.job1.title": "Full Stack Entwickler",
    "experience.job1.location": "Londrina - PR, Brasilien",
    "experience.job1.duration": "März 2026 - Heute",
    "experience.job1.point1":
      "Entwicklung von Front-end-, Back-end- und Mobile-Funktionen für eine Anwendung zur Verwaltung von Flotten, Lkw und Fahrern.",
    "experience.job1.point2":
      "Arbeit mit TypeScript, AdonisJS, PostgreSQL, React, Redux, Vite und React Native in Web- und Mobile-Flows.",
    "experience.xbrain.title": "Front-end Entwickler",
    "experience.xbrain.duration": "August 2024 - Februar 2026",
    "experience.job2.title": "Junior Front-end Entwickler",
    "experience.job2.location": "Londrina - PR, Brasilien",
    "experience.job2.duration": "April 2025 - Februar 2026",
    "experience.job2.point1":
      "Erste berufliche Rolle in der Entwicklung, mit Arbeit am Front-end des Claro-Vertriebssystems mit React, JavaScript und Redux.",
    "experience.job2.point2":
      "Zusammenarbeit mit dem Team, um Geschäftsregeln und Anforderungen in responsive, konsistente Interfaces umzusetzen.",
    "experience.job3.title": "Webentwicklung Praktikant",
    "experience.job3.location": "Londrina - PR, Brasilien",
    "experience.job3.duration": "August 2024 - März 2025",
    "experience.job3.point1":
      "Einstieg in die Entwicklung als Praktikant, mit Unterstützung am Front-end des Claro-Vertriebssystems mit React, JavaScript und Redux.",
    "experience.job3.point2":
      "Teilnahme an realen Projektroutinen, Code Reviews und iterativer Lieferung mit dem Entwicklungsteam.",
    "experience.job4.title": "Systemanalyse und -entwicklung",
    "experience.job4.location": "Londrina - PR, Brasilien",
    "experience.job4.duration": "Juni 2022 - Dezember 2025",
    "experience.job4.point1":
      "Dort habe ich meine ersten Schritte in der Technologie gemacht und Grundlagen in Programmierlogik, Webentwicklung, Datenbanken und Softwareprojekten aufgebaut.",
    "experience.job4.point2":
      "Der Kurs half mir, technisches Lernen mit praktischer Problemlösung zu verbinden, und bestätigte den Weg, den ich in der Entwicklung verfolgen wollte.",
    "contact.title": "Lass uns sprechen?",
    "contact.linkedin": "Lass uns vernetzen!",
    "contact.github": "Schau dir meine Projekte an",
    "contact.phone": "Telefon",
    "contact.downloadPt": "PDF auf Portugiesisch",
    "contact.downloadEn": "PDF auf Englisch",
  },
};

const originalContent = {};
const originalAriaLabels = {};
const navLabels = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.experience": "Experience",
    "nav.contact": "Contact",
  },
  pt: {
    "nav.home": "In\u00edcio",
    "nav.about": "Sobre",
    "nav.skills": "Skills",
    "nav.projects": "Projetos",
    "nav.experience": "Experi\u00eancia",
    "nav.contact": "Contato",
  },
  de: {
    "nav.home": "Start",
    "nav.about": "\u00dcber mich",
    "nav.skills": "F\u00e4higkeiten",
    "nav.projects": "Projekte",
    "nav.experience": "Erfahrung",
    "nav.contact": "Kontakt",
  },
};

const storeOriginalContent = () => {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");

    originalContent[key] = element.innerHTML;
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.getAttribute("data-i18n-aria-label");

    originalAriaLabels[key] = element.getAttribute("aria-label") || "";
  });
};

const syncNavLabels = (lang) => {
  const labels = navLabels[lang] || navLabels.en;

  document.querySelectorAll(".nav-links [data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");

    if (labels[key]) {
      element.textContent = labels[key];
    }
  });
};

let currentLang = localStorage.getItem("language") || "en";

const setLanguage = (lang) => {
  currentLang = lang;
  localStorage.setItem("language", lang);
  document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");

    if (lang === "en") {
      if (originalContent[key]) {
        element.innerHTML = originalContent[key];
      }

    } else if (translations[lang] && translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.getAttribute("data-i18n-aria-label");

    if (lang === "en") {
      if (originalAriaLabels[key]) {
        element.setAttribute("aria-label", originalAriaLabels[key]);
      }

    } else if (translations[lang] && translations[lang][key]) {
      element.setAttribute("aria-label", translations[lang][key]);
    }
  });

  syncNavLabels(lang);

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
};

const initLanguage = () => {
  storeOriginalContent();

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");

      setLanguage(lang);
    });
  });

  setLanguage(currentLang);
};
