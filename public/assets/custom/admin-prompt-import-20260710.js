import {
  recommendationPages,
  SITE_MEDIA_BASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  supabase,
} from "./site-supabase.js";

const pageConfigs = {
  "useful-websites": {
    label: "实用网站",
    defaultTitle: "超级链接宇宙",
    defaultIntro: "数字世界的浩瀚星河里，我们为你打捞那些真正闪光的岛屿。",
    defaultLayout: "grid",
    itemTypes: [{ value: "website", label: "网页推荐" }],
    fields: [
      { key: "site_name", label: "网页名称", type: "text" },
      { key: "pricing", label: "价格/状态", type: "text", placeholder: "Free / Paid / Freemium" },
      { key: "recommend_reason", label: "推荐理由", type: "textarea" },
      { key: "button_label", label: "按钮文案", type: "text", placeholder: "VISIT SITE" },
    ],
    defaultSettings: { label: "CURATED LINKS" },
  },
  "prompt-collection": {
    label: "提示词宇宙",
    defaultTitle: "提示词宇宙",
    defaultIntro: "收藏文生图、文生视频与图生图提示词。",
    defaultLayout: "grid",
    itemTypes: [{ value: "prompt", label: "提示词卡片" }],
    fields: [
      { key: "prompt_type", label: "提示词分类", type: "text", placeholder: "TEXT TO IMAGE" },
      { key: "prompt", label: "完整提示词", type: "textarea", rows: 7 },
      { key: "negative_prompt", label: "反向提示词", type: "textarea" },
      { key: "model", label: "模型/工具", type: "text" },
      { key: "copy_button_label", label: "复制按钮文案", type: "text", placeholder: "点击复制" },
    ],
    defaultSettings: { label: "PROMPT COLLECTION" },
  },
  "skill-workflow": {
    label: "Skill 工具箱",
    defaultTitle: "Skill 工具箱",
    defaultIntro: "收藏常用 Skill 与组合工作流。",
    defaultLayout: "grid",
    itemTypes: [
      { value: "skill", label: "Skill" },
      { value: "workflow", label: "Workflow" },
    ],
    fields: [
      { key: "skill_type", label: "类型标记", type: "select", options: ["SKILL", "WORKFLOW"] },
      { key: "includes", label: "包含项，用逗号分隔", type: "csv", placeholder: "dbs-content, stop-slop" },
      { key: "use_cases", label: "适用场景，每行一个", type: "lines" },
      { key: "call_instruction", label: "调用说明", type: "text", placeholder: "/dbs-content" },
      { key: "button_label", label: "按钮文案", type: "text", placeholder: "VIEW ON GITHUB" },
    ],
    defaultSettings: { label: "SKILL / WORKFLOW" },
  },
  photography: {
    label: "摄影页",
    defaultTitle: "Scenes Held By Light",
    defaultIntro: "一份关于静默画面的私人索引。",
    defaultLayout: "photo-showcase",
    itemTypes: [
      { value: "photo", label: "照片" },
      { value: "hero", label: "首屏视频/主视觉" },
    ],
    fields: [
      { key: "ratio", label: "图片比例", type: "select", options: ["wide", "portrait", "square"] },
      { key: "focus", label: "图片焦点", type: "text", placeholder: "center center" },
      { key: "caption", label: "图片说明", type: "textarea" },
      { key: "location", label: "地点", type: "text" },
      { key: "shot_at", label: "拍摄时间", type: "text", placeholder: "2026-07" },
    ],
    defaultSettings: { label: "PHOTOGRAPHY / PERSONAL WORKS" },
  },
  "agent-guide": {
    label: "Agent 安装教程",
    defaultTitle: "Agent 工具安装教程库",
    defaultIntro: "每张卡片都是一个 Agent 工具入口。",
    defaultLayout: "paginated-guide",
    itemTypes: [{ value: "agent_tutorial", label: "Agent 教程" }],
    fields: [
      { key: "difficulty", label: "难度", type: "text", placeholder: "入门 / 进阶" },
      { key: "requirements", label: "前置要求，用逗号分隔", type: "csv" },
      { key: "steps", label: "步骤 JSON", type: "json", rows: 8, placeholder: '[{"title":"安装","body":"..."}]' },
      { key: "tool_links", label: "工具链接 JSON", type: "json", rows: 5, placeholder: '[{"label":"GitHub","url":"https://..."}]' },
      { key: "button_label", label: "按钮文案", type: "text", placeholder: "VIEW GUIDE" },
    ],
    defaultSettings: { label: "AGENT INSTALL GUIDE", page_size: 8 },
  },
};

