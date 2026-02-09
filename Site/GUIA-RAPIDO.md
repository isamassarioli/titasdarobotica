# 🚀 Guia Rápido - Titãs da Robótica

## Como Começar

### 1. Abrir o Site
- Abra o arquivo `index.html` ou `home.html` no seu navegador
- O site irá carregar com todas as funcionalidades

### 2. Estrutura de Arquivos

```
📁 Figma Code/
├── 📁 css/              → Todos os estilos
├── 📁 js/               → Scripts JavaScript
├── 📁 images/           → Imagens e logos
├── 🏠 index.html        → Redireciona para home
├── 🏠 home.html         → Página inicial
├── 📧 contato.html      → Formulário de contato
├── 📝 inscreva-se.html  → Editais e newsletter
├── ℹ️ sobre.html        → Sobre a equipe
├── 👥 membros.html      → Membros da equipe
├── 🤖 equipes.html      → Equipes de competição
├── 📰 blog.html         → Blog e notícias
└── 🤝 apoio.html        → Patrocinadores
```

## ✅ O Que Já Está Funcionando

### Menu Superior
- ✅ Animações de hover
- ✅ Dropdown de equipes
- ✅ Navegação entre páginas
- ✅ Menu fixo ao rolar

### Formulários
- ✅ Validação de campos
- ✅ Mensagens de sucesso
- ✅ Validação de e-mail
- ✅ Formulário de contato
- ✅ Newsletter

### Animações
- ✅ Carrossel de imagens
- ✅ Animação ao scroll
- ✅ Lightbox de imagens
- ✅ Botão voltar ao topo
- ✅ Contadores animados

## 📝 Como Personalizar

### Trocar Imagens
1. Substitua as imagens na pasta `images/`
2. Mantenha os mesmos nomes ou atualize no HTML
3. Logo principal: `images/Group 3.png`

### Alterar Cores
Edite o arquivo `css/main.css`:
```css
/* Cores principais */
#FFA500 → Laranja principal
#FF6B00 → Laranja escuro
#0D0D0D → Preto
#1a1a1a → Cinza escuro
```

### Atualizar Textos
- Abra o arquivo `.html` da página desejada
- Procure pelo texto que deseja alterar
- Salve e atualize o navegador

## 🔧 Funcionalidades dos Formulários

### Formulário de Contato
```javascript
// Os dados são validados e exibidos no console
// Para integrar com backend, edite: js/forms.js
// Linha: função initContactForm()
```

### Newsletter
```javascript
// Para conectar com serviço de email marketing
// Edite: js/forms.js
// Linha: função initNewsletterForm()
```

## 🎨 Componentes Disponíveis

### Botões
```html
<a href="#" class="btn btn-primary">Botão Principal</a>
<a href="#" class="btn btn-secondary">Botão Secundário</a>
```

### Cards
```html
<div class="card">
    <h3>Título</h3>
    <p>Conteúdo</p>
</div>
```

### Grid de Imagens
```html
<div class="image-grid">
    <div class="image-card">
        <img src="..." alt="...">
    </div>
</div>
```

## 🌐 Para Colocar Online

### Opção 1: GitHub Pages (Grátis)
1. Crie um repositório no GitHub
2. Faça upload de todos os arquivos
3. Ative GitHub Pages nas configurações
4. Seu site estará em: `https://seuusuario.github.io/nome-repo`

### Opção 2: Netlify (Grátis)
1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta do projeto
3. Site online instantaneamente

### Opção 3: Servidor Próprio
1. Contrate hospedagem (Hostinger, HostGator, etc)
2. Faça upload via FTP
3. Configure domínio

## 📱 Responsividade

O site já está responsivo para:
- 💻 Desktop (1920px+)
- 💻 Laptop (1024px - 1920px)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (320px - 768px)

## 🐛 Resolução de Problemas

### Imagens não aparecem
- Verifique se as imagens estão na pasta `images/`
- Confirme os nomes dos arquivos
- Verifique os caminhos nos arquivos HTML

### Menu não funciona
- Verifique se `js/navigation.js` está carregando
- Abra o Console do navegador (F12) e veja erros

### Formulário não envia
- Normal! Os formulários apenas simulam envio
- Para funcionarem de verdade, precisa integrar com backend
- Veja instruções em `js/forms.js`

## 💡 Próximos Passos

1. **Substituir Placeholders**
   - Troque todas as imagens placeholder por fotos reais
   - Atualize textos com informações verdadeiras
   - Adicione links reais das redes sociais

2. **Integrar Backend**
   - Configure API para formulários
   - Implemente banco de dados
   - Configure envio de e-mails

3. **Otimizar SEO**
   - Adicione meta descriptions
   - Configure Open Graph
   - Crie sitemap.xml

4. **Analytics**
   - Adicione Google Analytics
   - Configure Facebook Pixel
   - Implemente rastreamento de conversões

## 📞 Suporte

Dúvidas? Entre em contato:
- 📧 Email: contato@titansrobotica.com.br
- 📱 Instagram: @titansrobotica

---

**Desenvolvido com ❤️ para os Titãs da Robótica**

Última atualização: 06/02/2026
