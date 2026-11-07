import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';

export function NavItem({ icon, label, count, active = false, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        height: 34,
        padding: '0 8px 0 10px',
        border: 0,
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--nav-item-active)' : hover ? 'var(--nav-item-hover)' : 'transparent',
        color: active ? 'var(--nav-text-active)' : 'var(--nav-text)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-medium)',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'background var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={16} /> : null}
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {count != null ? <Badge tone={active ? 'navActive' : 'nav'}>{count}</Badge> : null}
    </button>
  );
}