const staticContentSeeds = {
  "useful-websites": [
    {
      title: "Tool Name 01",
      summary: "一句话写清楚这个网站最适合解决什么问题。",
      cover_url: "/assets/custom/latest-work-card.png",
      link_url: "https://example.com",
      meta: "AI / PRODUCTIVITY",
    },
    {
      title: "Tool Name 02",
      summary: "适合放你想推荐给网友的实用网站说明。",
      cover_url: "/assets/custom/ai-slogan-card.png",
      link_url: "https://example.com",
      meta: "DESIGN / IDEA",
    },
    {
      title: "Tool Name 03",
      summary: "这里可以替换成价格、用途或一句推荐理由。",
      cover_url: "/assets/custom/about-card-cyber-20260704.png",
      link_url: "https://example.com",
      meta: "WEB / RESOURCE",
    },
    {
      title: "Tool Name 04",
      summary: "后续复制这一张卡片，替换文字、图片和链接。",
      cover_url: "/assets/custom/work-card-photo-lite.mp4",
      link_url: "https://example.com",
      meta: "REFERENCE / DAILY",
    },
    {
      title: "Tool Name 05",
      summary: "保持短句，整个页面会更像作品集里的推荐清单。",
      cover_url: "/assets/custom/about-card-portrait-crop-20260704.png",
      link_url: "https://example.com",
      meta: "CREATIVE / TOOL",
    },
    {
      title: "Tool Name 06",
      summary: "如果没有图片，可以先换成统一风格的封面图。",
      cover_url: "/assets/custom/work-card-skill-lite.mp4",
      link_url: "https://example.com",
      meta: "LEARN / SAVE",
    },
  ],
  "prompt-collection": [
    {
      title: "Prompt Name 01",
      summary: "一句话说明这个文生图提示词适合生成什么画面。",
      cover_url: "/assets/custom/latest-work-card.png",
      link_url: "",
      meta: "TEXT TO IMAGE",
      prompt: "这里替换成你的完整文生图提示词原文。",
    },
    {
      title: "Prompt Name 02",
      summary: "适合放镜头语言、主体、光线、质感和风格要求。",
      cover_url: "/assets/custom/work-card-prompt-lite.mp4",
      link_url: "",
      meta: "TEXT TO VIDEO",
      prompt: "这里替换成你的完整文生视频提示词原文。",
    },
    {
      title: "Prompt Name 03",
      summary: "用于图生图改造时，写清保留内容和变化方向。",
      cover_url: "/assets/custom/about-card-cyber-20260704.png",
      link_url: "",
      meta: "IMAGE TO IMAGE",
      prompt: "这里替换成你的完整图生图提示词原文。",
    },
    {
      title: "Prompt Name 04",
      summary: "可以放产品海报、人物设定或场景氛围类提示词。",
      cover_url: "/assets/custom/ai-slogan-card.png",
      link_url: "",
      meta: "STYLE / POSTER",
      prompt: "这里替换成你的完整风格化生成提示词原文。",
    },
    {
      title: "Prompt Name 05",
      summary: "适合收藏你常用的高成功率视觉提示词模板。",
      cover_url: "/assets/custom/about-card-portrait-crop-20260704.png",
      link_url: "",
      meta: "REFERENCE / DAILY",
      prompt: "这里替换成你的完整参考图或日常生成提示词原文。",
    },
    {
      title: "Prompt Name 06",
      summary: "后续复制这一张卡片，替换封面、标题和提示词。",
      cover_url: "/assets/custom/work-card-skill-lite.mp4",
      link_url: "",
      meta: "TEMPLATE / SAVE",
      prompt: "这里替换成你的完整提示词模板原文。",
    },
  ],
};

const els = {
  loginPanel: document.querySelector("#loginPanel"),
  adminPanel: document.querySelector("#adminPanel"),
  loginForm: document.querySelector("#loginForm"),
  logoutButton: document.querySelector("#logoutButton"),
  sessionEmail: document.querySelector("#sessionEmail"),
  statusLine: document.querySelector("#statusLine"),
  pageFilter: document.querySelector("#pageFilter"),
  contentSummary: document.querySelector("#contentSummary"),
  contentPageForm: document.querySelector("#contentPageForm"),
  recommendationForm: document.querySelector("#recommendationForm"),
  recommendationList: document.querySelector("#recommendationList"),
  resetRecommendation: document.querySelector("#resetRecommendation"),
  importStaticCards: document.querySelector("#importStaticCards"),
  normalizeSortOrder: document.querySelector("#normalizeSortOrder"),
  profileForm: document.querySelector("#profileForm"),
  coverUpload: document.querySelector("#coverUpload"),
  coverUploadInfo: document.querySelector("#coverUploadInfo"),
  coverUploadProgress: document.querySelector("#coverUploadProgress"),
  coverPreview: document.querySelector("#coverPreview"),
  avatarUpload: document.querySelector("#avatarUpload"),
  avatarUploadInfo: document.querySelector("#avatarUploadInfo"),
  avatarUploadProgress: document.querySelector("#avatarUploadProgress"),
  avatarPreview: document.querySelector("#avatarPreview"),
  realPhotoUpload: document.querySelector("#realPhotoUpload"),
  realPhotoUploadInfo: document.querySelector("#realPhotoUploadInfo"),
  realPhotoUploadProgress: document.querySelector("#realPhotoUploadProgress"),
  realPhotoPreview: document.querySelector("#realPhotoPreview"),
  dynamicFields: document.querySelector("#dynamicFields"),
  recommendationsView: document.querySelector("#recommendationsView"),
  profileView: document.querySelector("#profileView"),
};

