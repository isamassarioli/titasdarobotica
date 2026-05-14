# 🤖 Titãs da Robótica - Website Oficial

Website estático + admin client-only da equipe Titãs da Robótica do Instituto Federal do Espírito Santo - Campus Colatina.

## 📁 Estrutura do Projeto

```
titasdarobotica/
├── static/                 # Assets estáticos
│   ├── css/               # Estilos
│   │   ├── reset.css
│   │   ├── header.css
│   │   ├── hero.css
│   │   ├── components.css
│   │   ├── forms.css
│   │   ├── pages.css
│   │   ├── footer.css
│   │   ├── contact.css
│   │   └── admin.css
│   ├── images/            # Imagens do site
│   └── js/                # Scripts
│       ├── config.js      # Config da API (fallback)
│       ├── blog-api.js    # Carregador de posts (client-side)
│       ├── edital-loader.js
│       ├── blog-loader.js
│       ├── admin.js       # Admin client-only (localStorage)
│       ├── navigation.js
│       ├── carousel.js
│       ├── forms.js
│       ├── animations.js
│       └── main.js
│
├── index.html             # Página inicial
├── blog.html              # Página do blog
├── editais.html           # Página de editais
├── contato.html           # Página de contato
├── inscreva-se.html       # Inscrições
├── depoimentos.html       # Depoimentos
├── equipes.html           # Equipes
├── apoio.html             # Apoiadores
├── admin.html             # Admin (client-only, localStorage)
│
├── .env.example           # Variáveis de exemplo
├── PROJECT-STRUCTURE.md   # Detalhes da arquitetura
├── README.md              # Este arquivo
└── vercel.json            # Config para deploy no Vercel
```

## ✨ Características Principais

### 🎨 Frontend Estático
- **HTML5 semântico** com estrutura limpa
- **CSS3 responsivo** com Grid/Flexbox
- **JavaScript vanilla ES6+** sem dependências pesadas
- **Sem banco de dados backend** — totalmente client-side

### 📝 Admin Client-Only
- **Gerenciador de posts** com localStorage
- **CRUD completo** (criar, editar, deletar, listar posts)
- **Upload de imagens** convertidas para base64
- **Export/Import JSON** para migração de dados
- **Senha simples** para proteger acesso (armazenada em localStorage)

### 📰 Blog Dinâmico
- Posts carregados via JavaScript (não requer servidor)
- Filtragem por categoria e status
- Preview de imagens em base64
- Sem dependência de API backend

## 🚀 Como Usar

### 🌐 Abrir o Site Localmente
1. Abra `index.html` no navegador (ou qualquer página HTML)
2. Não requer servidor local — tudo roda no browser
3. Navegue pelas páginas usando o menu

### 📝 Gerenciar Posts (Admin)

#### Acessar Admin
- Abra `admin.html` no navegador
- **Login:** qualquer usuário
- **Senha inicial:** `@Isadora100504`

#### Criar Post
1. Clique em **➕ Novo Post**
2. Preencha título, categoria, resumo, conteúdo
3. Upload de imagem (será convertida para base64)
4. Clique **Publicar** — salvo em `localStorage`

#### Editar Post
1. Aba **📝 Posts** mostra todos os posts
2. Clique **✏️ Editar** para modificar
3. Salve as alterações (atualiza `localStorage`)

#### Deletar Post
1. Clique **🗑️ Deletar** no card do post
2. Confirme a exclusão

#### Exportar Posts
1. Clique **⬇️ Exportar posts**
2. Baixa arquivo JSON com todos os posts (incluindo imagens em base64)
3. Use para backup ou migração

#### Importar Posts
1. Clique **⬆️ Importar posts**
2. Selecione arquivo JSON anterior
3. Posts serão mesclados (evita duplicação por ID)

### 🔑 Mudar Senha do Admin
Abra o console do navegador (F12) e execute:
```javascript
localStorage.setItem('titas_admin_password', 'sua_nova_senha');
```

## 🎯 Organização de Posts (localStorage)

Os posts são armazenados em `localStorage` com a chave `titas_posts`.

### Estrutura de um Post
```json
{
  "id": "1715761234567",
  "slug": "meu-primeiro-post",
  "title": "Meu Primeiro Post",
  "category": "competicoes",
  "status": "published",
  "summary": "Resumo do post",
  "body": "Conteúdo completo do post",
  "cover_image": "data:image/png;base64,...",
  "created_at": "2026-05-14T10:00:00.000Z",
  "updated_at": "2026-05-14T10:00:00.000Z"
}
```

### Categorias Disponíveis
- `competicoes` — Competições
- `workshops` — Workshops
- `projetos` — Projetos
- `eventos` — Eventos
- `novidades` — Novidades

### Status Disponíveis
- `draft` — Rascunho (não aparece no blog público)
- `published` — Publicado (visível no blog)
- `archived` — Arquivado (oculto)

## 🔧 Tecnologias

- **HTML5** — Estrutura semântica
- **CSS3** — Responsivo (Grid/Flexbox)
- **JavaScript vanilla ES6+** — Sem frameworks pesados
- **localStorage** — Armazenamento client-side
- **Sem backend, sem banco de dados** — Totalmente estático

## 📄 Páginas do Site

- **index.html** — Página inicial
- **blog.html** — Blog com posts dinâmicos
- **editais.html** — Editais e regulamentos
- **contato.html** — Formulário de contato
- **inscreva-se.html** — Inscrições
- **depoimentos.html** — Depoimentos de membros
- **equipes.html** — Equipes de competição
- **apoio.html** — Apoiadores e patrocinadores
- **admin.html** — Painel administrativo (client-only)

## 📦 Deploy

### Vercel (Recomendado)
1. Push para repositório GitHub
2. Conecte repositório no [Vercel](https://vercel.com)
3. Vercel detecta como site estático automaticamente
4. Pronto! Deploy feito

O arquivo `vercel.json` contém configuração para fallback a `index.html`.

### Nginx / Apache (Alternativa)
Configure fallback de SPA:
```nginx
try_files $uri $uri/ /index.html;
```

## 💡 Dicas & Troubleshooting

### Posts Não Aparecem no Blog
- Certifique-se de que o post tem status **`published`**
- Verifique se `blog.html` está carregando `blog-api.js`
- Abra console (F12) e veja se há erros de JavaScript

### Resetar Admin (limpar tudo)
Abra console e execute:
```javascript
window._titas_reset();
```

### Acessar localStorage direto
```javascript
window._titas_readPosts();  // lê todos os posts
localStorage.getItem('titas_posts');  // JSON bruto
localStorage.getItem('titas_admin_password');  // senha
```

## 📧 Contato

Para dúvidas sobre o código ou sugestões:
- **Email:** contato@titansrobotica.com.br
- **Instagram:** @titansrobotica

## 📜 Licença

© 2026 Titãs da Robótica - IFES Campus Colatina. Todos os direitos reservados.

---

Desenvolvido com ❤️ para a equipe Titãs da Robótica

**Site 100% estático + Admin client-only. Sem dependências externas, sem backend, sem banco de dados.**
