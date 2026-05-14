# 📚 Guia de Publicação - Posts e Editais

Sistema completo para publicar posts de blog e editais com subpáginas dinâmicas.

---

## 🚀 Como Começar

### 1. Certifique-se que o Django está rodando

```bash
# Ative o venv
venv\Scripts\Activate.ps1

# Rode o servidor
python manage.py runserver 0.0.0.0:8000
```

**Acesse:**
- Admin Django: http://localhost:8000/admin-panel/
- Admin Dashboard: http://localhost:8000/admin/
- Blog Público: http://localhost:8000/blog
- Editais Público: http://localhost:8000/editais

---

## 📝 Publicar um Novo Post de Blog

### Opção 1: Via Dashboard Admin (Recomendado)

1. **Abra** http://localhost:8000/admin/
2. **Faça login** com suas credenciais
3. **Clique** em "➕ Novo Post"
4. **Preencha os campos:**
   - **Título**: Ex: "Participação na Feira Tecnológica"
   - **Categoria**: Competições, Workshops, Projetos, Eventos ou Novidades
   - **Status**: Rascunho ou Publicado
   - **Resumo**: Descrição breve (mostra na lista)
   - **Conteúdo**: HTML ou texto com formatação
   - **Imagem de Capa**: Foto do evento/artigo
5. **Clique** "Publicar"

**Resultado:**
- ✅ Post salvo no banco de dados
- ✅ Slug gerado automaticamente (ex: `participacao-na-feira-tecnologica`)
- ✅ Aparece em http://localhost:8000/blog
- ✅ Subpágina criada: http://localhost:8000/blog/participacao-na-feira-tecnologica/
- ✅ Botão "Leia Mais" funciona e leva à subpágina

### Opção 2: Via Django Admin Padrão

1. **Abra** http://localhost:8000/admin-panel/
2. **Vá para** Blog App → Posts
3. **Clique** "Add Post"
4. **Preencha** (igual ao passo anterior)
5. **Salve**

---

## 📋 Publicar um Novo Edital

### Opção 1: Via Dashboard Admin

1. **Abra** http://localhost:8000/admin/
2. **Clique** em "📝 Editais" (abrir sidebar para ver)
3. **Preencha os campos:**
   - **Título**: Ex: "Seleção de Novos Membros"
   - **Descrição**: Texto completo do edital
   - **Regras**: Requisitos e critérios
   - **Documento**: PDF do edital (opcional)
   - **Imagem**: Banner do edital
   - **Status**: Aberto, Fechado, Próximo, etc.
   - **Data de Início**: Quando abre as inscrições
   - **Data de Término**: Quando fecha
4. **Clique** "Publicar"

**Resultado:**
- ✅ Edital salvo
- ✅ Slug gerado (ex: `selecao-de-novos-membros`)
- ✅ Aparece em http://localhost:8000/editais
- ✅ Subpágina criada: http://localhost:8000/editais/selecao-de-novos-membros/

### Opção 2: Via Django Admin

1. **Abra** http://localhost:8000/admin-panel/
2. **Blog App → Editals**
3. **Clique** "Add Edital"
4. **Preencha** (igual ao passo anterior)

---

## 🔗 Estrutura de URLs

### Posts (Blog)

```
/blog/                                    # Página de listagem
/blog/seu-titulo-do-post/                # Página individual
```

**Exemplo:**
```
/blog/
/blog/participacao-na-feira-tecnologica-do-es/
/blog/novo-robo-humanoide-em-desenvolvimento/
```

### Editais

```
/editais/                                 # Página de listagem
/editais/seu-titulo-do-edital/           # Página individual
```

**Exemplo:**
```
/editais/
/editais/selecao-de-novos-membros/
/editais/inscricoes-abertas-2026/
```

---

## 🎨 Conteúdo HTML

### Posts podem incluir:

```html
<h2>Subtítulo do Artigo</h2>
<p>Parágrafo com <strong>texto em negrito</strong>.</p>

<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<img src="https://example.com/image.jpg" alt="Descrição">
```

### Editais podem incluir:

```html
<h2>Requisitos:</h2>
<ul>
  <li>Ser aluno do IFES</li>
  <li>Ter disponibilidade</li>
</ul>

<h2>Benefícios:</h2>
<p>Participar de competições importantes...</p>
```

