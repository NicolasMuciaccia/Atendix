import React from 'react';

const TONES = {
  default: { bg: 'var(--surface-card)', border: 'var(--border-subtle)', fg: 'inherit' },
  subtle: { bg: 'var(--bg-subtle)', border: 'var(--blue-100)', fg: 'inherit' },
  muted: { bg: 'var(--surface-muted)', border: 'var(--border-subtle)', fg: 'inherit' },
  inverse: { bg: 'var(--surface-inverse)', border: 'transparent', fg: 'var(--text-inverse)' },
};
const PAD = { none: 0, sm: 12, md: 16, lg: 24, xl: 32 };
const RADIUS = { md: 'var(--radius-md)', lg: 'var(--radius-lg)', xl: 'var(--radius-xl)', '2xl': 'var(--radius-2xl)' };
const ELEV = { none: 'none', xs: 'var(--shadow-xs)', sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)' };

export function Card({ tone = 'default', padding = 'md', radius = 'lg', elevation = 'sm', interactive = false, onClick, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const t = TONES[tone] || TONES.default;
  return (
    <div
      onClick={onClick}
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      style={{
        background: t.bg,
        color: t.fg,
        border: '1px solid ' + t.border,
        borderRadius: RADIUS[radius] || radius,
        padding: typeof padding === 'number' ? padding : PAD[padding],
        boxShadow: interactive && hover ? 'var(--shadow-md)' : ELEV[elevation],
        transform: interactive && hover ? 'translateY(-1px)' : 'none',
        transition: 'box-shadow var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
        cursor: interactive ? 'pointer' : undefined,
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
