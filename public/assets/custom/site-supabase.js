import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const SUPABASE_URL = "https://wwobcjkakedxyruxulfj.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_kstqQ4ttQbQp8KnXGozgcg_LYjet1bv";
export const SITE_MEDIA_BASE_URL = "https://wwobcjkakedxyruxulfj.supabase.co/storage/v1/object/public/site-media";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

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
