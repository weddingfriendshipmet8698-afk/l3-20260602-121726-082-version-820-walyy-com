(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var nextButton = hero.querySelector('[data-hero-next]');
    var prevButton = hero.querySelector('[data-hero-prev]');
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    }

    function startTimer() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 6200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        startTimer();
      });
    });

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        showSlide(activeIndex + 1);
        startTimer();
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        showSlide(activeIndex - 1);
        startTimer();
      });
    }

    showSlide(0);
    startTimer();
  }

  var filterAreas = Array.prototype.slice.call(document.querySelectorAll('[data-filter-area]'));

  filterAreas.forEach(function (area) {
    var input = area.querySelector('[data-filter-input]');
    var cards = Array.prototype.slice.call(area.querySelectorAll('.movie-card'));
    var chips = Array.prototype.slice.call(area.querySelectorAll('[data-filter-value]'));

    function applyFilter(value) {
      var keyword = String(value || '').trim().toLowerCase();

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();

        card.classList.toggle('is-hidden-card', keyword && haystack.indexOf(keyword) === -1);
      });
    }

    if (input) {
      var params = new URLSearchParams(window.location.search);
      var initial = params.get('q') || '';

      if (initial) {
        input.value = initial;
        applyFilter(initial);
      }

      input.addEventListener('input', function () {
        applyFilter(input.value);
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var value = chip.getAttribute('data-filter-value') || '';

        if (input) {
          input.value = value;
        }

        applyFilter(value);
      });
    });
  });

  var headerSearch = document.querySelector('[data-search-form]');

  if (headerSearch) {
    headerSearch.addEventListener('submit', function (event) {
      var input = headerSearch.querySelector('input[name="q"]');

      if (!input || !input.value.trim()) {
        event.preventDefault();
        input && input.focus();
      }
    });
  }

  var playButton = document.querySelector('[data-video-url]');
  var player = document.querySelector('[data-player]');
  var hlsInstance = null;

  if (playButton && player) {
    function attachSource() {
      var url = playButton.getAttribute('data-video-url');

      if (!url) {
        return;
      }

      if (player.canPlayType('application/vnd.apple.mpegurl')) {
        if (player.getAttribute('src') !== url) {
          player.setAttribute('src', url);
        }
      } else if (window.Hls && window.Hls.isSupported()) {
        if (!hlsInstance) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hlsInstance.loadSource(url);
          hlsInstance.attachMedia(player);
        }
      } else if (player.getAttribute('src') !== url) {
        player.setAttribute('src', url);
      }
    }

    function startPlayback() {
      attachSource();
      playButton.classList.add('is-hidden');

      var promise = player.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          playButton.classList.remove('is-hidden');
        });
      }
    }

    playButton.addEventListener('click', startPlayback);
    player.addEventListener('click', function () {
      if (player.paused) {
        startPlayback();
      }
    });
    player.addEventListener('play', function () {
      playButton.classList.add('is-hidden');
    });
  }
}());
