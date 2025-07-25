document.addEventListener('DOMContentLoaded', function() {
    // Function to push events to dataLayer
    function trackEvent(action, category, label) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'custom_event',
            'eventAction': action,
            'eventCategory': category,
            'eventLabel': label
        });
    }

    // Language toggle tracking
    const langToggleButton = document.getElementById('lang-toggle');
    if (langToggleButton) {
        langToggleButton.addEventListener('click', function() {
            const currentLang = document.documentElement.getAttribute('lang');
            const newLang = currentLang === 'en' ? 'es' : 'en';
            trackEvent('click', 'Language Toggle', `Toggle to ${newLang.toUpperCase()}`);
        });
    }

    // Streaming buttons tracking
    document.querySelectorAll('.amazon-button, .kinema-button').forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList.contains('amazon-button') ? 'Amazon' : 'Kinema';
            trackEvent('click', 'Streaming CTA', platform);
        });
    });

    // Info button tracking
    const infoButton = document.querySelector('.info-button');
    if (infoButton) {
        infoButton.addEventListener('click', function() {
            trackEvent('click', 'Information', 'Learn More Button');
        });
    }

    // Screening info links tracking
    document.querySelectorAll('#screenings li a').forEach(link => {
        link.addEventListener('click', function() {
            const location = this.closest('li').textContent.split('@')[0].trim();
            trackEvent('click', 'Screening Info', location);
        });
    });
});