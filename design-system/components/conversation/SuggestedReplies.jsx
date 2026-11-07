import React from 'react';
import { Button } from '../core/Button.jsx';

export function SuggestedReplies({ label = 'Respostas sugeridas', items = [], onPick, style }) {
  if (!items.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'var(--font-sans)', ...style }}>
      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--text-muted)' }}>{label}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map((it) => (
          <Button key={it} variant="secondary" size="sm" onClick={() => onPick && onPick(it)} style={{ fontWeight: 'var(--weight-medium)' }}>{it}</Button>
        ))}
      </div>
    </div>
  );
}
