function InboxHeader({ title = 'Caixa de entrada', query, onQuery, onNewTicket, kpis = [], compact = false }) {
  const { Input, IconButton, Button, KpiCard, Icon } = window.AtendixDesignSystem_94ef37;
  return (
    <div style={{ padding: '0 24px', background: 'var(--white)', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 64 }}>
        <button type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 0, background: 'transparent', padding: 0, fontFamily: 'inherit', fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--text-strong)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {title}
          <Icon name="chevron-down" size={16} color="var(--ink-500)" />
        </button>
        <span style={{ flex: 1 }}></span>
        <Input icon="search" placeholder="Buscar conversas, clientes ou tickets…" value={query} onChange={(e) => onQuery(e.target.value)} fullWidth={false} style={{ width: compact ? 220 : 340 }} />
        <IconButton icon="sliders-horizontal" label="Filtros" variant="outline" size="md" />
        <Button iconLeft="plus" onClick={onNewTicket}>Novo ticket</Button>
      </div>
      {kpis.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12, paddingBottom: 16 }}>
          {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
        </div>
      ) : null}
    </div>
  );
}
window.InboxHeader = InboxHeader;
