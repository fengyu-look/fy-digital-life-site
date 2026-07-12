(() => {
  const promptCards = [
    {
      title: "Prompt Name 01",
      description: "一句话说明这个文生图提示词适合生成什么画面。",
      meta: "TEXT TO IMAGE",
      image: "/assets/custom/latest-work-card.png",
      prompt: "这里替换成你的完整文生图提示词原文。"
    },
    {
      title: "Prompt Name 02",
      description: "适合放镜头语言、主体、光线、质感和风格要求。",
      meta: "TEXT TO VIDEO",
      image: "/assets/custom/work-card-prompt-lite.mp4",
      prompt: "这里替换成你的完整文生视频提示词原文。"
    },
    {
      title: "Prompt Name 03",
      description: "用于图生图改造时，写清保留内容和变化方向。",
      meta: "IMAGE TO IMAGE",
      image: "/assets/custom/about-card-cyber-20260704.png",
      prompt: "这里替换成你的完整图生图提示词原文。"
    },
    {
      title: "Prompt Name 04",
      description: "可以放产品海报、人物设定或场景氛围类提示词。",
      meta: "STYLE / POSTER",
      image: "/assets/custom/ai-slogan-card.png",
      prompt: "这里替换成你的完整风格化生成提示词原文。"
    },
    {
      title: "Prompt Name 05",
      description: "适合收藏你常用的高成功率视觉提示词模板。",
      meta: "REFERENCE / DAILY",
      image: "/assets/custom/about-card-portrait-crop-20260704.png",
      prompt: "这里替换成你的完整参考图或日常生成提示词原文。"
    },
    {
      title: "Prompt Name 06",
      description: "后续复制这一张卡片，替换封面、标题和提示词。",
      meta: "TEMPLATE / SAVE",
      image: "/assets/custom/work-card-skill-lite.mp4",
      prompt: "这里替换成你的完整提示词模板原文。"
    }
  ];

  function ensureStylesheet() {
    if (document.querySelector('link[href*="prompt-collection.css"]')) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/custom/prompt-collection.css?v=20260710c";
    document.head.appendChild(link);
  }

  function setText(parent, selector, value) {
    const node = parent.querySelector(selector);
    if (node) node.textContent = value;
  }

  function mediaFor(card) {
    const wrap = document.createElement("div");
    wrap.className = "prompt-card__media";

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

  function copyText(text) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
  }

  function mapContentItem(item) {
    const data = item.data || {};
    return {
      title: item.title,
      description: item.summary || "",
      meta: item.category || data.prompt_type || "PROMPT",
      image: item.cover_url || "/assets/custom/latest-work-card.png",
      prompt: data.prompt || "",
      copyLabel: data.copy_button_label || "点击复制",
    };
  }

  function buildCard(card) {
    const article = document.createElement("article");
    article.className = "prompt-card";

    const body = document.createElement("div");
    body.className = "prompt-card__body";
    body.innerHTML = `
      <div class="prompt-card__meta"></div>
      <div class="prompt-card__title"></div>
      <p class="prompt-card__description"></p>
      <button class="prompt-card__copy" type="button" aria-label="点击复制提示词">点击复制</button>
    `;

    setText(body, ".prompt-card__meta", card.meta);
    setText(body, ".prompt-card__title", card.title);
    setText(body, ".prompt-card__description", card.description);
    setText(body, ".prompt-card__copy", card.copyLabel || "点击复制");

    const button = body.querySelector(".prompt-card__copy");
    button.addEventListener("click", async () => {
      const original = button.textContent;
      try {
        await copyText(card.prompt);
        button.textContent = "已复制";
      } catch {
        button.textContent = "复制失败";
      }
      window.setTimeout(() => {
        button.textContent = original;
      }, 1400);
    });

    article.appendChild(mediaFor(card));
    article.appendChild(body);
    return article;
  }

  function renderCards(grid, items) {
    grid.innerHTML = "";
    items.forEach((card) => grid.appendChild(buildCard(card)));
  }

  async function hydrateContent(section) {
    if (!section || section.dataset.contentHydrated === "true" || section.dataset.contentHydrating === "true") return;
    section.dataset.contentHydrating = "true";

    try {
      const { fetchPublishedContentItems } = await import("/assets/custom/content-api.js?v=20260711a");
      const items = await fetchPublishedContentItems("prompt-collection");
      if (!items.length) return;

      const grid = section.querySelector(".prompt-recommendations__grid");
      if (!grid) return;
      renderCards(grid, items.map(mapContentItem));
      revealCards(section);
      section.dataset.contentHydrated = "true";
    } catch (error) {
      console.warn("[FY Content] prompt-collection fallback content used:", error);
    } finally {
      delete section.dataset.contentHydrating;
    }
  }

  function buildSection() {
    const section = document.createElement("section");
    section.className = "prompt-recommendations";
    section.setAttribute("aria-label", "提示词推荐");

    const inner = document.createElement("div");
    inner.className = "prompt-recommendations__inner";
    inner.innerHTML = `
      <div class="prompt-recommendations__label">PROMPT COLLECTION</div>
      <div class="prompt-recommendations__intro">
        <h1 class="prompt-recommendations__title">提示词宇宙</h1>
        <p class="prompt-recommendations__copy">这里收藏文生图、文生视频与图生图提示词。每一张卡片都可以替换成新的封面、标题、说明和提示词原文，点击复制就能带走完整灵感。</p>
      </div>
      <div class="prompt-recommendations__grid"></div>
    `;

    const grid = inner.querySelector(".prompt-recommendations__grid");
    promptCards.forEach((card) => grid.appendChild(buildCard(card)));
    section.appendChild(inner);
    return section;
  }

  function normalizeBreadcrumb() {
    const breadcrumb = document.querySelector('[data-framer-name="breadcrumb"]');
    if (!breadcrumb) return;

    const textNodes = [];
    const walker = document.createTreeWalker(breadcrumb, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    const words = ["FY", "/", "Prompt Collection"];
    textNodes.forEach((node, index) => {
      const value = node.nodeValue || "";
      node.nodeValue = index < words.length ? value.replace(value.trim(), words[index]) : "";
    });
  }

  function normalizeHomeLinks() {
    document.querySelectorAll("a").forEach((link) => {
      if (link.textContent.trim() !== "主页") return;
      link.setAttribute("href", "/");
      if (link.dataset.promptHomeFixed === "true") return;
      link.dataset.promptHomeFixed = "true";
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
      if (link.dataset.promptFooterTextOnly === "true") return;

      const textOnly = document.createElement("div");
      Array.from(link.attributes).forEach((attribute) => {
        if (["href", "target", "rel"].includes(attribute.name)) return;
        textOnly.setAttribute(attribute.name, attribute.value);
      });
      textOnly.classList.add("prompt-footer-text-only");
      textOnly.dataset.promptFooterTextOnly = "true";
      textOnly.innerHTML = link.innerHTML;
      link.replaceWith(textOnly);
    });
  }

  function revealCards(section) {
    const items = Array.from(section.querySelectorAll(".prompt-card"));
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
      item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
      observer.observe(item);
    });
  }

  function init() {
    ensureStylesheet();
    document.documentElement.classList.add("prompt-recommendations-page");
    normalizeBreadcrumb();
    normalizeHomeLinks();
    normalizeFooterWechatText();

    const existingSection = document.querySelector(".prompt-recommendations");
    if (existingSection) {
      hydrateContent(existingSection);
      return true;
    }

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
        const section = document.querySelector(".prompt-recommendations");
        if (section) {
          hydrateContent(section);
          return;
        }
        init();
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
