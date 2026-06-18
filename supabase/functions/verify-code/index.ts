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

  const { email, code } = await req.json().catch(() => ({}));
  if (!email) {
    return new Response(JSON.stringify({ error: "missing_fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const normalizedEmail = (email as string).trim().toLowerCase();
  const normalizedCode = (code as string | undefined)?.trim().toUpperCase() ?? "";

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Non-admin: verify code against DB
  if (normalizedEmail !== ADMIN_EMAIL.toLowerCase()) {
    if (!normalizedCode) {
      return new Response(JSON.stringify({ error: "missing_fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: allowed } = await supabase.rpc("is_email_allowed", { check_email: normalizedEmail });
    if (!allowed) {
      return new Response(JSON.stringify({ error: "not_allowed" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

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

    await supabase.from("login_codes").update({ used: true }).eq("id", row.id);
  }

  // Generate magic link and return token_hash for client-side verifyOtp
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: normalizedEmail,
    options: { shouldCreateUser: true },
  });

  if (error || !data?.properties?.hashed_token) {
    return new Response(JSON.stringify({ error: "generate_failed", detail: error?.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ token_hash: data.properties.hashed_token }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
