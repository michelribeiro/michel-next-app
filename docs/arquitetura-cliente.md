# Arquitetura — Página do Cliente

> **Status:** Rascunho  
> **Última atualização:** 28/07/2025

---

## 1. Visão Geral

O cliente contrata o Robô Vendedor e recebe uma **página própria** onde os clientes DELE vão ver produtos, conversar com a IA e comprar.

```
Sistema completo:
├── michelribeiro.com.br      ← Landing de vendas (pronta)
├── admin.michelribeiro.com.br ← Meu painel admin (pronto)
├── api.michelribeiro.com.br   ← APIs do sistema (prontas)
└── cliente.vendas.michelribeiro.com.br ← Página do cliente (❌ construir)
```

---

## 2. O que o cliente recebe

Cada cliente contratante tem:

```
Página pública (os clientes DELE veem):
├── Nome/logo do negócio
├── Catálogo de produtos (foto + nome + preço)
├── IA pra tirar dúvidas (DeepSeek)
├── Botão "Comprar" / "Falar com IA"
└── Captura de lead

Painel do cliente (ele gerencia):
├── Login/senha
├── Cadastro de produtos (CRUD)
├── Leads recebidos
├── Configurações (cor, logo, tom da IA)
└── Módulos contratados (WhatsApp, Dashboard, etc.)
```

---

## 3. Estrutura de pastas (proposta)

```
src/
├── app/
│   ├── (site)/                  ← Landing pública (já existe)
│   ├── admin/                   ← Meu admin (já existe)
│   └── app/                     ← Painel do cliente (❌ construir)
│       ├── login/
│       ├── dashboard/
│       ├── produtos/
│       │   ├── cadastrar/
│       │   ├── editar/
│       │   └── listar/
│       ├── leads/
│       └── configuracoes/
├── core/
│   └── domain/
│       ├── product/             ← Domínio de produto
│       │   ├── entities/
│       │   ├── value-objects/
│       │   └── repositories/
│       ├── client/              ← Domínio do cliente
│       └── plan/                ← Já existe
```

---

## 4. Módulos (plug-and-play)

Cada módulo é independente. Ativado conforme o plano do cliente:

| Módulo | Plano mínimo | Status |
|--------|-------------|--------|
| Página + IA + Checkout | Básico | ⏳ Construir |
| 📲 WhatsApp 1:1 | Evolution | 📅 Futuro |
| 👥 Disparo em grupo | Evolution | 📅 Futuro |
| 📊 Dashboard | Evolution | 📅 Futuro |
| 📸 Instagram | Pro | 📅 Futuro |
| 🌐 Domínio próprio | Pro | 📅 Futuro |

---

## 5. Fluxo completo (como será)

```
1. Cliente acessa michelribeiro.com.br
2. Escolhe um plano → preenche dados
3. [Admin] Eu aprovo e crio a conta
4. Cliente recebe e-mail com login
5. Cliente acessa app.michelribeiro.com.br
6. Cadastra produtos, logo, cores
7. Sistema gera link: cliente.vendas.michelribeiro.com.br
8. Cliente compartilha o link no WhatsApp/Instagram
9. Clientes DELE acessam, veem produtos, IA atende
10. Leads capturados → Cliente vê no painel dele
```

---

## 6. Próximos passos

- [ ] Criar sistema de autenticação (login do cliente)
- [ ] Criar CRUD de produtos
- [ ] Criar página pública do cliente (com IA)
- [ ] Gerar subdomínio automático
- [ ] Ativar módulos por plano

---

> Este documento será atualizado conforme o desenvolvimento avançar.
