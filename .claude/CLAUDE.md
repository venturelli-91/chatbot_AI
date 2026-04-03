# chatbot_AI

Chatbot conversacional com Next.js 15, React 19, TypeScript, TailwindCSS v4 e Zustand.

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (`pages/` router) |
| Runtime | React 19 |
| Linguagem | TypeScript 5 (strict) |
| Estilo | TailwindCSS v4 + Flowbite React |
| Estado | Zustand 5 |
| Ícones | React Icons 5 (`hi`, `hi2`) |
| AI Backend | Ollama local — modelo `mistral` |

## Comandos

```bash
npm run dev     # Dev server → http://localhost:3000
npm run build   # Build de produção
npm run lint    # ESLint
```

## Arquitetura

```
src/
├── components/
│   ├── AppWrapper.tsx     # Layout raiz (container + grid)
│   ├── ChatHeader.tsx     # Header: avatar do bot, nome, status online
│   ├── ChatHistory.tsx    # Lista rolável de mensagens + estado vazio
│   ├── ChatInput.tsx      # Input de texto + botão enviar
│   └── ChatMessage.tsx    # Bolha de mensagem individual (user / assistant)
├── pages/
│   ├── api/chat.ts        # Proxy para a API Ollama
│   └── index.tsx          # Entry point → <AppWrapper />
├── store/
│   └── chatStore.ts       # Estado global: messages, loading, error
└── styles/
    └── globals.css        # Tailwind v4 imports + tema dark
```

## Design System — Tema Dark "Nebula"

Cores implementadas via classes Tailwind utilitárias:

| Papel | Classe Tailwind | Hex |
|-------|----------------|-----|
| Fundo da página | `bg-slate-950` | `#020617` |
| Container do chat | `bg-slate-900` | `#0F172A` |
| Superfície secundária | `bg-slate-800` | `#1E293B` |
| Acento primário | `from-violet-600 to-indigo-600` | — |
| Texto principal | `text-slate-100` | `#F1F5F9` |
| Texto secundário | `text-slate-400` | `#94A3B8` |
| Borda | `border-white/10` | rgba branco 10% |
| Status online | `bg-emerald-400` | `#34D399` |

## Convenção de Commits

Seguir **Conventional Commits**:

```
<type>(<scope>): <descrição curta em português ou inglês>
```

| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade visível ao usuário |
| `fix` | Correção de bug |
| `style` | Mudanças puramente visuais (CSS, layout) |
| `refactor` | Refatoração sem mudança de comportamento |
| `docs` | Apenas documentação |
| `chore` | Config, deps, build |

**Commits atômicos**: um commit por componente ou concern. Push após cada commit.

## Regras de Código

- **Componentes**: funcionais com TypeScript — sempre tipagem explícita nas props
- **Estado**: Zustand para estado compartilhado — sem prop drilling
- **Estilos**: classes Tailwind utilitárias; CSS arbitrário (`[]`) apenas quando necessário
- **Ícones**: `react-icons/hi` (Heroicons v1) e `react-icons/hi2` (Heroicons v2)
- **Sem comentários** em código autoexplicativo
- **Sem lógica de negócio** em componentes — toda lógica fica no store

## Fluxo de Dados

```
ChatInput (form submit)
  → chatStore.sendMessage()
    → POST /api/chat { message, model, maxTokens }
      → Ollama API (localhost:11434)
    → assistantMessage adicionado ao store
  → ChatHistory re-renderiza via Zustand subscription
```

## Estrutura da Mensagem

```typescript
interface Message {
  id: string;           // Date.now().toString()
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}
```
