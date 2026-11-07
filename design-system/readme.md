# Atendix Design System

Atendix é uma ferramenta de helpdesk: uma central de atendimento onde times de suporte fazem a triagem de tickets, respondem conversas e consultam o contexto do cliente sem trocar de tela. Este design system define a linguagem visual — harmônica, responsiva, moderna e elegante — para o produto web (desktop) e sua composição mobile, além de apresentações.

## Fontes e referências

- **Material recebido:** 12 imagens de um estudo de caso de UI/UX (`uploads/crm-dashboard-01.jpg` … `-12.jpg`). O estudo é o conceito "SupportSpring — Customer Support CRM Dashboard" (Muhammad Imran, 2026, autoiniciado), usado aqui **apenas como referência visual** para o Atendix.
- Não houve codebase, Figma, logo nem arquivos de fonte. Todos os valores foram medidos/inferidos das imagens; a paleta oficial (navy `#101F3C`, primário `#365DF5`, secundário `#90A4FF`, surface `#F3F6FF`, positivo `#23A579`, atenção `#F4A340`) vem do slide 11 do estudo.
- O nome, o logo-borboleta e o wordmark serifado "SupportSpring" **não** são usados. O Atendix não tem logo fornecido: onde haveria uma marca, o nome é escrito em tipo simples (Inter Bold).
- A cópia de interface foi escrita em **português (pt-BR)**, adaptando o conteúdo de exemplo do estudo.

## Índice

| Caminho | Conteúdo |
|---|---|
| `styles.css` | Ponto de entrada — só `@import`s |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css` |
| `assets/fonts/` | Inter variável (woff2, latin + latin-ext, normal + itálico) |
| `assets/icons/` | 86 SVGs Lucide (ISC) usados pelo `Icon` |
| `assets/screens/` | Captura do workspace desktop (usada nos slides) |
| `guidelines/` | Cartões de fundação (cores, tipo, espaçamento, marca) |
| `components/` | Primitivos React (ver lista abaixo) |
| `ui_kits/helpdesk/` | Recriação clicável — `index.html` (desktop responsivo) e `mobile.html` |
| `slides/` | 5 tipos de slide no estilo do estudo de caso (16:9) |
| `SKILL.md` | Manifesto para uso como Agent Skill |
| `thumbnail.html` | Tile do design system |

## Components

Namespace no bundle: `window.AtendixDesignSystem_94ef37`.

- **core/** — `Icon`, `Button`, `IconButton`, `Badge`, `Tag`, `StatusPill` (+ `STATUS_TONE`), `Avatar`, `Card`, `TextLink`
- **forms/** — `Input`, `Select`, `Checkbox`
- **navigation/** — `Sidebar`, `NavItem`, `Tabs`, `BottomNav`
- **tickets/** — `KpiCard`, `TicketRow`, `CustomerSummary`, `PanelSection`, `DetailRow`, `RelatedTicket`
- **conversation/** — `Message`, `SuggestedReplies`, `Composer`

O inventário segue o que aparece na referência ("Sidebar · KPI cards · Priority chips · Ticket rows · Customer panels", mais tabs, composer, selects de detalhe, checkbox, busca e bottom nav mobile).

**Adições intencionais**
- `Icon` — wrapper para o conjunto Lucide embutido (a referência usa ícones de linha sem fonte própria).
- `Card` — superfície base genérica; a referência usa o mesmo cartão branco com hairline em vários contextos.

## UI kit

`ui_kits/helpdesk/` — ver `ui_kits/helpdesk/README.md`. Desktop ≥1280 px mostra quatro zonas (sidebar, lista, conversa, contexto); 960–1279 px o painel de contexto vira gaveta (botão ⓘ); <960 px troca para a composição mobile com bottom nav.

---

## CONTENT FUNDAMENTALS

**Tom.** Calmo, direto, prestativo. A referência descreve o produto como "uma forma mais calma de gerenciar conversas de suporte" — a interface nunca grita. Sem exclamações em UI de sistema; elas aparecem só nas mensagens humanas (agente ↔ cliente).

**Pessoa.** A interface fala com o agente na segunda pessoa implícita, por verbos no infinitivo/imperativo: "Escreva uma resposta…", "Adicionar tag", "Atribuir a mim", "Ver perfil completo". Nada de "nós" nem de "meu" exceto em filtros de posse ("Meus tickets").

**Caixa.** *Sentence case* em tudo: títulos de tela ("Caixa de entrada"), seções ("Detalhes do ticket"), botões ("Novo ticket", "Enviar"). MAIÚSCULAS só em overlines pequenas (`EQUIPES`, 10px, +0.08em) e eyebrows azuis de apresentação ("PRÓXIMOS PASSOS").

**Concisão.** Rótulos de 1–3 palavras. Assuntos de ticket são frases curtas e concretas, escritas pelo cliente: "Não consigo acessar minha conta", "Pagamento não está passando". Prévias truncam com reticências (…).

**Números e tempo.** Formatos compactos: `10:24`, `Ontem`, `14 jun`, `18m`, `96%`, `2h 36m`. SLA sempre como ação + prazo: "Responder em 2h 36m". IDs de ticket com prefixo: `#AX-41827`.

