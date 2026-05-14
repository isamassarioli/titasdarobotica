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

### Opção 2: Sincronizar Dados com Supabase (✅ Automático)

**Agora é automático!** Quando você cria/edita um Post ou Edital no admin:

1. Django salva o registro no banco local
2. Automaticamente sincroniza com a tabela Supabase
3. O campo `supabase_id` é preenchido
4. Admin mostra badge "✓ Sincronizado"

**Como funciona internamente:**
- Cada modelo (`Post`, `Edital`) tem método `_sync_to_supabase()`
- Chamado automaticamente no `save()`
- Cria novo registro ou atualiza existente
- Evita loops infinitos com `update_fields=['supabase_id']`

No código, é implementado assim (já está nos modelos):

```python
def save(self, *args, **kwargs):
    if not self.slug:
        self.slug = _unique_slug(Post, self.title, self.pk)
    super().save(*args, **kwargs)
    # Sincronizar com Supabase após salvar
    self._sync_to_supabase()

def _sync_to_supabase(self):
    """Sincroniza post com tabela Supabase"""
    try:
        from blog_app.supabase_client import supabase, insert_record, update_record
        # ... lógica de sync
    except Exception as e:
        print(f"Erro ao sincronizar: {str(e)}")
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

### 2. Criar Tabelas (Agora com autosync ✅)

Acesse **SQL Editor** → **Create a new query** → Cole:

```sql
-- Tabela de Posts (com todos os campos para sync)
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

-- Tabela de Editais (com todos os campos para sync)
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

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_editals_status ON editals(status);
CREATE INDEX IF NOT EXISTS idx_editals_slug ON editals(slug);
```

**Agora quando você cria/edita Posts ou Editais no Django Admin, eles sincronizam automaticamente com essas tabelas!**

## Teste Local

1. **Ativar venv**:
   ```bash
   venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. **Criar migrations e sincronizar banco Django**:
   ```bash
   python manage.py makemigrations blog_app
   python manage.py migrate
   ```

3. **Testar conexão Supabase**:
   ```bash
   python manage.py shell
   >>> from blog_app.supabase_client import supabase
   >>> print(supabase)  # Deve mostrar Client object
   ```

4. **Criar superuser**:
   ```bash
   python manage.py createsuperuser
   ```

5. **Rodar servidor Django**:
   ```bash
   python manage.py runserver
   ```
   Acesse `http://localhost:8000/admin/` e faça login.

6. **Testar autosync**:
   - Crie um novo **Post** ou **Edital** no admin
   - Veja o campo "Supabase" na lista passar de "⏳ Aguardando" para "✓ Sincronizado"
   - O `supabase_id` será preenchido automaticamente

## Arquivos Criados/Modificados

| Arquivo | Mudança |
|---------|---------|
| `requirements.txt` | +supabase, +python-dotenv |
| `.env` | +SUPABASE_URL, +SUPABASE_KEY |
| `backend/settings.py` | +SUPABASE_URL, +SUPABASE_KEY config |
| `blog_app/models.py` | +supabase_id field, +_sync_to_supabase() method, +get_absolute_url() |
| `blog_app/admin.py` | +supabase_synced_badge, updated list_display |
| `blog_app/supabase_client.py` | **NOVO** - Cliente Supabase |
| `blog_app/supabase_examples.py` | **NOVO** - Exemplos de uso |
| `blog_app/supabase_setup.sql` | **NOVO** - SQL para criar tabelas |
| `SUPABASE-SETUP.md` | **NOVO** - Este guia |

## Deploy em Railway/Render

1. **Adicionar vars de ambiente**:
   - `SUPABASE_URL=https://...`
   - `SUPABASE_KEY=sb_...`

2. **Nada mais muda** — as credenciais vêm do `.env` (Railway/Render injetam como env vars).

## Referências

- [Supabase Python Docs](https://supabase.com/docs/reference/python)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Django + Supabase](https://supabase.com/docs/guides/integrations/django)
