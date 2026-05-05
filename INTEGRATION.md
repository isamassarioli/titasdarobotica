# 🔗 Guia de Integração - Frontend + Backend Django

Integração prática entre o site frontend (HTML/CSS/JS) e o backend Django.

## 📌 Visão Geral

```
┌─────────────────────────┐
│  Blog Frontend          │
│  (HTML/CSS/JS)          │
│  - blog.html            │
│  - js/blog-api.js       │
└────────────┬────────────┘
             │ HTTP/REST
             ▼
┌─────────────────────────┐
│  Django Backend         │
│  - API REST             │
│  - Admin Django         │
│  - Banco de Dados       │
│  - Upload de Files      │
└─────────────────────────┘
```

---

## 🚀 Passos de Integração

### 1. Setup Inicial

#### Windows
```powershell
.\setup.bat
```

#### Mac/Linux
```bash
chmod +x setup.sh
./setup.sh
```

### 2. Ativar Virtual Environment

**Windows:**
```powershell
.\venv\Scripts\Activate.ps1
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. Criar Super-usuário (Admin)

```bash
python manage.py createsuperuser
```

Preencha:
- Username: `admin`
- Email: seu-email@example.com
- Password: sua-senha-forte

### 4. Rodar Django

```bash
python manage.py runserver
```

O servidor estará em: http://localhost:8000

### 5. Acessar Painéis

- **Admin Django**: http://localhost:8000/admin/
  - Login com suas credenciais
  - Crie Posts e Editais aqui

- **API REST**: http://localhost:8000/api/
  - Endpoint de Posts: http://localhost:8000/api/posts/
  - Endpoint de Editais: http://localhost:8000/api/editals/

- **Site Frontend**: abra `blog.html` no navegador
  - Posts carregarão dinamicamente da API
  - Carousel atualiza com novos posts

---

## 📝 Workflow Prático

### Criar um novo Post via Admin

1. Acesse: http://localhost:8000/admin/
2. Clique em **Posts**
3. Clique em **Add Post**
4. Preencha:
   - Title: "Meu primeiro post"
   - Category: "Competições"
   - Summary: "Resumo curto"
   - Body: "Conteúdo completo do post"
   - Cover Image: upload uma imagem
   - Status: "published"
   - Published at: data/hora atual
5. Click **Save**

✅ O post aparecerá automaticamente no carousel do `blog.html` em segundos!

### Criar um novo Edital via Admin

1. Acesse: http://localhost:8000/admin/
2. Clique em **Editals**
3. Clique em **Add Edital**
4. Preencha:
   - Title: "Edital 2026"
   - Description: "Descrição do edital"
   - Rules: "Regulamento aqui"
   - Document: upload um PDF
   - Image: upload uma imagem
   - Start date: data de início
   - End date: data de término
   - Status: "published"
5. Click **Save**

✅ O edital aparecerá na página de inscrições!

---

## 🛠️ Configurar CORS (Cross-Origin)

Se o frontend está em um domínio diferente do backend, configure CORS no `.env`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://seusite.com,https://seusite.com
```

Depois restart o Django:
```bash
python manage.py runserver
```

---

## 📊 Estrutura de Dados

### Tabela: Posts

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | Integer | ID único |
| title | String(200) | Título do post |
| slug | String (unique) | URL amigável (auto-gerado) |
| category | Choice | Categoria (competicoes, workshops, etc) |
| summary | Text | Resumo até 500 chars |
| body | Text | Conteúdo completo |
| cover_image | Image | Imagem de capa |
| status | Choice | draft, published, archived |
| author | FK (User) | Quem criou |
| published_at | DateTime | Quando foi publicado |
| created_at | DateTime | Quando foi criado |
| updated_at | DateTime | Última edição |

### Tabela: Editals

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | Integer | ID único |
| title | String(200) | Título do edital |
| slug | String (unique) | URL amigável |
| description | Text | Descrição |
| rules | Text | Regulamento |
| document | File | PDF do regulamento |
| image | Image | Imagem |
| status | Choice | draft, published, closed, archived |
| start_date | DateTime | Início inscrições |
| end_date | DateTime | Fim inscrições |
| author | FK (User) | Quem criou |
| created_at | DateTime | Criado em |
| updated_at | DateTime | Última edição |

---

## 🔌 Consumir API via JavaScript

### No seu `blog.html`:

```html
<!-- Adicione após seus scripts -->
<script src="js/blog-api.js"></script>
```

### Exemplos de uso:

**Buscar posts:**
```javascript
blogApi.getPosts().then(data => {
  console.log('Posts:', data.results);
});
```

**Buscar últimos posts:**
```javascript
blogApi.getLatestPosts().then(posts => {
  console.log('Últimos posts:', posts);
});
```

