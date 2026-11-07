import React from 'react';

export function DetailRow({ label, children, labelWidth = 92, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 28, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', ...style }}>
      <span style={{ width: labelWidth, flexShrink: 0, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-800)' }}>{children}</span>
    </div>
  );
}
