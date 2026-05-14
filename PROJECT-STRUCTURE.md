# Estrutura do Projeto - Titãs da Robótica

## 📁 Organização de Pastas

```
titasdarobotica/
├── docs/                          # 📚 Documentação do Projeto
│   ├── SUPABASE-SETUP.md         # Guia de integração Supabase
│   └── AUTOSYNC-CHECKLIST.md     # Checklist de autosync Django ↔ Supabase
│
├── templates/                     # 🎨 Templates HTML
│   ├── blog/
│   │   ├── list.html             # Listagem de posts
│   │   └── detail.html           # Detalhe de um post
│   ├── editais/
│   │   ├── list.html             # Listagem de editais
│   │   └── detail.html           # Detalhe de um edital
│   ├── index.html                # Homepage (raiz)
│   └── ...                        # Outros templates
│
├── blog_app/                      # 🐍 App Django de Blog/Editais
│   ├── models.py                 # Post, Edital (com autosync Supabase)
│   ├── admin.py                  # Admin interface
│   ├── views.py                  # API (DRF) + Frontend (templates)
│   ├── urls.py                   # Rotas da app
│   ├── serializers.py            # DRF serializers
│   ├── supabase_client.py        # Cliente Supabase (upload, queries)
│   ├── supabase_examples.py      # Exemplos de uso
│   ├── supabase_setup.sql        # SQL para criar tabelas Supabase
│   └── migrations/               # Migrações Django
│
├── backend/                       # ⚙️ Configuração Django
│   ├── settings.py               # Configurações (+ Supabase config)
│   ├── urls.py                   # Rotas principais
│   ├── wsgi.py                   # WSGI para deployment
│   └── __init__.py
│
├── css/                           # 🎨 Estilos
├── js/                            # 🔧 Scripts frontend
├── images/                        # 🖼️ Imagens
├── media/                         # 📦 Uploads de usuários
├── staticfiles/                   # 📄 Static files coletados
│
├── .env                           # 🔐 Variáveis de ambiente (NÃO comitar)
├── .gitignore                     # Arquivos ignorados
├── requirements.txt               # Dependências Python
├── manage.py                      # CLI Django
├── Procfile                       # Deploy em Railway/Render
├── vercel.json                    # Config Vercel
└── README.md                      # Documentação principal

```

## 🔄 Fluxo de Dados

```
📝 Admin Django (cria/edita Post ou Edital)
    ↓
💾 Salva em Django Models (banco local)
    ↓
🚀 Trigger automático: _sync_to_supabase()
    ↓
📤 Dados enviados para Supabase (tabelas: posts, editals)
    ↓
✅ supabase_id preenchido
    ↓
📡 Frontend carrega dados do Django (renderiza templates)
    ↓
🌐 Página pública: /blog/, /blog/<slug>, /editais/, /editais/<slug>
```

## 📖 Como Usar

### Novo Post/Edital
1. Acesse `http://localhost:8000/admin/`
2. Crie um novo **Post** ou **Edital**
3. Preencha campos e salve
4. Automaticamente sincroniza com Supabase
5. Aparece em `/blog/` ou `/editais/`

### Modificar Código Supabase
- Cliente SDK: `blog_app/supabase_client.py`
- Exemplos: `blog_app/supabase_examples.py`
- SQL: `blog_app/supabase_setup.sql`

### Documentação
- Setup inicial: `docs/SUPABASE-SETUP.md`
- Checklist: `docs/AUTOSYNC-CHECKLIST.md`

## 📝 Arquivos Principais Modificados

| Arquivo | O que mudou |
|---------|-----------|
| `blog_app/models.py` | +`supabase_id`, +`_sync_to_supabase()`, +`get_absolute_url()` |
| `blog_app/admin.py` | +badge de sincronização Supabase |
| `blog_app/views.py` | +templates views (blog/edital list + detail) |
| `blog_app/supabase_client.py` | **NOVO** - Cliente Supabase |
| `blog_app/supabase_examples.py` | **NOVO** - Exemplos |
| `blog_app/supabase_setup.sql` | **NOVO** - SQL tabelas |
| `backend/settings.py` | +Supabase config (SUPABASE_URL, KEY) |
| `backend/urls.py` | +rotas públicas: `/blog/`, `/editais/` |
| `requirements.txt` | +`supabase`, +`python-dotenv` |
| `.env` | +SUPABASE_URL, +SUPABASE_KEY |
| `templates/blog/` | **NOVO** - Templates blog (list, detail) |
| `templates/editais/` | **NOVO** - Templates editais (list, detail) |
| `docs/SUPABASE-SETUP.md` | **NOVO** - Guia |
| `docs/AUTOSYNC-CHECKLIST.md` | **NOVO** - Checklist |

## 🚀 Deploy

### Railway / Render
1. Conectar repositório
2. Adicionar env vars:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `DEBUG=false`
   - `SECRET_KEY`
   - `DATABASE_URL` (Postgres)
3. Build automático via Procfile

### Vercel (Frontend)
- Deploy estático via `vercel.json`

## 🐛 Troubleshooting

**Templates não aparecem?**
- Verifique o caminho em `blog_app/views.py`
- Execute `python manage.py collectstatic`

**Supabase não sincroniza?**
- Confira `.env`: `SUPABASE_URL` e `SUPABASE_KEY` corretos
- Rode SQL de `blog_app/supabase_setup.sql`
- Verifique console Django para erros

**Migrações falhando?**
- `python manage.py makemigrations blog_app`
- `python manage.py migrate`

