# BoraLí — Admin Console

Painel administrativo da plataforma BoraLí. React 19 + Vite + Material-UI + TanStack Query.

## Pré-requisitos

- Node.js 20+
- A [API](../borali-api/README.md) rodando em `localhost:3000` (ou configure `VITE_API_URL`)

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

Se a API estiver em outra URL (ex: staging), ajuste as variáveis acima.

## Instalação e desenvolvimento

```bash
npm install
npm run dev
```

O painel estará disponível em http://localhost:5173.

## Build de produção

```bash
npm run build    # Gera dist/
npm run preview  # Serve o build localmente para validação
```

O build gerado é servido via Nginx no container de produção.

## Lint e type-check

```bash
npm run lint     # ESLint
npx tsc --noEmit # Type-check sem compilar
```

## Stack

| Biblioteca | Uso |
|---|---|
| React 19 | UI |
| Material-UI v7 + Toolpad Core | Componentes e layout do painel |
| React Router v7 | Roteamento |
| TanStack Query v5 | Fetching e cache de dados |
| Zustand | Estado global |
| React Hook Form + Zod | Formulários e validação |
| Axios | HTTP client |
| Socket.io Client | Conexão em tempo real com a API |
| Recharts | Gráficos e analytics |

## Funcionalidades

- **Dashboard** — corridas ativas, motoristas online, receita do dia em tempo real
- **Gestão de motoristas** — aprovação de cadastros, documentos, bloqueio/suspensão
- **Gestão de passageiros** — histórico, suporte, bloqueio
- **Analytics** — heatmap de corridas, faturamento, churn de motoristas
- **Assinaturas** — gestão de planos e pagamentos
- **Configurações** — categorias de veículos e tarifas por região

## Path aliases

O projeto usa aliases para importações:

| Alias | Caminho |
|---|---|
| `@/*` | `src/*` |
| `@shared/*` | `src/shared/*` |
| `@modules/*` | `src/modules/*` |
| `@layouts/*` | `src/layouts/*` |
| `@theme/*` | `src/theme/*` |
| `@routes/*` | `src/routes/*` |
