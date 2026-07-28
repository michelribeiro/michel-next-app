# Memória do Projeto — Michel Next App

> **Propósito:** Manter contexto contínuo entre sessões e decisões.  
> **Última atualização:** 26/07/2025

---

## 📋 Visão Geral

| Campo | Valor |
|-------|-------|
| **Projeto** | michel-next-app |
| **Stack** | Next.js 16 + TypeScript + Tailwind CSS |
| **Deploy** | Vercel (main) |
| **Repositório** | https://github.com/michelribeiro/michel-next-app |
| **Domínio landing** | michelribeiro.com.br |
| **Domínio produto** | A definir (após 1º cliente) |

---

## 🚨 REGRAS DO PROJETO (obrigatório seguir)

### ❌ Nunca sem permissão explícita:
- **Não commitar nada** sem perguntar antes
- **Não codar nada** sem perguntar antes
- **Não alterar arquivos existentes** sem confirmação
- **Não instalar dependências** sem avisar

### ✅ Padrões de projeto:
- **Componentizado** — tudo em componentes pequenos e reutilizáveis (atoms → molecules → organisms)
- **DDD (Domain-Driven Design)** — domínio separado da infraestrutura (`src/core/domain/`, `src/core/application/`, `src/core/infrastructure/`)
- **Testes unitários** — todo domínio e use case com testes (Vitest)
- **Pasta `tasks/`** — toda tarefa documentada em arquivo `.md` numerado com checklist
- **Memory.md** — esse arquivo, sempre atualizado com decisões

---

## 🎯 Direção Atual

**Produto:** Robô Vendedor com IA  
**Conceito:** Página única com IA (DeepSeek) assessorando a compra. Cliente vê produto, tira dúvidas com IA, compra com cupom. Comissão nossa.

**Problema identificado:** Tráfego ainda é o gargalo principal.

**Status:** Planejamento — definindo nicho + oferta específica.

---

## 🧠 Decisões Tomadas

| Data | Decisão | Status |
|------|---------|--------|
| 26/07 | Reset do repositório — novo Next.js | ✅ Feito |
| 26/07 | IA: DeepSeek API (já temos conta) | ✅ Definido |
| 26/07 | Pagamento: ASAAS favorito (a confirmar) | ⏳ Pendente |
| 26/07 | Arquitetura: DDD + Clean Architecture adaptada | ✅ Documentado |
| 26/07 | Design System: Storybook + Lucide + Tokens | ✅ Documentado |
| 26/07 | Microfrontend: NÃO agora, monorepo com domínios | ✅ Decidido |
| 26/07 | Landing: michelribeiro.com.br será landing de venda do serviço | ✅ Definido |
| 26/07 | Domínio do produto: só comprar após 1º cliente pagante | ✅ Definido |
| 26/07 | Subdomínios temporários: `cliente.vendas.michelribeiro.com.br` | ✅ Plano B |

---

## 🔄 Projetos Relacionados

| Projeto | Status | Uso |
|---------|--------|-----|
| **Afiliado Elite** | ⏸️ Parado (0 receita, 0 custo) | Case/portfólio futuro |

---

## 📁 Estrutura do Projeto

```
/
├── src/
│   ├── core/               # DDD — domínio, aplicação, infraestrutura
│   │   ├── domain/         #   Entidades, VOs, interfaces de repositório
│   │   ├── application/    #   Use cases, DTOs, ports
│   │   └── infrastructure/ #   Implementações (MongoDB, DeepSeek, ASAAS)
│   ├── ui/                 # Apresentação
│   │   ├── app/            #   Next.js App Router
│   │   ├── components/     #   atoms/ molecules/ organisms/ templates/
│   │   ├── hooks/          #   Custom hooks
│   │   └── tokens/         #   Design tokens
│   ├── shared/             # utils, types, constants
│   └── config/             # env, DI
├── docs/                   # Documentação e análises
├── tasks/                  # Tarefas ativas e concluídas (board.md + NNN-titulo.md)
├── memory.md               # ← Este arquivo
```

---

## 📌 Tasks Ativas

| # | Task | Status |
|---|------|--------|
| 001 | Definir Nicho + Oferta | 🔄 Em andamento |
| — | Arquitetura do Projeto | ✅ Docs criados |
| — | Design System | ✅ Docs criados |

---

## 💡 Ideias em Aberto

- Parceria com quem já tem tráfego (resolver gargalo)
- Primeira entrega manual pra 1 cliente real
- Gateway: ASAAS vs Stripe vs outros

---

## 📚 Documentos Criados

| Arquivo | Conteúdo |
|---------|----------|
| `docs/analise-estrategica.md` | Análise da sugestão do ChatGPT |
| `docs/arquitetura-projeto.md` | DDD, estrutura de pastas, ADRs |
| `docs/design-system.md` | Storybook, tokens, padrão de componentes |
| `tasks/001-definir-nicho-oferta.md` | Task ativa — definindo nicho |
| `tasks/README.md` | Formato das tasks |
| `tasks/board.md` | Visão geral de todas as tasks |
