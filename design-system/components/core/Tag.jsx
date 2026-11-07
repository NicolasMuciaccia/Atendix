import React from 'react';
import { Icon } from './Icon.jsx';

const TONES = {
  high: { bg: 'var(--priority-high-bg)', fg: 'var(--priority-high-text)' },
  medium: { bg: 'var(--priority-medium-bg)', fg: 'var(--priority-medium-text)' },
  low: { bg: 'var(--priority-low-bg)', fg: 'var(--priority-low-text)' },
  neutral: { bg: 'var(--tag-neutral-bg)', fg: 'var(--tag-neutral-text)' },
  violet: { bg: 'var(--tag-violet-bg)', fg: 'var(--tag-violet-text)' },
  blue: { bg: 'var(--tag-blue-bg)', fg: 'var(--tag-blue-text)' },
};

export function Tag({ children, tone = 'neutral', size = 'sm', icon, onClick, onRemove, style }) {
  const t = TONES[tone] || TONES.neutral;
  const md = size === 'md';
  const Comp = onClick ? 'button' : 'span';
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: md ? 24 : 20,
        padding: md ? '0 9px' : '0 7px',
        borderRadius: 'var(--radius-xs)',
        border: 0,
        background: t.bg,
        color: t.fg,
        fontFamily: 'var(--font-sans)',
        fontSize: md ? 'var(--text-sm)' : 'var(--text-xs)',
        fontWeight: 'var(--weight-medium)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={md ? 12 : 11} strokeWidth={2} /> : null}
      {children}
      {onRemove ? (
        <span role="button" aria-label="Remover" onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{ display: 'inline-flex', marginRight: -2, cursor: 'pointer', opacity: 0.7 }}>
          <Icon name="x" size={md ? 12 : 11} strokeWidth={2} />
        </span>
      ) : null}
    </Comp>
  );
}
