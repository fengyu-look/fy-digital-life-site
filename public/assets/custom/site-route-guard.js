(() => {
  const retiredRouteTargets = new Map([
    ["/concept-lab", "/studio/vibe-coding-lab"],
    ["/about", "/studio/digital-life"],
    ["/orbit-mono", "/studio/useful-websites"],
    ["/a-swedish-cowboy", "/studio/prompt-collection"],
    ["/wurst-price-scenario", "/studio/skill-workflow"],
    ["/the-volatile-beerprice", "/studio/photography"],
    ["/jarvaveckan", "/studio/agent-guide"],
    ["./concept-lab", "/studio/vibe-coding-lab"],
    ["./about", "/studio/digital-life"],
    ["./orbit-mono", "/studio/useful-websites"],
    ["./a-swedish-cowboy", "/studio/prompt-collection"],
    ["./wurst-price-scenario", "/studio/skill-workflow"],
    ["./the-volatile-beerprice", "/studio/photography"],
    ["./jarvaveckan", "/studio/agent-guide"],
  ]);

  const allowedPagePaths = new Set([
    "/",
    "/studio/useful-websites",
    "/studio/prompt-collection",
    "/studio/skill-workflow",
    "/studio/photography",
    "/studio/agent-guide",
    "/studio/vibe-coding-lab",
    "/studio/digital-life",
    "/prompt-template",
  ]);

  const contentEntryRules = [
    {
      route: "/studio/prompt-collection",
      patterns: [/a\s*_\s*s\s*_\s*c/i, /a\s*swedish\s*cowboy/i, /prompt\s*template/i, /prompt\s*collection/i],
    },
    {
      route: "/studio/skill-workflow",
      patterns: [/w\s*_\s*p\s*_\s*s/i, /wurst\s*price\s*scenario/i, /skill\s*library/i, /skill\s*workflow/i],
    },
    {
      route: "/studio/photography",
      patterns: [/volatile\s*beerprice/i, /the\s*volatile\s*beerprice/i, /personal\s*photography/i, /photography/i],
    },
    {
      route: "/studio/agent-guide",
      patterns: [/agent\s*工具安装/i, /各种\s*agent/i, /jarvaveckan/i, /agent\s*tool\s*guide/i],
    },
    {
      route: "/studio/useful-websites",
      patterns: [/orbit\s*mono\s*font/i, /实用网站/i, /useful\s*websites/i],
    },
  ];

  const pageChrome = new Map([
    ["/", {
      title: "FY Digital Life",
      description: "丰胖子的个人网站，聚合稳定作品、Vibe Coding 实验和数字生命入口。",
    }],
    ["/studio/useful-websites", {
      title: "FY Digital Life",
      description: "FY Studio curated useful websites and digital resource recommendations.",
    }],
    ["/studio/prompt-collection", {
      title: "FY Digital Life",
      description: "FY Studio prompt collection for visual generation and reusable creative prompts.",
    }],
    ["/studio/skill-workflow", {
      title: "FY Digital Life",
      description: "FY Studio skill and workflow collection for reusable AI production systems.",
    }],
    ["/studio/photography", {
      title: "FY Digital Life",
      description: "FY Studio personal photography showcase and visual memory archive.",
    }],
    ["/studio/agent-guide", {
      title: "FY Digital Life",
      description: "FY Studio practical guide for installing and choosing AI agent tools.",
    }],
    ["/studio/vibe-coding-lab", {
      title: "FY Digital Life",
      description: "Vibe Coding Lab is a reserved creative lab for prototypes, micro tools, and motion experiments.",
    }],
    ["/studio/digital-life", {
      title: "FY Digital Life",
      description: "FY Digital Life introduces 丰胖子, the digital-life layer, and contact entry points for the new site.",
    }],
  ]);

  const retiredTextReplacements = [
    [/a\s+swedish\s+cowboy/gi, "Prompt Collection"],
    [/wurst\s+price\s+scenario/gi, "Skill Workflow"],
    [/the\s+volatile\s+beerprice/gi, "Personal Photography"],
    [/orbit\s+mono\s+font/gi, "Useful Websites"],
    [/j[aä]rvaveckan\s+identity/gi, "Agent Guide"],
    [/j[aä]rvaveckan\s+id/gi, "Agent Guide"],
    [/j[aä]rvaveckan/gi, "Agent Guide"],
    [/gustaf[_\s.-]*furusten/gi, "FY Studio"],
  ];

  const normalizePath = (pathname) => {
    const clean = pathname.replace(/\/+$/, "");
    return clean || "/";
  };

  const normalizedHrefFor = (href) => {
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return "";

    if (href === "./" || href === ".") return "/";

    const rawPath = href.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
    if (retiredRouteTargets.has(rawPath)) return retiredRouteTargets.get(rawPath);

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return "";
    }

    if (url.origin !== window.location.origin) {
      return url.hostname.includes("linkedin.com") ? "/studio/digital-life" : "";
    }

    const path = normalizePath(url.pathname);
    return retiredRouteTargets.get(path) || "";
  };

  const classifyHref = (href) => {
    if (href === "./" || href === ".") return { kind: "allowed", href: `${window.location.origin}/` };

    const rawPath = href.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
    if (retiredRouteTargets.has(rawPath)) return { kind: "archived" };

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return { kind: "ignore" };
    }

    if (url.origin !== window.location.origin) {
      if (url.hostname.includes("linkedin.com")) {
        return { kind: "redirect", href: `${window.location.origin}/studio/digital-life` };
      }
      return { kind: "external" };
    }
    if (url.pathname.startsWith("/assets/")) return { kind: "asset" };

    const path = normalizePath(url.pathname);
    const current = normalizePath(window.location.pathname);
    if (retiredRouteTargets.has(path)) return { kind: "archived" };

    if (allowedPagePaths.has(path)) return { kind: "allowed", href: url.href };
    if (path === current && url.hash) return { kind: "same-page", href: url.href };

    return { kind: "archived" };
  };

  function routeForContentEntry(link) {
    const href = link.getAttribute("href") || "";
    const rawPath = href.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
    const canonical = retiredRouteTargets.get(rawPath);
    if (canonical && allowedPagePaths.has(canonical)) return canonical;

    const text = (link.textContent || "").replace(/\s+/g, " ").trim();
    if (!text) return "";

    const match = contentEntryRules.find((rule) => rule.patterns.some((pattern) => pattern.test(text)));
    return match?.route || "";
  }

  function normalizeContentEntryLinks(root = document) {
    root.querySelectorAll?.('a[href], a[data-site-archived="true"]').forEach((link) => {
      const canonicalHref = normalizedHrefFor(link.getAttribute("href") || "");
      if (canonicalHref) {
        link.setAttribute("href", canonicalHref);
        link.removeAttribute("data-site-archived");
        link.dataset.siteCanonicalRoute = canonicalHref;
        return;
      }

      const route = routeForContentEntry(link);
      if (!route) return;
      link.setAttribute("href", route);
      link.removeAttribute("data-site-archived");
      link.dataset.siteCanonicalRoute = route;
    });
  }

  function normalizeRetiredText(root = document) {
    const scope = root.nodeType === Node.DOCUMENT_NODE ? root.body : root;
    if (!scope) return;

    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
        if (parent.closest("script, style, noscript, textarea, pre, code")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const current = node.nodeValue || "";
      const next = retiredTextReplacements.reduce(
        (value, [pattern, replacement]) => value.replace(pattern, replacement),
        current,
      );
      if (next !== current) node.nodeValue = next;
    });
  }

  function normalizePrimaryNavigation(root = document) {
    const replaceLinkText = (link, nextText) => {
      const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      const target = nodes.find((node) => node.nodeValue?.trim());
      if (target) target.nodeValue = target.nodeValue.replace(/主页|Home/i, nextText);
      else link.setAttribute("aria-label", nextText);
    };

    root.querySelectorAll?.("a[href]").forEach((link) => {
      const href = link.getAttribute("href") || "";
      const text = (link.textContent || "").replace(/\s+/g, " ").trim();
      const path = (() => {
        try {
          return normalizePath(new URL(href, window.location.href).pathname);
        } catch {
          return href.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
        }
      })();

      if (path === "/studio/digital-life" || path === "/about") {
        link.setAttribute("href", "/studio/digital-life");
        return;
      }

      if (path === "/" && /^(主页|Home)$/i.test(text)) {
        replaceLinkText(link, "首页");
      }

      const isRemovedNavItem =
        path === "/studio/vibe-coding-lab" ||
        path === "/work" ||
        path === "/concept-lab" ||
        /^(作品|实验区|Work|Lab|Concept Lab)$/i.test(text);

      if (!isRemovedNavItem) return;

      const navLikeParent = link.closest("nav, header, [data-framer-name*='Nav'], [data-framer-name*='nav'], [data-framer-name*='Menu'], [data-framer-name*='menu']");
      const compactText = text.replace(/\s+/g, "");
      if (navLikeParent || /^(作品|实验区|Work|Lab|ConceptLab)$/i.test(compactText)) {
        link.style.setProperty("display", "none", "important");
        link.setAttribute("aria-hidden", "true");
        link.setAttribute("tabindex", "-1");
      }
    });
  }

  function ensureModalStyles() {
    if (document.getElementById("site-route-guard-style")) return;

    const style = document.createElement("style");
    style.id = "site-route-guard-style";
    style.textContent = `
      .site-route-modal {
        align-items: center;
        background: rgba(5, 5, 5, 0.54);
        display: none;
        inset: 0;
        justify-content: center;
        padding: 20px;
        position: fixed;
        z-index: 10000;
      }

      .site-route-modal.is-open {
        display: flex;
      }

      .site-route-modal__panel {
        background: var(--token-26053b4a-f306-4fd1-996f-6d79fd5f13e3, #f4f4f4);
        color: var(--token-12ee3e6d-9f3d-4108-9f6a-d72af1339d46, #404040);
        font-family: "Switzer", "Switzer Placeholder", sans-serif;
        max-width: 520px;
        padding: 22px;
        position: relative;
        text-transform: uppercase;
        width: min(100%, 520px);
      }

      .site-route-modal__eyebrow,
      .site-route-modal__close {
        font-family: "Doto Rounded Bold", "Doto Rounded Bold Placeholder", sans-serif;
        font-weight: 700;
      }

      .site-route-modal__eyebrow {
        color: var(--token-648d07ba-0cee-4673-90d9-650fc59b1a1f, #055dff);
        font-size: 12px;
      }

      .site-route-modal__title {
        font-family: "Orbit Mono Regular", "Orbit Mono Regular Placeholder", monospace;
        font-size: clamp(30px, 7vw, 58px);
        font-weight: 400;
        letter-spacing: 0;
        line-height: 1;
        margin: 48px 44px 20px 0;
      }

      .site-route-modal__copy {
        color: rgba(64, 64, 64, 0.76);
        font-size: 13px;
        line-height: 1.5;
      }

      .site-route-modal__close {
        appearance: none;
        background: transparent;
        border: 1px solid rgba(64, 64, 64, 0.25);
        color: inherit;
        cursor: pointer;
        height: 38px;
        line-height: 1;
        position: absolute;
        right: 22px;
        top: 22px;
        width: 38px;
      }

      body.site-route-modal-open {
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureModal() {
    ensureModalStyles();
    let modal = document.querySelector(".site-route-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.className = "site-route-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "site-route-modal-title");
    modal.innerHTML = `
      <div class="site-route-modal__panel" role="document">
        <button class="site-route-modal__close" type="button" aria-label="Close">×</button>
        <div class="site-route-modal__eyebrow">Archived route</div>
        <h2 class="site-route-modal__title" id="site-route-modal-title">Still in the archive</h2>
        <p class="site-route-modal__copy">This old Framer page is kept only as a private reference. New work needs a new studio route before it opens here.</p>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest(".site-route-modal__close")) closeArchiveModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeArchiveModal();
    });

    return modal;
  }

  function openArchiveModal() {
    const modal = ensureModal();
    modal.classList.add("is-open");
    document.body.classList.add("site-route-modal-open");
    modal.querySelector(".site-route-modal__close")?.focus();
  }

  function closeArchiveModal() {
    const modal = document.querySelector(".site-route-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("site-route-modal-open");
  }

  function intercept(event) {
    const link = event.target?.closest?.("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    const contentRoute = routeForContentEntry(link);
    if (contentRoute) {
      link.setAttribute("href", contentRoute);
      link.removeAttribute("data-site-archived");
      if (href !== contentRoute || normalizePath(window.location.pathname) !== contentRoute) {
        document.documentElement.dataset.siteRouteGuardLast = "content-redirect";
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        window.location.assign(contentRoute);
      }
      return;
    }

    if (href === "#archived-project" || link.dataset.siteArchived === "true") {
      document.documentElement.dataset.siteRouteGuardLast = "archived";
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      openArchiveModal();
      return;
    }

    const result = classifyHref(href);
    document.documentElement.dataset.siteRouteGuardLast = result.kind;
    if (result.kind === "redirect") {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      window.location.assign(result.href);
      return;
    }

    if (result.kind === "allowed" && result.href) {
      const target = new URL(result.href);
      if (normalizePath(target.pathname) !== normalizePath(window.location.pathname)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        window.location.assign(result.href);
      }
      return;
    }

    if (result.kind === "archived") {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      openArchiveModal();
    }
  }

  function setPageChrome() {
    const chrome = pageChrome.get(normalizePath(window.location.pathname));
    if (!chrome) return;

    document.title = chrome.title;
    document
      .querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]')
      .forEach((meta) => meta.setAttribute("content", chrome.title));
    document
      .querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]')
      .forEach((meta) => meta.setAttribute("content", chrome.description));
  }

  function observeRouteMutations() {
    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(() => {
        pending = false;
        normalizeContentEntryLinks();
        normalizePrimaryNavigation();
        normalizeRetiredText();
        removeWideFramerLineArtifacts();
      });
    };

    new MutationObserver(schedule).observe(document.documentElement, {
      attributeFilter: ["href", "data-site-archived"],
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
  }

  function removeWideFramerLineArtifacts(root = document) {
    const path = normalizePath(window.location.pathname);
    if (!path.startsWith("/studio/")) return;

    root.querySelectorAll?.('[data-framer-component-type="SVG"]').forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.width > 12 || rect.height < 240) return;

      const hasOnlyLineSvg = node.querySelector(".svgContainer svg");
      if (!hasOnlyLineSvg) return;

      node.style.setProperty("display", "none", "important");
      node.setAttribute("aria-hidden", "true");
      node.dataset.siteHiddenWideLine = "true";
    });
  }

  function boot() {
    document.documentElement.dataset.siteRouteGuard = "active";
    normalizeContentEntryLinks();
    normalizePrimaryNavigation();
    normalizeRetiredText();
    removeWideFramerLineArtifacts();
    observeRouteMutations();
    window.addEventListener("site:open-archive-modal", () => openArchiveModal());
    ["pointerdown", "mousedown", "click", "auxclick"].forEach((type) => {
      window.addEventListener(type, intercept, true);
      document.addEventListener(type, intercept, true);
    });
    setPageChrome();
    [120, 480, 1200, 2400, 4200, 7000].forEach((delay) => {
      window.setTimeout(setPageChrome, delay);
      window.setTimeout(normalizeContentEntryLinks, delay);
      window.setTimeout(normalizePrimaryNavigation, delay);
      window.setTimeout(normalizeRetiredText, delay);
      window.setTimeout(removeWideFramerLineArtifacts, delay);
    });
  }

  window.SiteRouteGuard = {
    classifyHref,
    closeArchiveModal,
    normalizeContentEntryLinks,
    normalizePrimaryNavigation,
    openArchiveModal,
    removeWideFramerLineArtifacts,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
