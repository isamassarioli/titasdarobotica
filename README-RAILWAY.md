# Deploy Django no Railway

## Passo 1: Criar Conta Railway
1. Vá para https://railway.app
2. Clique em "Login/Signup"
3. Faça login com GitHub ou crie conta
4. Conecte seu repositório GitHub

## Passo 2: Criar Novo Projeto
1. Clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Authorize Railway com seu GitHub
4. Selecione o repositório `titasdarobotica`
5. Clique em "Deploy Now"

## Passo 3: Configurar Variáveis de Ambiente
Na página do projeto Railway:

1. Clique em "Variables" ou acesse Settings
2. Adicione as seguintes variáveis:

```
DEBUG=False
SECRET_KEY=seu-secret-key-gerado (você tem em .env local)
ALLOWED_HOSTS=seu-app.railway.app,localhost
DATABASE_URL=postgresql://user:password@host:port/dbname
```

### Para gerar nova SECRET_KEY (se não tiver):
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

## Passo 4: Database PostgreSQL
Railway oferece PostgreSQL gratuito:

1. No painel do projeto, clique em "+ New Service"
2. Selecione "Database" → "PostgreSQL"
3. Railway automaticamente adiciona `DATABASE_URL` às variáveis
4. ✅ Pronto! Django usará PostgreSQL automaticamente

## Passo 5: Deploy Automático
- Sempre que você fizer `git push`, Railway redeploya automaticamente
- Verifique logs em "Deployments" → clique na linha do build
- Erros aparecem na aba "Logs"

## Passo 6: Acessar o App
- URL do seu app: `https://seu-app.railway.app`
- Admin: `https://seu-app.railway.app/admin/`
- API: `https://seu-app.railway.app/api/posts/`

## Passo 7: Criar Superuser no Railway
```bash
railway run python manage.py createsuperuser
```
Ou pelo painel:
- Vá em "Deployments" → clique em "Services"
- Clique no serviço web
- Clique em "shell" ou "terminal"
- Execute: `python manage.py createsuperuser`

## Troubleshooting

### Build falha com erro de Python
- Railway pode estar usando versão errada
- Confirme `runtime.txt` tem: `python-3.14.3`

### 500 Error no acesso
- Verifique `DEBUG=False` está setado
- Cheque `ALLOWED_HOSTS` inclui seu domínio Railway
- Veja logs: "Deployments" → "Logs"

### Database não conecta
- DATABASE_URL é adicionado automaticamente pelo Railway
- Se não aparecer, recrie o PostgreSQL service

### Static files não carregam
- Django já tem `whitenoise` configurado
- Coleta automática na hora do deploy via Procfile `release` command

## Arquivo .gitignore
Confirme que você tem `.gitignore` com:
```
.env
db.sqlite3
venv/
__pycache__/
*.pyc
media/
staticfiles/
```

## Próximos passos
1. Faça push: `git push origin main`
2. Railway detecta changes automaticamente
3. Aguarde ~3-5 minutos para deploy
4. Acesse sua URL pública

## Atualizar Frontend para API Pública
No arquivo `js/blog-api.js`, mude:

```javascript
// De:
const baseUrl = 'http://localhost:8000/api'

// Para:
const baseUrl = 'https://seu-app.railway.app/api'
```

E em `blog.html` também configure a URL correta.

---

**Necessário fazer push para Railway?**
Sim! Precisa fazer commit e push do código para GitHub:

```bash
git add .
git commit -m "Configure Railway deployment"
git push origin main
```
