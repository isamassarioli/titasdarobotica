-- Complemento para o admin do site Titas da Robotica.
-- Rode no SQL Editor do Supabase.

ALTER TABLE posts
ADD COLUMN IF NOT EXISTS cover_image TEXT;

ALTER TABLE editals
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS document TEXT,
ADD COLUMN IF NOT EXISTS body TEXT;

-- Leitura publica para conteudo publicado.
DROP POLICY IF EXISTS "Public posts" ON posts;
CREATE POLICY "Public posts" ON posts
  FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Public editals" ON editals;
CREATE POLICY "Public editals" ON editals
  FOR SELECT
  USING (status IN ('published', 'open') OR auth.uid() IS NOT NULL);

-- Escrita apenas para usuarios autenticados do Supabase Auth.
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON posts;
CREATE POLICY "Authenticated users can insert posts" ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update posts" ON posts;
CREATE POLICY "Authenticated users can update posts" ON posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete posts" ON posts;
CREATE POLICY "Authenticated users can delete posts" ON posts
  FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert editals" ON editals;
CREATE POLICY "Authenticated users can insert editals" ON editals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update editals" ON editals;
CREATE POLICY "Authenticated users can update editals" ON editals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete editals" ON editals;
CREATE POLICY "Authenticated users can delete editals" ON editals
  FOR DELETE
  TO authenticated
  USING (true);
