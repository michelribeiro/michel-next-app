# Task 006 — CRUD de Produtos

**Status:** `em_andamento`  
**Prioridade:** `alta`  
**Criada em:** 30/07/2025  

---

## Objetivo

Criar o cadastro de produtos/serviços no painel do cliente, com editor rich text para descrição e upload de imagem.

---

## Checklist

- [ ] Tabela `products` no Supabase
- [ ] Domain entity (Product, ProductType)
- [ ] API de CRUD (/api/products)
- [ ] Tela no painel do cliente (/app/produtos)
- [ ] Editor rich text (react-quill-new) na descrição
- [ ] Upload de imagem (Cloudinary)
- [ ] Validação de limite por plano
- [ ] Campo tipo: produto ou serviço

---

## Regras de Negócio

- Produto pode ser `product` (físico) ou `service` (serviço)
- Descrição usa editor rich text (HTML)
- Imagem opcional via Cloudinary
- Limite por plano: Básico 30, Evolution 50, Pro ilimitado
- Cliente só vê produtos se tiver produtos cadastrados
