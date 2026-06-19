(function() {
  function setStatus(player, text) {
    var status = player.querySelector("[data-player-status]");
    if (status) {
      status.textContent = text;
    }
  }

  function startPlayer(player) {
    if (player.dataset.started === "true") {
      var activeVideo = player.querySelector("video");
      if (activeVideo) {
        activeVideo.play();
      }
      return;
    }

    var video = player.querySelector("video");
    var overlay = player.querySelector("[data-player-overlay]");
    var source = player.getAttribute("data-source");

    if (!video || !source) {
      setStatus(player, "播放源未就绪");
      return;
    }

    player.dataset.started = "true";
    video.controls = true;

    if (overlay) {
      overlay.classList.add("is-hidden");
    }

    setStatus(player, "正在加载播放源");

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.addEventListener("loadedmetadata", function() {
        video.play();
      }, { once: true });
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(source);
      hls.attachMedia(video);

      hls.on(window.Hls.Events.MANIFEST_PARSED, function() {
        setStatus(player, "播放源已就绪");
        video.play();
      });

      hls.on(window.Hls.Events.ERROR, function(event, data) {
        if (data && data.fatal) {
          setStatus(player, "播放加载失败，请刷新页面后重试");
        }
      });

      player._hls = hls;
      return;
    }

    video.src = source;
    video.play().catch(function() {
      setStatus(player, "当前浏览器不支持此播放格式");
    });
  }

  var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

  players.forEach(function(player) {
    var overlay = player.querySelector("[data-player-overlay]");
    var button = player.querySelector("[data-play-button]");

    if (overlay) {
      overlay.addEventListener("click", function() {
        startPlayer(player);
      });
    }

    if (button) {
      button.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        startPlayer(player);
      });
    }
  });
})();
