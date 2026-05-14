# Supabase Integration Guide - Titãs da Robótica

## O que é Supabase?

Supabase é um backend PostgreSQL gerenciado + APIs em tempo real. Use para:
- **Storage**: Hospedar arquivos (imagens, PDFs)
- **Database**: Backup/sync de dados
- **Auth**: Autenticação integrada
- **Realtime**: WebSockets para updates em tempo real

## Setup (Já feito ✅)

### 1. Credenciais no `.env`
```env
SUPABASE_URL=https://trnxdkbkkgtkyuddtvaj.supabase.co
SUPABASE_KEY=sb_publishable_oM-MrSUzxwbUdkvQldSRLg_zudnP3Cb
```

### 2. Instalar dependências
```bash
pip install -r requirements.txt
```

Os pacotes adicionados:
- `supabase==2.4.1` — Client SDK oficial
- `python-dotenv==1.0.0` — Carregar variáveis de `.env`

## Usando Supabase no Código

### Opção 1: Upload de Arquivos para Storage

No **blog_app/supabase_client.py**, use:

```python
from blog_app.supabase_client import upload_file_to_supabase, get_public_url

# Em uma view Django ou modelo.save():
def upload_post_cover(file_obj, post_id):
    result = upload_file_to_supabase(
        bucket_name='blog-covers',
        file_path=f'posts/{post_id}/cover.jpg',
        file_content=file_obj.read()
    )
    
    if result.get('success'):
        public_url = get_public_url('blog-covers', f'posts/{post_id}/cover.jpg')
        return public_url
```

### Opção 2: Sincronizar Dados com Supabase

No **blog_app/models.py**, adicione hook no `save()`:

```python
def save(self, *args, **kwargs):
    super().save(*args, **kwargs)
    # Sincronizar com Supabase
    from blog_app.supabase_examples import example_sync_post_to_supabase
    example_sync_post_to_supabase(self)
```

### Opção 3: Consultar Dados do Supabase

```python
from blog_app.supabase_client import query_database

# Buscar posts publicados
posts = query_database('posts', {'status': 'published'})
```

## Setup no Dashboard Supabase (console.supabase.com)

### 1. Criar Buckets para Storage

Acesse **Storage** → **Create new bucket**:

- Nome: `blog-covers` → Public (marque "Public bucket")
- Nome: `edital-documents` → Public
- Nome: `edital-images` → Public

### 2. Criar Tabelas (Opcional - para sync)

Acesse **SQL Editor** → **Create a new query** → Cole:

```sql
-- Tabela de Posts (sync)
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  body TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP,
  author_id BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Editais (sync)
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
```

### 3. Configurar RLS (Row Level Security) - Opcional

Se quiser controlar acesso:

1. Na tabela **posts**, clique em **RLS**
2. Enable RLS
3. Create policy:
   - Name: "Public posts"
   - USING: `(status = 'published' OR auth.uid() IS NOT NULL)`

## Teste Local

1. **Ativar venv**:
   ```bash
   venv\Scripts\Activate.ps1
   ```

2. **Testar conexão Supabase**:
   ```bash
   python manage.py shell
   >>> from blog_app.supabase_client import supabase
   >>> print(supabase)  # Deve mostrar Client object
   ```

3. **Testar upload**:
   ```python
   >>> from blog_app.supabase_client import upload_file_to_supabase, get_public_url
   >>> result = upload_file_to_supabase('blog-covers', 'test.txt', b'hello')
   >>> print(result)
   ```

## Arquivos Criados/Modificados

| Arquivo | Mudança |
|---------|---------|
| `requirements.txt` | +supabase, +python-dotenv |
| `.env` | +SUPABASE_URL, +SUPABASE_KEY |
| `backend/settings.py` | +SUPABASE_URL, +SUPABASE_KEY config |
| `blog_app/supabase_client.py` | **NOVO** - Cliente Supabase |
| `blog_app/supabase_examples.py` | **NOVO** - Exemplos de uso |

## Deploy em Railway/Render

1. **Adicionar vars de ambiente**:
   - `SUPABASE_URL=https://...`
   - `SUPABASE_KEY=sb_...`

2. **Nada mais muda** — as credenciais vêm do `.env` (Railway/Render injetam como env vars).

## Referências

- [Supabase Python Docs](https://supabase.com/docs/reference/python)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Django + Supabase](https://supabase.com/docs/guides/integrations/django)
