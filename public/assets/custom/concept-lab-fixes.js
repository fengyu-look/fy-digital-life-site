(() => {
  const isConceptLab = () => {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    return path === "/concept-lab";
  };

  if (!isConceptLab()) return;

  const textReplacements = [
    [/点击查看/g, "仅展示"],
  ];

  const staticCardLabels = [
    "PLINK SYNTHESIZERS",
    "CONCEPT MIDI MIXER",
  ];

  const normalizeText = (value) => value.replace(/\s+/g, " ").trim().toUpperCase();
  const compactText = (value) => normalizeText(value).replace(/[\s[\]]+/g, "");
  const splitSpanReplacements = [
    [/^点击查看$/, "仅展示"],
  ];

  function replaceText(root = document) {
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
      const next = textReplacements.reduce(
        (value, [pattern, replacement]) => value.replace(pattern, replacement),
        current,
      );
      if (next !== current) node.nodeValue = next;
    });
  }

  function replaceSplitSpanText(root = document) {
    const groups = new Map();
    root.querySelectorAll?.("span[class*='-span-']").forEach((span) => {
      const key = String(span.className || "").split(/\s+/).find((name) => /-span-/.test(name));
      if (!key) return;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(span);
    });

    groups.forEach((spans) => {
      const joined = spans.map((span) => span.textContent || "").join("");
      const compact = compactText(joined);
      const match = splitSpanReplacements.find(([pattern]) => pattern.test(compact));
      if (!match) return;

      const replacement = match[1];
      const [first, ...rest] = spans;
      first.textContent = replacement;
      first.dataset.conceptLabTextReplacement = "true";
      rest.forEach((span) => {
        span.textContent = "";
        span.style.setProperty("display", "none", "important");
        span.setAttribute("aria-hidden", "true");
      });
    });
  }

  function makeStaticCards(root = document) {
    root.querySelectorAll?.("a[href], a.concept-lab-card-static").forEach((link) => {
      const cardText = normalizeText(link.textContent || "");
      const shouldDisable = staticCardLabels.some((label) => cardText.includes(label));
      if (!shouldDisable) return;

      link.classList.add("concept-lab-card-static");
      link.removeAttribute("href");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.setAttribute("role", "group");
      link.setAttribute("aria-label", `${link.textContent?.replace(/\s+/g, " ").trim() || "Concept card"}，仅展示`);
      link.dataset.conceptLabStatic = "true";

      link.addEventListener("click", stopStaticCardOpen, true);
      link.addEventListener("auxclick", stopStaticCardOpen, true);
      link.addEventListener("pointerup", stopStaticCardOpen, true);

      replaceText(link);
      replaceStaticCardButtonText(link);
    });
  }

  function replaceStaticCardButtonText(card) {
    card.querySelectorAll("p, span, div").forEach((node) => {
      if (!/点击查看/.test(node.textContent || "")) return;
      node.textContent = (node.textContent || "").replace(/点击查看/g, "仅展示");
    });
  }

  function stopStaticCardOpen(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
  }

  function simplifyPrimaryShareCard(root = document) {
    const card = root.querySelector?.("a[href='/studio/useful-websites'], a[href='/studio/useful-websites/']");
    if (!card) return;

    card.classList.add("concept-lab-share-card");

    const title = card.querySelector(".framer-1vpvbga-container");
    if (title && title.dataset.conceptLabShareTitle !== "true") {
      title.textContent = "网页分享";
      title.dataset.conceptLabShareTitle = "true";
      title.classList.add("concept-lab-share-title");
    }

    [
      ".framer-ljloi8-container",
      ".framer-1w7hxra",
    ].forEach((selector) => {
      card.querySelectorAll(selector).forEach((node) => {
        node.classList.add("concept-lab-share-meta-hidden");
        node.setAttribute("aria-hidden", "true");
      });
    });
  }

  function apply() {
    document.documentElement.classList.add("concept-lab-page");
    replaceText();
    replaceSplitSpanText();
    simplifyPrimaryShareCard();
    makeStaticCards();
  }

  function observe() {
    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(() => {
        pending = false;
        apply();
      });
    };

    new MutationObserver(schedule).observe(document.documentElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      apply();
      observe();
    }, { once: true });
  } else {
    apply();
    observe();
  }

  [120, 480, 1200, 2400, 4200].forEach((delay) => window.setTimeout(apply, delay));
})();
