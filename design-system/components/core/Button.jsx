import React from 'react';
import { Icon } from './Icon.jsx';

const SIZES = {
  sm: { height: 'var(--control-sm)', padding: '0 10px', fontSize: 'var(--text-sm)', gap: 6, radius: 'var(--radius-sm)', icon: 14 },
  md: { height: 'var(--control-md)', padding: '0 14px', fontSize: 'var(--text-base)', gap: 8, radius: 'var(--radius-md)', icon: 15 },
  lg: { height: 'var(--control-lg)', padding: '0 18px', fontSize: 'var(--text-md)', gap: 8, radius: 'var(--radius-md)', icon: 17 },
};

const VARIANTS = {
  primary: { bg: 'var(--action-primary)', hover: 'var(--action-primary-hover)', press: 'var(--action-primary-press)', fg: 'var(--white)', border: 'transparent', shadow: 'var(--shadow-xs)' },
  accent: { bg: 'var(--action-accent)', hover: 'var(--action-accent-hover)', press: 'var(--action-accent-press)', fg: 'var(--white)', border: 'transparent', shadow: 'var(--shadow-xs)' },
  secondary: { bg: 'var(--white)', hover: 'var(--surface-hover)', press: 'var(--ink-100)', fg: 'var(--ink-800)', border: 'var(--border-default)', shadow: 'var(--shadow-xs)' },
  ghost: { bg: 'transparent', hover: 'var(--surface-hover)', press: 'var(--ink-100)', fg: 'var(--ink-700)', border: 'transparent', shadow: 'none' },
  danger: { bg: 'var(--danger-bg)', hover: 'var(--red-100)', press: 'var(--red-100)', fg: 'var(--danger-text)', border: 'transparent', shadow: 'none' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const bg = disabled ? v.bg : press ? v.press : hover ? v.hover : v.bg;
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        borderRadius: s.radius,
        border: '1px solid ' + v.border,
        background: bg,
        color: v.fg,
        boxShadow: v.shadow,
        fontFamily: 'var(--font-sans)',
        fontSize: s.fontSize,
        fontWeight: 'var(--weight-semibold)',
        lineHeight: 1,
        letterSpacing: '-0.005em',
        whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transform: press && !disabled ? 'scale(0.98)' : 'none',
        transition: 'background var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      {iconLeft ? <Icon name={iconLeft} size={s.icon} strokeWidth={2} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={s.icon} strokeWidth={2} /> : null}
    </button>
  );
}
