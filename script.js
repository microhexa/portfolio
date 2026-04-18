const panels = Array.from(document.querySelectorAll("body > section, body > main"));
const languageButtons = Array.from(document.querySelectorAll(".language-option"));
const translatedNodes = Array.from(document.querySelectorAll("[data-i18n]"));

const translations = {
    en: {
        heroSkills: "Data analysis • Machine learning • Python",
        heroScroll: "Scroll down to view my portfolio",
        contactButton: "Contact",
        portfolioDataAnalysis: "Data analysis",
        portfolioMachineLearning: "Machine learning",
        portfolioPython: "Python",
        contactHeading: "Contact",
        availability: "Available for work from July 1st"
    },
    da: {
        heroSkills: "Dataanalyse • Maskinlaering • Python",
        heroScroll: "Scroll ned for at se min portfolio",
        contactButton: "Kontakt",
        portfolioDataAnalysis: "Dataanalyse",
        portfolioMachineLearning: "Maskinlaering",
        portfolioPython: "Python",
        contactHeading: "Kontakt",
        availability: "Ledig til arbejde fra 1. juli"
    }
};

let currentPanel = 0;
let wheelProgress = 0;
let isTransitioning = false;
let currentLanguage = "en";

const WHEEL_THRESHOLD = 45;
const TRANSITION_DURATION_MS = 700;
const LANGUAGE_STORAGE_KEY = "portfolio-language";

function clampPanelIndex(index) {
    return Math.max(0, Math.min(index, panels.length - 1));
}

function updateCurrentPanel() {
    const viewportMiddle = window.scrollY + window.innerHeight / 2;

    currentPanel = panels.findIndex((panel) => {
        const top = panel.offsetTop;
        const bottom = top + panel.offsetHeight;

        return viewportMiddle >= top && viewportMiddle < bottom;
    });

    if (currentPanel === -1) {
        currentPanel = 0;
    }
}

function scrollToPanel(index) {
    const nextPanel = clampPanelIndex(index);

    if (nextPanel === currentPanel) {
        return;
    }

    isTransitioning = true;
    currentPanel = nextPanel;
    wheelProgress = 0;

    panels[currentPanel].scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    window.setTimeout(() => {
        isTransitioning = false;
    }, TRANSITION_DURATION_MS);
}

function applyLanguage(language) {
    const nextLanguage = Object.hasOwn(translations, language) ? language : "en";

    currentLanguage = nextLanguage;
    document.documentElement.lang = currentLanguage;

    translatedNodes.forEach((node) => {
        const key = node.dataset.i18n;
        const text = translations[currentLanguage][key];

        if (text) {
            node.textContent = text;
        }
    });

    languageButtons.forEach((button) => {
        const isActive = button.dataset.language === currentLanguage;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
}

function initializeLanguage() {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    applyLanguage(savedLanguage || "en");
}

window.addEventListener("load", () => {
    initializeLanguage();
    updateCurrentPanel();
});

window.addEventListener("resize", updateCurrentPanel);
window.addEventListener("scroll", updateCurrentPanel, { passive: true });

window.addEventListener("wheel", (event) => {
    if (isTransitioning) {
        event.preventDefault();
        return;
    }

    wheelProgress += event.deltaY;

    if (Math.abs(wheelProgress) < WHEEL_THRESHOLD) {
        event.preventDefault();
        return;
    }

    const direction = Math.sign(wheelProgress);
    wheelProgress = 0;
    event.preventDefault();
    scrollToPanel(currentPanel + direction);
}, { passive: false });

languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
        applyLanguage(button.dataset.language || "en");
    });
});
