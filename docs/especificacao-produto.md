# Especificação do Produto — Robô Vendedor com IA

> **Status:** Em desenvolvimento  
> **Última atualização:** 28/07/2025

---

## Atenção: O que estamos construindo AGORA

**Landing de venda do serviço** — `michelribeiro.com.br`

> A landing já é o produto em ação: IA funcionando, capturando leads, provando o valor.

---

## 1. Público da Landing

**Quem visita:** Donos de pequenos negócios, prestadores de serviço, autônomos, qualquer um que vende e quer vender mais.

**O que eles querem:** Vender mais sem ter que ficar 24h respondendo WhatsApp.

---

## 2. Estrutura da Landing (michelribeiro.com.br)

### 2.1 Hero (primeira tela)

- [ ] Título de impacto (ex: "Seu robô vendedor 24h por dia")
- [ ] Subtítulo (ex: "IA que atende, tira dúvidas e captura leads enquanto você trabalha")
- [ ] Botão CTA principal (ex: "Quero meu robô vendedor")
- [ ] Ilustração/mockup

### 2.2 Como funciona (3 passos)

- [ ] Passo 1: Você cadastra seus produtos
- [ ] Passo 2: Compartilha o link
- [ ] Passo 3: IA atende, captura leads, você vende mais

### 2.3 Benefícios

- [ ] Atendimento 24h
- [ ] IA treinada nos seus produtos
- [ ] Lead qualificado
- [ ] Mais vendas sem mais trabalho

### 2.4 Chat com IA ao vivo (diferencial)

- [ ] Botão flutuante "Falar com IA" na landing
- [ ] Visitante clica e começa a conversar com a DeepSeek
- [ ] IA explica o serviço, tira dúvidas sobre o robô vendedor
- [ ] **Se o visitante se interessar**, a IA pergunta: "Quer saber mais? Me deixa seu contato que eu envio tudo"
- [ ] Captura: nome + WhatsApp + segmento
- [ ] **Lead vai pro meu painel admin + e-mail**

### 2.5 Demonstração (opcional)

- [ ] Print ou mini-vídeo do chat funcionando (se não quiser só o chat ao vivo)

### 2.6 Para quem é

- [ ] Pequenas lojas
- [ ] Prestadores de serviço
- [ ] Profissionais autônomos
- [ ] Quem vende pelo WhatsApp hoje

### 2.7 Preço / Planos

| Plano | Preço | Funcionalidades |
|-------|-------|----------------|
| 🟢 **Básico** | **R$ 49/mês** | Página + IA + leads ilimitados + Checkout (ASAAS) + até 30 produtos |
| 🟡 **Evolution** | **R$ 97/mês** | Tudo do Básico + WhatsApp 1:1 + Disparo em grupo (até 3) + Dashboard + produtos ilimitados |
| 🔴 **Pro** | **R$ 197/mês** | Tudo do Evolution + Cloud API (oficial) + Instagram + 10 grupos + Domínio próprio |

**Implantação (todos os planos):** R$ 197 único — configurar produtos, conectar WhatsApp, treinar IA

**Gateway:** ASAAS para todos os planos (boleto, cartão, PIX). Sem escolha do cliente — mantemos 1 gateway pra simplicidade.

**Storage de imagens:** Cloudinary (25GB grátis). Plano Básico: até 30 fotos. Evolution/Pro: ilimitado.

### 2.8 CTA Final

- [ ] "Comece agora" / "Quero testar grátis"
- [ ] Ou o próprio chat já captura

---

## 3. Meu Painel Administrativo (admin do Michel)

> Área protegida onde eu vejo os leads gerados pela IA na landing.

### 3.1 Leads

- [ ] Nome, WhatsApp, segmento, data/hora
- [ ] Origem: veio pelo chat da IA ou pelo formulário
- [ ] Status: `novo` | `contatado` | `convertido` | `perdido`
- [ ] Ação: marcar status, adicionar observação
- [ ] Exportar

### 3.2 Notificação por e-mail

- [ ] Quando um lead é capturado → dispara e-mail pra mim
- [ ] E-mail com: nome, WhatsApp, segmento, o que a IA conversou com ele (resumo)

### 3.3 (Futuro) Configuração da IA

- [ ] Ajustar tom de voz da IA que atende na landing
- [ ] Atualizar informações sobre o serviço

---

## 4. Fluxo Completo da Landing

```
1. Visitante chega em michelribeiro.com.br
2. Lê a página, fica interessado
3. Clica "Falar com IA" no canto
4. IA pergunta: "Oi! Me conta qual seu negócio?"
5. Visitante responde: "Tenho uma loja de roupas"
6. IA explica como o robô ajuda lojas de roupa
7. IA pergunta: "Quer saber mais? Me deixa seu contato."
8. Visitante: nome + WhatsApp
9. [SISTEMA] Salva lead no banco
10. [SISTEMA] Dispara e-mail pra mim: "Novo lead! Maria - Loja de Roupas - 11999999999"
11. [SISTEMA] Mostra no meu painel admin
12. Eu entro em contato e fecho a venda
```

