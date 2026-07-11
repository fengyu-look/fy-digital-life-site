(() => {
  const heroVideo = {
    src: "/assets/custom/photo-hero-234.mp4",
    poster: "/assets/custom/latest-work-card.png"
  };

  const featurePhoto = { src: "/assets/custom/latest-work-card.png", ratio: "wide" };

  const photos = [
    { src: "/assets/custom/photography/fy-photo-02.jpg", ratio: "wide", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-04.jpg", ratio: "portrait", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-01.jpg", ratio: "portrait", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-07.jpg", ratio: "wide", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-17.jpg", ratio: "portrait", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-10.jpg", ratio: "square", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-05.jpg", ratio: "wide", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-12.png", ratio: "portrait", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-08.jpg", ratio: "portrait", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-15.jpg", ratio: "portrait", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-18.jpg", ratio: "wide", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-16.jpg", ratio: "portrait", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-06.jpg", ratio: "portrait", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-09.jpg", ratio: "portrait", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-13.png", ratio: "wide", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-20.jpg", ratio: "portrait", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-03.jpg", ratio: "portrait", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-11.png", ratio: "portrait", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-14.png", ratio: "portrait", focus: "center center" },
    { src: "/assets/custom/photography/fy-photo-19.jpg", ratio: "square", focus: "center center" }
  ];

  function ensureStylesheet() {
    if (document.querySelector('link[href*="studio-photography.css"]')) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/custom/studio-photography.css?v=20260707c";
    document.head.appendChild(link);
  }

  function imgMarkup(photo, eager = false) {
    const position = photo.focus ? ` style="object-position: ${photo.focus};"` : "";
    return `<img src="${photo.src}" alt="" loading="${eager ? "eager" : "lazy"}" decoding="async"${position}>`;
  }

  function mapContentItem(item) {
    const data = item.data || {};
    return {
      src: item.cover_url || data.image_url || "/assets/custom/latest-work-card.png",
      ratio: data.ratio || item.layout_variant || "wide",
      focus: data.focus || "center center",
      title: item.title,
      caption: data.caption || item.summary || "",
    };
  }

  function fillPhotoSet(items, minimum = 20) {
    const source = items.length ? items : photos;
    const result = [];
    for (let index = 0; index < minimum; index += 1) {
      result.push(source[index % source.length]);
    }
    return result;
  }

  function buildFilmStrip(items, reverse = false) {
    const strip = document.createElement("section");
    strip.className = `photo-strip${reverse ? " photo-strip--reverse" : ""}`;
    strip.setAttribute("aria-label", "Scrolling photography strip");

    const track = document.createElement("div");
    track.className = "photo-strip__track";
    [...items, ...items].forEach((photo) => {
      const panel = document.createElement("figure");
      panel.className = `photo-panel photo-panel--${photo.ratio}`;
      panel.innerHTML = imgMarkup(photo);
      track.appendChild(panel);
    });

    strip.appendChild(track);
    return strip;
  }

  function buildMarquee() {
    const marquee = document.createElement("section");
    marquee.className = "photo-marquee";
    marquee.setAttribute("aria-label", "Photography slogan");

    const track = document.createElement("div");
    track.className = "photo-marquee__track";
    const text = "LIGHT / MEMORY / STILLNESS / FRAME / ";
    Array.from({ length: 8 }).forEach(() => {
      const span = document.createElement("span");
      span.textContent = text;
      track.appendChild(span);
    });

    marquee.appendChild(track);
    return marquee;
  }

  function buildSequence(items) {
    const sequence = document.createElement("section");
    sequence.className = "photo-sequence";
    sequence.setAttribute("aria-label", "Photography sequence");

    items.forEach((photo, index) => {
      const figure = document.createElement("figure");
      figure.className = `photo-sequence__item photo-sequence__item--${photo.ratio}`;
      figure.style.transitionDelay = `${Math.min(index * 90, 270)}ms`;
      figure.innerHTML = imgMarkup(photo);
      sequence.appendChild(figure);
    });

    return sequence;
  }

  function buildSection(photoItems = photos) {
    const displayPhotos = fillPhotoSet(photoItems, 20);
    const displayFeature = displayPhotos[0] || featurePhoto;
    const section = document.createElement("section");
    section.className = "photography-showcase";
    section.setAttribute("aria-label", "Personal photography works");

    section.innerHTML = `
      <div class="photo-shell">
        <div class="photo-label">PHOTOGRAPHY / PERSONAL WORKS</div>
      </div>

      <section class="photo-hero photo-reveal" aria-label="Photography hero">
        <div class="photo-hero__media">
          <video src="${heroVideo.src}" poster="${heroVideo.poster}" autoplay muted loop playsinline preload="metadata"></video>
        </div>
        <div class="photo-hero__text">
          <h1 class="photo-hero__title">Scenes Held By Light</h1>
          <p class="photo-hero__copy">一份关于静默画面的私人索引，记录掠过的天气，以及记忆开始成形的微小距离。</p>
        </div>
      </section>

      <section class="photo-shell photo-text photo-reveal">
        <p class="photo-text__body">Photography is a way of listening to ordinary time. A face, a street, a shadow, a brief pause before the day moves on. These images are collected as fragments rather than answers.</p>
      </section>
    `;

    section.appendChild(buildFilmStrip(displayPhotos.slice(0, 8)));
    section.appendChild(buildMarquee());

    const full = document.createElement("figure");
    full.className = "photo-fullbleed photo-reveal";
    full.innerHTML = imgMarkup(displayFeature);
    section.appendChild(full);

    const text = document.createElement("section");
    text.className = "photo-shell photo-text photo-reveal";
    text.innerHTML = `<p class="photo-text__body photo-text__body--animated">留在照片里的，不只是被看见的瞬间，而是注意力经过时留下的压力。光把证据，慢慢变成氛围。</p>`;
    section.appendChild(text);

    section.appendChild(buildFilmStrip(displayPhotos.slice(8, 16), true));
    section.appendChild(buildSequence(displayPhotos.slice(16, 20)));

    const outro = document.createElement("section");
    outro.className = "photo-shell photo-outro photo-reveal";
    outro.innerHTML = `
      <h2 class="photo-outro__title">The Frame Remembers</h2>
    `;
    section.appendChild(outro);

    return section;
  }

  async function hydrateContent(section) {
    if (!section || section.dataset.contentHydrated === "true" || section.dataset.contentHydrating === "true") return;
    section.dataset.contentHydrating = "true";

    try {
      const { fetchPublishedContentItems } = await import("/assets/custom/content-api.js?v=20260711a");
      const items = await fetchPublishedContentItems("photography");
      if (!items.length) return;

      const dynamicSection = buildSection(items.map(mapContentItem));
      dynamicSection.dataset.contentHydrated = "true";
      section.replaceWith(dynamicSection);
      dynamicSection.querySelectorAll("video").forEach((video) => window.customVideoController?.observe?.(video));
      revealElements(dynamicSection);
    } catch (error) {
      console.warn("[FY Content] photography fallback content used:", error);
    } finally {
      delete section.dataset.contentHydrating;
    }
  }

  function normalizeBreadcrumb() {
    const breadcrumb = document.querySelector('[data-framer-name="breadcrumb"]');
    if (!breadcrumb) return;

    const textNodes = [];
    const walker = document.createTreeWalker(breadcrumb, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    const words = ["FY", "/", "Photography"];
    textNodes.forEach((node, index) => {
      const value = node.nodeValue || "";
      node.nodeValue = index < words.length ? value.replace(value.trim(), words[index]) : "";
    });
  }

  function normalizeHomeLinks() {
    document.querySelectorAll("a").forEach((link) => {
      if (link.textContent.trim() !== "主页") return;
      link.setAttribute("href", "/");
      if (link.dataset.photoHomeFixed === "true") return;
      link.dataset.photoHomeFixed = "true";
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
      if (link.dataset.photoFooterTextOnly === "true") return;

      const textOnly = document.createElement("div");
      Array.from(link.attributes).forEach((attribute) => {
        if (["href", "target", "rel"].includes(attribute.name)) return;
        textOnly.setAttribute(attribute.name, attribute.value);
      });
      textOnly.classList.add("photo-footer-text-only");
      textOnly.dataset.photoFooterTextOnly = "true";
      textOnly.innerHTML = link.innerHTML;
      link.replaceWith(textOnly);
    });
  }

  function revealElements(root) {
    const items = Array.from(root.querySelectorAll(".photo-reveal, .photo-sequence__item"));
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
    }, { threshold: 0.12 });

    items.forEach((item) => observer.observe(item));
  }

  function updateScrollVariable() {
    document.documentElement.style.setProperty("--photo-scroll", `${window.scrollY || 0}`);
  }

  function init() {
    ensureStylesheet();
    document.documentElement.classList.add("photography-showcase-page");
    normalizeBreadcrumb();
    normalizeHomeLinks();
    normalizeFooterWechatText();
    updateScrollVariable();

    const existingSection = document.querySelector(".photography-showcase");
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
    section.querySelectorAll("video").forEach((video) => window.customVideoController?.observe?.(video));
    revealElements(section);
    hydrateContent(section);
    return true;
  }

  function scheduleInit() {
    init();
    [120, 480, 1200, 2400].forEach((delay) => window.setTimeout(init, delay));
    window.addEventListener("scroll", updateScrollVariable, { passive: true });

    if ("MutationObserver" in window) {
      const observer = new MutationObserver(() => {
        normalizeFooterWechatText();
        const section = document.querySelector(".photography-showcase");
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