let currentSession = null;
let contentPages = [];
let contentItems = [];
const fallbackAdminEmails = new Set(["fengyuaimengyu@outlook.com"]);
const MAX_UPLOAD_BYTES = 190 * 1024 * 1024;
const objectUrls = new Set();

function setStatus(message, isError = false) {
  els.statusLine.textContent = message;
  els.statusLine.style.color = isError ? "#b00020" : "";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatBytes(bytes = 0) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function uploadLabel(file) {
  if (!file) return "未选择文件";
  return `${file.name} · ${formatBytes(file.size)}`;
}

function assertUploadFile(file) {
  if (!file) return;
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`文件太大了：${formatBytes(file.size)}。当前存储桶单文件建议控制在 190 MB 以内。`);
  }
}

function mediaElement(url, mime = "") {
  const isVideo = mime.startsWith("video/") || /\.(mp4|webm)(\?|$)/i.test(url);
  if (isVideo) return `<video src="${escapeHtml(url)}" muted playsinline controls preload="metadata"></video>`;
  return `<img src="${escapeHtml(url)}" alt="">`;
}

function renderUploadPreview(preview, url, meta = {}) {
  if (!preview || !url) return;
  preview.hidden = false;
  preview.innerHTML = `
    ${mediaElement(url, meta.type || "")}
    <div class="media-preview__meta">
      <strong>${escapeHtml(meta.title || "当前预览")}</strong>
      ${meta.detail ? `<span>${escapeHtml(meta.detail)}</span>` : ""}
      <code>${escapeHtml(meta.url || url)}</code>
    </div>
  `;
}

function clearUploadPreview(preview, info) {
  if (preview) {
    preview.hidden = true;
    preview.innerHTML = "";
  }
  if (info) info.textContent = "未选择文件";
}

function previewSelectedFile(file, preview, info, title) {
  if (!file) return;
  assertUploadFile(file);
  const url = URL.createObjectURL(file);
  objectUrls.add(url);
  if (info) info.textContent = `${uploadLabel(file)} · 正在上传...`;
  renderUploadPreview(preview, url, {
    title,
    detail: "本地预览，上传成功后会替换成公网地址。",
    type: file.type,
    url: file.name,
  });
}

function updateUploadedFilePreview(url, file, preview, info, title) {
  if (info) info.textContent = `${uploadLabel(file)} · 上传完成`;
  renderUploadPreview(preview, url, {
    title,
    detail: "已上传到 Supabase Storage。",
    type: file?.type || "",
    url,
  });
}

function renderUrlPreview(url, preview, title) {
  const clean = String(url || "").trim();
  if (!clean) {
    clearUploadPreview(preview);
    return;
  }
  renderUploadPreview(preview, clean, {
    title,
    detail: "当前 URL 预览。",
    url: clean,
  });
}

function parseJson(value, fallback) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return fallback;
  return JSON.parse(trimmed);
}

