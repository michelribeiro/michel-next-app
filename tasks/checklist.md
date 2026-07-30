# 📦 Robô Vendedor — Checklist Geral

> Checklist visual de tudo que o produto precisa ter.
> ✅ = Pronto e no ar | 🔄 = Em desenvolvimento | ❌ = Pendente

**Última atualização:** 28/07/2025

---

## 🏠 Landing — michelribeiro.com.br

- [x] **Hero** — Título, subtítulo, CTA principal
- [x] **Header** — Navegação da landing
- [x] **Como funciona** — 3 passos
- [x] **Benefícios** — Card de benefícios
- [x] **Chat IA (DeepSeek)** — Widget flutuante + inline no LiveDemo
- [x] **Rate limit** — 10 mensagens por sessão (front + backend)
- [x] **Para quem é** — Seção de público-alvo
- [x] **Planos / Preços** — PricingSection com 3 tiers
- [x] **CTA Final** — FinalCTA com captura
- [x] **Footer**
- [x] **Modal de Lead** — Captura nome + WhatsApp + plano selecionado
- [ ] **Demonstração em vídeo/print** (opcional)

---

## ⚙️ Admin do Michel

### Leads
- [x] **Listagem de leads** — Nome, WhatsApp, data, status
- [x] **CRUD de leads** — Criar, editar status, excluir (API)
- [x] **Notificação por e-mail** — Ao capturar lead (SMTP Gmail)
- [x] **Autenticação** — Admin protegido por senha

### Clientes
- [x] **Cadastro de clientes** — Nome, e-mail, WhatsApp, plano
- [x] **Edição de clientes** — Alterar plano (select), suspender/reativar/cancelar
- [x] **Listagem** — Tabela com nome, e-mail, WhatsApp, plano, status, data
- [ ] **Filtros** — Ativos, inadimplentes, cancelados
- [ ] **Detalhes do cliente** — Página individual com histórico
- [ ] **E-mail de boas-vindas** — Envio automático ao cadastrar

### Pagamentos (novo)
- [ ] **MRR** — Receita recorrente mensal
- [ ] **Clientes inadimplentes** — Lista com dias de atraso
- [ ] **Histórico por cliente** — Pagamentos, vencimentos
- [ ] **Cancelamentos (churn)** — Taxa e histórico

### Comissões (novo)
- [ ] **Cadastro de parceiros** — Nome, WhatsApp, chave PIX, %
- [ ] **Relatório de comissões** — Pendentes, pagas, total
- [ ] **Link de afiliado** — ?ref=parceiro
- [ ] **Marcar comissão como paga**

---

## 👤 Página do Cliente

### Autenticação
- [x] **Tela de login** (`/login`) — cliente loga com e-mail + senha
- [x] **Sessão segura** — token armazenado no navegador (30 dias)
- [x] **Layout protegido** — `/app/*` redireciona pro login se não autenticado
- [x] **Geração de senha automática** — admin cadastra, sistema gera senha temporária
- [ ] **Redefinição de senha** — 

### Painel do Cliente
- [ ] **Dashboard** — Leads recebidos, status do plano
- [ ] **CRUD de produtos** — Cadastrar, editar, listar, excluir
- [ ] **Upload de imagens** — Cloudinary (foto do produto)
- [ ] **Leads recebidos** — Quem interagiu com a página dele
- [ ] **Visualizar página pública** — Preview
- [ ] **Pagamentos** — Status, histórico, 2ª via de boleto
- [ ] **Configurações** — Logo, cores, tom da IA, dados do negócio

### Navegação inteligente
- [ ] **Menus por plano** — Ocultar módulos não contratados
- [ ] **Módulos bloqueados** — Vitrine de upgrade com CTA

### Página Pública do Cliente
- [ ] **Catálogo de produtos** — Foto, nome, preço
- [ ] **IA treinada nos produtos** — DeepSeek com contexto do cliente
- [ ] **Captura de lead** — Nome + WhatsApp
- [ ] **Subdomínio automático** — `cliente.vendas.michelribeiro.com.br`
- [ ] **Link para compartilhar** — Botão "Copiar link"

---

## 📲 WhatsApp

- [ ] **Disparo 1:1** — IA chama lead no privado após captura
- [ ] **Disparo em grupo** — Cliente cadastra grupos, robô envia ofertas
- [ ] **Autenticação do cliente** — Cliente conecta o próprio WhatsApp
- [ ] **Limite por plano** — Evolution: até 3 grupos, Pro: até 10

---

## 💳 Pagamentos (ASAAS)

- [ ] **Integração ASAAS** — Gateway para todos os planos
- [ ] **Webhook de confirmação** — Atualizar status automaticamente
- [ ] **Cobrança recorrente** — Cartão (automático), boleto, PIX
- [ ] **Provisionamento automático** — Pagou → conta criada + e-mail enviado
- [ ] **Notificação de inadimplência** — Cartão recusado, boleto vencido
- [ ] **2ª via de boleto** — Cliente emite no painel dele

---

## 📊 Dashboard / Relatórios

- [ ] **Gráfico de leads** — Por dia/semana/mês
- [ ] **Taxa de conversão** — Leads → clientes
- [ ] **Origem dos leads** — Chat da IA vs formulário
- [ ] **Exportar relatórios** — CSV / PDF

---

## 🌐 Domínio

- [x] **Setup wildcard Vercel** — `*.vendas.michelribeiro.com.br` (pendente configurar)
- [ ] **Subdomínio automático por cliente**
- [ ] **Domínio próprio (Pro)** — Manual na V1, automatizar futuro

---

## 📋 Infraestrutura / Core

- [x] **DDD** — core/domain, core/application, core/infrastructure
- [x] **Supabase** — Banco de dados conectado
- [x] **DeepSeek API** — Chat funcionando
- [x] **Rate limit** — 10 msg/sessão
- [x] **E-mail SMTP** — Gmail com await
- [x] **Planos** — Domain entities (Plan, PlanFeature, PlanType, Price)
- [ ] **Testes unitários** — Vitest (domínio + use cases)
- [ ] **Storybook** — Design system com tokens

---

## 🧩 Módulos Futuros

- [ ] **Instagram** — Integração (plano Pro)
- [ ] **Checkout integrado** — Cliente vende dentro da plataforma
- [ ] **Domínio próprio automático** — Via API da Vercel

---

## Legenda

| Ícone | Significado |
|-------|-------------|
| ✅ | Pronto e no ar |
| 🔄 | Em desenvolvimento |
| ❌ | Pendente / Não iniciado |
