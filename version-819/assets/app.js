(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var minis = Array.prototype.slice.call(hero.querySelectorAll('.hero-mini'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
      var next = hero.querySelector('[data-hero-next]');
      var prev = hero.querySelector('[data-hero-prev]');
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === index);
        });
        minis.forEach(function (mini, i) {
          mini.classList.toggle('is-active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }

      function restart() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5000);
      }

      if (next) {
        next.addEventListener('click', function () {
          show(index + 1);
          restart();
        });
      }

      if (prev) {
        prev.addEventListener('click', function () {
          show(index - 1);
          restart();
        });
      }

      minis.concat(dots).forEach(function (item) {
        item.addEventListener('click', function () {
          var value = parseInt(item.getAttribute('data-hero-to'), 10);
          if (!Number.isNaN(value)) {
            show(value);
            restart();
          }
        });
      });

      show(0);
      restart();
    });

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('.filter-input');
      var select = scope.querySelector('.filter-select');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
      var empty = scope.querySelector('.empty-filter');
      var queryValue = new URLSearchParams(window.location.search).get('q');

      if (input && queryValue && !input.value) {
        input.value = queryValue;
      }

      function applyFilter() {
        var term = input ? input.value.trim().toLowerCase() : '';
        var selected = select ? select.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
          var cardYear = card.getAttribute('data-year') || '';
          var matchedText = !term || keywords.indexOf(term) !== -1;
          var matchedYear = !selected || selected === cardYear;
          var show = matchedText && matchedYear;
          card.style.display = show ? '' : 'none';
          if (show) {
            visible += 1;
          }
        });

        if (empty) {
          empty.style.display = visible ? 'none' : 'block';
        }
      }

      if (input) {
        input.addEventListener('input', applyFilter);
      }

      if (select) {
        select.addEventListener('change', applyFilter);
      }

      applyFilter();
    });
  });
})();
