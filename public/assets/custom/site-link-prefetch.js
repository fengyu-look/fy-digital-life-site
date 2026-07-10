(() => {
  const prefetched = new Set();
  const sameOrigin = (url) => url.origin === window.location.origin;
  const canonicalPagePaths = new Set([
    "/",
    "/studio/useful-websites",
    "/studio/prompt-collection",
    "/studio/skill-workflow",
    "/studio/photography",
    "/studio/agent-guide",
    "/studio/digital-life",
    "/prompt-template",
  ]);

  const normalizePath = (pathname) => {
    const clean = pathname.replace(/\/+$/, "");
    return clean || "/";
  };

  const canPrefetchPage = (url) => {
    if (url.pathname.startsWith("/assets/")) return false;
    return canonicalPagePaths.has(normalizePath(url.pathname));
  };

  const normalize = (href) => {
    try {
      const url = new URL(href, window.location.href);
      if (!sameOrigin(url)) return null;
      url.hash = "";
      return url;
    } catch {
      return null;
    }
  };

  const fetchText = async (url) => {
    const response = await fetch(url, {
      cache: "force-cache",
      credentials: "same-origin",
      priority: "low",
    });
    return response.ok ? response.text() : "";
  };

  const prefetchModule = (href) => {
    if (prefetched.has(href)) return;
    prefetched.add(href);
    const link = document.createElement("link");
    link.rel = "modulepreload";
    link.fetchPriority = "low";
    link.href = href;
    document.head.appendChild(link);
  };

  const prefetchPage = async (href) => {
    const url = normalize(href);
    if (!url || !canPrefetchPage(url) || prefetched.has(url.href)) return;
    prefetched.add(url.href);

    try {
      const html = await fetchText(url.href);
      if (!html) return;
      const doc = new DOMParser().parseFromString(html, "text/html");
      doc
        .querySelectorAll('link[rel="modulepreload"][href], script[type="module"][src]')
        .forEach((node) => {
          const asset = normalize(node.getAttribute("href") || node.getAttribute("src"));
          if (asset) prefetchModule(asset.href);
        });
    } catch {}
  };

  const warm = (event) => {
    const link = event.target?.closest?.("a[href]");
    if (!link) return;
    prefetchPage(link.getAttribute("href"));
  };

  document.addEventListener("pointerenter", warm, { capture: true, passive: true });
  document.addEventListener("focusin", warm, { passive: true });
  document.addEventListener("touchstart", warm, { capture: true, passive: true });
})();
