Top-of-inbox metric card: tinted icon tile, big number, delta chip, sparkline.

```jsx
<KpiCard icon="mail" label="Tickets abertos" value="48" delta="24%" direction="down" sentiment="positive" chart="line" data={[3,4,4,6,5,7,9]} />
```

- `sentiment` sets green/red independently of arrow direction (fewer open tickets = good).
- Tones: blue (volume), amber (SLA), green (satisfaction).
