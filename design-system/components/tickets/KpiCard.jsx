import React from 'react';
import { Icon } from '../core/Icon.jsx';

const TILES = {
  blue: { bg: 'var(--tile-blue-bg)', fg: 'var(--tile-blue-fg)' },
  amber: { bg: 'var(--tile-amber-bg)', fg: 'var(--tile-amber-fg)' },
  green: { bg: 'var(--tile-green-bg)', fg: 'var(--tile-green-fg)' },
  violet: { bg: 'var(--violet-50)', fg: 'var(--violet-500)' },
};

function Spark({ data, kind, w = 76, h = 34 }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  if (kind === 'bars') {
    const gap = 3, bw = (w - gap * (data.length - 1)) / data.length;
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
        {data.map((v, i) => {
          const bh = Math.max(3, (v / max) * h);
          return <rect key={i} x={i * (bw + gap)} y={h - bh} width={bw} height={bh} rx={1.5} fill={i >= data.length - 2 ? 'var(--blue-300)' : 'var(--blue-200)'} />;
        })}
      </svg>
    );
  }
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / (max - min || 1)) * (h - 6)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const gid = 'kpi-g-' + data.join('-');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--blue-300)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--blue-300)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={line + ` L${w} ${h} L0 ${h} Z`} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke="var(--blue-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function KpiCard({ icon = 'mail', tone = 'blue', label, value, delta, direction = 'up', sentiment = 'positive', chart, data, onClick, style }) {
  const t = TILES[tone] || TILES.blue;
  const good = sentiment === 'positive';
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 16px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xs)',
        fontFamily: 'var(--font-sans)',
        minWidth: 0,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: t.bg, color: t.fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={20} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
          {delta ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, height: 18, padding: '0 6px', borderRadius: 'var(--radius-xs)', background: good ? 'var(--positive-bg)' : 'var(--danger-bg)', color: good ? 'var(--positive-text)' : 'var(--danger-text)', fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-semibold)' }}>
              <Icon name={direction === 'down' ? 'arrow-down' : 'arrow-up'} size={10} strokeWidth={2.4} />
              {delta}
            </span>
          ) : null}
        </div>
      </div>
      {chart ? <Spark data={data} kind={chart} /> : null}
    </div>
  );
}
