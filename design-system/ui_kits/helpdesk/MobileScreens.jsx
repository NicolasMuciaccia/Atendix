function MobileStatusBar() {
  const { Icon } = window.AtendixDesignSystem_94ef37;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44, padding: '0 26px 0 30px', flexShrink: 0, fontSize: 15, fontWeight: 600, color: 'var(--ink-900)' }}>
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <Icon name="signal" size={16} strokeWidth={2.2} />
        <Icon name="wifi" size={16} strokeWidth={2.2} />
        <Icon name="battery-full" size={20} strokeWidth={1.8} />
      </span>
    </div>
  );
}

function MobileInbox({ tickets, tab, onTab, onOpen, nav, onNav, onNew }) {
  const { IconButton, Badge, Tabs, TicketRow, BottomNav } = window.AtendixDesignSystem_94ef37;
  const U = window.ATX_UTIL;
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px 4px 20px', flexShrink: 0 }}>
        <span style={{ flex: 1, fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--navy-900)' }}>Atendix</span>
        <IconButton icon="search" label="Buscar" size="lg" />
        <IconButton icon="menu" label="Menu" variant="outline" size="lg" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px 12px', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>Caixa de entrada</h1>
        <Badge tone="neutral">48</Badge>
      </div>
      <div style={{ padding: '0 16px 8px', flexShrink: 0 }}>
        <Tabs variant="pill" items={[{ id: 'all', label: 'Todos' }, { id: 'mine', label: 'Meus' }, { id: 'unassigned', label: 'Sem dono' }]} value={tab} onChange={onTab} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 4px 12px' }}>
        {tickets.map((t, i) => (
          <React.Fragment key={t.id}>
            {i > 0 ? <div style={{ height: 1, margin: '0 16px', background: 'var(--ink-100)' }}></div> : null}
            <TicketRow compact name={t.name} subject={t.subject} time={t.time} tags={U.listTags(t)} unread={t.unread} selected={i === 0 && tab === 'all'} onClick={() => onOpen(t.id)} />
          </React.Fragment>
        ))}
      </div>
      <BottomNav
        activeId={nav}
        onSelect={onNav}
        onAction={onNew}
        items={[{ id: 'inbox', icon: 'inbox', label: 'Entrada', badge: 12 }, { id: 'mine', icon: 'ticket', label: 'Meus tickets' }, { id: 'customers', icon: 'users', label: 'Clientes' }, { id: 'more', icon: 'menu', label: 'Mais' }]}
      />
    </div>
  );
}

function MobileTicket({ ticket, onBack, onSend, draft, setDraft, mode, setMode }) {
  const { IconButton, StatusPill, Message, SuggestedReplies, Composer } = window.AtendixDesignSystem_94ef37;
  const U = window.ATX_UTIL;
  const D = window.ATX_DATA;
  const Body = window.ATX_Body;
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [ticket.thread.length]);
  const st = U.STATUS[ticket.status];
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px 10px 8px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <IconButton icon="arrow-left" label="Voltar" size="lg" onClick={onBack} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ticket.subject}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            <span>{ticket.name} · #{ticket.id}</span>
            <StatusPill tone={st.tone} dot style={{ height: 18 }}>{st.label}</StatusPill>
          </div>
        </div>
        <IconButton icon="ellipsis" label="Mais ações" variant="outline" size="md" />
      </div>
      <div ref={ref} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ticket.thread.map((m, i) => <Message key={i} author={m.author} time={m.time} role={m.role}><Body lines={m.body} /></Message>)}
      </div>
      <div style={{ padding: '10px 12px 14px', display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        {ticket.status !== 'solved' ? <SuggestedReplies items={D.suggested.slice(0, 2)} onPick={(t) => { setMode('reply'); setDraft(t); }} /> : null}
        <Composer mode={mode} onModeChange={setMode} value={draft} onChange={setDraft} tools={['paperclip', 'smile']} internalLabel="Nota" onSend={(text, m) => { onSend(text, m); setDraft(''); }} />
      </div>
    </div>
  );
}

function MobileApp({ store, framed = false }) {
  const [screen, setScreen] = React.useState('list');
  const [selId, setSelId] = React.useState(null);
  const [tab, setTab] = React.useState('all');
  const [nav, setNav] = React.useState('inbox');
  const [draft, setDraft] = React.useState('');
  const [mode, setMode] = React.useState('reply');
  const list = store.tickets.filter((t) => tab === 'all' || (tab === 'mine' ? t.owner === 'me' : !t.owner));
  const ticket = store.tickets.find((t) => t.id === selId);
  const open = (id) => { setSelId(id); setDraft(''); setMode('reply'); setScreen('ticket'); store.update(id, { unread: false }); };
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--white)', fontFamily: 'var(--font-sans)' }}>
      {framed ? <MobileStatusBar /> : null}
      {screen === 'ticket' && ticket ? (
        <MobileTicket ticket={ticket} onBack={() => setScreen('list')} onSend={(text, m) => store.send(ticket.id, text, m)} draft={draft} setDraft={setDraft} mode={mode} setMode={setMode} />
      ) : (
        <MobileInbox tickets={list} tab={tab} onTab={setTab} onOpen={open} nav={nav} onNav={(id) => { setNav(id); if (id === 'mine') setTab('mine'); if (id === 'inbox') setTab('all'); }} onNew={() => open(store.create())} />
      )}
    </div>
  );
}

Object.assign(window, { MobileApp, MobileInbox, MobileTicket, MobileStatusBar });