---

## 📸 Upload de Imagens

### No Admin Dashboard

1. **Clique** em "Imagem de Capa" (Posts) ou "Imagem" (Editais)
2. **Selecione** o arquivo do seu computador
3. **A imagem** é enviada para Supabase automaticamente
4. **URL** é salva no banco de dados

### Suporte a Formatos

- ✅ JPG/JPEG
- ✅ PNG
- ✅ WebP
- ✅ GIF

---

## 🔄 Fluxo Completo de Publicação

```
1. Abra o Admin Dashboard
   ↓
2. Faça Login
   ↓
3. Clique "Novo Post" ou "Novo Edital"
   ↓
4. Preencha os campos
   ↓
5. Selecione imagem de capa
   ↓
6. Clique "Publicar"
   ↓
7. ✅ Post/Edital aparece na página pública
   ↓
8. Botão "Leia Mais" leva à subpágina individual
   ↓
9. URL amigável: /blog/seu-titulo/ ou /editais/seu-titulo/
```

---

## 🔧 Slug - Como Funciona

O **slug** é o identificador único da URL, gerado automaticamente a partir do título:

| Título | Slug Gerado |
|--------|-------------|
| Participação na Feira Tecnológica do ES | `participacao-na-feira-tecnologica-do-es` |
| Workshop de Arduino 2026 | `workshop-de-arduino-2026` |
| Novo Membro no Time | `novo-membro-no-time` |

**Regras:**
- ✅ Letras minúsculas
- ✅ Hífens (-) separando palavras
- ✅ Sem acentos/caracteres especiais
- ✅ Único por tipo (não pode repetir)

---

## 📱 Visualizar em Produção

### Deployment em Railway

```bash
# Suas mudanças são auto-deployadas quando você faz push ao GitHub
git add .
git commit -m "Novo post: Evento"
git push origin main
```

**URLs em Produção:**
```
https://titasdarobotica.up.railway.app/blog/
https://titasdarobotica.up.railway.app/editais/
```

---

## ❌ Troubleshooting

### Posts não aparecem na página pública

**Checklist:**
1. ✅ Status é "Publicado"? (Não "Rascunho")
2. ✅ Django está rodando? (`python manage.py runserver`)
3. ✅ Página não está em cache? (F12 → Ctrl+Shift+Delete → Clear Cache)
4. ✅ Imagem foi carregada? (Verificar no console do navegador)

### Slug duplicado

**Solução:** Edite o título do post para ser único. O slug será regenerado automaticamente.

### Imagem não carregou

**Checklist:**
1. ✅ Arquivo é menor que 10MB?
2. ✅ Formato é JPG, PNG ou WebP?
3. ✅ Supabase buckets estão criados? (blog-covers, edital-images)
4. ✅ Credenciais SUPABASE_URL e SUPABASE_KEY no .env?

### Subpágina 404 (não encontrada)

**Verificar:**
1. ✅ URL slug está correto?
2. ✅ Post está publicado (status = published)?
3. ✅ Django está rodando?

---

## 📚 Próximos Passos

1. **Configure Supabase** (se não feito):
   - Crie buckets: blog-covers, edital-images, edital-documents
   - Execute: `docs/SUPABASE-SETUP.md`

2. **Teste Localmente** com 2-3 posts/editais

3. **Deploy em Railway**:
   ```bash
   git push origin main
   ```

4. **Monitore** em http://titasdarobotica.up.railway.app

---

## 💡 Dicas Práticas

### Para Posts Longos
- Use `<h2>` e `<h3>` para separar seções
- Inclua imagens a cada parágrafo
- Links internos: `<a href="/blog/outro-post/">outro artigo</a>`

### Para Editais
- Deixe **datas** bem visíveis
- Use **listas** para requisitos
- Inclua **PDF** do edital oficial

### Melhor SEO
- Títulos descritivos (ex: "Participação na Feira Tecnológica de 2025")
- Resumo claro (primeiras linhas do conteúdo)
- Imagem de qualidade

---

## 📞 Suporte

Dúvidas? Verifique:
- `docs/CORS-TROUBLESHOOTING.md` - Erros de acesso
- `docs/AUTOSYNC-CHECKLIST.md` - Sincronização com Supabase
- `docs/PROJECT-STRUCTURE.md` - Arquitetura do projeto

