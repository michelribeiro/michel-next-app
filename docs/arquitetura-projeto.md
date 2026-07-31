# Arquitetura do Projeto — Robô Vendedor

> **Status:** Planejamento  
> **Última atualização:** 30/07/2025  
> **Stack base:** Next.js 16 + TypeScript + Tailwind CSS

---

## 1. Filosofia arquitetural

```
Domínio (Core)  →  Aplicação (Use Cases)  →  Infraestrutura  →  Apresentação (UI)
```

- **Domain-Driven Design (DDD)** para separar regras de negócio de tecnologia
- **Clean Architecture** adaptada para Next.js (sem exageros)
- Microfrontend **apenas se escalar** — começar monorepo com domínios bem separados
- Tudo em TypeScript estrito

---

## 2. Estrutura de pastas

```
src/
├── core/                          # 📦 DOMAIN LAYER (DDD)
│   ├── domain/                    #    Regras de negócio PURAS (sem dependência externa)
│   │   ├── product/               #    Domínio: Produto
│   │   │   ├── entities/          #      Entidades (Product, Category)
│   │   │   ├── value-objects/     #      Value Objects (Price, Slug, SKU)
│   │   │   ├── repositories/      #      Interfaces (contratos)
│   │   │   └── services/          #      Serviços de domínio
│   │   ├── order/                 #    Domínio: Pedido
│   │   ├── customer/              #    Domínio: Cliente
│   │   ├── affiliate/            #    Domínio: Afiliado/Comissão
│   │   └── conversation/         #    Domínio: Conversa com IA
│   │
│   ├── application/               # 📦 APPLICATION LAYER (Use Cases)
│   │   ├── use-cases/             #    Casos de uso (CreateProduct, CheckoutOrder)
│   │   │   ├── product/
│   │   │   ├── order/
│   │   │   └── affiliate/
│   │   ├── ports/                 #    Interfaces de entrada/saída (portas)
│   │   └── dto/                   #    Data Transfer Objects
│   │
│   └── infrastructure/            # 📦 INFRASTRUCTURE LAYER
│       ├── persistence/           #    MongoDB / PostgreSQL adapters
│       │   ├── repositories/      #      Implementações concretas
│       │   └── schemas/           #      Schemas do banco
│       ├── ai/                    #    Integração DeepSeek / OpenAI
│       │   ├── client.ts
│       │   └── prompts/
│       ├── payment/               #    Gateway (ASAAS / Stripe)
│       │   └── gateway.ts
│       └── cache/                 #    Redis ou cache em memória
│
├── ui/                            # 🎨 PRESENTATION LAYER
│   ├── app/                       #    Next.js App Router (páginas e layouts)
│   │   ├── (landing)/             #      Página pública do robô vendedor
│   │   ├── (dashboard)/           #      Painel do cliente/vendedor
│   │   └── (admin)/               #      Admin interno
│   ├── components/                #    Componentes React
│   │   ├── atoms/                 #      Botão, Input, Label...
│   │   ├── molecules/             #      Card, FormField, ProductCard...
│   │   ├── organisms/            #      Header, ProductGrid, CheckoutForm...
│   │   └── templates/            #      Layouts de página
│   ├── hooks/                     #    Custom hooks
│   ├── lib/                       #    Utilitários de UI
│   └── styles/                    #    Estilos globais e tokens
│
├── shared/                        # 📦 COMPARTILHADO
│   ├── utils/                     #    Funções utilitárias puras
│   ├── types/                     #    Tipos compartilhados
│   └── constants/                 #    Constantes de negócio
│
└── config/                        # ⚙️ CONFIGURAÇÕES
    ├── env.ts                     #    Validação de variáveis de ambiente
    └── di.ts                      #    Injeção de dependência manual
```

---

## 3. Sobre Microfrontend

### Decisão: **Não usar microfrontend agora.**

| Motivo | Explicação |
|--------|------------|
| Custo cognitivo | Module Federation, Webpack 5, orquestração — complexidade alta |
| Time | Time de 1 pessoa, microfrontend atrapalha mais que ajuda |
| MVP | Pra validar, um monorepo bem organizado resolve |
| Quando pensar nisso | Se o projeto crescer e times separados precisarem atuar em domínios distintos |

### Alternativa adotada:
**Monorepo com separação por domínio** (estrutura acima). Se um dia precisar, cada domínio pode virar um pacote independente.

```
packages/             ← Futuro, se escalar
├── core-product/
├── core-order/
├── ui-design-system/
└── app-web/
```

---

## 4. Padrões de código adotados

### 4.1 State Management — Context API

Para estado global do cliente (autenticação), usamos **React Context API**.
- Arquivo: `src/core/infrastructure/auth-context.tsx`
- Provider envolvendo o layout protegido
- Hook `useAuth()` disponível em qualquer página filha

```tsx
// Exemplo de uso
const { client, token, login, logout } = useAuth();
// client.name, client.plan, client.token
```

### 4.2 Autenticação

- **Clientes:** `client_users` + `client_sessions` (tabelas Supabase)
- **Admin:** Senha fixa via `ADMIN_PASSWORD` no `.env`
- Sessão do cliente dura 30 dias
- Token armazenado em `sessionStorage` + Context

### 4.3 Fluxo de dados

```
Usuário → Página (Next.js Client Component)
              ↓
         API Route (Next.js Server)
              ↓
    Infrastructure (Supabase / Cloudinary)
              ↓
         Resposta → UI
```

### 4.4 Separação por camadas

| Camada | Onde fica | O que contém |
|--------|-----------|-------------|
| **Domain** | `core/domain/` | Entidades, value-objects, interfaces (sem dependências externas) |
| **Infrastructure** | `core/infrastructure/` | Supabase, auth, e-mail, Cloudinary (trocável) |
| **API** | `app/api/` | Next.js API Routes (ponte entre front e infra) |
| **UI** | `app/` e `ui/components/` | Páginas e componentes React |

---

## 5. Tecnologias definidas

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Framework | Next.js 16 | SSR, API Routes, Vercel |
| Runtime | Node.js (LTS) | Ambiente de execução, API Routes, libs |
| Linguagem | TypeScript estrito | Segurança de tipo — front e back |
| Estilos | Tailwind CSS + Design System | Velocidade + consistência |
| Ícones | lucide-react | Biblioteca de ícones padrão do projeto |
| Banco | Supabase (PostgreSQL) | Relacional, RLS, gratuito |
| IA | DeepSeek API (já temos) | Barato, português bom |
| Pagamento | ASAAS (a confirmar) | Recorrência nativa |
| Design System | Storybook (a confirmar) | Documentação de componentes |
| Teste | Vitest + Playwright | Rápido e moderno |

---

## 6. Decisões arquiteturais (ADRs)

### ADR-001: Injeção de dependência manual (sem framework)
- **Contexto:** Precisamos desacoplar domínio de infraestrutura
- **Decisão:** Usar injeção manual via funções/factories, não NestJS ou tsyringe
- **Motivo:** Menos dependências, mais controle, Next.js já tem seu próprio DI
- **Status:** ✅ Aceita

### ADR-002: API Routes do Next.js como entry point
- **Contexto:** Onde colocar os endpoints
- **Decisão:** Usar API Routes do Next.js em vez de servidor separado
- **Motivo:** Deploy unificado na Vercel, zero infra extra
- **Status:** ✅ Aceita

---

## 7. Próximos passos (arquitetura)

- [ ] Validar estrutura com primeiro use case real (CRUD de produto)
- [ ] Implementar injeção manual para um domínio
- [ ] Definir schemas do MongoDB
- [ ] Criar testes unitários do domínio antes da infra
