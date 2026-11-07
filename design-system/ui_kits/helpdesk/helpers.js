// Shared helpers + mock store for the Atendix helpdesk UI kit.
window.ATX_UTIL = {
  PRI: { high: 'Alta', medium: 'Média', low: 'Baixa' },
  CAT: { access: 'Acesso à conta', billing: 'Faturamento', technical: 'Técnico', product: 'Feedback de produto', onboarding: 'Onboarding' },
  STATUS: { open: { label: 'Aberto', tone: 'danger' }, pending: { label: 'Pendente', tone: 'attention' }, solved: { label: 'Resolvido', tone: 'positive' } },
  listTags: function (t) {
    var catTone = t.category === 'billing' ? 'violet' : t.category === 'product' ? 'blue' : 'neutral';
    return [{ label: this.PRI[t.priority], tone: t.priority }, { label: this.CAT[t.category], tone: catTone }];
  },
  panelTags: function (t) {
    return t.tags.filter(function (x) { return ['high', 'medium', 'low'].indexOf(x.tone) === -1; });
  },
};

window.useTicketStore = function () {
  var D = window.ATX_DATA;
  var st = React.useState(D.tickets);
  var tickets = st[0], setTickets = st[1];
  var update = function (id, patch) {
    setTickets(function (ts) {
      return ts.map(function (t) { return t.id === id ? Object.assign({}, t, typeof patch === 'function' ? patch(t) : patch) : t; });
    });
  };
  var send = function (id, text, mode) {
    update(id, function (t) {
      return {
        thread: t.thread.concat([{ author: D.agent.name, time: 'Agora', role: mode === 'note' ? 'note' : 'agent', body: text.split(/\n{2,}/) }]),
        lastReply: 'Agora',
        preview: mode === 'note' ? t.preview : text.slice(0, 60),
        unread: false,
      };
    });
  };
  var create = function () {
    var n = 41828 + Math.floor(Math.random() * 100);
    var nt = {
      id: 'AX-' + n, name: 'Novo cliente', email: 'sem e-mail', subject: 'Novo ticket', preview: 'Rascunho', time: 'Agora',
      priority: 'medium', category: 'access', status: 'open', owner: 'me', sla: 'Responder em 8h', created: 'Agora', lastReply: '—',
      location: '—', since: 'Novo cliente', plan: 'Sem plano', tags: [], related: [], thread: [],
    };
    setTickets(function (ts) { return [nt].concat(ts); });
    return nt.id;
  };
  return { tickets: tickets, update: update, send: send, create: create };
};

window.ATX_Body = function (props) {
  return React.createElement(React.Fragment, null, props.lines.map(function (p, i) {
    var parts = p.split('\n');
    return React.createElement('p', { key: i, style: { margin: i === props.lines.length - 1 ? 0 : '0 0 10px' } },
      parts.map(function (s, j) { return j ? [React.createElement('br', { key: 'b' + j }), s] : s; }));
  }));
};
