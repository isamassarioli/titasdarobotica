# Deploy Django no Railway

Este guia cobre apenas o backend Django. O frontend estático pode continuar separado no Vercel ou em outro host de arquivos estáticos.

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

⚠️ **CRÍTICO:** Este passo é obrigatório. Sem essas variáveis, o deploy falhará com "Application failed to respond".

Na página do projeto Railway:

1. Clique em **Variables** ou **Settings**
2. Clique em **New Variable** para cada linha abaixo
3. Copie EXATAMENTE (substitua `seu-app` pelo seu domínio Railway):

```
DEBUG=False
SECRET_KEY=eypvrbor9wa6&ula2v2r(0@a@vd_xc(v=273-rpie=2jmiiq6y
ALLOWED_HOSTS=seu-app.railway.app
CORS_ALLOWED_ORIGINS=https://seu-app.railway.app,http://localhost:8000
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000
```

**Importante:** Substitua `seu-app.railway.app` pelo seu domínio exato (sem `https://`, apenas o hostname).

## Passo 4: Database PostgreSQL

Railway oferece PostgreSQL gratuito. **Este passo cria a variável `DATABASE_URL` automaticamente:**

1. No painel do projeto, clique em **+ New Service**
2. Selecione **Database** → **PostgreSQL**
3. Aguarde criar (leva ~30 segundos)
4. Railway **automaticamente** adiciona `DATABASE_URL` às suas variables
5. ✅ Pronto! Django usará PostgreSQL automaticamente

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

### Application failed to respond
**Causa mais comum:** Variáveis de ambiente não configuradas no Railway.

**Solução:**
1. Acesse **Logs** no deployment com erro
2. Procure por `DisallowedHost`, `ImproperlyConfigured`, ou `OperationalError`
3. Verifique que TODAS as 8 variáveis foram configuradas corretamente (ver Passo 3)
4. Confirme que `ALLOWED_HOSTS=seu-app.railway.app` (sem protocolo)
5. Se configurou tudo, faça `git push` novamente (Railway vai redeploy automaticamente)

Ver também: [RAILWAY-SETUP.md](RAILWAY-SETUP.md)

### Build falha com erro de Python
- Railway pode estar usando versão errada
- Confirme `runtime.txt` tem: `python-3.14.3`

### 500 Error no acesso
- Verifique `DEBUG=False` está setado em Variables
- Cheque `ALLOWED_HOSTS` inclui seu domínio Railway (exatamente)
- Veja logs: "Deployments" → "Logs"

### Database não conecta
- DATABASE_URL é adicionado automaticamente pelo Railway PostgreSQL service
- Se não aparecer nas Variables, recrie o PostgreSQL service

### Static files não carregam
- Django já tem `whitenoise` configurado
- Coleta automática na hora do deploy via Procfile `release` command

Se a interface do admin aparecer sem estilo (apenas HTML cru), significa que os arquivos estáticos não foram coletados. Garanta que você fez push com o `Procfile` atualizado e permita que o deploy rode novamente — ou execute manualmente no shell do serviço:

```bash
python manage.py collectstatic --noinput
```
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
