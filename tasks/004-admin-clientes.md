# Task 004 — Admin de Clientes

**Status:** `em_andamento`  
**Prioridade:** `alta`  
**Criada em:** 28/07/2025  

---

## Objetivo

Criar no admin do Michel a gestão de clientes (quem contratou o serviço): cadastrar, editar plano, suspender, reativar, visualizar detalhes.

---

## Checklist

- [x] Domain entity (Client, ClientStatus)
- [x] Supabase functions (CRUD clientes)
- [x] API route `/api/admin/clients`
- [x] Tabela `clients` no Supabase (SQL de criação)
- [x] Admin page com abas (Leads | Clientes)
- [x] Modal de cadastro de cliente
- [x] Listagem de clientes com status e plano
- [x] Ações: editar plano, suspender, reativar

---

## Regras de Negócio

- Admin cadastra: nome, e-mail, WhatsApp, plano, status
- Cada cliente tem: plano, status (`active` | `suspended` | `canceled`), data de início
- Admin pode alterar plano e status a qualquer momento
- Admin pode ver detalhes do cliente (pagamentos futuramente)

---

## Próximo passo

- [ ] Criar página de detalhes do cliente
- [ ] Integrar com ASAAS (provisionamento automático)
- [ ] Integrar com envio de e-mail de boas-vindas
