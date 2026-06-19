(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderResults(root, query) {
        var panel = root.querySelector('[data-search-panel]');
        if (!panel) {
            return;
        }
        var q = query.trim().toLowerCase();
        if (!q) {
            panel.classList.remove('open');
            panel.innerHTML = '';
            return;
        }
        var data = window.SEARCH_INDEX || [];
        var results = data.filter(function (item) {
            return item.text.indexOf(q) !== -1;
        }).slice(0, 12);
        if (!results.length) {
            panel.innerHTML = '<div class="empty-result">没有找到匹配影片</div>';
            panel.classList.add('open');
            return;
        }
        panel.innerHTML = results.map(function (item) {
            return '<a class="search-result" href="' + escapeHtml(item.url) + '">' +
                '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '">' +
                '<span><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.meta) + '</span></span>' +
                '</a>';
        }).join('');
        panel.classList.add('open');
    }

    document.querySelectorAll('[data-search-root]').forEach(function (root) {
        var input = root.querySelector('[data-search-input]');
        if (!input) {
            return;
        }
        input.addEventListener('input', function () {
            renderResults(root, input.value);
        });
        input.addEventListener('focus', function () {
            renderResults(root, input.value);
        });
    });

    document.addEventListener('click', function (event) {
        document.querySelectorAll('[data-search-root]').forEach(function (root) {
            if (!root.contains(event.target)) {
                var panel = root.querySelector('[data-search-panel]');
                if (panel) {
                    panel.classList.remove('open');
                }
            }
        });
    });

    document.querySelectorAll('[data-filter-root]').forEach(function (root) {
        var list = document.querySelector('[data-filter-list]');
        var input = root.querySelector('[data-filter-input]');
        var type = root.querySelector('[data-filter-type]');
        var year = root.querySelector('[data-filter-year]');
        var cards = list ? Array.prototype.slice.call(list.querySelectorAll('.movie-card')) : [];

        function applyFilter() {
            var q = input ? input.value.trim().toLowerCase() : '';
            var t = type ? type.value : '';
            var y = year && year.value ? parseInt(year.value, 10) : 0;
            cards.forEach(function (card) {
                var title = (card.getAttribute('data-title') || '').toLowerCase();
                var cardType = card.getAttribute('data-type') || '';
                var cardYear = parseInt(card.getAttribute('data-year') || '0', 10);
                var ok = true;
                if (q && title.indexOf(q) === -1) {
                    ok = false;
                }
                if (t && cardType !== t) {
                    ok = false;
                }
                if (y && cardYear < y) {
                    ok = false;
                }
                card.style.display = ok ? '' : 'none';
            });
        }

        [input, type, year].forEach(function (node) {
            if (node) {
                node.addEventListener('input', applyFilter);
                node.addEventListener('change', applyFilter);
            }
        });
    });
})();
