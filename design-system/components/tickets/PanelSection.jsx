import React from 'react';
import { Badge } from '../core/Badge.jsx';

export function PanelSection({ title, count, action, divider = true, children, style }) {
  return (
    <section style={{ padding: '18px 0', borderBottom: divider ? '1px solid var(--border-subtle)' : 'none', fontFamily: 'var(--font-sans)', ...style }}>
      {title ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <h3 style={{ flex: 1, margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', letterSpacing: '-0.005em' }}>{title}</h3>
          {count != null ? <Badge tone="neutral">{count}</Badge> : null}
          {action || null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
