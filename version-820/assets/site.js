(function() {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var navLinks = document.querySelector("[data-nav-links]");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", function() {
      navLinks.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));

  if (slides.length > 1) {
    var current = 0;

    function showSlide(index) {
      current = index;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener("click", function() {
        showSlide(index);
      });
    });

    window.setInterval(function() {
      showSlide((current + 1) % slides.length);
    }, 5000);
  }

  var filterForms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));

  filterForms.forEach(function(form) {
    var scopeId = form.getAttribute("data-filter-form");
    var scope = document.querySelector('[data-filter-scope="' + scopeId + '"]');
    var empty = document.querySelector('[data-filter-empty="' + scopeId + '"]');

    if (!scope) {
      return;
    }

    var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
    var input = form.querySelector("[data-filter-keyword]");
    var typeSelect = form.querySelector("[data-filter-type]");
    var yearSelect = form.querySelector("[data-filter-year]");

    function matches(card) {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      var typeValue = typeSelect ? typeSelect.value : "";
      var yearValue = yearSelect ? yearSelect.value : "";
      var title = (card.getAttribute("data-title") || "").toLowerCase();
      var meta = (card.getAttribute("data-meta") || "").toLowerCase();
      var cardText = (title + " " + meta).toLowerCase();
      var cardYear = meta.match(/\b(19|20)\d{2}\b/);
      var hasKeyword = !keyword || cardText.indexOf(keyword) !== -1;
      var hasType = !typeValue || meta.indexOf(typeValue.toLowerCase()) !== -1;
      var hasYear = !yearValue || (cardYear && cardYear[0] === yearValue);

      return hasKeyword && hasType && hasYear;
    }

    function applyFilters() {
      var visibleCount = 0;

      cards.forEach(function(card) {
        var isVisible = matches(card);
        card.classList.toggle("hidden-card", !isVisible);
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visibleCount === 0);
      }
    }

    [input, typeSelect, yearSelect].forEach(function(control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });

    applyFilters();
  });
})();
