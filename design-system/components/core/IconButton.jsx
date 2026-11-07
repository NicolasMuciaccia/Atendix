import React from 'react';
import { Icon } from './Icon.jsx';

const SIZES = { sm: { box: 26, icon: 14, radius: 'var(--radius-sm)' }, md: { box: 32, icon: 16, radius: 'var(--radius-md)' }, lg: { box: 40, icon: 20, radius: 'var(--radius-md)' } };

const VARIANTS = {
  ghost: { bg: 'transparent', hover: 'var(--surface-hover)', fg: 'var(--ink-600)', border: 'transparent' },
  outline: { bg: 'var(--white)', hover: 'var(--surface-hover)', fg: 'var(--ink-700)', border: 'var(--border-default)' },
  solid: { bg: 'var(--action-primary)', hover: 'var(--action-primary-hover)', fg: 'var(--white)', border: 'transparent' },
  inverse: { bg: 'transparent', hover: 'var(--nav-item-hover)', fg: 'var(--nav-text-muted)', border: 'transparent' },
};

export function IconButton({ icon, label, variant = 'ghost', size = 'md', round = false, active = false, disabled = false, onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.ghost;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: s.box,
        height: s.box,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        borderRadius: round ? 'var(--radius-full)' : s.radius,
        border: '1px solid ' + v.border,
        background: (hover || active) && !disabled ? v.hover : v.bg,
        color: active && variant !== 'solid' ? 'var(--text-accent)' : v.fg,
        boxShadow: variant === 'outline' ? 'var(--shadow-xs)' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'background var(--duration-fast) var(--ease-standard)',
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={s.icon} />
    </button>
  );
}
