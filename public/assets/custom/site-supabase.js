export const SUPABASE_URL = "https://wwobcjkakedxyruxulfj.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_kstqQ4ttQbQp8KnXGozgcg_LYjet1bv";
export const SITE_MEDIA_BASE_URL = "https://wwobcjkakedxyruxulfj.supabase.co/storage/v1/object/public/site-media";

const SESSION_KEY = "fy-digital-life-admin-session";

export const recommendationPages = [
  { key: "useful-websites", label: "实用网站" },
  { key: "prompt-collection", label: "提示词宇宙" },
  { key: "skill-workflow", label: "Skill 工具箱" },
  { key: "photography", label: "摄影页" },
  { key: "agent-guide", label: "Agent 安装教程" },
];

export function publicMediaUrl(path) {
  const clean = path.replace(/^\/+/, "");
  return `${SITE_MEDIA_BASE_URL}/${clean}`;
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function writeSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function authHeaders(extra = {}, session = readSession()) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`,
    ...extra,
  };
}

function normalizeSession(data) {
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600),
    user: data.user,
  };
}

function isExpired(session) {
  if (!session?.access_token) return false;
  if (!session.expires_at) return false;
  return session.expires_at <= Math.floor(Date.now() / 1000) + 60;
}

async function refreshSession(session = readSession()) {
  if (!session?.refresh_token) return { data: { session: null }, error: new Error("登录已过期，请重新登录。") };

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  const result = await parseResponse(response);
  if (result.error) {
    clearSession();
    return result;
  }

  const nextSession = normalizeSession(result.data);
  writeSession(nextSession);
  return { data: { session: nextSession }, error: null };
}

async function getValidSession() {
  const session = readSession();
  if (!isExpired(session)) return { data: { session }, error: null };
  return refreshSession(session);
}

async function isExpiredJwtResponse(response) {
  if (response.status !== 401 && response.status !== 403) return false;
  const text = await response.clone().text().catch(() => "");
  return /jwt\s+expired|invalid\s+jwt|expired/i.test(text);
}

async function parseResponse(response) {
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = body?.msg || body?.message || body?.error_description || response.statusText;
    return { data: null, error: new Error(message) };
  }

  return { data: body, error: null };
}

class RestQuery {
  constructor(table) {
    this.table = table;
    this.method = "GET";
    this.params = new URLSearchParams();
    this.headers = {};
    this.body = null;
    this.orderParts = [];
  }

  select(columns = "*") {
    this.params.set("select", columns);
    return this;
  }

  order(column, options = {}) {
    this.orderParts.push(`${column}.${options.ascending === false ? "desc" : "asc"}`);
    return this;
  }

  eq(column, value) {
    this.params.set(column, `eq.${value}`);
    return this;
  }

  limit(value) {
    this.params.set("limit", String(value));
    return this;
  }

  single() {
    this.headers.Accept = "application/vnd.pgrst.object+json";
    return this;
  }

  insert(payload) {
    this.method = "POST";
    this.body = payload;
    this.headers.Prefer = "return=minimal";
    return this;
  }

  update(payload) {
    this.method = "PATCH";
    this.body = payload;
    this.headers.Prefer = "return=minimal";
    return this;
  }

  delete() {
    this.method = "DELETE";
    this.headers.Prefer = "return=minimal";
    return this;
  }

  upsert(payload) {
    this.method = "POST";
    this.body = payload;
    this.headers.Prefer = "resolution=merge-duplicates,return=minimal";
    return this;
  }

  async execute() {
    if (this.orderParts.length) {
      this.params.set("order", this.orderParts.join(","));
    }

    const query = this.params.toString();
    const url = `${SUPABASE_URL}/rest/v1/${this.table}${query ? `?${query}` : ""}`;
    const body = this.body ? JSON.stringify(this.body) : undefined;
    let { data: sessionData, error: sessionError } = await getValidSession();
    if (sessionError) return { data: null, error: sessionError };
    let response = await fetch(url, {
      method: this.method,
      headers: authHeaders({
        "Content-Type": "application/json",
        ...this.headers,
      }, sessionData.session),
      body,
    });

    if (await isExpiredJwtResponse(response)) {
      const { data, error } = await refreshSession(sessionData.session);
      if (error) return { data: null, error };
      response = await fetch(url, {
        method: this.method,
        headers: authHeaders({
          "Content-Type": "application/json",
          ...this.headers,
        }, data.session),
        body,
      });
    }

    return parseResponse(response);
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }
}

export const supabase = {
  auth: {
    async signInWithPassword({ email, password }) {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await parseResponse(response);

      if (!result.error) {
        const session = normalizeSession(result.data);
        writeSession(session);
        return { data: { session }, error: null };
      }

      return result;
    },

    async getSession() {
      return getValidSession();
    },

    async refreshSession() {
      return refreshSession();
    },

    async signOut() {
      const session = readSession();
      clearSession();
      if (session?.access_token) {
        await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${session.access_token}`,
          },
        }).catch(() => {});
      }
      return { error: null };
    },
  },

  from(table) {
    return new RestQuery(table);
  },

  storage: {
    from(bucket) {
      return {
        async upload(filePath, file) {
          const url = `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;
          let { data: sessionData, error: sessionError } = await getValidSession();
          if (sessionError) return { data: null, error: sessionError };
          let response = await fetch(url, {
            method: "POST",
            headers: authHeaders({
              "Content-Type": file.type || "application/octet-stream",
            }, sessionData.session),
            body: file,
          });

          if (await isExpiredJwtResponse(response)) {
            const { data, error } = await refreshSession(sessionData.session);
            if (error) return { data: null, error };
            response = await fetch(url, {
              method: "POST",
              headers: authHeaders({
                "Content-Type": file.type || "application/octet-stream",
              }, data.session),
              body: file,
            });
          }

          return parseResponse(response);
        },

        getPublicUrl(filePath) {
          return {
            data: {
              publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`,
            },
          };
        },
      };
    },
  },
};
