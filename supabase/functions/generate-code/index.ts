import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_EMAIL = "stephanybarreto38@gmail.com";

function randomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  let code = "";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  for (const b of bytes) code += chars[b % chars.length];
  return code;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  const { email } = await req.json().catch(() => ({}));
  if (!email) return new Response(JSON.stringify({ error: "missing_email" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const normalizedEmail = (email as string).trim().toLowerCase();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Only admin can generate codes (extra safety — frontend also checks)
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "");
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Invalidate previous unused codes for this email
  await supabase.from("login_codes").update({ used: true }).eq("email", normalizedEmail).eq("used", false);

  const code = randomCode();
  const { error } = await supabase.from("login_codes").insert({
    email: normalizedEmail,
    code,
  });

  if (error) return new Response(JSON.stringify({ error: "db_error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  return new Response(JSON.stringify({ code }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
