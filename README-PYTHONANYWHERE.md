# Deploy Django no PythonAnywhere

PythonAnywhere é a forma mais simples de fazer deploy de Django. Não precisa de linha de comando complexa — tudo funciona pela web interface.

## Passo 1: Criar Conta PythonAnywhere
1. Vá para https://www.pythonanywhere.com
2. Clique em "Pricing" → escolha o plano (free tier é bom para começar)
3. Clique em "Sign up"
4. Confirme email
5. Faça login

## Passo 2: Clonar o Repositório

1. Na dashboard do PythonAnywhere, abra o **Bash console** ("New console" → "Bash")
2. Execute:
```bash
cd ~
git clone https://github.com/SeuUsuário/titasdarobotica.git
cd titasdarobotica
```

## Passo 3: Criar Virtual Environment e Instalar Dependências

1. Ainda no Bash console:
```bash
mkvirtualenv --python=/usr/bin/python3.10 titasdarobotica
pip install -r requirements.txt
pip install whitenoise gunicorn dj-database-url psycopg[binary]
```

2. Verifique que tudo foi instalado:
```bash
pip list | grep -E "Django|rest_framework|whitenoise|psycopg"
```

### Se o comando `mkvirtualenv` não existir

Algumas contas do PythonAnywhere usam um fluxo diferente de virtualenv. Se isso acontecer, use:

```bash
python3.10 -m venv ~/.virtualenvs/titasdarobotica
source ~/.virtualenvs/titasdarobotica/bin/activate
pip install -r requirements.txt
```

Depois, na aba **Web**, informe o caminho do ambiente como:

```text
/home/seuusuario/.virtualenvs/titasdarobotica
```

Se o painel aceitar só o nome, você também pode tentar:

```text
titasdarobotica
```

## Passo 4: Criar Arquivo .env Local

No Bash console:
```bash
cat > ~/titasdarobotica/.env << 'EOF'
DEBUG=False
SECRET_KEY=eypvrbor9wa6&ula2v2r(0@a@vd_xc(v=273-rpie=2jmiiq6y
ALLOWED_HOSTS=seususername.pythonanywhere.com,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://seususername.pythonanywhere.com,http://localhost:8000,http://127.0.0.1:8000
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000
EOF
```

**Substitua `seususername` pelo seu username PythonAnywhere!**

Se você também quiser ativar a sincronização com Supabase nesse ambiente, adicione estas variáveis no `.env` do projeto ou em Variables do PythonAnywhere:

```bash
SUPABASE_URL=https://trnxdkbkkgtkyuddtvaj.supabase.co
SUPABASE_KEY=sua_chave_anon_ou_service_role_aqui
```

Se o frontend estiver separado no Vercel, o Supabase continua no backend Django do PythonAnywhere. O Vercel não precisa da `SUPABASE_KEY` secreta.

## Passo 5: Coletar Static Files

```bash
cd ~/titasdarobotica
workon titasdarobotica
python manage.py collectstatic --noinput
```

## Passo 6: Criar e Migrar o Banco

```bash
python manage.py migrate
```

## Passo 7: Criar Superuser

```bash
python manage.py createsuperuser
```

Preencha:
- Username: `admin` (ou seu escolhido)
- Email: seu@email.com
- Password: senha forte

## Passo 8: Configurar Web App no PythonAnywhere

1. No menu à esquerda, clique em **Web**
2. Clique em **+ Add a new web app**
3. Escolha **Manual configuration** (não use o template Django)
4. Escolha **Python 3.10**
5. Você verá uma tela com o arquivo de configuração WSGI

### Editar o arquivo WSGI

1. Na página "Web", você verá um link para "WSGI configuration file"
2. Clique nele e substitua o conteúdo por:

```python
# /var/www/seususername_pythonanywhere_com_wsgi.py
import os
import sys
import django

# Add your project directory to the sys.path
project_home = '/home/seususername/titasdarobotica'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'

# Setup Django
django.setup()

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

**Substitua `seususername` pelo seu username!**

3. Clique em "Save"

### Configurar Static Files

1. Na página "Web", role para baixo até **Static files**
2. Clique em "Add a new static files mapping"
3. Preencha:
   - **URL**: `/static/`
   - **Directory**: `/home/seususername/titasdarobotica/staticfiles`
4. Clique em "Add"

## Passo 9: Recarregar Web App

1. Na página "Web", clique no botão verde **Reload `seususername.pythonanywhere.com`**
2. Aguarde ~10 segundos

## Passo 10: Acessar seu App

- **URL principal**: `https://seususername.pythonanywhere.com/`
- **Admin**: `https://seususername.pythonanywhere.com/admin/`
- **API**: `https://seususername.pythonanywhere.com/api/posts/`

Login com o superuser criado no Passo 7.

---

## Troubleshooting

### Admin sem estilo (sem CSS)
- Certifique-se que `collectstatic --noinput` foi executado
- Verifique que Static files mapping está correto (URL `/static/`, Directory `/staticfiles`)
- Clique em "Reload"

### "DisallowedHost" ou "ALLOWED_HOSTS"
- Edite `.env` em `~/titasdarobotica/.env`
- Certifique-se que `seususername.pythonanywhere.com` está em `ALLOWED_HOSTS`
- Clique em "Reload"

### 500 Error ou "Application failed to start"
- Abra **Log files** na página Web
- Procure por erros na aba "error log"
- Se há erro de import, volte ao Bash console e rode:
```bash
workon titasdarobotica
python manage.py check
```

### Database erro (Operational error)
- PythonAnywhere usa SQLite por padrão (arquivo `db.sqlite3`)
- Se o arquivo não existe, crie com migrations:
```bash
workon titasdarobotica
cd ~/titasdarobotica
python manage.py migrate
```

### Preciso fazer push de novas alterações
- Toda vez que fizer `git push` no seu repo, você precisa fazer pull no PythonAnywhere:
```bash
cd ~/titasdarobotica
git pull origin main
```
- Se alterou Python code ou static files, clique em "Reload" depois

---

## Atualizar Frontend para API Pública

No arquivo `js/blog-api.js`, mude:

```javascript
// De:
const baseUrl = 'http://localhost:8000/api'

// Para:
const baseUrl = 'https://seususername.pythonanywhere.com/api'
```

E em `blog.html` também configure a URL correta.

---

## Fluxo Recomendado Para O Seu Caso

Como vocês saíram da Railway, o fluxo mais limpo agora é:

1. **PythonAnywhere**: hospeda o Django, o admin, a API e o Supabase no backend.
2. **Vercel**: hospeda apenas o frontend estático, se vocês quiserem separar.
3. **Supabase**: fica configurado no backend do PythonAnywhere, não no Vercel.

Se você estiver usando apenas PythonAnywhere, pode ignorar o Vercel por enquanto e manter tudo no mesmo lugar.

---

## Resumo dos Passos

| Passo | O quê | Onde |
|-------|-------|------|
| 1-2 | Conta + clonar repo | https://pythonanywhere.com |
| 3 | Virtualenv + pip | Bash console |
| 4 | .env | Bash console |
| 5-7 | Collectstatic + migrate + superuser | Bash console |
| 8-9 | WSGI + Static files + Reload | Web app dashboard |
| 10 | Testar | Browser |

---

**Pronto! Seu Django está online no PythonAnywhere!**
