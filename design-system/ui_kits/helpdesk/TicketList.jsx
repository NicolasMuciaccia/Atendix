function TicketList({ tickets, selectedId, onSelect, tab, onTab, counts }) {
  const { Tabs, IconButton, TicketRow, Icon } = window.AtendixDesignSystem_94ef37;
  const U = window.ATX_UTIL;
  return (
    <div style={{ width: 'var(--list-width)', flexShrink: 0, display: 'flex', flexDirection: 'column', minHeight: 0, borderRight: '1px solid var(--border-subtle)', background: 'var(--white)' }}>
      <div style={{ padding: '4px 16px 0' }}>
        <Tabs
          items={[{ id: 'all', label: 'Todos', count: counts.all }, { id: 'mine', label: 'Meus', count: counts.mine }, { id: 'unassigned', label: 'Não atribuídos', count: counts.unassigned }]}
          value={tab}
          onChange={onTab}
          trailing={<IconButton icon="ellipsis" label="Mais filtros" size="sm" />}
        />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 16px' }}>
        {tickets.length ? tickets.map((t, i) => {
          const sel = t.id === selectedId;
          const prevSel = i > 0 && tickets[i - 1].id === selectedId;
          return (
            <React.Fragment key={t.id}>
              {i > 0 && !sel && !prevSel ? <div style={{ height: 1, margin: '0 14px', background: 'var(--ink-100)' }}></div> : i > 0 ? <div style={{ height: 1 }}></div> : null}
              <TicketRow name={t.name} subject={t.subject} preview={t.preview} time={t.time} tags={U.listTags(t)} selected={sel} unread={t.unread} onClick={() => onSelect(t.id)} />
            </React.Fragment>
          );
        }) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '48px 24px', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
            <Icon name="inbox" size={22} color="var(--ink-300)" />
            Nenhum ticket nesta visão.
          </div>
        )}
      </div>
    </div>
  );
}
window.TicketList = TicketList;
