import { recommendationPages, supabase } from "./site-supabase.js";

const els = {
  loginPanel: document.querySelector("#loginPanel"),
  adminPanel: document.querySelector("#adminPanel"),
  loginForm: document.querySelector("#loginForm"),
  logoutButton: document.querySelector("#logoutButton"),
  sessionEmail: document.querySelector("#sessionEmail"),
  statusLine: document.querySelector("#statusLine"),
  pageFilter: document.querySelector("#pageFilter"),
  recommendationForm: document.querySelector("#recommendationForm"),
  recommendationList: document.querySelector("#recommendationList"),
  resetRecommendation: document.querySelector("#resetRecommendation"),
  profileForm: document.querySelector("#profileForm"),
  coverUpload: document.querySelector("#coverUpload"),
  avatarUpload: document.querySelector("#avatarUpload"),
  realPhotoUpload: document.querySelector("#realPhotoUpload"),
  recommendationsView: document.querySelector("#recommendationsView"),
  profileView: document.querySelector("#profileView"),
};

let currentSession = null;
let recommendations = [];
const fallbackAdminEmails = new Set(["fengyuaimengyu@outlook.com"]);

function setStatus(message, isError = false) {
  els.statusLine.textContent = message;
  els.statusLine.style.color = isError ? "#b00020" : "";
}

function parseJson(value, fallback) {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return JSON.parse(trimmed);
}

function parseTags(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function fillPageSelect(select) {
  select.innerHTML = recommendationPages
    .map((page) => `<option value="${page.key}">${page.label}</option>`)
    .join("");
}

function mediaMarkup(url) {
  if (!url) return "";
  if (/\.(mp4|webm)(\?|$)/i.test(url)) {
    return `<video src="${url}" muted playsinline preload="metadata"></video>`;
  }
  return `<img src="${url}" alt="">`;
}

function recommendationPayload(form) {
  const data = new FormData(form);
  return {
    page_key: data.get("page_key"),
    title: data.get("title").trim(),
    description: data.get("description").trim(),
    cover_url: data.get("cover_url").trim() || null,
    link_url: data.get("link_url").trim() || null,
    category: data.get("category").trim() || null,
    tags: parseTags(data.get("tags")),
    extra: parseJson(data.get("extra"), {}),
    sort_order: Number(data.get("sort_order") || 0),
    is_published: data.get("is_published") === "on",
  };
}

function resetRecommendationForm() {
  els.recommendationForm.reset();
  els.recommendationForm.elements.id.value = "";
  els.recommendationForm.elements.page_key.value = els.pageFilter.value;
  els.recommendationForm.elements.sort_order.value = "0";
  els.recommendationForm.elements.is_published.checked = true;
  els.recommendationForm.elements.extra.value = "";
}

function editRecommendation(item) {
  const form = els.recommendationForm;
  form.elements.id.value = item.id;
  form.elements.page_key.value = item.page_key;
  form.elements.sort_order.value = item.sort_order ?? 0;
  form.elements.title.value = item.title ?? "";
  form.elements.description.value = item.description ?? "";
  form.elements.category.value = item.category ?? "";
  form.elements.link_url.value = item.link_url ?? "";
  form.elements.cover_url.value = item.cover_url ?? "";
  form.elements.tags.value = (item.tags ?? []).join(", ");
  form.elements.extra.value = JSON.stringify(item.extra ?? {}, null, 2);
  form.elements.is_published.checked = Boolean(item.is_published);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteRecommendation(id) {
  if (!window.confirm("确定删除这张卡片吗？")) return;
  const { error } = await supabase.from("recommendations").delete().eq("id", id);
  if (error) throw error;
  setStatus("已删除卡片。");
  await loadRecommendations();
}

function renderRecommendations() {
  const pageKey = els.pageFilter.value;
  const items = recommendations.filter((item) => item.page_key === pageKey);

  if (!items.length) {
    els.recommendationList.innerHTML = `<p class="status-line">这个页面还没有后台卡片。前台会继续显示当前静态内容。</p>`;
    return;
  }

  els.recommendationList.innerHTML = items
    .map((item) => `
      <article class="data-card" data-id="${item.id}">
        <div class="data-card__media">${mediaMarkup(item.cover_url)}</div>
        <div>
          <div class="data-card__meta">${item.category || item.page_key} · ${item.is_published ? "已发布" : "草稿"}</div>
          <h3>${item.title}</h3>
          <p>${item.description || ""}</p>
        </div>
        <div class="data-card__actions">
          <button class="ghost-button" type="button" data-action="edit">编辑</button>
          <button class="danger-button" type="button" data-action="delete">删除</button>
        </div>
      </article>
    `)
    .join("");
}

async function loadRecommendations() {
  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  recommendations = data ?? [];
  renderRecommendations();
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
  if (!adminCheck.ok) {
    throw new Error(adminCheck.message);
  }

  currentSession = session;
  els.loginPanel.hidden = true;
  els.adminPanel.hidden = false;
  els.logoutButton.hidden = false;
  els.sessionEmail.textContent = session.user.email;

  try {
    await Promise.all([loadRecommendations(), loadProfile()]);
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

async function uploadToStorage(file, folder) {
  if (!file) return "";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filePath = `admin-uploads/${folder}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("site-media").upload(filePath, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("site-media").getPublicUrl(filePath);
  return data.publicUrl;
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
  renderRecommendations();
  resetRecommendationForm();
});

els.resetRecommendation.addEventListener("click", resetRecommendationForm);

els.coverUpload.addEventListener("change", async (event) => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  setStatus("正在上传封面...");
  try {
    const url = await uploadToStorage(file, "covers");
    els.recommendationForm.elements.cover_url.value = url;
    setStatus("封面上传完成。");
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.avatarUpload.addEventListener("change", async (event) => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  setStatus("正在上传头像...");
  try {
    els.profileForm.elements.avatar_url.value = await uploadToStorage(file, "profile");
    setStatus("头像上传完成。");
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.realPhotoUpload.addEventListener("change", async (event) => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  setStatus("正在上传真人照片...");
  try {
    els.profileForm.elements.real_photo_url.value = await uploadToStorage(file, "profile");
    setStatus("真人照片上传完成。");
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.recommendationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("正在保存卡片...");
  try {
    const payload = recommendationPayload(event.currentTarget);
    const id = event.currentTarget.elements.id.value;
    const request = id
      ? supabase.from("recommendations").update(payload).eq("id", id)
      : supabase.from("recommendations").insert(payload);
    const { error } = await request;
    if (error) throw error;
    setStatus("卡片已保存。");
    await loadRecommendations();
    resetRecommendationForm();
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.recommendationList.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  const card = event.target.closest(".data-card");
  if (!button || !card) return;

  const item = recommendations.find((entry) => entry.id === card.dataset.id);
  if (!item) return;

  try {
    if (button.dataset.action === "edit") editRecommendation(item);
    if (button.dataset.action === "delete") await deleteRecommendation(item.id);
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
