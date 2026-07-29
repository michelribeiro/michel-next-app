# Task 002 — Planejar Evolução do Robô Vendedor

**Status:** `aberta`  
**Prioridade:** `alta`  
**Criada em:** 28/07/2025

---

## Objetivo

Planejar e desenvolver as novas funcionalidades do Robô Vendedor e atualizar o site `michelribeiro.com.br` para refletir a oferta completa.

---

## O que o site oferece HOJE

- ✅ Página com produtos do cliente
- ✅ IA pra tirar dúvidas (DeepSeek)
- ✅ Captura de lead (Supabase + e-mail)
- ✅ Admin de leads

## O que vai PASSAR a oferecer

- ✅ Tudo que já tem
- 📲 Disparo WhatsApp 1:1 (IA chama lead no privado)
- 👥 Disparo em grupo (cliente cadastra grupos, robô envia ofertas)
- 📊 Dashboard com gráficos
- 📸 (Futuro) Integração Instagram
- 💰 (Futuro) Checkout integrado

---

## O que precisa ser criado/atualizado

### 1. No site (michelribeiro.com.br)

- [ ] **Hero** — atualizar subtítulo e benefícios com as novas features
- [ ] **Como funciona** — adicionar passo do WhatsApp
- [ ] **Benefícios** — adicionar "Disparo inteligente no WhatsApp"
- [ ] **Planos/Preço** — baseado em limites (ex: X grupos, Y leads)
- [ ] **CTA** — oferta nova, precificação

### 2. No sistema (backend)

- [ ] Integração com API WhatsApp (Cloud API ou Evolution)
- [ ] Disparo 1:1 automático após captura de lead
- [ ] Cadastro de grupos pelo cliente
- [ ] Controle de limite de grupos (admin define por cliente)
- [ ] Dashboard (gráficos de leads, conversão, etc.)

### 3. No admin

- [ ] Campo "limite de grupos" no cadastro do cliente
- [ ] Dashboard com métricas

---

## Pendências

- [ ] Definir qual API do WhatsApp usar (Cloud API oficial ou Evolution)
- [ ] Definir como cliente autentica o WhatsApp dele
- [ ] Definir precificação por grupos/leads

---

## Próximo passo

- [ ] Detalhar tecnicamente o disparo WhatsApp (criar sub-task ou doc)

---

## Relacionado

- Task 001 — Nicho/Oferta (pausada)
- Site atual: michelribeiro.com.br
