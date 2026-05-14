# 🔧 Resolvendo CORS - Admin Dashboard

## ❌ Problema Comum

Quando você abre `admin.html` como arquivo local (`file://`), a requisição fetch para `http://localhost:8000/api/...` é bloqueada pelo navegador (CORS).

```
fetch() → Error: blocked by CORS policy
```

## ✅ Solução 1: Servir via Django (Recomendado)

### 1. Configurar Django para servir admin.html

No `backend/urls.py`:

```python
from django.views.generic import TemplateView

urlpatterns = [
    # ... suas rotas
    path('admin-dashboard/', TemplateView.as_view(template_name='admin.html'), name='admin_dashboard'),
]
```

Agora acesse: **`http://localhost:8000/admin-dashboard/`**

**Pronto! CORS funciona porque tudo está no mesmo domínio.**

---

### 2. Ou servir como static file

Mova `admin.html` para `templates/`:

```bash
mv admin.html templates/admin.html
```

Em `backend/urls.py`:

```python
urlpatterns = [
    # ...
    path('admin/', TemplateView.as_view(template_name='admin.html'), name='admin'),
]
```

Acesse: **`http://localhost:8000/admin/`**

---

## ✅ Solução 2: Usar um Servidor Local

Se preferir manter `admin.html` como arquivo local, use um servidor:

### Com Python (embutido)

```bash
# Na pasta raiz do projeto
python -m http.server 8001
```

Depois acesse: **`http://localhost:8001/admin.html`**

### Com Node.js

```bash
# Instalar
npm install -g http-server

# Rodar
http-server -p 8001

# Acesse: http://localhost:8001/admin.html
```

---

## ⚙️ Configuração CORS já está Pronta

Seu `backend/settings.py` já tem CORS bem configurado:

```python
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True        # Permite qualquer origem em dev
    CORS_ALLOW_CREDENTIALS = True         # Permite cookies
    CORS_ALLOW_HEADERS = [                # Headers permitidos
        'accept',
        'accept-encoding',
        'authorization',
        'content-type',
        'x-requested-with',
        ...
    ]
```

---

## 🔍 Checklist de Debug

Se ainda tiver problemas:

### 1. **Verificar Console do Navegador**

Abra `F12` (DevTools) → Console → Procure por erros:

```javascript
// No console:
> fetch('http://localhost:8000/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username: 'admin', password: 'senha' })
})
```

Se funcionar no console, o problema é em outro lugar.

### 2. **Verificar Django rodando**

```bash
python manage.py runserver 0.0.0.0:8000
```

Acesse: **`http://localhost:8000/api/auth/login/`**

Deve retornar erro 405 (POST não permitido) ou pedir autenticação (OK).

### 3. **Limpar Cache**

```javascript
// No console do navegador:
localStorage.clear()
sessionStorage.clear()
location.reload(true)  // Hard refresh
```

---

## 📝 Seu admin.js já foi atualizado

Os fetches agora incluem:

```javascript
{
    headers: {
        'Authorization': `Token ${authToken}`,
        'X-Requested-With': 'XMLHttpRequest',    // ← Novo
        'Content-Type': 'application/json'
    },
    credentials: 'include'                       // ← Novo
}
```

Isso resolve 99% dos problemas de CORS.

---

## 🚀 Recomendação Final

**Use Solução 1:** Serve `admin.html` através do Django.

1. Mova para `templates/`
2. Registre rota em `urls.py`
3. Acesse via `http://localhost:8000/admin/`
4. Tudo funciona sem CORS problems!

