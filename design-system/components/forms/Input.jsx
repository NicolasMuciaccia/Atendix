import React from 'react';
import { Icon } from '../core/Icon.jsx';

const SIZES = { sm: { h: 'var(--control-sm)', fs: 'var(--text-sm)', icon: 14 }, md: { h: 'var(--control-md)', fs: 'var(--text-sm)', icon: 15 }, lg: { h: 'var(--control-lg)', fs: 'var(--text-md)', icon: 17 } };

export function Input({ label, hint, error, icon, trailing, size = 'md', value, defaultValue, onChange, placeholder, type = 'text', disabled = false, fullWidth = true, id, style, inputStyle, onFocus, onBlur, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const autoId = React.useId ? React.useId() : undefined;
  const inputId = id || autoId;
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  return (
    <label htmlFor={inputId} style={{ display: fullWidth ? 'flex' : 'inline-flex', flexDirection: 'column', gap: 6, width: fullWidth ? '100%' : undefined, fontFamily: 'var(--font-sans)', ...style }}>
      {label ? <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--ink-700)' }}>{label}</span> : null}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: s.h,
          padding: '0 10px',
          background: disabled ? 'var(--surface-muted)' : 'var(--white)',
          border: '1px solid ' + borderColor,
          borderRadius: 'var(--radius-md)',
          boxShadow: focus ? (error ? '0 0 0 3px rgba(229,72,77,.18)' : 'var(--focus-ring)') : 'none',
          transition: 'border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)',
        }}
      >
        {icon ? <Icon name={icon} size={s.icon} color="var(--ink-400)" /> : null}
        <input
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={(e) => { setFocus(true); onFocus && onFocus(e); }}
          onBlur={(e) => { setFocus(false); onBlur && onBlur(e); }}
          style={{ flex: 1, minWidth: 0, height: '100%', border: 0, outline: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: s.fs, color: 'var(--text-strong)', padding: 0, ...inputStyle }}
          {...rest}
        />
        {trailing || null}
      </span>
      {error || hint ? <span style={{ fontSize: 'var(--text-xs)', color: error ? 'var(--danger-text)' : 'var(--text-muted)' }}>{error || hint}</span> : null}
    </label>
  );
}
