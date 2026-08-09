# Titãs da Robótica

Site institucional da equipe Titãs da Robótica, do Instituto Federal do Espírito Santo - Campus Colatina.

Este repositório concentra a presença digital pública da equipe, reunindo páginas institucionais, histórico, equipes, depoimentos, blog, editais, contato e área administrativa client-side. A proposta do projeto é comunicar a identidade da equipe, registrar resultados, organizar informações sobre participação em competições e oferecer uma base sólida para documentação acadêmica futura.

## Objetivo do sistema

O site foi desenvolvido para apresentar a trajetória da equipe Titãs da Robótica e apoiar a divulgação de suas atividades de ensino, pesquisa, extensão e competição. Na prática, ele funciona como:

- vitrine institucional da equipe;
- canal de divulgação de conquistas, projetos e resultados;
- espaço de apresentação das equipes e frentes de atuação;
- página de consulta para depoimentos, blog e editais;
- apoio à comunicação com estudantes, orientadores, avaliadores e visitantes.

## Público-alvo

O conteúdo foi organizado para ser compreendido por diferentes perfis:

- recrutadores e avaliadores técnicos, que precisam entender rapidamente a finalidade, o escopo e a consistência do projeto;
- orientadores e banca acadêmica, que podem usar o material como base para contextualização de TCC, anteprojeto e artigos;
- estudantes e membros da equipe, que usam o site como referência institucional;
- visitantes externos, que buscam informações sobre a equipe, suas conquistas e formas de contato.

## Funcionalidades principais

O site concentra as seguintes funcionalidades:

- página inicial com apresentação da equipe, trajetória, marcos históricos e destaques recentes;
- páginas individuais para equipes e frentes específicas, com navegação dedicada;
- seção de depoimentos com relatos que contextualizam a evolução da equipe;
- blog para publicação de conteúdos e registros;
- página de editais com filtros funcionais para organizar oportunidades por status;
- página de inscrições com acesso rápido às informações de participação;
- página de contato com informações institucionais;
- área administrativa client-side para gerenciamento de conteúdo local;
- menu e footer compartilhados para navegação consistente entre páginas.

## Destaque de conteúdo mais recente

O site foi atualizado com informações da RoboCup 2026, registrando o desempenho mais recente da equipe em competição internacional. O conteúdo da home resume os resultados e destaca a participação das equipes Titãs da Robótica e Ligeirinho na edição de 2026.

## Estrutura do projeto

```text
titasdarobotica/
├── index.html
├── blog.html
├── blog-post.html
├── editais.html
├── edital-detail.html
├── inscreva-se.html
├── contato.html
├── depoimentos.html
├── apoio.html
├── equipes.html
├── admin.html
├── cospace.html
├── futebol-2d.html
├── humanoide.html
├── pratica.html
├── pesquisa.html
├── seguidor-de-linha.html
├── challenger.html
├── obr-teorica.html
├── static/
│   ├── css/
│   ├── images/
│   └── js/
├── PROJECT-STRUCTURE.md
├── README.md
├── supabase-admin-policies.sql
└── vercel.json
```

## Arquitetura e funcionamento

O projeto é um site estático, construído com HTML, CSS e JavaScript. Não há backend próprio nem framework frontend. A lógica é distribuída da seguinte forma:

- HTML: páginas públicas e páginas de detalhe;
- CSS: sistema visual, responsividade e composição dos layouts;
- JavaScript: navegação, carrossel, animações, formulários, carregamento de dados e filtros;
- Supabase: fonte externa para conteúdo dinâmico do blog e dos editais;
- localStorage: fallback e suporte à área administrativa client-side.

### Fluxo de conteúdo

1. O visitante acessa uma página pública do site.
2. Os scripts comuns inicializam navegação, carrossel e componentes visuais.
3. As listagens de blog e editais carregam conteúdo via JavaScript.
4. O administrador, quando aplicável, manipula dados localmente no navegador.
5. O site exibe o conteúdo em páginas dedicadas e mantém a navegação entre seções.

