const translations = {
    de: {
        text: 'Text',
        dimensions: 'Höhe/Breite',
        padding: 'Rand',
        modules: 'Felder',
        color: 'Farbe',
        backgroundColor: 'Hintergrund',
        transparent: 'transparent',
        generate: 'Generieren',
        download: 'Herunterladen',
        imprint: 'Impressum',
        privacy: 'Datenschutz',
        source: 'Quellcode',
        skip: 'Zum Inhalt springen',
        format: 'Dateiformat',
        language: 'Sprache',
        legal: 'Rechtliches',
        newTab: ' (öffnet in neuem Tab)',
        errorMessage: 'Bitte einen Text eingeben.',
        errorDimensions: 'Bitte einen Wert von 32 bis 2048 eingeben.',
        errorPadding: 'Bitte einen Wert von 0 bis 20 eingeben.',
        statusGenerated: 'QR-Code wurde erzeugt.',
        qrLabel: 'QR-Code für: '
    },
    en: {
        text: 'Text',
        dimensions: 'Height/Width',
        padding: 'Padding',
        modules: 'cells',
        color: 'Color',
        backgroundColor: 'Background Color',
        transparent: 'transparent',
        generate: 'Generate',
        download: 'Download',
        imprint: 'Imprint',
        privacy: 'Privacy Policy',
        source: 'Source Code',
        skip: 'Skip to content',
        format: 'File format',
        language: 'Language',
        legal: 'Legal',
        newTab: ' (opens in a new tab)',
        errorMessage: 'Please enter a text.',
        errorDimensions: 'Please enter a value from 32 to 2048.',
        errorPadding: 'Please enter a value from 0 to 20.',
        statusGenerated: 'QR code generated.',
        qrLabel: 'QR code for: '
    }
};

let currentLanguage = 'de';

function t(key) {
    return translations[currentLanguage][key];
}

function clearErrors() {
    document.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
        el.removeAttribute('aria-invalid');
    });
    document.querySelectorAll('.invalid-feedback').forEach(el => { el.textContent = ''; });
}

function setLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.getElementById('language').value = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = translations[lang][el.dataset.i18n];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        el.setAttribute('aria-label', translations[lang][el.dataset.i18nAria]);
    });
    clearErrors();
    document.getElementById('status-sr').textContent = '';
    try { localStorage.setItem('lang', lang); } catch (e) {}
}

function detectLanguage() {
    try {
        const stored = localStorage.getItem('lang');
        if (translations[stored]) return stored;
    } catch (e) {}
    return (navigator.language || 'en').toLowerCase().startsWith('de') ? 'de' : 'en';
}

document.getElementById('language').addEventListener('change', e => setLanguage(e.target.value));
setLanguage(detectLanguage());
