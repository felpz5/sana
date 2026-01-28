# P.U.P. com SQL (SQLite) + HTML (fetch)

## Como rodar
1) Instale o Node.js (versão 18+)
2) No terminal, dentro desta pasta:

```bash
npm install
npm start
```

Abra:
- http://localhost:3000

## Onde está o SQL?
- `server/schema.sql` (tabelas + seed)
- `server/pup.db` será criado automaticamente na primeira execução.

## Como o HTML usa o SQL?
O HTML chama a API via `fetch` (arquivo `public/js/api.js`), e o back-end (`server/server.js`) acessa o SQLite.