**Buscar posts por categoria:**
```javascript
blogApi.getPostsByCategory('competicoes').then(posts => {
  console.log('Posts de competições:', posts);
});
```

**Buscar um post específico:**
```javascript
blogApi.getPostBySlug('meu-primeiro-post').then(post => {
  console.log('Post:', post);
});
```

**Buscar editais abertos:**
```javascript
blogApi.getOpenEditals().then(editals => {
  console.log('Editais abertos:', editals);
});
```

---

## 🔐 Autenticação (Para Admin)

Se quiser criar/editar posts via JavaScript (para painel admin customizado):

**Obter token:**
```javascript
const response = await fetch('http://localhost:8000/api-token-auth/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'sua-senha'
  })
});
const { token } = await response.json();
```

**Usar token em requisições:**
```javascript
fetch('http://localhost:8000/api/posts/', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Novo Post',
    category: 'competicoes',
    summary: 'Resumo',
    body: 'Conteúdo',
    status: 'published'
  })
})
```

---

## 🐛 Troubleshooting

### "CORS Error" no console
- Verifique `CORS_ALLOWED_ORIGINS` no `.env`
- Certifique-se que Django está rodando
- Reinicie Django após mudar `.env`

### "Posts não aparecem"
- Certifique-se de que posts têm `status=published`
- Cheque se a API retorna dados: http://localhost:8000/api/posts/
- Abra o console (F12) para ver erros

### "Imagens não carregam"
- Certifique-se que `MEDIA_URL` e `MEDIA_ROOT` estão configurados
- Reinicie Django
- Imagens devem estar em `/media/blog/covers/`

### Upload falhando
- Verifique permissões da pasta `/media/`
- Instale Pillow: `pip install Pillow`
- Reinicie Django

---

## 📦 Deploy em Produção

### Checklist antes de publicar

```bash
# 1. Coletar arquivos estáticos
python manage.py collectstatic --noinput

# 2. Executar testes (se houver)
python manage.py test

# 3. Gerar SECRET_KEY segura
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# 4. Configurar variáveis de produção no .env
# SECRET_KEY=sua-chave-gerada
# DEBUG=False
# ALLOWED_HOSTS=seusite.com,www.seusite.com
# DATABASE_URL=postgresql://user:pass@db-host:5432/db-name
```

### Deploy Heroku (Recomendado)

```bash
# 1. Login no Heroku
heroku login

# 2. Criar app
heroku create seu-app-titas-api

# 3. Configurar variáveis
heroku config:set SECRET_KEY="sua-chave-gerada" -a seu-app-titas-api
heroku config:set DEBUG=False -a seu-app-titas-api
heroku config:set DATABASE_URL="sua-url-postgres" -a seu-app-titas-api

# 4. Deploy
git push heroku main

# 5. Rodar migrações
heroku run python manage.py migrate -a seu-app-titas-api

# 6. Criar superusuário em produção
heroku run python manage.py createsuperuser -a seu-app-titas-api

# 7. Abrir site
heroku open -a seu-app-titas-api
```

API estará em: `https://seu-app-titas-api.herokuapp.com/api/`

### Atualizar CORS no frontend em produção

Edite `js/blog-api.js`:

```javascript
// Mudar de:
const API_URL = 'http://localhost:8000/api';

// Para:
const API_URL = 'https://seu-app-titas-api.herokuapp.com/api';
```

---

## 📞 Suporte

Dúvidas ou problemas?

- **Email**: contato@titasdarobotica.com.br
- **Instagram**: @titasdarobotica
- **Documentação Django**: https://docs.djangoproject.com
- **Documentação DRF**: https://www.django-rest-framework.org

---

## 📜 Checklist de Integração

- [ ] Setup Python e virtual environment
- [ ] Instalar dependências (`requirements.txt`)
- [ ] Criar `.env` a partir de `.env.example`
- [ ] Rodar `python manage.py migrate`
- [ ] Criar super-usuário
- [ ] Rodar Django em desenvolvimento
- [ ] Acessar Admin e criar Posts/Editais de teste
- [ ] Verificar se `blog.html` carrega posts dinamicamente
- [ ] Configurar CORS se necessário
- [ ] Testar uploads de imagem/arquivo
- [ ] Configurar deploy (Heroku/PythonAnywhere/etc)
- [ ] Testar em produção

---

**✅ Backend integrado com sucesso!**

Agora você tem:
- ✅ Admin Django completo para gerenciar conteúdo
- ✅ API REST para consumir dados no frontend
- ✅ Upload de imagens e arquivos
- ✅ Autenticação e permissões
- ✅ Banco de dados persistente
- ✅ Pronto para escalar em produção

