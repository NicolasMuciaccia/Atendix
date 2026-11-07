function ContextPanel({ ticket, onUpdate, style }) {
  const { PanelSection, CustomerSummary, DetailRow, Select, Avatar, StatusPill, Tag, RelatedTicket, TextLink, Input } = window.AtendixDesignSystem_94ef37;
  const D = window.ATX_DATA;
  const U = window.ATX_UTIL;
  const [adding, setAdding] = React.useState(false);
  const [newTag, setNewTag] = React.useState('');
  React.useEffect(() => { setAdding(false); setNewTag(''); }, [ticket && ticket.id]);
  if (!ticket) return null;
  const tags = U.panelTags(ticket);
  const addTag = () => {
    const v = newTag.trim();
    if (v) onUpdate({ tags: ticket.tags.concat([{ label: v }]) });
    setNewTag('');
    setAdding(false);
  };
  return (
    <aside style={{ width: 'var(--context-width)', flexShrink: 0, overflowY: 'auto', padding: '0 20px 20px', background: 'var(--white)', borderLeft: '1px solid var(--border-subtle)', ...style }}>
      <PanelSection title="Cliente">
        <CustomerSummary
          name={ticket.name}
          email={ticket.email}
          details={[{ icon: 'map-pin', label: ticket.location }, { icon: 'calendar', label: ticket.since }, { icon: 'credit-card', label: ticket.plan }]}
          onViewProfile={() => {}}
          onMore={() => {}}
        />
      </PanelSection>
      <PanelSection title="Detalhes do ticket">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <DetailRow label="Status"><Select options={D.statusOptions} value={ticket.status} onChange={(v) => onUpdate({ status: v, sla: v === 'solved' ? 'Concluído' : ticket.sla === 'Concluído' ? 'Responder em 8h' : ticket.sla })} /></DetailRow>
          <DetailRow label="Prioridade"><Select options={D.priorityOptions} value={ticket.priority} onChange={(v) => onUpdate({ priority: v })} /></DetailRow>
          <DetailRow label="Categoria"><Select options={D.categoryOptions} value={ticket.category} onChange={(v) => onUpdate({ category: v })} /></DetailRow>
          <DetailRow label="Atribuído a">
            {ticket.owner ? (
              <React.Fragment><Avatar name={D.agent.name} size={20} />{D.agent.name}</React.Fragment>
            ) : (
              <TextLink onClick={() => onUpdate({ owner: 'me' })}>Atribuir a mim</TextLink>
            )}
          </DetailRow>
          <DetailRow label="SLA"><StatusPill tone={ticket.status === 'solved' ? 'positive' : 'danger'} icon="clock">{ticket.sla}</StatusPill></DetailRow>
          <DetailRow label="Criado">{ticket.created}</DetailRow>
          <DetailRow label="Última resposta">{ticket.lastReply}</DetailRow>
        </div>
      </PanelSection>
      <PanelSection title="Tags">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {tags.map((t, i) => <Tag key={t.label + i} tone={t.tone} onRemove={() => onUpdate({ tags: ticket.tags.filter((x) => x !== t) })}>{t.label}</Tag>)}
        </div>
        <div style={{ marginTop: 8 }}>
          {adding ? (
            <Input size="sm" autoFocus placeholder="Nome da tag e Enter" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addTag(); if (e.key === 'Escape') setAdding(false); }} onBlur={addTag} />
          ) : (
            <Tag icon="plus" onClick={() => setAdding(true)}>Adicionar tag</Tag>
          )}
        </div>
      </PanelSection>
      <PanelSection title="Tickets relacionados" count={ticket.related.length} divider={false}>
        {ticket.related.length ? ticket.related.map((r) => <RelatedTicket key={r.id} title={r.title} id={r.id} date={r.date} onClick={() => {}} />) : <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Nenhum ticket anterior deste cliente.</div>}
      </PanelSection>
    </aside>
  );
}
window.ContextPanel = ContextPanel;
