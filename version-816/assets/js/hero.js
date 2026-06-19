(function () {
    var root = document.querySelector('[data-hero]');
    if (!root) {
        return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === current);
        });
    }

    function start() {
        stop();
        timer = window.setInterval(function () {
            show(current + 1);
        }, 5200);
    }

    function stop() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            show(index);
            start();
        });
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
})();