## Organização dos scripts

Os arquivos JavaScript estão divididos por responsabilidade:

- `static/js/main.js`: inicialização geral do site;
- `static/js/navigation.js`: comportamento do menu e navegação;
- `static/js/carousel.js`: carrosséis e controles de destaque;
- `static/js/animations.js`: animações e efeitos de entrada;
- `static/js/forms.js`: tratamento de formulários;
- `static/js/blog-loader.js`: listagem e filtragem do blog;
- `static/js/blog-post.js`: renderização de post individual;
- `static/js/blog-api.js`: integração e rotinas de conteúdo do blog;
- `static/js/edital-loader.js`: listagem e filtragem dos editais;
- `static/js/edital-detail.js`: detalhamento de edital;
- `static/js/admin.js`: interface administrativa client-side;
- `static/js/config.js`: configuração e fallback de acesso a dados.

## Páginas principais

- `index.html`: apresentação institucional da equipe e resumo histórico;
- `equipes.html`: catálogo das equipes e áreas de atuação;
- `blog.html`: listagem de conteúdos publicados;
- `blog-post.html`: detalhe de publicação;
- `editais.html`: listagem de editais com filtros;
- `edital-detail.html`: detalhe de edital;
- `inscreva-se.html`: entrada para inscrições e oportunidades;
- `depoimentos.html`: relatos e memória institucional;
- `apoio.html`: informações para apoiadores e parceiros;
- `contato.html`: canais de comunicação;
- `admin.html`: painel administrativo client-side.

## Dados e conteúdo dinâmico

O projeto utiliza uma abordagem leve para conteúdo dinâmico:

- o blog e os editais podem ser carregados por integração JavaScript com Supabase;
- a interface administrativa é client-side e usa armazenamento local no navegador;
- o site prioriza compatibilidade com hospedagem estática;
- os filtros de editais foram implementados para permitir leitura por status e organização de oportunidades.

## Identidade visual e experiência

O layout foi construído para comunicar seriedade institucional e clareza de navegação. Os principais elementos de UX incluem:

- header e menu fixo para acesso rápido às páginas;
- carrosséis para destacar marcos, robôs e conteúdos relevantes;
- seções com hierarquia visual clara;
- cards para organizar informações de forma escaneável;
- footer padronizado para reforçar continuidade entre páginas;
- responsividade para leitura em desktop e dispositivos móveis.

## Como executar localmente

Como o projeto é estático, ele pode ser aberto em qualquer servidor local simples. Exemplos:

- usar a extensão Live Server no VS Code;
- servir a pasta com um servidor estático local;
- abrir o `index.html` diretamente, quando o navegador permitir o carregamento dos recursos externos.

Para uma navegação mais fiel ao ambiente de produção, recomenda-se usar um servidor local em vez de abrir os arquivos diretamente.

## Deploy

O projeto possui configuração para publicação estática via Vercel em `vercel.json`.

## Uso acadêmico e documentação futura

Este repositório também serve como base documental para textos acadêmicos. Ele pode apoiar:

- contextualização do problema e do objetivo do sistema;
- descrição da arquitetura e das decisões de implementação;
- análise de experiência do usuário e estrutura de navegação;
- levantamento das funcionalidades públicas e administrativas;
- relato da evolução histórica da equipe;
- fundamentação para artigos, TCC e anteprojeto.

Para trabalhos acadêmicos, este README pode ser usado como ponto de partida para capítulos de introdução, metodologia, solução proposta, arquitetura do sistema e validação do produto.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Supabase
- Vercel
- Font Awesome
- Google Fonts

## Observações de manutenção

- O site é composto por múltiplas páginas estáticas; alterações de conteúdo institucional podem exigir atualização em mais de um arquivo.
- O comportamento de editais depende do loader em JavaScript e da consistência dos dados recebidos.
- O fluxo administrativo foi pensado para simplicidade de uso, não para substituir um sistema completo de backoffice.

## Licença

Uso institucional e acadêmico da equipe Titãs da Robótica - IFES Campus Colatina.

---
