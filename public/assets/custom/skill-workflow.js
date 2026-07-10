(() => {
  const skillCards = [
    {
      type: "SKILL",
      title: "Skill Name 01",
      description: "这里写这个 Skill 解决什么问题、适合谁用、能提升哪一类工作效率。后续可以替换成真实 GitHub Skill 的介绍。",
      meta: "CONTENT / AUTOMATION",
      image: "/assets/custom/work-card-skill-web.mp4",
      includes: ["skill-name"],
      url: "https://github.com/your-name/your-skill"
    },
    {
      type: "SKILL",
      title: "Skill Name 02",
      description: "这里可以写更长一点的说明，比如它适合创作、研究、整理资料还是自动化执行，帮助访客快速判断是否需要收藏。",
      meta: "RESEARCH / TOOLING",
      image: "/assets/custom/about-card-cyber-20260704.png",
      includes: ["skill-name"],
      url: "https://github.com/your-name/your-skill"
    },
    {
      type: "WORKFLOW",
      title: "Workflow Name 01",
      description: "这里写这套工作流适合什么场景，以及多个 Skill 串起来后能完成什么结果。比如从选题、资料整理到成稿发布的一整套流程。",
      meta: "RESEARCH / WRITING",
      image: "/assets/custom/work-card-prompt-web.mp4",
      includes: ["dbs-content", "content-research-writer", "stop-slop"],
      url: "https://github.com/your-name/workflow-readme"
    },
    {
      type: "WORKFLOW",
      title: "Workflow Name 02",
      description: "这里可以放一套更偏生产力的组合方法，说明每个 Skill 在流程里的位置，让网友知道它不是单点工具，而是一套可复用路径。",
      meta: "PRODUCTION / SYSTEM",
      image: "/assets/custom/latest-work-card.png",
      includes: ["skill-a", "skill-b", "skill-c"],
      url: "https://github.com/your-name/workflow-readme"
    }
  ];

  function ensureStylesheet() {
    if (document.querySelector('link[href*="skill-workflow.css"]')) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/custom/skill-workflow.css?v=20260706a";
    document.head.appendChild(link);
  }

  function setText(parent, selector, value) {
    const node = parent.querySelector(selector);
    if (node) node.textContent = value;
  }

  function mediaFor(card) {
    const wrap = document.createElement("div");
    wrap.className = "skill-card__media";

    if (card.image.endsWith(".mp4")) {
      const video = document.createElement("video");
      video.src = card.image;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("aria-label", "");
      wrap.appendChild(video);
      return wrap;
    }

    const image = document.createElement("img");
    image.src = card.image;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    wrap.appendChild(image);
    return wrap;
  }

  function listFrom(value) {
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (typeof value !== "string") return [];
    return value
      .split(/[,，\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function textFrom(value) {
    if (Array.isArray(value)) return value.filter(Boolean).join(" ");
    return value || "";
  }

  function mapContentItem(item) {
    const data = item.data || {};
    const type = data.skill_type || item.item_type || "SKILL";
    return {
      type: String(type).toUpperCase(),
      title: item.title,
      description: textFrom(data.use_cases) || item.summary || "",
      meta: item.category || data.applicable_scene || "SKILL / WORKFLOW",
      image: item.cover_url || "/assets/custom/work-card-skill-web.mp4",
      includes: listFrom(data.includes).length ? listFrom(data.includes) : listFrom(item.tags),
      url: item.link_url || "#",
      linkLabel: data.button_label || (String(type).toUpperCase() === "WORKFLOW" ? "VIEW WORKFLOW" : "VIEW ON GITHUB"),
    };
  }

  function buildCard(card) {
    const article = document.createElement("article");
    article.className = "skill-card";

    const body = document.createElement("div");
    body.className = "skill-card__body";
    body.innerHTML = `
      <div class="skill-card__topline">
        <div class="skill-card__meta"></div>
        <div class="skill-card__type"></div>
      </div>
      <div class="skill-card__title"></div>
      <p class="skill-card__description"></p>
      <div class="skill-card__includes">
        <span class="skill-card__includes-label">INCLUDES</span>
        <div class="skill-card__chips"></div>
      </div>
      <a class="skill-card__link" target="_blank" rel="noopener"></a>
    `;

    setText(body, ".skill-card__meta", card.meta);
    setText(body, ".skill-card__type", card.type);
    setText(body, ".skill-card__title", card.title);
    setText(body, ".skill-card__description", card.description);

    const chips = body.querySelector(".skill-card__chips");
    card.includes.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "skill-card__chip";
      chip.textContent = item;
      chips.appendChild(chip);
    });

    const link = body.querySelector(".skill-card__link");
    link.href = card.url;
    link.textContent = card.linkLabel || (card.type === "WORKFLOW" ? "VIEW WORKFLOW" : "VIEW ON GITHUB");

    article.appendChild(mediaFor(card));
    article.appendChild(body);
    return article;
  }

  function renderCards(grid, items) {
    grid.innerHTML = "";
    items.forEach((card) => grid.appendChild(buildCard(card)));
  }

  async function hydrateContent(section) {
    try {
      const { fetchPublishedContentItems } = await import("/assets/custom/content-api.js?v=20260708a");
      const items = await fetchPublishedContentItems("skill-workflow");
      if (!items.length) return;

      const grid = section.querySelector(".skill-recommendations__grid");
      if (!grid) return;
      renderCards(grid, items.map(mapContentItem));
      revealCards(section);
    } catch (error) {
      console.warn("[FY Content] skill-workflow fallback content used:", error);
    }
  }

  function buildSection() {
    const section = document.createElement("section");
    section.className = "skill-recommendations";
    section.setAttribute("aria-label", "Skill and Workflow 工具箱");

    const inner = document.createElement("div");
    inner.className = "skill-recommendations__inner";
    inner.innerHTML = `
      <div class="skill-recommendations__label">SKILL / WORKFLOW</div>
      <div class="skill-recommendations__intro">
        <h1 class="skill-recommendations__title">Skill 工具箱</h1>
        <p class="skill-recommendations__copy">这里收藏我常用的 Skill 与组合工作流。单个 Skill 解决具体问题，Workflow 则把多个 Skill 串成一套可复用的方法。</p>
      </div>
      <div class="skill-recommendations__grid"></div>
    `;

    const grid = inner.querySelector(".skill-recommendations__grid");
    skillCards.forEach((card) => grid.appendChild(buildCard(card)));
    section.appendChild(inner);
    return section;
  }

  function normalizeBreadcrumb() {
    const breadcrumb = document.querySelector('[data-framer-name="breadcrumb"]');
    if (!breadcrumb) return;

    const textNodes = [];
    const walker = document.createTreeWalker(breadcrumb, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    const words = ["FY", "/", "Skill Workflow"];
    textNodes.forEach((node, index) => {
      const value = node.nodeValue || "";
      node.nodeValue = index < words.length ? value.replace(value.trim(), words[index]) : "";
    });
  }

  function normalizeHomeLinks() {
    document.querySelectorAll("a").forEach((link) => {
      if (link.textContent.trim() !== "主页") return;
      link.setAttribute("href", "/");
      if (link.dataset.skillHomeFixed === "true") return;
      link.dataset.skillHomeFixed = "true";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.location.assign("/");
      }, true);
    });
  }

  function normalizeFooterWechatText() {
    document.querySelectorAll("a").forEach((link) => {
      if (!link.textContent.includes("数字生命丰胖子")) return;
      if (link.dataset.skillFooterTextOnly === "true") return;

      const textOnly = document.createElement("div");
      Array.from(link.attributes).forEach((attribute) => {
        if (["href", "target", "rel"].includes(attribute.name)) return;
        textOnly.setAttribute(attribute.name, attribute.value);
      });
      textOnly.classList.add("skill-footer-text-only");
      textOnly.dataset.skillFooterTextOnly = "true";
      textOnly.innerHTML = link.innerHTML;
      link.replaceWith(textOnly);
    });
  }

  function revealCards(section) {
    const items = Array.from(section.querySelectorAll(".skill-card"));
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });

    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
      observer.observe(item);
    });
  }

  function init() {
    ensureStylesheet();
    document.documentElement.classList.add("skill-recommendations-page");
    normalizeBreadcrumb();
    normalizeHomeLinks();
    normalizeFooterWechatText();

    if (document.querySelector(".skill-recommendations")) return true;

    const header = document.querySelector('[data-framer-name="case-header"]');
    const fallback = document.querySelector('[data-framer-name="Video Case Section"]');
    const anchor = header || fallback;
    if (!anchor?.parentNode) return false;

    const section = buildSection();
    anchor.parentNode.insertBefore(section, anchor.nextSibling);
    revealCards(section);
    hydrateContent(section);
    return true;
  }

  function scheduleInit() {
    init();
    [120, 480, 1200, 2400].forEach((delay) => window.setTimeout(init, delay));

    if ("MutationObserver" in window) {
      const observer = new MutationObserver(() => {
        normalizeFooterWechatText();
        if (!document.querySelector(".skill-recommendations")) init();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      window.setTimeout(() => observer.disconnect(), 5000);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleInit, { once: true });
  } else {
    scheduleInit();
  }
})();
