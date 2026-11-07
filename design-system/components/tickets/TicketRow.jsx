import React from 'react';
import { Avatar } from '../core/Avatar.jsx';
import { Tag } from '../core/Tag.jsx';

export function TicketRow({ name, avatarSrc, subject, preview, time, tags = [], selected = false, unread = false, compact = false, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick && onClick(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex',
        gap: 12,
        padding: compact ? '14px 14px' : '12px 14px',
        borderRadius: 'var(--radius-md)',
        background: selected ? 'var(--surface-selected)' : hover ? 'var(--surface-hover)' : 'transparent',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        transition: 'background var(--duration-fast) var(--ease-standard)',
        outline: 'none',
        ...style,
      }}
    >
      {selected ? <span style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 2.5, borderRadius: 2, background: 'var(--blue-500)' }}></span> : null}
      <Avatar name={name} src={avatarSrc} size={compact ? 40 : 36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ flex: 1, minWidth: 0, fontSize: compact ? 'var(--text-md)' : 'var(--text-base)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
          <span style={{ fontSize: 'var(--text-xs)', color: unread ? 'var(--blue-500)' : 'var(--text-subtle)', fontWeight: unread ? 'var(--weight-semibold)' : 'var(--weight-regular)', whiteSpace: 'nowrap' }}>{time}</span>
        </div>
        <div style={{ marginTop: 2, fontSize: compact ? 'var(--text-base)' : 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--ink-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subject}</div>
        {preview && !compact ? <div style={{ marginTop: 2, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{preview}</div> : null}
        {tags.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: compact ? 10 : 8 }}>
            {tags.map((t, i) => <Tag key={i} tone={t.tone} size={compact ? 'md' : 'sm'}>{t.label}</Tag>)}
          </div>
        ) : null}
      </div>
      {unread ? <span style={{ position: 'absolute', right: 14, bottom: 16, width: 7, height: 7, borderRadius: '50%', background: 'var(--blue-500)' }}></span> : null}
    </div>
  );
}
