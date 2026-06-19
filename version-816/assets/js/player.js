(function () {
    document.querySelectorAll('[data-player-root]').forEach(function (root) {
        var video = root.querySelector('video');
        var button = root.querySelector('[data-play-button]');
        if (!video) {
            return;
        }
        var source = video.getAttribute('data-video-src');
        var ready = false;

        function attachSource() {
            if (ready || !source) {
                return;
            }
            ready = true;
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else {
                video.src = source;
            }
        }

        function playVideo() {
            attachSource();
            var attempt = video.play();
            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });
        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('hidden');
            }
        });
        video.addEventListener('pause', function () {
            if (button && video.currentTime === 0) {
                button.classList.remove('hidden');
            }
        });
    });
})();
