(() => {
  // 关于页从 Supabase profile 表读取资料并同步前台。
  // 真人照片用 real_photo_url；avatar_url 是导航赛博头像，这里不动。
  // 任何读取失败都保持当前静态内容，不空白、不报错。

  const PROFILE_INTRO_PRESET = "tbxXXk1oq";
  const NICKNAME_TEXT = "丰胖子";
  const CONTACT_MARKER = "抖音、公众号、小红书、视频号、B站";
  const REAL_PHOTO_FALLBACK = "/assets/custom/about-card-portrait.png";
  const MEDIA_BASE_URL = "https://wwobcjkakedxyruxulfj.supabase.co/storage/v1/object/public/site-media";

  function resolveMediaUrl(value) {
    if (!value) return "";
    const trimmed = String(value).trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("/")) return trimmed;
    return `${MEDIA_BASE_URL}/${trimmed.replace(/^\/+/, "")}`;
  }

  function applyNickname(nickname) {
    const name = (nickname || "").trim();
    if (!name) return;

    document.querySelectorAll('p.framer-text').forEach((node) => {
      if (node.textContent.trim() === NICKNAME_TEXT) {
        node.textContent = name;
      }
    });
  }

  function applyIntro(intro) {
    const text = (intro || "").trim();
    if (!text) return;

    const paragraphs = document.querySelectorAll(
      `p.framer-text[data-styles-preset="${PROFILE_INTRO_PRESET}"]`
    );
    paragraphs.forEach((node) => {
      node.textContent = text;
    });
  }

  function applyRealPhoto(realPhotoUrl) {
    const url = resolveMediaUrl(realPhotoUrl);
    if (!url) return;

    // 关于页正文唯一真人照片：引用 about-card-portrait.png 的 img。
    document.querySelectorAll("img").forEach((img) => {
      if (img.getAttribute("src") === REAL_PHOTO_FALLBACK) {
        img.setAttribute("src", url);
        img.removeAttribute("srcset");
      }
    });
  }

  function formatContacts(contacts, socialLinks) {
    const labels = [];

    if (Array.isArray(contacts)) {
      contacts.forEach((item) => {
        if (item && item.label) labels.push(String(item.label));
      });
    }

    if (Array.isArray(socialLinks)) {
      socialLinks.forEach((item) => {
        if (item && item.label) labels.push(String(item.label));
      });
    }

    const unique = labels.filter(Boolean);
    return unique.length ? unique.join("、") : "";
  }

  function applyContacts(contacts, socialLinks) {
    const text = formatContacts(contacts, socialLinks);
    if (!text) return;

    document.querySelectorAll("p.framer-text").forEach((node) => {
      if (node.textContent.includes(CONTACT_MARKER)) {
        node.textContent = text;
      }
    });
  }

  function applyProfile(profile) {
    if (!profile || typeof profile !== "object") return;

    applyNickname(profile.nickname);
    applyIntro(profile.intro);
    applyRealPhoto(profile.real_photo_url);
    applyContacts(profile.contacts, profile.social_links);
  }

  async function hydrateProfile() {
    try {
      const { fetchProfile } = await import("/assets/custom/content-api.js?v=20260711a");
      const profile = await fetchProfile();
      if (profile) applyProfile(profile);
    } catch (error) {
      console.warn("[FY Content] about page profile fallback used:", error);
    }
  }

  function scheduleHydrate() {
    hydrateProfile();
    [400, 1200, 2400].forEach((delay) => window.setTimeout(hydrateProfile, delay));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleHydrate, { once: true });
  } else {
    scheduleHydrate();
  }
})();
