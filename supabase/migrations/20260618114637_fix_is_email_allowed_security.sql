-- Fix mutable search_path and revoke public execute on is_email_allowed
CREATE OR REPLACE FUNCTION public.is_email_allowed(check_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.allowed_emails
    WHERE email = lower(trim(check_email))
  );
END;
$$;

-- Revoke execute from public roles — only service role (used by edge functions) should call this
REVOKE EXECUTE ON FUNCTION public.is_email_allowed(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_email_allowed(text) FROM authenticated;