**Emoji.** Não são usados na interface nem nos slides. Ícones Lucide fazem esse papel.

**Honestidade de dados.** O estudo marca métricas como ilustrativas ("All values shown in this concept are sample UI content"). Em materiais de apresentação, siga o mesmo cuidado: não afirme resultados que não foram medidos.

Exemplos:
- Botões: "Novo ticket", "Enviar →", "Enviar link de redefinição"
- Vazios: "Nenhum ticket nesta visão.", "Sem mensagens ainda. Escreva a primeira resposta abaixo."
- KPIs: "Tickets abertos", "Respostas pendentes (SLA)", "1ª resposta (média)", "Satisfação (7d)"

---

## VISUAL FOUNDATIONS

**Clima geral.** Restrito, frio, arejado e denso ao mesmo tempo: um rail navy escuro ancora a tela, todo o resto é branco com hairlines azul-acinzentadas. Cor é reservada para sinal (prioridade, status, tendência) e foco (azul).

**Cor.**
- Navy `#101F3C` — sidebar, botão primário, painéis de destaque, títulos. É também a cor do texto forte (`--ink-900`).
- Azul `#365DF5` — links, barra do item selecionado, sublinhado de tab ativa, checkbox marcado, badges de não lidos, eyebrows. Raramente como fundo de botão (variante `accent`).
- Secundário `#90A4FF` — sparklines, eyebrows sobre navy, gráficos.
- Surface `#F3F6FF` — linha selecionada, painéis explicativos.
- Neutros "ink" com leve tom navy; nunca cinza puro.
- Semânticas sempre em pares *suave + texto escuro do mesmo matiz*: Alta = vermelho, Média = âmbar, Baixa = verde. Cor nunca é o único sinal — o rótulo vem junto.

**Tipografia.** Inter (variável) em tudo. Escala compacta de app: 11 / 12 / 13 / 14 / 18 / 22px; corpo em 13px, line-height 1.5–1.6. Títulos 700 com tracking negativo (−0.01 a −0.035em). Números de KPI em 22px bold com `tabular-nums`. Apresentações usam display de 52–84px bold, tracking −0.03em, com uma linha de destaque em azul.

**Espaçamento.** Base 4px com meios-passos (2, 6, 10) para linhas densas. Padding de cartões 14–16px no app, 28–36px em slides. Gaps de 8–12px entre itens, 16–24px entre blocos.

