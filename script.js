const panels = Array.from(document.querySelectorAll("body > section, body > main"));
const languageButtons = Array.from(document.querySelectorAll(".language-option"));
const translatedNodes = Array.from(document.querySelectorAll("[data-i18n]"));
const navLinks = Array.from(document.querySelectorAll(".page-nav-link"));

const translations = {
    en: {
        heroSkills: "Data analysis - Machine learning - Python",
        heroScroll: "Scroll down to view my portfolio",
        navHome: "Home",
        contactButton: "Contact",
        portfolioCategoryKicker: "Portfolio category",
        portfolioDataAnalysis: "Data analysis",
        portfolioDataAnalysisIntro: "Projects focused on turning complex datasets into clear, decision-friendly visual stories.",
        portfolioMachineLearning: "Machine learning",
        portfolioPython: "Python",
        dataVizKicker: "Exam project - Data visualization",
        dataVizTitle: "Equipment losses in the Ukraine-Russia War",
        dataVizSummary: "An exam project focused on turning a large conflict dataset into a clear multi-view visualization for comparing visually confirmed equipment losses over time.",
        dataVizDatasetLabel: "Dataset",
        dataVizDatasetBody: "Built from Oryx records, with dates extracted and validated, and additional fields added for equipment type, manufacturer, and supertype across more than 27,000 rows.",
        dataVizSolutionLabel: "Visualization",
        dataVizSolutionBody: "The final solution combined a mirrored area chart with a minimap, a detailed date-range view, and an icicle chart for hierarchical loss breakdowns.",
        dataVizDecisionsLabel: "Design decisions",
        dataVizDecisionsBody: "I used mirrored structure, shared scales, grounded gridlines, and an orange-blue palette to make asymmetry, magnitude, and adversarial comparison easier to read at a glance.",
        nextProjectKicker: "Master's thesis project - Data analysis",
        nextProjectTitle: "Another data analysis case study coming here",
        nextProjectSummary: "Coming soon",
        contactHeading: "Contact",
        availability: "Available for work from July 1st"
    },
    da: {
        heroSkills: "Dataanalyse - Maskinlaering - Python",
        heroScroll: "Scroll ned for at se min portfolio",
        navHome: "Hjem",
        contactButton: "Kontakt",
        portfolioCategoryKicker: "Portfoliokategori",
        portfolioDataAnalysis: "Dataanalyse",
        portfolioDataAnalysisIntro: "Projekter med fokus pa at omsaette komplekse datasat til klare og beslutningsvenlige visuelle fortaellinger.",
        portfolioMachineLearning: "Maskinlæring",
        portfolioPython: "Python",
        dataVizKicker: "Eksamensprojekt - Datavisualisering",
        dataVizTitle: "Tab af udstyr i Ukraine-Rusland-krigen",
        dataVizSummary: "Et eksamensprojekt med fokus pa at omsaette et stort konfliktdatasat til en klar multivisuel visualisering af visuelt bekraeftede materieltab over tid.",
        dataVizDatasetLabel: "Datasat",
        dataVizDatasetBody: "Bygget pa Oryx-data, hvor datoer blev udtrukket og valideret, og hvor ekstra felter blev tilfojet for udstyrstype, producent og supertype pa tværs af mere end 27.000 raekker.",
        dataVizSolutionLabel: "Visualisering",
        dataVizSolutionBody: "Den endelige løsning kombinerede et spejlet arealdiagram med en minimap, en detaljeret datovisning for valgte perioder og et icicle-diagram til hierarkisk opdeling af tab.",
        dataVizDecisionsLabel: "Designvalg",
        dataVizDecisionsBody: "Jeg brugte spejlet struktur, faelles skalaer, forankrende gridlines og en orange-bla palet for at gore asymmetri, storrelsesforhold og modstander-sammenligning lettere at aflæse.",
        nextProjectKicker: "Specialeprojekt - Dataanalyse",
        nextProjectTitle: "Endnu et dataanalyseprojekt kan vises her",
        nextProjectSummary: "Kommer snart",
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

    const currentPanelId = panels[currentPanel]?.id || "";
    const isInDataAnalysis = currentPanelId.startsWith("portfolio-data-analysis-project-");
    document.body.classList.toggle("is-in-data-analysis", isInDataAnalysis);

    let activeNavTarget = currentPanelId;

    if (currentPanelId === "intro") {
        activeNavTarget = "intro";
    } else if (isInDataAnalysis) {
        activeNavTarget = "data-analysis";
    }

    navLinks.forEach((link) => {
        const isActive = link.dataset.navTarget === activeNavTarget;
        link.classList.toggle("is-active", isActive);
        link.setAttribute("aria-current", isActive ? "page" : "false");
    });
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
