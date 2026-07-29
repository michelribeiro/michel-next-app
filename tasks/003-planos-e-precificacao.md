# Task 003 — Planos e Precificação

**Status:** `aberta`  
**Prioridade:** `alta`  
**Criada em:** 28/07/2025

---

## Objetivo

Definir os planos do Robô Vendedor com base nas funcionalidades que já temos + as que vamos construir.

---

## Custos operacionais (pra você)

| Item | 10 clientes | 100 clientes |
|------|------------|-------------|
| DeepSeek | ~R$ 5/mês | ~R$ 50/mês |
| Supabase (banco + storage) | R$ 0 (500MB + 1GB free) | R$ 0 |
| Vercel | R$ 0 | R$ 0 |
| Evolution API (hospedagem) | R$ 0 (dev) | ~R$ 20/mês |
| Cloudinary (storage imagens) | R$ 0 (25GB free) | R$ 0 |
| Cloud API (se contratarem) | R$ 0 | ~R$ 50/mês |
| **Total** | **~R$ 5/mês** | **~R$ 120/mês** |

**100 clientes × R$ 97 = R$ 9.700 receita - R$ 120 custo = R$ 9.580 lucro.**

---

## Estrutura de planos

## Planos revisados (28/07)

| Plano | Preço | Funcionalidades |
|-------|-------|----------------|
| 🟢 **Básico** | **R$ 49/mês** | Página + IA + leads ilimitados + Checkout (ASAAS) + até 30 produtos |
| 🟡 **Evolution** | **R$ 97/mês** | Tudo do Básico + WhatsApp 1:1 + Disparo em grupo (até 3) + Checkout (ASAAS) + Dashboard + produtos ilimitados |
| 🔴 **Pro** | **R$ 197/mês** | Tudo do Evolution + Cloud API + Instagram + Checkout (ASAAS) + 10 grupos + Domínio próprio |

### Implantação (todos os planos) — R$ 197 único
- Configurar produtos/serviços
- Conectar WhatsApp (QR Code ou Business)
- Treinar IA nos dados do cliente
- Personalizar página (logo, cores)

### Gateway
- **ASAAS** para todos os planos. Sem escolha do cliente.
- Boleto, cartão e PIX.
- Motivo: simplicidade operacional.

### Storage
- **Cloudinary** (25GB grátis)
- Básico: até 30 fotos
- Evolution/Pro: ilimitado

---

## Comparação com concorrência

| Concorrente | Preço | Funcionalidades |
|------------|-------|-----------------|
| ManyChat | US$ 15 (~R$ 85) | Só WhatsApp, sem página de vendas |
| WATI | R$ 49/mês | Só WhatsApp, sem IA |
| Z-API | R$ 69/mês | Só API, sem frontend |
| **Robô Vendedor** | **R$ 49 a R$ 197** | Página + IA + WhatsApp + Dashboard + Checkout |

---

## Projeções

| Cenário | Receita mensal |
|---------|---------------|
| 10 clientes Evolution (R$ 97) | R$ 970 |
| 30 clientes Evolution | R$ 2.910 |
| Mix: 20 Evo + 5 Pro | R$ 2.925 |
| 50 clientes Evo + 10 Pro | R$ 6.820 |
| 100 clientes Evo + 20 Pro | R$ 13.640 |

---

## A definir

- [ ] **Teste grátis** — quantos dias? O que liberar?
- [ ] **Upgrade/downgrade** — como funciona entre planos?
- [ ] **Excedente** — o que acontece se passar do limite (ex: lead extra)?

---

## Próximos passos

- [ ] Aprovar valores dos planos
- [ ] Atualizar landing page com planos
- [ ] Criar sistema de cadastro de clientes no admin
- [ ] Implementar limites por plano no backend

---

## Relacionado

- Task 002 — Evolução do Robô
- Site: michelribeiro.com.br
