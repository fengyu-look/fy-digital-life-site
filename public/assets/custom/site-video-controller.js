(() => {
  if (window.customVideoController?.hydrateAll) {
    window.customVideoController.hydrateAll();
    return;
  }

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

    releaseSrc(video);
    if (video.dataset.customVideoSrc?.includes("home-hero-user-video-lite.mp4")) {
      restoreSrc(video);
      play(video);
    }
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
      if (isNearViewport(video)) {
        video.dataset.customVideoVisible = "true";
        restoreSrc(video);
        play(video);
      }
    }, 160);
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

  const hydrateAll = () => {
    document.querySelectorAll("video").forEach(observe);
  };

  window.customVideoController = { observe, play, prepare, hydrateAll };

  const observeAddedVideos = () => {
    new MutationObserver((entries) => {
      entries.forEach((entry) => {
        entry.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches?.("video")) observe(node);
          node.querySelectorAll?.("video").forEach(observe);
        });
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  };

  const scheduleHydrate = () => {
    window.setTimeout(hydrateAll, 600);
    window.setTimeout(hydrateAll, 1600);
  };

  if (document.readyState === "complete") scheduleHydrate();
  else window.addEventListener("load", scheduleHydrate, { once: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeAddedVideos, { once: true });
  } else {
    observeAddedVideos();
  }
})();
