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
    const langToggleButtons = document.querySelectorAll('#lang-toggle, #lang-toggle-mobile');
    if (langToggleButtons.length > 0) {
        langToggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentLang = document.documentElement.getAttribute('lang');
                const newLang = currentLang === 'en' ? 'es' : 'en';
                trackEvent('click', 'Language Toggle', `Toggle to ${newLang.toUpperCase()}`);
            });
        });
    }

    // Streaming buttons tracking
    document.querySelectorAll('.amazon-button, .kinema-button').forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList.contains('amazon-button') ? 'Amazon' : 'Kinema';
            const action = this.classList.contains('amazon-button') ? 'Stream Now' : 'Rent or Host';
            trackEvent(action, 'Streaming CTA', platform);
        });
    });

    // Info link tracking
    const infoLink = document.querySelector('.info-link');
    if (infoLink) {
        infoLink.addEventListener('click', function() {
            trackEvent('click', 'Information', 'Learn More Link');
        });
    }

    // Screening info links tracking
    document.querySelectorAll('#screenings li a').forEach(link => {
        link.addEventListener('click', function() {
            const location = this.closest('li').textContent.split('@')[0].trim();
            trackEvent('click', 'Screening Info', location);
        });
    });

    // YouTube Player Tracking with Lazy Loading
    const youtubePlayer = document.getElementById('youtube-player');
    if (youtubePlayer) {
        const trailerObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadYouTubePlayer();
                trailerObserver.disconnect();
                trackEvent('impression', 'YouTube Video', 'Trailer Visible');
            }
        }, { threshold: 0.1 });

        trailerObserver.observe(youtubePlayer);

        // Player instance and progress tracking variables
        let player;
        let progressTracked = {
            25: false,
            50: false,
            75: false,
            95: false
        };

        function loadYouTubePlayer() {
            // Load YouTube API
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            // YouTube API callback
            window.onYouTubeIframeAPIReady = function() {
                player = new YT.Player('youtube-player', {
                    height: '100%',
                    width: '100%',
                    videoId: 'y4IlZbMPppc',
                    playerVars: {
                        'playsinline': 1,
                        'origin': window.location.origin,
                        'rel': 0,
                        'modestbranding': 1,
                        'showinfo': 0
                    },
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            };
        }

        function onPlayerReady(event) {
            trackEvent('ready', 'YouTube Video', 'Player Ready');
        }

        function onPlayerStateChange(event) {
            const videoData = player.getVideoData();
            const videoTitle = videoData.title || 'Filiberto Trailer';
            const videoId = videoData.video_id || 'y4IlZbMPppc';
            
            switch (event.data) {
                case YT.PlayerState.PLAYING:
                    trackEvent('play', 'YouTube Video', `${videoTitle} (${videoId})`);
                    startProgressTracking();
                    break;
                case YT.PlayerState.PAUSED:
                    trackEvent('pause', 'YouTube Video', `${videoTitle} (${videoId})`);
                    break;
                case YT.PlayerState.ENDED:
                    trackEvent('complete', 'YouTube Video', `${videoTitle} (${videoId})`);
                    stopProgressTracking();
                    
                    // Reset player to beginning to prevent related videos
                    setTimeout(() => {
                        if (player && player.seekTo) {
                            player.seekTo(0);
                            player.pauseVideo();
                        }
                    }, 1000);
                    break;
                case YT.PlayerState.BUFFERING:
                    trackEvent('buffering', 'YouTube Video', `${videoTitle} (${videoId})`);
                    break;
                case YT.PlayerState.CUED:
                    trackEvent('cued', 'YouTube Video', `${videoTitle} (${videoId})`);
                    resetProgressTracking();
                    break;
            }
        }

        // Progress tracking functions
        let progressInterval;
        
        function startProgressTracking() {
            progressInterval = setInterval(checkProgress, 1000);
        }
        
        function stopProgressTracking() {
            clearInterval(progressInterval);
        }
        
        function resetProgressTracking() {
            stopProgressTracking();
            progressTracked = {
                25: false,
                50: false,
                75: false,
                95: false
            };
        }
        
        function checkProgress() {
            if (player && player.getCurrentTime && player.getDuration) {
                const currentTime = player.getCurrentTime();
                const duration = player.getDuration();
                const percent = Math.round((currentTime / duration) * 100);
                const videoData = player.getVideoData();
                const videoTitle = videoData.title || 'Filiberto Trailer';
                const videoId = videoData.video_id || 'y4IlZbMPppc';
                
                // Track progress milestones
                [25, 50, 75, 95].forEach(threshold => {
                    if (percent >= threshold && !progressTracked[threshold]) {
                        trackEvent(`progress_${threshold}`, 'YouTube Video', `${videoTitle} (${videoId})`);
                        progressTracked[threshold] = true;
                    }
                });
            }
        }
    }

    // Viewport tracking for main sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const sectionName = entry.target.querySelector('h2')?.textContent || sectionId;
                trackEvent('view', 'Section', sectionName);
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});