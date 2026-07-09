import { supabase } from "./site-supabase.js";

export async function fetchPublishedContentItems(pageKey) {
  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .eq("page_key", pageKey)
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at");

  if (error) {
    console.warn(`[FY Content] ${pageKey} content load failed:`, error.message);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export function normalizeTags(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value !== "string") return [];
  return value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

export async function fetchProfile() {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", true)
    .single();

  if (error) {
    console.warn("[FY Content] profile load failed:", error.message);
    return null;
  }

  return data;
}
