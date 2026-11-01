import { createClient } from "@supabase/supabase-js";

function resolveUrl(): string {
  let raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  raw = raw.replace(/^["']|["']$/g, "").trim();

  if (!raw) {
    return "https://ryrjgrgelpjswkwehocx.supabase.co";
  }

  if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
    return `https://${raw}`;
  }

  return raw;
}

function resolveKey(): string {
  let raw = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
  raw = raw.replace(/^["']|["']$/g, "").trim();

  if (!raw) {
    return "sb_publishable_vH6hRZux8tVGz4WxLwXPdA_b_g5a1FV";
  }

  return raw;
}

export const supabase = createClient(resolveUrl(), resolveKey());
