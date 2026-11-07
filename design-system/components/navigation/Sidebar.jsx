import React from 'react';
import { NavItem } from './NavItem.jsx';
import { Avatar } from '../core/Avatar.jsx';
import { IconButton } from '../core/IconButton.jsx';

export function Sidebar({ brand = 'Atendix', items = [], groups = [], activeId, onSelect, user, onSearch, footer, style }) {
  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--nav-bg)',
        color: 'var(--nav-text)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--topbar-height)', padding: '0 12px 0 20px' }}>
        <span style={{ fontSize: 18, fontWeight: 'var(--weight-bold)', letterSpacing: '-0.02em', color: 'var(--white)' }}>{brand}</span>
        {onSearch ? <IconButton icon="search" label="Buscar" variant="inverse" size="sm" onClick={onSearch} /> : null}
      </div>
      <nav style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '6px 12px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((it) => (
          <NavItem key={it.id} icon={it.icon} label={it.label} count={it.count} active={it.id === activeId} onClick={() => onSelect && onSelect(it.id)} />
        ))}
        {groups.map((g) => (
          <div key={g.title} style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 20 }}>
            <div style={{ padding: '0 10px 6px', fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-overline)', textTransform: 'uppercase', color: 'var(--nav-text-muted)' }}>{g.title}</div>
            {g.items.map((it) => (
              <NavItem key={it.id} icon={it.icon} label={it.label} count={it.count} active={it.id === activeId} onClick={() => onSelect && onSelect(it.id)} />
            ))}
          </div>
        ))}
      </nav>
      {footer || (user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px 18px', borderTop: '1px solid var(--navy-800)' }}>
          <Avatar name={user.name} src={user.src} size={34} status={user.status || 'online'} ringColor="var(--nav-bg)" />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-medium)', color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--nav-text-muted)' }}>{user.statusLabel || 'Online'}</div>
          </div>
        </div>
      ) : null)}
    </aside>
  );
}
