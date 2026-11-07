import React from 'react';
import { Badge } from '../core/Badge.jsx';

export function Tabs({ items = [], value, defaultValue, onChange, variant = 'underline', size = 'sm', trailing, style }) {
  const [inner, setInner] = React.useState(defaultValue !== undefined ? defaultValue : items[0] && items[0].id);
  const active = value !== undefined ? value : inner;
  const select = (id) => { setInner(id); onChange && onChange(id); };
  const pill = variant === 'pill';
  const fs = size === 'md' ? 'var(--text-base)' : 'var(--text-sm)';

  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: pill ? 8 : 18,
        borderBottom: pill ? 'none' : '1px solid var(--border-subtle)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      {items.map((it) => {
        const on = it.id === active;
        return (
          <button
            key={it.id}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => select(it.id)}
            style={pill ? {
              position: 'relative',
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              height: 34,
              padding: '0 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid ' + (on ? 'var(--border-default)' : 'transparent'),
              background: on ? 'var(--white)' : 'var(--ink-100)',
              boxShadow: on ? 'var(--shadow-xs)' : 'none',
              color: on ? 'var(--blue-500)' : 'var(--ink-500)',
              fontFamily: 'inherit',
              fontSize: fs,
              fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-medium)',
              cursor: 'pointer',
              overflow: 'hidden',
            } : {
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 36,
              padding: 0,
              border: 0,
              background: 'transparent',
              color: on ? 'var(--ink-900)' : 'var(--ink-500)',
              fontFamily: 'inherit',
              fontSize: fs,
              fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-medium)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {it.label}
            {it.count != null ? <Badge size="sm" tone={on ? 'accent' : 'neutral'}>{it.count}</Badge> : null}
            {on ? <span style={{ position: 'absolute', left: pill ? 12 : -2, right: pill ? 12 : -2, bottom: pill ? 0 : -1, height: 2, borderRadius: 2, background: 'var(--blue-500)' }}></span> : null}
          </button>
        );
      })}
      {trailing ? <span style={{ marginLeft: 'auto', display: 'inline-flex' }}>{trailing}</span> : null}
    </div>
  );
}
