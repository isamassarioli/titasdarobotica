# Checklist: Autosync Supabase ✅

## O que foi feito

✅ **Modelos atualizados** (`blog_app/models.py`)
- Campo `supabase_id` (BigIntegerField) em Post e Edital
- Método `_sync_to_supabase()` para sincronizar automaticamente
- Hook no `save()` que chama o sync

✅ **Admin melhorado** (`blog_app/admin.py`)
- Badge "✓ Sincronizado" para posts/editais que já estão no Supabase
- Badge "⏳ Aguardando" para os que ainda não sincronizaram
- Campo `supabase_id` em read-only (automático)

✅ **Guia completo** (`docs/SUPABASE-SETUP.md`)
- Instruções passo-a-passo
- SQL pronto para copiar/colar
- Exemplos de uso

✅ **SQL pronto** (`blog_app/supabase_setup.sql`)
- Cria tabelas posts e editals
- Cria índices
- RLS configurado

---

## Próximos Passos (para você fazer agora)

### 1️⃣ Ativar venv e instalar deps
```powershell
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2️⃣ Rodar migrations Django
```bash
python manage.py makemigrations blog_app
python manage.py migrate
```

### 3️⃣ Setup no Supabase (console.supabase.com)

#### Criar Buckets:
1. Acesse **Storage** → **Create new bucket**
2. Crie 3 buckets (todos **Public**):
   - `blog-covers`
   - `edital-documents`
   - `edital-images`

#### Criar Tabelas:
1. Acesse **SQL Editor** → **Create a new query**
2. Cole o conteúdo de `blog_app/supabase_setup.sql`
3. Clique em **Run**

### 4️⃣ Testar localmente
```bash
python manage.py createsuperuser
python manage.py runserver
```

Acesse: `http://localhost:8000/admin/`

**Testar autosync:**
- Crie um novo **Post** ou **Edital**
- Salve
- Volte à lista — deve aparecer "✓ Sincronizado"
- O campo `supabase_id` será preenchido automaticamente
- Verifique em console.supabase.com → **posts** ou **editals** → a linha deve aparecer lá

### 5️⃣ (Opcional) Deploy em Railway

Quando estiver pronto para deploy:
1. Adicione vars de ambiente no Railway:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
2. Push para GitHub
3. Railway fará build automático

---

## Como Funciona (Visão Geral)

```
📝 Usuário cria Post no Admin
    ↓
🔄 Django salva em banco local (SQLite/PostgreSQL)
    ↓
🚀 Automático: Post._sync_to_supabase() é chamado
    ↓
📤 Dados enviados para tabela Supabase
    ↓
✅ supabase_id preenchido → Badge muda para "✓ Sincronizado"
```

**Resultado:** Django + Supabase em sync perfeito! Quando você faz deploy em produção, os dados já estão replicados.

---

## Troubleshooting

### ❌ "Erro ao sincronizar post com Supabase"
- Verifique `.env`: `SUPABASE_URL` e `SUPABASE_KEY` corretos?
- Verifique se as tabelas existem no Supabase (rode o SQL)
- Confira os nomes das tabelas (devem ser `posts` e `editals` em minúscula)

### ❌ "supabase_id não aparece"
- Rodou as migrations? `python manage.py migrate`
- Criou novo Post depois? (Posts antigos não terão sync retroativo)

### ❌ "Erro ao fazer makemigrations"
- Verifique se o venv está ativo
- Rode `pip install -r requirements.txt` de novo

---

## Dúvidas?

Consulte:
- [SUPABASE-SETUP.md](SUPABASE-SETUP.md) — Guia completo
- `blog_app/supabase_client.py` — Funções disponíveis
- `blog_app/supabase_examples.py` — Exemplos avançados
