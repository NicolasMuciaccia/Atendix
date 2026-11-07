import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Checkbox({ checked, defaultChecked = false, onChange, label, disabled = false, style }) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : inner;
  const toggle = () => { if (disabled) return; setInner(!on); onChange && onChange(!on); };
  return (
    <label
      onClick={(e) => { e.preventDefault(); toggle(); }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--ink-600)', userSelect: 'none', ...style }}
    >
      <span
        role="checkbox"
        aria-checked={on}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } }}
        style={{
          width: 15,
          height: 15,
          borderRadius: 4,
          border: '1px solid ' + (on ? 'var(--blue-500)' : 'var(--ink-300)'),
          background: on ? 'var(--blue-500)' : 'var(--white)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--white)',
          flexShrink: 0,
          transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
        }}
      >
        {on ? <Icon name="check" size={11} strokeWidth={3} /> : null}
      </span>
      {label}
    </label>
  );
}
