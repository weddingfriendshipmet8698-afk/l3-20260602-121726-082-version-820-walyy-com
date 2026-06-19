(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var navMenu = document.querySelector(".nav-menu");

  if (menuButton && navMenu) {
    menuButton.addEventListener("click", function () {
      navMenu.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  var searchInput = document.querySelector(".search-input");
  var yearSelect = document.querySelector(".year-filter");
  var genreSelect = document.querySelector(".genre-filter");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
  var emptyState = document.querySelector(".empty-state");

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function applyFilter() {
    if (!cards.length) {
      return;
    }

    var keyword = normalize(searchInput ? searchInput.value : "");
    var yearValue = yearSelect ? yearSelect.value : "";
    var genreValue = genreSelect ? genreSelect.value : "";
    var visible = 0;

    cards.forEach(function (card) {
      var title = normalize(card.getAttribute("data-title"));
      var region = normalize(card.getAttribute("data-region"));
      var genre = normalize(card.getAttribute("data-genre"));
      var category = normalize(card.getAttribute("data-category"));
      var year = card.getAttribute("data-year") || "";
      var matchKeyword = !keyword || title.indexOf(keyword) > -1 || region.indexOf(keyword) > -1 || genre.indexOf(keyword) > -1 || category.indexOf(keyword) > -1;
      var matchYear = !yearValue || year === yearValue;
      var matchGenre = !genreValue || genre.indexOf(normalize(genreValue)) > -1;
      var shouldShow = matchKeyword && matchYear && matchGenre;

      card.style.display = shouldShow ? "" : "none";
      if (shouldShow) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle("show", visible === 0);
    }
  }

  [searchInput, yearSelect, genreSelect].forEach(function (node) {
    if (node) {
      node.addEventListener("input", applyFilter);
      node.addEventListener("change", applyFilter);
    }
  });
})();
