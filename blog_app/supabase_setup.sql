-- ===== SUPABASE SETUP SQL =====
-- Cole este script no SQL Editor do Supabase (console.supabase.com)
-- Isso criará as tabelas para sincronização

-- Tabela de Posts
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'novidades',
  summary TEXT,
  body TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP,
  author_id BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Editais
CREATE TABLE IF NOT EXISTS editals (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  rules TEXT,
  status TEXT DEFAULT 'draft',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  author_id BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);

CREATE INDEX IF NOT EXISTS idx_editals_status ON editals(status);
CREATE INDEX IF NOT EXISTS idx_editals_slug ON editals(slug);
CREATE INDEX IF NOT EXISTS idx_editals_start_date ON editals(start_date);

-- ===== CONFIGURAR RLS (Row Level Security) - OPCIONAL =====
-- Se quiser controlar acesso aos dados:

-- Habilitar RLS na tabela posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy para posts (qualquer um vê publicados, autenticados veem tudo)
CREATE POLICY "Public posts" ON posts
  FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

-- Habilitar RLS na tabela editals
ALTER TABLE editals ENABLE ROW LEVEL SECURITY;

-- Policy para editals (qualquer um vê publicados, autenticados veem tudo)
CREATE POLICY "Public editals" ON editals
  FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

-- ===== CRIAR BUCKETS STORAGE =====
-- Acesse o Dashboard → Storage → Create new bucket
-- Nomes dos buckets a criar:
-- 1. blog-covers (Public) - para capas de posts
-- 2. edital-documents (Public) - para PDFs/documentos
-- 3. edital-images (Public) - para imagens de editais
