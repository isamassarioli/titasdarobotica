# 🚨 Corrigindo "Application failed to respond" no Railway

Se você vê esse erro no Railway, significa que o servidor Django não conseguiu iniciar. Siga estes passos:

## 1. Verificar Logs do Railway

1. Acesse seu projeto no Railway: https://railway.app
2. Clique em **Deployments** (última linha)
3. Clique no deployment com erro (mais recente)
4. Veja a aba **Logs** ou **Build Logs**
5. Procure por erros como:
   - `ModuleNotFoundError`
   - `ImproperlyConfigured`
   - `OperationalError` (banco de dados)
   - `DisallowedHost`

---

## 2. Configurar Variáveis de Ambiente no Railway

Essas variáveis **devem** ser setadas no painel do Railway para produção:

### Passo 1: Acesse Variables no Railway
1. Vá para seu projeto Railway
2. Clique em **Variables** ou **Settings**
3. Clique em **New Variable** ou **Configure**

### Passo 2: Adicione cada variável (COPIE EXATAMENTE):

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

**OBS:** Substitua `seu-app.railway.app` pelo seu domínio Railway real (veja em **Settings** → **Service Name**).

### Passo 3: Adicione Database

1. Clique em **+ New Service**
2. Selecione **Database** → **PostgreSQL**
3. Railway **automaticamente** adiciona `DATABASE_URL`

---

## 3. Deploy Limpo

Após configurar as variáveis:

```bash
# No seu terminal local:
git add .
git commit -m "Fix Railway deployment variables"
git push origin main
```

Railway **automaticamente** vai fazer redeploy (espere 2-3 minutos).

---

## 4. Se Ainda Não Funcionar: Checklist

- [ ] `DEBUG=False` está setado no Railway?
- [ ] `SECRET_KEY` tem valor forte (não `django-insecure-`)?
- [ ] `ALLOWED_HOSTS` é exatamente seu domínio Railway (sem `https://`)?
- [ ] PostgreSQL foi criado? (`DATABASE_URL` deve aparecer automaticamente)
- [ ] Você fez `git push` após mudar as variáveis?
- [ ] Esperou 3+ minutos para o deploy terminar?

---

## 5. Erro Comum: DisallowedHost

Se você ver:
```
DisallowedHost at /
Invalid HTTP_HOST header: 'meu-app.railway.app'. You may need to add them to ALLOWED_HOSTS.
```

**Solução:** Configure `ALLOWED_HOSTS` exatamente como seu domínio Railway:
```
ALLOWED_HOSTS=meu-app.railway.app
```

Sem protocolo (`https://`) e exatamente como Rails mostra na URL.

---

## 6. Erro: "No such table"

Se você ver erro de banco de dados no log:

```bash
# No Railway, execute:
railway run python manage.py migrate
```

Ou pelo painel:
1. Vá em **Services**
2. Clique no serviço web
3. Clique em **Terminal** ou **Shell**
4. Execute: `python manage.py migrate`

---

## 7. Criar Admin para Produção

```bash
railway run python manage.py createsuperuser
```

Siga as instruções para criar username, email e password.

---

## Checklist Final

- [ ] Variables todas preenchidas
- [ ] PostgreSQL criado (DATABASE_URL existe)
- [ ] Fez `git push` com as mudanças
- [ ] Esperou deploy terminar
- [ ] Testou acessar `/admin/` com admin/senha
- [ ] Testou acessar `/api/posts/`

Se ainda não funcionar, compartilhe o erro exato do log do Railway que eu ajudo a diagnosticar.
