document.addEventListener('DOMContentLoaded', function() {
  // Language toggle only
  const langToggle = document.getElementById('lang-toggle');
  const htmlElement = document.documentElement;

  if (langToggle) {
    langToggle.addEventListener('click', function() {
      const currentLang = htmlElement.getAttribute('lang');
      const newLang = currentLang === 'en' ? 'es' : 'en';
      htmlElement.setAttribute('lang', newLang);
    });
  }

  // Hamburger menu only
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('show');
      
      // Toggle hamburger animation
      this.classList.toggle('open');
    });
  }
});