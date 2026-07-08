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

function authHeaders(extra = {}) {
  const session = readSession();
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`,
    ...extra,
  };
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
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${this.table}${query ? `?${query}` : ""}`, {
      method: this.method,
      headers: authHeaders({
        "Content-Type": "application/json",
        ...this.headers,
      }),
      body: this.body ? JSON.stringify(this.body) : undefined,
    });

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
        const session = {
          access_token: result.data.access_token,
          refresh_token: result.data.refresh_token,
          user: result.data.user,
        };
        writeSession(session);
        return { data: { session }, error: null };
      }

      return result;
    },

    async getSession() {
      return { data: { session: readSession() }, error: null };
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
          const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`, {
            method: "POST",
            headers: authHeaders({
              "Content-Type": file.type || "application/octet-stream",
            }),
            body: file,
          });
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
