
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'fr',
        includedLanguages: 'en,fr',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

function setLanguage(lang) {
    // Set the cookie that Google Translate uses
    // Cookie format: googtrans=/source/target
    // For FR (original): /fr/fr (or just delete it to revert)
    // For EN: /fr/en

    let domain = window.location.hostname;

    if (lang === 'en') {
        document.cookie = "googtrans=/fr/en; path=/; domain=" + domain;
        document.cookie = "googtrans=/fr/en; path=/;";
    } else {
        // Clear cookies to revert to original
        document.cookie = "googtrans=/fr/fr; path=/; domain=" + domain;
        document.cookie = "googtrans=/fr/fr; path=/;";
    }

    // Reload to apply
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', function () {
    // Check current language based on cookie
    const cookies = document.cookie.split(';');
    let currentLang = 'fr';

    for (let cookie of cookies) {
        if (cookie.trim().startsWith('googtrans=')) {
            if (cookie.includes('/en')) {
                currentLang = 'en';
            }
            break;
        }
    }

    // Update UI
    const currentLangSpan = document.getElementById('currentLang');
    if (currentLangSpan) {
        if (currentLang === 'en') {
            currentLangSpan.innerHTML = '🇺🇸';
        } else {
            currentLangSpan.innerHTML = '🇫🇷';
        }
    }
});
