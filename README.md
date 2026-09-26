# Cardápio Fácil — Frontend

Painel do restaurante e página pública do cardápio (React + Vite + PWA).
Consome a API [cardapio-api](https://api.treifit.com.br/api/docs).

## Telas

| Rota | Acesso | O que faz |
|------|--------|-----------|
| `/entrar`, `/cadastro` | público | Login e cadastro (o cadastro já cria o restaurante) |
| `/painel` | logado | Lista os cardápios e cria um novo (com arquivo ou só com itens) |
| `/painel/cardapios/:id` | logado | QR Code (PNG/SVG), título, troca de arquivo, itens e exclusão |
| `/m/:slug` | público | **Destino do QR Code**: mostra a imagem/PDF e os itens do cardápio |

O token JWT fica no `localStorage`; se a API responder 401 (token expirado), o app volta para o login.

## Configuração

| Variável | Onde | Valor |
|----------|------|-------|
| `VITE_API_URL` | `.env.production` | `https://api.treifit.com.br` |
| `VITE_API_URL` | desenvolvimento | vazio (usa o proxy do Vite) |
| `API_PROXY_TARGET` | só `npm run dev` | backend local, padrão `http://localhost:3000` |

No backend, estas variáveis precisam bater com o domínio deste frontend:

- `CORS_ORIGIN=https://cardapiofacil.treifit.com.br` (senão o navegador bloqueia as chamadas)
- `FRONTEND_URL=https://cardapiofacil.treifit.com.br` (o QR Code aponta para `${FRONTEND_URL}/m/<slug>`)

## Desenvolvimento

```bash
npm install
# backend rodando em http://localhost:3000 (ver README do cardapio-api)
npm run dev          # http://localhost:5173 — /api e /uploads vão para o backend pelo proxy
```

Para o QR Code abrir o frontend local, rode o backend com `FRONTEND_URL=http://localhost:5173`.

## Build e deploy (Firebase Hosting)

```bash
npm run build        # usa .env.production -> VITE_API_URL=https://api.treifit.com.br
firebase deploy --only hosting
```

O `firebase.json` já reescreve todas as rotas para `index.html`, então `/m/<slug>` funciona ao abrir direto pelo QR Code.
