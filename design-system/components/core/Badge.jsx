import React from 'react';

const TONES = {
  neutral: { bg: 'var(--ink-100)', fg: 'var(--ink-600)' },
  accent: { bg: 'var(--blue-100)', fg: 'var(--blue-600)' },
  solid: { bg: 'var(--blue-500)', fg: 'var(--white)' },
  nav: { bg: 'var(--nav-badge-bg)', fg: 'var(--navy-300)' },
  navActive: { bg: 'var(--white)', fg: 'var(--navy-900)' },
  danger: { bg: 'var(--red-500)', fg: 'var(--white)' },
};

export function Badge({ children, tone = 'neutral', size = 'md', ring, style }) {
  const t = TONES[tone] || TONES.neutral;
  const h = size === 'sm' ? 16 : 18;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: h,
        height: h,
        padding: '0 6px',
        borderRadius: 'var(--radius-full)',
        background: t.bg,
        color: t.fg,
        fontFamily: 'var(--font-sans)',
        fontSize: size === 'sm' ? 'var(--text-2xs)' : 'var(--text-xs)',
        fontWeight: 'var(--weight-semibold)',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
        boxShadow: ring ? '0 0 0 2px ' + ring : 'none',
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
