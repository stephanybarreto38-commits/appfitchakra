import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_EMAIL = "stephanybarreto38@gmail.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  const { email, code, redirectTo } = await req.json().catch(() => ({}));
  if (!email || !code) {
    return new Response(JSON.stringify({ error: "missing_fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const normalizedEmail = (email as string).trim().toLowerCase();
  const normalizedCode = (code as string).trim().toUpperCase();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Admin bypasses code check — use existing auto-otp flow
  if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: normalizedEmail,
      options: { shouldCreateUser: true, redirectTo: redirectTo ?? "" },
    });
    if (error || !data?.properties?.action_link) {
      return new Response(JSON.stringify({ error: "generate_failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ action_link: data.properties.action_link }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Verify code against DB
  const { data: row } = await supabase
    .from("login_codes")
    .select("id, expires_at")
    .eq("email", normalizedEmail)
    .eq("code", normalizedCode)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!row) {
    return new Response(JSON.stringify({ error: "invalid_code" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Mark code as used
  await supabase.from("login_codes").update({ used: true }).eq("id", row.id);

  // Also check allowed_emails whitelist
  const { data: allowed } = await supabase.rpc("is_email_allowed", { check_email: normalizedEmail });
  if (!allowed) {
    return new Response(JSON.stringify({ error: "not_allowed" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Generate magic link → gives us a real action_link the client can navigate to
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: normalizedEmail,
    options: { shouldCreateUser: true, redirectTo: redirectTo ?? "" },
  });

  if (error || !data?.properties?.action_link) {
    return new Response(JSON.stringify({ error: "generate_failed", detail: error?.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ action_link: data.properties.action_link }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
