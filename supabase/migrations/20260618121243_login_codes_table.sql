CREATE TABLE IF NOT EXISTS login_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '48 hours'),
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON login_codes (email, code) WHERE NOT used;

ALTER TABLE login_codes ENABLE ROW LEVEL SECURITY;

-- Only service role (edge functions) can access this table
CREATE POLICY "service_role_only_select" ON login_codes FOR SELECT TO service_role USING (true);
CREATE POLICY "service_role_only_insert" ON login_codes FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "service_role_only_update" ON login_codes FOR UPDATE TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_only_delete" ON login_codes FOR DELETE TO service_role USING (true);
