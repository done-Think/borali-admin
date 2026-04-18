# BoraLí — Admin Console

Painel administrativo da plataforma BoraLí, construído em React para uso interno da equipe operacional.

## Funcionalidades

- Dashboard em tempo real — corridas ativas, motoristas online, receita do dia
- Gestão de motoristas — aprovação de cadastros, documentos, bloqueios
- Gestão de passageiros e suporte a reclamações
- Analytics — corridas por período, receita, churn de motoristas
- Gestão de assinaturas e pagamentos

## Stack

| | |
|---|---|
| UI | React 19 + MUI v7 + Toolpad Core |
| Roteamento | React Router v7 |
| Estado servidor | TanStack Query v5 |
| Estado cliente | Zustand v5 |
| Formulários | React Hook Form + Zod |
| HTTP | Axios |
| Realtime | Socket.io Client |
| Charts | Recharts |

## Rodando o projeto

### Pré-requisitos

- Node.js 20+

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Sobe em `http://localhost:5173`.

### Build

```bash
npm run build
```

### Pré-visualizar build

```bash
npm run preview
```
