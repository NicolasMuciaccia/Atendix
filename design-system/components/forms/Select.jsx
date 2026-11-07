import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Select({ options = [], value, defaultValue, onChange, placeholder = 'Selecionar', size = 'sm', label, fullWidth = true, disabled = false, style }) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(defaultValue);
  const [hoverIdx, setHoverIdx] = React.useState(-1);
  const ref = React.useRef(null);
  const current = value !== undefined ? value : inner;
  const selected = options.find((o) => o.value === current);
  const h = size === 'md' ? 'var(--control-md)' : 26;

  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const pick = (o) => { setInner(o.value); onChange && onChange(o.value, o); setOpen(false); };
  const lead = (o) => o.avatar ? o.avatar : o.dot ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: o.dot, flexShrink: 0 }}></span> : o.icon ? <Icon name={o.icon} size={13} color="var(--ink-500)" /> : null;

  return (
    <div ref={ref} style={{ position: 'relative', display: fullWidth ? 'flex' : 'inline-flex', flexDirection: 'column', gap: 6, width: fullWidth ? '100%' : undefined, fontFamily: 'var(--font-sans)', ...style }}>
      {label ? <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--ink-700)' }}>{label}</span> : null}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          height: h,
          padding: '0 8px',
          width: '100%',
          background: 'var(--white)',
          border: '1px solid ' + (open ? 'var(--border-focus)' : 'var(--border-default)'),
          boxShadow: open ? 'var(--focus-ring)' : 'none',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'inherit',
          fontSize: size === 'md' ? 'var(--text-base)' : 'var(--text-xs)',
          fontWeight: 'var(--weight-medium)',
          color: selected ? 'var(--ink-800)' : 'var(--text-subtle)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          transition: 'border-color var(--duration-fast) var(--ease-standard)',
        }}
      >
        {selected ? lead(selected) : null}
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected ? selected.label : placeholder}</span>
        <Icon name="chevron-down" size={13} color="var(--ink-400)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-fast) var(--ease-standard)' }} />
      </button>
      {open ? (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            minWidth: 160,
            zIndex: 'var(--z-dropdown)',
            background: 'var(--white)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            padding: 4,
          }}
        >
          {options.map((o, i) => (
            <div
              key={o.value}
              role="option"
              aria-selected={o.value === current}
              onClick={() => pick(o)}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(-1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: 30,
                padding: '0 8px',
                borderRadius: 'var(--radius-sm)',
                background: hoverIdx === i ? 'var(--surface-hover)' : 'transparent',
                fontSize: 'var(--text-sm)',
                color: 'var(--ink-800)',
                cursor: 'pointer',
              }}
            >
              {lead(o)}
              <span style={{ flex: 1 }}>{o.label}</span>
              {o.value === current ? <Icon name="check" size={13} color="var(--blue-500)" strokeWidth={2.2} /> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
