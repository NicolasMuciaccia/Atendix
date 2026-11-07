Compact dropdown for ticket properties (status, priority, category, assignee).

```jsx
<Select size="sm" value={status} onChange={setStatus} options={[
  { value: 'open', label: 'Aberto', dot: 'var(--red-500)' },
  { value: 'solved', label: 'Resolvido', dot: 'var(--green-500)' },
]} />
```

- Options can carry a `dot` color, `icon` or `avatar` node.
- Closes on outside click.
