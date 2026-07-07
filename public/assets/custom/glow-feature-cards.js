(() => {
  const mount = () => {
    const host = document.querySelector(".framer-Srm7S .framer-19j3ys9");
    if (!host || host.querySelector(".custom-glow-feature-section")) return;

    const section = document.createElement("div");
    section.className = "custom-glow-feature-section";
    section.innerHTML = `
      <div class="custom-ai-image-card" aria-label="AI technology feature image">
        <img src="/assets/custom/ai-slogan-card.png" alt="">
        <div class="custom-ai-noise"></div>
        <div class="custom-ai-border"></div>
      </div>`;

    const readMore = host.querySelector(".framer-1i9ktln");
    if (readMore) host.insertBefore(section, readMore);
    else host.appendChild(section);
  };

  const createVideoController = () => {
    if (window.customVideoController) return window.customVideoController;

    const canObserve = "IntersectionObserver" in window;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const observed = new WeakSet();

    const isNearViewport = (video) => {
      const rect = video.getBoundingClientRect();
      const margin = Math.min(window.innerHeight || 720, 240);
      return rect.bottom > -margin && rect.top < (window.innerHeight || 720) + margin;
    };

    const restoreSrc = (video) => {
      const src = video.dataset.customVideoSrc;
      if (!src || video.getAttribute("src") === src) return false;
      video.setAttribute("src", src);
      video.load?.();
      return true;
    };

    const releaseSrc = (video) => {
      const src = video.getAttribute("src") || video.currentSrc;
      if (src) video.dataset.customVideoSrc = video.dataset.customVideoSrc || src;
      if (!video.getAttribute("src")) return;
      video.pause?.();
      video.removeAttribute("src");
      video.load?.();
    };

    const play = (video) => {
      if (reduceMotion || !video.dataset.customVideoVisible) return;
      restoreSrc(video);
      const request = video.play?.();
      if (request && typeof request.catch === "function") request.catch(() => {});
    };

    const prepare = (video) => {
      const src = video.getAttribute("src") || video.currentSrc;
      if (src) video.dataset.customVideoSrc = video.dataset.customVideoSrc || src;
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = false;
      video.preload = "none";
      video.setAttribute("muted", "");
      video.setAttribute("loop", "");
      video.setAttribute("playsinline", "");
      video.removeAttribute("autoplay");
      video.setAttribute("preload", "none");

      if (isNearViewport(video)) restoreSrc(video);
      else releaseSrc(video);
    };

    const observer = canObserve
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const video = entry.target;
              if (entry.isIntersecting) {
                video.dataset.customVideoVisible = "true";
                restoreSrc(video);
                play(video);
              } else {
                delete video.dataset.customVideoVisible;
                video.pause?.();
                if (!isNearViewport(video)) releaseSrc(video);
              }
            });
          },
          { rootMargin: "160px 0px", threshold: 0.08 }
        )
      : null;

    const observe = (video) => {
      if (!video) return;
      prepare(video);
      if (observed.has(video)) return;
      observed.add(video);
      if (observer) observer.observe(video);
      else {
        video.dataset.customVideoVisible = "true";
        play(video);
      }
      window.setTimeout(() => {
        if (!isNearViewport(video)) {
          delete video.dataset.customVideoVisible;
          releaseSrc(video);
        }
      }, 800);
      window.setTimeout(() => {
        if (!isNearViewport(video)) {
          delete video.dataset.customVideoVisible;
          releaseSrc(video);
        }
      }, 1800);
    };

    window.customVideoController = { observe, play, prepare };
    return window.customVideoController;
  };

  const hydrateVideos = () => {
    const controller = createVideoController();
    document.querySelectorAll("video").forEach((video) => {
      controller.observe(video);
    });
  };

  const run = () => {
    mount();
    hydrateVideos();
  };

  const scheduleRun = () => {
    window.setTimeout(run, 600);
    window.setTimeout(run, 1600);
  };

  if (document.readyState === "complete") scheduleRun();
  else window.addEventListener("load", scheduleRun, { once: true });
})();
