document.addEventListener('DOMContentLoaded', function() {
  const langToggleButton = document.getElementById('lang-toggle');
  const htmlElement = document.documentElement;

  if (!langToggleButton) {
    console.error("Language toggle button not found!");
    return;
  }

  function toggleLanguage() {
    const currentLang = htmlElement.getAttribute('lang');
    const newLang = currentLang === 'en' ? 'es' : 'en';
    htmlElement.setAttribute('lang', newLang);
  }

  langToggleButton.addEventListener('click', toggleLanguage);
});