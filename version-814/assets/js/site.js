(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-nav-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  var filterPanels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

  filterPanels.forEach(function (panel) {
    var scope = panel.getAttribute('data-filter-scope') || 'document';
    var root = scope === 'document' ? document : panel.closest(scope);
    var input = panel.querySelector('[data-filter-search]');
    var region = panel.querySelector('[data-filter-region]');
    var year = panel.querySelector('[data-filter-year]');
    var category = panel.querySelector('[data-filter-category]');
    var cards = Array.prototype.slice.call((root || document).querySelectorAll('[data-title]'));
    var counterSelector = panel.getAttribute('data-filter-counter');
    var counter = counterSelector ? document.querySelector(counterSelector) : null;

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function update() {
      var query = normalize(input && input.value);
      var regionValue = normalize(region && region.value);
      var yearValue = normalize(year && year.value);
      var categoryValue = normalize(category && category.value);
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-category')
        ].join(' '));

        var matched = true;

        if (query && text.indexOf(query) === -1) {
          matched = false;
        }

        if (regionValue && normalize(card.getAttribute('data-region')).indexOf(regionValue) === -1) {
          matched = false;
        }

        if (yearValue && normalize(card.getAttribute('data-year')) !== yearValue) {
          matched = false;
        }

        if (categoryValue && normalize(card.getAttribute('data-category')) !== categoryValue) {
          matched = false;
        }

        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (counter) {
        counter.textContent = '当前显示 ' + visible + ' 部影片';
      }
    }

    [input, region, year, category].forEach(function (control) {
      if (control) {
        control.addEventListener('input', update);
        control.addEventListener('change', update);
      }
    });

    update();
  });

  function startHlsPlayer(button) {
    var panel = button.closest('[data-player]');

    if (!panel) {
      return;
    }

    var video = panel.querySelector('video');
    var overlay = panel.querySelector('.player-overlay');
    var source = panel.getAttribute('data-video-src');

    if (!video || !source) {
      return;
    }

    function play() {
      video.controls = true;
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          video.controls = true;
        });
      }
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!video._hlsInstance) {
        video._hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        video._hlsInstance.loadSource(source);
        video._hlsInstance.attachMedia(video);
        video._hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, play);
      } else {
        play();
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', play, { once: true });
    } else {
      video.src = source;
      play();
    }

    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-play-button]')).forEach(function (button) {
    button.addEventListener('click', function () {
      startHlsPlayer(button);
    });
  });
})();
