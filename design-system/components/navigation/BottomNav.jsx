import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';

function Item({ it, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      style={{
        flex: 1,
        minWidth: 'var(--touch-min)',
        height: 52,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        border: 0,
        background: 'transparent',
        color: active ? 'var(--navy-900)' : 'var(--ink-400)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-2xs)',
        fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-medium)',
        cursor: 'pointer',
      }}
    >
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <Icon name={it.icon} size={22} strokeWidth={active ? 2 : 1.75} />
        {it.badge != null ? <Badge tone="solid" size="sm" ring="var(--white)" style={{ position: 'absolute', top: -7, left: 12 }}>{it.badge}</Badge> : null}
      </span>
      {it.label}
    </button>
  );
}

export function BottomNav({ items = [], activeId, onSelect, onAction, actionIcon = 'plus', actionLabel = 'Novo ticket', style }) {
  const mid = Math.ceil(items.length / 2);
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 'var(--bottom-nav-height)',
        padding: '0 8px 8px',
        background: 'var(--white)',
        borderTop: '1px solid var(--border-subtle)',
        ...style,
      }}
    >
      {items.slice(0, mid).map((it) => <Item key={it.id} it={it} active={it.id === activeId} onClick={() => onSelect && onSelect(it.id)} />)}
      {onAction ? (
        <span style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            aria-label={actionLabel}
            onClick={onAction}
            style={{ width: 48, height: 48, borderRadius: '50%', border: 0, background: 'var(--action-primary)', color: 'var(--white)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(16,31,60,.28)', cursor: 'pointer' }}
          >
            <Icon name={actionIcon} size={22} strokeWidth={2.2} />
          </button>
        </span>
      ) : null}
      {items.slice(mid).map((it) => <Item key={it.id} it={it} active={it.id === activeId} onClick={() => onSelect && onSelect(it.id)} />)}
    </nav>
  );
}
