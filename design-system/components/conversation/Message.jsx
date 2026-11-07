import React from 'react';
import { Avatar } from '../core/Avatar.jsx';
import { Icon } from '../core/Icon.jsx';

const ROLES = {
  customer: { bg: 'var(--surface-message)', border: 'transparent' },
  agent: { bg: 'var(--surface-message-agent)', border: 'transparent' },
  note: { bg: 'var(--attention-bg)', border: 'var(--amber-100)' },
};

export function Message({ author, avatarSrc, time, role = 'customer', noteLabel = 'Nota interna', children, style }) {
  const r = ROLES[role] || ROLES.customer;
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontFamily: 'var(--font-sans)', ...style }}>
      <Avatar name={author} src={avatarSrc} size={32} />
      <div style={{ flex: 1, minWidth: 0, padding: '12px 16px 14px', background: r.bg, border: '1px solid ' + r.border, borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{author}</span>
          {time ? <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>{time}</span> : null}
          {role === 'note' ? (
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--attention-text)' }}>
              <Icon name="lock" size={11} strokeWidth={2} />
              {noteLabel}
            </span>
          ) : null}
        </div>
        <div style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', color: 'var(--ink-700)', textWrap: 'pretty' }}>{children}</div>
      </div>
    </div>
  );
}
