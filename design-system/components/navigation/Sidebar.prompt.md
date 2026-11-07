Full-height navy app rail: wordmark, primary views, team groups, agent footer.

```jsx
<Sidebar
  items={[{ id: 'inbox', icon: 'inbox', label: 'Caixa de entrada', count: 12 }]}
  groups={[{ title: 'Equipes', items: [{ id: 'geral', icon: 'hash', label: 'Geral' }] }]}
  activeId="inbox" onSelect={setView}
  user={{ name: 'Marina Costa', status: 'online' }} />
```

- Width `--sidebar-width` (232px). Brand renders as plain text — no logo file exists.
