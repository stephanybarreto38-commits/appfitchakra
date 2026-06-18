/*
# ChakraFit - Schema inicial con autenticación Supabase OTP

## Descripción
Migra la persistencia de datos de localStorage a Supabase con autenticación real
basada en OTP (One-Time Password) por correo electrónico.

## Tablas nuevas

1. **allowed_emails** - Lista de correos autorizados para acceder a la app
   - `email` (text, PK): correo en minúsculas
   - `invited_by` (text): correo de quien invitó
   - `invited_at` (timestamptz): fecha de invitación
   - `revoked` (boolean): si el acceso fue revocado

2. **profiles** - Perfil de cada usuaria autenticada
   - `id` (uuid, PK → auth.users): corresponde al auth.uid()
   - `email` (text, unique): correo
   - `name` (text): nombre de la usuaria
   - `created_at` (timestamptz)

3. **progress** - Progreso del viaje de 30 días
   - `user_id` (uuid, PK → profiles): owner
   - `day` (int): día actual (1-30)
   - `streak` (int): racha de días completados
   - `last_complete` (date): última vez que completó la rutina
   - `last_open` (date): última vez que abrió la app (para avanzar el día)
   - `updated_at` (timestamptz)

4. **completed_rituals** - Rituales completados
   - `user_id` (uuid → profiles)
   - `ritual_id` (text): identificador del ritual
   - `completed_at` (timestamptz)
   - PK: (user_id, ritual_id)

5. **ritual_step_progress** - Pasos de ritual marcados
   - `user_id` (uuid → profiles)
   - `ritual_id` (text)
   - `step_index` (int): índice del paso
   - `completed_at` (timestamptz)
   - PK: (user_id, ritual_id, step_index)

## Seguridad (RLS)
- Todas las tablas tienen RLS habilitado
- Cada usuaria solo puede ver/editar sus propios datos (auth.uid() = user_id/id)
- `allowed_emails` solo la administradora puede gestionarla (por JWT email)
- Función pública `is_email_allowed()` para verificar acceso sin exponer la lista
*/

-- ========================
-- allowed_emails
-- ========================
CREATE TABLE IF NOT EXISTS allowed_emails (
  email text PRIMARY KEY,
  invited_by text NOT NULL,
  invited_at timestamptz NOT NULL DEFAULT now(),
  revoked boolean NOT NULL DEFAULT false
);

ALTER TABLE allowed_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin manages allowed emails" ON allowed_emails;
CREATE POLICY "admin manages allowed emails" ON allowed_emails
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'stephanybarreto38@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'stephanybarreto38@gmail.com');

-- ========================
-- profiles
-- ========================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select own profile" ON profiles;
CREATE POLICY "select own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert own profile" ON profiles;
CREATE POLICY "insert own profile" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update own profile" ON profiles;
CREATE POLICY "update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ========================
-- progress
-- ========================
CREATE TABLE IF NOT EXISTS progress (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  day int NOT NULL DEFAULT 1,
  streak int NOT NULL DEFAULT 0,
  last_complete date,
  last_open date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select own progress" ON progress;
CREATE POLICY "select own progress" ON progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert own progress" ON progress;
CREATE POLICY "insert own progress" ON progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update own progress" ON progress;
CREATE POLICY "update own progress" ON progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ========================
-- completed_rituals
-- ========================
CREATE TABLE IF NOT EXISTS completed_rituals (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ritual_id text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, ritual_id)
);

ALTER TABLE completed_rituals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select own rituals" ON completed_rituals;
CREATE POLICY "select own rituals" ON completed_rituals
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert own rituals" ON completed_rituals;
CREATE POLICY "insert own rituals" ON completed_rituals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ========================
-- ritual_step_progress
-- ========================
CREATE TABLE IF NOT EXISTS ritual_step_progress (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ritual_id text NOT NULL,
  step_index int NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, ritual_id, step_index)
);

ALTER TABLE ritual_step_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select own steps" ON ritual_step_progress;
CREATE POLICY "select own steps" ON ritual_step_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert own steps" ON ritual_step_progress;
CREATE POLICY "insert own steps" ON ritual_step_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete own steps" ON ritual_step_progress;
CREATE POLICY "delete own steps" ON ritual_step_progress
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ========================
-- is_email_allowed (función pública)
-- ========================
CREATE OR REPLACE FUNCTION public.is_email_allowed(check_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM allowed_emails
    WHERE email = lower(check_email) AND revoked = false
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_email_allowed(text) TO anon, authenticated;
