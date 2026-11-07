function useViewportWidth() {
  const [w, setW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const f = () => setW(window.innerWidth);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return w;
}

const VIEW_FILTERS = {
  inbox: () => true,
  mine: (t) => t.owner === 'me',
  mentions: (t) => t.thread.some((m) => m.role === 'note'),
  unassigned: (t) => !t.owner,
  all: () => true,
  geral: () => true,
  financeiro: (t) => t.category === 'billing',
  tecnico: (t) => t.category === 'technical',
  produto: (t) => t.category === 'product',
  escalonamentos: () => false,
};

const VIEW_TITLES = { inbox: 'Caixa de entrada', mine: 'Meus tickets', mentions: 'Menções', unassigned: 'Não atribuídos', all: 'Todos os tickets', customers: 'Clientes', reports: 'Relatórios', geral: 'Geral', financeiro: 'Financeiro', tecnico: 'Técnico', produto: 'Produto', escalonamentos: 'Escalonamentos' };

function OutOfScope({ title }) {
  const { Card, Icon } = window.AtendixDesignSystem_94ef37;
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-app)' }}>
      <Card padding="lg" radius="xl" style={{ maxWidth: 380, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Icon name="layers" size={22} color="var(--ink-400)" /></div>
        <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-strong)' }}>{title}</div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 6, textWrap: 'pretty' }}>Esta tela não aparece na referência visual, então foi deixada em branco de propósito.</div>
      </Card>
    </div>
  );
}

function App() {
  const NS = window.AtendixDesignSystem_94ef37;
  const { Sidebar } = NS;
  const D = window.ATX_DATA;
  const store = window.useTicketStore();
  const w = useViewportWidth();
  const [view, setView] = React.useState('inbox');
  const [tab, setTab] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(D.tickets[0].id);
  const [drafts, setDrafts] = React.useState({});
  const [modes, setModes] = React.useState({});
  const [ctxOpen, setCtxOpen] = React.useState(false);

  if (w < 960) return <window.MobileApp store={store} />;

  const inline = w >= 1280;
  const q = query.trim().toLowerCase();
  const inView = store.tickets.filter(VIEW_FILTERS[view] || (() => true));
  const list = inView
    .filter((t) => tab === 'all' || (tab === 'mine' ? t.owner === 'me' : !t.owner))
    .filter((t) => !q || (t.name + ' ' + t.subject + ' ' + t.id).toLowerCase().includes(q));
  const ticket = list.find((t) => t.id === selectedId) || list[0];
  const select = (id) => { setSelectedId(id); store.update(id, { unread: false }); };
  const newTicket = () => { const id = store.create(); setView('inbox'); setTab('all'); setQuery(''); setSelectedId(id); };
  const outOfScope = view === 'customers' || view === 'reports';

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--white)', overflow: 'hidden' }}>
      <Sidebar
        activeId={view}
        onSelect={(id) => { setView(id); setTab('all'); }}
        onSearch={() => {}}
        user={D.agent}
        items={[
          { id: 'inbox', icon: 'inbox', label: 'Caixa de entrada', count: 12 },
          { id: 'mine', icon: 'ticket', label: 'Meus tickets', count: 8 },
          { id: 'mentions', icon: 'at-sign', label: 'Menções', count: 3 },
          { id: 'unassigned', icon: 'user', label: 'Não atribuídos', count: 6 },
          { id: 'all', icon: 'archive', label: 'Todos os tickets' },
          { id: 'customers', icon: 'users', label: 'Clientes' },
          { id: 'reports', icon: 'chart-column', label: 'Relatórios' },
        ]}
        groups={[{ title: 'Equipes', items: [
          { id: 'geral', icon: 'hash', label: 'Geral' },
          { id: 'financeiro', icon: 'hash', label: 'Financeiro' },
          { id: 'tecnico', icon: 'hash', label: 'Técnico' },
          { id: 'produto', icon: 'hash', label: 'Produto' },
          { id: 'escalonamentos', icon: 'hash', label: 'Escalonamentos' },
        ] }]}
      />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <InboxHeader title={VIEW_TITLES[view]} query={query} onQuery={setQuery} onNewTicket={newTicket} kpis={outOfScope ? [] : D.kpis} compact={!inline} />
        {outOfScope ? <OutOfScope title={VIEW_TITLES[view]} /> : (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', borderTop: '1px solid var(--border-subtle)', position: 'relative' }}>
            <TicketList tickets={list} selectedId={ticket && ticket.id} onSelect={select} tab={tab} onTab={setTab} counts={{ all: 48, mine: 8, unassigned: 6 }} />
            <ConversationPane
              ticket={ticket}
              draft={ticket ? drafts[ticket.id] || '' : ''}
              setDraft={(v) => ticket && setDrafts((d) => ({ ...d, [ticket.id]: v }))}
              mode={ticket ? modes[ticket.id] || 'reply' : 'reply'}
              setMode={(m) => ticket && setModes((s) => ({ ...s, [ticket.id]: m }))}
              onSend={(text, m) => store.send(ticket.id, text, m)}
              showContextToggle={!inline}
              contextOpen={ctxOpen}
              onToggleContext={() => setCtxOpen((o) => !o)}
            />
            {ticket && inline ? <ContextPanel ticket={ticket} onUpdate={(p) => store.update(ticket.id, p)} /> : null}
            {ticket && !inline && ctxOpen ? (
              <ContextPanel ticket={ticket} onUpdate={(p) => store.update(ticket.id, p)} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 'var(--z-overlay)', boxShadow: 'var(--shadow-xl)' }} />
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
window.App = App;
