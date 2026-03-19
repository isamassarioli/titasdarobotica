# Deploy no Vercel

Este repositório é um site estático (HTML/CSS/JS). Para facilitar o deploy em projetos que usam rotas do lado do cliente, adicionei um arquivo `vercel.json` com um rewrite que envia todas as requisições para `index.html`.

O que eu adicionei
- `vercel.json` — garante que todas as rotas sirvam `index.html` (fallback para SPAs).

Como usar

1. Pela interface web (recomendado):
   - Acesse https://vercel.com e conecte sua conta ao GitHub.
   - Importe o repositório `isamassarioli/titasdarobotica`.
   - Framework Preset: "Other / Static Site".
   - Build command: deixe em branco.
   - Output directory: deixe em branco (ou `.`).
   - Clique em Deploy.

2. Pelo Vercel CLI (PowerShell no Windows):
```powershell
npm install -g vercel
vercel login
cd 'D:\Users\2024122760199\Documents\GitHub\titasdarobotica'
vercel        # deploy de preview
vercel --prod # deploy para produção
```

Observações
- Se seu site não usa rotas cliente (apenas links HTML comuns), o `vercel.json` não é estritamente necessário, mas não atrapalha.
- Se você usar formulários que enviam para um endpoint server-side, será necessário adicionar funções serverless — este repositório não contém funções.

Se quiser, posso também:
- Atualizar `README.md` com estas instruções (em vez de um arquivo separado).
- Criar um domínio customizado no Vercel (se você me fornecer o domínio).
