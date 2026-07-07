(() => {
  const cards = [
    {
      title: "Tool Name 01",
      description: "一句话写清楚这个网站最适合解决什么问题。",
      href: "https://example.com",
      image: "/assets/custom/latest-work-card.png",
      meta: "AI / PRODUCTIVITY",
    },
    {
      title: "Tool Name 02",
      description: "适合放你想推荐给网友的实用网站说明。",
      href: "https://example.com",
      image: "/assets/custom/ai-slogan-card.png",
      meta: "DESIGN / IDEA",
    },
    {
      title: "Tool Name 03",
      description: "这里可以替换成价格、用途或一句推荐理由。",
      href: "https://example.com",
      image: "/assets/custom/about-card-cyber-20260704.png",
      meta: "WEB / RESOURCE",
    },
    {
      title: "Tool Name 04",
      description: "后续复制这一张卡片，替换文字、图片和链接。",
      href: "https://example.com",
      image: "/assets/custom/work-card-photo-web.mp4",
      meta: "REFERENCE / DAILY",
    },
    {
      title: "Tool Name 05",
      description: "保持短句，整个页面会更像作品集里的推荐清单。",
      href: "https://example.com",
      image: "/assets/custom/about-card-portrait-crop-20260704.png",
      meta: "CREATIVE / TOOL",
    },
    {
      title: "Tool Name 06",
      description: "如果没有图片，可以先换成统一风格的封面图。",
      href: "https://example.com",
      image: "/assets/custom/work-card-skill-web.mp4",
      meta: "LEARN / SAVE",
    },
  ];
  const featureImage = cards[4].image;

  function ensureStylesheet() {
    if (document.querySelector('link[href*="useful-websites.css"]')) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/custom/useful-websites.css?v=20260706a";
    document.head.appendChild(link);
  }

  function mediaFor(card) {
    if (card.image.endsWith(".mp4")) {
      return `<video src="${card.image}" autoplay muted loop playsinline preload="metadata" aria-label=""></video>`;
    }

    return `<img src="${card.image}" alt="" loading="lazy" decoding="async">`;
  }

  function buildSection() {
    const section = document.createElement("section");
    section.className = "orbit-recommendations";
    section.setAttribute("aria-label", "实用网站推荐");
    section.innerHTML = `
      <div class="orbit-recommendations__inner">
        <div class="orbit-recommendations__label">CURATED LINKS</div>
        <div class="orbit-recommendations__intro">
          <h1 class="orbit-recommendations__title">超级链接宇宙</h1>
          <p class="orbit-recommendations__copy">数字世界的浩瀚星河里，我们为你打捞那些真正闪光的岛屿。这里不只是链接的汇聚，更是高效、灵感与审美的共鸣地。打破信息的冗余，每一次点击，都是一场关于卓越的探索。</p>
        </div>
        <div class="orbit-recommendations__grid">
          ${cards.map((card) => `
            <a class="orbit-card" href="${card.href}" target="_blank" rel="noopener noreferrer">
              <div class="orbit-card__media">${mediaFor(card)}</div>
              <div class="orbit-card__body">
                <div class="orbit-card__meta">${card.meta}</div>
                <div class="orbit-card__title">${card.title}</div>
                <p class="orbit-card__description">${card.description}</p>
                <span class="orbit-card__link">VISIT SITE</span>
              </div>
            </a>
          `).join("")}
        </div>
      </div>
    `;
    return section;
  }

  function replaceHeaderText(root) {
    const replacements = new Map([
      ["Try Orbit mono", "实用网站推荐"],
      ["Typography", "Curated Links"],
      ["typography", "curated links"],
      ["ORBIT MONO", "推荐链接"],
      ["Orbit mono", "实用网站"],
      ["Orbit Mono", "实用网站"],
      ["lab", "FY"],
      ["Lab", "FY"],
      ["LAB", "FY"],
      ["Custom type orbit mono", "Useful Websites You Need to Know"],
      ["CUSTOM TYPE ORBIT MONO", "Useful Websites You Need to Know"],
    ]);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const value = node.nodeValue;
      const next = replacements.get(value.trim());
      if (next) node.nodeValue = value.replace(value.trim(), next);
    });
  }

  function normalizeBreadcrumb() {
    const breadcrumb = document.querySelector('[data-framer-name="breadcrumb"]');
    if (!breadcrumb) return;

    const textNodes = [];
    const walker = document.createTreeWalker(breadcrumb, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    const words = ["FY", "/", "Useful Websites You Need to Know"];
    textNodes.forEach((node, index) => {
      if (index >= words.length) {
        node.nodeValue = "";
        return;
      }

      const value = node.nodeValue || "";
      node.nodeValue = value.replace(value.trim(), words[index]);
    });
  }

  function replaceFeatureImage() {
    const section = document.querySelector('[data-framer-name="Video Case Section"]');
    if (!section) return;

    section.querySelectorAll("img").forEach((image) => {
      image.src = featureImage;
      image.removeAttribute("srcset");
      image.loading = "lazy";
      image.decoding = "async";
      image.style.objectFit = "cover";
      image.style.objectPosition = "center center";
    });

    section.querySelectorAll("video").forEach((video) => {
      video.style.objectFit = "cover";
      video.style.objectPosition = "center center";
    });
  }

  function normalizeHomeLinks() {
    document.querySelectorAll("a").forEach((link) => {
      if (link.textContent.trim() !== "主页") return;
      link.setAttribute("href", "/");
      if (link.dataset.orbitHomeFixed === "true") return;
      link.dataset.orbitHomeFixed = "true";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.location.assign("/");
      }, true);
    });
  }

  function normalizeFooterText() {
    document.querySelectorAll("a").forEach((link) => {
      const text = link.textContent.replace(/\s+/g, "");
      if (!text.includes("数字生命丰胖子") && !text.includes("公众号")) return;

      link.dataset.orbitFooterPlain = "true";
      link.removeAttribute("href");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.setAttribute("aria-label", "数字生命丰胖子");
      link.querySelectorAll('[data-framer-name="arrow"]').forEach((arrow) => arrow.remove());
    });
  }

  function revealCards(section) {
    const items = Array.from(section.querySelectorAll(".orbit-card"));
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
    document.documentElement.classList.add("orbit-recommendations-page");
    replaceHeaderText(document.body);
    normalizeBreadcrumb();
    replaceFeatureImage();
    normalizeHomeLinks();
    normalizeFooterText();

    const anchor = document.querySelector('[data-framer-name="Type-tester"]');
    if (!anchor) return false;
    if (document.querySelector(".orbit-recommendations")) return true;

    const section = buildSection();
    anchor.parentNode.insertBefore(section, anchor);
    revealCards(section);
    return true;
  }

  function scheduleInit() {
    init();
    [120, 480, 1200, 2400].forEach((delay) => window.setTimeout(init, delay));

    if ("MutationObserver" in window) {
      const observer = new MutationObserver(() => {
        if (!document.querySelector(".orbit-recommendations")) init();
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
