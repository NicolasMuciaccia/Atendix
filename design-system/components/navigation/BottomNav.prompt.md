Mobile tab bar with a central navy "new ticket" FAB.

```jsx
<BottomNav items={[{ id: 'inbox', icon: 'inbox', label: 'Entrada', badge: 12 }, …]} activeId="inbox" onAction={newTicket} />
```

- Pass 4 items; they split 2 / FAB / 2.
- Hit targets ≥ 44px.
