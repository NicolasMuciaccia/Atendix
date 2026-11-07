import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { StatusPill } from '../core/StatusPill.jsx';

export function RelatedTicket({ title, id, date, status = 'Resolvido', tone = 'positive', icon = 'history', onClick, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 6px', margin: '0 -6px', borderRadius: 'var(--radius-sm)', background: hover && onClick ? 'var(--surface-hover)' : 'transparent', cursor: onClick ? 'pointer' : undefined, fontFamily: 'var(--font-sans)', ...style }}
    >
      <Icon name={icon} size={15} color="var(--ink-400)" style={{ marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--ink-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        <div style={{ display: 'flex', gap: 14, marginTop: 2, fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>
          <span>{id}</span>
          <span>{date}</span>
        </div>
      </div>
      <StatusPill tone={tone}>{status}</StatusPill>
    </div>
  );
}
