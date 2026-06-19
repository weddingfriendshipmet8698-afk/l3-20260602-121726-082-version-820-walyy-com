(function () {
  function initPlayer(box) {
    var video = box.querySelector('.movie-video');
    var layer = box.querySelector('.play-layer');
    if (!video || !layer) {
      return;
    }

    var src = video.getAttribute('data-play');
    var started = false;
    var hls = null;

    function start() {
      if (!src) {
        return;
      }

      layer.classList.add('is-hidden');

      if (!started) {
        started = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true });
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          video.src = src;
        }
      }

      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
    }

    layer.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!started) {
        start();
      } else if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
    video.addEventListener('play', function () {
      layer.classList.add('is-hidden');
    });
    video.addEventListener('emptied', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
      started = false;
    });
  }

  document.querySelectorAll('.video-shell').forEach(initPlayer);
})();
