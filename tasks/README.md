# 📋 Sistema de Tasks

Gerenciamento simples de tarefas do projeto.  
Cada tarefa é um arquivo `.md` numerado.

---

## Estrutura

```
tasks/
├── README.md              ← Este arquivo
├── 001-definir-nicho.md   ← Tarefas em andamento/concluídas
├── 002-...
└── board.md               ← Board geral (visão consolidada)
```

---

## Fluxo de trabalho

1. **Abrir task:** Criar arquivo `NNN-descricao.md` com template abaixo
2. **Executar:** Marcar checkboxes ao longo da task
3. **Concluir:** Mudar status para `concluida` e atualizar board.md
4. **Consultar:** O board.md mostra tudo que já foi feito

---

## Template de task

```md
# Task NNN — Título

**Status:** `aberta` | `em_andamento` | `concluida` | `cancelada`  
**Prioridade:** `alta` | `media` | `baixa`  
**Criada em:** DD/MM/AAAA  
**Concluída em:** DD/MM/AAAA  

---

## Objetivo

Descrição clara do que precisa ser feito.

---

## Checklist

- [ ] Passo 1
- [ ] Passo 2
- [ ] Passo 3

---

## Observações

Anotações relevantes durante a execução.
```

---

## Convenções

- **Status** sempre no topo (facilita busca)
- **Checklists** com `- [ ]` / `- [x]`
- **Data** nos formatos BR (DD/MM/AAAA)
- Tasks concluídas **não são apagadas** — ficam como histórico
