function initMoviePlayer(source) {
  var video = document.querySelector(".movie-video");
  var button = document.querySelector(".play-overlay");
  var loaded = false;
  var hls = null;

  if (!video || !button || !source) {
    return;
  }

  function attachSource(done) {
    if (loaded) {
      done();
      return;
    }

    loaded = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      done();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        done();
      });
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          hls.destroy();
          video.src = source;
        }
      });
      return;
    }

    video.src = source;
    done();
  }

  function startPlayback() {
    button.classList.add("is-hidden");
    attachSource(function () {
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          button.classList.remove("is-hidden");
        });
      }
    });
  }

  button.addEventListener("click", startPlayback);
  video.addEventListener("play", function () {
    button.classList.add("is-hidden");
  });
  video.addEventListener("pause", function () {
    if (!video.ended) {
      button.classList.remove("is-hidden");
    }
  });
  video.addEventListener("click", function () {
    if (video.paused) {
      startPlayback();
    }
  });
}
