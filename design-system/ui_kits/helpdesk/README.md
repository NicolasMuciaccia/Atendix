# Atendix Helpdesk — UI kit

Recriação clicável do workspace de atendimento, baseada nas telas do estudo de caso de referência (slides 05–10). Compõe os primitivos de `components/`; não reimplementa nenhum.

## Arquivos
- `index.html` — app desktop responsivo (≥1280 quatro zonas · 960–1279 contexto em gaveta · <960 composição mobile).
- `mobile.html` — a composição mobile dentro de uma moldura de 390×844.
- `InboxHeader.jsx` — título com dropdown, busca, filtro, "Novo ticket" e linha de KPIs.
- `TicketList.jsx` — tabs Todos/Meus/Não atribuídos + linhas de ticket.
- `ConversationPane.jsx` — cabeçalho do ticket, thread, respostas sugeridas, composer.
- `ContextPanel.jsx` — cliente, detalhes editáveis (status/prioridade/categoria), tags, tickets relacionados.
- `MobileScreens.jsx` — `MobileApp`, `MobileInbox`, `MobileTicket`, `MobileStatusBar`.
- `App.jsx` — estado, filtros de visão e layout responsivo.
- `data.js`, `helpers.js` — dados fictícios e um store simples.

## Interações
Selecionar tickets; trocar visão na sidebar (inclui equipes); filtrar por tab e busca; respostas sugeridas preenchem o composer; enviar resposta ou nota interna (fundo âmbar); mudar status/prioridade/categoria; atribuir a mim; adicionar/remover tags; "Novo ticket" cria um rascunho.

## Fora da referência
- **Clientes** e **Relatórios** ficam em branco de propósito (não aparecem nas imagens).
- A tela de ticket no mobile não existe na referência; foi montada com os mesmos componentes da conversa desktop.
