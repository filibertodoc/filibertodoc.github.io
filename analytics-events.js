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

    // YouTube Player Tracking
    if (document.getElementById('youtube-player')) {
        // Load YouTube API
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Player instance and progress tracking variables
        let player;
        let progressTracked = {
            25: false,
            50: false,
            75: false,
            95: false
        };

        // YouTube API callback
        window.onYouTubeIframeAPIReady = function() {
            player = new YT.Player('youtube-player', {
                height: '315',
                width: '560',
                videoId: 'y4IlZbMPppc', // Your trailer video ID
                playerVars: {
                    'playsinline': 1,
                    'origin': window.location.origin,
                    'rel': 0, // Prevent related videos at end
                    'modestbranding': 1, // Hide YouTube logo
                    'showinfo': 0 // Hide video info (deprecated but still useful)
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        };

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
});