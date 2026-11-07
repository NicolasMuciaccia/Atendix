import React from 'react';
import { Icon } from './Icon.jsx';

export function TextLink({ href, onClick, children, arrow = false, size = 'sm', style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href || '#'}
      onClick={(e) => { if (!href) e.preventDefault(); onClick && onClick(e); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        color: hover ? 'var(--text-link-hover)' : 'var(--text-link)',
        fontFamily: 'var(--font-sans)',
        fontSize: size === 'md' ? 'var(--text-base)' : 'var(--text-sm)',
        fontWeight: 'var(--weight-medium)',
        textDecoration: 'none',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
      {arrow ? <Icon name="arrow-right" size={13} strokeWidth={2} style={{ transform: hover ? 'translateX(2px)' : 'none', transition: 'transform var(--duration-fast) var(--ease-standard)' }} /> : null}
    </a>
  );
}
