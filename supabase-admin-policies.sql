-- Setup completo para o novo projeto Supabase dos Titas da Robotica.
-- Rode este arquivo no Supabase: SQL Editor -> New query -> Run.

CREATE TABLE IF NOT EXISTS public.posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'novidades',
  summary TEXT,
  body TEXT,
  status TEXT DEFAULT 'draft',
  cover_image TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.editals (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  body TEXT,
  rules TEXT,
  status TEXT DEFAULT 'draft',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  image TEXT,
  document TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at);

CREATE INDEX IF NOT EXISTS idx_editals_status ON public.editals(status);
CREATE INDEX IF NOT EXISTS idx_editals_slug ON public.editals(slug);
CREATE INDEX IF NOT EXISTS idx_editals_start_date ON public.editals(start_date);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_posts"
ON public.posts
FOR SELECT
USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "public_read_editals"
ON public.editals
FOR SELECT
USING (status IN ('published', 'open') OR auth.uid() IS NOT NULL);

CREATE POLICY "auth_insert_posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "auth_update_posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "auth_delete_posts"
ON public.posts
FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "auth_insert_editals"
ON public.editals
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "auth_update_editals"
ON public.editals
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "auth_delete_editals"
ON public.editals
FOR DELETE
TO authenticated
USING (true);
