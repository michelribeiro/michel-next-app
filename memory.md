# Memória do Projeto — Michel Next App

> **Propósito:** Manter contexto contínuo entre sessões e decisões.  
> **Última atualização:** 28/07/2025

---

## 📋 Visão Geral

| Campo | Valor |
|-------|-------|
| **Projeto** | michel-next-app |
| **Produto** | Robô Vendedor com IA |
| **Stack** | Next.js 16 + TypeScript + Tailwind + Supabase |
| **Deploy** | Vercel (main) |
| **Repositório** | https://github.com/michelribeiro/michel-next-app |
| **Domínio** | michelribeiro.com.br |

---

## 🚨 REGRAS DO PROJETO (obrigatório seguir)

### ❌ Nunca sem permissão explícita:
- **Não commitar nada** sem perguntar antes
- **Não codar nada** sem perguntar antes
- **Não alterar arquivos existentes** sem confirmação
- **Não instalar dependências** sem avisar

### ✅ Padrões de projeto:
- **Componentizado** — atoms → molecules → organisms
- **DDD** — domínio separado da infraestrutura (`core/domain/`, `core/application/`, `core/infrastructure/`)
- **Testes unitários** — todo domínio e use case com testes (Vitest)
- **Pasta `tasks/`** — toda tarefa documentada em arquivo `.md` numerado com checklist
- **Memory.md** — sempre atualizado com decisões

---

## 🎯 Status Atual (28/07)

### ✅ Pronto e no ar
- Landing page completa: Hero, Como funciona, Benefícios, Chat IA, Para quem é, Planos, CTA
- Chat com DeepSeek funcionando + rate limit (10 msg/sessão)
- Admin de leads em `/admin` (senha: admin123)
- Supabase conectado (PostgreSQL)
- E-mail do Google funcionando via await (SMTP porta 587, timeout 5s)
- Seção de planos com 3 tiers (Básico R$49, Evolution R$97, Pro R$197)
- Modal de lead por plano + formatação de telefone
- Domínio: Planos em `Plan.ts` com tipagem DDD

### ⏳ Pendente — Página do Cliente (próximo passo)
- [ ] Sistema de login/autenticação do cliente
- [ ] CRUD de produtos do cliente
- [ ] Página pública do cliente com IA (subdomínio)
- [ ] Painel do cliente (dashboard, leads, configurações)

### 📅 Módulos futuros (plug-and-play por plano)
| Módulo | Plano |
|--------|-------|
| 📲 WhatsApp 1:1 | Evolution |
| 👥 Disparo em grupo | Evolution |
| 📊 Dashboard | Evolution |
| 📸 Instagram | Pro |
| 🌐 Domínio próprio | Pro |

---

## 🧠 Decisões Tomadas

| Data | Decisão | Status |
|------|---------|--------|
| 26/07 | Reset do repositório — novo Next.js | ✅ Feito |
| 26/07 | IA: DeepSeek API | ✅ Definido |
| 26/07 | Arquitetura: DDD + Clean Architecture | ✅ Documentado |
| 26/07 | Design System: Storybook + Tokens | ✅ Documentado |
| 26/07 | Microfrontend: NÃO agora | ✅ Decidido |
| 26/07 | Landing: michelribeiro.com.br | ✅ No ar |
| 26/07 | Domínio do produto: só após 1º cliente | ✅ Decidido |
| 28/07 | Gateway: ASAAS para todos os planos | ✅ Definido |
| 28/07 | Storage: Cloudinary (25GB free) | ✅ Definido |
| 28/07 | Planos: Básico R$49 / Evolution R$97 / Pro R$197 | ✅ Definido |
| 28/07 | Implantação: R$197 único | ✅ Definido |
| 28/07 | E-mail: SMTP Gmail com await (igual Afiliado Elite) | ✅ Funcionando |

---

## 📁 Estrutura do Projeto

```
/
├── src/
│   ├── core/
│   │   ├── domain/plan/        ← Planos (Plan.ts, PlanFeature.ts, PlanType, Price)
│   │   └── infrastructure/
│   │       ├── database/       ← Supabase client
│   │       └── email/          ← Nodemailer + template
│   ├── ui/
│   │   ├── app/                ← Next.js App Router
│   │   ├── components/
│   │   │   ├── landing/        ← Header, Hero, HowItWorks, Benefits, TargetAudience,
│   │   │   │                      LiveDemo, PricingSection, FinalCTA, Footer
│   │   │   ├── chat/           ← ChatWidget (flutuante + inline)
│   │   │   └── lead/           ← LeadModal (plano selection)
│   │   └── hooks/              ← useChat
│   └── config/env.ts
├── app/
│   ├── admin/                  ← Painel de leads (protegido)
│   ├── api/chat/               ← DeepSeek com rate limit
│   ├── api/lead/               ← Captura + Supabase + email
│   └── api/admin/leads/        ← Admin API (GET, PATCH, DELETE)
├── docs/
│   ├── analise-estrategica.md
│   ├── arquitetura-projeto.md
│   ├── design-system.md
│   ├── especificacao-produto.md
│   ├── prompt-figma.txt
│   ├── variaveis-ambiente.md
│   └── arquitetura-cliente.md  ← ⬅️ PRÓXIMA FASE
├── tasks/
│   ├── board.md
│   ├── 001-definir-nicho-oferta.md (pausada)
│   ├── 002-planejar-evolucao-robo.md (ativa)
│   ├── 003-planos-e-precificacao.md (concluída)
│   └── README.md
└── memory.md                   ← Este arquivo
```

---

## 📌 Tasks Ativas

| # | Task | Status |
|---|------|--------|
| 001 | Definir Nicho + Oferta | 🟡 Pausada |
| 002 | Evolução do Robô | 🔴 Ativa |
| 003 | Planos e Precificação | ✅ Concluída |
| — | Página do Cliente | ⏳ Próximo passo |

---

## 📚 Documentos Criados

| Arquivo | Conteúdo |
|---------|----------|
| `docs/analise-estrategica.md` | Análise da sugestão do ChatGPT |
| `docs/arquitetura-projeto.md` | DDD, estrutura de pastas, ADRs |
| `docs/design-system.md` | Storybook, tokens, padrão de componentes |
| `docs/especificacao-produto.md` | Especificação completa do produto |
| `docs/variaveis-ambiente.md` | Lista de env vars |
| `docs/arquitetura-cliente.md` | ⬅️ Próxima fase: página do cliente |
| `tasks/board.md` | Visão geral de todas as tasks |
