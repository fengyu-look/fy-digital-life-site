(() => {
  const retiredRouteTargets = new Map([
    ["/about", "/studio/digital-life"],
    ["/orbit-mono", "/studio/useful-websites"],
    ["/a-swedish-cowboy", "/studio/prompt-collection"],
    ["/wurst-price-scenario", "/studio/skill-workflow"],
    ["/the-volatile-beerprice", "/studio/photography"],
    ["/jarvaveckan", "/studio/agent-guide"],
    ["./about", "/studio/digital-life"],
    ["./orbit-mono", "/studio/useful-websites"],
    ["./a-swedish-cowboy", "/studio/prompt-collection"],
    ["./wurst-price-scenario", "/studio/skill-workflow"],
    ["./the-volatile-beerprice", "/studio/photography"],
    ["./jarvaveckan", "/studio/agent-guide"],
  ]);

  const legacySiteHosts = new Set([
    "fengyu-look.github.io",
    "www.fengyu-look.github.io",
    "127.0.0.1",
    "localhost",
  ]);

  const allowedPagePaths = new Set([
    "/",
    "/studio/useful-websites",
    "/studio/prompt-collection",
    "/studio/skill-workflow",
    "/studio/photography",
    "/studio/agent-guide",
    "/studio/digital-life",
    "/concept-lab",
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
      description: "丰胖子的个人网站，聚合稳定作品、AI 推荐和数字生命入口。",
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
    ["/studio/digital-life", {
      title: "FY Digital Life",
      description: "FY Digital Life introduces 丰胖子, the digital-life layer, and contact entry points for the new site.",
    }],
    ["/concept-lab", {
      title: "FY Digital Life",
      description: "FY Digital Life concept lab for experimental prototypes and visual work-in-progress notes.",
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

    const path = normalizePath(url.pathname);
    const retiredTarget = retiredRouteTargets.get(path);
    if (retiredTarget && (url.origin === window.location.origin || legacySiteHosts.has(url.hostname))) {
      return retiredTarget;
    }

    if (url.origin !== window.location.origin) {
      return url.hostname.includes("linkedin.com") ? "/studio/digital-life" : "";
    }

    return retiredRouteTargets.get(path) || "";
  };

  const classifyHref = (href) => {
    if (href === "./" || href === ".") return { kind: "allowed", href: `${window.location.origin}/` };

    const rawPath = href.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
    const rawRetiredTarget = retiredRouteTargets.get(rawPath);
    if (rawRetiredTarget) return { kind: "redirect", href: `${window.location.origin}${rawRetiredTarget}` };

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return { kind: "ignore" };
    }

    const path = normalizePath(url.pathname);
    const retiredTarget = retiredRouteTargets.get(path);
    if (retiredTarget && (url.origin === window.location.origin || legacySiteHosts.has(url.hostname))) {
      return { kind: "redirect", href: `${window.location.origin}${retiredTarget}` };
    }

    if (url.origin !== window.location.origin) {
      if (url.hostname.includes("linkedin.com")) {
        return { kind: "redirect", href: `${window.location.origin}/studio/digital-life` };
      }
      return { kind: "external" };
    }
    if (url.pathname.startsWith("/assets/")) return { kind: "asset" };

    const current = normalizePath(window.location.pathname);

    if (allowedPagePaths.has(path)) return { kind: "allowed", href: url.href };
    if (path === current && url.hash) return { kind: "same-page", href: url.href };

    return { kind: "unknown" };
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
        path === "/work" ||
        /^(作品|Work)$/i.test(text);

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

  function redirectAwayFromArchivedRoute(fallbackRoute = "/") {
    const nextRoute = allowedPagePaths.has(fallbackRoute) ? fallbackRoute : "/";
    document.documentElement.dataset.siteRouteGuardLast = "archived-redirect";
    window.location.assign(nextRoute);
  }

  function openArchiveModal() {
    document.documentElement.dataset.siteRouteGuardLast = "archived-ignored";
  }

  function closeArchiveModal() {
    document.documentElement.dataset.siteRouteGuardLast = "archived-closed";
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
      const fallbackRoute = routeForContentEntry(link) || "/";
      document.documentElement.dataset.siteRouteGuardLast = fallbackRoute === "/" ? "archived-ignored" : "archived-redirect";
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      if (fallbackRoute !== "/") redirectAwayFromArchivedRoute(fallbackRoute);
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

    if (result.kind === "unknown") {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
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
    window.addEventListener("site:open-archive-modal", (event) => {
      event.preventDefault?.();
      openArchiveModal();
    });
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
    redirectAwayFromArchivedRoute,
    removeWideFramerLineArtifacts,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
