# Estrutura do Projeto - Titãs da Robótica

Site **estático** (HTML + CSS + JavaScript), sem backend próprio nem framework
frontend. O conteúdo dinâmico (blog e editais) é lido diretamente do Supabase
pelo navegador; a área administrativa é client-side.

> Histórico: versões anteriores deste repositório chegaram a ter um backend
> Django. Ele foi removido. Se encontrar referências a `blog_app/`, `backend/`,
> `manage.py` ou `Procfile`, estão obsoletas.

## Organização de pastas

```
titasdarobotica/
├── index.html                 # Home (institucional + histórico)
├── equipes.html               # Catálogo de equipes e frentes
├── cospace.html … osorin.html # Páginas individuais de equipe/frente
├── blog.html / blog-post.html # Listagem e detalhe de post (dados do Supabase)
├── editais.html / edital-detail.html
├── inscreva-se.html           # Editais/oportunidades de entrada
├── depoimentos.html
├── apoio.html                 # Apoiadores e parceiros
├── contato.html               # Formulário de contato
├── politicas.html             # Privacidade, termos e cookies
├── admin.html                 # Painel administrativo client-side (Supabase Auth)
│
├── static/
│   ├── css/                   # reset, header, hero, components, forms, pages, footer, contact, admin
│   ├── js/                    # ver "Organização dos scripts"
│   └── images/
│
├── robots.txt
├── sitemap.xml
├── vercel.json                # Configuração de deploy estático (Vercel)
├── supabase-admin-policies.sql
├── README.md
└── PROJECT-STRUCTURE.md
```

## Organização dos scripts (`static/js/`)

| Arquivo            | Responsabilidade |
|--------------------|------------------|
| `config.js`        | Define `window.API_URL` (fallback e override via localStorage) |
| `navigation.js`    | **Chrome compartilhado** (menu + rodapé injetados em runtime), menu fixo ao rolar, **menu mobile** (hambúrguer), item ativo |
| `carousel.js`      | Carrosséis e controles de destaque |
| `animations.js`    | Animações de scroll, contadores, lightbox, back-to-top |
| `forms.js`         | Validação e **envio real** do formulário de contato (endpoint configurável + fallback `mailto:`) |
| `blog-api.js` / `blog-loader.js` / `blog-post.js` | Listagem, filtro e detalhe do blog (Supabase REST) |
| `edital-loader.js` / `edital-detail.js` | Listagem, filtro e detalhe de editais (Supabase REST) |
| `admin.js`         | CRUD de posts/editais no Supabase; localStorage como fallback/offline |
| `main.js`          | Bootstrap (`DOMContentLoaded`), Vercel Analytics em produção |

### Menu e rodapé compartilhados

Cada página traz o `<header>` e o `<footer>` no HTML (fallback para buscadores e
navegação sem JS). Em runtime, `navigation.js` **substitui** o conteúdo desses
blocos pelo markup canônico definido em `NAV_LINKS` / `SOCIAL_LINKS` /
`footerMarkup()`. Para mudar um item de menu ou um link do rodapé em todo o site,
edite **apenas** `static/js/navigation.js`.

### Formulário de contato

`forms.js` envia via `fetch` para `window.CONTACT_ENDPOINT` (definido em
`contato.html`). Enquanto o endpoint estiver vazio, o site abre o app de e-mail
do visitante já preenchido. Para envio automático, crie um formulário gratuito
(Formspree, Web3Forms ou FormSubmit) e cole a URL em `contato.html`.

## Conteúdo dinâmico (Supabase)

- Blog e editais são lidos via API REST do Supabase direto do navegador.
- A chave usada nos scripts é a **anon key** (pública por design); a proteção
  real vem das *policies* de RLS — ver `supabase-admin-policies.sql`.
- `admin.html` autentica com Supabase Auth e faz CRUD nas tabelas `posts` e
  `editals`.

## Como executar localmente

Servir a pasta com qualquer servidor estático a partir da raiz (os assets usam
caminhos absolutos `/static/...`):

```bash
python -m http.server 4173
# ou: npx serve .
# ou: extensão Live Server no VS Code
```

## Deploy

Deploy estático na Vercel. `vercel.json` só define `trailingSlash` e cache dos
assets — os arquivos `.html` são servidos diretamente.

## SEO

- Cada página tem bloco `<!-- SEO-BLOCK -->` no `<head>`: `description`,
  `canonical`, Open Graph, Twitter Card e favicon.
- `robots.txt` e `sitemap.xml` na raiz.
- **A URL base `https://titasdarobotica.vercel.app` está fixa nesses arquivos.**
  Se o domínio oficial mudar, atualize `sitemap.xml`, `robots.txt` e o
  `SEO-BLOCK` de cada página (o script `scripts/seo` pode ser reaproveitado).