function parseTags(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function linesValue(value) {
  return Array.isArray(value) ? value.join("\n") : String(value || "");
}

function csvValue(value) {
  return Array.isArray(value) ? value.join(", ") : String(value || "");
}

function currentPageKey() {
  return els.pageFilter.value;
}

function currentConfig() {
  return pageConfigs[currentPageKey()];
}

function fallbackPage(pageKey) {
  const config = pageConfigs[pageKey];
  return {
    page_key: pageKey,
    title: config.defaultTitle,
    intro: config.defaultIntro,
    layout_type: config.defaultLayout,
    settings: config.defaultSettings,
    is_enabled: true,
  };
}

function activePage() {
  return contentPages.find((page) => page.page_key === currentPageKey()) || fallbackPage(currentPageKey());
}

function fillPageSelect(select) {
  select.innerHTML = recommendationPages
    .map((page) => `<option value="${page.key}">${page.label}</option>`)
    .join("");
}

function fillItemTypeSelect() {
  const select = els.recommendationForm.elements.item_type;
  select.innerHTML = currentConfig().itemTypes
    .map((type) => `<option value="${type.value}">${type.label}</option>`)
    .join("");
}

function mediaMarkup(url) {
  if (!url) return "";
  if (/\.(mp4|webm)(\?|$)/i.test(url)) {
    return `<video src="${escapeHtml(url)}" muted playsinline preload="metadata"></video>`;
  }
  return `<img src="${escapeHtml(url)}" alt="">`;
}

function summarizeItems(items) {
  const published = items.filter((item) => item.is_published).length;
  const hidden = items.length - published;
  return [
    { label: "全部卡片", value: items.length },
    { label: "已发布", value: published },
    { label: "已隐藏", value: hidden },
  ];
}

function fieldInput(field, value = "") {
  const name = `field:${field.key}`;
  const safeValue = field.type === "json"
    ? JSON.stringify(value || (field.key.endsWith("s") ? [] : {}), null, 2)
    : field.type === "csv"
      ? csvValue(value)
      : field.type === "lines"
        ? linesValue(value)
        : String(value || "");

  if (field.type === "textarea" || field.type === "json" || field.type === "lines") {
    return `
      <label class="wide">
        ${escapeHtml(field.label)}
        <textarea name="${name}" rows="${field.rows || 4}" placeholder="${escapeHtml(field.placeholder || "")}">${escapeHtml(safeValue)}</textarea>
      </label>
    `;
  }

  if (field.type === "select") {
    return `
      <label>
        ${escapeHtml(field.label)}
        <select name="${name}">
          ${(field.options || []).map((option) => `<option value="${escapeHtml(option)}"${option === safeValue ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  return `
    <label>
      ${escapeHtml(field.label)}
      <input name="${name}" value="${escapeHtml(safeValue)}" placeholder="${escapeHtml(field.placeholder || "")}">
    </label>
  `;
}

function renderDynamicFields(data = {}) {
  els.dynamicFields.innerHTML = currentConfig().fields
    .map((field) => fieldInput(field, data[field.key]))
    .join("");
}

function dynamicDataFromForm(form) {
  const base = parseJson(form.elements.data_json.value, {});
  currentConfig().fields.forEach((field) => {
    const raw = form.elements[`field:${field.key}`]?.value ?? "";
    if (field.type === "csv") {
      base[field.key] = parseTags(raw);
      return;
    }
    if (field.type === "lines") {
      base[field.key] = raw.split("\n").map((line) => line.trim()).filter(Boolean);
      return;
    }
    if (field.type === "json") {
      base[field.key] = parseJson(raw, field.key.endsWith("s") ? [] : {});
      return;
    }
    base[field.key] = raw.trim();
  });
  return base;
}

function contentItemPayload(form) {
  const pageKey = currentPageKey();
  return {
    page_key: pageKey,
    item_type: form.elements.item_type.value,
    title: form.elements.title.value.trim(),
    summary: form.elements.description.value.trim(),
    cover_url: form.elements.cover_url.value.trim() || null,
    link_url: form.elements.link_url.value.trim() || null,
    tags: parseTags(form.elements.tags.value),
    sort_order: Number(form.elements.sort_order.value || 0),
    layout_variant: form.elements.layout_variant.value,
    is_published: form.elements.is_published.checked,
    data: dynamicDataFromForm(form),
  };
}

function resetRecommendationForm() {
  els.recommendationForm.reset();
  els.recommendationForm.elements.id.value = "";
  els.recommendationForm.elements.page_key.value = currentPageKey();
  els.recommendationForm.elements.sort_order.value = "0";
  els.recommendationForm.elements.layout_variant.value = "normal";
  els.recommendationForm.elements.is_published.checked = true;
  fillItemTypeSelect();
  renderDynamicFields({});
  els.recommendationForm.elements.data_json.value = "{}";
  els.coverUpload.value = "";
  clearUploadPreview(els.coverPreview, els.coverUploadInfo);
}

function fillPageForm() {
  const page = activePage();
  const form = els.contentPageForm;
  form.elements.title.value = page.title || "";
  form.elements.intro.value = page.intro || "";
  form.elements.layout_type.value = page.layout_type || currentConfig().defaultLayout;
  form.elements.settings.value = JSON.stringify(page.settings || currentConfig().defaultSettings, null, 2);
  form.elements.is_enabled.checked = Boolean(page.is_enabled);
}

function editContentItem(item) {
  const form = els.recommendationForm;
  form.elements.id.value = item.id;
  form.elements.page_key.value = item.page_key;
  form.elements.item_type.value = item.item_type;
  form.elements.sort_order.value = item.sort_order ?? 0;
  form.elements.title.value = item.title ?? "";
  form.elements.description.value = item.summary ?? "";
  form.elements.link_url.value = item.link_url ?? "";
  form.elements.cover_url.value = item.cover_url ?? "";
  form.elements.tags.value = (item.tags ?? []).join(", ");
  form.elements.layout_variant.value = item.layout_variant ?? "normal";
  form.elements.is_published.checked = Boolean(item.is_published);
  renderDynamicFields(item.data || {});
  form.elements.data_json.value = JSON.stringify(item.data || {}, null, 2);
  els.coverUpload.value = "";
  if (item.cover_url) {
    renderUrlPreview(item.cover_url, els.coverPreview, "当前封面");
    els.coverUploadInfo.textContent = "正在使用已有封面 URL";
  } else {
    clearUploadPreview(els.coverPreview, els.coverUploadInfo);
  }
  setStatus(`正在编辑：${item.title}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteContentItem(id) {
  if (!window.confirm("确定删除这条内容吗？")) return;
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) throw error;
  setStatus("已删除内容。");
  await loadContentItems();
}

async function updateContentItem(id, payload, message) {
  const { error } = await supabase.from("content_items").update(payload).eq("id", id);
  if (error) throw error;
  setStatus(message);
  await loadContentItems();
}

async function togglePublish(item) {
  await updateContentItem(
    item.id,
    { is_published: !item.is_published },
    item.is_published ? "卡片已隐藏。" : "卡片已发布。",
  );
}

async function moveContentItem(item, delta) {
  const nextSort = Number(item.sort_order || 0) + delta;
  await updateContentItem(item.id, { sort_order: nextSort }, "排序已更新。");
}

async function duplicateContentItem(item) {
  const payload = {
    page_key: item.page_key,
    item_type: item.item_type,
    title: `${item.title || "未命名卡片"} 副本`,
    summary: item.summary,
    cover_url: item.cover_url,
    link_url: item.link_url,
    tags: item.tags || [],
    sort_order: Number(item.sort_order || 0) + 1,
    layout_variant: item.layout_variant || "normal",
    is_published: false,
    data: item.data || {},
  };
  const { error } = await supabase.from("content_items").insert(payload);
  if (error) throw error;
  setStatus("已复制一张隐藏卡片。");
  await loadContentItems();
}

function seedDataForPage(pageKey, item) {
  if (pageKey === "prompt-collection") {
    return {
      prompt_type: item.meta,
      prompt: item.prompt || "",
      negative_prompt: "",
      model: "",
      copy_button_label: "点击复制",
      migrated_from: `static-${pageKey}`,
    };
  }

  return {
    site_name: item.title,
    pricing: item.meta,
    recommend_reason: item.summary,
    button_label: "VISIT SITE",
    migrated_from: `static-${pageKey}`,
  };
}

function seedPayloadsForPage(pageKey) {
  return (staticContentSeeds[pageKey] || []).map((item, index) => {
    const tags = item.meta
      .split("/")
      .map((tag) => tag.trim())
      .filter(Boolean);

    return {
      page_key: pageKey,
      item_type: pageConfigs[pageKey].itemTypes[0]?.value || "card",
      title: item.title,
      summary: item.summary,
      cover_url: item.cover_url,
      link_url: item.link_url,
      tags,
      sort_order: (index + 1) * 10,
      layout_variant: "normal",
      is_published: true,
      data: seedDataForPage(pageKey, item),
    };
  });
}

async function importStaticCards() {
  const pageKey = currentPageKey();
  const payloads = seedPayloadsForPage(pageKey);
  if (!payloads.length) {
    setStatus("当前页面还没有内置静态卡片可导入。", true);
    return;
  }

  const existingCount = contentItems.filter((item) => item.page_key === pageKey).length;
  if (existingCount) {
    const ok = window.confirm(`这个页面后台已有 ${existingCount} 张卡片。继续导入会追加一组静态卡片，确定吗？`);
    if (!ok) return;
  }

  setStatus(`正在导入 ${payloads.length} 张静态卡片...`);
  const { error } = await supabase.from("content_items").insert(payloads);
  if (error) throw error;
  await loadContentItems();
  resetRecommendationForm();
  setStatus(`已导入 ${payloads.length} 张静态卡片。前台会优先读取后台数据。`);
}

async function normalizeCurrentPageSortOrder() {
  const pageKey = currentPageKey();
  const items = contentItems
    .filter((item) => item.page_key === pageKey)
    .sort((a, b) => {
      const sortDiff = Number(a.sort_order || 0) - Number(b.sort_order || 0);
      if (sortDiff) return sortDiff;
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    });

  if (!items.length) {
    setStatus("当前页面还没有卡片可整理。", true);
    return;
  }

  const ok = window.confirm(`将把当前页面 ${items.length} 张卡片排序整理为 10 / 20 / 30...，确定吗？`);
  if (!ok) return;

  setStatus(`正在整理 ${items.length} 张卡片排序...`);
  for (let index = 0; index < items.length; index += 1) {
    const nextSortOrder = (index + 1) * 10;
    if (Number(items[index].sort_order || 0) === nextSortOrder) continue;
    const { error } = await supabase
      .from("content_items")
      .update({ sort_order: nextSortOrder })
      .eq("id", items[index].id);
    if (error) throw error;
  }

  await loadContentItems();
  setStatus(`当前页面排序已整理为 10 / 20 / ... / ${items.length * 10}。`);
}

function renderContentItems() {
  const items = contentItems.filter((item) => item.page_key === currentPageKey());
  const summary = summarizeItems(items);
  els.contentSummary.innerHTML = summary
    .map((item) => `
      <div class="summary-chip">
        <span>${escapeHtml(item.label)}</span>
        <strong>${item.value}</strong>
      </div>
    `)
    .join("");

  if (!items.length) {
    els.recommendationList.innerHTML = `<p class="status-line">这个页面还没有后台卡片。前台会继续显示当前静态内容。</p>`;
    return;
  }

  els.recommendationList.innerHTML = items
    .map((item) => `
      <article class="data-card" data-id="${item.id}">
        <div class="data-card__media">${mediaMarkup(item.cover_url)}</div>
        <div>
          <div class="data-card__meta">
            <span>#${Number(item.sort_order || 0)}</span>
            <span>${escapeHtml(item.item_type)}</span>
            <span class="state-pill ${item.is_published ? "is-live" : "is-hidden"}">${item.is_published ? "已发布" : "已隐藏"}</span>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.summary || "")}</p>
          <div class="data-card__tags">${(item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        </div>
        <div class="data-card__actions">
          <button class="ghost-button" type="button" data-action="up">上移</button>
          <button class="ghost-button" type="button" data-action="down">下移</button>
          <button class="ghost-button" type="button" data-action="toggle">${item.is_published ? "隐藏" : "发布"}</button>
          <button class="ghost-button" type="button" data-action="duplicate">复制</button>
          <button class="ghost-button" type="button" data-action="edit">编辑</button>
          <button class="danger-button" type="button" data-action="delete">删除</button>
        </div>
      </article>
    `)
    .join("");
}

async function loadContentPages() {
  const { data, error } = await supabase.from("content_pages").select("*").order("page_key");
  if (error) throw error;
  contentPages = data ?? [];
  fillPageForm();
}

async function loadContentItems() {
  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  contentItems = data ?? [];
  renderContentItems();
}

async function loadProfile() {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", true)
    .single();
  if (error) throw error;

  const form = els.profileForm;
  form.elements.nickname.value = data.nickname ?? "";
  form.elements.email.value = data.email ?? "";
  form.elements.avatar_url.value = data.avatar_url ?? "";
  form.elements.real_photo_url.value = data.real_photo_url ?? "";
  form.elements.intro.value = data.intro ?? "";
  form.elements.contacts.value = JSON.stringify(data.contacts ?? [], null, 2);
  form.elements.social_links.value = JSON.stringify(data.social_links ?? [], null, 2);
  renderUrlPreview(data.avatar_url, els.avatarPreview, "当前头像");
  renderUrlPreview(data.real_photo_url, els.realPhotoPreview, "当前真人照片");
}

async function verifyAdmin(session) {
  const userId = session?.user?.id;
  const email = session?.user?.email?.toLowerCase();
  if (!userId) return { ok: false, fallback: false, message: "没有拿到登录用户 ID。" };

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .limit(1);
  if (error) {
    if (fallbackAdminEmails.has(email)) {
      return {
        ok: true,
        fallback: true,
        message: `管理员表读取失败，已按登录邮箱临时放行：${error.message}`,
      };
    }
    throw error;
  }

  if (data?.length) return { ok: true, fallback: false, message: "" };

  if (fallbackAdminEmails.has(email)) {
    return {
      ok: true,
      fallback: true,
      message: "已登录，但 admin_users 表里没有匹配当前 User ID；编辑保存可能会失败。",
    };
  }

  return { ok: false, fallback: false, message: "这个账号还不是管理员。" };
}

async function showAdmin(session) {
  const adminCheck = await verifyAdmin(session);
  if (!adminCheck.ok) throw new Error(adminCheck.message);

  currentSession = session;
  els.loginPanel.hidden = true;
  els.adminPanel.hidden = false;
  els.logoutButton.hidden = false;
  els.sessionEmail.textContent = session.user.email;

  try {
    await Promise.all([loadContentPages(), loadContentItems(), loadProfile()]);
    resetRecommendationForm();
    setStatus(adminCheck.fallback ? adminCheck.message : "后台已连接。", adminCheck.fallback);
  } catch (error) {
    setStatus(`已登录，但内容读取失败：${error.message}`, true);
  }
}

function showLogin() {
  currentSession = null;
  els.loginPanel.hidden = false;
  els.adminPanel.hidden = true;
  els.logoutButton.hidden = true;
  els.sessionEmail.textContent = "未登录";
}

const UPLOAD_ERRORS = {
  "Payload too large": "文件超过了存储桶的大小限制。",
  "duplicate": "文件名已被占用，请稍后重试。",
  "not found": "存储桶不存在，请检查配置。",
  "Unauthorized": "上传权限不足，请重新登录后再试。",
  "JWT": "登录已过期，请重新登录后再上传。",
  "network": "网络连接失败，请检查网络后重试。",
  "row-level security": "没有操作权限，请确认管理员身份。",
};

function translateUploadError(error) {
  if (!error) return "未知错误，请重试。";
  const msg = (error.message || String(error)).trim();
  for (const [key, trans] of Object.entries(UPLOAD_ERRORS)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return `❌ ${trans}`;
  }
  return `❌ 上传失败：${msg}`;
}

function showProgress(progressEl, percent) {
  if (!progressEl) return;
  progressEl.hidden = percent >= 100;
  progressEl.value = percent;
}

function hideProgress(progressEl) {
  if (!progressEl) return;
  progressEl.hidden = true;
  progressEl.value = 0;
}

function encodeStoragePath(filePath) {
  return filePath.split("/").map(encodeURIComponent).join("/");
}

async function uploadToStorage(file, folder, progressEl) {
  if (!file) return "";
  showProgress(progressEl, 0);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filePath = `admin-uploads/${folder}/${Date.now()}-${safeName}`;
  const token = currentSession?.access_token || "";

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${SUPABASE_URL}/storage/v1/object/site-media/${encodeStoragePath(filePath)}`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", SUPABASE_ANON_KEY);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        showProgress(progressEl, Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      hideProgress(progressEl);
      if (xhr.status >= 200 && xhr.status < 300) {
        const publicUrl = `${SITE_MEDIA_BASE_URL}/${encodeStoragePath(filePath)}`;
        resolve(publicUrl);
      } else {
        let errMsg = `上传失败 (${xhr.status})`;
        try {
          const body = JSON.parse(xhr.responseText);
          errMsg = body.message || body.error || errMsg;
        } catch (_) {}
        reject(new Error(translateUploadError({ message: errMsg })));
      }
    });

    xhr.addEventListener("error", () => {
      hideProgress(progressEl);
      reject(new Error(translateUploadError({ message: "network" })));
    });

    xhr.addEventListener("abort", () => {
      hideProgress(progressEl);
      reject(new Error("❌ 上传已取消。"));
    });

    xhr.send(file);
  });
}

