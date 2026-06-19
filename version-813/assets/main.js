(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length > 1) {
    var active = 0;
    var show = function (index) {
      active = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    setInterval(function () {
      show((active + 1) % slides.length);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-search]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var applyFilter = function () {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var year = yearFilter ? yearFilter.value : '';
    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre')
      ].join(' ').toLowerCase();
      var matchesQuery = !query || haystack.indexOf(query) !== -1;
      var matchesYear = !year || card.getAttribute('data-year') === year;
      card.classList.toggle('is-hidden', !(matchesQuery && matchesYear));
    });
  };
  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }
  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilter);
  }

  var player = document.querySelector('[data-player]');
  if (player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('.player-cover');
    var button = player.querySelector('.play-button');
    var src = player.getAttribute('data-video');
    var started = false;
    var begin = function () {
      if (!video || !src) {
        return;
      }
      if (cover) {
        cover.classList.add('is-hidden');
      }
      if (!started) {
        started = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          video.play().catch(function () {});
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.src = src;
          video.play().catch(function () {});
        }
      } else {
        video.play().catch(function () {});
      }
    };
    if (button) {
      button.addEventListener('click', begin);
    }
    if (cover) {
      cover.addEventListener('click', begin);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        begin();
      }
    });
  }
})();
