Filter tabs with optional counts — underline on desktop, pill/segmented on mobile.

```jsx
<Tabs items={[{ id: 'all', label: 'Todos', count: 48 }, { id: 'mine', label: 'Meus', count: 8 }]} value={tab} onChange={setTab} />
```

- Active: ink-900 semibold + 2px blue bar; active count turns blue.
- `trailing` slot for a ••• button.
