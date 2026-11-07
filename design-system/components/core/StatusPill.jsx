import React from 'react';
import { Icon } from './Icon.jsx';

const TONES = {
  danger: { bg: 'var(--danger-bg)', fg: 'var(--danger-text)', dot: 'var(--danger)' },
  attention: { bg: 'var(--attention-bg)', fg: 'var(--attention-text)', dot: 'var(--attention)' },
  positive: { bg: 'var(--positive-bg)', fg: 'var(--positive-text)', dot: 'var(--positive)' },
  info: { bg: 'var(--info-bg)', fg: 'var(--info-text)', dot: 'var(--info)' },
  neutral: { bg: 'var(--ink-100)', fg: 'var(--ink-600)', dot: 'var(--ink-400)' },
};

export const STATUS_TONE = { open: 'danger', pending: 'attention', solved: 'positive', closed: 'neutral', new: 'info' };

export function StatusPill({ children, tone = 'neutral', dot = false, icon, plain = false, style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height: 20,
        padding: plain ? 0 : '0 8px',
        borderRadius: 'var(--radius-xs)',
        background: plain ? 'transparent' : t.bg,
        color: plain ? 'var(--ink-800)' : t.fg,
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-medium)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {dot ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.dot, flexShrink: 0 }}></span> : null}
      {icon ? <Icon name={icon} size={12} strokeWidth={2} /> : null}
      {children}
    </span>
  );
}