---

## 5. Duas IAs diferentes (importante)

| Onde | Quem usa | Função |
|------|----------|--------|
| **Landing (meu site)** | Visitante interessado em comprar o robô | VENDER o serviço |
| **Produto do cliente** | Cliente final do meu cliente | VENDER os produtos do cliente |

São contextos diferentes, treinamentos diferentes, mas o motor é o mesmo (DeepSeek).

---

## 6. O que fica de fora dessa fase

- ❌ Painel administrativo pro cliente (só o meu)
- ❌ Checkout integrado
- ❌ Múltiplos usuários
- ❌ Domínio próprio do cliente

---

## 7. Segurança do Chat

### ✅ Implementado (Camada 1)
- Limite de 10 mensagens por sessão (5 idas e vindas)
- Bloqueio no frontend e no backend (API retorna 429)
- Mensagem amigável quando atinge o limite + convite pra deixar contato

### ⏳ Futuro (Camada 2 — Upstash)
- Rate limit por IP via Upstash Redis (10.000 comandos/dia grátis)
- Bloqueio automático de IPs abusivos
- Dependências: `@upstash/redis`, `@upstash/ratelimit`

---

## 8. Regras de Negócio

> Regras que definem o comportamento do sistema completo (produto final).

---

### 8.1 Gestão de Clientes

- **Admin pode:** cadastrar, editar, suspender, reativar e excluir clientes
- Cada cliente tem: plano contratado, status (`ativo` | `inadimplente` | `cancelado`), data de início, data de vencimento
- Cliente tem **painel próprio** com acesso restrito por login
- Ao cadastrar um cliente, o sistema deve permitir vincular manualmente o plano e os módulos liberados

---

### 8.2 Provisionamento (criação da conta)

**Regra final (automática) — fluxo completo:**

```
1. Cliente compra e paga via ASAAS (cartão/PIX)
2. ASAAS confirma pagamento → envia webhook para o sistema
3. Sistema cria:
   - Conta do cliente (login: e-mail, senha: temporária)
   - Página pública no subdomínio: cliente.vendas.michelribeiro.com.br
   - Registro no banco: plano, módulos liberados, status "ativo"
4. Sistema dispara e-mail:
   ┌────────────────────────────────────────────┐
   │ Assunto: Seu Robô Vendedor está pronto! 🚀 │
   │                                             │
   │ Olá [Nome],                               │
   │                                             │
   │ Sua página já está no ar!                  │
   │ 📍 joao.vendas.michelribeiro.com.br       │
   │                                             │
   │ Acesse seu painel para configurar:         │
   │ 🔗 app.michelribeiro.com.br/login         │
   │ Login: [e-mail]                            │
   │ Senha: [temporária]                        │
   │                                             │
   │ ⚠️ Recomendamos trocar a senha no         │
   │    primeiro acesso.                         │
   └────────────────────────────────────────────┘
5. Cliente acessa, troca senha, cadastra produtos
6. Pronto! Página dele já está no ar com IA
```

**Boleto:** criar a conta, mas liberar acesso total **após confirmação de pagamento**.

**Regra transitória (enquanto não tem ASAAS integrado):**
- Admin cria cliente manualmente no painel
- Admin libera acesso manualmente
- Sistema gera e-mail com login automático

---

### 8.3 Pagamentos — Visibilidade Única

> O ASAAS é o processador, mas ninguém precisa acessá-lo.

**Cliente vê no painel dele:**
- Status da assinatura (ativa/inadimplente/cancelada)
- Próximo vencimento
- Histórico de pagamentos (data, valor, forma de pagamento)
- Opção de emitir 2ª via do boleto (se aplicável)
- **Não vê**: valor que Michel recebe, taxas, comissões

**Michel vê no admin:**
- Receita recorrente (MRR)
- Clientes ativos, inadimplentes, cancelados
- Histórico completo de cada cliente
- Próximos vencimentos
- Total de cancelamentos (churn)
- **Tudo centralizado**, sem sair do sistema

---

### 8.4 Comissões para Parceiros / Afiliados

> Para permitir que agências e parceiros vendam o sistema e ganhem comissão.

**Cadastro de parceiros (no admin do Michel):**
- Nome, WhatsApp, e-mail, chave PIX
- Percentual de comissão (pode ser global ou por parceiro)
- Link de afiliado único (ex: `michelribeiro.com.br/?ref=parceiro`)

**Regras de comissão:**
- Parceiro ganha **X% enquanto o cliente pagar** (recorrência)
- Sugestão: 50% da 1ª mensalidade + 10% recorrente, ou só 15% recorrente
- Comissão calculada automaticamente quando o pagamento é confirmado

**Relatório de comissões (no admin do Michel):**
- Comissões a pagar (valor, parceiro, cliente, data, status)
- Status: `pendente` | `pago`
- Admin marca como pago quando transferir via PIX
- Total gerado por parceiro (mês, acumulado)

