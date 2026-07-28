# Especificação do Produto — Robô Vendedor com IA

> **Status:** Rascunho inicial  
> **Última atualização:** 26/07/2025

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

- [ ] A definir — enquanto não decide, "Sob consulta" ou valor sugerido

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

## 8. Próximos passos

- [ ] Aprovar estrutura
- [ ] Definir cores / identidade visual
- [ ] Iniciar desenvolvimento da landing + IA
