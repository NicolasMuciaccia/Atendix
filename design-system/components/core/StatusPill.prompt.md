Ticket status / SLA indicator with optional dot or icon.

```jsx
<StatusPill tone="danger" dot>Aberto</StatusPill>
<StatusPill tone="danger" icon="clock">Responder em 2h 36m</StatusPill>
<StatusPill tone="positive">Resolvido</StatusPill>
```

- `STATUS_TONE.open` etc. maps status keys to tones.
- `plain` drops the fill for use inside rows.
