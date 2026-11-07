function ConversationPane({ ticket, draft, setDraft, mode, setMode, onSend, onToggleContext, contextOpen, showContextToggle }) {
  const { Tag, StatusPill, IconButton, Message, SuggestedReplies, Composer, Icon } = window.AtendixDesignSystem_94ef37;
  const U = window.ATX_UTIL;
  const D = window.ATX_DATA;
  const Body = window.ATX_Body;
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [ticket && ticket.id, ticket && ticket.thread.length]);

  if (!ticket) {
    return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Selecione um ticket para ver a conversa.</div>;
  }
  const st = U.STATUS[ticket.status];
  return (
    <section style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--white)' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 10, height: 52, padding: '0 20px 0 24px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{ticket.subject}</h2>
        <Tag style={{ fontVariantNumeric: 'tabular-nums' }}>#{ticket.id}</Tag>
        <StatusPill tone={st.tone} dot>{st.label}</StatusPill>
        <span style={{ flex: 1 }}></span>
        {showContextToggle ? <IconButton icon="info" label="Contexto do cliente" variant="outline" size="sm" active={contextOpen} onClick={onToggleContext} /> : null}
        <IconButton icon="ellipsis" label="Mais ações" variant="outline" size="sm" />
      </header>
      <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ticket.thread.length ? ticket.thread.map((m, i) => (
          <Message key={i} author={m.author} time={m.time} role={m.role}><Body lines={m.body} /></Message>
        )) : (
          <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            <Icon name="message-square" size={22} color="var(--ink-300)" />
            Sem mensagens ainda. Escreva a primeira resposta abaixo.
          </div>
        )}
      </div>
      <div style={{ padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>
        {ticket.status !== 'solved' && ticket.thread.length ? <SuggestedReplies items={D.suggested} onPick={(t) => { setMode('reply'); setDraft(t); }} /> : null}
        <Composer mode={mode} onModeChange={setMode} value={draft} onChange={setDraft} onSend={(text, m) => { onSend(text, m); setDraft(''); }} />
      </div>
    </section>
  );
}
window.ConversationPane = ConversationPane;