function switchView(view) {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  els.recommendationsView.hidden = view !== "recommendations";
  els.profileView.hidden = view !== "profile";
}

fillPageSelect(els.pageFilter);
fillPageSelect(els.recommendationForm.elements.page_key);
fillItemTypeSelect();
renderDynamicFields({});

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("正在登录...");
  const form = new FormData(event.currentTarget);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: form.get("email"),
    password: form.get("password"),
  });
  if (error) {
    setStatus(error.message, true);
    return;
  }

  try {
    await showAdmin(data.session);
  } catch (error) {
    setStatus(error.message, true);
    showLogin();
  }
});

els.logoutButton.addEventListener("click", async () => {
  await supabase.auth.signOut();
  showLogin();
  setStatus("已退出。");
});

document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

els.pageFilter.addEventListener("change", () => {
  fillItemTypeSelect();
  fillPageForm();
  renderContentItems();
  resetRecommendationForm();
});

els.contentPageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("正在保存页面配置...");
  try {
    const form = event.currentTarget;
    const payload = {
      page_key: currentPageKey(),
      title: form.elements.title.value.trim(),
      intro: form.elements.intro.value.trim(),
      layout_type: form.elements.layout_type.value,
      settings: parseJson(form.elements.settings.value, {}),
      is_enabled: form.elements.is_enabled.checked,
    };
    const { error } = await supabase.from("content_pages").upsert(payload);
    if (error) throw error;
    await loadContentPages();
    setStatus("页面配置已保存。");
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.resetRecommendation.addEventListener("click", resetRecommendationForm);

els.importStaticCards.addEventListener("click", async () => {
  try {
    await importStaticCards();
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.normalizeSortOrder.addEventListener("click", async () => {
  try {
    await normalizeCurrentPageSortOrder();
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.coverUpload.addEventListener("change", async (event) => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  setStatus("正在上传封面...");
  try {
    previewSelectedFile(file, els.coverPreview, els.coverUploadInfo, "封面预览");
    const url = await uploadToStorage(file, "covers", els.coverUploadProgress);
    els.recommendationForm.elements.cover_url.value = url;
    updateUploadedFilePreview(url, file, els.coverPreview, els.coverUploadInfo, "封面预览");
    setStatus("封面上传完成。");
  } catch (error) {
    event.currentTarget.value = "";
    hideProgress(els.coverUploadProgress);
    els.coverUploadInfo.textContent = error.message;
    setStatus(error.message, true);
  }
});

els.avatarUpload.addEventListener("change", async (event) => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  setStatus("正在上传头像...");
  try {
    previewSelectedFile(file, els.avatarPreview, els.avatarUploadInfo, "头像预览");
    const url = await uploadToStorage(file, "profile", els.avatarUploadProgress);
    els.profileForm.elements.avatar_url.value = url;
    updateUploadedFilePreview(url, file, els.avatarPreview, els.avatarUploadInfo, "头像预览");
    setStatus("头像上传完成。");
  } catch (error) {
    event.currentTarget.value = "";
    hideProgress(els.avatarUploadProgress);
    els.avatarUploadInfo.textContent = error.message;
    setStatus(error.message, true);
  }
});

els.realPhotoUpload.addEventListener("change", async (event) => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  setStatus("正在上传真人照片...");
  try {
    previewSelectedFile(file, els.realPhotoPreview, els.realPhotoUploadInfo, "真人照片预览");
    const url = await uploadToStorage(file, "profile", els.realPhotoUploadProgress);
    els.profileForm.elements.real_photo_url.value = url;
    updateUploadedFilePreview(url, file, els.realPhotoPreview, els.realPhotoUploadInfo, "真人照片预览");
    setStatus("真人照片上传完成。");
  } catch (error) {
    event.currentTarget.value = "";
    hideProgress(els.realPhotoUploadProgress);
    els.realPhotoUploadInfo.textContent = error.message;
    setStatus(error.message, true);
  }
});

els.recommendationForm.elements.cover_url.addEventListener("input", (event) => {
  renderUrlPreview(event.currentTarget.value, els.coverPreview, "封面 URL 预览");
});

els.profileForm.elements.avatar_url.addEventListener("input", (event) => {
  renderUrlPreview(event.currentTarget.value, els.avatarPreview, "头像 URL 预览");
});

els.profileForm.elements.real_photo_url.addEventListener("input", (event) => {
  renderUrlPreview(event.currentTarget.value, els.realPhotoPreview, "真人照片 URL 预览");
});

window.addEventListener("pagehide", () => {
  objectUrls.forEach((url) => URL.revokeObjectURL(url));
  objectUrls.clear();
});

els.recommendationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("正在保存内容...");
  try {
    const payload = contentItemPayload(event.currentTarget);
    const id = event.currentTarget.elements.id.value;
    const request = id
      ? supabase.from("content_items").update(payload).eq("id", id)
      : supabase.from("content_items").insert(payload);
    const { error } = await request;
    if (error) throw error;
    setStatus("内容已保存。");
    await loadContentItems();
    resetRecommendationForm();
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.recommendationList.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  const card = event.target.closest(".data-card");
  if (!button || !card) return;

  const item = contentItems.find((entry) => entry.id === card.dataset.id);
  if (!item) return;

  try {
    if (button.dataset.action === "edit") editContentItem(item);
    if (button.dataset.action === "up") await moveContentItem(item, -10);
    if (button.dataset.action === "down") await moveContentItem(item, 10);
    if (button.dataset.action === "toggle") await togglePublish(item);
    if (button.dataset.action === "duplicate") await duplicateContentItem(item);
    if (button.dataset.action === "delete") await deleteContentItem(item.id);
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("正在保存资料...");
  try {
    const form = new FormData(event.currentTarget);
    const payload = {
      id: true,
      nickname: form.get("nickname").trim(),
      email: form.get("email").trim() || null,
      avatar_url: form.get("avatar_url").trim() || null,
      real_photo_url: form.get("real_photo_url").trim() || null,
      intro: form.get("intro").trim(),
      contacts: parseJson(form.get("contacts"), []),
      social_links: parseJson(form.get("social_links"), []),
    };
    const { error } = await supabase.from("profile").upsert(payload);
    if (error) throw error;
    setStatus("关于页资料已保存。");
  } catch (error) {
    setStatus(error.message, true);
  }
});

const { data } = await supabase.auth.getSession();
if (data.session) {
  try {
    await showAdmin(data.session);
  } catch (error) {
    setStatus(error.message, true);
    showLogin();
  }
} else {
  showLogin();
}
