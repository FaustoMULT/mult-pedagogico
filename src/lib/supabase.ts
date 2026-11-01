import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ryrjgrgelpjswkwehocx.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_vH6hRZux8tVGz4WxLwXPdA_b_g5a1FV";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
