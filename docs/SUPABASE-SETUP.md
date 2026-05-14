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

Acesse **SQL Editor** → **Create a new query** → Cole [blog_app/supabase_setup.sql](../blog_app/supabase_setup.sql):

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

## Deploy em Railway/Render

1. **Adicionar vars de ambiente**:
   - `SUPABASE_URL=https://...`
   - `SUPABASE_KEY=sb_...`

2. **Nada mais muda** — as credenciais vêm do `.env`

## Referências

- [Supabase Python Docs](https://supabase.com/docs/reference/python)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Django + Supabase](https://supabase.com/docs/guides/integrations/django)