**Fundos.** Branco chapado na área de trabalho; `--bg-app` (#F7F9FC) em telas de estado/placeholder; `--bg-subtle` (#F3F6FF) em apresentações e painéis explicativos. Sem imagens full-bleed, sem texturas, sem gradientes decorativos. O único gradiente é o preenchimento de área das sparklines. A capa de apresentação usa um grande círculo azul-claro no canto superior direito.

**Cartões.** Branco, borda 1px `--border-subtle`, raio 10px (app) / 20px (slides), sombra muito suave com tom navy (`--shadow-xs`/`--shadow-sm`). Variações: `subtle` (fundo blue-50, sem sombra) e `inverse` (navy, raio 24px em slides). Nunca borda colorida só à esquerda.

**Bordas e divisores.** Hairlines de 1px em `#E8ECF4`; divisores entre linhas de lista recuados 14px das bordas. Painéis são separados por hairlines, não por espaço ou sombra.

**Sombras.** Camadas duplas, baixa opacidade (4–12%), cor `rgba(16,31,60,…)`. Elevação alta só para dropdowns, gavetas e o FAB mobile.

**Raios.** 4px chips/tags/status · 6px selects · 8px botões, inputs, itens de nav · 10px cartões, tiles de ícone, bolhas · 14px painéis · 20–24px cartões de apresentação · círculo para avatares e FAB.

**Transparência e blur.** Praticamente ausentes. `--scrim` (navy 45%) só atrás de modais; `--blur-glass` reservado, não usado nas telas de referência.

**Animação.** Discreta e rápida: 120–260ms, `cubic-bezier(.2,0,0,1)`. Fades e mudanças de cor; sem bounce. Seta de link desliza 2px no hover; cartões interativos sobem 1px.

**Hover.** Fundo sutil (`--surface-hover` #F4F6FA) em itens claros; navy um tom mais claro (`--navy-800`) em botões primários e itens da sidebar.

**Press.** `scale(.98)` + tom mais escuro. **Foco:** borda azul + anel de 3px `rgba(54,93,245,.22)`. **Desabilitado:** 45% de opacidade.

**Seleção.** Linha de ticket selecionada: fundo `--surface-selected` + barra azul de 2,5px à esquerda com cantos arredondados.

**Layout.** App de quatro zonas: sidebar 232px · lista 340px · conversa flexível · contexto 300px. Topbar de 64px com título + dropdown, busca, filtro e CTA navy. Linha de 4 KPIs abaixo do topbar. Mobile: header com wordmark, título grande com contagem, tabs em pílula, lista e bottom nav com FAB central navy.

**Imagens.** A referência usa fotos de rosto reais nos avatares (luz neutra/quente, fundo claro). Sem fotos disponíveis, use iniciais sobre tons suaves (o próprio estudo faz isso para "DK" e "M").

---

## ICONOGRAPHY

- **Sistema:** ícones de linha, traço fino (~1.5–1.75px a 16px), cantos e terminações arredondadas, sem preenchimento. A referência não traz arquivos de ícone; o conjunto mais próximo é **Lucide** — usado aqui como **substituto** (86 SVGs copiados de `lucide-static@0.460.0` para `assets/icons/`, licença ISC, e embutidos em `components/core/Icon.jsx`).
- **Uso:** `<Icon name="inbox" size={16} />`. Tamanhos: 14 (inline/metadados), 16 (nav, botões), 20 (tiles de KPI), 22 (bottom nav). Traço 1.75 padrão; 2–2.4 em ícones ≤12px para não sumirem.
- **Cor:** herda `currentColor`. Ícones de metadado em `--ink-400`; em tiles de KPI, a cor do tile (azul/âmbar/verde) sobre fundo suave.
- **Mapeamento usado:** Caixa de entrada `inbox` · Meus tickets `ticket` · Menções `at-sign` · Não atribuídos `user` · Todos `archive` · Clientes `users` · Relatórios `chart-column` · Equipes `hash` · SLA `clock` · Satisfação `smile` · Local `map-pin` · Cliente desde `calendar` · Plano `credit-card` · Relacionados `history` · Composer `paperclip`, `smile`, `pen-line`.
- **Emoji / unicode:** não usados como ícone. Setas de "Ver perfil completo" e "Enviar" são o ícone `arrow-right`, não o caractere →.
- **Logo:** nenhum fornecido. Não desenhe um; use o wordmark em texto (Inter 700, tracking −0.02em).

---

## Substituições e pendências

- **Fonte:** Inter (Google Fonts, auto-hospedada) — é a família visível no estudo. Se o Atendix tiver fonte própria, substitua os arquivos em `assets/fonts/` e `--font-sans`.
- **Ícones:** Lucide como substituto do conjunto da referência.
- **Logo:** ausente.
- **Fotos de avatar:** ausentes; usamos iniciais.
