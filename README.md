# BoraLí — Admin Console

Painel administrativo da plataforma BoraLí. React 19 + Vite + Material-UI + TanStack Query.

## Pré-requisitos

- Node.js 20+
- A [API](../borali-api/README.md) rodando em `localhost:3000` (ou configure `VITE_API_URL`)

## Chaves necessárias

| Variável | Origem | Obrigatório |
|---|---|---|
| `VITE_LOGTO_APP_ID` | Logto Admin em http://localhost:3002 — Application do tipo **Single Page App (React)** | Sim — login não funciona sem isso |

Veja o passo a passo completo de criação em [borali-infra/README.md](../borali-infra/README.md#logto--configuração-inicial).

> **Redirect URI obrigatório no Logto:** ao criar a Application, adicione `http://localhost:5173/callback` em *Redirect URIs* e `http://localhost:5173` em *Post Sign-Out Redirect URIs*. Em produção, troque pelo domínio real.

## Configuração

```bash
cp .env.example .env
```

Edite o `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000

# Logto — App ID da Application "Single Page App (React)" criada no Logto Admin
VITE_LOGTO_ENDPOINT=https://localhost:3001
VITE_LOGTO_APP_ID=seu_app_id_aqui
```

Se a API estiver em outra URL (ex: staging), ajuste `VITE_API_URL` e `VITE_LOGTO_ENDPOINT` de acordo.

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