---

### 8.5 Gateway de Pagamento

- **Único gateway:** ASAAS (cartão, boleto, PIX)
- ASAAS roda **invisível** — ninguém além do sistema se conecta a ele
- Webhook da ASAAS → sistema atualiza status de pagamento automaticamente
- Repasse automático para a **conta bancária do Michel** (configurado na ASAAS, não no sistema)
- Se o cartão for recusado, ASAAS notifica → sistema marca como inadimplente → sistema notifica cliente por e-mail

---

### 8.6 Painel do Cliente (visão geral)

> O que o cliente vê ao logar.

#### Navegação inteligente (por plano)

Cada menu aparece ou fica oculto conforme o plano contratado:

| Menu | Básico | Evolution | Pro |
|------|:------:|:---------:|:---:|
| Dashboard | ❌ oculto | ✅ visível | ✅ visível |
| Produtos | ✅ | ✅ | ✅ |
| Leads | ✅ | ✅ | ✅ |
| WhatsApp | ❌ oculto | ✅ | ✅ |
| Grupos | ❌ oculto | ✅ | ✅ |
| Instagram | ❌ oculto | ❌ oculto | ✅ |
| Configurações | ✅ | ✅ | ✅ |
| Pagamentos | ✅ | ✅ | ✅ |

#### Seções do painel

| Seção | Conteúdo |
|-------|----------|
| Dashboard | Leads recebidos (total, hoje, esse mês), status do plano |
| Produtos | CRUD completo (cadastrar, editar, listar, excluir) |
| Leads | Clientes que interagiram com a página dele |
| Minha página | Visualizar como os clientes dele veem |
| Pagamentos | Status da assinatura, histórico, 2ª via de boleto |
| Configurações | Logo, cores, tom da IA, dados do negócio |

#### Módulos bloqueados com call-to-action

Na página inicial do painel, o cliente vê uma **visão geral dos módulos**:

```
┌─────────────────────────────────────────────────────┐
│  Seus Módulos                                       │
│                                                     │
│  🔓 Página + IA                     ✅ Ativo       │
│  🔓 Captura de leads                ✅ Ativo       │
│  🔓 Checkout ASAAS                  ✅ Ativo       │
│  🔒 WhatsApp 1:1          🔜 Fazer Upgrade R$97    │
│  🔒 Dashboard             🔜 Fazer Upgrade R$97    │
│  🔒 Instagram             🔜 Fazer Upgrade R$197   │
│  🔒 Domínio próprio       🔜 Fazer Upgrade R$197   │
└─────────────────────────────────────────────────────┘
```

Isso serve como **vitrine de upgrade** — o cliente vê o que está perdendo

---

### 8.7 Módulos por Plano (plug-and-play)

| Módulo | Básico (R$49) | Evolution (R$97) | Pro (R$197) |
|--------|:-------------:|:----------------:|:-----------:|
| Página pública + IA | ✅ | ✅ | ✅ |
| Captura de leads | ✅ | ✅ | ✅ |
| Até 30 produtos | ✅ (limite) | ✅ (ilimitado) | ✅ (ilimitado) |
| Checkout ASAAS | ✅ | ✅ | ✅ |
| WhatsApp 1:1 | ❌ | ✅ | ✅ |
| Disparo em grupo | ❌ | ✅ (até 3 grupos) | ✅ (até 10 grupos) |
| Dashboard | ❌ | ✅ | ✅ |
| Instagram | ❌ | ❌ | ✅ |
| Domínio próprio | ❌ | ❌ | ✅ |

---

### 8.8 Domínio e Subdomínio (100% automático)

#### Setup único (uma vez na vida)

```
1. No DNS de michelribeiro.com.br:
   - Registrar: vendas.michelribeiro.com.br
   - Apontar CNAME ou A para a Vercel

2. Na Vercel:
   - Adicionar domínio wildcard: *.vendas.michelribeiro.com.br

3. ✅ Setup completo — não precisa fazer nada por cliente
```

#### Como funciona para cada cliente

```
Novo cliente "João Padaria" compra o plano
    ↓
Sistema gera: joao-padaria.vendas.michelribeiro.com.br
    ↓
Vercel já resolve qualquer *.vendas.... automaticamente
    ↓
Next.js detecta o subdomínio "joao-padaria"
    ↓
Busca no banco os dados do cliente João
    ↓
Renderiza a página personalizada dele com produtos + IA
```

**Zero trabalho manual por cliente.** Um novo cliente = apenas um registro no banco.

#### Domínio próprio (plano Pro)

- O cliente pode usar o próprio domínio (ex: `joao.meunegocio.com.br`)
- Na V1: **configuração manual** (cliente solicita, Michel configura DNS uma vez)
- Futuro: automatizar via API da Vercel para o cliente fazer sozinho

---

## 9. Próximos passos

- [ ] Aprovar estrutura
- [ ] Definir cores / identidade visual
- [ ] Iniciar desenvolvimento da landing + IA
