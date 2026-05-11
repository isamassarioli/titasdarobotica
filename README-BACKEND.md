# 🚀 Backend Django - Titãs da Robótica

API REST para gerenciar Blog e Editais da plataforma Titãs da Robótica.

## 📋 Requisitos

- Python 3.8+
- pip
- Virtual environment (venv)

## 🔧 Setup Local

### 1. Criar e ativar virtual environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar variáveis de ambiente

Copie `.env.example` para `.env` e configure:
```bash
cp .env.example .env
```

**Edite `.env` com suas configurações:**
```
SECRET_KEY=sua-chave-secreta-gerada
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 4. Executar migrações

```bash
python manage.py migrate
```

### 5. Criar super-usuário (admin)

```bash
python manage.py createsuperuser
```

Siga o prompt e defina:
- Username: `admin`
- Email: seu-email@example.com
- Password: sua-senha-segura

### 6. Coletar arquivos estáticos (opcional em dev)

```bash
python manage.py collectstatic --noinput
```

### 7. Rodar servidor de desenvolvimento

```bash
python manage.py runserver
```

Acesse:
- **API**: http://localhost:8000/api/
- **Admin**: http://localhost:8000/admin/

---

## 📚 API Endpoints

### Posts (Blog)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/posts/` | Listar posts publicados | Não |
| POST | `/api/posts/` | Criar novo post | Admin |
| GET | `/api/posts/{slug}/` | Detalhe de um post | Não |
| PUT | `/api/posts/{slug}/` | Editar post | Admin |
| DELETE | `/api/posts/{slug}/` | Deletar post | Admin |
| GET | `/api/posts/latest/` | Últimos 3 posts | Não |
| GET | `/api/posts/by_category/?category=competicoes` | Posts por categoria | Não |

**Categorias disponíveis:**
- `competicoes`
- `workshops`
- `projetos`
- `eventos`
- `novidades`

### Editais

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/editals/` | Listar editais publicados | Não |
| POST | `/api/editals/` | Criar novo edital | Admin |
| GET | `/api/editals/{slug}/` | Detalhe de um edital | Não |
| PUT | `/api/editals/{slug}/` | Editar edital | Admin |
| DELETE | `/api/editals/{slug}/` | Deletar edital | Admin |
| GET | `/api/editals/open/` | Editais abertos para inscrição | Não |
| GET | `/api/editals/closed/` | Editais fechados/arquivados | Não |

### Statuses disponíveis

**Posts:**
- `draft` - Rascunho
- `published` - Publicado
- `archived` - Arquivado

**Editais:**
- `draft` - Rascunho
- `published` - Publicado
- `closed` - Fechado
- `archived` - Arquivado

---

## 🖥️ Painel Admin

Acesse: http://localhost:8000/admin/

Com suas credenciais de super-usuário você pode:
- ✅ Criar, editar e deletar Posts
- ✅ Criar, editar e deletar Editais
- ✅ Upload de imagens e arquivos
- ✅ Gerenciar status e datas de publicação
- ✅ Ver histórico de criação/edição

---

## 🔐 Autenticação e Permissões

### Session Authentication

A edição de conteúdo usa sessão do Django.

Fluxo recomendado:
1. Faça login em `/admin/`
2. Crie/edite conteúdo no Django Admin
3. A API pública (`/api/posts/`, `/api/editals/`) é consumida pelo frontend

---

## 📤 Upload de Arquivos

### Imagem de capa (Posts)

```bash
curl -X POST http://localhost:8000/api/posts/ \
  -b "sessionid=SEU_SESSIONID" \
  -F "title=Meu Post" \
  -F "category=competicoes" \
  -F "summary=Resumo curto" \
  -F "body=Conteúdo completo" \
  -F "cover_image=@/path/to/image.jpg" \
  -F "status=published"
```

### Arquivos em Editais

```bash
curl -X POST http://localhost:8000/api/editals/ \
  -b "sessionid=SEU_SESSIONID" \
  -F "title=Edital 2026" \
  -F "description=Descrição" \
  -F "rules=Regulamento aqui" \
  -F "document=@/path/to/regulations.pdf" \
  -F "image=@/path/to/image.jpg" \
  -F "status=published" \
  -F "start_date=2026-05-01T00:00:00Z" \
  -F "end_date=2026-06-01T00:00:00Z"
```

---

## 🌍 Consumir API no Frontend (JavaScript)

### Buscar posts publicados

```javascript
fetch('http://localhost:8000/api/posts/')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Buscar últimos posts

```javascript
fetch('http://localhost:8000/api/posts/latest/')
  .then(res => res.json())
  .then(posts => {
    posts.forEach(post => {
      console.log(post.title, post.published_at);
    });
  });
```

### Buscar editais abertos

```javascript
fetch('http://localhost:8000/api/editals/open/')
  .then(res => res.json())
  .then(editals => console.log(editals));
```

---

## 🚀 Deploy em Produção

### Opção 1: Heroku (Recomendado)

1. **Instale Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli

2. **Crie um arquivo `Procfile`:**
```
web: gunicorn backend.wsgi --log-file -
release: python manage.py migrate
```

3. **Faça deploy:**
```bash
heroku login
heroku create seu-app-titas
git push heroku main
heroku config:set SECRET_KEY="sua-chave-secreta-gerada"
heroku config:set DEBUG=False
heroku open
```

### Opção 2: PythonAnywhere

1. Acesse: https://www.pythonanywhere.com
2. Upload seu código
3. Configure Web app com WSGI
4. Configure variáveis de ambiente

### Opção 3: Vercel + Serverless (Avançado)

1. Instale `vercel`:
```bash
npm i -g vercel
```

2. Configure `vercel.json`:
```json
{
  "buildCommand": "pip install -r requirements.txt && python manage.py migrate",
  "env": {
    "SECRET_KEY": "@SECRET_KEY",
    "DEBUG": "False"
  }
}
```

3. Deploy:
```bash
vercel --prod
```

---

## 🗂️ Estrutura de Diretórios

```
titasdarobotica/
├── backend/                    # Configurações Django
│   ├── __init__.py
│   ├── settings.py            # Configurações
│   ├── urls.py                # Rotas principais
│   └── wsgi.py                # WSGI
├── blog_app/                  # App de Blog e Editais
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py               # Painel Admin
│   ├── apps.py
│   ├── models.py              # Modelos Post e Edital
│   ├── serializers.py         # Serializers DRF
│   ├── urls.py                # Rotas da API
│   └── views.py               # ViewSets e lógica
├── media/                     # Uploads (gitignore)
├── staticfiles/               # Arquivos estáticos (gitignore)
├── manage.py                  # CLI Django
├── requirements.txt           # Dependências Python
├── .env.example               # Exemplo de variáveis
└── db.sqlite3                 # DB local (gitignore)
```

---

## 🐛 Troubleshooting

### Erro: "No module named django"
```bash
pip install -r requirements.txt
```

### Erro: "ModuleNotFoundError: No module named 'PIL'"
```bash
pip install Pillow
```

### Erro: CORS bloqueado
Verifique se `CORS_ALLOWED_ORIGINS` em `.env` inclui seu domínio frontend.

### Migrações falhando
```bash
python manage.py migrate --fake-initial
python manage.py migrate
```

### Limpar cache de uploads
```bash
python manage.py shell
from django.core.cache import cache
cache.clear()
```

---

## 📞 Suporte

Dúvidas? Entre em contato:
- **Email**: contato@titasdarobotica.com.br
- **Instagram**: @titasdarobotica

---

## 📜 Licença

© 2026 Titãs da Robótica - IFES Colatina. Todos os direitos reservados.
